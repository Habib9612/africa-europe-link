-- Create tracking_events table
CREATE TABLE public.tracking_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id),
  driver_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('pickup', 'departure', 'in_transit', 'delivery', 'delay', 'issue', 'location_update')),
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  location_address TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tracking_routes table for planned vs actual routes
CREATE TABLE public.tracking_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  route_type TEXT NOT NULL CHECK (route_type IN ('planned', 'actual')),
  waypoints JSONB NOT NULL, -- Array of {lat, lng, address, timestamp}
  total_distance DECIMAL(10,2),
  estimated_duration INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add tracking-related columns to shipments table
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS tracking_status TEXT DEFAULT 'pending' CHECK (tracking_status IN ('pending', 'picked_up', 'in_transit', 'delivered', 'delayed', 'issue'));
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS current_location_lat DECIMAL(10,8);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS current_location_lng DECIMAL(11,8);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS current_location_address TEXT;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS estimated_delivery_time TIMESTAMP WITH TIME ZONE;

-- Enable RLS for tracking tables
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_routes ENABLE ROW LEVEL SECURITY;

-- Create policies for tracking_events
CREATE POLICY "Tracking events are viewable by shipment participants" ON public.tracking_events
FOR SELECT USING (
  auth.uid() IN (
    SELECT shipper_id FROM public.shipments WHERE id = shipment_id
    UNION
    SELECT carrier_id FROM public.shipments WHERE id = shipment_id
  )
);

CREATE POLICY "Drivers can insert tracking events" ON public.tracking_events
FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their tracking events" ON public.tracking_events
FOR UPDATE USING (auth.uid() = driver_id);

-- Create policies for tracking_routes
CREATE POLICY "Tracking routes are viewable by shipment participants" ON public.tracking_routes
FOR SELECT USING (
  auth.uid() IN (
    SELECT shipper_id FROM public.shipments WHERE id = shipment_id
    UNION
    SELECT carrier_id FROM public.shipments WHERE id = shipment_id
  )
);

CREATE POLICY "Carriers can insert tracking routes" ON public.tracking_routes
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT carrier_id FROM public.shipments WHERE id = shipment_id
  )
);

-- Create trigger for tracking route timestamp updates
CREATE TRIGGER update_tracking_routes_updated_at
  BEFORE UPDATE ON public.tracking_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update shipment tracking status
CREATE OR REPLACE FUNCTION update_shipment_tracking_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update shipment tracking status based on latest event
  UPDATE public.shipments 
  SET 
    tracking_status = NEW.event_type,
    current_location_lat = NEW.location_lat,
    current_location_lng = NEW.location_lng,
    current_location_address = NEW.location_address,
    last_location_update = NEW.timestamp
  WHERE id = NEW.shipment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update shipment tracking status
CREATE TRIGGER update_shipment_tracking_trigger
  AFTER INSERT ON public.tracking_events
  FOR EACH ROW
  EXECUTE FUNCTION update_shipment_tracking_status(); 