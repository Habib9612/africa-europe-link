-- Fix shipment queries and data flow issues

-- First, let's check if the shipments table has the correct structure
-- Add missing columns if they don't exist
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS bid_count INTEGER DEFAULT 0;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS tracking_status TEXT DEFAULT 'pending';
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Create a view for available shipments that carriers can see
CREATE OR REPLACE VIEW available_shipments AS
SELECT 
  s.*,
  p.full_name as shipper_name,
  p.id as shipper_profile_id
FROM public.shipments s
LEFT JOIN public.profiles p ON s.shipper_id = p.user_id
WHERE s.status = 'posted';

-- Create a view for shipper's shipments
CREATE OR REPLACE VIEW shipper_shipments AS
SELECT 
  s.*,
  p_shipper.full_name as shipper_name,
  p_carrier.full_name as carrier_name
FROM public.shipments s
LEFT JOIN public.profiles p_shipper ON s.shipper_id = p_shipper.user_id
LEFT JOIN public.profiles p_carrier ON s.carrier_id = p_carrier.user_id;

-- Create a view for carrier's shipments
CREATE OR REPLACE VIEW carrier_shipments AS
SELECT 
  s.*,
  p.full_name as shipper_name
FROM public.shipments s
LEFT JOIN public.profiles p ON s.shipper_id = p.user_id
WHERE s.carrier_id IS NOT NULL;

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Shipments are viewable by shippers and carriers" ON public.shipments;
DROP POLICY IF EXISTS "Carriers can view available shipments" ON public.shipments;

-- Create new policies
CREATE POLICY "Shipments are viewable by participants" ON public.shipments
FOR SELECT USING (
  auth.uid() = shipper_id OR 
  auth.uid() = carrier_id OR 
  status = 'posted'
);

CREATE POLICY "Shippers can manage their shipments" ON public.shipments
FOR ALL USING (auth.uid() = shipper_id);

CREATE POLICY "Carriers can update assigned shipments" ON public.shipments
FOR UPDATE USING (auth.uid() = carrier_id);

-- Create function to get available shipments
CREATE OR REPLACE FUNCTION get_available_shipments_for_carriers()
RETURNS TABLE (
  id UUID,
  shipper_id UUID,
  origin_city TEXT,
  origin_state TEXT,
  destination_city TEXT,
  destination_state TEXT,
  pickup_date DATE,
  delivery_date DATE,
  weight INTEGER,
  rate DECIMAL,
  equipment_type TEXT,
  commodity TEXT,
  special_requirements TEXT,
  status TEXT,
  bid_count INTEGER,
  tracking_status TEXT,
  payment_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  shipper_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.shipper_id,
    s.origin_city,
    s.origin_state,
    s.destination_city,
    s.destination_state,
    s.pickup_date,
    s.delivery_date,
    s.weight,
    s.rate,
    s.equipment_type,
    s.commodity,
    s.special_requirements,
    s.status,
    COALESCE(s.bid_count, 0) as bid_count,
    COALESCE(s.tracking_status, 'pending') as tracking_status,
    COALESCE(s.payment_status, 'pending') as payment_status,
    s.created_at,
    p.full_name as shipper_name
  FROM public.shipments s
  LEFT JOIN public.profiles p ON s.shipper_id = p.user_id
  WHERE s.status = 'posted'
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get shipper's shipments
CREATE OR REPLACE FUNCTION get_shipper_shipments(p_shipper_id UUID)
RETURNS TABLE (
  id UUID,
  shipper_id UUID,
  carrier_id UUID,
  origin_city TEXT,
  origin_state TEXT,
  destination_city TEXT,
  destination_state TEXT,
  pickup_date DATE,
  delivery_date DATE,
  weight INTEGER,
  rate DECIMAL,
  equipment_type TEXT,
  commodity TEXT,
  special_requirements TEXT,
  status TEXT,
  bid_count INTEGER,
  tracking_status TEXT,
  payment_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  shipper_name TEXT,
  carrier_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.shipper_id,
    s.carrier_id,
    s.origin_city,
    s.origin_state,
    s.destination_city,
    s.destination_state,
    s.pickup_date,
    s.delivery_date,
    s.weight,
    s.rate,
    s.equipment_type,
    s.commodity,
    s.special_requirements,
    s.status,
    COALESCE(s.bid_count, 0) as bid_count,
    COALESCE(s.tracking_status, 'pending') as tracking_status,
    COALESCE(s.payment_status, 'pending') as payment_status,
    s.created_at,
    p_shipper.full_name as shipper_name,
    p_carrier.full_name as carrier_name
  FROM public.shipments s
  LEFT JOIN public.profiles p_shipper ON s.shipper_id = p_shipper.user_id
  LEFT JOIN public.profiles p_carrier ON s.carrier_id = p_carrier.user_id
  WHERE s.shipper_id = p_shipper_id
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get carrier's shipments
CREATE OR REPLACE FUNCTION get_carrier_shipments(p_carrier_id UUID)
RETURNS TABLE (
  id UUID,
  shipper_id UUID,
  carrier_id UUID,
  origin_city TEXT,
  origin_state TEXT,
  destination_city TEXT,
  destination_state TEXT,
  pickup_date DATE,
  delivery_date DATE,
  weight INTEGER,
  rate DECIMAL,
  equipment_type TEXT,
  commodity TEXT,
  special_requirements TEXT,
  status TEXT,
  bid_count INTEGER,
  tracking_status TEXT,
  payment_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  shipper_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.shipper_id,
    s.carrier_id,
    s.origin_city,
    s.origin_state,
    s.destination_city,
    s.destination_state,
    s.pickup_date,
    s.delivery_date,
    s.weight,
    s.rate,
    s.equipment_type,
    s.commodity,
    s.special_requirements,
    s.status,
    COALESCE(s.bid_count, 0) as bid_count,
    COALESCE(s.tracking_status, 'pending') as tracking_status,
    COALESCE(s.payment_status, 'pending') as payment_status,
    s.created_at,
    p.full_name as shipper_name
  FROM public.shipments s
  LEFT JOIN public.profiles p ON s.shipper_id = p.user_id
  WHERE s.carrier_id = p_carrier_id
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 