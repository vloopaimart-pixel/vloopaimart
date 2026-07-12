-- Fix: correct the malformed JSON in fraud rules insert
-- The prior migration failed; re-run with corrected JSON

-- ============================================================
-- Migration 073: Enterprise AI Security, Trust & Anti-Fraud Engine
-- Phase 45 — Permanent Enterprise Security Layer
-- ============================================================

-- 1. Trust Profiles (Extended)
CREATE TABLE trust_profiles_extended (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('customer', 'merchant', 'partner', 'franchisee', 'private_label_supplier', 'future_project')),
  entity_id uuid NOT NULL,
  trust_tier text DEFAULT 'standard' CHECK (trust_tier IN ('new', 'standard', 'verified', 'premium', 'enterprise')),
  trust_score integer DEFAULT 50 CHECK (trust_score BETWEEN 0 AND 1000),
  trust_factors jsonb DEFAULT '{}'::jsonb,
  trust_history jsonb DEFAULT '[]'::jsonb,
  verification_level text DEFAULT 'basic' CHECK (verification_level IN ('none', 'basic', 'enhanced', 'full')),
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected', 'expired')),
  kyc_submitted_at timestamptz,
  kyc_verified_at timestamptz,
  kyc_expiry_at timestamptz,
  document_requirements jsonb DEFAULT '[]'::jsonb,
  documents_submitted jsonb DEFAULT '[]'::jsonb,
  last_trust_update timestamptz DEFAULT now(),
  next_review_at timestamptz,
  manual_review_required boolean DEFAULT false,
  review_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(entity_type, entity_id)
);

ALTER TABLE trust_profiles_extended ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_trust_own" ON trust_profiles_extended;
CREATE POLICY "select_trust_own" ON trust_profiles_extended FOR SELECT
  TO authenticated USING (
    (entity_type = 'customer' AND entity_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true)
  );

DROP POLICY IF EXISTS "crud_trust_admin" ON trust_profiles_extended;
CREATE POLICY "crud_trust_admin" ON trust_profiles_extended FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 2. AI Behavior Engine
CREATE TABLE ai_behavior_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  behavior_type text NOT NULL CHECK (behavior_type IN (
    'purchase', 'careclub', 'smartcode', 'marketplace',
    'device', 'location', 'session', 'activity', 'wallet', 'referral'
  )),
  behavior_score numeric DEFAULT 50,
  baseline jsonb DEFAULT '{}'::jsonb,
  current_pattern jsonb DEFAULT '{}'::jsonb,
  deviation_score numeric DEFAULT 0,
  anomaly_flags jsonb DEFAULT '[]'::jsonb,
  last_calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, behavior_type)
);

ALTER TABLE ai_behavior_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_behavior_admin" ON ai_behavior_profiles;
CREATE POLICY "crud_behavior_admin" ON ai_behavior_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE TABLE ai_behavior_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  behavior_type text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  device_fingerprint text,
  ip_address text,
  location jsonb DEFAULT '{}'::jsonb,
  session_id text,
  timestamp_suspicious boolean DEFAULT false,
  anomaly_score numeric DEFAULT 0,
  flags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_behavior_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_events_admin" ON ai_behavior_events;
CREATE POLICY "crud_events_admin" ON ai_behavior_events FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Sybil Shield
CREATE TABLE sybil_detection_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  detection_type text NOT NULL CHECK (detection_type IN (
    'multiple_accounts', 'fake_devices', 'fake_registrations',
    'duplicate_identity', 'mass_smartcode_abuse', 'mass_ocr_abuse',
    'mass_referral_abuse', 'coordinate_attack'
  )),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  detected_users uuid[] DEFAULT ARRAY[]::uuid[],
  primary_user uuid REFERENCES profiles(id),
  common_identifier text,
  common_device text,
  common_ip text,
  common_phone text,
  common_email_domain text,
  evidence jsonb DEFAULT '{}'::jsonb,
  detection_score numeric DEFAULT 0,
  detection_rules jsonb DEFAULT '[]'::jsonb,
  action_taken text CHECK (action_taken IN ('monitoring', 'restricted', 'suspended', 'banned', 'none')),
  action_at timestamptz,
  action_by uuid REFERENCES profiles(id),
  status text DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'confirmed', 'false_positive', 'resolved')),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id),
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sybil_detection_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_sybil_admin" ON sybil_detection_log;
CREATE POLICY "crud_sybil_admin" ON sybil_detection_log FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE TABLE sybil_network_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  connection_type text NOT NULL CHECK (connection_type IN (
    'same_device', 'same_ip', 'same_phone', 'same_bank',
    'same_location', 'same_email_domain', 'temporal_correlation',
    'behavioral_similarity', 'referral_chain', 'shared_recovery'
  )),
  connection_strength numeric DEFAULT 0,
  evidence jsonb DEFAULT '{}'::jsonb,
  first_detected_at timestamptz DEFAULT now(),
  last_confirmed_at timestamptz DEFAULT now(),
  confirmed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id_1, user_id_2, connection_type)
);

ALTER TABLE sybil_network_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_sybil_net_admin" ON sybil_network_connections;
CREATE POLICY "crud_sybil_net_admin" ON sybil_network_connections FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. OCR Security
CREATE TABLE ocr_security_validation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ocr_log_id uuid REFERENCES ocr_communication_log(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  smartcode_entry_id uuid,
  validation_type text NOT NULL CHECK (validation_type IN (
    'handwriting_analysis', 'receipt_authenticity', 'purchase_amount',
    'duplicate_receipt', 'image_manipulation', 'timestamp_validation',
    'font_consistency', 'paper_quality', 'print_pattern'
  )),
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'passed', 'failed', 'manual_review')),
  validation_score numeric DEFAULT 0,
  confidence_score numeric DEFAULT 0,
  fraud_indicators jsonb DEFAULT '[]'::jsonb,
  forensic_data jsonb DEFAULT '{}'::jsonb,
  original_image_hash text,
  processed_image_hash text,
  image_similarity_scores jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  review_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ocr_security_validation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_ocr_sec_own" ON ocr_security_validation;
CREATE POLICY "select_ocr_sec_own" ON ocr_security_validation FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_ocr_sec_admin" ON ocr_security_validation;
CREATE POLICY "crud_ocr_sec_admin" ON ocr_security_validation FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Voice Security
CREATE TABLE voice_security_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  voice_print_status text DEFAULT 'pending' CHECK (voice_print_status IN ('pending', 'enrolled', 'verified', 'failed', 'revoked')),
  voice_print_id text UNIQUE,
  voice_print_hash text,
  enrollment_date timestamptz,
  verification_count integer DEFAULT 0,
  failed_attempts integer DEFAULT 0,
  last_verification_at timestamptz,
  voice_quality_score numeric,
  spoofing_detection_enabled boolean DEFAULT true,
  replay_attack_detection boolean DEFAULT true,
  synthetic_voice_detection boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE voice_security_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_voice_own" ON voice_security_profiles;
CREATE POLICY "select_voice_own" ON voice_security_profiles FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_voice_admin" ON voice_security_profiles;
CREATE POLICY "crud_voice_admin" ON voice_security_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE TABLE voice_security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES voice_ai_sessions(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('enrollment', 'verification', 'smartcode_entry', 'fraud_attempt', 'synthetic_detected')),
  event_status text DEFAULT 'pending' CHECK (event_status IN ('pending', 'passed', 'failed', 'blocked')),
  voice_match_score numeric,
  spoofing_score numeric,
  synthetic_probability numeric,
  replay_risk_score numeric,
  audio_features jsonb DEFAULT '{}'::jsonb,
  device_info jsonb DEFAULT '{}'::jsonb,
  risk_signals jsonb DEFAULT '[]'::jsonb,
  action_taken text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_security_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_voice_evt_admin" ON voice_security_events;
CREATE POLICY "crud_voice_evt_admin" ON voice_security_events FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. AI Fraud Engine
CREATE TABLE ai_fraud_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_type text NOT NULL CHECK (case_type IN (
    'fake_purchase', 'abnormal_transaction', 'bot_behavior',
    'point_farming', 'wallet_abuse', 'reward_abuse',
    'marketplace_abuse', 'smartcode_abuse', 'ocr_abuse',
    'referral_abuse', 'identity_theft', 'account_takeover'
  )),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type text,
  entity_id uuid,
  detection_method text CHECK (detection_method IN ('ml_model', 'rule_engine', 'heuristic', 'manual_report', 'pattern_match')),
  fraud_score numeric DEFAULT 0,
  fraud_indicators jsonb DEFAULT '[]'::jsonb,
  evidence jsonb DEFAULT '{}'::jsonb,
  model_confidence numeric,
  amount_involved numeric DEFAULT 0,
  points_involved integer DEFAULT 0,
  status text DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'confirmed', 'false_positive', 'escalated', 'resolved', 'closed')),
  assigned_to uuid REFERENCES profiles(id),
  priority integer DEFAULT 5,
  resolution text,
  resolution_notes text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id),
  escalation_at timestamptz,
  escalation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_fraud_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_fraud_admin" ON ai_fraud_cases;
CREATE POLICY "crud_fraud_admin" ON ai_fraud_cases FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE TABLE ai_fraud_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_code text NOT NULL UNIQUE,
  rule_name text NOT NULL,
  rule_category text NOT NULL CHECK (rule_category IN ('transaction', 'behavior', 'pattern', 'velocity', 'identity')),
  rule_type text NOT NULL CHECK (rule_type IN ('threshold', 'ml_model', 'heuristic', 'composite')),
  conditions jsonb NOT NULL DEFAULT '{}'::jsonb,
  actions jsonb NOT NULL DEFAULT '{}'::jsonb,
  severity_on_trigger text DEFAULT 'medium',
  score_impact integer DEFAULT 0,
  is_active boolean DEFAULT true,
  false_positive_rate numeric,
  last_triggered_at timestamptz,
  trigger_count integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_fraud_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_rules_admin" ON ai_fraud_rules;
CREATE POLICY "crud_rules_admin" ON ai_fraud_rules FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO ai_fraud_rules (rule_code, rule_name, rule_category, rule_type, conditions, actions, severity_on_trigger, score_impact) VALUES
('high_velocity_purchases', 'High Velocity Purchases', 'velocity', 'threshold', '{"max_purchases_per_hour": 10, "max_purchases_per_day": 50}'::jsonb, '{"action": "flag", "notify": "admin"}'::jsonb, 'high', 30),
('abnormal_amount', 'Abnormal Transaction Amount', 'transaction', 'threshold', '{"max_amount": 50000, "std_deviations": 3}'::jsonb, '{"action": "hold", "notify": "admin"}'::jsonb, 'high', 25),
('duplicate_device', 'Multiple Accounts Same Device', 'identity', 'heuristic', '{"device_match_threshold": 0.95}'::jsonb, '{"action": "flag", "require_verification": true}'::jsonb, 'medium', 20),
('point_farming', 'Suspicious Point Accumulation', 'pattern', 'composite', '{"min_orders": 5, "min_amount_per_order": 40, "similarity_score": 0.9}'::jsonb, '{"action": "investigate", "freeze_points": true}'::jsonb, 'critical', 50),
('bot_like_behavior', 'Bot-Like Session Pattern', 'behavior', 'ml_model', '{"click_interval_variance_min": 0.1, "session_duration_min": 30}'::jsonb, '{"action": "challenge", "captcha": true}'::jsonb, 'high', 35),
('smartcode_abuse', 'SmartCode Pattern Abuse', 'pattern', 'heuristic', '{"same_code_count": 5, "time_window_hours": 24}'::jsonb, '{"action": "block", "notify": "admin"}'::jsonb, 'critical', 40);

-- 7. Risk Engine
CREATE TABLE risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_type text NOT NULL CHECK (assessment_type IN ('transaction', 'user', 'merchant', 'partner', 'smartcode', 'ocr', 'system')),
  entity_type text,
  entity_id uuid,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  overall_risk_level text DEFAULT 'low' CHECK (overall_risk_level IN ('low', 'medium', 'high', 'critical')),
  risk_score integer DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  risk_factors jsonb DEFAULT '{}'::jsonb,
  contributing_factors jsonb DEFAULT '[]'::jsonb,
  ml_model_version text,
  model_scores jsonb DEFAULT '{}'::jsonb,
  manual_override boolean DEFAULT false,
  overridden_by uuid REFERENCES profiles(id),
  overridden_at timestamptz,
  override_reason text,
  valid_until timestamptz,
  action_recommended text,
  action_taken text,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_risk_admin" ON risk_assessments;
CREATE POLICY "crud_risk_admin" ON risk_assessments FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE TABLE risk_threshold_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_category text NOT NULL UNIQUE,
  low_threshold integer DEFAULT 30,
  medium_threshold integer DEFAULT 60,
  high_threshold integer DEFAULT 80,
  critical_threshold integer DEFAULT 95,
  auto_action_low text,
  auto_action_medium text,
  auto_action_high text CHECK (auto_action_high IN ('flag', 'hold', 'restrict', 'block', 'manual_review')),
  auto_action_critical text CHECK (auto_action_critical IN ('block', 'freeze', 'suspend', 'ban', 'manual_review')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE risk_threshold_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_risk_cfg_admin" ON risk_threshold_config;
CREATE POLICY "crud_risk_cfg_admin" ON risk_threshold_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO risk_threshold_config (risk_category) VALUES
('transaction'), ('user'), ('merchant'), ('partner'), ('smartcode'), ('ocr');

-- 8. Manual Verification Queue
CREATE TABLE manual_verification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_type text NOT NULL CHECK (verification_type IN (
    'kyc_verification', 'trust_upgrade', 'fraud_review',
    'risk_review', 'document_verification', 'ocr_review',
    'reward_claim', 'payout_approval', 'appeal_review'
  )),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  submitted_by uuid REFERENCES profiles(id),
  submitted_at timestamptz DEFAULT now(),
  priority integer DEFAULT 5,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'escalated', 'cancelled')),
  assigned_to uuid REFERENCES profiles(id),
  assigned_at timestamptz,
  documents_required jsonb DEFAULT '[]'::jsonb,
  documents_submitted jsonb DEFAULT '[]'::jsonb,
  verification_checklist jsonb DEFAULT '[]'::jsonb,
  decision text CHECK (decision IN ('approve', 'reject', 'suspend', 'freeze_wallet', 'freeze_reward', 'request_documents', 'escalate')),
  decision_reason text,
  decision_notes text,
  decided_at timestamptz,
  decided_by uuid REFERENCES profiles(id),
  escalated_to uuid REFERENCES profiles(id),
  escalation_reason text,
  escalated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE manual_verification_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_manual_admin" ON manual_verification_queue;
CREATE POLICY "crud_manual_admin" ON manual_verification_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE TABLE verification_actions_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id uuid REFERENCES manual_verification_queue(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  action_details jsonb DEFAULT '{}'::jsonb,
  previous_status text,
  new_status text,
  performed_by uuid REFERENCES profiles(id),
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE verification_actions_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_ver_act_admin" ON verification_actions_log;
CREATE POLICY "crud_ver_act_admin" ON verification_actions_log FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Security Audit Log
CREATE TABLE security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_type text NOT NULL CHECK (audit_type IN (
    'login', 'logout', 'password_change', 'password_reset',
    'purchase', 'contribution', 'smartcode', 'reward',
    'wallet', 'marketplace', 'partner', 'admin_action',
    'verification', 'fraud_action', 'risk_action', 'trust_update'
  )),
  entity_type text,
  entity_id uuid,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  admin_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  action_details jsonb DEFAULT '{}'::jsonb,
  previous_state jsonb,
  new_state jsonb,
  ip_address text,
  user_agent text,
  device_fingerprint text,
  location jsonb DEFAULT '{}'::jsonb,
  session_id text,
  risk_level_at_action text,
  trust_score_at_action integer,
  is_suspicious boolean DEFAULT false,
  flags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_audit_auth" ON security_audit_log;
CREATE POLICY "insert_audit_auth" ON security_audit_log FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "select_audit_own" ON security_audit_log;
CREATE POLICY "select_audit_own" ON security_audit_log FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_audit_admin" ON security_audit_log;
CREATE POLICY "crud_audit_admin" ON security_audit_log FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Compliance Frameworks
CREATE TABLE compliance_frameworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_code text NOT NULL UNIQUE CHECK (region_code IN ('IN', 'AE', 'SA', 'QA', 'BH', 'OM', 'KW', 'EU', 'UK', 'US', 'SG', 'GLOBAL')),
  region_name text NOT NULL,
  data_locality_required boolean DEFAULT false,
  gdpr_compliant boolean DEFAULT false,
  privacy_shield boolean DEFAULT false,
  retention_days integer DEFAULT 2555,
  encryption_required text DEFAULT 'AES-256',
  audit_frequency text DEFAULT 'annual' CHECK (audit_frequency IN ('monthly', 'quarterly', 'annual', 'biennial')),
  consent_required boolean DEFAULT true,
  right_to_deletion boolean DEFAULT false,
  data_portability boolean DEFAULT false,
  breach_notification_hours integer DEFAULT 72,
  regulations jsonb DEFAULT '[]'::jsonb,
  additional_requirements jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE compliance_frameworks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_comp_admin" ON compliance_frameworks;
CREATE POLICY "crud_comp_admin" ON compliance_frameworks FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO compliance_frameworks (region_code, region_name, gdpr_compliant, retention_days, right_to_deletion, data_portability) VALUES
('IN', 'India', false, 2555, true, true),
('AE', 'United Arab Emirates', false, 2555, false, false),
('SA', 'Saudi Arabia', false, 2555, false, false),
('QA', 'Qatar', false, 2555, false, false),
('EU', 'European Union', true, 1825, true, true),
('UK', 'United Kingdom', true, 1825, true, true),
('SG', 'Singapore', false, 2555, true, true),
('GLOBAL', 'Global Default', true, 1825, true, true);

CREATE TABLE data_subject_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  request_type text NOT NULL CHECK (request_type IN (
    'data_access', 'data_deletion', 'data_portability',
    'data_correction', 'consent_withdrawal', 'restriction'
  )),
  region_code text REFERENCES compliance_frameworks(region_code),
  request_status text DEFAULT 'pending' CHECK (request_status IN ('pending', 'processing', 'completed', 'rejected', 'expired')),
  request_details jsonb DEFAULT '{}'::jsonb,
  verified_identity boolean DEFAULT false,
  verification_method text,
  completed_at timestamptz,
  completion_notes text,
  rejection_reason text,
  processed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE data_subject_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_dsr_own" ON data_subject_requests;
CREATE POLICY "select_dsr_own" ON data_subject_requests FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_dsr_own" ON data_subject_requests;
CREATE POLICY "insert_dsr_own" ON data_subject_requests FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_dsr_admin" ON data_subject_requests;
CREATE POLICY "crud_dsr_admin" ON data_subject_requests FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. Security Dashboard Stats
CREATE TABLE security_dashboard_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date NOT NULL UNIQUE,
  total_trust_profiles integer DEFAULT 0,
  avg_trust_score numeric DEFAULT 0,
  high_trust_count integer DEFAULT 0,
  low_trust_count integer DEFAULT 0,
  fraud_cases_open integer DEFAULT 0,
  fraud_cases_resolved integer DEFAULT 0,
  fraud_amount_blocked numeric DEFAULT 0,
  sybil_cases_detected integer DEFAULT 0,
  sybil_accounts_flagged integer DEFAULT 0,
  risk_critical_count integer DEFAULT 0,
  risk_high_count integer DEFAULT 0,
  risk_medium_count integer DEFAULT 0,
  risk_low_count integer DEFAULT 0,
  verifications_pending integer DEFAULT 0,
  verifications_completed integer DEFAULT 0,
  audit_entries_today integer DEFAULT 0,
  security_incidents integer DEFAULT 0,
  avg_risk_score numeric DEFAULT 0,
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE security_dashboard_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_sec_dash_admin" ON security_dashboard_stats;
CREATE POLICY "crud_sec_dash_admin" ON security_dashboard_stats FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 12. Indexes
CREATE INDEX IF NOT EXISTS idx_trust_ext_entity ON trust_profiles_extended(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_trust_ext_score ON trust_profiles_extended(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_behavior_user ON ai_behavior_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_evt_user ON ai_behavior_events(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_evt_time ON ai_behavior_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sybil_status ON sybil_detection_log(status);
CREATE INDEX IF NOT EXISTS idx_ocr_sec_user ON ocr_security_validation(user_id);
CREATE INDEX IF NOT EXISTS idx_ocr_sec_status ON ocr_security_validation(validation_status);
CREATE INDEX IF NOT EXISTS idx_voice_evt_user ON voice_security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_cases_user ON ai_fraud_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_cases_status ON ai_fraud_cases(status);
CREATE INDEX IF NOT EXISTS idx_risk_entity ON risk_assessments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_risk_level ON risk_assessments(overall_risk_level);
CREATE INDEX IF NOT EXISTS idx_manual_ver_status ON manual_verification_queue(status);
CREATE INDEX IF NOT EXISTS idx_audit_type ON security_audit_log(audit_type);
CREATE INDEX IF NOT EXISTS idx_audit_user ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_time ON security_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dsr_status ON data_subject_requests(request_status);

-- 13. Triggers
DROP TRIGGER IF EXISTS trg_trust_ext_updated ON trust_profiles_extended;
CREATE TRIGGER trg_trust_ext_updated BEFORE UPDATE ON trust_profiles_extended FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_behavior_updated ON ai_behavior_profiles;
CREATE TRIGGER trg_behavior_updated BEFORE UPDATE ON ai_behavior_profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_sybil_updated ON sybil_detection_log;
CREATE TRIGGER trg_sybil_updated BEFORE UPDATE ON sybil_detection_log FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_ocr_sec_updated ON ocr_security_validation;
CREATE TRIGGER trg_ocr_sec_updated BEFORE UPDATE ON ocr_security_validation FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_voice_sec_updated ON voice_security_profiles;
CREATE TRIGGER trg_voice_sec_updated BEFORE UPDATE ON voice_security_profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_fraud_cases_updated ON ai_fraud_cases;
CREATE TRIGGER trg_fraud_cases_updated BEFORE UPDATE ON ai_fraud_cases FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_risk_updated ON risk_assessments;
CREATE TRIGGER trg_risk_updated BEFORE UPDATE ON risk_assessments FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_manual_ver_updated ON manual_verification_queue;
CREATE TRIGGER trg_manual_ver_updated BEFORE UPDATE ON manual_verification_queue FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_dsr_updated ON data_subject_requests;
CREATE TRIGGER trg_dsr_updated BEFORE UPDATE ON data_subject_requests FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_rules_updated ON ai_fraud_rules;
CREATE TRIGGER trg_rules_updated BEFORE UPDATE ON ai_fraud_rules FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_risk_cfg_updated ON risk_threshold_config;
CREATE TRIGGER trg_risk_cfg_updated BEFORE UPDATE ON risk_threshold_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_comp_frameworks_updated ON compliance_frameworks;
CREATE TRIGGER trg_comp_frameworks_updated BEFORE UPDATE ON compliance_frameworks FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 14. Functions
CREATE OR REPLACE FUNCTION calculate_trust_score(p_entity_type text, p_entity_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  v_score integer;
BEGIN
  UPDATE trust_profiles_extended
  SET trust_score = (
    SELECT COALESCE(AVG(factor_score), 50)::integer
    FROM (
      SELECT 
        CASE
          WHEN p_entity_type = 'customer' THEN (
            COALESCE((SELECT COUNT(*) FROM orders WHERE user_id = p_entity_id), 0) * 2 +
            COALESCE((SELECT SUM(points_earned) FROM orders WHERE user_id = p_entity_id), 0) / 100 +
            COALESCE((SELECT COUNT(*) FROM care_club_contributions WHERE user_id = p_entity_id), 0) * 5
          )
          WHEN p_entity_type = 'merchant' THEN (
            COALESCE((SELECT FLOOR(AVG(avg_rating)) FROM sellers WHERE id = p_entity_id), 3) * 20 +
            LEAST(COALESCE((SELECT COUNT(*) FROM order_items WHERE seller_id = p_entity_id), 0) / 10, 100)
          )
          ELSE 50
        END as factor_score
    ) factors
  ),
  last_trust_update = now()
  WHERE entity_type = p_entity_type AND entity_id = p_entity_id
  RETURNING trust_score INTO v_score;

  RETURN v_score;
END;
$function$;

CREATE OR REPLACE FUNCTION assess_risk_level(p_risk_score integer)
RETURNS text
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN CASE
    WHEN p_risk_score >= 95 THEN 'critical'
    WHEN p_risk_score >= 80 THEN 'high'
    WHEN p_risk_score >= 60 THEN 'medium'
    ELSE 'low'
  END;
END;
$function$;

CREATE OR REPLACE FUNCTION log_security_audit(
  p_audit_type text,
  p_action text,
  p_user_id uuid DEFAULT NULL,
  p_entity_type text DEFAULT NULL,
  p_entity_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO security_audit_log (
    audit_type, action, user_id, entity_type, entity_id,
    action_details
  )
  VALUES (
    p_audit_type, p_action, p_user_id, p_entity_type, p_entity_id,
    p_details
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$function$;

CREATE OR REPLACE FUNCTION get_security_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'trust', jsonb_build_object(
      'total_profiles', (SELECT COUNT(*) FROM trust_profiles_extended),
      'avg_score', (SELECT ROUND(AVG(trust_score)::numeric, 2) FROM trust_profiles_extended),
      'high_trust', (SELECT COUNT(*) FROM trust_profiles_extended WHERE trust_score >= 700),
      'low_trust', (SELECT COUNT(*) FROM trust_profiles_extended WHERE trust_score < 300)
    ),
    'fraud', jsonb_build_object(
      'open_cases', (SELECT COUNT(*) FROM ai_fraud_cases WHERE status IN ('open', 'investigating')),
      'critical', (SELECT COUNT(*) FROM ai_fraud_cases WHERE severity = 'critical' AND status = 'open'),
      'today_cases', (SELECT COUNT(*) FROM ai_fraud_cases WHERE created_at::date = current_date)
    ),
    'risk', jsonb_build_object(
      'critical', (SELECT COUNT(*) FROM risk_assessments WHERE overall_risk_level = 'critical'),
      'high', (SELECT COUNT(*) FROM risk_assessments WHERE overall_risk_level = 'high'),
      'medium', (SELECT COUNT(*) FROM risk_assessments WHERE overall_risk_level = 'medium')
    ),
    'verification', jsonb_build_object(
      'pending', (SELECT COUNT(*) FROM manual_verification_queue WHERE status = 'pending'),
      'in_review', (SELECT COUNT(*) FROM manual_verification_queue WHERE status = 'in_review')
    ),
    'sybil', jsonb_build_object(
      'open_cases', (SELECT COUNT(*) FROM sybil_detection_log WHERE status IN ('open', 'investigating'))
    ),
    'audit', jsonb_build_object(
      'today_entries', (SELECT COUNT(*) FROM security_audit_log WHERE created_at::date = current_date),
      'suspicious', (SELECT COUNT(*) FROM security_audit_log WHERE is_suspicious = true AND created_at::date = current_date)
    )
  ) INTO v_stats;

  RETURN v_stats;
END;
$function$;
