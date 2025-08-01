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
    const customerId = pathParts[pathParts.length - 1];

    switch (req.method) {
      case 'GET':
        if (customerId && customerId !== 'customers') {
          // Get specific customer
          let query = supabase
            .from('customers')
            .select(`
              *,
              shipments(id, status, pickup_date, delivery_date, rate)
            `)
            .eq('id', customerId);

          // Role-based filtering
          if (profile.role === 'shipper') {
            query = query.eq('user_id', user.id);
          } else if (profile.role === 'carrier' && profile.company_id) {
            query = query.eq('company_id', profile.company_id);
          }

          const { data: customer, error } = await query.single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(customer),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Get all customers
          let query = supabase
            .from('customers')
            .select(`
              *,
              shipments(count)
            `);

          // Role-based filtering
          if (profile.role === 'shipper') {
            query = query.eq('user_id', user.id);
          } else if (profile.role === 'carrier' && profile.company_id) {
            query = query.eq('company_id', profile.company_id);
          }

          const { data: customers, error } = await query;

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(customers),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'POST':
        // Create new customer
        const customerData = await req.json();
        
        const { data, error } = await supabase
          .from('customers')
          .insert({
            ...customerData,
            user_id: user.id,
            company_id: profile.company_id
          })
          .select()
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(data),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'PUT':
        // Update customer
        const updateData = await req.json();
        
        let updateQuery = supabase
          .from('customers')
          .update(updateData)
          .eq('id', customerId);

        // Role-based filtering
        if (profile.role === 'shipper') {
          updateQuery = updateQuery.eq('user_id', user.id);
        } else if (profile.role === 'carrier' && profile.company_id) {
          updateQuery = updateQuery.eq('company_id', profile.company_id);
        }

        const { data, error } = await updateQuery.select().single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'DELETE':
        // Delete customer
        let deleteQuery = supabase
          .from('customers')
          .delete()
          .eq('id', customerId);

        // Role-based filtering
        if (profile.role === 'shipper') {
          deleteQuery = deleteQuery.eq('user_id', user.id);
        } else if (profile.role === 'carrier' && profile.company_id) {
          deleteQuery = deleteQuery.eq('company_id', profile.company_id);
        }

        const { error } = await deleteQuery;

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in customers function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});