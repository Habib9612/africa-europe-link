-- Fix the last function search path warning  
ALTER FUNCTION public.create_demo_user(text, text, text, text) SET search_path = '';