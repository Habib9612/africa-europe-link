-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('bill_of_lading', 'invoice', 'customs_form', 'insurance', 'proof_of_delivery', 'damage_report', 'other')),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document_templates table
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  template_path TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document_approvals table
CREATE TABLE public.document_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add document-related columns to shipments table
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS required_documents TEXT[] DEFAULT ARRAY['bill_of_lading', 'proof_of_delivery'];
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS documents_complete BOOLEAN DEFAULT false;

-- Enable RLS for document tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_approvals ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Documents are viewable by shipment participants" ON public.documents
FOR SELECT USING (
  auth.uid() IN (
    SELECT shipper_id FROM public.shipments WHERE id = shipment_id
    UNION
    SELECT carrier_id FROM public.shipments WHERE id = shipment_id
  )
);

CREATE POLICY "Users can upload documents for their shipments" ON public.documents
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT shipper_id FROM public.shipments WHERE id = shipment_id
    UNION
    SELECT carrier_id FROM public.shipments WHERE id = shipment_id
  )
);

CREATE POLICY "Users can update their uploaded documents" ON public.documents
FOR UPDATE USING (auth.uid() = uploaded_by);

-- Create policies for document_templates
CREATE POLICY "Document templates are viewable by all authenticated users" ON public.document_templates
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create policies for document_approvals
CREATE POLICY "Document approvals are viewable by document participants" ON public.document_approvals
FOR SELECT USING (
  auth.uid() = approver_id OR
  auth.uid() IN (
    SELECT uploaded_by FROM public.documents WHERE id = document_id
  )
);

CREATE POLICY "Approvers can create and update approvals" ON public.document_approvals
FOR ALL USING (auth.uid() = approver_id);

-- Create trigger for document timestamp updates
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check document completeness
CREATE OR REPLACE FUNCTION check_document_completeness()
RETURNS TRIGGER AS $$
DECLARE
  required_docs TEXT[];
  uploaded_docs TEXT[];
  is_complete BOOLEAN;
BEGIN
  -- Get required documents for the shipment
  SELECT required_documents INTO required_docs
  FROM public.shipments
  WHERE id = NEW.shipment_id;
  
  -- Get uploaded documents
  SELECT ARRAY_AGG(document_type) INTO uploaded_docs
  FROM public.documents
  WHERE shipment_id = NEW.shipment_id AND status = 'approved';
  
  -- Check if all required documents are uploaded and approved
  is_complete := true;
  FOR i IN 1..array_length(required_docs, 1) LOOP
    IF NOT (required_docs[i] = ANY(uploaded_docs)) THEN
      is_complete := false;
      EXIT;
    END IF;
  END LOOP;
  
  -- Update shipment document completeness
  UPDATE public.shipments
  SET documents_complete = is_complete
  WHERE id = NEW.shipment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check document completeness
CREATE TRIGGER check_document_completeness_trigger
  AFTER INSERT OR UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION check_document_completeness();

-- Insert default document templates
INSERT INTO public.document_templates (template_name, document_type, template_path) VALUES
('Standard Bill of Lading', 'bill_of_lading', 'templates/bill_of_lading_standard.pdf'),
('Customs Declaration Form', 'customs_form', 'templates/customs_declaration.pdf'),
('Proof of Delivery Template', 'proof_of_delivery', 'templates/proof_of_delivery.pdf'),
('Damage Report Form', 'damage_report', 'templates/damage_report.pdf'); 