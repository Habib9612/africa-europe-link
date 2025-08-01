-- Fix function search path security warnings
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.setup_demo_profile(text, text, text) SET search_path = '';