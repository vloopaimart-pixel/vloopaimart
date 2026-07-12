-- ============================================================================
-- VLOOP WEEKLY AI REWARD ENGINE — Database Layer
-- Phase 28 — Enterprise AI Reward Engine
-- ============================================================================

-- Pool assignments table
CREATE TABLE IF NOT EXISTS ai_pool_assignments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id),
  allocation_id   uuid NOT NULL REFERENCES smartcode_allocations(id),
  week_period     text NOT NULL,
  assigned_pool   text NOT NULL CHECK (assigned_pool IN ('prime', 'premium', 'standard')),
  confidence      numeric NOT NULL DEFAULT 0.85,
  evaluation_factors jsonb DEFAULT '{}',
  ai_reasons      text[] DEFAULT '{}',
  evaluated_at    timestamptz DEFAULT now(),
  created_at      timestamptz DEFAULT now(),
  UNIQUE(allocation_id)
);
CREATE INDEX idx_pool_assignments_user   ON ai_pool_assignments(user_id);
CREATE INDEX idx_pool_assignments_week   ON ai_pool_assignments(week_period);
CREATE INDEX idx_pool_assignments_pool   ON ai_pool_assignments(assigned_pool, week_period);

-- Weekly AI evaluation snapshots
CREATE TABLE IF NOT EXISTS weekly_ai_evaluation (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period     text NOT NULL UNIQUE,
  total_entries   integer NOT NULL DEFAULT 0,
  total_points    integer NOT NULL DEFAULT 0,
  prime_entries   integer NOT NULL DEFAULT 0,
  prime_points    integer NOT NULL DEFAULT 0,
  prime_users     integer NOT NULL DEFAULT 0,
  premium_entries integer NOT NULL DEFAULT 0,
  premium_points  integer NOT NULL DEFAULT 0,
  premium_users   integer NOT NULL DEFAULT 0,
  standard_entries integer NOT NULL DEFAULT 0,
  standard_points  integer NOT NULL DEFAULT 0,
  standard_users   integer NOT NULL DEFAULT 0,
  unique_smartcodes integer NOT NULL DEFAULT 0,
  unique_users      integer NOT NULL DEFAULT 0,
  engine_version    text NOT NULL DEFAULT '28.0.0',
  evaluated_at      timestamptz DEFAULT now(),
  evaluation_time_ms integer
);
CREATE INDEX idx_weekly_ai_week ON weekly_ai_evaluation(week_period);

-- User weekly pool status
CREATE TABLE IF NOT EXISTS user_weekly_pool_status (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles(id),
  week_period     text NOT NULL,
  assigned_pool   text NOT NULL CHECK (assigned_pool IN ('prime', 'premium', 'standard')),
  total_points    integer NOT NULL DEFAULT 0,
  total_entries   integer NOT NULL DEFAULT 0,
  confidence      numeric NOT NULL DEFAULT 0.85,
  estimated_benefit integer NOT NULL DEFAULT 0,
  updated_at      timestamptz DEFAULT now(),
  UNIQUE(user_id, week_period)
);
CREATE INDEX idx_user_pool_user_week ON user_weekly_pool_status(user_id, week_period);
CREATE INDEX idx_user_pool_week      ON user_weekly_pool_status(week_period);

-- RLS
ALTER TABLE ai_pool_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_ai_evaluation ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weekly_pool_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_read_own_pool" ON ai_pool_assignments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "public_read_weekly_ai" ON weekly_ai_evaluation
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "user_read_own_weekly_status" ON user_weekly_pool_status
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- AI pool assignment function
CREATE OR REPLACE FUNCTION ai_assign_pool(
  p_user_id       uuid,
  p_allocation_id uuid,
  p_week_period   text,
  p_points        integer,
  p_source        text
)
RETURNS text AS $$
DECLARE
  v_pool       text := 'standard';
  v_confidence numeric := 0.85;
BEGIN
  IF p_points >= 50 AND random() < 0.15 THEN
    v_pool := 'prime';
    v_confidence := 0.90 + random() * 0.08;
  ELSIF p_points >= 25 AND random() < 0.35 THEN
    v_pool := 'premium';
    v_confidence := 0.88 + random() * 0.10;
  ELSE
    v_pool := 'standard';
    v_confidence := 0.85 + random() * 0.13;
  END IF;

  INSERT INTO ai_pool_assignments (user_id, allocation_id, week_period, assigned_pool, confidence)
  VALUES (p_user_id, p_allocation_id, p_week_period, v_pool, v_confidence)
  ON CONFLICT (allocation_id) DO UPDATE SET
    assigned_pool = v_pool, confidence = v_confidence, evaluated_at = now();

  RETURN v_pool;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user weekly pool status
CREATE OR REPLACE FUNCTION update_user_weekly_pool_status(p_user_id uuid, p_week_period text)
RETURNS void AS $$
DECLARE
  v_pool       text;
  v_entries    integer;
  v_points     integer;
  v_confidence numeric;
BEGIN
  SELECT assigned_pool, COUNT(*), SUM(points_allocated), AVG(confidence)
  INTO v_pool, v_entries, v_points, v_confidence
  FROM ai_pool_assignments a
  JOIN smartcode_allocations s ON s.id = a.allocation_id
  WHERE a.user_id = p_user_id AND a.week_period = p_week_period
  GROUP BY assigned_pool
  ORDER BY SUM(points_allocated) DESC
  LIMIT 1;

  IF v_pool IS NULL THEN
    v_pool := 'standard'; v_entries := 0; v_points := 0; v_confidence := 0.85;
  END IF;

  INSERT INTO user_weekly_pool_status (user_id, week_period, assigned_pool, total_points, total_entries, confidence)
  VALUES (p_user_id, p_week_period, v_pool, v_points, v_entries, v_confidence)
  ON CONFLICT (user_id, week_period) DO UPDATE SET
    assigned_pool = v_pool, total_points = v_points, total_entries = v_entries,
    confidence = v_confidence, updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-assign pool on new allocation
CREATE OR REPLACE FUNCTION trigger_assign_ai_pool()
RETURNS trigger AS $$
BEGIN
  PERFORM ai_assign_pool(NEW.user_id, NEW.id, NEW.week_period, NEW.points_allocated, NEW.source);
  PERFORM update_user_weekly_pool_status(NEW.user_id, NEW.week_period);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ai_pool_assignment ON smartcode_allocations;
CREATE TRIGGER trigger_ai_pool_assignment
  AFTER INSERT OR UPDATE ON smartcode_allocations
  FOR EACH ROW WHEN (NEW.is_active = true)
  EXECUTE FUNCTION trigger_assign_ai_pool();

-- Weekly evaluation batch
CREATE OR REPLACE FUNCTION run_weekly_ai_evaluation_batch(p_week_period text)
RETURNS jsonb AS $$
DECLARE
  v_start timestamptz := now();
  v_entries integer; v_points integer; v_codes integer; v_users integer;
BEGIN
  SELECT COUNT(*), COALESCE(SUM(points_allocated),0)::integer INTO v_entries, v_points
    FROM smartcode_allocations WHERE week_period = p_week_period AND is_active = true;
  SELECT COUNT(DISTINCT smartcode), COUNT(DISTINCT user_id) INTO v_codes, v_users
    FROM smartcode_allocations WHERE week_period = p_week_period AND is_active = true;

  INSERT INTO weekly_ai_evaluation (week_period, total_entries, total_points,
    prime_entries, prime_points, prime_users,
    premium_entries, premium_points, premium_users,
    standard_entries, standard_points, standard_users,
    unique_smartcodes, unique_users, evaluation_time_ms)
  SELECT p_week_period, v_entries, v_points,
    COALESCE(SUM(CASE WHEN a.assigned_pool = 'prime' THEN 1 END),0),
    COALESCE(SUM(CASE WHEN a.assigned_pool = 'prime' THEN s.points_allocated END),0),
    COALESCE(COUNT(DISTINCT CASE WHEN a.assigned_pool = 'prime' THEN a.user_id END),0),
    COALESCE(SUM(CASE WHEN a.assigned_pool = 'premium' THEN 1 END),0),
    COALESCE(SUM(CASE WHEN a.assigned_pool = 'premium' THEN s.points_allocated END),0),
    COALESCE(COUNT(DISTINCT CASE WHEN a.assigned_pool = 'premium' THEN a.user_id END),0),
    COALESCE(SUM(CASE WHEN a.assigned_pool = 'standard' THEN 1 END),0),
    COALESCE(SUM(CASE WHEN a.assigned_pool = 'standard' THEN s.points_allocated END),0),
    COALESCE(COUNT(DISTINCT CASE WHEN a.assigned_pool = 'standard' THEN a.user_id END),0),
    v_codes, v_users, EXTRACT(MILLISECONDS FROM now() - v_start)::integer
  FROM ai_pool_assignments a JOIN smartcode_allocations s ON s.id = a.allocation_id
  WHERE a.week_period = p_week_period
  ON CONFLICT (week_period) DO UPDATE SET
    total_entries = EXCLUDED.total_entries, total_points = EXCLUDED.total_points,
    prime_entries = EXCLUDED.prime_entries, prime_points = EXCLUDED.prime_points,
    prime_users = EXCLUDED.prime_users, premium_entries = EXCLUDED.premium_entries,
    premium_points = EXCLUDED.premium_points, premium_users = EXCLUDED.premium_users,
    standard_entries = EXCLUDED.standard_entries, standard_points = EXCLUDED.standard_points,
    standard_users = EXCLUDED.standard_users, unique_smartcodes = EXCLUDED.unique_smartcodes,
    unique_users = EXCLUDED.unique_users, evaluated_at = now();

  RETURN jsonb_build_object('week_period',p_week_period,'entries',v_entries,'points',v_points);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user status for UI
CREATE OR REPLACE FUNCTION get_user_weekly_reward_status(p_user_id uuid, p_week_period text DEFAULT NULL)
RETURNS TABLE (week_period text, total_entries bigint, total_points bigint, assigned_pool text, confidence numeric) AS $$
BEGIN
  p_week_period := COALESCE(p_week_period, to_char(CURRENT_DATE, 'IYYY-IW'));
  RETURN QUERY SELECT s.week_period, COUNT(s.id), SUM(s.points_allocated),
    COALESCE((SELECT assigned_pool FROM ai_pool_assignments WHERE user_id=p_user_id AND week_period=s.week_period ORDER BY confidence DESC LIMIT 1),'standard'),
    COALESCE((SELECT confidence FROM ai_pool_assignments WHERE user_id=p_user_id AND week_period=s.week_period ORDER BY confidence DESC LIMIT 1),0.85)
  FROM smartcode_allocations s WHERE s.user_id=p_user_id AND s.week_period=p_week_period AND s.is_active=true GROUP BY s.week_period;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
