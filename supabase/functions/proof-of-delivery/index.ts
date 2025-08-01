import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const podId = pathParts[pathParts.length - 1];

    switch (req.method) {
      case 'GET':
        if (podId && podId !== 'proof-of-delivery') {
          // Get specific POD
          let query = supabase
            .from('proof_of_delivery')
            .select(`
              *,
              shipments(id, origin_city, destination_city, status)
            `)
            .eq('id', podId);

          // Role-based filtering
          if (profile.role === 'shipper') {
            query = query.eq('shipments.shipper_id', user.id);
          } else if (profile.role === 'carrier' && profile.company_id) {
            query = query.eq('shipments.carrier_id', user.id);
          }

          const { data: pod, error } = await query.single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(pod),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Get all PODs
          let query = supabase
            .from('proof_of_delivery')
            .select(`
              *,
              shipments(id, origin_city, destination_city, status)
            `);

          // Role-based filtering
          if (profile.role === 'shipper') {
            query = query.eq('shipments.shipper_id', user.id);
          } else if (profile.role === 'carrier' && profile.company_id) {
            query = query.eq('shipments.carrier_id', user.id);
          }

          const { data: pods, error } = await query.order('delivered_at', { ascending: false });

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(pods),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'POST':
        // Create POD
        const podData = await req.json();
        
        const { data, error } = await supabase
          .from('proof_of_delivery')
          .insert({
            ...podData,
            driver_id: user.id,
            delivered_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update shipment status to delivered
        await supabase
          .from('shipments')
          .update({ status: 'delivered' })
          .eq('id', podData.shipment_id);

        return new Response(
          JSON.stringify(data),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'PUT':
        // Update POD
        const updateData = await req.json();
        
        const { data: updatedPod, error: updateError } = await supabase
          .from('proof_of_delivery')
          .update(updateData)
          .eq('id', podId)
          .select()
          .single();

        if (updateError) {
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(updatedPod),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in proof-of-delivery function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});