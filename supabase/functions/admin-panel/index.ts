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

    // Check if user is admin
    const { data: profile } = await supabaseService
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    const url = new URL(req.url);
    const method = req.method;
    const resource = url.pathname.split('/').pop();

    switch (method) {
      case "GET":
        if (resource === "dashboard") {
          // Get dashboard analytics
          const analytics = await getDashboardAnalytics(supabaseService);
          return new Response(JSON.stringify(analytics), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (resource === "users") {
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "20");
          const offset = (page - 1) * limit;
          
          const { data: users, error } = await supabaseService
            .from("profiles")
            .select(`
              *,
              companies:company_id (name)
            `)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (error) throw error;

          const { count } = await supabaseService
            .from("profiles")
            .select("*", { count: "exact", head: true });

          return new Response(JSON.stringify({ 
            users,
            pagination: {
              page,
              limit,
              total: count || 0,
              pages: Math.ceil((count || 0) / limit)
            }
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (resource === "shipments") {
          const status = url.searchParams.get("status");
          const page = parseInt(url.searchParams.get("page") || "1");
          const limit = parseInt(url.searchParams.get("limit") || "20");
          const offset = (page - 1) * limit;

          let query = supabaseService
            .from("shipments")
            .select(`
              *,
              shipper:profiles!shipper_id (full_name),
              carrier:profiles!carrier_id (full_name)
            `)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (status) {
            query = query.eq("status", status);
          }

          const { data: shipments, error } = await query;
          if (error) throw error;

          return new Response(JSON.stringify({ shipments }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (resource === "companies") {
          const { data: companies, error } = await supabaseService
            .from("companies")
            .select(`
              *,
              owner:profiles!owner_id (full_name)
            `)
            .order("created_at", { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify({ companies }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (resource === "system-logs") {
          const { data: logs, error } = await supabaseService
            .from("system_logs")
            .select("*")
            .order("timestamp", { ascending: false })
            .limit(100);

          if (error) throw error;

          return new Response(JSON.stringify({ logs }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        break;

      case "POST":
        const body = await req.json();
        
        if (resource === "users") {
          const action = url.searchParams.get("action");
          
          if (action === "flag") {
            const { user_id, reason } = body;
            
            // Create system log
            await supabaseService.from("system_logs").insert({
              level: "warning",
              message: `User flagged by admin`,
              metadata: { user_id, reason, flagged_by: user.id }
            });

            return new Response(JSON.stringify({ message: "User flagged" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          } else if (action === "suspend") {
            const { user_id, duration_days, reason } = body;
            
            // In a real implementation, you'd update user status
            await supabaseService.from("system_logs").insert({
              level: "warning",
              message: `User suspended by admin`,
              metadata: { 
                user_id, 
                duration_days, 
                reason, 
                suspended_by: user.id,
                suspended_until: new Date(Date.now() + duration_days * 24 * 60 * 60 * 1000).toISOString()
              }
            });

            return new Response(JSON.stringify({ message: "User suspended" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
        }
        break;

      case "PUT":
        const updateBody = await req.json();
        const updateId = url.searchParams.get("id");
        
        if (resource === "users") {
          const { data: updated, error } = await supabaseService
            .from("profiles")
            .update({
              ...updateBody,
              updated_at: new Date().toISOString()
            })
            .eq("id", updateId)
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ user: updated }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (resource === "shipments") {
          const { data: updated, error } = await supabaseService
            .from("shipments")
            .update({
              ...updateBody,
              updated_at: new Date().toISOString()
            })
            .eq("id", updateId)
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({ shipment: updated }), {
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

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });
  } catch (error) {
    console.error("Admin panel API error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function getDashboardAnalytics(supabase: any) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Get various analytics
  const [
    { count: totalUsers },
    { count: totalShipments },
    { count: activeShipments },
    { count: completedShipments },
    { count: recentUsers },
    { data: recentShipments },
    { data: topCarriers }
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("shipments").select("*", { count: "exact", head: true }),
    supabase.from("shipments").select("*", { count: "exact", head: true }).in("status", ["assigned", "in_transit"]),
    supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "delivered"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo.toISOString()),
    supabase.from("shipments")
      .select("*, shipper:profiles!shipper_id(full_name), carrier:profiles!carrier_id(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("shipments")
      .select("carrier_id, profiles!carrier_id(full_name)")
      .not("carrier_id", "is", null)
      .limit(5)
  ]);

  // Calculate revenue (mock calculation)
  const { data: shipmentRates } = await supabase
    .from("shipments")
    .select("rate")
    .eq("status", "delivered")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const monthlyRevenue = shipmentRates?.reduce((sum: number, ship: any) => sum + (ship.rate || 0), 0) || 0;

  return {
    overview: {
      total_users: totalUsers || 0,
      total_shipments: totalShipments || 0,
      active_shipments: activeShipments || 0,
      completed_shipments: completedShipments || 0,
      new_users_30d: recentUsers || 0,
      monthly_revenue: monthlyRevenue
    },
    recent_shipments: recentShipments || [],
    top_carriers: topCarriers || []
  };
}