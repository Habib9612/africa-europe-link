-- Fix existing admin user and create missing demo accounts

-- First, let's confirm the admin user's email (bypass email confirmation)
UPDATE auth.users 
SET email_confirmed_at = now(), confirmed_at = now()
WHERE email = 'admin@loadhive.com';

-- Update the admin user's profile to have admin role
UPDATE profiles 
SET role = 'admin', full_name = 'Admin User'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@loadhive.com');

-- Insert the missing demo users if they don't exist
-- Note: We can't directly insert into auth.users, but we can update existing ones
-- The other demo accounts (carrier@demo.com, shipper@demo.com, test@demo.com) need to be created through signup first

-- Create a function to help with demo account setup
CREATE OR REPLACE FUNCTION setup_demo_profile(user_email text, user_role text, display_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Get the user ID for the email
    SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
    
    -- If user exists, update their profile
    IF user_uuid IS NOT NULL THEN
        -- Confirm their email
        UPDATE auth.users 
        SET email_confirmed_at = COALESCE(email_confirmed_at, now()), 
            confirmed_at = COALESCE(confirmed_at, now())
        WHERE id = user_uuid;
        
        -- Update or insert profile
        INSERT INTO profiles (user_id, full_name, role)
        VALUES (user_uuid, display_name, user_role)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
            role = EXCLUDED.role,
            full_name = EXCLUDED.full_name,
            updated_at = now();
    END IF;
END;
$$;