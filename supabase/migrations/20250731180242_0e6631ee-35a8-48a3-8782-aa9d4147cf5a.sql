-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'individual' CHECK (role IN ('admin', 'carrier', 'shipper', 'individual', 'company')),
  company_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  dot_number TEXT,
  mc_number TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policies for companies
CREATE POLICY "Companies are viewable by their owners" ON public.companies
FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own company" ON public.companies
FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own company" ON public.companies
FOR UPDATE USING (auth.uid() = owner_id);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  vin TEXT UNIQUE,
  license_plate TEXT,
  equipment_type TEXT NOT NULL DEFAULT 'dry_van' CHECK (equipment_type IN ('dry_van', 'refrigerated', 'flatbed', 'step_deck', 'lowboy', 'tanker')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_transit', 'maintenance', 'out_of_service')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicles
CREATE POLICY "Vehicles are viewable by their owners" ON public.vehicles
FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own vehicles" ON public.vehicles
FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own vehicles" ON public.vehicles
FOR UPDATE USING (auth.uid() = owner_id);

-- Create shipments table
CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipper_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  carrier_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  origin_city TEXT NOT NULL,
  origin_state TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_state TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  delivery_date DATE NOT NULL,
  weight INTEGER NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  equipment_type TEXT NOT NULL DEFAULT 'dry_van' CHECK (equipment_type IN ('dry_van', 'refrigerated', 'flatbed', 'step_deck', 'lowboy', 'tanker')),
  commodity TEXT NOT NULL,
  special_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'posted' CHECK (status IN ('posted', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for shipments
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Create policies for shipments
CREATE POLICY "Shipments are viewable by shippers and carriers" ON public.shipments
FOR SELECT USING (auth.uid() = shipper_id OR auth.uid() = carrier_id OR status = 'posted');

CREATE POLICY "Shippers can insert their own shipments" ON public.shipments
FOR INSERT WITH CHECK (auth.uid() = shipper_id);

CREATE POLICY "Shippers can update their own shipments" ON public.shipments
FOR UPDATE USING (auth.uid() = shipper_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'individual')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();