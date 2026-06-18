-- Fix RLS policy on site_settings to exclude sensitive keys from public read access
-- Sensitive keys like discord_webhook_url should only be readable by admins

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can read settings" ON public.site_settings;

-- Create new policy that excludes sensitive keys for non-admins
CREATE POLICY "Read non-sensitive settings" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (key NOT IN ('discord_webhook_url'));

-- Create admin-only policy for reading sensitive settings
CREATE POLICY "Admins can read all settings" ON public.site_settings
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
