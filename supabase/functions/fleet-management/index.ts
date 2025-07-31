import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseService.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const url = new URL(req.url);
    const method = req.method;
    const resource = url.pathname.split('/').pop();

    // Get user profile to check role
    const { data: profile } = await supabaseService
      .from("profiles")
      .select("role, company_id")
      .eq("user_id", user.id)
      .single();

    if (!profile || !["carrier", "admin"].includes(profile.role)) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    switch (method) {
      case "GET":
        if (resource === "vehicles") {
          const { data: vehicles, error } = await supabaseService
            .from("vehicles")
            .select("*")
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          return new Response(JSON.stringify({ vehicles }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (resource === "drivers") {
          const { data: drivers, error } = await supabaseService
            .from("profiles")
            .select("*")
            .eq("role", "driver")
            .eq("company_id", profile.company_id)
            .order("created_at", { ascending: false });

          if (error) throw error;
          return new Response(JSON.stringify({ drivers }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;

      case "POST":
        const body = await req.json();
        
        if (resource === "vehicles") {
          const vehicleData = {
            ...body,
            owner_id: user.id,
            company_id: profile.company_id
          };

          const { data: vehicle, error } = await supabaseService
            .from("vehicles")
            .insert(vehicleData)
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ vehicle }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 201,
          });
        } else if (resource === "assign") {
          const { vehicle_id, shipment_id, driver_id } = body;
          
          // Update vehicle assignment
          const { error: vehicleError } = await supabaseService
            .from("vehicles")
            .update({ 
              status: "in_transit",
              updated_at: new Date().toISOString()
            })
            .eq("id", vehicle_id)
            .eq("owner_id", user.id);

          if (vehicleError) throw vehicleError;

          // Update shipment status
          const { error: shipmentError } = await supabaseService
            .from("shipments")
            .update({ 
              status: "in_transit",
              updated_at: new Date().toISOString()
            })
            .eq("id", shipment_id);

          if (shipmentError) throw shipmentError;

          // Create tracking event
          await supabaseService.from("tracking_events").insert({
            shipment_id,
            event_type: "in_transit",
            description: "Vehicle assigned and shipment started",
            location: "Departure location"
          });

          return new Response(JSON.stringify({ message: "Assignment successful" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;

      case "PUT":
        const updateBody = await req.json();
        const itemId = url.searchParams.get("id");
        
        if (resource === "vehicles") {
          const { data: updated, error } = await supabaseService
            .from("vehicles")
            .update({ 
              ...updateBody,
              updated_at: new Date().toISOString()
            })
            .eq("id", itemId)
            .eq("owner_id", user.id)
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ vehicle: updated }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;

      case "DELETE":
        const deleteId = url.searchParams.get("id");
        
        if (resource === "vehicles") {
          const { error } = await supabaseService
            .from("vehicles")
            .delete()
            .eq("id", deleteId)
            .eq("owner_id", user.id);

          if (error) throw error;

          return new Response(JSON.stringify({ message: "Vehicle deleted" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 405,
        });
    }
  } catch (error) {
    console.error("Fleet management API error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});