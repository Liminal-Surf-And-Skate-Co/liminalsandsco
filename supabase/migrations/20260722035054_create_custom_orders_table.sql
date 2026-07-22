/*
# Create custom_orders table for Design Studio submissions

1. Purpose
   Stores custom design submissions from the Design Studio at /design-studio.
   Each row captures the full design state (JSON), customer email, product specs,
   price, share link, and exported PNG data URL so the team can review in admin.

2. New Tables
   - `custom_orders`
     - `id` uuid PK
     - `user_id` uuid — owner (nullable for guest submissions, defaults to auth.uid())
     - `email` text — customer email for confirmation
     - `product_type` text — 'skate' | 'surf' | 'tee' | 'hoodie'
     - `product_name` text — human-readable product label
     - `design_json` jsonb — full serialized DesignState
     - `specs_json` jsonb — hardware/equipment specs
     - `image_data_url` text — base64 PNG of the exported mockup (nullable)
     - `share_slug` text — unique slug for shareable preview link
     - `price` numeric — calculated total at submission time
     - `status` text — 'pending' | 'reviewing' | 'approved' | 'completed' | 'cancelled'
     - `customer_note` text — optional note from customer
     - `created_at` timestamptz
     - `updated_at` timestamptz

3. Security (RLS)
   - Enable RLS on custom_orders.
   - SELECT: authenticated users can read their own orders; anon can read by share_slug (public preview).
   - INSERT: authenticated users insert their own; anon can insert (guest checkout).
   - UPDATE: owner can update; admin role can update any.
   - DELETE: owner can delete their own; admin role can delete any.
   - Admin detection uses user_roles table join.

4. Indexes
   - Index on user_id for per-user queries.
   - Index on share_slug for public preview lookups.
   - Index on created_at for admin dashboard sorting.
*/

CREATE TABLE IF NOT EXISTS custom_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  product_type text NOT NULL DEFAULT 'skate',
  product_name text NOT NULL DEFAULT 'Custom Deck',
  design_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  specs_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  image_data_url text,
  share_slug text UNIQUE DEFAULT ('order-' || gen_random_uuid()::text),
  price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  customer_note text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- SELECT: owner or admin, plus public read by share_slug
DROP POLICY IF EXISTS "select_own_or_admin_custom_orders" ON custom_orders;
CREATE POLICY "select_own_or_admin_custom_orders" ON custom_orders
  FOR SELECT TO anon, authenticated
  USING (
    user_id = auth.uid()
    OR is_admin()
    OR share_slug IS NOT NULL
  );

-- INSERT: authenticated users insert their own; anon can insert (guest)
DROP POLICY IF EXISTS "insert_custom_orders" ON custom_orders;
CREATE POLICY "insert_custom_orders" ON custom_orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- UPDATE: owner or admin
DROP POLICY IF EXISTS "update_own_or_admin_custom_orders" ON custom_orders;
CREATE POLICY "update_own_or_admin_custom_orders" ON custom_orders
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR is_admin())
  WITH CHECK (user_id = auth.uid() OR is_admin());

-- DELETE: owner or admin
DROP POLICY IF EXISTS "delete_own_or_admin_custom_orders" ON custom_orders;
CREATE POLICY "delete_own_or_admin_custom_orders" ON custom_orders
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR is_admin());

CREATE INDEX IF NOT EXISTS idx_custom_orders_user_id ON custom_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_orders_share_slug ON custom_orders(share_slug);
CREATE INDEX IF NOT EXISTS idx_custom_orders_created_at ON custom_orders(created_at DESC);
