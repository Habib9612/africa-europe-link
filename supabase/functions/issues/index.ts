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
    const issueId = pathParts[pathParts.length - 1];

    switch (req.method) {
      case 'GET':
        if (issueId && issueId !== 'issues') {
          // Get specific issue
          const { data: issue, error } = await supabase
            .from('issues')
            .select(`
              *,
              shipments(id, origin_city, destination_city),
              profiles!issues_reported_by_fkey(full_name, avatar_url)
            `)
            .eq('id', issueId)
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(issue),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Get all issues
          let query = supabase
            .from('issues')
            .select(`
              *,
              shipments(id, origin_city, destination_city),
              profiles!issues_reported_by_fkey(full_name, avatar_url)
            `);

          // Role-based filtering
          if (profile.role === 'shipper') {
            query = query.eq('shipments.shipper_id', user.id);
          } else if (profile.role === 'carrier') {
            query = query.eq('shipments.carrier_id', user.id);
          }

          const { data: issues, error } = await query.order('created_at', { ascending: false });

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(issues),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'POST':
        // Create new issue
        const issueData = await req.json();
        
        const { data, error } = await supabase
          .from('issues')
          .insert({
            ...issueData,
            reported_by: user.id,
            issue_number: generateIssueNumber()
          })
          .select()
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create notification for relevant parties
        await createIssueNotification(supabase, data, profile);

        return new Response(
          JSON.stringify(data),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'PUT':
        if (url.pathname.includes('/resolve')) {
          // Resolve issue
          const { resolution_notes } = await req.json();
          
          const { data, error } = await supabase
            .from('issues')
            .update({ 
              status: 'resolved',
              resolved_at: new Date().toISOString(),
              resolved_by: user.id,
              resolution_notes
            })
            .eq('id', issueId)
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
        } else {
          // Update issue
          const updateData = await req.json();
          
          const { data, error } = await supabase
            .from('issues')
            .update(updateData)
            .eq('id', issueId)
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
        }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in issues function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateIssueNumber(): string {
  const prefix = 'ISS';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

async function createIssueNotification(supabase: any, issue: any, profile: any) {
  try {
    // Get shipment details to determine who to notify
    const { data: shipment } = await supabase
      .from('shipments')
      .select('shipper_id, carrier_id')
      .eq('id', issue.shipment_id)
      .single();

    if (shipment) {
      const notifyUsers = [];
      
      // Notify the other party
      if (profile.role === 'shipper' && shipment.carrier_id) {
        notifyUsers.push(shipment.carrier_id);
      } else if (profile.role === 'carrier' && shipment.shipper_id) {
        notifyUsers.push(shipment.shipper_id);
      }

      // Create notifications
      for (const userId of notifyUsers) {
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            title: `New Issue Reported: ${issue.title}`,
            message: `Issue #${issue.issue_number} has been reported for shipment.`,
            type: 'issue',
            related_id: issue.id
          });
      }
    }
  } catch (error) {
    console.error('Error creating issue notification:', error);
  }
}