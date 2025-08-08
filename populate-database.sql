-- Populate database with demo shipment data
-- This will create the shipments that are currently shown as static data on the loads page

-- Insert demo shipments
INSERT INTO shipments (
  id,
  title,
  company_name,
  origin_city,
  origin_country,
  destination_city,
  destination_country,
  weight,
  container_type,
  price,
  status,
  urgency,
  special_requirements,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'Electronics Shipment',
  'TechDistrib SA',
  'Casablanca',
  'Morocco',
  'Madrid',
  'Spain',
  15,
  'Container 40ft',
  2800,
  'posted',
  'urgent',
  ARRAY['Refrigerated', 'Insurance Required'],
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
),
(
  gen_random_uuid(),
  'Auto Parts Export',
  'AutoParts Europe',
  'Tangier',
  'Morocco',
  'Barcelona',
  'Spain',
  8,
  'Flatbed 20ft',
  1650,
  'posted',
  'normal',
  ARRAY['Secure Loading', 'Express Delivery'],
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '4 hours'
),
(
  gen_random_uuid(),
  'Textile Goods',
  'MoroccoTextiles Ltd',
  'Fez',
  'Morocco',
  'Lyon',
  'France',
  12,
  'Container 20ft',
  2200,
  'posted',
  'normal',
  ARRAY['Dry Storage'],
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '6 hours'
),
(
  gen_random_uuid(),
  'Food Products',
  'Atlas Foods Export',
  'Rabat',
  'Morocco',
  'Marseille',
  'France',
  20,
  'Refrigerated 40ft',
  3500,
  'posted',
  'urgent',
  ARRAY['Temperature Controlled', 'Fast Transit'],
  NOW() - INTERVAL '8 hours',
  NOW() - INTERVAL '8 hours'
);

-- Verify the data was inserted
SELECT * FROM shipments WHERE status = 'posted' ORDER BY created_at DESC;