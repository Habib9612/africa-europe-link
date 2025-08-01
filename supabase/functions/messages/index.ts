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

    switch (req.method) {
      case 'GET':
        if (url.pathname.includes('/conversations')) {
          // Get user's conversations
          const { data: conversations, error } = await supabase
            .from('messages')
            .select(`
              conversation_id,
              sender_id,
              receiver_id,
              subject,
              message,
              created_at,
              is_read,
              profiles!messages_sender_id_fkey(full_name, avatar_url),
              receiver_profiles:profiles!messages_receiver_id_fkey(full_name, avatar_url)
            `)
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Group messages by conversation
          const groupedConversations = conversations.reduce((acc, message) => {
            const convId = message.conversation_id;
            if (!acc[convId]) {
              acc[convId] = {
                conversation_id: convId,
                participant: message.sender_id === user.id ? 
                  message.receiver_profiles : message.profiles,
                last_message: message.message,
                last_message_time: message.created_at,
                unread_count: 0,
                messages: []
              };
            }
            
            if (!message.is_read && message.receiver_id === user.id) {
              acc[convId].unread_count++;
            }
            
            acc[convId].messages.push(message);
            return acc;
          }, {});

          return new Response(
            JSON.stringify(Object.values(groupedConversations)),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else if (url.pathname.includes('/conversation/')) {
          // Get messages for specific conversation
          const conversationId = pathParts[pathParts.length - 1];
          
          const { data: messages, error } = await supabase
            .from('messages')
            .select(`
              *,
              profiles!messages_sender_id_fkey(full_name, avatar_url),
              receiver_profiles:profiles!messages_receiver_id_fkey(full_name, avatar_url)
            `)
            .eq('conversation_id', conversationId)
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: true });

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Mark messages as read
          await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .eq('receiver_id', user.id);

          return new Response(
            JSON.stringify(messages),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      case 'POST':
        if (url.pathname.includes('/send')) {
          // Send new message
          const messageData = await req.json();
          
          // Generate conversation ID if not provided
          const conversationId = messageData.conversation_id || 
            generateConversationId(user.id, messageData.receiver_id);
          
          const { data, error } = await supabase
            .from('messages')
            .insert({
              conversation_id: conversationId,
              sender_id: user.id,
              receiver_id: messageData.receiver_id,
              subject: messageData.subject,
              message: messageData.message,
              message_type: messageData.message_type || 'text',
              related_shipment_id: messageData.related_shipment_id
            })
            .select(`
              *,
              profiles!messages_sender_id_fkey(full_name, avatar_url),
              receiver_profiles:profiles!messages_receiver_id_fkey(full_name, avatar_url)
            `)
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Create notification for receiver
          await supabase
            .from('notifications')
            .insert({
              user_id: messageData.receiver_id,
              title: 'New Message',
              message: `You have received a new message from ${data.profiles.full_name}`,
              type: 'message',
              related_id: data.id
            });

          return new Response(
            JSON.stringify(data),
            { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      case 'PUT':
        if (url.pathname.includes('/mark-read')) {
          // Mark messages as read
          const { conversation_id } = await req.json();
          
          const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversation_id)
            .eq('receiver_id', user.id);

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
        }
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in messages function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateConversationId(userId1: string, userId2: string): string {
  // Create a consistent conversation ID by sorting user IDs
  const sortedIds = [userId1, userId2].sort();
  return `conv_${sortedIds[0]}_${sortedIds[1]}`;
}