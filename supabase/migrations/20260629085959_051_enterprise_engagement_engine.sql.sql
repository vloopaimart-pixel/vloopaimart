-- VLOOP Enterprise Engagement Engine
-- Phase 23 - Intelligence & Engagement Engine

-- ============================================================================
-- SMARTCODE INTELLIGENCE ENGINE
-- ============================================================================

-- SmartCode History (winning codes)
CREATE TABLE IF NOT EXISTS smartcode_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  smartcode text NOT NULL,
  week_period text NOT NULL,
  drawn_at timestamptz DEFAULT now(),
  total_participants integer DEFAULT 0,
  total_winners integer DEFAULT 0,
  total_distribution numeric DEFAULT 0,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_smartcode_history_week ON smartcode_history(week_period);

-- SmartCode Selection Stats (tracking popular codes)
CREATE TABLE IF NOT EXISTS smartcode_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  smartcode text NOT NULL,
  user_id uuid REFERENCES profiles(id),
  points_used integer DEFAULT 0,
  category text DEFAULT 'standard',
  week_period text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_smartcode_selections_code ON smartcode_selections(smartcode);
CREATE INDEX idx_smartcode_selections_week ON smartcode_selections(week_period);

-- SmartCode Stats Summary (aggregated)
CREATE TABLE IF NOT EXISTS smartcode_stats (
  smartcode text PRIMARY KEY,
  selection_count integer DEFAULT 0,
  win_count integer DEFAULT 0,
  last_selected_at timestamptz,
  last_won_at timestamptz
);

-- ============================================================================
-- QUIZ & KNOWLEDGE ENGINE
-- ============================================================================

-- Quiz Questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('Shopping', 'Consumer Awareness', 'Health', 'Insurance', 'VLOOP', 'Partner Offers')),
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation text,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward integer DEFAULT 10,
  is_active boolean DEFAULT true,
  partner_id uuid,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX idx_quiz_questions_active ON quiz_questions(is_active);

-- Quiz Results
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  question_id uuid REFERENCES quiz_questions(id),
  user_answer text,
  is_correct boolean DEFAULT false,
  xp_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_quiz_results_user ON quiz_results(user_id);

-- User XP & Badges
CREATE TABLE IF NOT EXISTS user_engagement (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) UNIQUE,
  xp_total integer DEFAULT 0,
  xp_level integer DEFAULT 1,
  trust_score numeric DEFAULT 50,
  quizzes_completed integer DEFAULT 0,
  quizzes_skipped integer DEFAULT 0,
  badges jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- DAILY HINT ENGINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_hints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hint_type text NOT NULL CHECK (hint_type IN ('smartcode', 'quiz', 'general')),
  title text NOT NULL,
  content text,
  image_url text,
  video_url text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  expires_at timestamptz,
  week_period text,
  partner_id uuid,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_daily_hints_type ON daily_hints(hint_type);
CREATE INDEX idx_daily_hints_published ON daily_hints(is_published, published_at);

-- ============================================================================
-- CARTOON & AWARENESS ENGINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS awareness_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('cartoon', 'animated_short', 'educational_video', 'insurance_awareness', 'consumer_awareness', 'partner_awareness', 'smartcode_discussion', 'quiz_discussion')),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  video_url text,
  duration_seconds integer,
  mascot text CHECK (mascot IN ('vloop_owl', 'vloop_robot', 'vloop_boy', 'vloop_girl', 'all')),
  episode_number integer,
  season integer,
  view_count integer DEFAULT 0,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  partner_id uuid,
  sponsored boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_awareness_content_type ON awareness_content(content_type);
CREATE INDEX idx_awareness_content_published ON awareness_content(is_published, published_at);

-- ============================================================================
-- SOCIAL & VIRAL ENGINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS social_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  share_type text NOT NULL CHECK (share_type IN ('daily_teaser', 'weekly_teaser', 'result_announcement', 'winner_story', 'educational_content', 'awareness_video')),
  platform text NOT NULL CHECK (platform IN ('youtube', 'facebook', 'instagram', 'whatsapp', 'x', 'telegram')),
  content_id uuid,
  share_url text,
  clicked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_social_shares_user ON social_shares(user_id);
CREATE INDEX idx_social_shares_platform ON social_shares(platform);

-- ============================================================================
-- PARTNER PROMOTION ENGINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS partner_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES store_partners(id),
  campaign_type text NOT NULL CHECK (campaign_type IN ('quiz_sponsor', 'hint_sponsor', 'cartoon_sponsor', 'video_sponsor', 'daily_challenge', 'product_placement')),
  title text NOT NULL,
  description text,
  product_id uuid REFERENCES products(id),
  content_id uuid,
  budget numeric DEFAULT 0,
  spent numeric DEFAULT 0,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  start_date date,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_partner_campaigns_partner ON partner_campaigns(partner_id);
CREATE INDEX idx_partner_campaigns_active ON partner_campaigns(is_active);

-- ============================================================================
-- ADMIN CONTROL CENTER
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('quiz_enabled', 'true', 'Enable/disable quiz feature'),
  ('skip_quiz_enabled', 'true', 'Allow users to skip quiz'),
  ('smartcode_auto_generate', 'true', 'Auto-generate weekly SmartCode'),
  ('hints_enabled', 'true', 'Enable daily hints'),
  ('awareness_center_enabled', 'true', 'Enable awareness center'),
  ('social_sharing_enabled', 'true', 'Enable social sharing'),
  ('partner_promotions_enabled', 'true', 'Enable partner promotions'),
  ('weekly_countdown_enabled', 'true', 'Show weekly countdown timer')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- ANALYTICS AGGREGATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  active_users integer DEFAULT 0,
  new_users integer DEFAULT 0,
  quiz_participants integer DEFAULT 0,
  quiz_skip_count integer DEFAULT 0,
  smartcode_selections integer DEFAULT 0,
  video_views integer DEFAULT 0,
  social_shares integer DEFAULT 0,
  wallet1_distribution numeric DEFAULT 0,
  wallet2_distribution numeric DEFAULT 0,
  partner_impressions integer DEFAULT 0,
  partner_clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_daily_analytics_date ON daily_analytics(date);

-- Weekly Analytics
CREATE TABLE IF NOT EXISTS weekly_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,
  week_end date NOT NULL,
  total_participants integer DEFAULT 0,
  total_winners integer DEFAULT 0,
  total_wallet1_distributed numeric DEFAULT 0,
  winning_smartcode text,
  most_selected_code text,
  least_selected_code text,
  quiz_completion_rate numeric DEFAULT 0,
  avg_trust_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_weekly_analytics_week ON weekly_analytics(week_start);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE smartcode_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartcode_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartcode_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE awareness_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_analytics ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
CREATE POLICY "read_published_hints" ON daily_hints FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "read_published_awareness" ON awareness_content FOR SELECT TO authenticated USING (is_published = true);
CREATE POLICY "read_active_questions" ON quiz_questions FOR SELECT TO authenticated USING (is_active = true);

-- User owns their own data
CREATE POLICY "user_quiz_results" ON quiz_results FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_engagement_own" ON user_engagement FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_social_shares" ON social_shares FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_smartcode_selections" ON smartcode_selections FOR ALL TO authenticated USING (auth.uid() = user_id);