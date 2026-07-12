-- ============================================================
-- Migration 081: SmartCode Operating System - Phase 3
-- Complete SmartCode, SmartPoints, Trust Score Integration
-- ============================================================

-- 1. SmartPoints Earning Rules (Non-Purchasable)
CREATE TABLE IF NOT EXISTS smartpoints_earning_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type text NOT NULL UNIQUE,
  activity_name text NOT NULL,
  activity_category text NOT NULL CHECK (activity_category IN (
    'marketplace_purchase', 'care_club', 'education', 'quiz',
    'essential_services', 'volunteer', 'community', 'daily_engagement',
    'referral', 'smartcode_participation'
  )),
  base_points integer NOT NULL DEFAULT 0,
  multiplier numeric DEFAULT 1.0,
  max_daily_points integer DEFAULT 100,
  max_weekly_points integer DEFAULT 500,
  is_active boolean DEFAULT true,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE smartpoints_earning_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_rules_all" ON smartpoints_earning_rules;
CREATE POLICY "select_rules_all" ON smartpoints_earning_rules FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- Insert default earning rules
INSERT INTO smartpoints_earning_rules (activity_type, activity_name, activity_category, base_points, max_daily_points, max_weekly_points) VALUES
('marketplace_purchase', 'Marketplace Purchase', 'marketplace_purchase', 1, 0, 0),
('care_club_contribution', 'Care Club Contribution', 'care_club', 5, 100, 500),
('educational_video', 'Watch Educational Video', 'education', 10, 50, 200),
('knowledge_quiz_pass', 'Knowledge Quiz Completion', 'quiz', 20, 100, 400),
('essential_service', 'Essential Service Usage', 'essential_services', 5, 30, 150),
('volunteer_activity', 'Volunteer Activity', 'volunteer', 25, 100, 500),
('community_participation', 'Community Participation', 'community', 15, 50, 250),
('daily_login', 'Daily Login', 'daily_engagement', 5, 5, 35),
('referral_complete', 'Successful Referral', 'referral', 50, 200, 1000),
('smartcode_entry', 'SmartCode Entry', 'smartcode_participation', 10, 70, 70)
ON CONFLICT (activity_type) DO NOTHING;

-- 2. SmartPoints Earnings Log
CREATE TABLE IF NOT EXISTS smartpoints_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL REFERENCES smartpoints_earning_rules(activity_type),
  points_earned integer NOT NULL,
  
  -- Source Reference
  source_type text,
  source_id uuid,
  
  -- Validation
  is_validated boolean DEFAULT true,
  validation_notes text,
  
  -- AI Fraud Check
  ai_risk_score integer DEFAULT 0,
  ai_checked boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE smartpoints_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_earnings" ON smartpoints_earnings;
CREATE POLICY "select_own_earnings" ON smartpoints_earnings FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_earnings" ON smartpoints_earnings;
CREATE POLICY "insert_own_earnings" ON smartpoints_earnings FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_earnings_user ON smartpoints_earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_earnings_activity ON smartpoints_earnings(activity_type);

-- 3. Knowledge Challenge System
CREATE TABLE IF NOT EXISTS knowledge_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_code text NOT NULL UNIQUE,
  challenge_type text NOT NULL CHECK (challenge_type IN ('video', 'article', 'interactive')),
  title text NOT NULL,
  description text,
  category text,
  
  -- Content
  video_url text,
  article_content text,
  duration_minutes integer DEFAULT 5,
  
  -- Quiz
  quiz_questions jsonb DEFAULT '[]'::jsonb,
  passing_score integer DEFAULT 70,
  max_attempts integer DEFAULT 3,
  
  -- Rewards
  smartpoints_reward integer DEFAULT 20,
  bonus_points_first_pass integer DEFAULT 10,
  
  -- Status
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE knowledge_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_challenges_all" ON knowledge_challenges;
CREATE POLICY "select_challenges_all" ON knowledge_challenges FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- 4. User Challenge Progress
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES knowledge_challenges(id) ON DELETE CASCADE,
  
  -- Status
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
  
  -- Progress
  video_watched boolean DEFAULT false,
  video_progress_percent integer DEFAULT 0,
  
  -- Quiz
  quiz_attempts integer DEFAULT 0,
  quiz_score integer,
  quiz_passed boolean DEFAULT false,
  quiz_answers jsonb,
  
  -- Rewards
  points_awarded integer DEFAULT 0,
  bonus_awarded integer DEFAULT 0,
  
  -- Timestamps
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON user_challenge_progress;
CREATE POLICY "select_own_progress" ON user_challenge_progress FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_progress" ON user_challenge_progress;
CREATE POLICY "insert_own_progress" ON user_challenge_progress FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "update_own_progress" ON user_challenge_progress;
CREATE POLICY "update_own_progress" ON user_challenge_progress FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

-- 5. Weekly AI Validation Log
CREATE TABLE IF NOT EXISTS weekly_ai_validation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id uuid,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Validation Checks
  duplicate_check_passed boolean DEFAULT false,
  fake_account_check_passed boolean DEFAULT false,
  device_abuse_check_passed boolean DEFAULT false,
  multiple_identity_check_passed boolean DEFAULT false,
  suspicious_behavior_check_passed boolean DEFAULT false,
  rule_violation_check_passed boolean DEFAULT false,
  
  -- AI Analysis
  overall_risk_score integer DEFAULT 0,
  ai_confidence integer DEFAULT 0,
  ai_recommendation text,
  
  -- Flags
  has_flags boolean DEFAULT false,
  flags jsonb DEFAULT '[]'::jsonb,
  
  -- Result
  is_validated boolean DEFAULT false,
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected', 'manual_review')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_ai_validation ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_validation_user ON weekly_ai_validation(user_id);
CREATE INDEX IF NOT EXISTS idx_validation_week ON weekly_ai_validation(week_id);

-- 6. Transparency Dashboard Stats
CREATE TABLE IF NOT EXISTS transparency_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date NOT NULL DEFAULT current_date,
  
  -- Participants
  total_active_participants integer DEFAULT 0,
  new_participants_today integer DEFAULT 0,
  verified_participants integer DEFAULT 0,
  
  -- Entries
  total_entries_today integer DEFAULT 0,
  verified_entries_today integer DEFAULT 0,
  rejected_entries_today integer DEFAULT 0,
  
  -- Weekly
  current_week_entries integer DEFAULT 0,
  current_week_participants integer DEFAULT 0,
  
  -- Rewards
  rewards_distributed_today numeric DEFAULT 0,
  smartpoints_earned_today integer DEFAULT 0,
  
  -- Trust
  avg_trust_score numeric DEFAULT 0,
  high_trust_users integer DEFAULT 0,
  
  -- Activity
  marketplace_transactions integer DEFAULT 0,
  careclub_contributions integer DEFAULT 0,
  quizzes_completed integer DEFAULT 0,
  videos_watched integer DEFAULT 0,
  
  -- Fraud Detection
  fraud_attempts_blocked integer DEFAULT 0,
  duplicate_accounts_detected integer DEFAULT 0,
  suspicious_activity_flags integer DEFAULT 0,
  
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(stat_date)
);

ALTER TABLE transparency_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_stats_all" ON transparency_stats;
CREATE POLICY "select_stats_all" ON transparency_stats FOR SELECT
  TO authenticated, anon USING (true);

-- 7. SmartCode Academy Content
CREATE TABLE IF NOT EXISTS smartcode_academy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('guide', 'video', 'faq', 'rule', 'tutorial')),
  title text NOT NULL,
  content text,
  video_url text,
  image_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE smartcode_academy ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_academy_all" ON smartcode_academy;
CREATE POLICY "select_academy_all" ON smartcode_academy FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- Insert default academy content
INSERT INTO smartcode_academy (content_type, title, content, display_order) VALUES
('guide', 'What is SmartCode?', 'SmartCode is VLOOP''s unique 3-digit participation code system that rewards active ecosystem participation.', 1),
('guide', 'How to Participate', 'Enter your SmartCode weekly, complete activities, and build your Trust Score for reward eligibility.', 2),
('rule', 'Weekly Participation', 'Each user can submit one SmartCode entry per week. Duplicate entries are automatically blocked.', 3),
('rule', 'Trust Score', 'Your Trust Score is calculated from marketplace activity, learning, and community participation.', 4),
('faq', 'How are winners selected?', 'SmartCode uses a transparent AI-verified selection process based on Trust Score and participation.', 5),
('faq', 'Can I buy SmartPoints?', 'No. SmartPoints can ONLY be earned through approved ecosystem activities. They are never purchasable.', 6),
('tutorial', 'Entering Your SmartCode', 'Follow these steps: 1) Ensure you are logged in 2) Navigate to SmartCode section 3) Enter your 3-digit code 4) Submit before weekly deadline.', 7),
('video', 'SmartCode Tutorial', null, 8)
ON CONFLICT DO NOTHING;

-- 8. User SmartPoints Summary View
CREATE OR REPLACE VIEW user_smartpoints_summary AS
SELECT 
  u.id as user_id,
  u.name,
  u.email,
  COALESCE(SUM(se.points_earned), 0) as total_points_earned,
  COALESCE(SUM(se.points_earned) FILTER (WHERE se.created_at > now() - interval '7 days'), 0) as points_last_7_days,
  COALESCE(SUM(se.points_earned) FILTER (WHERE se.created_at > now() - interval '30 days'), 0) as points_last_30_days,
  COUNT(se.id) as total_earnings_count,
  MAX(se.created_at) as last_earning_at
FROM profiles u
LEFT JOIN smartpoints_earnings se ON se.user_id = u.id
GROUP BY u.id, u.name, u.email;

-- 9. Weekly SmartStats Function
CREATE OR REPLACE FUNCTION get_weekly_smartcode_stats(p_week_id uuid DEFAULT null)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_participants', COALESCE((SELECT SUM(total_active_participants) FROM transparency_stats WHERE stat_date > now() - interval '7 days'), 0),
    'verified_entries', COALESCE((SELECT SUM(verified_entries_today) FROM transparency_stats WHERE stat_date > now() - interval '7 days'), 0),
    'rewards_distributed', COALESCE((SELECT SUM(rewards_distributed_today) FROM transparency_stats WHERE stat_date > now() - interval '7 days'), 0),
    'fraud_blocked', COALESCE((SELECT SUM(fraud_attempts_blocked) FROM transparency_stats WHERE stat_date > now() - interval '7 days'), 0),
    'avg_trust', COALESCE((SELECT AVG(avg_trust_score) FROM transparency_stats WHERE stat_date > now() - interval '7 days'), 0),
    'quizzes_completed', COALESCE((SELECT SUM(quizzes_completed) FROM transparency_stats WHERE stat_date > now() - interval '7 days'), 0),
    'videos_watched', COALESCE((SELECT SUM(videos_watched) FROM transparency_stats WHERE stat_date > now() - interval '7 days'), 0)
  ) INTO v_stats;
  
  RETURN v_stats;
END;
$function$;

-- 10. Earn SmartPoints Function
CREATE OR REPLACE FUNCTION earn_smartpoints(
  p_user_id uuid,
  p_activity_type text,
  p_source_id uuid DEFAULT null,
  p_source_type text DEFAULT null
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_rule RECORD;
  v_points integer;
  v_daily_total integer;
  v_weekly_total integer;
BEGIN
  -- Get earning rule
  SELECT * INTO v_rule FROM smartpoints_earning_rules WHERE activity_type = p_activity_type AND is_active = true;
  
  IF v_rule IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid activity type');
  END IF;
  
  -- Check daily limit
  SELECT COALESCE(SUM(points_earned), 0) INTO v_daily_total
  FROM smartpoints_earnings
  WHERE user_id = p_user_id
    AND activity_type = p_activity_type
    AND created_at > now() - interval '1 day';
  
  IF v_rule.max_daily_points > 0 AND v_daily_total + v_rule.base_points > v_rule.max_daily_points THEN
    RETURN jsonb_build_object('success', false, 'error', 'Daily limit reached', 'current', v_daily_total, 'max', v_rule.max_daily_points);
  END IF;
  
  -- Check weekly limit
  SELECT COALESCE(SUM(points_earned), 0) INTO v_weekly_total
  FROM smartpoints_earnings
  WHERE user_id = p_user_id
    AND activity_type = p_activity_type
    AND created_at > now() - interval '7 days';
  
  IF v_rule.max_weekly_points > 0 AND v_weekly_total + v_rule.base_points > v_rule.max_weekly_points THEN
    RETURN jsonb_build_object('success', false, 'error', 'Weekly limit reached', 'current', v_weekly_total, 'max', v_rule.max_weekly_points);
  END IF;
  
  -- Calculate points
  v_points := (v_rule.base_points * v_rule.multiplier)::integer;
  
  -- Insert earning
  INSERT INTO smartpoints_earnings (user_id, activity_type, points_earned, source_id, source_type)
  VALUES (p_user_id, p_activity_type, v_points, p_source_id, p_source_type);
  
  RETURN jsonb_build_object(
    'success', true,
    'points_earned', v_points,
    'activity', v_rule.activity_name,
    'daily_total', v_daily_total + v_points,
    'weekly_total', v_weekly_total + v_points
  );
END;
$function$;

-- 11. Validate User Participation Function
CREATE OR REPLACE FUNCTION validate_user_participation(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_trust RECORD;
  v_flags jsonb := '[]'::jsonb;
  v_risk_score integer := 0;
  v_is_valid boolean := true;
BEGIN
  -- Get user trust score
  SELECT * INTO v_trust FROM vcos_customer_trust_score WHERE user_id = p_user_id;
  
  IF v_trust IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'No trust profile found');
  END IF;
  
  -- Check if locked
  IF v_trust.is_locked THEN
    v_is_valid := false;
    v_flags := v_flags || jsonb_build_object('flag', 'account_locked', 'reason', 'Account is locked');
    v_risk_score := v_risk_score + 50;
  END IF;
  
  -- Check fraud risk
  IF v_trust.fraud_risk_score > 50 THEN
    v_is_valid := false;
    v_flags := v_flags || jsonb_build_object('flag', 'high_fraud_risk', 'score', v_trust.fraud_risk_score);
    v_risk_score := v_risk_score + v_trust.fraud_risk_score;
  END IF;
  
  -- Check risk score
  IF v_trust.risk_score > 70 THEN
    v_flags := v_flags || jsonb_build_object('flag', 'high_risk', 'score', v_trust.risk_score);
    v_risk_score := v_risk_score + 30;
    v_is_valid := false;
  END IF;
  
  RETURN jsonb_build_object(
    'valid', v_is_valid,
    'trust_score', v_trust.trust_score,
    'trust_level', v_trust.trust_level,
    'risk_score', v_risk_score,
    'flags', v_flags
  );
END;
$function$;
