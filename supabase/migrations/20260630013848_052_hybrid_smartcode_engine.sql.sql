-- VLOOP Hybrid SmartCode Engine
-- Upgrades the SmartCode system to support AI + Manual modes

-- ============================================================================
-- SMARTCODE ALLOCATIONS (Multiple codes per user with point distribution)
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartcode_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  smartcode text NOT NULL CHECK (length(smartcode) = 3),
  points_allocated integer NOT NULL DEFAULT 1,
  source text NOT NULL CHECK (source IN ('purchase', 'care_club', 'bonus')),
  week_period text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('ai_auto', 'manual')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_smartcode_allocations_user ON smartcode_allocations(user_id);
CREATE INDEX idx_smartcode_allocations_week ON smartcode_allocations(week_period);
CREATE INDEX idx_smartcode_allocations_code ON smartcode_allocations(smartcode);
CREATE INDEX idx_smartcode_allocations_active ON smartcode_allocations(is_active);

-- Unique constraint: one allocation per code per user per week per source
CREATE UNIQUE INDEX idx_smartcode_allocations_unique 
  ON smartcode_allocations(user_id, smartcode, week_period, source);

-- ============================================================================
-- SMARTCODE DISTRIBUTION SESSIONS (Track point distribution operations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartcode_distribution_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  total_points integer NOT NULL,
  points_distributed integer NOT NULL DEFAULT 0,
  mode text NOT NULL CHECK (mode IN ('ai_auto', 'manual')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  week_period text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX idx_distribution_sessions_user ON smartcode_distribution_sessions(user_id);
CREATE INDEX idx_distribution_sessions_week ON smartcode_distribution_sessions(week_period);

-- ============================================================================
-- WEEKLY AI REWARD POOL (AI-determined reward assignments)
-- ============================================================================

CREATE TABLE IF NOT EXISTS weekly_ai_reward_pool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL,
  smartcode text NOT NULL,
  pool_type text NOT NULL CHECK (pool_type IN ('performance', 'activity', 'multi_level', 'standard')),
  total_points_in_pool integer DEFAULT 0,
  total_participants integer DEFAULT 0,
  reward_tier text CHECK (reward_tier IN ('standard', 'premium', 'prime')),
  ai_confidence_score numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX idx_weekly_ai_pool_unique ON weekly_ai_reward_pool(week_period, smartcode, pool_type);

-- ============================================================================
-- WEEKLY SMARTCODE PERFORMANCE TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartcode_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  smartcode text NOT NULL,
  week_period text NOT NULL,
  total_selections integer DEFAULT 0,
  total_points integer DEFAULT 0,
  unique_users integer DEFAULT 0,
  win_rate numeric DEFAULT 0,
  performance_score numeric DEFAULT 0,
  trending_direction text CHECK (trending_direction IN ('up', 'down', 'stable')),
  created_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX idx_smartcode_performance_unique ON smartcode_performance(smartcode, week_period);

-- ============================================================================
-- USER SMARTCODE SUMMARY (Aggregated user view)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_smartcode_summary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  week_period text NOT NULL,
  total_smartcodes integer DEFAULT 0,
  total_points_allocated integer DEFAULT 0,
  ai_auto_codes integer DEFAULT 0,
  manual_codes integer DEFAULT 0,
  has_completed_distribution boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX idx_user_smartcode_summary_unique ON user_smartcode_summary(user_id, week_period);

-- ============================================================================
-- AI DISTRIBUTION LOG (Track AI decisions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_distribution_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES smartcode_distribution_sessions(id),
  smartcode text NOT NULL,
  points_assigned integer NOT NULL,
  algorithm_version text DEFAULT 'v1',
  confidence_score numeric DEFAULT 0,
  reasoning jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_ai_distribution_session ON ai_distribution_log(session_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE smartcode_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartcode_distribution_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_ai_reward_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartcode_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_smartcode_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_distribution_log ENABLE ROW LEVEL SECURITY;

-- User owns their allocations
CREATE POLICY "user_allocations_all" ON smartcode_allocations FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_sessions_all" ON smartcode_distribution_sessions FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_summary_all" ON user_smartcode_summary FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Public read for performance stats
CREATE POLICY "read_performance" ON smartcode_performance FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_reward_pool" ON weekly_ai_reward_pool FOR SELECT TO authenticated USING (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to get or create user summary for current week
CREATE OR REPLACE FUNCTION get_or_create_user_summary(p_user_id uuid, p_week_period text)
RETURNS uuid AS $$
DECLARE
  v_summary_id uuid;
BEGIN
  INSERT INTO user_smartcode_summary (user_id, week_period)
  VALUES (p_user_id, p_week_period)
  ON CONFLICT (user_id, week_period) DO NOTHING
  RETURNING id INTO v_summary_id;
  
  IF v_summary_id IS NULL THEN
    SELECT id INTO v_summary_id FROM user_smartcode_summary 
    WHERE user_id = p_user_id AND week_period = p_week_period;
  END IF;
  
  RETURN v_summary_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update summary after allocation
CREATE OR REPLACE FUNCTION update_smartcode_summary()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM get_or_create_user_summary(NEW.user_id, NEW.week_period);
  
  UPDATE user_smartcode_summary SET
    total_smartcodes = (
      SELECT COUNT(DISTINCT smartcode) FROM smartcode_allocations 
      WHERE user_id = NEW.user_id AND week_period = NEW.week_period AND is_active = true
    ),
    total_points_allocated = (
      SELECT COALESCE(SUM(points_allocated), 0) FROM smartcode_allocations 
      WHERE user_id = NEW.user_id AND week_period = NEW.week_period AND is_active = true
    ),
    ai_auto_codes = (
      SELECT COUNT(DISTINCT smartcode) FROM smartcode_allocations 
      WHERE user_id = NEW.user_id AND week_period = NEW.week_period AND mode = 'ai_auto' AND is_active = true
    ),
    manual_codes = (
      SELECT COUNT(DISTINCT smartcode) FROM smartcode_allocations 
      WHERE user_id = NEW.user_id AND week_period = NEW.week_period AND mode = 'manual' AND is_active = true
    ),
    updated_at = now()
  WHERE user_id = NEW.user_id AND week_period = NEW.week_period;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update summary
DROP TRIGGER IF EXISTS trigger_update_smartcode_summary ON smartcode_allocations;
CREATE TRIGGER trigger_update_smartcode_summary
  AFTER INSERT OR UPDATE OR DELETE ON smartcode_allocations
  FOR EACH ROW EXECUTE FUNCTION update_smartcode_summary();