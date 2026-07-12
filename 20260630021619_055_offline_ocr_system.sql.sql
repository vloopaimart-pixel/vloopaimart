-- ============================================================
-- Migration 079: VCOS AI Trust Score & Eligibility Engine
-- Phase 50 — Enterprise Trust Framework
--
-- Trust Score is NOT a financial credit score.
-- It is an internal VCOS participation score used only inside VLOOP ecosystem.
-- ============================================================

-- 1. Trust Score Configuration
CREATE TABLE vcos_trust_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text NOT NULL UNIQUE,
  config_value numeric NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vcos_trust_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_config_all" ON vcos_trust_config;
CREATE POLICY "select_config_all" ON vcos_trust_config FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_config_admin" ON vcos_trust_config;
CREATE POLICY "crud_config_admin" ON vcos_trust_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert default configuration
INSERT INTO vcos_trust_config (config_key, config_value, description) VALUES
('max_trust_score', 1000, 'Maximum achievable trust score'),
('min_trust_score', 0, 'Minimum trust score floor'),
('score_update_frequency_hours', 24, 'Hours between automatic score recalculations'),
('ai_confidence_threshold', 70, 'Minimum AI confidence for auto-updates'),
('fraud_penalty_points', 100, 'Points deducted for fraud detection'),
('duplicate_account_penalty', 200, 'Points deducted for duplicate accounts'),
('suspicious_activity_penalty', 50, 'Points deducted for suspicious activity'),
('verification_failed_penalty', 25, 'Points per failed verification'),
('rule_violation_penalty', 75, 'Points deducted for rule violations');

-- 2. Trust Level Thresholds
CREATE TABLE vcos_trust_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_name text NOT NULL UNIQUE,
  level_code text NOT NULL UNIQUE,
  min_score integer NOT NULL,
  max_score integer NOT NULL,
  display_order integer DEFAULT 0,
  badge_color text DEFAULT '#6B7280',
  benefits jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vcos_trust_levels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_levels_all" ON vcos_trust_levels;
CREATE POLICY "select_levels_all" ON vcos_trust_levels FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_levels_admin" ON vcos_trust_levels;
CREATE POLICY "crud_levels_admin" ON vcos_trust_levels FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert default trust levels
INSERT INTO vcos_trust_levels (level_name, level_code, min_score, max_score, display_order, badge_color) VALUES
('Bronze', 'bronze', 0, 199, 1, '#CD7F32'),
('Silver', 'silver', 200, 399, 2, '#C0C0C0'),
('Gold', 'gold', 400, 599, 3, '#FFD700'),
('Platinum', 'platinum', 600, 799, 4, '#E5E4E2'),
('Diamond', 'diamond', 800, 899, 5, '#B9F2FF'),
('Elite', 'elite', 900, 1000, 6, '#9333EA');

-- 3. Customer Trust Score
CREATE TABLE vcos_customer_trust_score (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Core Score
  trust_score integer DEFAULT 100 CHECK (trust_score BETWEEN 0 AND 1000),
  trust_level text DEFAULT 'bronze' REFERENCES vcos_trust_levels(level_code),
  
  -- Component Scores (all 0-100 scale)
  purchase_consistency_score integer DEFAULT 0 CHECK (purchase_consistency_score BETWEEN 0 AND 100),
  careclub_frequency_score integer DEFAULT 0 CHECK (careclub_frequency_score BETWEEN 0 AND 100),
  smartcode_participation_score integer DEFAULT 0 CHECK (smartcode_participation_score BETWEEN 0 AND 100),
  weekly_challenge_score integer DEFAULT 0 CHECK (weekly_challenge_score BETWEEN 0 AND 100),
  wallet_activity_score integer DEFAULT 0 CHECK (wallet_activity_score BETWEEN 0 AND 100),
  reward_history_score integer DEFAULT 0 CHECK (reward_history_score BETWEEN 0 AND 100),
  account_age_score integer DEFAULT 0 CHECK (account_age_score BETWEEN 0 AND 100),
  identity_verification_score integer DEFAULT 0 CHECK (identity_verification_score BETWEEN 0 AND 100),
  profile_completion_score integer DEFAULT 0 CHECK (profile_completion_score BETWEEN 0 AND 100),
  community_participation_score integer DEFAULT 0 CHECK (community_participation_score BETWEEN 0 AND 100),
  foe_participation_score integer DEFAULT 0 CHECK (foe_participation_score BETWEEN 0 AND 100),
  ai_behaviour_score integer DEFAULT 50 CHECK (ai_behaviour_score BETWEEN 0 AND 100),
  
  -- Risk Scores
  risk_score integer DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  fraud_risk_score integer DEFAULT 0 CHECK (fraud_risk_score BETWEEN 0 AND 100),
  
  -- Weight Calculations
  positive_weight_sum numeric DEFAULT 0,
  negative_weight_sum numeric DEFAULT 0,
  
  -- Trends
  trust_trend text DEFAULT 'stable' CHECK (trust_trend IN ('rising', 'stable', 'declining')),
  behaviour_trend text DEFAULT 'stable' CHECK (behaviour_trend IN ('improving', 'stable', 'declining')),
  activity_trend text DEFAULT 'stable' CHECK (activity_trend IN ('increasing', 'stable', 'decreasing')),
  
  -- AI Analysis
  ai_confidence_score integer DEFAULT 0 CHECK (ai_confidence_score BETWEEN 0 AND 100),
  ai_last_analysis timestamptz,
  ai_recommendations jsonb DEFAULT '[]'::jsonb,
  ai_risk_alerts jsonb DEFAULT '[]'::jsonb,
  
  -- Override Controls
  is_manually_overridden boolean DEFAULT false,
  override_reason text,
  overridden_by uuid REFERENCES profiles(id),
  override_expires_at timestamptz,
  is_locked boolean DEFAULT false,
  locked_by uuid REFERENCES profiles(id),
  locked_reason text,
  locked_at timestamptz,
  
  -- Scores to Next Level
  points_to_next_level integer DEFAULT 100,
  progress_percent numeric DEFAULT 0,
  
  -- Timestamps
  last_calculated_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vcos_customer_trust_score ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_score" ON vcos_customer_trust_score;
CREATE POLICY "select_own_score" ON vcos_customer_trust_score FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_score" ON vcos_customer_trust_score;
CREATE POLICY "insert_own_score" ON vcos_customer_trust_score FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_admin_score" ON vcos_customer_trust_score;
CREATE POLICY "crud_admin_score" ON vcos_customer_trust_score FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Trust Score History
CREATE TABLE vcos_trust_score_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Score Snapshot
  previous_score integer,
  new_score integer,
  score_change integer,
  previous_level text,
  new_level text,
  
  -- Change Reason
  change_type text NOT NULL CHECK (change_type IN (
    'initial', 'automatic', 'manual_override', 'system_adjustment',
    'penalty', 'bonus', 'recalculation', 'reset'
  )),
  change_reason text,
  
  -- Component Changes
  component_changes jsonb DEFAULT '{}'::jsonb,
  
  -- AI Decision Log
  ai_decision jsonb DEFAULT '{}'::jsonb,
  ai_confidence integer,
  
  -- Manual Override Log
  is_manual_override boolean DEFAULT false,
  overridden_by uuid REFERENCES profiles(id),
  override_reason text,
  
  -- Audit
  calculated_by text DEFAULT 'system',
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vcos_trust_score_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_history" ON vcos_trust_score_history;
CREATE POLICY "select_own_history" ON vcos_trust_score_history FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_auth_history" ON vcos_trust_score_history;
CREATE POLICY "insert_auth_history" ON vcos_trust_score_history FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "select_admin_history" ON vcos_trust_score_history;
CREATE POLICY "select_admin_history" ON vcos_trust_score_history FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Trust Score Factors
CREATE TABLE vcos_trust_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_code text NOT NULL UNIQUE,
  factor_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('positive', 'negative', 'neutral')),
  weight numeric DEFAULT 1.0,
  max_score integer DEFAULT 100,
  calculation_formula text,
  description text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vcos_trust_factors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_factors_all" ON vcos_trust_factors;
CREATE POLICY "select_factors_all" ON vcos_trust_factors FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_factors_admin" ON vcos_trust_factors;
CREATE POLICY "crud_factors_admin" ON vcos_trust_factors FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert default trust factors
INSERT INTO vcos_trust_factors (factor_code, factor_name, category, weight, description, display_order) VALUES
-- Positive Factors
('purchase_consistency', 'Purchase Consistency', 'positive', 1.5, 'Regular purchase behavior over time', 1),
('careclub_frequency', 'Care Club Contributions', 'positive', 2.0, 'Frequency of community contributions', 2),
('smartcode Participation', 'SmartCode Participation', 'positive', 1.5, 'Active SmartCode challenge participation', 3),
('weekly_challenge', 'Weekly Challenge Participation', 'positive', 1.2, 'Participation in weekly AI challenges', 4),
('wallet_activity', 'Wallet Activity', 'positive', 1.0, 'Wallet usage and transactions', 5),
('reward_history', 'Reward History', 'positive', 1.0, 'Points earned and redeemed', 6),
('account_age', 'Account Age', 'positive', 0.8, 'Length of membership', 7),
('identity_verified', 'Identity Verification', 'positive', 2.5, 'Verified identity status', 8),
('profile_completion', 'Profile Completion', 'positive', 1.0, 'Complete profile information', 9),
('community_participation', 'Community Participation', 'positive', 1.2, 'Referrals and community engagement', 10),
('foe_participation', 'FOE Participation', 'positive', 1.8, 'Future Opportunity participation', 11),
-- Negative Factors
('duplicate_accounts', 'Duplicate Accounts', 'negative', 3.0, 'Multiple account detection', 100),
('suspicious_behaviour', 'Suspicious Behaviour', 'negative', 2.0, 'Unusual activity patterns', 101),
('verification_failures', 'Failed Verifications', 'negative', 1.5, 'Repeated verification failures', 102),
('fake_receipts', 'Fake Receipts', 'negative', 3.0, 'Detected fake receipts', 103),
('fraud_detection', 'AI Fraud Detection', 'negative', 3.5, 'AI flagged fraud risk', 104),
('rule_violations', 'Rule Violations', 'negative', 2.5, 'Terms of service violations', 105),
('abnormal_activity', 'Abnormal Activity', 'negative', 2.0, 'Outlier behaviour patterns', 106);

-- Fix typo in insert
UPDATE vcos_trust_factors SET factor_code = 'smartcode_participation' WHERE factor_code = 'smartcode Participation';

-- 6. Trust Eligibility Rules
CREATE TABLE vcos_eligibility_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_code text NOT NULL UNIQUE,
  rule_name text NOT NULL,
  description text,
  min_trust_level text REFERENCES vcos_trust_levels(level_code),
  min_trust_score integer DEFAULT 0,
  min_account_age_days integer DEFAULT 0,
  min_purchases integer DEFAULT 0,
  min_careclub_contributions integer DEFAULT 0,
  min_smartcode_participations integer DEFAULT 0,
  max_risk_score integer DEFAULT 100,
  max_fraud_risk_score integer DEFAULT 100,
  requires_identity_verified boolean DEFAULT false,
  additional_criteria jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vcos_eligibility_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_rules_all" ON vcos_eligibility_rules;
CREATE POLICY "select_rules_all" ON vcos_eligibility_rules FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_rules_admin" ON vcos_eligibility_rules;
CREATE POLICY "crud_rules_admin" ON vcos_eligibility_rules FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert default eligibility rules
INSERT INTO vcos_eligibility_rules (rule_code, rule_name, min_trust_level, min_trust_score, description) VALUES
('basic_foe', 'Basic FOE Access', 'bronze', 100, 'Minimum eligibility for Future Opportunities'),
('standard_projects', 'Standard Projects', 'silver', 250, 'Access to standard FOE projects'),
('premium_projects', 'Premium Projects', 'gold', 450, 'Access to premium FOE projects'),
('exclusive_projects', 'Exclusive Projects', 'platinum', 650, 'Access to exclusive FOE projects'),
('priority_allocation', 'Priority Allocation', 'diamond', 800, 'Priority participation allocation'),
('elite_benefits', 'Elite Benefits', 'elite', 900, 'Elite tier exclusive benefits');

-- 7. Trust Audit Log
CREATE TABLE vcos_trust_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  action_category text CHECK (action_category IN ('score_update', 'level_change', 'override', 'lock', 'reset', 'factor_update', 'ai_decision')),
  previous_state jsonb DEFAULT '{}'::jsonb,
  new_state jsonb DEFAULT '{}'::jsonb,
  reason text,
  admin_id uuid REFERENCES profiles(id),
  ai_decision_id uuid,
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT NOW()
);

ALTER TABLE vcos_trust_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_audit_auth" ON vcos_trust_audit_log;
CREATE POLICY "insert_audit_auth" ON vcos_trust_audit_log FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "select_audit_admin" ON vcos_trust_audit_log;
CREATE POLICY "select_audit_admin" ON vcos_trust_audit_log FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. User Trust Improvement Suggestions
CREATE TABLE vcos_trust_improvements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  improvement_code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  category text CHECK (category IN ('activity', 'verification', 'participation', 'profile', 'community')),
  potential_points integer DEFAULT 10,
  priority integer DEFAULT 1,
  action_link text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vcos_trust_improvements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_improvements_all" ON vcos_trust_improvements;
CREATE POLICY "select_improvements_all" ON vcos_trust_improvements FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_improvements_admin" ON vcos_trust_improvements;
CREATE POLICY "crud_improvements_admin" ON vcos_trust_improvements FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert default improvements
INSERT INTO vcos_trust_improvements (improvement_code, title, description, category, potential_points, priority) VALUES
('verify_identity', 'Verify Your Identity', 'Complete identity verification for a significant trust boost', 'verification', 50, 1),
('complete_profile', 'Complete Your Profile', 'Add all profile information including location and preferences', 'profile', 20, 2),
('make_purchase', 'Make Regular Purchases', 'Consistent purchase behavior improves trust score', 'activity', 15, 3),
('join_careclub', 'Join Care Club', 'Contribute to Care Club regularly for community reputation', 'community', 25, 4),
('participate_smartcode', 'Participate in SmartCode', 'Join weekly SmartCode challenges', 'participation', 20, 5),
('join_foe', 'Join Future Opportunities', 'Participate in FOE projects', 'participation', 30, 6),
('add_referrals', 'Invite Friends', 'Refer new members to VLOOP', 'community', 15, 7),
('maintain_activity', 'Stay Active', 'Regular app activity maintains trust score', 'activity', 10, 8);

-- 9. Indexes
CREATE INDEX IF NOT EXISTS idx_trust_score_user ON vcos_customer_trust_score(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_score_level ON vcos_customer_trust_score(trust_level);
CREATE INDEX IF NOT EXISTS idx_trust_score_value ON vcos_customer_trust_score(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_trust_history_user ON vcos_trust_score_history(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_history_date ON vcos_trust_score_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trust_audit_user ON vcos_trust_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_trust_audit_date ON vcos_trust_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_eligibility_level ON vcos_eligibility_rules(min_trust_level);

-- 10. Triggers
DROP TRIGGER IF EXISTS trg_trust_score_updated ON vcos_customer_trust_score;
CREATE TRIGGER trg_trust_score_updated BEFORE UPDATE ON vcos_customer_trust_score
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 11. Functions

-- Calculate Trust Score
CREATE OR REPLACE FUNCTION vcos_calculate_trust_score(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_score integer DEFAULT 100;
  v_level text DEFAULT 'bronze';
  v_purchase_score integer DEFAULT 0;
  v_careclub_score integer DEFAULT 0;
  v_smartcode_score integer DEFAULT 0;
  v_weekly_score integer DEFAULT 0;
  v_wallet_score integer DEFAULT 0;
  v_reward_score integer DEFAULT 0;
  v_age_score integer DEFAULT 0;
  v_identity_score integer DEFAULT 0;
  v_profile_score integer DEFAULT 0;
  v_community_score integer DEFAULT 0;
  v_foe_score integer DEFAULT 0;
  v_ai_behaviour integer DEFAULT 50;
  v_risk_score integer DEFAULT 0;
  v_fraud_risk integer DEFAULT 0;
  v_positive_weight numeric DEFAULT 0;
  v_negative_weight numeric DEFAULT 0;
  v_points_to_next integer;
  v_progress numeric;
BEGIN
  -- Calculate component scores based on user data
  -- Purchase consistency (0-100)
  SELECT LEAST(100, COUNT(*) * 5) INTO v_purchase_score
  FROM orders WHERE user_id = p_user_id AND created_at > now() - interval '90 days';
  
  -- Care Club frequency (0-100)
  SELECT LEAST(100, COUNT(*) * 10) INTO v_careclub_score
  FROM care_club WHERE user_id = p_user_id;
  
  -- SmartCode participation (0-100)
  SELECT COALESCE(LEAST(100, 
    (SELECT COUNT(*) FROM smartcode_participation WHERE user_id = p_user_id) * 8 +
    (SELECT COUNT(*) FROM weekly_smartcode_entries WHERE user_id = p_user_id) * 5
  ), 0) INTO v_smartcode_score;
  
  -- Account age score (0-100)
  SELECT LEAST(100, EXTRACT(days FROM now() - created_at) / 3.65) INTO v_age_score
  FROM profiles WHERE id = p_user_id;
  
  -- Profile completion (0-100)
  SELECT CASE 
    WHEN name IS NOT NULL AND name != '' THEN 20 ELSE 0 END +
    CASE WHEN mobile IS NOT NULL AND mobile != '' THEN 20 ELSE 0 END +
    CASE WHEN location IS NOT NULL AND location != '' THEN 20 ELSE 0 END +
    CASE WHEN email IS NOT NULL AND email != '' THEN 20 ELSE 0 END +
    CASE WHEN vloop_code IS NOT NULL THEN 20 ELSE 0 END
  INTO v_profile_score
  FROM profiles WHERE id = p_user_id;
  
  -- Identity verification (0 or 100)
  SELECT CASE WHEN EXISTS (SELECT 1 FROM profiles WHERE id = p_user_id AND email IS NOT NULL) THEN 100 ELSE 0 END
  INTO v_identity_score;
  
  -- Wallet activity (0-100)
  SELECT LEAST(100, 
    (SELECT COUNT(*) FROM point_history WHERE user_id = p_user_id) * 2
  ) INTO v_wallet_score;
  
  -- FOE participation (0-100)
  SELECT LEAST(100, 
    COALESCE((SELECT COUNT(*) FROM foe_project_participation WHERE user_id = p_user_id), 0) * 20
  ) INTO v_foe_score;
  
  -- Calculate positive weight
  v_positive_weight := 
    (v_purchase_score * 1.5) +
    (v_careclub_score * 2.0) +
    (v_smartcode_score * 1.5) +
    (v_weekly_score * 1.2) +
    (v_wallet_score * 1.0) +
    (v_reward_score * 1.0) +
    (v_age_score * 0.8) +
    (v_identity_score * 2.5) +
    (v_profile_score * 1.0) +
    (v_community_score * 1.2) +
    (v_foe_score * 1.8);
  
  -- Normalize to 1000 scale
  v_score := 100 + (v_positive_weight / 10)::integer;
  
  -- Apply negative factors
  v_score := GREATEST(0, v_score - v_negative_weight::integer);
  v_score := LEAST(1000, v_score);
  
  -- Determine level
  SELECT level_code INTO v_level FROM vcos_trust_levels
  WHERE min_score <= v_score AND max_score >= v_score
  ORDER BY display_order DESC LIMIT 1;
  
  -- Calculate progress to next level
  SELECT min_score - v_score INTO v_points_to_next
  FROM vcos_trust_levels
  WHERE min_score > v_score
  ORDER BY min_score ASC LIMIT 1;
  
  IF v_points_to_next IS NULL THEN
    v_points_to_next := 0;
    v_progress := 100;
  ELSE
    SELECT (v_score - min_score)::numeric / (max_score - min_score) * 100 INTO v_progress
    FROM vcos_trust_levels WHERE level_code = v_level;
  END IF;
  
  RETURN jsonb_build_object(
    'trust_score', v_score,
    'trust_level', v_level,
    'purchase_consistency_score', v_purchase_score,
    'careclub_frequency_score', v_careclub_score,
    'smartcode_participation_score', v_smartcode_score,
    'weekly_challenge_score', v_weekly_score,
    'wallet_activity_score', v_wallet_score,
    'reward_history_score', v_reward_score,
    'account_age_score', v_age_score,
    'identity_verification_score', v_identity_score,
    'profile_completion_score', v_profile_score,
    'community_participation_score', v_community_score,
    'foe_participation_score', v_foe_score,
    'ai_behaviour_score', v_ai_behaviour,
    'risk_score', v_risk_score,
    'fraud_risk_score', v_fraud_risk,
    'positive_weight', v_positive_weight,
    'negative_weight', v_negative_weight,
    'points_to_next_level', v_points_to_next,
    'progress_percent', v_progress
  );
END;
$function$;

-- Get User Trust Summary
CREATE OR REPLACE FUNCTION vcos_get_user_trust_summary(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_summary jsonb;
BEGIN
  SELECT jsonb_build_object(
    'trust_score', COALESCE(trust_score, 100),
    'trust_level', COALESCE(trust_level, 'bronze'),
    'trust_trend', COALESCE(trust_trend, 'stable'),
    'behaviour_trend', COALESCE(behaviour_trend, 'stable'),
    'activity_trend', COALESCE(activity_trend, 'stable'),
    'ai_confidence', COALESCE(ai_confidence_score, 0),
    'risk_score', COALESCE(risk_score, 0),
    'fraud_risk_score', COALESCE(fraud_risk_score, 0),
    'points_to_next_level', COALESCE(points_to_next_level, 100),
    'progress_percent', COALESCE(progress_percent, 0),
    'component_scores', jsonb_build_object(
      'purchase_consistency', purchase_consistency_score,
      'careclub_frequency', careclub_frequency_score,
      'smartcode_participation', smartcode_participation_score,
      'weekly_challenge', weekly_challenge_score,
      'wallet_activity', wallet_activity_score,
      'reward_history', reward_history_score,
      'account_age', account_age_score,
      'identity_verification', identity_verification_score,
      'profile_completion', profile_completion_score,
      'community_participation', community_participation_score,
      'foe_participation', foe_participation_score,
      'ai_behaviour', ai_behaviour_score
    ),
    'is_locked', COALESCE(is_locked, false),
    'last_calculated', last_calculated_at
  ) INTO v_summary
  FROM vcos_customer_trust_score WHERE user_id = p_user_id;
  
  IF v_summary IS NULL THEN
    v_summary := jsonb_build_object(
      'trust_score', 100,
      'trust_level', 'bronze',
      'trust_trend', 'stable',
      'points_to_next_level', 100,
      'progress_percent', 0
    );
  END IF;
  
  RETURN v_summary;
END;
$function$;

-- Check Eligibility
CREATE OR REPLACE FUNCTION vcos_check_eligibility(p_user_id uuid, p_rule_code text)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_rule RECORD;
  v_trust RECORD;
  v_account_age_days integer;
  v_is_eligible boolean DEFAULT true;
  v_reasons jsonb DEFAULT '[]'::jsonb;
BEGIN
  -- Get rule
  SELECT * INTO v_rule FROM vcos_eligibility_rules WHERE rule_code = p_rule_code AND is_active = true;
  
  IF v_rule IS NULL THEN
    RETURN jsonb_build_object('eligible', false, 'reason', 'Rule not found');
  END IF;
  
  -- Get user trust score
  SELECT * INTO v_trust FROM vcos_customer_trust_score WHERE user_id = p_user_id;
  
  IF v_trust IS NULL THEN
    RETURN jsonb_build_object('eligible', false, 'reason', 'Trust score not found');
  END IF;
  
  -- Check trust level
  IF v_rule.min_trust_level IS NOT NULL THEN
    DECLARE
      v_user_level_order integer;
      v_required_level_order integer;
    BEGIN
      SELECT display_order INTO v_user_level_order FROM vcos_trust_levels WHERE level_code = v_trust.trust_level;
      SELECT display_order INTO v_required_level_order FROM vcos_trust_levels WHERE level_code = v_rule.min_trust_level;
      
      IF v_user_level_order < v_required_level_order THEN
        v_is_eligible := false;
        v_reasons := v_reasons || jsonb_build_object('reason', 'Insufficient trust level', 'current', v_trust.trust_level, 'required', v_rule.min_trust_level);
      END IF;
    END;
  END IF;
  
  -- Check trust score
  IF v_trust.trust_score < v_rule.min_trust_score THEN
    v_is_eligible := false;
    v_reasons := v_reasons || jsonb_build_object('reason', 'Insufficient trust score', 'current', v_trust.trust_score, 'required', v_rule.min_trust_score);
  END IF;
  
  -- Check risk scores
  IF v_trust.risk_score > v_rule.max_risk_score THEN
    v_is_eligible := false;
    v_reasons := v_reasons || jsonb_build_object('reason', 'Risk score too high', 'current', v_trust.risk_score, 'max', v_rule.max_risk_score);
  END IF;
  
  IF v_trust.fraud_risk_score > v_rule.max_fraud_risk_score THEN
    v_is_eligible := false;
    v_reasons := v_reasons || jsonb_build_object('reason', 'Fraud risk too high', 'current', v_trust.fraud_risk_score, 'max', v_rule.max_fraud_risk_score);
  END IF;
  
  RETURN jsonb_build_object(
    'eligible', v_is_eligible,
    'rule_name', v_rule.rule_name,
    'checks', v_reasons
  );
END;
$function$;

-- Initialize trust score for new users
INSERT INTO vcos_customer_trust_score (user_id, trust_score, trust_level)
SELECT id, 100, 'bronze' FROM profiles
ON CONFLICT (user_id) DO NOTHING;
