-- Liminal Surf & Skate Co Database Schema
-- Full schema for the Sydney Supabase project

-- ============================================
-- 1. APP ROLES (custom enum)
-- ============================================
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user');

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'other',
  product_type TEXT,
  target_group TEXT DEFAULT 'unisex',
  description TEXT NOT NULL DEFAULT '',
  details JSONB NOT NULL DEFAULT '[]'::jsonb,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sale_price NUMERIC(10, 2),
  colour TEXT,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  stock_count INTEGER NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_select_products" ON products FOR SELECT
  TO public USING (true);
CREATE POLICY "admins_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_update_products" ON products FOR UPDATE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_delete_products" ON products FOR DELETE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 3. CUSTOMERS TABLE
-- ============================================
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_customers" ON customers FOR INSERT
  TO public WITH CHECK (true);
CREATE POLICY "public_select_customers" ON customers FOR SELECT
  TO public USING (true);

-- ============================================
-- 4. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO public WITH CHECK (true);
CREATE POLICY "public_select_orders" ON orders FOR SELECT
  TO public USING (true);

-- ============================================
-- 5. USER ROLES TABLE
-- ============================================
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_roles" ON user_roles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins_insert_user_roles" ON user_roles FOR INSERT
  TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_delete_user_roles" ON user_roles FOR DELETE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 6. SITE SETTINGS TABLE
-- ============================================
CREATE TABLE site_settings (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''::text,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_select_site_settings" ON site_settings FOR SELECT
  TO public USING (true);
CREATE POLICY "admins_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 7. EVENTS TABLE
-- ============================================
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  rsvp_url TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_select_published_events" ON events FOR SELECT
  TO public USING (published = true);
CREATE POLICY "admins_insert_events" ON events FOR INSERT
  TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_update_events" ON events FOR UPDATE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_delete_events" ON events FOR DELETE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 8. NEWSLETTERS TABLE
-- ============================================
CREATE TABLE newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  cover_image TEXT,
  links JSONB,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_select_published_newsletters" ON newsletters FOR SELECT
  TO public USING (published = true);
CREATE POLICY "admins_insert_newsletters" ON newsletters FOR INSERT
  TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_update_newsletters" ON newsletters FOR UPDATE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_delete_newsletters" ON newsletters FOR DELETE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 9. REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Anonymous',
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL DEFAULT '',
  photos TEXT[] NOT NULL DEFAULT '{}',
  helpful_count INTEGER NOT NULL DEFAULT 0,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_select_approved_reviews" ON reviews FOR SELECT
  TO public USING (approved = true);
CREATE POLICY "authenticated_insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owners_update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owners_delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- 10. SPOT PINS TABLE
-- ============================================
CREATE TABLE spot_pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'surf',
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  tide_tips TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE spot_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_select_spot_pins" ON spot_pins FOR SELECT
  TO public USING (true);
CREATE POLICY "authenticated_insert_spot_pins" ON spot_pins FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owners_update_spot_pins" ON spot_pins FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owners_delete_spot_pins" ON spot_pins FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- 11. VIDEO CLIPS TABLE
-- ============================================
CREATE TABLE video_clips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'skate',
  video_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE video_clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_select_approved_clips" ON video_clips FOR SELECT
  TO public USING (status = 'approved');
CREATE POLICY "authenticated_insert_clips" ON video_clips FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owners_update_clips" ON video_clips FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins_delete_clips" ON video_clips FOR DELETE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 12. PRIVATE SCHEMA HELPER
-- ============================================
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(user_id UUID, required_role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = user_id AND role = required_role
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- 13. STORAGE BUCKET FOR REVIEW PHOTOS
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('review-photos', 'review-photos', true, 5242880, '{image/png,image/jpeg,image/webp,image/gif}')
ON CONFLICT (id) DO NOTHING;
