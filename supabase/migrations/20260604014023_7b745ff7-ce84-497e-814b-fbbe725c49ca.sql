CREATE POLICY "Anyone reads review photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-photos');

CREATE POLICY "Users upload own review photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own review photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own review photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);