-- Fix data relationships and add proper constraints

-- Update shipments table to ensure proper relationships
ALTER TABLE public.shipments 
ADD CONSTRAINT IF NOT EXISTS shipments_shipper_id_fkey 
FOREIGN KEY (shipper_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add carrier_id column if it doesn't exist
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS carrier_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_shipper_id ON public.shipments(shipper_id);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier_id ON public.shipments(carrier_id);
CREATE INDEX IF NOT EXISTS idx_shipments_equipment_type ON public.shipments(equipment_type);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON public.shipments(created_at);

-- Add indexes for bids table
CREATE INDEX IF NOT EXISTS idx_bids_shipment_id ON public.bids(shipment_id);
CREATE INDEX IF NOT EXISTS idx_bids_carrier_id ON public.bids(carrier_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON public.bids(status);

-- Add indexes for vehicles table
CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON public.vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_equipment_type ON public.vehicles(equipment_type);

-- Update RLS policies for better data access
DROP POLICY IF EXISTS "Shipments are viewable by shippers and carriers" ON public.shipments;
CREATE POLICY "Shipments are viewable by shippers and carriers" ON public.shipments
FOR SELECT USING (
  auth.uid() = shipper_id OR 
  auth.uid() = carrier_id OR 
  status = 'posted'
);

-- Add policy for carriers to see available shipments
CREATE POLICY "Carriers can view available shipments" ON public.shipments
FOR SELECT USING (
  status = 'posted' OR 
  auth.uid() = shipper_id OR 
  auth.uid() = carrier_id
);

-- Add policy for shippers to manage their shipments
CREATE POLICY "Shippers can manage their shipments" ON public.shipments
FOR ALL USING (auth.uid() = shipper_id);

-- Add policy for carriers to update assigned shipments
CREATE POLICY "Carriers can update assigned shipments" ON public.shipments
FOR UPDATE USING (auth.uid() = carrier_id);

-- Create function to get available shipments for carriers
CREATE OR REPLACE FUNCTION get_available_shipments()
RETURNS TABLE (
  id UUID,
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
  status TEXT,
  bid_count INTEGER,
  shipper_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
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
    s.status,
    COALESCE(s.bid_count, 0) as bid_count,
    p.full_name as shipper_name,
    s.created_at
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
  status TEXT,
  bid_count INTEGER,
  carrier_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
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
    s.status,
    COALESCE(s.bid_count, 0) as bid_count,
    p.full_name as carrier_name,
    s.created_at
  FROM public.shipments s
  LEFT JOIN public.profiles p ON s.carrier_id = p.user_id
  WHERE s.shipper_id = p_shipper_id
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get carrier's shipments
CREATE OR REPLACE FUNCTION get_carrier_shipments(p_carrier_id UUID)
RETURNS TABLE (
  id UUID,
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
  status TEXT,
  shipper_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
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
    s.status,
    p.full_name as shipper_name,
    s.created_at
  FROM public.shipments s
  LEFT JOIN public.profiles p ON s.shipper_id = p.user_id
  WHERE s.carrier_id = p_carrier_id
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 