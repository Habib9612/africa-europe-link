-- Create locations table for carriers and shippers
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Morocco',
  is_current BOOLEAN DEFAULT true,
  available_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  available_until TIMESTAMP WITH TIME ZONE,
  vehicle_id UUID,
  capacity_kg INTEGER,
  equipment_types TEXT[] DEFAULT ARRAY['dry_van'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view locations for matching" 
ON public.locations 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own locations" 
ON public.locations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own locations" 
ON public.locations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create load_matches table for AI matching results
CREATE TABLE public.load_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL,
  carrier_id UUID NOT NULL,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  distance_km DECIMAL(8,2),
  estimated_cost DECIMAL(10,2),
  estimated_duration_hours INTEGER,
  compatibility_factors JSONB DEFAULT '{}',
  ai_insights JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'contacted', 'booked', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.load_matches ENABLE ROW LEVEL SECURITY;

-- Create policies for load matches
CREATE POLICY "Shippers can view matches for their shipments" 
ON public.load_matches 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM shipments 
  WHERE shipments.id = load_matches.shipment_id 
  AND shipments.shipper_id = auth.uid()
));

CREATE POLICY "Carriers can view their own matches" 
ON public.load_matches 
FOR SELECT 
USING (auth.uid() = carrier_id);

CREATE POLICY "System can insert matches" 
ON public.load_matches 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update match status" 
ON public.load_matches 
FOR UPDATE 
USING (auth.uid() = carrier_id OR EXISTS (
  SELECT 1 FROM shipments 
  WHERE shipments.id = load_matches.shipment_id 
  AND shipments.shipper_id = auth.uid()
));

-- Create indexes for performance
CREATE INDEX idx_locations_user_id ON public.locations(user_id);
CREATE INDEX idx_locations_available ON public.locations(available_from, available_until) WHERE is_current = true;
CREATE INDEX idx_locations_coords ON public.locations(latitude, longitude);
CREATE INDEX idx_load_matches_shipment ON public.load_matches(shipment_id);
CREATE INDEX idx_load_matches_carrier ON public.load_matches(carrier_id);
CREATE INDEX idx_load_matches_score ON public.load_matches(match_score DESC);

-- Add trigger for timestamps
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_load_matches_updated_at
BEFORE UPDATE ON public.load_matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();