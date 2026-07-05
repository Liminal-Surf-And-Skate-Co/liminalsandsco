DROP POLICY IF EXISTS "Anyone can read public settings" ON public.site_settings;
CREATE POLICY "Anyone can read public settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (key IN (
    'facebook_url',
    'tiktok_url',
    'instagram_url',
    'discord_invite_url',
    'youtube_url',
    'contact_email_primary',
    'contact_email_secondary'
  ));

DROP POLICY IF EXISTS "Anyone reads review photos" ON storage.objects;

CREATE POLICY "Approved review photos are public"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'review-photos'
    AND EXISTS (
      SELECT 1 FROM public.product_reviews pr
      WHERE pr.approved = true
        AND name = ANY (pr.photos)
    )
  );

CREATE POLICY "Owners read their review photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'review-photos'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins read all review photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'review-photos'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );