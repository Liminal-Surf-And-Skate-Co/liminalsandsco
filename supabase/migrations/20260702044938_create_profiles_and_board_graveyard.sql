-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  username TEXT UNIQUE,
  avatar_url TEXT,
  points_balance INTEGER DEFAULT 0,
  role TEXT DEFAULT 'member',
  gear_specs JSONB DEFAULT '{}'::jsonb,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles - users can only see/update their own profile
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'users_select_own_profile') THEN
    CREATE POLICY "users_select_own_profile" ON profiles FOR SELECT
      TO authenticated USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'users_insert_own_profile') THEN
    CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT
      TO authenticated WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'users_update_own_profile') THEN
    CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
      TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'admins_full_access_profiles') THEN
    CREATE POLICY "admins_full_access_profiles" ON profiles FOR ALL
      TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Create board_graveyard table for snapped board memorials
CREATE TABLE IF NOT EXISTS board_graveyard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  board_type TEXT NOT NULL DEFAULT 'skate',
  image_url TEXT,
  trick_attempted TEXT NOT NULL DEFAULT '',
  spot_tagged TEXT NOT NULL DEFAULT '',
  memory_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  description TEXT NOT NULL DEFAULT '',
  board_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE board_graveyard ENABLE ROW LEVEL SECURITY;

-- RLS policies for board_graveyard
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'board_graveyard' AND policyname = 'public_select_graveyard') THEN
    CREATE POLICY "public_select_graveyard" ON board_graveyard FOR SELECT
      TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'board_graveyard' AND policyname = 'authenticated_insert_graveyard') THEN
    CREATE POLICY "authenticated_insert_graveyard" ON board_graveyard FOR INSERT
      TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'board_graveyard' AND policyname = 'owners_update_graveyard') THEN
    CREATE POLICY "owners_update_graveyard" ON board_graveyard FOR UPDATE
      TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'board_graveyard' AND policyname = 'owners_delete_graveyard') THEN
    CREATE POLICY "owners_delete_graveyard" ON board_graveyard FOR DELETE
      TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create academy_checklist_presets for Pack My Bag feature
CREATE TABLE IF NOT EXISTS academy_checklist_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  activity_type TEXT NOT NULL DEFAULT 'surf',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE academy_checklist_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_checklist_presets" ON academy_checklist_presets FOR SELECT
  TO public USING (true);
CREATE POLICY "admins_manage_checklist_presets" ON academy_checklist_presets FOR ALL
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Create order_items table for order line items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_slug TEXT NOT NULL,
  product_title TEXT NOT NULL,
  variant TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_order_items" ON order_items FOR SELECT
  TO public USING (true);
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
  TO public WITH CHECK (true);

-- Add fulfillment_source to orders if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'fulfillment_source') THEN
    ALTER TABLE orders ADD COLUMN fulfillment_source TEXT DEFAULT 'online';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tracking_link') THEN
    ALTER TABLE orders ADD COLUMN tracking_link TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'invoice_pdf_url') THEN
    ALTER TABLE orders ADD COLUMN invoice_pdf_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_id') THEN
    ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Update orders RLS to be more restrictive
DROP POLICY IF EXISTS "public_select_orders" ON orders;
DROP POLICY IF EXISTS "public_insert_orders" ON orders;

CREATE POLICY "users_select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_select_all_orders" ON orders FOR SELECT
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "users_insert_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "public_insert_guest_orders" ON orders FOR INSERT
  TO public WITH CHECK (user_id IS NULL);
CREATE POLICY "admins_update_orders" ON orders FOR UPDATE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Add is_preorder and is_liminal_edition to products if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_preorder') THEN
    ALTER TABLE products ADD COLUMN is_preorder BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_liminal_edition') THEN
    ALTER TABLE products ADD COLUMN is_liminal_edition BOOLEAN DEFAULT false;
  END IF;
END $$;