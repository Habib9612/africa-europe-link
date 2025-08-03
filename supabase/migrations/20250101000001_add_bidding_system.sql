-- Create bids table
CREATE TABLE public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  carrier_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(shipment_id, carrier_id)
);

-- Add bid-related columns to shipments table
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS bid_count INTEGER DEFAULT 0;
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS accepted_bid_id UUID REFERENCES public.bids(id);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS min_bid_amount DECIMAL(10,2);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS bid_deadline TIMESTAMP WITH TIME ZONE;

-- Enable RLS for bids
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- Create policies for bids
CREATE POLICY "Bids are viewable by shipment participants" ON public.bids
FOR SELECT USING (
  auth.uid() = carrier_id OR 
  auth.uid() IN (
    SELECT shipper_id FROM public.shipments WHERE id = shipment_id
  )
);

CREATE POLICY "Carriers can insert their own bids" ON public.bids
FOR INSERT WITH CHECK (auth.uid() = carrier_id);

CREATE POLICY "Carriers can update their own bids" ON public.bids
FOR UPDATE USING (auth.uid() = carrier_id);

CREATE POLICY "Shippers can update bid status" ON public.bids
FOR UPDATE USING (
  auth.uid() IN (
    SELECT shipper_id FROM public.shipments WHERE id = shipment_id
  )
);

-- Create trigger to update bid count
CREATE OR REPLACE FUNCTION update_bid_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.shipments 
    SET bid_count = bid_count + 1 
    WHERE id = NEW.shipment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.shipments 
    SET bid_count = bid_count - 1 
    WHERE id = OLD.shipment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bid_count_trigger
  AFTER INSERT OR DELETE ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION update_bid_count();

-- Create trigger for bid timestamp updates
CREATE TRIGGER update_bids_updated_at
  BEFORE UPDATE ON public.bids
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column(); 