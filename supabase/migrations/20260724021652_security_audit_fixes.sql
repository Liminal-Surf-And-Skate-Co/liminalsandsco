/*
# Database Security Audit Fixes

## Summary
Resolves multiple Supabase security audit warnings across schema functions,
RLS policies, and data privacy controls.

## 1. Fix Mutable Search Paths (Schema Spoofing Prevention)
- `public.touch_updated_at()` — set search_path to public (already set, reaffirmed)
- `public.handle_new_user()` — set search_path to public (was missing)
- `public.is_admin()` — set search_path to public (was missing)
This prevents malicious users from creating objects in other schemas that
these SECURITY DEFINER functions might resolve against.

## 2. Restrict SECURITY DEFINER Execution
- Revoke EXECUTE on `handle_new_user()` and `is_admin()` from anon,
  authenticated, and public roles. These functions are only used internally
  by triggers and RLS policies — direct RPC access is unnecessary.

## 3. Fix Overly Permissive INSERT Policies (WITH CHECK (true))
- `custom_orders`: replace `insert_custom_orders` with auth.uid() requirement
- `customers`: replace `public_insert_customers` with auth.uid() requirement
- `order_items`: replace `public_insert_order_items` with auth.uid() requirement

## 4. Restrict loyalty_points UPDATE
- Drop `admins_update_loyalty` (had WITH CHECK (true)) and replace with
  a policy requiring public.is_admin() for both USING and WITH CHECK.

## 5. Fix custom_orders SELECT Privacy Vulnerability
- The existing SELECT policy allowed public reads when `share_slug IS NOT NULL`.
  Since `share_slug` is auto-generated on creation, ALL rows were publicly
  readable — exposing customer emails, notes, pricing, and internal specs.
- Add `is_public_shared BOOLEAN DEFAULT false` column.
- Replace SELECT policy: authenticated users read own orders or admin;
  public read only when `is_public_shared = true AND share_slug IS NOT NULL`.

## 6. Manual Dashboard Note
- Leaked Password Protection must be enabled manually in the Supabase
  Dashboard under Authentication -> Security Settings. This cannot be
  done via SQL migration.
*/

-- =========================================================
-- 1. Fix Mutable Search Paths
-- =========================================================
ALTER FUNCTION public.touch_updated_at() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;

-- =========================================================
-- 2. Revoke Direct RPC Execution on SECURITY DEFINER Functions
-- =========================================================
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated, public;

-- =========================================================
-- 3. Fix Overly Permissive INSERT Policies
-- =========================================================

-- custom_orders: require authenticated user
DROP POLICY IF EXISTS "insert_custom_orders" ON public.custom_orders;
CREATE POLICY "insert_own_custom_orders" ON public.custom_orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- customers: require authenticated user
DROP POLICY IF EXISTS "public_insert_customers" ON public.customers;
CREATE POLICY "insert_own_customers" ON public.customers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- order_items: require authenticated user
DROP POLICY IF EXISTS "public_insert_order_items" ON public.order_items;
CREATE POLICY "insert_own_order_items" ON public.order_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- =========================================================
-- 4. Restrict loyalty_points UPDATE to admins only
-- =========================================================
DROP POLICY IF EXISTS "admins_update_loyalty" ON public.loyalty_points;
CREATE POLICY "admins_update_loyalty" ON public.loyalty_points
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =========================================================
-- 5. Fix custom_orders SELECT Privacy Vulnerability
-- =========================================================

-- Add is_public_shared column (defaults to false — no existing rows exposed)
ALTER TABLE public.custom_orders
  ADD COLUMN IF NOT EXISTS is_public_shared BOOLEAN DEFAULT false;

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "select_own_or_admin_custom_orders" ON public.custom_orders;

-- Authenticated users can read their own orders or admins can read all
CREATE POLICY "select_own_or_admin_custom_orders" ON public.custom_orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- Public can only read explicitly shared orders
CREATE POLICY "select_public_shared_custom_orders" ON public.custom_orders
  FOR SELECT TO anon, authenticated
  USING (is_public_shared = true AND share_slug IS NOT NULL);
