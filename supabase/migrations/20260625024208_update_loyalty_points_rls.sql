DROP POLICY IF EXISTS "public_insert_loyalty" ON loyalty_points;
DROP POLICY IF EXISTS "public_select_loyalty" ON loyalty_points;
DROP POLICY IF EXISTS "public_update_loyalty" ON loyalty_points;

CREATE POLICY "users_select_own_loyalty" ON loyalty_points FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_loyalty" ON loyalty_points FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins_update_loyalty" ON loyalty_points FOR UPDATE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (true);
CREATE POLICY "public_select_loyalty" ON loyalty_points FOR SELECT
  TO public USING (true);
