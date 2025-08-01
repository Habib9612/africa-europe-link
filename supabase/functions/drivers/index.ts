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

    if (!profile || !['admin', 'carrier', 'fleet_manager'].includes(profile.role)) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const driverId = pathParts[pathParts.length - 1];

    switch (req.method) {
      case 'GET':
        if (driverId && driverId !== 'drivers') {
          // Get specific driver
          const { data: driver, error } = await supabase
            .from('drivers')
            .select(`
              *,
              profiles!drivers_user_id_fkey(full_name, avatar_url),
              vehicles(id, make, model, license_plate),
              performance_metrics(*)
            `)
            .eq('id', driverId)
            .eq('company_id', profile.company_id)
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(driver),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Get all drivers
          const { data: drivers, error } = await supabase
            .from('drivers')
            .select(`
              *,
              profiles!drivers_user_id_fkey(full_name, avatar_url),
              vehicles(id, make, model, license_plate)
            `)
            .eq('company_id', profile.company_id);

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(drivers),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'POST':
        if (url.pathname.includes('/assign-vehicle')) {
          // Assign vehicle to driver
          const { vehicle_id } = await req.json();
          
          const { data, error } = await supabase
            .from('drivers')
            .update({ current_vehicle_id: vehicle_id })
            .eq('id', driverId)
            .eq('company_id', profile.company_id)
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
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (url.pathname.includes('/update-location')) {
          // Update driver location
          const { latitude, longitude } = await req.json();
          
          const { data, error } = await supabase
            .from('driver_locations')
            .insert({
              driver_id: driverId,
              latitude,
              longitude,
              timestamp: new Date().toISOString()
            });

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
        } else {
          // Create new driver
          const driverData = await req.json();
          
          const { data, error } = await supabase
            .from('drivers')
            .insert({
              ...driverData,
              company_id: profile.company_id,
              created_by: user.id
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
        }

      case 'PUT':
        // Update driver
        const updateData = await req.json();
        
        const { data, error } = await supabase
          .from('drivers')
          .update(updateData)
          .eq('id', driverId)
          .eq('company_id', profile.company_id)
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
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in drivers function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});