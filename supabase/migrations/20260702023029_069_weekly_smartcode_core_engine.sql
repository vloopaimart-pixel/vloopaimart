-- ============================================================
-- Migration 069: Weekly SmartCode AI Core Engine
-- Phase 40 — VLOOP Weekly SmartCode Challenge FINAL CORE
-- ============================================================

-- LOCKED BASE RULES (Immutable):
-- Purchase: ₹40 = 1 SmartPoint
-- Care Club: ₹10 = 5 SmartPoints

-- 1. Core SmartCode Entry Configuration
CREATE TABLE smartcode_core_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text NOT NULL UNIQUE,
  config_value jsonb NOT NULL,
  is_locked boolean DEFAULT false,
  description text,
  effective_from timestamptz,
  effective_to timestamptz,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE smartcode_core_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_config_auth" ON smartcode_core_config;
CREATE POLICY "select_config_auth" ON smartcode_core_config FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "crud_config_admin" ON smartcode_core_config;
CREATE POLICY "crud_config_admin" ON smartcode_core_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert locked base rules
INSERT INTO smartcode_core_config (config_key, config_value, is_locked, description) VALUES
('purchase_point_rate', '{"amount": 40, "currency": "INR", "points": 1}'::jsonb, true, 'LOCKED: ₹40 Purchase = 1 SmartPoint'),
('careclub_point_rate', '{"amount": 10, "currency": "INR", "points": 5}'::jsonb, true, 'LOCKED: ₹10 Care Club = 5 SmartPoints'),
('smartcode_range', '{"min": 0, "max": 999}'::jsonb, true, 'LOCKED: SmartCode range 000-999'),
('weekly_draw_day', '{"day": "sunday", "time": "18:00", "timezone": "Asia/Kolkata"}'::jsonb, false, 'Weekly AI draw schedule');

-- 2. SmartCode Entry Methods
CREATE TABLE smartcode_entry_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_code text NOT NULL UNIQUE CHECK (method_code IN ('ai_automatic', 'manual', 'offline_ocr', 'voice', 'whatsapp', 'future_method')),
  method_name text NOT NULL,
  is_active boolean DEFAULT true,
  requires_verification boolean DEFAULT false,
  max_entries_per_day integer,
  priority integer DEFAULT 0,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE smartcode_entry_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_methods_auth" ON smartcode_entry_methods;
CREATE POLICY "select_methods_auth" ON smartcode_entry_methods FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_methods_admin" ON smartcode_entry_methods;
CREATE POLICY "crud_methods_admin" ON smartcode_entry_methods FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert entry methods
INSERT INTO smartcode_entry_methods (method_code, method_name, is_active, requires_verification, max_entries_per_day, priority) VALUES
('ai_automatic', 'AI Automatic SmartCode', true, false, null, 1),
('manual', 'Manual SmartCode Entry', true, false, null, 2),
('offline_ocr', 'Offline OCR SmartCode', true, true, 100, 3),
('voice', 'Voice SmartCode', false, true, 50, 4),
('whatsapp', 'WhatsApp SmartCode', false, true, 50, 5);

-- 3. SmartCode Entries (Core Table)
CREATE TABLE smartcode_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_period text NOT NULL,
  smartcode text NOT NULL CHECK (smartcode ~ '^[0-9]{3}$'),
  point_allocation integer NOT NULL CHECK (point_allocation > 0),
  entry_method text NOT NULL REFERENCES smartcode_entry_methods(method_code),
  source_reference text,
  receipt_url text,
  receipt_verified boolean DEFAULT false,
  is_duplicate boolean DEFAULT false,
  duplicate_of uuid REFERENCES smartcode_entries(id),
  ai_confidence_score numeric,
  ai_validation_status text DEFAULT 'pending' CHECK (ai_validation_status IN ('pending', 'validated', 'rejected', 'requires_review')),
  ai_validation_notes text,
  fraud_score numeric DEFAULT 0,
  fraud_flags jsonb DEFAULT '[]'::jsonb,
  requires_manual_review boolean DEFAULT false,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  review_status text CHECK (review_status IN ('approved', 'rejected', 'escalated')),
  review_notes text,
  is_winner boolean DEFAULT false,
  winner_pool_type text CHECK (winner_pool_type IN ('prime', 'premium', 'standard')),
  winner_position integer,
  winner_reward_amount numeric,
  winner_reward_paid boolean DEFAULT false,
  winner_paid_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE smartcode_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_entries_own" ON smartcode_entries;
CREATE POLICY "select_entries_own" ON smartcode_entries FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_entries_admin" ON smartcode_entries;
CREATE POLICY "crud_entries_admin" ON smartcode_entries FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Locked Reward Pools
CREATE TABLE smartcode_reward_pools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_type text NOT NULL UNIQUE CHECK (pool_type IN ('prime', 'premium', 'standard', 'future_pool')),
  pool_name text NOT NULL,
  reward_amount numeric NOT NULL,
  currency text DEFAULT 'INR',
  position integer NOT NULL,
  is_locked boolean DEFAULT true,
  ai_assignable_only boolean DEFAULT true,
  is_active boolean DEFAULT true,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE smartcode_reward_pools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_pools_auth" ON smartcode_reward_pools;
CREATE POLICY "select_pools_auth" ON smartcode_reward_pools FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_pools_admin" ON smartcode_reward_pools;
CREATE POLICY "crud_pools_admin" ON smartcode_reward_pools FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert locked reward pools
INSERT INTO smartcode_reward_pools (pool_type, pool_name, reward_amount, position, is_locked, ai_assignable_only, description) VALUES
('prime', 'Prime Reward', 400, 1, true, true, 'LOCKED: First Prize - ₹400'),
('premium', 'Premium Reward', 200, 2, true, true, 'LOCKED: Second Prize - ₹200'),
('standard', 'Standard Reward', 100, 3, true, true, 'LOCKED: Third Prize - ₹100');

-- 5. Weekly Reward Pool Assignment (AI Only)
CREATE TABLE weekly_reward_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  smartcode_entry_id uuid REFERENCES smartcode_entries(id),
  pool_type text NOT NULL REFERENCES smartcode_reward_pools(pool_type),
  position integer NOT NULL,
  assignment_type text DEFAULT 'ai_automatic' CHECK (assignment_type IN ('ai_automatic', 'manual_override', 'admin_approved')),
  ai_score numeric,
  ai_factors jsonb DEFAULT '{}'::jsonb,
  requires_admin_approval boolean DEFAULT false,
  admin_approved_at timestamptz,
  admin_approved_by uuid REFERENCES profiles(id),
  admin_notes text,
  reward_amount numeric NOT NULL,
  reward_status text DEFAULT 'pending' CHECK (reward_status IN ('pending', 'approved', 'paid', 'cancelled', 'disqualified')),
  paid_at timestamptz,
  payout_reference text,
  audit_log jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(week_period, pool_type, position)
);

ALTER TABLE weekly_reward_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_assignments_own" ON weekly_reward_assignments;
CREATE POLICY "select_assignments_own" ON weekly_reward_assignments FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_assignments_admin" ON weekly_reward_assignments;
CREATE POLICY "crud_assignments_admin" ON weekly_reward_assignments FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. AI Weekly Evaluation
CREATE TABLE ai_weekly_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_smartcodes integer DEFAULT 0,
  total_points integer DEFAULT 0,
  purchase_activity_score numeric DEFAULT 0,
  careclub_activity_score numeric DEFAULT 0,
  weekly_activity_score numeric DEFAULT 0,
  performance_score numeric DEFAULT 0,
  rule_compliance_score numeric DEFAULT 0,
  fraud_risk_score numeric DEFAULT 0,
  manual_review_score numeric DEFAULT 0,
  overall_score numeric DEFAULT 0,
  percentile_rank numeric,
  weightage_factor numeric DEFAULT 1.0,
  eligible_for_draw boolean DEFAULT true,
  disqualification_reason text,
  ai_factors jsonb DEFAULT '{}'::jsonb,
  ai_recommendation text,
  model_version text,
  evaluated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_weekly_evaluations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_eval_own" ON ai_weekly_evaluations;
CREATE POLICY "select_eval_own" ON ai_weekly_evaluations FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_eval_admin" ON ai_weekly_evaluations;
CREATE POLICY "crud_eval_admin" ON ai_weekly_evaluations FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. AI Weekly Draw Sessions
CREATE TABLE ai_weekly_draw_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL UNIQUE,
  draw_status text DEFAULT 'pending' CHECK (draw_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  draw_started_at timestamptz,
  draw_completed_at timestamptz,
  total_entries integer DEFAULT 0,
  total_participants integer DEFAULT 0,
  validation_passed integer DEFAULT 0,
  validation_failed integer DEFAULT 0,
  duplicates_detected integer DEFAULT 0,
  fraud_flagged integer DEFAULT 0,
  prime_winner_id uuid REFERENCES profiles(id),
  premium_winner_id uuid REFERENCES profiles(id),
  standard_winner_id uuid REFERENCES profiles(id),
  prime_smartcode text,
  premium_smartcode text,
  standard_smartcode text,
  ai_model_version text,
  ai_confidence jsonb DEFAULT '{}'::jsonb,
  draw_seed numeric,
  validation_log jsonb DEFAULT '[]'::jsonb,
  error_log jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_weekly_draw_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_draw_auth" ON ai_weekly_draw_sessions;
CREATE POLICY "select_draw_auth" ON ai_weekly_draw_sessions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "crud_draw_admin" ON ai_weekly_draw_sessions;
CREATE POLICY "crud_draw_admin" ON ai_weekly_draw_sessions FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Voice SmartCode Architecture
CREATE TABLE voice_smartcode_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  language text DEFAULT 'en' CHECK (language IN ('en', 'ml', 'hi', 'ar', 'future_lang')),
  audio_url text,
  transcript_raw text,
  transcript_normalized text,
  detected_smartcode text,
  detected_point_allocation integer,
  confidence_score numeric,
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  smartcode_entry_id uuid REFERENCES smartcode_entries(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_smartcode_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_voice_own" ON voice_smartcode_sessions;
CREATE POLICY "select_voice_own" ON voice_smartcode_sessions FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_voice_admin" ON voice_smartcode_sessions;
CREATE POLICY "crud_voice_admin" ON voice_smartcode_sessions FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. WhatsApp SmartCode Architecture
CREATE TABLE whatsapp_smartcode_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  phone_number text,
  message_text text,
  detected_smartcode text,
  detected_point_allocation integer,
  message_type text CHECK (message_type IN ('text', 'image', 'voice', 'unknown')),
  media_url text,
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  whatsapp_message_id text,
  smartcode_entry_id uuid REFERENCES smartcode_entries(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE whatsapp_smartcode_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_wa_admin" ON whatsapp_smartcode_sessions;
CREATE POLICY "crud_wa_admin" ON whatsapp_smartcode_sessions FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Multi SmartCode Support
CREATE TABLE smartcode_multi_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_period text NOT NULL,
  batch_code text,
  smartcodes jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_points integer DEFAULT 0,
  entry_method text NOT NULL,
  batch_status text DEFAULT 'pending' CHECK (batch_status IN ('pending', 'processing', 'completed', 'partial', 'failed')),
  processed_smartcodes integer DEFAULT 0,
  failed_smartcodes integer DEFAULT 0,
  created_smartcode_ids jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE smartcode_multi_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_multi_own" ON smartcode_multi_entries;
CREATE POLICY "select_multi_own" ON smartcode_multi_entries FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_multi_admin" ON smartcode_multi_entries;
CREATE POLICY "crud_multi_admin" ON smartcode_multi_entries FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. AI Security Validation
CREATE TABLE smartcode_security_validation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  smartcode_entry_id uuid REFERENCES smartcode_entries(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  validation_type text NOT NULL CHECK (validation_type IN (
    'ocr_verification', 'receipt_matching', 'customer_verification',
    'duplicate_detection', 'behavior_analysis', 'fraud_detection',
    'pattern_analysis', 'velocity_check', 'location_check', 'device_check'
  )),
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'passed', 'failed', 'requires_review')),
  validation_score numeric DEFAULT 0,
  validation_details jsonb DEFAULT '{}'::jsonb,
  flags jsonb DEFAULT '[]'::jsonb,
  requires_manual_override boolean DEFAULT false,
  override_applied boolean DEFAULT false,
  override_reason text,
  validated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE smartcode_security_validation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_secval_admin" ON smartcode_security_validation;
CREATE POLICY "crud_secval_admin" ON smartcode_security_validation FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 12. Point Generation Audit
CREATE TABLE smartcode_point_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  source_type text NOT NULL CHECK (source_type IN ('purchase', 'care_club', 'smartcode_reward', 'referral', 'bonus', 'admin_adjustment')),
  source_reference text,
  points_before integer DEFAULT 0,
  points_added integer DEFAULT 0,
  points_after integer DEFAULT 0,
  conversion_rate jsonb DEFAULT '{}'::jsonb,
  is_locked_rule boolean DEFAULT false,
  audit_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE smartcode_point_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_audit_own" ON smartcode_point_audit;
CREATE POLICY "select_audit_own" ON smartcode_point_audit FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_audit_admin" ON smartcode_point_audit;
CREATE POLICY "crud_audit_admin" ON smartcode_point_audit FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Admin Reward Approval Queue
CREATE TABLE admin_reward_approval_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL,
  assignment_id uuid REFERENCES weekly_reward_assignments(id),
  user_id uuid REFERENCES profiles(id),
  pool_type text,
  reward_amount numeric,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')),
  assigned_to uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  review_notes text,
  audit_trail jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_reward_approval_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_approval_admin" ON admin_reward_approval_queue;
CREATE POLICY "crud_approval_admin" ON admin_reward_approval_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 14. Indexes
CREATE INDEX IF NOT EXISTS idx_smartcode_entries_user ON smartcode_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_smartcode_entries_week ON smartcode_entries(week_period);
CREATE INDEX IF NOT EXISTS idx_smartcode_entries_code ON smartcode_entries(smartcode);
CREATE INDEX IF NOT EXISTS idx_smartcode_entries_method ON smartcode_entries(entry_method);
CREATE INDEX IF NOT EXISTS idx_smartcode_entries_winner ON smartcode_entries(is_winner) WHERE is_winner = true;
CREATE INDEX IF NOT EXISTS idx_smartcode_entries_review ON smartcode_entries(requires_manual_review) WHERE requires_manual_review = true;

CREATE INDEX IF NOT EXISTS idx_reward_assignments_week ON weekly_reward_assignments(week_period);
CREATE INDEX IF NOT EXISTS idx_reward_assignments_user ON weekly_reward_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_assignments_status ON weekly_reward_assignments(reward_status);

CREATE INDEX IF NOT EXISTS idx_ai_eval_week ON ai_weekly_evaluations(week_period);
CREATE INDEX IF NOT EXISTS idx_ai_eval_user ON ai_weekly_evaluations(user_id);

CREATE INDEX IF NOT EXISTS idx_draw_week ON ai_weekly_draw_sessions(week_period);
CREATE INDEX IF NOT EXISTS idx_draw_status ON ai_weekly_draw_sessions(draw_status);

CREATE INDEX IF NOT EXISTS idx_security_entry ON smartcode_security_validation(smartcode_entry_id);
CREATE INDEX IF NOT EXISTS idx_security_user ON smartcode_security_validation(user_id);

CREATE INDEX IF NOT EXISTS idx_point_audit_user ON smartcode_point_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_point_audit_source ON smartcode_point_audit(source_type);

CREATE INDEX IF NOT EXISTS idx_approval_queue_status ON admin_reward_approval_queue(status);
CREATE INDEX IF NOT EXISTS idx_approval_queue_priority ON admin_reward_approval_queue(priority);

-- 15. Triggers
DROP TRIGGER IF EXISTS trg_smartcode_entries_updated ON smartcode_entries;
CREATE TRIGGER trg_smartcode_entries_updated BEFORE UPDATE ON smartcode_entries
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_reward_pools_updated ON smartcode_reward_pools;
CREATE TRIGGER trg_reward_pools_updated BEFORE UPDATE ON smartcode_reward_pools
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_reward_assignments_updated ON weekly_reward_assignments;
CREATE TRIGGER trg_reward_assignments_updated BEFORE UPDATE ON weekly_reward_assignments
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_ai_draw_updated ON ai_weekly_draw_sessions;
CREATE TRIGGER trg_ai_draw_updated BEFORE UPDATE ON ai_weekly_draw_sessions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_approval_queue_updated ON admin_reward_approval_queue;
CREATE TRIGGER trg_approval_queue_updated BEFORE UPDATE ON admin_reward_approval_queue
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 16. Functions
CREATE OR REPLACE FUNCTION calculate_smartpoints_from_purchase(purchase_amount numeric)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  v_points integer;
BEGIN
  SELECT FLOOR(purchase_amount / 40)::integer INTO v_points;
  RETURN GREATEST(0, v_points);
END;
$function$;

CREATE OR REPLACE FUNCTION calculate_smartpoints_from_careclub(contribution_amount numeric)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  v_points integer;
BEGIN
  SELECT FLOOR(contribution_amount / 10) * 5 INTO v_points;
  RETURN GREATEST(0, v_points);
END;
$function$;

CREATE OR REPLACE FUNCTION get_current_week_period()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_week text;
BEGIN
  SELECT to_char(current_date, 'IYYY-IW') INTO v_week;
  RETURN v_week;
END;
$function$;

CREATE OR REPLACE FUNCTION validate_smartcode(p_smartcode text)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
BEGIN
  IF p_smartcode !~ '^[0-9]{3}$' THEN
    RETURN false;
  END IF;
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION register_smartcode(
  p_user_id uuid,
  p_smartcode text,
  p_points integer,
  p_method text
) RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  v_entry_id uuid;
  v_week text;
BEGIN
  IF NOT validate_smartcode(p_smartcode) THEN
    RAISE EXCEPTION 'Invalid SmartCode format. Must be 3 digits (000-999)';
  END IF;

  v_week := get_current_week_period();

  INSERT INTO smartcode_entries (
    user_id, week_period, smartcode, point_allocation, entry_method
  )
  VALUES (
    p_user_id, v_week, p_smartcode, p_points, p_method
  ) RETURNING id INTO v_entry_id;

  RETURN v_entry_id;
END;
$function$;

CREATE OR REPLACE FUNCTION get_smartcode_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_week text;
  v_stats jsonb;
BEGIN
  v_week := get_current_week_period();

  SELECT jsonb_build_object(
    'current_week', v_week,
    'total_entries', (SELECT COUNT(*) FROM smartcode_entries WHERE week_period = v_week),
    'total_participants', (SELECT COUNT(DISTINCT user_id) FROM smartcode_entries WHERE week_period = v_week),
    'total_points', (SELECT COALESCE(SUM(point_allocation), 0) FROM smartcode_entries WHERE week_period = v_week),
    'pending_reviews', (SELECT COUNT(*) FROM smartcode_entries WHERE requires_manual_review = true AND review_status IS NULL),
    'pending_approvals', (SELECT COUNT(*) FROM admin_reward_approval_queue WHERE status = 'pending'),
    'prime_pool', (SELECT reward_amount FROM smartcode_reward_pools WHERE pool_type = 'prime'),
    'premium_pool', (SELECT reward_amount FROM smartcode_reward_pools WHERE pool_type = 'premium'),
    'standard_pool', (SELECT reward_amount FROM smartcode_reward_pools WHERE pool_type = 'standard')
  ) INTO v_stats;

  RETURN v_stats;
END;
$function$;
