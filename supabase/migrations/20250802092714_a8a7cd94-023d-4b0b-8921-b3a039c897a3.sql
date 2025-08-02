-- Insert sample shipments for testing (only if they don't exist)
INSERT INTO public.shipments (
  id,
  shipper_id,
  origin_city,
  origin_state,
  destination_city, 
  destination_state,
  pickup_date,
  delivery_date,
  weight,
  equipment_type,
  commodity,
  rate,
  status
) VALUES 
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000', -- placeholder user id
  'Casablanca',
  'Grand Casablanca',
  'Madrid',
  'Madrid',
  CURRENT_DATE + INTERVAL '2 days',
  CURRENT_DATE + INTERVAL '7 days', 
  25000,
  'dry_van',
  'Electronics',
  2500.00,
  'posted'
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000', -- placeholder user id
  'Rabat',
  'Rabat-Salé-Kénitra',
  'Barcelona',
  'Catalonia',
  CURRENT_DATE + INTERVAL '3 days',
  CURRENT_DATE + INTERVAL '8 days',
  18000,
  'refrigerated',
  'Food Products',
  3200.00,
  'posted'
)
ON CONFLICT DO NOTHING;

-- Insert sample carrier locations for testing (only if they don't exist)
INSERT INTO public.locations (
  id,
  user_id,
  latitude,
  longitude,
  city,
  state,
  country,
  equipment_types,
  capacity_kg,
  available_from,
  available_until,
  is_current
) VALUES 
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000', -- placeholder user id  
  33.5731,
  -7.5898,
  'Casablanca',
  'Grand Casablanca',
  'Morocco',
  ARRAY['dry_van', 'refrigerated'],
  30000,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP + INTERVAL '30 days',
  true
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000', -- placeholder user id
  35.7595,
  -5.8340, 
  'Tangier',
  'Tanger-Tétouan-Al Hoceïma',
  'Morocco',
  ARRAY['dry_van', 'flatbed'],
  25000,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP + INTERVAL '30 days',
  true
)
ON CONFLICT DO NOTHING;