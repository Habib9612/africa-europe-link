-- Add comprehensive sample data for testing

-- Sample companies
INSERT INTO public.companies (id, name, address, phone, email, dot_number, mc_number, owner_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Moroccan Export Ltd', '123 Hassan II Ave, Casablanca, Morocco', '+212-522-123456', 'contact@moroccanexport.ma', 'DOT123456', 'MC789012', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440002', 'EuroTrans Logistics', '456 Logistics St, Madrid, Spain', '+34-91-123456', 'info@eurotrans.es', 'DOT234567', 'MC890123', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440003', 'Atlas Freight Services', '789 Transport Rd, Tangier, Morocco', '+212-539-123456', 'hello@atlasfreight.ma', 'DOT345678', 'MC901234', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440004', 'Mediterranean Cargo', '321 Port Blvd, Barcelona, Spain', '+34-93-123456', 'cargo@medcargo.es', 'DOT456789', 'MC012345', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440005', 'Sahara Transport', '654 Desert Way, Marrakech, Morocco', '+212-524-123456', 'transport@sahara.ma', 'DOT567890', 'MC123456', '550e8400-e29b-41d4-a716-446655440005');

-- Sample vehicles for carriers
INSERT INTO public.vehicles (id, owner_id, company_id, make, model, year, vin, license_plate, equipment_type, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Mercedes-Benz', 'Actros', 2022, 'WDB9634031L123456', 'ES-1234-AB', 'dry_van', 'available'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Volvo', 'FH16', 2021, 'YV1LZ56D4X2123456', 'ES-5678-CD', 'refrigerated', 'available'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Scania', 'R500', 2023, 'XLBPS47E1EL123456', 'MA-9012-EF', 'flatbed', 'available'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'MAN', 'TGX', 2022, 'WMA13XZZ0KJ123456', 'ES-3456-GH', 'dry_van', 'available'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Iveco', 'Stralis', 2021, 'ZAR12345678901234', 'MA-7890-IJ', 'step_deck', 'available'),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'DAF', 'XF', 2023, 'XLRTE47M0EL123456', 'ES-1111-KL', 'tanker', 'available'),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Renault', 'T', 2022, 'VF623A0000123456', 'MA-2222-MN', 'lowboy', 'available');

-- Sample shipments from shippers
INSERT INTO public.shipments (id, shipper_id, origin_city, origin_state, destination_city, destination_state, pickup_date, delivery_date, weight, rate, equipment_type, commodity, special_requirements, status, bid_count) VALUES
-- Electronics from Morocco to Spain
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Casablanca', 'Casablanca-Settat', 'Madrid', 'Madrid', '2025-01-15', '2025-01-17', 15000, 2800.00, 'refrigerated', 'Electronics', 'Handle with care, temperature controlled', 'posted', 3),
-- Textiles from Morocco to France
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Tangier', 'Tanger-Tetouan-Al Hoceima', 'Paris', 'Île-de-France', '2025-01-16', '2025-01-18', 8000, 2200.00, 'dry_van', 'Textiles', 'Keep dry', 'posted', 2),
-- Auto parts from Morocco to Germany
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Rabat', 'Rabat-Salé-Kénitra', 'Berlin', 'Berlin', '2025-01-17', '2025-01-20', 12000, 3200.00, 'dry_van', 'Auto Parts', 'Fragile items', 'posted', 1),
-- Agricultural products from Morocco to Italy
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Agadir', 'Souss-Massa', 'Rome', 'Lazio', '2025-01-18', '2025-01-21', 18000, 3500.00, 'refrigerated', 'Agricultural Products', 'Temperature controlled, fresh produce', 'posted', 4),
-- Machinery from Morocco to Netherlands
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Fez', 'Fès-Meknès', 'Amsterdam', 'North Holland', '2025-01-19', '2025-01-22', 25000, 4200.00, 'flatbed', 'Machinery', 'Heavy equipment, secure properly', 'posted', 2),
-- Chemicals from Morocco to Belgium
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Marrakech', 'Marrakech-Safi', 'Brussels', 'Brussels-Capital', '2025-01-20', '2025-01-23', 10000, 2800.00, 'tanker', 'Chemicals', 'Hazmat certified driver required', 'posted', 1),
-- Furniture from Morocco to Portugal
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'Oujda', 'Oriental', 'Lisbon', 'Lisbon', '2025-01-21', '2025-01-24', 6000, 1800.00, 'dry_van', 'Furniture', 'Handle carefully, no stacking', 'posted', 3),
-- Wine from Spain to Morocco
('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Barcelona', 'Catalonia', 'Casablanca', 'Casablanca-Settat', '2025-01-22', '2025-01-25', 5000, 1600.00, 'refrigerated', 'Wine', 'Temperature controlled, no vibration', 'posted', 2),
-- Olive oil from Spain to Morocco
('770e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 'Seville', 'Andalusia', 'Rabat', 'Rabat-Salé-Kénitra', '2025-01-23', '2025-01-26', 3000, 1200.00, 'dry_van', 'Olive Oil', 'Keep upright, no extreme temperatures', 'posted', 1),
-- Industrial equipment from Spain to Morocco
('770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Valencia', 'Valencia', 'Tangier', 'Tanger-Tetouan-Al Hoceima', '2025-01-24', '2025-01-27', 20000, 3800.00, 'step_deck', 'Industrial Equipment', 'Heavy machinery, special permits required', 'posted', 2);

-- Sample bids on shipments
INSERT INTO public.bids (id, shipment_id, carrier_id, amount, notes, status) VALUES
-- Bids for Electronics shipment
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 2750.00, 'Experienced in temperature-controlled transport', 'pending'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 2850.00, 'Available immediately, professional service', 'pending'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 2700.00, 'Best price, guaranteed delivery time', 'pending'),

-- Bids for Textiles shipment
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 2150.00, 'Reliable service, on-time delivery', 'pending'),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 2250.00, 'Professional handling, insurance included', 'pending'),

-- Bids for Auto parts shipment
('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 3150.00, 'Specialized in fragile cargo', 'pending'),

-- Bids for Agricultural products shipment
('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 3400.00, 'Temperature-controlled fleet', 'pending'),
('880e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 3450.00, 'Fresh produce specialist', 'pending'),
('880e8400-e29b-41d4-a716-446655440009', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 3300.00, 'Fast delivery, quality service', 'pending'),
('880e8400-e29b-41d4-a716-446655440010', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 3500.00, 'Premium service, guaranteed freshness', 'pending'),

-- Bids for Machinery shipment
('880e8400-e29b-41d4-a716-446655440011', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 4100.00, 'Heavy equipment specialist', 'pending'),
('880e8400-e29b-41d4-a716-446655440012', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 4200.00, 'Professional heavy transport', 'pending'),

-- Bids for Chemicals shipment
('880e8400-e29b-41d4-a716-446655440013', '770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', 2750.00, 'Hazmat certified, safety first', 'pending'),

-- Bids for Furniture shipment
('880e8400-e29b-41d4-a716-446655440014', '770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 1750.00, 'Careful handling guaranteed', 'pending'),
('880e8400-e29b-41d4-a716-446655440015', '770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 1800.00, 'Professional furniture transport', 'pending'),
('880e8400-e29b-41d4-a716-446655440016', '770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440005', 1700.00, 'Best price, quality service', 'pending'),

-- Bids for Wine shipment
('880e8400-e29b-41d4-a716-446655440017', '770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 1550.00, 'Wine transport specialist', 'pending'),
('880e8400-e29b-41d4-a716-446655440018', '770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', 1600.00, 'Temperature controlled, gentle handling', 'pending'),

-- Bids for Olive oil shipment
('880e8400-e29b-41d4-a716-446655440019', '770e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 1200.00, 'Reliable delivery service', 'pending'),

-- Bids for Industrial equipment shipment
('880e8400-e29b-41d4-a716-446655440020', '770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', 3750.00, 'Heavy equipment specialist', 'pending'),
('880e8400-e29b-41d4-a716-446655440021', '770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', 3800.00, 'Professional heavy transport', 'pending');

-- Sample tracking events
INSERT INTO public.tracking_events (id, shipment_id, event_type, location_lat, location_lng, location_address, notes) VALUES
-- Tracking for Electronics shipment (assigned to EuroTrans)
('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'pickup', 33.5731, -7.5898, 'Casablanca Port, Morocco', 'Shipment picked up successfully'),
('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'departure', 33.5731, -7.5898, 'Casablanca Port, Morocco', 'Departed from origin'),
('990e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'in_transit', 36.7525, -5.8333, 'Tangier, Morocco', 'Crossing Mediterranean Sea'),
('990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'in_transit', 36.7213, -4.4217, 'Malaga, Spain', 'Arrived in Spain'),
('990e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440001', 'in_transit', 37.3891, -5.9845, 'Seville, Spain', 'En route to Madrid'),

-- Tracking for Textiles shipment (assigned to Atlas Freight)
('990e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440002', 'pickup', 35.7595, -5.8340, 'Tangier Port, Morocco', 'Shipment picked up'),
('990e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440002', 'departure', 35.7595, -5.8340, 'Tangier Port, Morocco', 'Departed for France'),

-- Tracking for Auto parts shipment (assigned to Mediterranean Cargo)
('990e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', 'pickup', 34.0331, -6.8498, 'Rabat, Morocco', 'Fragile cargo picked up carefully');

-- Update some shipments to assigned status
UPDATE public.shipments 
SET status = 'assigned', carrier_id = '550e8400-e29b-41d4-a716-446655440002'
WHERE id = '770e8400-e29b-41d4-a716-446655440001';

UPDATE public.shipments 
SET status = 'assigned', carrier_id = '550e8400-e29b-41d4-a716-446655440003'
WHERE id = '770e8400-e29b-41d4-a716-446655440002';

UPDATE public.shipments 
SET status = 'assigned', carrier_id = '550e8400-e29b-41d4-a716-446655440004'
WHERE id = '770e8400-e29b-41d4-a716-446655440003';

-- Update some bids to accepted status
UPDATE public.bids 
SET status = 'accepted'
WHERE id IN (
  '880e8400-e29b-41d4-a716-446655440001',
  '880e8400-e29b-41d4-a716-446655440004',
  '880e8400-e29b-41d4-a716-446655440006'
);

-- Update shipments with accepted bids
UPDATE public.shipments 
SET accepted_bid_id = '880e8400-e29b-41d4-a716-446655440001'
WHERE id = '770e8400-e29b-41d4-a716-446655440001';

UPDATE public.shipments 
SET accepted_bid_id = '880e8400-e29b-41d4-a716-446655440004'
WHERE id = '770e8400-e29b-41d4-a716-446655440002';

UPDATE public.shipments 
SET accepted_bid_id = '880e8400-e29b-41d4-a716-446655440006'
WHERE id = '770e8400-e29b-41d4-a716-446655440003'; 