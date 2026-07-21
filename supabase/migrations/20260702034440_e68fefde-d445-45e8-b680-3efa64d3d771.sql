
-- 1. Remove sensitive discord webhook from site_settings entirely (moved to server-side secrets).
DELETE FROM public.site_settings WHERE key = 'discord_webhook_url';

-- 2. Narrow site_settings SELECT policy so sensitive keys are never exposed to anon/authenticated.
DROP POLICY IF EXISTS "Anyone can read settings" ON public.site_settings;
CREATE POLICY "Anyone can read public settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (key NOT IN ('discord_webhook_url'));

-- Admins can still read everything (existing update/insert/delete admin policies remain).
CREATE POLICY "Admins can read all settings"
  ON public.site_settings
  FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

-- 3. Tighten review-photo upload policy: require an existing product_reviews row for the user.
DROP POLICY IF EXISTS "Users upload own review photos" ON storage.objects;
CREATE POLICY "Users upload own review photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'review-photos'
    AND (auth.uid())::text = (storage.foldername(name))[1]
    AND EXISTS (
      SELECT 1 FROM public.product_reviews pr
      WHERE pr.user_id = auth.uid()
    )
  );
