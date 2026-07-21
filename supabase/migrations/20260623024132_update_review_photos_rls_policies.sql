/*
# Update review-photos storage RLS policies for security hardening

1. Security Changes
- Drop existing review-photos policies and recreate with proper role checks
- SELECT: users can read their own photos; admins can read all
- INSERT: users can only upload if they have a product_reviews row
- DELETE: users can delete their own photos
- UPDATE: not allowed
- Admin check uses auth.users raw_user_meta_data->>'role' field (same as existing site_settings policy)
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "review_photos_select_own" ON storage.objects;
DROP POLICY IF EXISTS "review_photos_select_admin" ON storage.objects;
DROP POLICY IF EXISTS "review_photos_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "review_photos_delete_own" ON storage.objects;

-- Ensure the bucket exists with proper settings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- SELECT: authenticated users can read their own photos
CREATE POLICY "review_photos_select_own" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'review-photos' AND owner = auth.uid());

-- SELECT: authenticated admins can read all photos
CREATE POLICY "review_photos_select_admin" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'review-photos' AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- INSERT: authenticated users can only upload if they have a product_reviews row
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

-- DELETE: authenticated users can delete their own photos
CREATE POLICY "review_photos_delete_own" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'review-photos' AND owner = auth.uid());