-- ============================================================
-- Migration 083: Universal User Journey & Experience Engine
-- Phase 5 — Personal Dashboard, Quick Actions, Engagement
-- ============================================================

-- 1. User Experience Preferences
CREATE TABLE IF NOT EXISTS user_experience_prefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Dashboard Preferences
  preferred_theme text DEFAULT 'auto' CHECK (preferred_theme IN ('light', 'dark', 'auto')),
  dashboard_layout jsonb DEFAULT '{"type":"default"}'::jsonb,
  
  -- Quick Actions Order
  quick_actions_order jsonb DEFAULT '["search", "scan", "upload", "voice", "emergency", "wallet", "notifications"]'::jsonb,
  
  -- Notification Preferences
  deal_alerts boolean DEFAULT true,
  learning_alerts boolean DEFAULT true,
  community_alerts boolean DEFAULT true,
  smartcode_alerts boolean DEFAULT true,
  
  -- Home Experience Zones Order
  experience_zones_order jsonb DEFAULT '["shop", "learn", "services", "community", "wallet"]'::jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

ALTER TABLE user_experience_prefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_prefs" ON user_experience_prefs;
CREATE POLICY "select_own_prefs" ON user_experience_prefs FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "update_own_prefs" ON user_experience_prefs;
CREATE POLICY "update_own_prefs" ON user_experience_prefs FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

-- 2. Daily Engagement Opportunities
CREATE TABLE IF NOT EXISTS daily_engagement_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_date date NOT NULL DEFAULT current_date,
  
  -- Types
  opportunity_type text NOT NULL CHECK (opportunity_type IN (
    'featured_deal', 'new_learning', 'daily_quiz', 'community_mission',
    'care_club_activity', 'merchant_offer', 'smartcode_challenge', 'flash_sale'
  )),
  
  -- Content
  title text NOT NULL,
  description text,
  image_url text,
  
  -- Target
  target_type text CHECK (target_type IN ('product', 'course', 'quiz', 'campaign', 'merchant', 'smartcode')),
  target_id uuid,
  action_url text,
  
  -- Rewards
  smartpoints_reward integer DEFAULT 0,
  bonus_multiplier numeric DEFAULT 1.0,
  
  -- Stats
  views_count integer DEFAULT 0,
  clicks_count integer DEFAULT 0,
  
  -- Scheduling
  start_time timestamptz DEFAULT now(),
  end_time timestamptz DEFAULT (now() + interval '24 hours'),
  
  display_priority integer DEFAULT 0,
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_engagement_opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_opportunities_all" ON daily_engagement_opportunities;
CREATE POLICY "select_opportunities_all" ON daily_engagement_opportunities FOR SELECT
  TO authenticated, anon USING (is_active = true AND end_time > now());

-- 3. User Progress Tracking
CREATE TABLE IF NOT EXISTS user_progress_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Progress Categories
  progress_type text NOT NULL CHECK (progress_type IN (
    'learning', 'shopping', 'community', 'trust_score', 'challenge', 'reward_unlock',
    'smartcode', 'care_club', 'essential_services', 'volunteer'
  )),
  
  -- Progress Data
  current_level integer DEFAULT 1,
  current_points integer DEFAULT 0,
  points_to_next_level integer DEFAULT 100,
  
  -- Totals
  total_sessions integer DEFAULT 0,
  total_actions integer DEFAULT 0,
  
  -- Streak
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date,
  
  -- Milestones
  milestones_achieved jsonb DEFAULT '[]'::jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, progress_type)
);

ALTER TABLE user_progress_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON user_progress_tracking;
CREATE POLICY "select_own_progress" ON user_progress_tracking FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "update_own_progress" ON user_progress_tracking;
CREATE POLICY "update_own_progress" ON user_progress_tracking FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

-- 4. Achievement System
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_code text NOT NULL UNIQUE,
  achievement_name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN (
    'learning', 'shopping', 'community', 'trust', 'smartcode', 'care', 'streak'
  )),
  
  -- Badge
  badge_url text,
  badge_color text DEFAULT 'gold',
  
  -- Requirements
  requirement_type text DEFAULT 'count' CHECK (requirement_type IN ('count', 'streak', 'points', 'level')),
  requirement_value integer DEFAULT 1,
  
  -- Rewards
  smartpoints_reward integer DEFAULT 0,
  badge_level integer DEFAULT 1,
  
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_hidden boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_achievements_all" ON achievement_definitions;
CREATE POLICY "select_achievements_all" ON achievement_definitions FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- Insert default achievements
INSERT INTO achievement_definitions (achievement_code, achievement_name, description, category, requirement_type, requirement_value, smartpoints_reward) VALUES
('first_purchase', 'First Purchase', 'Complete your first marketplace purchase', 'shopping', 'count', 1, 10),
('learning_starter', 'Learning Starter', 'Complete your first learning video', 'learning', 'count', 1, 15),
('quiz_master', 'Quiz Master', 'Complete 10 quizzes successfully', 'learning', 'count', 10, 50),
('care_champion', 'Care Champion', 'Make your first Care Club contribution', 'care', 'count', 1, 20),
('smartcode_winner', 'SmartCode Winner', 'Win your first SmartCode challenge', 'smartcode', 'count', 1, 100),
('7_day_streak', 'Week Warrior', 'Maintain a 7-day activity streak', 'streak', 'streak', 7, 30),
('30_day_streak', 'Monthly Master', 'Maintain a 30-day activity streak', 'streak', 'streak', 30, 100),
('trusted_member', 'Trusted Member', 'Reach Trust Score of 50', 'trust', 'points', 50, 25),
('highly_trusted', 'Highly Trusted', 'Reach Trust Score of 75', 'trust', 'points', 75, 50),
('community_hero', 'Community Hero', 'Help 100 beneficiaries through Care Club', 'community', 'count', 100, 200)
ON CONFLICT (achievement_code) DO NOTHING;

-- 5. User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievement_definitions(id) ON DELETE CASCADE,
  
  achieved_at timestamptz DEFAULT now(),
  smartpoints_awarded integer DEFAULT 0,
  notified boolean DEFAULT false,
  
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_achievements" ON user_achievements;
CREATE POLICY "select_own_achievements" ON user_achievements FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- 6. Universal Search Index
CREATE TABLE IF NOT EXISTS universal_search_index (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  entity_type text NOT NULL CHECK (entity_type IN (
    'product', 'service', 'course', 'job', 'merchant', 'article', 'community', 'smartcode'
  )),
  entity_id uuid NOT NULL,
  
  -- Searchable Content
  title text NOT NULL,
  description text,
  keywords jsonb DEFAULT '[]'::jsonb,
  
  -- Filters
  category text,
  tags jsonb DEFAULT '[]'::jsonb,
  
  -- Ranking
  popularity_score integer DEFAULT 0,
  relevance_score numeric DEFAULT 1.0,
  
  -- Status
  is_active boolean DEFAULT true,
  last_updated timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE universal_search_index ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_search_all" ON universal_search_index;
CREATE POLICY "select_search_all" ON universal_search_index FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- 7. User Search History
CREATE TABLE IF NOT EXISTS user_search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  search_query text NOT NULL,
  search_type text DEFAULT 'text' CHECK (search_type IN ('text', 'voice', 'image', 'smartcode')),
  
  -- Results
  results_count integer DEFAULT 0,
  clicked_entity_type text,
  clicked_entity_id uuid,
  
  -- Context
  session_id text,
  device_type text,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_search_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_search" ON user_search_history;
CREATE POLICY "select_own_search" ON user_search_history FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- 8. Daily Tips & Recommendations
CREATE TABLE IF NOT EXISTS daily_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_type text NOT NULL CHECK (tip_type IN ('feature', 'earning', 'savings', 'community', 'safety')),
  
  title text NOT NULL,
  content text NOT NULL,
  icon text,
  
  -- Targeting
  target_audience text DEFAULT 'all' CHECK (target_audience IN ('all', 'new', 'active', 'inactive')),
  
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_tips_all" ON daily_tips;
CREATE POLICY "select_tips_all" ON daily_tips FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- Insert default tips
INSERT INTO daily_tips (tip_type, title, content, icon, display_order) VALUES
('earning', 'Earn SmartPoints', 'Complete learning videos to earn SmartPoints that can be redeemed for benefits.', 'Sparkles', 1),
('savings', 'Smart Deals', 'Check the Daily Deals section for exclusive discounts on products.', 'Tag', 2),
('community', 'Care Club', 'Your Care Club contributions help support community welfare programs.', 'Heart', 3),
('feature', 'SmartCode Challenge', 'Enter your weekly SmartCode for a chance to win exciting rewards.', 'Hash', 4),
('safety', 'Trust Score', 'Maintain a high Trust Score for access to premium opportunities.', 'Shield', 5)
ON CONFLICT DO NOTHING;

-- 9. Experience Zone Stats
CREATE TABLE IF NOT EXISTS user_experience_zone_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  zone_type text NOT NULL CHECK (zone_type IN ('shop', 'learn', 'services', 'community', 'wallet')),
  
  -- Engagement
  visits_count integer DEFAULT 0,
  actions_count integer DEFAULT 0,
  
  -- Last Activity
  last_visit_at timestamptz,
  last_action_at timestamptz,
  
  -- Favorites
  favorite_items jsonb DEFAULT '[]'::jsonb,
  
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, zone_type)
);

ALTER TABLE user_experience_zone_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_zone_stats" ON user_experience_zone_stats;
CREATE POLICY "select_own_zone_stats" ON user_experience_zone_stats FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- 10. User Recommendations
CREATE TABLE IF NOT EXISTS user_personalized_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Recommendation
  recommendation_type text NOT NULL CHECK (recommendation_type IN (
    'product', 'service', 'course', 'job', 'merchant', 'community', 'smartcode', 'care'
  )),
  target_entity_id uuid,
  
  -- AI Scoring
  relevance_score numeric DEFAULT 0,
  confidence_score numeric DEFAULT 0,
  reason text,
  
  -- Interaction
  was_shown boolean DEFAULT false,
  was_clicked boolean DEFAULT false,
  was_dismissed boolean DEFAULT false,
  dismissed_reason text,
  
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_personalized_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_recommendations" ON user_personalized_recommendations;
CREATE POLICY "select_own_recommendations" ON user_personalized_recommendations FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- 11. INDEXES
CREATE INDEX IF NOT EXISTS idx_daily_engagement_date ON daily_engagement_opportunities(opportunity_date);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_search_index_type ON universal_search_index(entity_type);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON user_search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON user_personalized_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_zone_stats_user ON user_experience_zone_stats(user_id);

-- 12. TRIGGERS
DROP TRIGGER IF EXISTS trg_user_prefs_updated ON user_experience_prefs;
CREATE TRIGGER trg_user_prefs_updated BEFORE UPDATE ON user_experience_prefs
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_user_progress_updated ON user_progress_tracking;
CREATE TRIGGER trg_user_progress_updated BEFORE UPDATE ON user_progress_tracking
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 13. FUNCTIONS

-- Get User Dashboard Summary
CREATE OR REPLACE FUNCTION get_user_dashboard_summary(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_profile RECORD;
  v_wallet_a RECORD;
  v_wallet_b RECORD;
  v_achievements jsonb;
  v_stats jsonb;
BEGIN
  -- Get profile
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
  
  -- Get Wallet A
  SELECT * INTO v_wallet_a FROM wallet_a_smart WHERE user_id = p_user_id;
  
  -- Get Wallet B
  SELECT * INTO v_wallet_b FROM wallet_b_foe WHERE user_id = p_user_id;
  
  -- Get recent achievements
  SELECT jsonb_agg(jsonb_build_object(
    'achievement_code', a.achievement_code,
    'achievement_name', a.achievement_name,
    'category', a.category,
    'achieved_at', ua.achieved_at
  )) INTO v_achievements
  FROM user_achievements ua
  JOIN achievement_definitions a ON a.id = ua.achievement_id
  WHERE ua.user_id = p_user_id
  ORDER BY ua.achieved_at DESC
  LIMIT 5;
  
  -- Build summary
  SELECT jsonb_build_object(
    'profile', jsonb_build_object(
      'name', v_profile.name,
      'trust_score', v_profile.trust_score,
      'points', v_profile.points
    ),
    'wallet_a', CASE WHEN v_wallet_a IS NULL THEN jsonb_build_object(
      'smartpoints_balance', 0,
      'total_earned', 0
    ) ELSE jsonb_build_object(
      'smartpoints_balance', v_wallet_a.smartpoints_balance,
      'total_earned', v_wallet_a.total_earned
    ) END,
    'wallet_b', CASE WHEN v_wallet_b IS NULL THEN jsonb_build_object(
      'foe_units_balance', 0,
      'active_projects', 0
    ) ELSE jsonb_build_object(
      'foe_units_balance', v_wallet_b.foe_units_balance,
      'active_projects', v_wallet_b.active_projects
    ) END,
    'recent_achievements', COALESCE(v_achievements, '[]'::jsonb)
  ) INTO v_stats;
  
  RETURN v_stats;
END;
$function$;

-- Track User Activity
CREATE OR REPLACE FUNCTION track_user_zone_activity(
  p_user_id uuid,
  p_zone_type text,
  p_action_type text DEFAULT 'visit'
)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO user_experience_zone_stats (user_id, zone_type, visits_count, last_visit_at)
  VALUES (p_user_id, p_zone_type, 1, now())
  ON CONFLICT (user_id, zone_type) DO UPDATE SET
    visits_count = CASE WHEN p_action_type = 'visit' THEN user_experience_zone_stats.visits_count + 1 ELSE user_experience_zone_stats.visits_count END,
    actions_count = user_experience_zone_stats.actions_count + 1,
    last_visit_at = CASE WHEN p_action_type = 'visit' THEN now() ELSE user_experience_zone_stats.last_visit_at END,
    last_action_at = now(),
    updated_at = now();
END;
$function$;

-- Get Today's Opportunities
CREATE OR REPLACE FUNCTION get_today_opportunities()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_opportunities jsonb;
BEGIN
  SELECT jsonb_agg(jsonb_build_object(
    'id', id,
    'type', opportunity_type,
    'title', title,
    'description', description,
    'image_url', image_url,
    'smartpoints_reward', smartpoints_reward,
    'action_url', action_url
  )) INTO v_opportunities
  FROM daily_engagement_opportunities
  WHERE opportunity_date = current_date
    AND is_active = true
    AND end_time > now()
  ORDER BY display_priority, created_at;
  
  RETURN COALESCE(v_opportunities, '[]'::jsonb);
END;
$function$;
