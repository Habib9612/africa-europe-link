-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  category TEXT NOT NULL CHECK (category IN ('bid', 'shipment', 'payment', 'tracking', 'system', 'document')),
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  bid_notifications BOOLEAN DEFAULT true,
  shipment_notifications BOOLEAN DEFAULT true,
  payment_notifications BOOLEAN DEFAULT true,
  tracking_notifications BOOLEAN DEFAULT true,
  system_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_templates table
CREATE TABLE public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL UNIQUE,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notification tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- Create policies for notification_preferences
CREATE POLICY "Users can view their own preferences" ON public.notification_preferences
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.notification_preferences
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.notification_preferences
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for notification_templates
CREATE POLICY "Notification templates are viewable by all authenticated users" ON public.notification_templates
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create trigger for notification preferences timestamp updates
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_category TEXT DEFAULT 'system',
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    category,
    action_url,
    metadata
  ) VALUES (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_category,
    p_action_url,
    p_metadata
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.notifications
  SET read_at = now()
  WHERE id = p_notification_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.notifications
  SET read_at = now()
  WHERE user_id = auth.uid() AND read_at IS NULL;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Insert default notification templates
INSERT INTO public.notification_templates (template_name, title_template, message_template, type, category) VALUES
('new_bid', 'New Bid Received', 'You have received a new bid of €{amount} for shipment #{shipment_id}', 'info', 'bid'),
('bid_accepted', 'Bid Accepted', 'Your bid of €{amount} has been accepted for shipment #{shipment_id}', 'success', 'bid'),
('bid_rejected', 'Bid Rejected', 'Your bid of €{amount} was not accepted for shipment #{shipment_id}', 'warning', 'bid'),
('shipment_picked_up', 'Shipment Picked Up', 'Shipment #{shipment_id} has been picked up and is now in transit', 'success', 'tracking'),
('shipment_delivered', 'Shipment Delivered', 'Shipment #{shipment_id} has been successfully delivered', 'success', 'tracking'),
('payment_received', 'Payment Received', 'Payment of €{amount} has been received for shipment #{shipment_id}', 'success', 'payment'),
('payment_failed', 'Payment Failed', 'Payment of €{amount} failed for shipment #{shipment_id}', 'error', 'payment'),
('document_uploaded', 'Document Uploaded', 'A new {document_type} has been uploaded for shipment #{shipment_id}', 'info', 'document'),
('document_approved', 'Document Approved', 'Your {document_type} has been approved for shipment #{shipment_id}', 'success', 'document'),
('document_rejected', 'Document Rejected', 'Your {document_type} was rejected for shipment #{shipment_id}', 'error', 'document');

-- Create function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*) INTO count
  FROM public.notifications
  WHERE user_id = auth.uid() AND read_at IS NULL;
  
  RETURN count;
END;
$$ LANGUAGE plpgsql; 