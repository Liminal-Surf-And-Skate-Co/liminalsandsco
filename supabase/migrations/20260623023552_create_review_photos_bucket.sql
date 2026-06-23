-- Create the review-photos bucket (private, not public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  false,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket (storage.objects inherits RLS from bucket)
-- Default policies: only allow authenticated users to upload if they have a review row
-- Create SELECT policy for authenticated users to read their own photos
CREATE POLICY "review_photos_select_own" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'review-photos' AND owner = auth.uid());

-- Create SELECT policy for admins to read all photos
CREATE POLICY "review_photos_select_admin" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'review-photos' AND EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
  ));

-- Create INSERT policy requiring a product_reviews row exists for the user
CREATE POLICY "review_photos_insert_own" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'review-photos'
    AND owner = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.product_reviews
      WHERE user_id = auth.uid()
    )
  );

-- Create DELETE policy for users to delete their own photos
CREATE POLICY "review_photos_delete_own" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'review-photos' AND owner = auth.uid());