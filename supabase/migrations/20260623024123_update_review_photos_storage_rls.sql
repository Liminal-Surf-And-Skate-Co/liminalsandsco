/*
# Update review-photos storage RLS policies

1. Security Changes
- Update storage RLS policies for the review-photos bucket to enforce that uploads are tied to existing reviews.
- The edge function (review-photo-upload) handles server-side MIME validation and uploads via service role.
- Direct storage policies are a backup defense against any direct client access.
- SELECT: users can read their own photos; admins can read all.
- INSERT: users can only upload if they have a product_reviews row.
- DELETE: users can delete their own photos.
- UPDATE: not allowed.
*/

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

-- Drop existing policies
DROP POLICY IF EXISTS "review_photos_select_own" ON storage.objects;
DROP POLICY IF EXISTS "review_photos_select_admin" ON storage.objects;
DROP POLICY IF EXISTS "review_photos_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "review_photos_delete_own" ON storage.objects;

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