-- Confirm emails for demo accounts
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email IN ('carrier@demo.com', 'shipper@demo.com') 
AND email_confirmed_at IS NULL;