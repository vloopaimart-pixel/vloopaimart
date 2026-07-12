-- ============================================================
-- Migration 077: VLOOP FOE Digital Participation Unit Card Engine
-- Phase 48 — Enterprise Digital Card System
-- ============================================================

-- 1. Digital Card Registry
CREATE TABLE foe_digital_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id text NOT NULL UNIQUE,
  unit_id text REFERENCES foe_participation_units(unit_id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE SET NULL,
  
  -- Card Identity
  card_serial integer NOT NULL,
  card_type text NOT NULL CHECK (card_type IN ('SP-100', 'SP-250', 'SP-500', 'SP-1000')),
  smartpoints_value integer NOT NULL,
  tier text NOT NULL CHECK (tier IN ('copper', 'silver', 'gold', 'obsidian')),
  
  -- Visual Theme
  visual_theme jsonb DEFAULT '{}'::jsonb,
  card_front_url text,
  card_back_url text,
  
  -- Security
  encrypted_hash text NOT NULL,
  qr_code text,
  qr_generated_at timestamptz,
  signature_key text,
  tamper_seal text DEFAULT 'intact' CHECK (tamper_seal IN ('intact', 'broken', 'verified')),
  
  -- Status
  status text DEFAULT 'active' CHECK (status IN (
    'pending', 'active', 'locked', 'allocated', 'completed', 'expired', 'revoked'
  )),
  vcos_status text DEFAULT 'verified' CHECK (vcos_status IN ('pending', 'verified', 'flagged', 'suspended')),
  ai_verification_status text DEFAULT 'pending' CHECK (ai_verification_status IN ('pending', 'verified', 'flagged')),
  ai_verification_score numeric DEFAULT 0,
  trust_weight numeric DEFAULT 1.0,
  
  -- Timestamps
  generated_at timestamptz DEFAULT now(),
  activated_at timestamptz,
  locked_at timestamptz,
  allocated_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  
  -- Project linkage
  project_status text,
  project_progress numeric DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foe_digital_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_cards_own" ON foe_digital_cards;
CREATE POLICY "select_cards_own" ON foe_digital_cards FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_cards_auth" ON foe_digital_cards;
CREATE POLICY "insert_cards_auth" ON foe_digital_cards FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "crud_cards_admin" ON foe_digital_cards;
CREATE POLICY "crud_cards_admin" ON foe_digital_cards FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 2. Card Audit Trail
CREATE TABLE foe_card_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id text REFERENCES foe_digital_cards(card_id) ON DELETE SET NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  previous_state jsonb DEFAULT '{}'::jsonb,
  new_state jsonb DEFAULT '{}'::jsonb,
  actor_type text CHECK (actor_type IN ('system', 'ai', 'admin', 'user')),
  actor_id uuid,
  ip_address text,
  user_agent text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_card_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_audit_auth" ON foe_card_audit;
CREATE POLICY "insert_audit_auth" ON foe_card_audit FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "select_audit_admin" ON foe_card_audit;
CREATE POLICY "select_audit_admin" ON foe_card_audit FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Card Visual Themes Configuration
CREATE TABLE foe_card_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_type text NOT NULL UNIQUE CHECK (card_type IN ('SP-100', 'SP-250', 'SP-500', 'SP-1000')),
  tier_name text NOT NULL,
  display_name text NOT NULL,
  
  -- Color Configuration
  primary_color text NOT NULL,
  secondary_color text NOT NULL,
  accent_color text NOT NULL,
  gradient_start text NOT NULL,
  gradient_end text NOT NULL,
  
  -- Material/Front Theme
  front_material text NOT NULL,
  front_pattern text DEFAULT 'gradient',
  border_style text DEFAULT 'premium',
  
  -- Back Theme
  back_pattern text DEFAULT 'dots',
  back_opacity numeric DEFAULT 0.1,
  
  -- Badge Configuration
  badge_icon text DEFAULT 'star',
  badge_position jsonb DEFAULT '{"x": 90, "y": 10}'::jsonb,
  
  -- Display
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_card_themes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_themes_all" ON foe_card_themes;
CREATE POLICY "select_themes_all" ON foe_card_themes FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_themes_admin" ON foe_card_themes;
CREATE POLICY "crud_themes_admin" ON foe_card_themes FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert card themes
INSERT INTO foe_card_themes (card_type, tier_name, display_name, primary_color, secondary_color, accent_color, gradient_start, gradient_end, front_material, display_order) VALUES
('SP-100', 'copper', '100 SmartPoints Unit', '#B87333', '#CD7F32', '#E8C078', '#B87333', '#8B5A2B', 'brushed_steel', 1),
('SP-250', 'silver', '250 SmartPoints Unit', '#C0C0C0', '#A8A8A8', '#E8E8E8', '#D4D4D4', '#8C8C8C', 'platinum_silver', 2),
('SP-500', 'gold', '500 SmartPoints Unit', '#D4AF37', '#1E3A5F', '#2C5282', '#D4AF37', '#B8860B', 'matte_gold_royal', 3),
('SP-1000', 'obsidian', '1000 SmartPoints Unit', '#1A1A1A', '#FFD700', '#FFA500', '#2D2D2D', '#0A0A0A', 'obsidian_gold', 4);

-- 4. Card Serial Numbers
CREATE SEQUENCE foe_card_serial_seq START 100000000 INCREMENT 1;

CREATE OR REPLACE FUNCTION foe_generate_card_serial()
RETURNS integer
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN nextval('foe_card_serial_seq');
END;
$function$;

-- 5. Card ID Generator
CREATE OR REPLACE FUNCTION foe_generate_card_id(p_card_type text)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_serial integer;
  v_checksum text;
  v_card_id text;
BEGIN
  v_serial := foe_generate_card_serial();
  v_checksum := upper(substr(md5(v_serial::text || p_card_type), 1, 4));
  v_card_id := 'VCARD-' || p_card_type || '-' || LPAD(v_serial::text, 9, '0') || '-' || v_checksum;
  RETURN v_card_id;
END;
$function$;

-- 6. Encrypted Hash Generator
CREATE OR REPLACE FUNCTION foe_generate_card_hash(
  p_card_id text,
  p_user_id uuid,
  p_smartpoints integer,
  p_timestamp timestamptz DEFAULT now()
)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_hash text;
BEGIN
  v_hash := 'HSH-' || upper(substring(encode(sha256((p_card_id || p_user_id::text || p_smartpoints::text || p_timestamp::text)::bytea), 'hex'), 1, 32));
  RETURN v_hash;
END;
$function$;

-- 7. QR Code Generator
CREATE OR REPLACE FUNCTION foe_generate_card_qr(p_card_id text)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_qr text;
BEGIN
  v_qr := 'QR-VCARD-' || p_card_id || '-' || to_char(now(), 'YYYYMMDDHH24MISS');
  RETURN v_qr;
END;
$function$;

-- 8. User Card Wallet Summary
CREATE TABLE foe_user_card_wallet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Card Counts
  total_cards integer DEFAULT 0,
  active_cards integer DEFAULT 0,
  locked_cards integer DEFAULT 0,
  completed_cards integer DEFAULT 0,
  pending_cards integer DEFAULT 0,
  
  -- By Type
  cards_100 integer DEFAULT 0,
  cards_250 integer DEFAULT 0,
  cards_500 integer DEFAULT 0,
  cards_1000 integer DEFAULT 0,
  
  -- Value Summary
  total_smartpoints_value integer DEFAULT 0,
  active_smartpoints_value integer DEFAULT 0,
  locked_smartpoints_value integer DEFAULT 0,
  
  -- Project History
  projects_participated integer DEFAULT 0,
  projects_completed integer DEFAULT 0,
  
  -- Timestamps
  last_card_generated_at timestamptz,
  last_card_locked_at timestamptz,
  last_card_completed_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_user_card_wallet ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_wallet_own" ON foe_user_card_wallet;
CREATE POLICY "select_wallet_own" ON foe_user_card_wallet FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_wallet_admin" ON foe_user_card_wallet;
CREATE POLICY "crud_wallet_admin" ON foe_user_card_wallet FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Duplicate Detection
CREATE TABLE foe_card_duplicate_check (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  smartpoints_value integer NOT NULL,
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE SET NULL,
  existing_card_id text REFERENCES foe_digital_cards(card_id) ON DELETE SET NULL,
  duplicate_type text CHECK (duplicate_type IN ('same_user', 'same_project', 'same_value', 'exact_match')),
  detected_at timestamptz DEFAULT now(),
  resolution text CHECK (resolution IN ('allowed', 'blocked', 'reviewed', 'manual')),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_card_duplicate_check ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_dup_admin" ON foe_card_duplicate_check;
CREATE POLICY "crud_dup_admin" ON foe_card_duplicate_check FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Tamper Detection Events
CREATE TABLE foe_tamper_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id text REFERENCES foe_digital_cards(card_id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('hash_mismatch', 'qr_invalid', 'status_tampered', 'manual_report')),
  severity text DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  detected_data jsonb DEFAULT '{}'::jsonb,
  expected_data jsonb DEFAULT '{}'::jsonb,
  detected_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  resolution text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_tamper_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_tamper_admin" ON foe_tamper_events;
CREATE POLICY "crud_tamper_admin" ON foe_tamper_events FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. Indexes
CREATE INDEX IF NOT EXISTS idx_cards_user ON foe_digital_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_status ON foe_digital_cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_project ON foe_digital_cards(project_id);
CREATE INDEX IF NOT EXISTS idx_cards_type ON foe_digital_cards(card_type);
CREATE INDEX IF NOT EXISTS idx_cards_serial ON foe_digital_cards(card_serial);
CREATE INDEX IF NOT EXISTS idx_card_audit_card ON foe_card_audit(card_id);
CREATE INDEX IF NOT EXISTS idx_card_wallet_user ON foe_user_card_wallet(user_id);

-- 12. Triggers
DROP TRIGGER IF EXISTS trg_cards_updated ON foe_digital_cards;
CREATE TRIGGER trg_cards_updated BEFORE UPDATE ON foe_digital_cards
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_card_wallet_updated ON foe_user_card_wallet;
CREATE TRIGGER trg_card_wallet_updated BEFORE UPDATE ON foe_user_card_wallet
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 13. Functions

-- Generate Digital Card
CREATE OR REPLACE FUNCTION foe_generate_digital_card(
  p_user_id uuid,
  p_card_type text,
  p_smartpoints integer,
  p_project_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_card_id text;
  v_serial integer;
  v_hash text;
  v_qr text;
  v_tier text;
  v_card record;
BEGIN
  -- Determine tier
  v_tier := CASE p_card_type
    WHEN 'SP-100' THEN 'copper'
    WHEN 'SP-250' THEN 'silver'
    WHEN 'SP-500' THEN 'gold'
    WHEN 'SP-1000' THEN 'obsidian'
  END;
  
  -- Generate IDs
  v_card_id := foe_generate_card_id(p_card_type);
  v_serial := foe_generate_card_serial();
  v_hash := foe_generate_card_hash(v_card_id, p_user_id, p_smartpoints);
  v_qr := foe_generate_card_qr(v_card_id);
  
  -- Insert card
  INSERT INTO foe_digital_cards (
    card_id, user_id, project_id, card_serial, card_type,
    smartpoints_value, tier, encrypted_hash, qr_code, qr_generated_at
  ) VALUES (
    v_card_id, p_user_id, p_project_id, v_serial, p_card_type,
    p_smartpoints, v_tier, v_hash, v_qr, now()
  ) RETURNING * INTO v_card;
  
  -- Log audit
  INSERT INTO foe_card_audit (card_id, user_id, action, actor_type, new_state)
  VALUES (v_card_id, p_user_id, 'generated', 'system', jsonb_build_object(
    'card_type', p_card_type, 'smartpoints', p_smartpoints, 'project_id', p_project_id
  ));
  
  RETURN jsonb_build_object(
    'success', true,
    'card_id', v_card_id,
    'card_serial', v_serial,
    'tier', v_tier,
    'qr_code', v_qr
  );
END;
$function$;

-- Get User Cards
CREATE OR REPLACE FUNCTION foe_get_user_cards(p_user_id uuid)
RETURNS TABLE (
  card_id text,
  tier text,
  card_type text,
  smartpoints_value integer,
  status text,
  vcos_status text,
  ai_verification_status text,
  trust_weight numeric,
  project_name text,
  project_progress numeric,
  generated_at timestamptz,
  qr_code text
)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    dc.card_id,
    dc.tier,
    dc.card_type,
    dc.smartpoints_value,
    dc.status,
    dc.vcos_status,
    dc.ai_verification_status,
    dc.trust_weight,
    fp.project_name,
    COALESCE(dc.project_progress, 0) as project_progress,
    dc.generated_at,
    dc.qr_code
  FROM foe_digital_cards dc
  LEFT JOIN future_projects_catalog fp ON fp.id = dc.project_id
  WHERE dc.user_id = p_user_id
  ORDER BY dc.generated_at DESC;
END;
$function$;

-- Get Card Wallet Summary
CREATE OR REPLACE FUNCTION foe_get_card_wallet_summary(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_summary jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_cards', COALESCE(COUNT(*), 0),
    'active_cards', COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0),
    'locked_cards', COALESCE(SUM(CASE WHEN status = 'locked' THEN 1 ELSE 0 END), 0),
    'completed_cards', COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0),
    'pending_cards', COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0),
    'cards_100', COALESCE(SUM(CASE WHEN card_type = 'SP-100' THEN 1 ELSE 0 END), 0),
    'cards_250', COALESCE(SUM(CASE WHEN card_type = 'SP-250' THEN 1 ELSE 0 END), 0),
    'cards_500', COALESCE(SUM(CASE WHEN card_type = 'SP-500' THEN 1 ELSE 0 END), 0),
    'cards_1000', COALESCE(SUM(CASE WHEN card_type = 'SP-1000' THEN 1 ELSE 0 END), 0),
    'total_smartpoints', COALESCE(SUM(smartpoints_value), 0),
    'active_smartpoints', COALESCE(SUM(CASE WHEN status = 'active' THEN smartpoints_value ELSE 0 END), 0),
    'locked_smartpoints', COALESCE(SUM(CASE WHEN status = 'locked' THEN smartpoints_value ELSE 0 END), 0)
  ) INTO v_summary
  FROM foe_digital_cards WHERE user_id = p_user_id;
  
  RETURN v_summary;
END;
$function$;

-- Verify Card Integrity
CREATE OR REPLACE FUNCTION foe_verify_card_integrity(p_card_id text)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_card record;
  v_expected_hash text;
  v_valid boolean;
BEGIN
  SELECT * INTO v_card FROM foe_digital_cards WHERE card_id = p_card_id;
  
  IF v_card IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Card not found');
  END IF;
  
  -- Verify hash
  v_expected_hash := foe_generate_card_hash(
    v_card.card_id, v_card.user_id, v_card.smartpoints_value, v_card.generated_at
  );
  
  v_valid := v_card.encrypted_hash = v_expected_hash;
  
  -- Log tamper event if mismatch
  IF NOT v_valid THEN
    INSERT INTO foe_tamper_events (card_id, event_type, severity, detected_data, expected_data)
    VALUES (p_card_id, 'hash_mismatch', 'high', 
      jsonb_build_object('stored_hash', v_card.encrypted_hash),
      jsonb_build_object('expected_hash', v_expected_hash)
    );
    
    UPDATE foe_digital_cards SET tamper_seal = 'broken' WHERE card_id = p_card_id;
  END IF;
  
  RETURN jsonb_build_object(
    'valid', v_valid,
    'card_id', p_card_id,
    'tamper_seal', CASE WHEN v_valid THEN 'intact' ELSE 'broken' END,
    'verified_at', now()
  );
END;
$function$;

-- 14. Initialize card wallet for existing users
INSERT INTO foe_user_card_wallet (user_id)
SELECT id FROM profiles
ON CONFLICT (user_id) DO NOTHING;
