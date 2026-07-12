-- ============================================================
-- Migration 068: AI Trust Score & Financial Intelligence Engine
-- Phase 39 — Enterprise AI Trust Score, Reputation & Financial Intelligence
-- ============================================================

-- 1. Universal Trust Score Profiles
CREATE TABLE trust_score_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  trust_score integer DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 1000),
  trust_level text DEFAULT 'new' CHECK (trust_level IN ('new', 'building', 'established', 'trusted', 'premium', 'elite')),
  score_version text DEFAULT '1.0',
  last_calculated_at timestamptz,
  next_calculation_at timestamptz,
  calculation_frequency text DEFAULT 'daily' CHECK (calculation_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'monthly')),
  is_verified boolean DEFAULT false,
  is_frozen boolean DEFAULT false,
  frozen_reason text,
  frozen_at timestamptz,
  frozen_by uuid REFERENCES profiles(id),
  manual_override integer,
  override_reason text,
  override_by uuid REFERENCES profiles(id),
  override_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trust_score_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_trust" ON trust_score_profiles;
CREATE POLICY "select_own_trust" ON trust_score_profiles FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_trust_admin" ON trust_score_profiles;
CREATE POLICY "crud_trust_admin" ON trust_score_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 2. Trust Score Factors
CREATE TABLE trust_score_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES trust_score_profiles(id) ON DELETE CASCADE,
  factor_type text NOT NULL CHECK (factor_type IN (
    'purchase_history', 'care_club_participation', 'successful_deliveries',
    'seller_reputation', 'customer_reviews', 'refund_history', 'fraud_detection',
    'account_verification', 'platform_activity', 'community_contribution',
    'financial_behavior', 'smartcode_participation', 'wallet_activity',
    'referral_success', 'support_interactions', 'profile_completeness'
  )),
  factor_score integer DEFAULT 0,
  factor_weight numeric DEFAULT 1.0,
  weighted_score numeric DEFAULT 0,
  raw_value numeric,
  normalized_value numeric,
  percentile_rank numeric,
  trend_direction text CHECK (trend_direction IN ('up', 'down', 'stable')),
  trend_strength numeric,
  last_updated_at timestamptz,
  data_points integer DEFAULT 0,
  confidence_level numeric DEFAULT 0,
  contributing_events integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, factor_type)
);

ALTER TABLE trust_score_factors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_factors_admin" ON trust_score_factors;
CREATE POLICY "crud_factors_admin" ON trust_score_factors FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Trust Score History
CREATE TABLE trust_score_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES trust_score_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  previous_score integer,
  new_score integer,
  score_change integer,
  change_reason text,
  change_type text CHECK (change_type IN ('calculation', 'manual_override', 'event_trigger', 'system_adjustment', 'fraud_penalty', 'verification_bonus')),
  contributing_factors jsonb DEFAULT '{}'::jsonb,
  algorithm_version text,
  calculated_at timestamptz DEFAULT now()
);

ALTER TABLE trust_score_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_history_own" ON trust_score_history;
CREATE POLICY "select_history_own" ON trust_score_history FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_history_admin" ON trust_score_history;
CREATE POLICY "crud_history_admin" ON trust_score_history FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Trust Score Events
CREATE TABLE trust_score_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES trust_score_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN (
    'purchase_completed', 'delivery_confirmed', 'review_submitted', 'review_received',
    'refund_requested', 'refund_processed', 'returned_item', 'care_club_joined',
    'care_club_renewed', 'smartcode_scanned', 'smartcode_winner', 'wallet_topup',
    'wallet_withdrawal', 'referral_completed', 'support_ticket_resolved',
    'profile_verified', 'fraud_detected', 'dispute_lost', 'dispute_won',
    'order_cancelled', 'late_payment', 'early_payment', 'loyalty_milestone',
    'community_contribution', 'seller_upgrade', 'partner_upgrade'
  )),
  event_reference_id uuid,
  event_reference_type text,
  score_impact integer DEFAULT 0,
  factor_impacted text,
  event_data jsonb DEFAULT '{}'::jsonb,
  processed_at timestamptz,
  is_processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trust_score_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_events_own" ON trust_score_events;
CREATE POLICY "select_events_own" ON trust_score_events FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_events_admin" ON trust_score_events;
CREATE POLICY "crud_events_admin" ON trust_score_events FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Reputation Profiles
CREATE TABLE reputation_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('customer', 'seller', 'partner', 'franchise', 'brand', 'Manufacturer')),
  entity_id uuid NOT NULL,
  reputation_score numeric DEFAULT 0 CHECK (reputation_score >= 0 AND reputation_score <= 100),
  reputation_level text DEFAULT 'new' CHECK (reputation_level IN ('new', 'rising', 'established', 'top_rated', 'premium', 'legendary')),
  rating_avg numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  review_count integer DEFAULT 0,
  response_rate numeric DEFAULT 0,
  response_time_avg numeric,
  resolution_rate numeric DEFAULT 0,
  repeat_customer_rate numeric DEFAULT 0,
  referral_count integer DEFAULT 0,
  successful_transactions integer DEFAULT 0,
  issue_rate numeric DEFAULT 0,
  complaint_count integer DEFAULT 0,
  dispute_win_rate numeric DEFAULT 0,
  trust_signals jsonb DEFAULT '{}'::jsonb,
  last_updated_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(entity_type, entity_id)
);

ALTER TABLE reputation_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_rep_own" ON reputation_profiles;
CREATE POLICY "select_rep_own" ON reputation_profiles FOR SELECT
  TO authenticated USING (
    (entity_type = 'customer' AND entity_id = auth.uid()) OR
    (entity_type = 'seller' AND entity_id IN (SELECT id FROM sellers WHERE user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "crud_rep_admin" ON reputation_profiles;
CREATE POLICY "crud_rep_admin" ON reputation_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. Financial Intelligence Profiles
CREATE TABLE financial_intelligence_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  financial_score numeric DEFAULT 0 CHECK (financial_score >= 0 AND financial_score <= 100),
  spending_tier text DEFAULT 'basic' CHECK (spending_tier IN ('basic', 'regular', 'frequent', 'premium', 'elite')),
  savings_score numeric DEFAULT 0,
  contribution_score numeric DEFAULT 0,
  growth_trajectory text CHECK (growth_trajectory IN ('declining', 'stable', 'growing', 'accelerating')),
  purchase_trend_direction text,
  purchase_trend_strength numeric,
  savings_trend_direction text,
  savings_trend_strength numeric,
  weekly_spending_avg numeric DEFAULT 0,
  monthly_spending_avg numeric DEFAULT 0,
  yearly_spending numeric DEFAULT 0,
  lifetime_value numeric DEFAULT 0,
  predicted_yearly_spending numeric,
  churn_risk_level text DEFAULT 'low' CHECK (churn_risk_level IN ('low', 'medium', 'high', 'critical')),
  engagement_score numeric DEFAULT 0,
  activity_frequency text CHECK (activity_frequency IN ('dormant', 'occasional', 'regular', 'active', 'highly_active')),
  days_since_last_activity integer,
  credit_recommendation text CHECK (credit_recommendation IN ('not_recommended', 'caution', 'standard', 'preferred', 'premium')),
  credit_recommendation_score numeric,
  ai_analysis jsonb DEFAULT '{}'::jsonb,
  model_version text,
  last_analyzed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE financial_intelligence_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_fintel_own" ON financial_intelligence_profiles;
CREATE POLICY "select_fintel_own" ON financial_intelligence_profiles FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_fintel_admin" ON financial_intelligence_profiles;
CREATE POLICY "crud_fintel_admin" ON financial_intelligence_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. Eligibility Profiles (Future)
CREATE TABLE eligibility_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  affordable_housing_eligible boolean DEFAULT false,
  affordable_housing_score numeric DEFAULT 0,
  ev_project_eligible boolean DEFAULT false,
  ev_project_score numeric DEFAULT 0,
  land_project_eligible boolean DEFAULT false,
  land_project_score numeric DEFAULT 0,
  business_finance_eligible boolean DEFAULT false,
  business_finance_score numeric DEFAULT 0,
  partner_upgrade_eligible boolean DEFAULT false,
  partner_upgrade_score numeric DEFAULT 0,
  premium_membership_eligible boolean DEFAULT false,
  premium_membership_score numeric DEFAULT 0,
  enterprise_opportunity_eligible boolean DEFAULT false,
  enterprise_opportunity_score numeric DEFAULT 0,
  overall_eligibility_score numeric DEFAULT 0,
  eligibility_factors jsonb DEFAULT '{}'::jsonb,
  restrictions text[],
  next_review_date date,
  last_reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE eligibility_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_elig_own" ON eligibility_profiles;
CREATE POLICY "select_elig_own" ON eligibility_profiles FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_elig_admin" ON eligibility_profiles;
CREATE POLICY "crud_elig_admin" ON eligibility_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Risk Analysis Profiles
CREATE TABLE risk_analysis_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  overall_risk_level text DEFAULT 'low' CHECK (overall_risk_level IN ('minimal', 'low', 'medium', 'high', 'critical')),
  overall_risk_score numeric DEFAULT 0 CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  fraud_risk_score numeric DEFAULT 0,
  fraud_risk_level text CHECK (fraud_risk_level IN ('minimal', 'low', 'medium', 'high', 'critical')),
  business_risk_score numeric DEFAULT 0,
  business_risk_level text CHECK (business_risk_level IN ('minimal', 'low', 'medium', 'high', 'critical')),
  transaction_risk_score numeric DEFAULT 0,
  transaction_risk_level text CHECK (transaction_risk_level IN ('minimal', 'low', 'medium', 'high', 'critical')),
  behavior_risk_score numeric DEFAULT 0,
  behavior_risk_level text CHECK (behavior_risk_level IN ('minimal', 'low', 'medium', 'high', 'critical')),
  trust_deviation_score numeric DEFAULT 0,
  trust_deviation_direction text,
  manual_review_required boolean DEFAULT false,
  manual_review_reason text,
  review_priority text CHECK (review_priority IN ('low', 'medium', 'high', 'urgent')),
  flags jsonb DEFAULT '[]'::jsonb,
  risk_factors jsonb DEFAULT '{}'::jsonb,
  mitigation_recommendations jsonb DEFAULT '[]'::jsonb,
  last_assessed_at timestamptz,
  assessment_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE risk_analysis_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_risk_admin" ON risk_analysis_profiles;
CREATE POLICY "crud_risk_admin" ON risk_analysis_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Risk Events
CREATE TABLE risk_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  risk_profile_id uuid REFERENCES risk_analysis_profiles(id),
  event_type text NOT NULL CHECK (event_type IN (
    'suspicious_transaction', 'unusual_pattern', 'multiple_refunds', 'high_value_return',
    'account_takeover_attempt', 'velocity_breach', 'location_anomaly', 'device_change',
    'behavior_anomaly', 'chargeback_filed', 'dispute_pattern', 'review_request',
    'trust_deviation_detected', 'manual_flag', 'system_flag', 'cleared'
  )),
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'high', 'critical')),
  event_data jsonb DEFAULT '{}'::jsonb,
  detected_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id),
  resolution_notes text,
  resolution_status text DEFAULT 'open' CHECK (resolution_status IN ('open', 'investigating', 'resolved', 'false_positive', 'escalated')),
  escalation_level integer DEFAULT 0,
  assigned_to uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE risk_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_riskevents_admin" ON risk_events;
CREATE POLICY "crud_riskevents_admin" ON risk_events FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Trust Score Configuration
CREATE TABLE trust_score_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_name text NOT NULL UNIQUE,
  config_version text NOT NULL,
  factor_weights jsonb NOT NULL DEFAULT '{}'::jsonb,
  level_thresholds jsonb NOT NULL DEFAULT '{}'::jsonb,
  calculation_rules jsonb DEFAULT '{}'::jsonb,
  bonus_rules jsonb DEFAULT '[]'::jsonb,
  penalty_rules jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  effective_from timestamptz,
  effective_to timestamptz,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trust_score_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_config_auth" ON trust_score_config;
CREATE POLICY "select_config_auth" ON trust_score_config FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_config_admin" ON trust_score_config;
CREATE POLICY "crud_config_admin" ON trust_score_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. Trust Analytics
CREATE TABLE trust_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  trust_level text,
  score_range text,
  total_users integer DEFAULT 0,
  new_users integer DEFAULT 0,
  upgraded_users integer DEFAULT 0,
  downgraded_users integer DEFAULT 0,
  avg_trust_score numeric DEFAULT 0,
  median_trust_score numeric DEFAULT 0,
  p90_trust_score numeric DEFAULT 0,
  p10_trust_score numeric DEFAULT 0,
  average_score_change numeric DEFAULT 0,
  positive_changes integer DEFAULT 0,
  negative_changes integer DEFAULT 0,
  events_processed integer DEFAULT 0,
  calculations_run integer DEFAULT 0,
  manual_overrides integer DEFAULT 0,
  fraud_penalties integer DEFAULT 0,
  verification_bonuses integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, trust_level, score_range)
);

ALTER TABLE trust_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_trustanalytics_admin" ON trust_analytics;
CREATE POLICY "crud_trustanalytics_admin" ON trust_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 12. Risk Analytics
CREATE TABLE risk_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  risk_level text,
  risk_type text,
  total_profiles integer DEFAULT 0,
  new_risks integer DEFAULT 0,
  resolved_risks integer DEFAULT 0,
  escalated_risks integer DEFAULT 0,
  false_positives integer DEFAULT 0,
  avg_risk_score numeric DEFAULT 0,
  manual_reviews integer DEFAULT 0,
  auto_resolved integer DEFAULT 0,
  avg_resolution_time_hours numeric,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, risk_level, risk_type)
);

ALTER TABLE risk_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_riskanalytics_admin" ON risk_analytics;
CREATE POLICY "crud_riskanalytics_admin" ON risk_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Indexes
CREATE INDEX IF NOT EXISTS idx_trustprofile_user ON trust_score_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_trustprofile_score ON trust_score_profiles(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_trustprofile_level ON trust_score_profiles(trust_level);
CREATE INDEX IF NOT EXISTS idx_trustprofile_verify ON trust_score_profiles(is_verified);

CREATE INDEX IF NOT EXISTS idx_trustfactors_profile ON trust_score_factors(profile_id);
CREATE INDEX IF NOT EXISTS idx_trustfactors_type ON trust_score_factors(factor_type);

CREATE INDEX IF NOT EXISTS idx_trusthistory_user ON trust_score_history(user_id);
CREATE INDEX IF NOT EXISTS idx_trusthistory_date ON trust_score_history(calculated_at DESC);

CREATE INDEX IF NOT EXISTS idx_trustevents_user ON trust_score_events(user_id);
CREATE INDEX IF NOT EXISTS idx_trustevents_processed ON trust_score_events(is_processed);
CREATE INDEX IF NOT EXISTS idx_trustevents_type ON trust_score_events(event_type);

CREATE INDEX IF NOT EXISTS idx_repprofile_entity ON reputation_profiles(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_repprofile_score ON reputation_profiles(reputation_score DESC);

CREATE INDEX IF NOT EXISTS idx_fintel_user ON financial_intelligence_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_fintel_tier ON financial_intelligence_profiles(spending_tier);

CREATE INDEX IF NOT EXISTS idx_elig_user ON eligibility_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_riskprofile_user ON risk_analysis_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_riskprofile_level ON risk_analysis_profiles(overall_risk_level);
CREATE INDEX IF NOT EXISTS idx_riskprofile_review ON risk_analysis_profiles(manual_review_required);

CREATE INDEX IF NOT EXISTS idx_riskevents_user ON risk_events(user_id);
CREATE INDEX IF NOT EXISTS idx_riskevents_status ON risk_events(resolution_status);
CREATE INDEX IF NOT EXISTS idx_riskevents_severity ON risk_events(severity);

CREATE INDEX IF NOT EXISTS idx_trustanalytics_date ON trust_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_riskanalytics_date ON risk_analytics(date DESC);

-- 14. Triggers
DROP TRIGGER IF EXISTS trg_trustprofile_updated ON trust_score_profiles;
CREATE TRIGGER trg_trustprofile_updated BEFORE UPDATE ON trust_score_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_trustfactors_updated ON trust_score_factors;
CREATE TRIGGER trg_trustfactors_updated BEFORE UPDATE ON trust_score_factors
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_repprofile_updated ON reputation_profiles;
CREATE TRIGGER trg_repprofile_updated BEFORE UPDATE ON reputation_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_fintel_updated ON financial_intelligence_profiles;
CREATE TRIGGER trg_fintel_updated BEFORE UPDATE ON financial_intelligence_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_elig_updated ON eligibility_profiles;
CREATE TRIGGER trg_elig_updated BEFORE UPDATE ON eligibility_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_riskprofile_updated ON risk_analysis_profiles;
CREATE TRIGGER trg_riskprofile_updated BEFORE UPDATE ON risk_analysis_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_config_updated ON trust_score_config;
CREATE TRIGGER trg_config_updated BEFORE UPDATE ON trust_score_config
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 15. Functions
CREATE OR REPLACE FUNCTION calculate_trust_score(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  v_score integer := 0;
  v_base_score integer := 100;
  v_factor record;
  v_config jsonb;
BEGIN
  SELECT factor_weights INTO v_config
  FROM trust_score_config
  WHERE is_active = true
  ORDER BY effective_from DESC
  LIMIT 1;

  IF v_config IS NULL THEN
    v_config := jsonb_build_object(
      'purchase_history', 100, 'care_club_participation', 80,
      'successful_deliveries', 70, 'seller_reputation', 60,
      'customer_reviews', 80, 'refund_history', -50,
      'fraud_detection', -100, 'account_verification', 100,
      'platform_activity', 50, 'community_contribution', 50,
      'financial_behavior', 70
    );
  END IF;

  v_score := v_base_score;

  FOR v_factor IN
    SELECT factor_type, factor_score, factor_weight
    FROM trust_score_factors
    WHERE profile_id = (SELECT id FROM trust_score_profiles WHERE user_id = p_user_id)
  LOOP
    v_score := v_score + (v_factor.factor_score * v_factor.factor_weight)::integer;
  END LOOP;

  v_score := GREATEST(0, LEAST(1000, v_score));

  UPDATE trust_score_profiles
  SET trust_score = v_score, last_calculated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO trust_score_history (
    profile_id, user_id, previous_score, new_score, score_change,
    change_reason, change_type, algorithm_version
  )
  SELECT id, p_user_id, trust_score, v_score, v_score - trust_score,
         'Routine calculation', 'calculation', '1.0'
  FROM trust_score_profiles WHERE user_id = p_user_id;

  RETURN v_score;
END;
$function$;

CREATE OR REPLACE FUNCTION get_trust_level(p_score integer)
RETURNS text
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN CASE
    WHEN p_score >= 900 THEN 'elite'
    WHEN p_score >= 750 THEN 'premium'
    WHEN p_score >= 600 THEN 'trusted'
    WHEN p_score >= 400 THEN 'established'
    WHEN p_score >= 200 THEN 'building'
    ELSE 'new'
  END;
END;
$function$;

CREATE OR REPLACE FUNCTION update_trust_level()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE trust_score_profiles
  SET trust_level = get_trust_level(trust_score)
  WHERE trust_level != get_trust_level(trust_score);
END;
$function$;

CREATE OR REPLACE FUNCTION get_trust_dashboard()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_profiles', (SELECT COUNT(*) FROM trust_score_profiles),
    'verified_profiles', (SELECT COUNT(*) FROM trust_score_profiles WHERE is_verified = true),
    'avg_trust_score', COALESCE((SELECT ROUND(AVG(trust_score)::numeric, 2) FROM trust_score_profiles), 0),
    'elite_users', (SELECT COUNT(*) FROM trust_score_profiles WHERE trust_level = 'elite'),
    'premium_users', (SELECT COUNT(*) FROM trust_score_profiles WHERE trust_level = 'premium'),
    'trusted_users', (SELECT COUNT(*) FROM trust_score_profiles WHERE trust_level = 'trusted'),
    'high_risk_users', (SELECT COUNT(*) FROM risk_analysis_profiles WHERE overall_risk_level IN ('high', 'critical')),
    'pending_reviews', (SELECT COUNT(*) FROM risk_analysis_profiles WHERE manual_review_required = true),
    'pending_events', (SELECT COUNT(*) FROM trust_score_events WHERE is_processed = false),
    'level_distribution', (SELECT jsonb_agg(jsonb_build_object('level', trust_level, 'count', cnt))
      FROM (SELECT trust_level, COUNT(*) as cnt FROM trust_score_profiles GROUP BY trust_level) sq
    )
  ) INTO v_stats;

  RETURN v_stats;
END;
$function$;
