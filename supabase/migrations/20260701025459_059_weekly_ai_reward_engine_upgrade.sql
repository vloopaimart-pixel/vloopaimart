-- ============================================================================
-- VLOOP WEEKLY AI REWARD ENGINE — Phase 31 Upgrade
-- ============================================================================
--
-- This migration upgrades the existing AI evaluation tables (from migration 057)
-- to support the fully autonomous enterprise AI decision system.
--
-- Changes:
--   1. Add `multi_pool_users` column to `weekly_ai_evaluation` — tracks users
--      who qualify for multiple reward pools simultaneously (Prime + Premium + Standard)
--   2. Add `eligible_pools` column to `user_weekly_pool_status` — stores the array
--      of pools a user qualifies for (e.g., ['prime', 'premium', 'standard'])
--   3. Add `mode` column to `ai_pool_assignments` — tracks whether the assignment
--      came from ai_auto or manual distribution
--   4. Add `engine_version` column update to '31.0.0'
--   5. Add `ai_auto_entries` and `manual_entries` columns to `weekly_ai_evaluation`
--      for admin dashboard distribution tracking
--   6. Add `fraud_alerts` and `duplicate_detection` columns to `weekly_ai_evaluation`
--      for admin dashboard security tracking
--   7. Update the `run_weekly_ai_evaluation_batch` function to include multi_pool_users
--   8. Add RLS INSERT/UPDATE policies for ai_pool_assignments and user_weekly_pool_status
--      (currently only SELECT policies exist — the trigger functions use SECURITY DEFINER
--      so they bypass RLS, but direct inserts from the engine need policies)
--
-- Security:
--   - RLS already enabled on all three tables (migration 057)
--   - Existing SELECT policies preserved
--   - New INSERT/UPDATE policies added for authenticated users on own rows
--   - weekly_ai_evaluation remains public read (authenticated)
--
-- Notes:
--   - No data is lost — all changes are additive (new columns, new policies)
--   - The trigger function `trigger_assign_ai_pool` already calls `ai_assign_pool`
--     which inserts into `ai_pool_assignments` — this continues to work
--   - The `run_weekly_ai_evaluation_batch` function is updated to count multi_pool_users
-- ============================================================================

-- ============================================================================
-- 1. ADD multi_pool_users TO weekly_ai_evaluation
-- ============================================================================
ALTER TABLE weekly_ai_evaluation
  ADD COLUMN IF NOT EXISTS multi_pool_users integer NOT NULL DEFAULT 0;

-- ============================================================================
-- 2. ADD ai_auto_entries and manual_entries TO weekly_ai_evaluation
-- ============================================================================
ALTER TABLE weekly_ai_evaluation
  ADD COLUMN IF NOT EXISTS ai_auto_entries integer NOT NULL DEFAULT 0;

ALTER TABLE weekly_ai_evaluation
  ADD COLUMN IF NOT EXISTS manual_entries integer NOT NULL DEFAULT 0;

-- ============================================================================
-- 3. ADD fraud_alerts and duplicate_detection TO weekly_ai_evaluation
-- ============================================================================
ALTER TABLE weekly_ai_evaluation
  ADD COLUMN IF NOT EXISTS fraud_alerts jsonb DEFAULT '[]'::jsonb;

ALTER TABLE weekly_ai_evaluation
  ADD COLUMN IF NOT EXISTS duplicate_detection jsonb DEFAULT '[]'::jsonb;

-- ============================================================================
-- 4. ADD eligible_pools TO user_weekly_pool_status
-- ============================================================================
ALTER TABLE user_weekly_pool_status
  ADD COLUMN IF NOT EXISTS eligible_pools text[] DEFAULT '{}'::text[];

-- ============================================================================
-- 5. ADD mode TO ai_pool_assignments
-- ============================================================================
ALTER TABLE ai_pool_assignments
  ADD COLUMN IF NOT EXISTS mode text DEFAULT 'ai_auto'
  CHECK (mode IN ('ai_auto', 'manual'));

-- ============================================================================
-- 6. UPDATE engine_version default to 31.0.0
-- ============================================================================
ALTER TABLE weekly_ai_evaluation
  ALTER COLUMN engine_version SET DEFAULT '31.0.0';

-- ============================================================================
-- 7. UPDATE run_weekly_ai_evaluation_batch to include multi_pool_users
-- ============================================================================
CREATE OR REPLACE FUNCTION run_weekly_ai_evaluation_batch(p_week_period text)
RETURNS jsonb AS $$
DECLARE
  v_start timestamptz := now();
  v_entries integer; v_points integer; v_codes integer; v_users integer;
  v_multi_pool integer;
  v_ai_auto integer; v_manual integer;
BEGIN
  SELECT COUNT(*), COALESCE(SUM(points_allocated),0)::integer INTO v_entries, v_points
    FROM smartcode_allocations WHERE week_period = p_week_period AND is_active = true;
  SELECT COUNT(DISTINCT smartcode), COUNT(DISTINCT user_id) INTO v_codes, v_users
    FROM smartcode_allocations WHERE week_period = p_week_period AND is_active = true;

  -- Count AI auto vs manual entries
  SELECT
    COALESCE(SUM(CASE WHEN mode = 'ai_auto' THEN 1 END),0),
    COALESCE(SUM(CASE WHEN mode = 'manual' THEN 1 END),0)
  INTO v_ai_auto, v_manual
  FROM smartcode_allocations WHERE week_period = p_week_period AND is_active = true;

  -- Count multi-pool users (users with entries in more than one pool)
  WITH user_pools AS (
    SELECT a.user_id, COUNT(DISTINCT a.assigned_pool) AS pool_count
    FROM ai_pool_assignments a
    JOIN smartcode_allocations s ON s.id = a.allocation_id
    WHERE a.week_period = p_week_period AND s.is_active = true
    GROUP BY a.user_id
  )
  SELECT COALESCE(SUM(CASE WHEN pool_count > 1 THEN 1 END),0) INTO v_multi_pool
  FROM user_pools;

  INSERT INTO weekly_ai_evaluation (week_period, total_entries, total_points,
    prime_entries, prime_points, prime_users,
    premium_entries, premium_points, premium_users,
    standard_entries, standard_points, standard_users,
    unique_smartcodes, unique_users, multi_pool_users,
    ai_auto_entries, manual_entries,
    evaluation_time_ms, engine_version)
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
    v_codes, v_users, v_multi_pool,
    v_ai_auto, v_manual,
    EXTRACT(MILLISECONDS FROM now() - v_start)::integer, '31.0.0'
  FROM ai_pool_assignments a JOIN smartcode_allocations s ON s.id = a.allocation_id
  WHERE a.week_period = p_week_period
  ON CONFLICT (week_period) DO UPDATE SET
    total_entries = EXCLUDED.total_entries, total_points = EXCLUDED.total_points,
    prime_entries = EXCLUDED.prime_entries, prime_points = EXCLUDED.prime_points,
    prime_users = EXCLUDED.prime_users, premium_entries = EXCLUDED.premium_entries,
    premium_points = EXCLUDED.premium_points, premium_users = EXCLUDED.premium_users,
    standard_entries = EXCLUDED.standard_entries, standard_points = EXCLUDED.standard_points,
    standard_users = EXCLUDED.standard_users, unique_smartcodes = EXCLUDED.unique_smartcodes,
    unique_users = EXCLUDED.unique_users, multi_pool_users = EXCLUDED.multi_pool_users,
    ai_auto_entries = EXCLUDED.ai_auto_entries, manual_entries = EXCLUDED.manual_entries,
    engine_version = EXCLUDED.engine_version, evaluated_at = now();

  RETURN jsonb_build_object(
    'week_period', p_week_period,
    'entries', v_entries,
    'points', v_points,
    'multi_pool_users', v_multi_pool,
    'ai_auto_entries', v_ai_auto,
    'manual_entries', v_manual
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. UPDATE ai_assign_pool to accept mode parameter
-- ============================================================================
CREATE OR REPLACE FUNCTION ai_assign_pool(
  p_user_id       uuid,
  p_allocation_id uuid,
  p_week_period   text,
  p_points        integer,
  p_source        text,
  p_mode          text DEFAULT 'ai_auto'
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

  INSERT INTO ai_pool_assignments (user_id, allocation_id, week_period, assigned_pool, confidence, mode)
  VALUES (p_user_id, p_allocation_id, p_week_period, v_pool, v_confidence, p_mode)
  ON CONFLICT (allocation_id) DO UPDATE SET
    assigned_pool = v_pool, confidence = v_confidence, mode = p_mode, evaluated_at = now();

  RETURN v_pool;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. UPDATE trigger to pass mode
-- ============================================================================
CREATE OR REPLACE FUNCTION trigger_assign_ai_pool()
RETURNS trigger AS $$
BEGIN
  PERFORM ai_assign_pool(NEW.user_id, NEW.id, NEW.week_period, NEW.points_allocated, NEW.source, COALESCE(NEW.mode, 'ai_auto'));
  PERFORM update_user_weekly_pool_status(NEW.user_id, NEW.week_period);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 10. UPDATE update_user_weekly_pool_status to track eligible_pools
-- ============================================================================
CREATE OR REPLACE FUNCTION update_user_weekly_pool_status(p_user_id uuid, p_week_period text)
RETURNS void AS $$
DECLARE
  v_pool       text;
  v_entries    integer;
  v_points     integer;
  v_confidence numeric;
  v_eligible   text[];
BEGIN
  -- Get primary pool (highest points)
  SELECT assigned_pool, COUNT(*), SUM(points_allocated), AVG(confidence)
  INTO v_pool, v_entries, v_points, v_confidence
  FROM ai_pool_assignments a
  JOIN smartcode_allocations s ON s.id = a.allocation_id
  WHERE a.user_id = p_user_id AND a.week_period = p_week_period AND s.is_active = true
  GROUP BY assigned_pool
  ORDER BY SUM(points_allocated) DESC
  LIMIT 1;

  -- Get all eligible pools (distinct pools across all entries)
  SELECT array_agg(DISTINCT assigned_pool) INTO v_eligible
  FROM ai_pool_assignments a
  JOIN smartcode_allocations s ON s.id = a.allocation_id
  WHERE a.user_id = p_user_id AND a.week_period = p_week_period AND s.is_active = true;

  IF v_pool IS NULL THEN
    v_pool := 'standard'; v_entries := 0; v_points := 0; v_confidence := 0.85; v_eligible := '{}';
  END IF;

  INSERT INTO user_weekly_pool_status (user_id, week_period, assigned_pool, total_points, total_entries, confidence, eligible_pools)
  VALUES (p_user_id, p_week_period, v_pool, v_points, v_entries, v_confidence, v_eligible)
  ON CONFLICT (user_id, week_period) DO UPDATE SET
    assigned_pool = v_pool, total_points = v_points, total_entries = v_entries,
    confidence = v_confidence, eligible_pools = v_eligible, updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 11. ADD RLS INSERT/UPDATE policies for ai_pool_assignments
-- ============================================================================
DROP POLICY IF EXISTS "user_insert_own_pool" ON ai_pool_assignments;
CREATE POLICY "user_insert_own_pool" ON ai_pool_assignments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_update_own_pool" ON ai_pool_assignments;
CREATE POLICY "user_update_own_pool" ON ai_pool_assignments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 12. ADD RLS INSERT/UPDATE policies for user_weekly_pool_status
-- ============================================================================
DROP POLICY IF EXISTS "user_insert_own_weekly_status" ON user_weekly_pool_status;
CREATE POLICY "user_insert_own_weekly_status" ON user_weekly_pool_status
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_update_own_weekly_status" ON user_weekly_pool_status;
CREATE POLICY "user_update_own_weekly_status" ON user_weekly_pool_status
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 13. ADD index for eligible_pools queries
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_pool_eligible
  ON user_weekly_pool_status USING GIN (eligible_pools);

-- ============================================================================
-- 14. ADD index for ai_pool_assignments mode
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_pool_assignments_mode
  ON ai_pool_assignments(mode, week_period);
