-- Create demo accounts directly in the database
-- Note: We can't insert directly into auth.users, but we can use a function to simulate signup

-- First, let's create a helper function to create demo users
CREATE OR REPLACE FUNCTION create_demo_user(user_email text, user_password text, display_name text, user_role text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id uuid;
    result json;
BEGIN
    -- This function will be called by the application, not directly insert into auth.users
    -- Instead, let's prepare the profiles for when the users are created
    
    -- For now, just return a message that accounts need to be created via signup
    result := json_build_object(
        'message', 'Use the signup form to create demo accounts',
        'email', user_email,
        'role', user_role
    );
    
    RETURN result;
END;
$$;

-- Alternative: Let's just ensure our setup function works properly
SELECT setup_demo_profile('carrier@demo.com', 'carrier', 'Demo Carrier');
SELECT setup_demo_profile('shipper@demo.com', 'shipper', 'Demo Shipper'); 
SELECT setup_demo_profile('test@demo.com', 'individual', 'Test User');