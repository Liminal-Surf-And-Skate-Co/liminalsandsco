CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze',
  total_earned INT NOT NULL DEFAULT 0,
  total_redeemed INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_loyalty" ON loyalty_points FOR INSERT
  TO public WITH CHECK (true);

CREATE POLICY "public_select_loyalty" ON loyalty_points FOR SELECT
  TO public USING (true);

CREATE POLICY "public_update_loyalty" ON loyalty_points FOR UPDATE
  TO public USING (true) WITH CHECK (true);

-- Rewards table for redeemable perks
CREATE TABLE IF NOT EXISTS rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  points_required INT NOT NULL,
  tier_unlocked TEXT NOT NULL DEFAULT 'bronze',
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_rewards" ON rewards FOR SELECT
  TO public USING (true);
CREATE POLICY "admins_insert_rewards" ON rewards FOR INSERT
  TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_update_rewards" ON rewards FOR UPDATE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admins_delete_rewards" ON rewards FOR DELETE
  TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Insert default rewards
INSERT INTO rewards (title, description, points_required, tier_unlocked, available) VALUES
  ('5% Off Coupon', 'Get 5% off your next purchase', 100, 'bronze', true),
  ('Free Shipping', 'Free shipping on any order', 250, 'bronze', true),
  ('10% Off Coupon', 'Get 10% off your next purchase', 500, 'silver', true),
  ('Early Access Drop', 'Early access to new product drops', 750, 'silver', true),
  ('15% Off Coupon', 'Get 15% off your next purchase', 1000, 'gold', true),
  ('Limited Edition Tee', 'Free limited edition tee (in-stock)', 1500, 'gold', true),
  ('Custom Board Art', 'Custom artwork on your next board', 2000, 'platinum', true),
  ('VIP Event Invite', 'Invite to exclusive launch events', 2500, 'platinum', true)
ON CONFLICT DO NOTHING;
