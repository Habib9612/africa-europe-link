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

    switch (method) {
      case "GET":
        const shipmentId = url.searchParams.get("shipment_id");
        
        if (!shipmentId) {
          return new Response(JSON.stringify({ error: "Shipment ID required" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          });
        }

        // Get tracking events for shipment
        const { data: events, error: eventsError } = await supabaseService
          .from("tracking_events")
          .select("*")
          .eq("shipment_id", shipmentId)
          .order("created_at", { ascending: true });

        if (eventsError) throw eventsError;

        // Get current shipment details
        const { data: shipment, error: shipmentError } = await supabaseService
          .from("shipments")
          .select(`
            *,
            shipper:profiles!shipper_id (full_name),
            carrier:profiles!carrier_id (full_name)
          `)
          .eq("id", shipmentId)
          .single();

        if (shipmentError) throw shipmentError;

        // Get latest driver location if available
        const { data: location, error: locationError } = await supabaseService
          .from("driver_locations")
          .select("*")
          .eq("shipment_id", shipmentId)
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle();

        return new Response(JSON.stringify({ 
          shipment,
          events,
          current_location: location
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "POST":
        const body = await req.json();
        const action = url.searchParams.get("action");

        if (action === "update_location") {
          // Update driver location
          const { shipment_id, latitude, longitude, address } = body;
          
          const { data: location, error } = await supabaseService
            .from("driver_locations")
            .insert({
              driver_id: user.id,
              shipment_id,
              latitude,
              longitude,
              address,
              timestamp: new Date().toISOString()
            })
            .select()
            .single();

          if (error) throw error;

          // Create tracking event
          await supabaseService.from("tracking_events").insert({
            shipment_id,
            event_type: "location_update",
            description: `Location updated: ${address}`,
            location: address,
            latitude,
            longitude
          });

          return new Response(JSON.stringify({ location }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (action === "update_status") {
          const { shipment_id, status, description, location } = body;
          
          // Update shipment status
          const { error: shipmentError } = await supabaseService
            .from("shipments")
            .update({ 
              status,
              updated_at: new Date().toISOString()
            })
            .eq("id", shipment_id);

          if (shipmentError) throw shipmentError;

          // Create tracking event
          const { data: event, error: eventError } = await supabaseService
            .from("tracking_events")
            .insert({
              shipment_id,
              event_type: status,
              description: description || `Status updated to ${status}`,
              location
            })
            .select()
            .single();

          if (eventError) throw eventError;

          // Get shipment details for notification
          const { data: shipment } = await supabaseService
            .from("shipments")
            .select("shipper_id, carrier_id")
            .eq("id", shipment_id)
            .single();

          // Create notifications for relevant parties
          const notifications = [];
          if (shipment?.shipper_id) {
            notifications.push({
              user_id: shipment.shipper_id,
              type: "shipment_update",
              title: "Shipment Update",
              message: `Your shipment status has been updated to: ${status}`,
              related_id: shipment_id
            });
          }

          if (notifications.length > 0) {
            await supabaseService.from("notifications").insert(notifications);
          }

          return new Response(JSON.stringify({ event }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Create general tracking event
          const { shipment_id, event_type, description, location, latitude, longitude } = body;
          
          const { data: event, error } = await supabaseService
            .from("tracking_events")
            .insert({
              shipment_id,
              event_type,
              description,
              location,
              latitude,
              longitude
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ event }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 201,
          });
        }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 405,
        });
    }
  } catch (error) {
    console.error("Tracking API error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});