-- ============================================================
-- Migration 076: VLOOP Future Opportunity Exchange (FOE) Participation Engine
-- Phase 47 — SmartPoints-Based Participation Engine
-- ============================================================

-- 1. SmartPoints Source Configuration (VCOS Core Rules)
CREATE TABLE foe_smartpoints_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('purchase', 'careclub')),
  points_per_unit numeric NOT NULL,
  currency_unit text DEFAULT 'INR',
  cashback_percent numeric DEFAULT 0,
  benefit_percent numeric DEFAULT 0,
  activation_days integer DEFAULT 30,
  insurance_rules_apply boolean DEFAULT true,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(source_type)
);

ALTER TABLE foe_smartpoints_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_sp_config_all" ON foe_smartpoints_config;
CREATE POLICY "select_sp_config_all" ON foe_smartpoints_config FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_sp_config_admin" ON foe_smartpoints_config;
CREATE POLICY "crud_sp_config_admin" ON foe_smartpoints_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert VCOS Core Rules (Permanent)
INSERT INTO foe_smartpoints_config (source_type, points_per_unit, cashback_percent, benefit_percent, description) VALUES
('purchase', 40, 2, 0, 'Purchase Engine: 40 INR = 1 SmartPoint, 2% Cashback (Wallet-1), 30-Day Activation'),
('careclub', 10, 0, 5, 'Care Club Engine: 10 INR Contribution = 5 SmartPoints, 5% Benefit (Wallet-2), 30-Day Activation');

-- 2. Participation Units Configuration
CREATE TABLE foe_unit_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code text NOT NULL UNIQUE,
  smartpoints_required integer NOT NULL,
  tier text NOT NULL CHECK (tier IN ('standard', 'silver', 'gold', 'platinum')),
  display_name text NOT NULL,
  description text,
  color_theme text DEFAULT 'blue',
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_unit_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_units_all" ON foe_unit_types;
CREATE POLICY "select_units_all" ON foe_unit_types FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_units_admin" ON foe_unit_types;
CREATE POLICY "crud_units_admin" ON foe_unit_types FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO foe_unit_types (unit_code, smartpoints_required, tier, display_name, priority) VALUES
('SP-100', 100, 'standard', '100 SP Unit', 1),
('SP-250', 250, 'silver', '250 SP Unit', 2),
('SP-500', 500, 'gold', '500 SP Unit', 3),
('SP-1000', 1000, 'platinum', '1000 SP Unit', 4);

-- 3. User SmartPoints Balance
CREATE TABLE foe_user_smartpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_purchase_sp integer DEFAULT 0,
  total_careclub_sp integer DEFAULT 0,
  total_earned_sp integer DEFAULT 0,
  total_allocated_sp integer DEFAULT 0,
  total_locked_sp integer DEFAULT 0,
  available_sp integer DEFAULT 0,
  pending_activation_sp integer DEFAULT 0,
  activated_at timestamptz,
  last_earned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foe_user_smartpoints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_sp_own" ON foe_user_smartpoints;
CREATE POLICY "select_sp_own" ON foe_user_smartpoints FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_sp_admin" ON foe_user_smartpoints;
CREATE POLICY "crud_sp_admin" ON foe_user_smartpoints FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. FOE Wallet
CREATE TABLE foe_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  wallet_balance integer DEFAULT 0,
  allocated_balance integer DEFAULT 0,
  locked_balance integer DEFAULT 0,
  completed_units integer DEFAULT 0,
  pending_units integer DEFAULT 0,
  total_participation_value integer DEFAULT 0,
  last_transaction_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foe_wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_wallet_own" ON foe_wallets;
CREATE POLICY "select_wallet_own" ON foe_wallets FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_wallet_admin" ON foe_wallets;
CREATE POLICY "crud_wallet_admin" ON foe_wallets FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Wallet Transaction Log
CREATE TABLE foe_wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES foe_wallets(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN (
    'earn_purchase', 'earn_careclub', 'allocate', 'lock', 'unlock',
    'complete', 'expire', 'adjustment', 'refund'
  )),
  amount integer NOT NULL,
  previous_balance integer,
  new_balance integer,
  source_reference text,
  source_type text,
  source_id uuid,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_txn_own" ON foe_wallet_transactions;
CREATE POLICY "select_txn_own" ON foe_wallet_transactions FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_txn_admin" ON foe_wallet_transactions;
CREATE POLICY "crud_txn_admin" ON foe_wallet_transactions FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. SmartPoints Earning Log
CREATE TABLE foe_earnings_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_type text NOT NULL CHECK (source_type IN ('purchase', 'careclub')),
  source_id uuid,
  source_reference text,
  source_amount numeric NOT NULL,
  smartpoints_earned integer NOT NULL,
  wallet_type integer DEFAULT 1 CHECK (wallet_type IN (1, 2)),
  activation_date date NOT NULL DEFAULT (current_date + interval '30 days'),
  is_activated boolean DEFAULT false,
  activated_at timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'activated', 'used', 'expired')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_earnings_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_earn_own" ON foe_earnings_log;
CREATE POLICY "select_earn_own" ON foe_earnings_log FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_earn_auth" ON foe_earnings_log;
CREATE POLICY "insert_earn_auth" ON foe_earnings_log FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "crud_earn_admin" ON foe_earnings_log;
CREATE POLICY "crud_earn_admin" ON foe_earnings_log FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. Participation Units Generated
CREATE TABLE foe_participation_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id text NOT NULL UNIQUE,
  unit_code text NOT NULL REFERENCES foe_unit_types(unit_code),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE SET NULL,
  smartpoints_value integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN (
    'pending', 'allocated', 'locked', 'active', 'completed', 'expired', 'cancelled'
  )),
  qr_code text,
  qr_generated_at timestamptz,
  ai_verification_status text DEFAULT 'pending' CHECK (ai_verification_status IN ('pending', 'verified', 'flagged')),
  ai_verification_score numeric DEFAULT 0,
  allocated_at timestamptz,
  locked_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  audit_hash text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foe_participation_units ENABLE ROW LEVEL SECURITY;

-- Create unique unit_id sequence
CREATE SEQUENCE foe_unit_seq START 1000000 INCREMENT 1;

CREATE OR REPLACE FUNCTION generate_unit_id()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_seq bigint;
  v_unit_id text;
BEGIN
  v_seq := nextval('foe_unit_seq');
  v_unit_id := 'FOE-' || to_char(current_date, 'YYYY') || '-' || LPAD(v_seq::text, 8, '0');
  RETURN v_unit_id;
END;
$function$;

DROP POLICY IF EXISTS "select_units_own" ON foe_participation_units;
CREATE POLICY "select_units_own" ON foe_participation_units FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_units_auth" ON foe_participation_units;
CREATE POLICY "insert_units_auth" ON foe_participation_units FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "crud_units_full_admin" ON foe_participation_units;
CREATE POLICY "crud_units_full_admin" ON foe_participation_units FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Unit Audit Trail
CREATE TABLE foe_unit_audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id text REFERENCES foe_participation_units(unit_id) ON DELETE SET NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  previous_status text,
  new_status text,
  actor_type text CHECK (actor_type IN ('system', 'ai', 'admin', 'user')),
  actor_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_unit_audit_trail ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_audit_auth" ON foe_unit_audit_trail;
CREATE POLICY "insert_audit_auth" ON foe_unit_audit_trail FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "select_audit_admin" ON foe_unit_audit_trail;
CREATE POLICY "select_audit_admin" ON foe_unit_audit_trail FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Project Participation Summary
CREATE TABLE foe_project_participation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_units integer DEFAULT 0,
  total_smartpoints integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn')),
  first_participation_at timestamptz DEFAULT now(),
  last_participation_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE foe_project_participation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_part_own" ON foe_project_participation;
CREATE POLICY "select_part_own" ON foe_project_participation FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_part_admin" ON foe_project_participation;
CREATE POLICY "crud_part_admin" ON foe_project_participation FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Project Progress Tracking
CREATE TABLE foe_project_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  total_target_units integer DEFAULT 0,
  total_units_generated integer DEFAULT 0,
  total_units_remaining integer DEFAULT 0,
  total_participants integer DEFAULT 0,
  total_smartpoints_allocated integer DEFAULT 0,
  progress_percent numeric DEFAULT 0,
  transparency_score integer DEFAULT 100 CHECK (transparency_score BETWEEN 0 AND 100),
  last_updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_project_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_progress_all" ON foe_project_progress;
CREATE POLICY "select_progress_all" ON foe_project_progress FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "crud_progress_admin" ON foe_project_progress;
CREATE POLICY "crud_progress_admin" ON foe_project_progress FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. Unit Conversion Rules
CREATE TABLE foe_conversion_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversion_type text NOT NULL CHECK (conversion_type IN ('optimal', 'greedy', 'manual')),
  priority_order jsonb DEFAULT '[1000, 500, 250, 100]'::jsonb,
  allow_partial integer DEFAULT 0,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_conversion_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_conv_all" ON foe_conversion_rules;
CREATE POLICY "select_conv_all" ON foe_conversion_rules FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_conv_admin" ON foe_conversion_rules;
CREATE POLICY "crud_conv_admin" ON foe_conversion_rules FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO foe_conversion_rules (conversion_type, priority_order, is_default) VALUES
('optimal', '[1000, 500, 250, 100]'::jsonb, true),
('greedy', '[100, 250, 500, 1000]'::jsonb, false);

-- 12. Eligibility Validation
CREATE TABLE foe_eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE SET NULL,
  check_type text NOT NULL CHECK (check_type IN ('project', 'unit', 'conversion')),
  is_eligible boolean DEFAULT false,
  eligibility_score integer DEFAULT 0,
  eligibility_factors jsonb DEFAULT '{}'::jsonb,
  failure_reasons jsonb DEFAULT '[]'::jsonb,
  ai_recommendation text,
  checked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_eligibility_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_elig_own" ON foe_eligibility_checks;
CREATE POLICY "select_elig_own" ON foe_eligibility_checks FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_elig_auth" ON foe_eligibility_checks;
CREATE POLICY "insert_elig_auth" ON foe_eligibility_checks FOR INSERT
  TO authenticated WITH CHECK (true);

-- 13. Fraud Detection Events
CREATE TABLE foe_fraud_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN (
    'duplicate_allocation', 'velocity_exceeded', 'pattern_anomaly',
    'suspicious_timing', 'account_correlation', 'rule_violation'
  )),
  severity text DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE SET NULL,
  unit_id text REFERENCES foe_participation_units(unit_id) ON DELETE SET NULL,
  detection_method text CHECK (detection_method IN ('rule', 'ai', 'manual', 'system')),
  event_data jsonb DEFAULT '{}'::jsonb,
  flags jsonb DEFAULT '[]'::jsonb,
  action_taken text CHECK (action_taken IN ('monitoring', 'blocked', 'reviewed', 'escalated')),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  resolution_notes text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foe_fraud_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_fraud_admin" ON foe_fraud_events;
CREATE POLICY "crud_fraud_admin" ON foe_fraud_events FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 14. Live Transparency Dashboard
CREATE TABLE foe_transparency_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  stat_date date NOT NULL DEFAULT current_date,
  total_units_generated integer DEFAULT 0,
  total_participants integer DEFAULT 0,
  total_smartpoints_allocated integer DEFAULT 0,
  active_units integer DEFAULT 0,
  completed_units integer DEFAULT 0,
  pending_units integer DEFAULT 0,
  avg_participation_per_user numeric DEFAULT 0,
  participation_velocity numeric DEFAULT 0,
  transparency_score integer DEFAULT 100,
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, stat_date)
);

ALTER TABLE foe_transparency_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_trans_all" ON foe_transparency_stats;
CREATE POLICY "select_trans_all" ON foe_transparency_stats FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "crud_trans_admin" ON foe_transparency_stats;
CREATE POLICY "crud_trans_admin" ON foe_transparency_stats FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 15. Customer Dashboard Aggregation
CREATE TABLE foe_customer_dashboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  available_smartpoints integer DEFAULT 0,
  allocated_smartpoints integer DEFAULT 0,
  locked_smartpoints integer DEFAULT 0,
  total_units integer DEFAULT 0,
  active_units integer DEFAULT 0,
  completed_units integer DEFAULT 0,
  pending_units integer DEFAULT 0,
  projects_participated integer DEFAULT 0,
  pending_activation_sp integer DEFAULT 0,
  last_participation_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_customer_dashboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_dash_own" ON foe_customer_dashboard;
CREATE POLICY "select_dash_own" ON foe_customer_dashboard FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_dash_admin" ON foe_customer_dashboard;
CREATE POLICY "crud_dash_admin" ON foe_customer_dashboard FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 16. Indexes
CREATE INDEX IF NOT EXISTS idx_foe_sp_user ON foe_user_smartpoints(user_id);
CREATE INDEX IF NOT EXISTS idx_foe_wallet_user ON foe_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_foe_txn_user ON foe_wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_foe_txn_date ON foe_wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_foe_units_user ON foe_participation_units(user_id);
CREATE INDEX IF NOT EXISTS idx_foe_units_status ON foe_participation_units(status);
CREATE INDEX IF NOT EXISTS idx_foe_units_project ON foe_participation_units(project_id);
CREATE INDEX IF NOT EXISTS idx_foe_part_user ON foe_project_participation(user_id);
CREATE INDEX IF NOT EXISTS idx_foe_audit_unit ON foe_unit_audit_trail(unit_id);
CREATE INDEX IF NOT EXISTS idx_foe_earnings_user ON foe_earnings_log(user_id);
CREATE INDEX IF NOT EXISTS idx_foe_progress_project ON foe_project_progress(project_id);

-- 17. Triggers
DROP TRIGGER IF EXISTS trg_sp_updated ON foe_user_smartpoints;
CREATE TRIGGER trg_sp_updated BEFORE UPDATE ON foe_user_smartpoints
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_wallet_updated ON foe_wallets;
CREATE TRIGGER trg_wallet_updated BEFORE UPDATE ON foe_wallets
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_units_updated ON foe_participation_units;
CREATE TRIGGER trg_units_updated BEFORE UPDATE ON foe_participation_units
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_proj_part_updated ON foe_project_participation;
CREATE TRIGGER trg_proj_part_updated BEFORE UPDATE ON foe_project_participation
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_fraud_updated ON foe_fraud_events;
CREATE TRIGGER trg_fraud_updated BEFORE UPDATE ON foe_fraud_events
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_dash_updated ON foe_customer_dashboard;
CREATE TRIGGER trg_dash_updated BEFORE UPDATE ON foe_customer_dashboard
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 18. Functions

-- Convert SmartPoints to Units (Optimal)
CREATE OR REPLACE FUNCTION foe_convert_smartpoints_to_units(
  p_smartpoints integer,
  p_conversion_type text DEFAULT 'optimal'
)
RETURNS TABLE(unit_code text, smartpoints integer, quantity integer)
LANGUAGE plpgsql
AS $function$
DECLARE
  v_remaining integer := p_smartpoints;
  v_unit_record RECORD;
BEGIN
  -- Get ordered unit types
  FOR v_unit_record IN
    SELECT ft.unit_code, ft.smartpoints_required
    FROM foe_unit_types ft
    WHERE ft.is_active = true
    ORDER BY
      CASE WHEN p_conversion_type = 'optimal' THEN ft.smartpoints_required END DESC,
      CASE WHEN p_conversion_type = 'greedy' THEN ft.smartpoints_required END ASC
  LOOP
    IF v_remaining >= v_unit_record.smartpoints_required THEN
      quantity := v_remaining / v_unit_record.smartpoints_required;
      unit_code := v_unit_record.unit_code;
      smartpoints := v_unit_record.smartpoints_required;
      v_remaining := v_remaining - (quantity * v_unit_record.smartpoints_required);
      RETURN NEXT;
    END IF;
  END LOOP;
  RETURN;
END;
$function$;

-- Get or Create User SmartPoints
CREATE OR REPLACE FUNCTION foe_get_or_create_user_sp(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  v_sp_id uuid;
BEGIN
  INSERT INTO foe_user_smartpoints (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO v_sp_id;

  IF v_sp_id IS NULL THEN
    SELECT id INTO v_sp_id FROM foe_user_smartpoints WHERE user_id = p_user_id;
  END IF;

  RETURN v_sp_id;
END;
$function$;

-- Get or Create Wallet
CREATE OR REPLACE FUNCTION foe_get_or_create_wallet(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  v_wallet_id uuid;
BEGIN
  INSERT INTO foe_wallets (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO v_wallet_id;

  IF v_wallet_id IS NULL THEN
    SELECT id INTO v_wallet_id FROM foe_wallets WHERE user_id = p_user_id;
  END IF;

  RETURN v_wallet_id;
END;
$function$;

-- Generate QR Code for Unit
CREATE OR REPLACE FUNCTION foe_generate_unit_qr(p_unit_id text)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_qr text;
BEGIN
  v_qr := 'QR-FOE-' || p_unit_id || '-' || to_char(now(), 'YYYYMMDDHH24MISS');
  RETURN v_qr;
END;
$function$;

-- Validate Eligibility
CREATE OR REPLACE FUNCTION foe_validate_eligibility(
  p_user_id uuid,
  p_project_id uuid DEFAULT NULL,
  p_smartpoints integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_eligible boolean := true;
  v_factors jsonb := '{}'::jsonb;
  v_reasons jsonb := '[]'::jsonb;
  v_user_sp integer;
  v_trust_score integer;
BEGIN
  -- Get user's available SmartPoints
  SELECT available_sp INTO v_user_sp
  FROM foe_user_smartpoints WHERE user_id = p_user_id;

  IF v_user_sp IS NULL OR v_user_sp < p_smartpoints THEN
    v_eligible := false;
    v_reasons := v_reasons || jsonb_build_object('code', 'INSUFFICIENT_SP', 'message', 'Insufficient SmartPoints');
  END IF;
  v_factors := v_factors || jsonb_build_object('available_sp', COALESCE(v_user_sp, 0));

  -- Check trust score if available
  SELECT trust_score INTO v_trust_score
  FROM trust_score_profiles WHERE user_id = p_user_id;

  v_factors := v_factors || jsonb_build_object('trust_score', COALESCE(v_trust_score, 0));

  IF v_trust_score IS NOT NULL AND v_trust_score < 300 THEN
    v_eligible := false;
    v_reasons := v_reasons || jsonb_build_object('code', 'LOW_TRUST', 'message', 'Trust score below threshold');
  END IF;

  -- Check project-specific eligibility if provided
  IF p_project_id IS NOT NULL THEN
    DECLARE
      v_min_units integer;
      v_status text;
    BEGIN
      SELECT min_participation_units, status INTO v_min_units, v_status
      FROM future_projects_catalog WHERE id = p_project_id;

      IF v_status NOT IN ('open', 'active') THEN
        v_eligible := false;
        v_reasons := v_reasons || jsonb_build_object('code', 'PROJECT_CLOSED', 'message', 'Project not open for participation');
      END IF;

      v_factors := v_factors || jsonb_build_object('project_min_units', COALESCE(v_min_units, 0));
    END;
  END IF;

  RETURN jsonb_build_object(
    'eligible', v_eligible,
    'factors', v_factors,
    'reasons', v_reasons
  );
END;
$function$;

-- Log Event to Unit Audit Trail
CREATE OR REPLACE FUNCTION foe_log_unit_audit(
  p_unit_id text,
  p_user_id uuid,
  p_action text,
  p_prev_status text DEFAULT NULL,
  p_new_status text DEFAULT NULL,
  p_actor_type text DEFAULT 'system',
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO foe_unit_audit_trail (
    unit_id, user_id, action, previous_status, new_status,
    actor_type, details
  ) VALUES (
    p_unit_id, p_user_id, p_action, p_prev_status, p_new_status,
    p_actor_type, p_details
  );
END;
$function$;

-- Get Transparency Stats for Project
CREATE OR REPLACE FUNCTION foe_get_project_transparency(p_project_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'project_id', p_project_id,
    'units_generated', COALESCE(pp.total_units_generated, 0),
    'units_remaining', COALESCE(pp.total_units_remaining, 0),
    'participants', COALESCE(pp.total_participants, 0),
    'smartpoints_allocated', COALESCE(pp.total_smartpoints_allocated, 0),
    'progress', COALESCE(pp.progress_percent, 0),
    'transparency_score', COALESCE(pp.transparency_score, 100)
  ) INTO v_stats
  FROM foe_project_progress pp
  WHERE pp.project_id = p_project_id;

  IF v_stats IS NULL THEN
    v_stats := jsonb_build_object(
      'project_id', p_project_id,
      'units_generated', 0,
      'units_remaining', 0,
      'participants', 0,
      'smartpoints_allocated', 0,
      'progress', 0,
      'transparency_score', 100
    );
  END IF;

  RETURN v_stats;
END;
$function$;

-- Get Customer Dashboard
CREATE OR REPLACE FUNCTION foe_get_customer_dashboard(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_dashboard jsonb;
BEGIN
  SELECT jsonb_build_object(
    'available_sp', COALESCE(sp.available_sp, 0),
    'allocated_sp', COALESCE(sp.total_allocated_sp, 0),
    'locked_sp', COALESCE(sp.total_locked_sp, 0),
    'purchase_sp', COALESCE(sp.total_purchase_sp, 0),
    'careclub_sp', COALESCE(sp.total_careclub_sp, 0),
    'total_earned', COALESCE(sp.total_earned_sp, 0),
    'wallet_balance', COALESCE(w.wallet_balance, 0),
    'total_units', (SELECT COUNT(*) FROM foe_participation_units WHERE user_id = p_user_id),
    'active_units', (SELECT COUNT(*) FROM foe_participation_units WHERE user_id = p_user_id AND status IN ('allocated', 'locked', 'active')),
    'completed_units', (SELECT COUNT(*) FROM foe_participation_units WHERE user_id = p_user_id AND status = 'completed'),
    'pending_units', (SELECT COUNT(*) FROM foe_participation_units WHERE user_id = p_user_id AND status = 'pending'),
    'projects_count', (SELECT COUNT(DISTINCT project_id) FROM foe_project_participation WHERE user_id = p_user_id)
  ) INTO v_dashboard
  FROM foe_user_smartpoints sp
  LEFT JOIN foe_wallets w ON w.user_id = sp.user_id
  WHERE sp.user_id = p_user_id;

  IF v_dashboard IS NULL THEN
    v_dashboard := jsonb_build_object(
      'available_sp', 0,
      'allocated_sp', 0,
      'locked_sp', 0,
      'purchase_sp', 0,
      'careclub_sp', 0,
      'total_earned', 0,
      'wallet_balance', 0,
      'total_units', 0,
      'active_units', 0,
      'completed_units', 0,
      'pending_units', 0,
      'projects_count', 0
    );
  END IF;

  RETURN v_dashboard;
END;
$function$;

-- 19. Seed project progress for existing projects
INSERT INTO foe_project_progress (project_id, total_target_units, total_units_remaining)
SELECT id, total_available_units, total_available_units
FROM future_projects_catalog
WHERE status IN ('coming_soon', 'open', 'active')
ON CONFLICT DO NOTHING;
