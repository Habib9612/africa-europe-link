-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Create payment_disputes table
CREATE TABLE public.payment_disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  disputer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add payment-related columns to shipments table
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'escrow_held', 'partial_paid', 'paid', 'refunded'));
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS escrow_amount DECIMAL(10,2);
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS final_payment_amount DECIMAL(10,2);

-- Enable RLS for payment tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Payments are viewable by participants" ON public.payments
FOR SELECT USING (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY "Users can insert payments they're involved in" ON public.payments
FOR INSERT WITH CHECK (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY "Users can update payments they're involved in" ON public.payments
FOR UPDATE USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Create policies for payment_disputes
CREATE POLICY "Disputes are viewable by participants" ON public.payment_disputes
FOR SELECT USING (
  auth.uid() = disputer_id OR 
  auth.uid() IN (
    SELECT payer_id FROM public.payments WHERE id = payment_id
    UNION
    SELECT payee_id FROM public.payments WHERE id = payment_id
  )
);

CREATE POLICY "Users can create disputes" ON public.payment_disputes
FOR INSERT WITH CHECK (auth.uid() = disputer_id);

CREATE POLICY "Users can update their disputes" ON public.payment_disputes
FOR UPDATE USING (auth.uid() = disputer_id);

-- Create policies for invoices
CREATE POLICY "Invoices are viewable by payment participants" ON public.invoices
FOR SELECT USING (
  auth.uid() IN (
    SELECT payer_id FROM public.payments WHERE id = payment_id
    UNION
    SELECT payee_id FROM public.payments WHERE id = payment_id
  )
);

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  invoice_number TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.invoices;
  
  invoice_number := 'INV' || LPAD(next_number::TEXT, 6, '0');
  RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate invoice number
CREATE OR REPLACE FUNCTION auto_generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_invoice_number_trigger
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_invoice_number();

-- Create function to calculate platform fees
CREATE OR REPLACE FUNCTION calculate_platform_fee(amount DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  -- 5% platform fee
  RETURN amount * 0.05;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate tax
CREATE OR REPLACE FUNCTION calculate_tax(amount DECIMAL, country_code TEXT)
RETURNS DECIMAL AS $$
BEGIN
  -- Simplified tax calculation - in real implementation, use proper tax rates
  CASE country_code
    WHEN 'MA' THEN RETURN amount * 0.20; -- Morocco VAT
    WHEN 'ES' THEN RETURN amount * 0.21; -- Spain VAT
    WHEN 'FR' THEN RETURN amount * 0.20; -- France VAT
    ELSE RETURN amount * 0.20; -- Default VAT
  END CASE;
END;
$$ LANGUAGE plpgsql; 