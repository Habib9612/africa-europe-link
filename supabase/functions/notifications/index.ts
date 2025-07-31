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
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const unreadOnly = url.searchParams.get("unread_only") === "true";
        
        let query = supabaseService
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (unreadOnly) {
          query = query.eq("read", false);
        }

        const { data: notifications, error } = await query;
        
        if (error) throw error;

        // Get unread count
        const { count: unreadCount } = await supabaseService
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("read", false);

        return new Response(JSON.stringify({ 
          notifications,
          unread_count: unreadCount || 0
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "POST":
        const body = await req.json();
        const action = url.searchParams.get("action");

        if (action === "mark_read") {
          const { notification_ids } = body;
          
          const { error } = await supabaseService
            .from("notifications")
            .update({ 
              read: true,
              read_at: new Date().toISOString()
            })
            .eq("user_id", user.id)
            .in("id", notification_ids);

          if (error) throw error;

          return new Response(JSON.stringify({ message: "Notifications marked as read" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (action === "mark_all_read") {
          const { error } = await supabaseService
            .from("notifications")
            .update({ 
              read: true,
              read_at: new Date().toISOString()
            })
            .eq("user_id", user.id)
            .eq("read", false);

          if (error) throw error;

          return new Response(JSON.stringify({ message: "All notifications marked as read" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else if (action === "send") {
          // Admin functionality to send notifications
          const { user_ids, type, title, message, related_id } = body;
          
          // Check if user is admin
          const { data: profile } = await supabaseService
            .from("profiles")
            .select("role")
            .eq("user_id", user.id)
            .single();

          if (profile?.role !== "admin") {
            return new Response(JSON.stringify({ error: "Access denied" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 403,
            });
          }

          const notifications = user_ids.map((userId: string) => ({
            user_id: userId,
            type,
            title,
            message,
            related_id
          }));

          const { data: sent, error } = await supabaseService
            .from("notifications")
            .insert(notifications)
            .select();

          if (error) throw error;

          return new Response(JSON.stringify({ 
            message: "Notifications sent",
            notifications: sent
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 201,
          });
        } else {
          // Send email/SMS notification
          const { notification_id, channels } = body;
          
          // Get notification details
          const { data: notification, error: notifError } = await supabaseService
            .from("notifications")
            .select(`
              *,
              profiles:user_id (full_name, user_id)
            `)
            .eq("id", notification_id)
            .single();

          if (notifError) throw notifError;

          const results = [];

          // Mock email sending
          if (channels.includes("email")) {
            const emailResult = await sendEmailNotification(notification);
            results.push({ channel: "email", ...emailResult });
          }

          // Mock SMS sending
          if (channels.includes("sms")) {
            const smsResult = await sendSMSNotification(notification);
            results.push({ channel: "sms", ...smsResult });
          }

          return new Response(JSON.stringify({ 
            message: "External notifications sent",
            results
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "DELETE":
        const deleteId = url.searchParams.get("id");
        
        const { error } = await supabaseService
          .from("notifications")
          .delete()
          .eq("id", deleteId)
          .eq("user_id", user.id);

        if (error) throw error;

        return new Response(JSON.stringify({ message: "Notification deleted" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 405,
        });
    }
  } catch (error) {
    console.error("Notifications API error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function sendEmailNotification(notification: any) {
  // Mock email service integration
  console.log("Sending email notification:", {
    to: notification.profiles?.user_id,
    subject: notification.title,
    body: notification.message
  });
  
  return {
    success: true,
    message: "Email sent successfully",
    provider: "mock_email_service"
  };
}

async function sendSMSNotification(notification: any) {
  // Mock SMS service integration
  console.log("Sending SMS notification:", {
    to: notification.profiles?.user_id,
    message: `${notification.title}: ${notification.message}`
  });
  
  return {
    success: true,
    message: "SMS sent successfully",
    provider: "mock_sms_service"
  };
}