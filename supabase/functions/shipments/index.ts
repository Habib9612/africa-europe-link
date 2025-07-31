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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const url = new URL(req.url);
    const method = req.method;
    const path = url.pathname.split('/').pop();

    switch (method) {
      case "GET":
        if (path === "available") {
          // Get available shipments for carriers
          const { data: shipments, error } = await supabaseService
            .from("shipments")
            .select(`
              *,
              profiles:shipper_id (full_name, avatar_url)
            `)
            .eq("status", "posted")
            .order("created_at", { ascending: false });

          if (error) throw error;
          return new Response(JSON.stringify({ shipments }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get user's shipments
          const { data: profile } = await supabaseService
            .from("profiles")
            .select("role")
            .eq("user_id", user.id)
            .single();

          let query = supabaseService.from("shipments").select(`
            *,
            shipper:profiles!shipper_id (full_name, avatar_url),
            carrier:profiles!carrier_id (full_name, avatar_url)
          `);

          if (profile?.role === "shipper") {
            query = query.eq("shipper_id", user.id);
          } else if (profile?.role === "carrier") {
            query = query.eq("carrier_id", user.id);
          } else if (profile?.role !== "admin") {
            return new Response(JSON.stringify({ error: "Access denied" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 403,
            });
          }

          const { data: shipments, error } = await query.order("created_at", { ascending: false });
          
          if (error) throw error;
          return new Response(JSON.stringify({ shipments }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const body = await req.json();
        
        if (path === "book") {
          // Book a shipment (carrier books shipper's load)
          const { shipment_id } = body;
          
          const { data: updated, error } = await supabaseService
            .from("shipments")
            .update({ 
              carrier_id: user.id, 
              status: "assigned",
              updated_at: new Date().toISOString()
            })
            .eq("id", shipment_id)
            .eq("status", "posted")
            .select()
            .single();

          if (error) throw error;

          // Create notification
          await supabaseService.from("notifications").insert({
            user_id: updated.shipper_id,
            type: "shipment_assigned",
            title: "Shipment Assigned",
            message: `Your shipment has been assigned to a carrier`,
            related_id: shipment_id
          });

          return new Response(JSON.stringify({ shipment: updated }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Create new shipment
          const shipmentData = {
            ...body,
            shipper_id: user.id,
            status: "posted"
          };

          const { data: shipment, error } = await supabaseService
            .from("shipments")
            .insert(shipmentData)
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ shipment }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 201,
          });
        }

      case "PUT":
        const updateBody = await req.json();
        const shipmentId = url.searchParams.get("id");
        
        const { data: updated, error } = await supabaseService
          .from("shipments")
          .update({ 
            ...updateBody,
            updated_at: new Date().toISOString()
          })
          .eq("id", shipmentId)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ shipment: updated }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 405,
        });
    }
  } catch (error) {
    console.error("Shipments API error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});