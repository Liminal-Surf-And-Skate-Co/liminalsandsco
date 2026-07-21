/*
# Create spot_pins and video_clips tables for community features

1. New Tables
- `spot_pins`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `title` (text, not null)
  - `notes` (text)
  - `kind` (text, 'surf' or 'skate')
  - `lat` (numeric, latitude)
  - `lng` (numeric, longitude)
  - `photo_url` (text)
  - `tide_tips` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
- `video_clips`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `title` (text, not null)
  - `category` (text, 'skate' or 'surf')
  - `video_url` (text)
  - `votes` (integer, default 0)
  - `approved` (boolean, default false)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on both tables.
- Owner-scoped CRUD policies.
- Admin can read/approve all video clips.
*/

CREATE TABLE IF NOT EXISTS spot_pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  notes text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'surf',
  lat numeric NOT NULL DEFAULT 0,
  lng numeric NOT NULL DEFAULT 0,
  photo_url text,
  tide_tips text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'skate',
  video_url text NOT NULL,
  votes integer NOT NULL DEFAULT 0,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE spot_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_clips ENABLE ROW LEVEL SECURITY;

-- Spot Pins policies
DROP POLICY IF EXISTS "select_own_spots" ON spot_pins;
DROP POLICY IF EXISTS "select_all_spots" ON spot_pins;
DROP POLICY IF EXISTS "insert_own_spots" ON spot_pins;
DROP POLICY IF EXISTS "update_own_spots" ON spot_pins;
DROP POLICY IF EXISTS "delete_own_spots" ON spot_pins;

CREATE POLICY "select_all_spots" ON spot_pins FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_own_spots" ON spot_pins FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_spots" ON spot_pins FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_spots" ON spot_pins FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Video Clips policies
DROP POLICY IF EXISTS "select_clips_public" ON video_clips;
DROP POLICY IF EXISTS "select_clips_admin" ON video_clips;
DROP POLICY IF EXISTS "insert_own_clips" ON video_clips;
DROP POLICY IF EXISTS "update_own_clips" ON video_clips;
DROP POLICY IF EXISTS "delete_own_clips" ON video_clips;

CREATE POLICY "select_clips_public" ON video_clips FOR SELECT
  TO authenticated USING (approved = true);

CREATE POLICY "select_clips_admin" ON video_clips FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "insert_own_clips" ON video_clips FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_clips" ON video_clips FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_clips" ON video_clips FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_spot_pins_location ON spot_pins (lat, lng);
CREATE INDEX IF NOT EXISTS idx_spot_pins_kind ON spot_pins (kind);
CREATE INDEX IF NOT EXISTS idx_video_clips_votes ON video_clips (votes DESC);
CREATE INDEX IF NOT EXISTS idx_video_clips_approved ON video_clips (approved);