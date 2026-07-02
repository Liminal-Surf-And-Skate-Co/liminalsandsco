-- Security hardening for site_settings - deny public access to sensitive keys
-- First, drop the public select policy
DROP POLICY IF EXISTS "anyone_select_site_settings" ON site_settings;

-- Create new policy that denies access to sensitive webhook/API keys
CREATE POLICY "public_select_non_sensitive_settings" ON site_settings FOR SELECT
  TO public USING (
    key NOT IN ('discord_orders_webhook_url', 'discord_custom_orders_webhook_url', 'stripe_secret_key', 'stripe_webhook_secret', 'sendgrid_api_key', 'australia_post_api_key', 'sendle_api_key')
  );

-- Ensure admin policies exist for full access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'admins_all_access_settings') THEN
    CREATE POLICY "admins_all_access_settings" ON site_settings FOR ALL
      TO authenticated USING (private.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Function to add points for new user signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO loyalty_points (user_id, points, tier, total_earned, total_redeemed)
  VALUES (NEW.id, 50, 'bronze', 50, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert default checklist presets for Academy Pack My Bag feature
INSERT INTO academy_checklist_presets (name, activity_type, items) VALUES
('Dawn Patrol Surf Session', 'surf', '[
  {"name": "Wetsuit (check thickness for water temp)", "required": true},
  {"name": "Surfboard", "required": true},
  {"name": "Fins", "required": true},
  {"name": "Leash", "required": true},
  {"name": "Surf wax (apply fresh coat)", "required": true},
  {"name": "Traction pad (if needed)", "required": false},
  {"name": "Board bag", "required": false},
  {"name": "Towel", "required": true},
  {"name": "Sunscreen (zinc for face)", "required": true},
  {"name": "Water bottle", "required": true},
  {"name": "Change of clothes", "required": false},
  {"name": "Snacks", "required": false}
]'::jsonb),
('Street Plaza Night Skate', 'skate', '[
  {"name": "Skateboard deck", "required": true},
  {"name": "Trucks (check kingpin tightness)", "required": true},
  {"name": "Wheels", "required": true},
  {"name": "Bearings (cleaned & lubed)", "required": true},
  {"name": "Hardware (spare bolts)", "required": true},
  {"name": "Grip tape (check wear)", "required": false},
  {"name": "Skate tool", "required": true},
  {"name": "Extra hardware set", "required": false},
  {"name": "Wax (curb/slide)", "required": false},
  {"name": "Water bottle", "required": true},
  {"name": "Phone with charged battery", "required": true},
  {"name": "Headlamp or head torch", "required": false},
  {"name": "First aid basics", "required": false}
]'::jsonb),
('Park & Bowl Session', 'skate', '[
  {"name": "Complete skateboard", "required": true},
  {"name": "Wrist guards", "required": false},
  {"name": "Knee pads", "required": true},
  {"name": "Elbow pads", "required": false},
  {"name": "Helmet", "required": true},
  {"name": "Skate tool", "required": true},
  {"name": "Spare bearings", "required": false},
  {"name": "Spare kingpin nut", "required": false},
  {"name": "Water bottle", "required": true},
  {"name": "Snacks", "required": false}
]'::jsonb),
('Longboard Cruise Session', 'skate', '[
  {"name": "Longboard or cruiser", "required": true},
  {"name": "Slide gloves (for downhill)", "required": false},
  {"name": "Helmet", "required": false},
  {"name": "Skate tool", "required": true},
  {"name": "Water bottle", "required": true},
  {"name": "Bluetooth speaker", "required": false}
]'::jsonb),
('Weekend Surf Trip', 'surf', '[
  {"name": "2+ Surfboards (variety)", "required": true},
  {"name": "Wetsuits (check water temp)", "required": true},
  {"name": "Rash guards", "required": false},
  {"name": "Multiple leashes", "required": true},
  {"name": "Spare fins & fin keys", "required": true},
  {"name": "Wax (warm + cool)", "required": true},
  {"name": "Ding repair kit", "required": true},
  {"name": "Board socks/bags", "required": true},
  {"name": "Sunscreen + zinc", "required": true},
  {"name": "First aid kit", "required": true},
  {"name": "Wetsuit shampoo", "required": false},
  {"name": "Towels (2+)", "required": true}
]'::jsonb)
ON CONFLICT DO NOTHING;