-- ============================================================================
-- VLOOP CORE BUSINESS ENGINE — Database Enforcement Layer
-- Phase 27.5 — Permanent Business Rules
-- ============================================================================

-- ============================================================================
-- ENGINE VERSION TABLE (immutable record)
-- ============================================================================

CREATE TABLE IF NOT EXISTS core_engine_version (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version      text NOT NULL,
  locked_at    timestamptz NOT NULL DEFAULT now(),
  rules        jsonb NOT NULL,
  applied_by   text DEFAULT 'migration'
);

INSERT INTO core_engine_version (version, rules) VALUES (
  '27.5.0',
  '{
    "purchase": {
      "minimum_amount_inr": 40,
      "point_rate_inr": 40,
      "wallet2_percentage": 2
    },
    "care_club": {
      "minimum_contribution_inr": 10,
      "base_amount_inr": 10,
      "points_per_base": 5,
      "wallet2_percentage": 5
    },
    "wallet2": { "lock_period_days": 30 },
    "wallet1": { "credit_on_winning_only": true },
    "smartcode": {
      "code_min": 0,
      "code_max": 999,
      "code_length": 3,
      "allow_duplicate_codes": true
    }
  }'::jsonb
);

-- ============================================================================
-- CORE CALCULATION FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION engine_calc_purchase_points(p_amount numeric)
RETURNS integer AS $$
BEGIN
  IF p_amount < 40 THEN RETURN 0; END IF;
  RETURN FLOOR(p_amount / 40)::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION engine_calc_wallet2_from_purchase(p_amount numeric)
RETURNS numeric AS $$
BEGIN
  IF p_amount <= 0 THEN RETURN 0; END IF;
  RETURN FLOOR(p_amount * 2 / 100);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION engine_calc_care_club_points(p_amount numeric)
RETURNS integer AS $$
BEGIN
  IF p_amount < 10 THEN RETURN 0; END IF;
  RETURN (FLOOR(p_amount / 10) * 5)::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION engine_calc_wallet2_from_care_club(p_amount numeric)
RETURNS numeric AS $$
BEGIN
  IF p_amount <= 0 THEN RETURN 0; END IF;
  RETURN FLOOR(p_amount * 5 / 100);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION engine_calc_total_points(
  p_purchase_amount  numeric,
  p_care_club_amount numeric DEFAULT 0
)
RETURNS integer AS $$
BEGIN
  RETURN engine_calc_purchase_points(p_purchase_amount)
       + engine_calc_care_club_points(p_care_club_amount);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION engine_calc_wallet2_total(
  p_purchase_amount  numeric,
  p_care_club_amount numeric DEFAULT 0
)
RETURNS numeric AS $$
BEGIN
  RETURN engine_calc_wallet2_from_purchase(p_purchase_amount)
       + engine_calc_wallet2_from_care_club(p_care_club_amount);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION engine_is_valid_smartcode(p_code text)
RETURNS boolean AS $$
BEGIN
  RETURN p_code ~ '^[0-9]{3}$'
    AND p_code::integer BETWEEN 0 AND 999;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION engine_wallet2_activation_date()
RETURNS timestamptz AS $$
BEGIN
  RETURN now() + INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- INTEGRITY CONSTRAINTS
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'check_valid_smartcode'
      AND conrelid = 'smartcode_allocations'::regclass
  ) THEN
    ALTER TABLE smartcode_allocations
      ADD CONSTRAINT check_valid_smartcode
      CHECK (engine_is_valid_smartcode(smartcode));
  END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'check_positive_points'
      AND conrelid = 'smartcode_allocations'::regclass
  ) THEN
    ALTER TABLE smartcode_allocations
      ADD CONSTRAINT check_positive_points
      CHECK (points_allocated > 0);
  END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'check_non_negative_points'
      AND conrelid = 'profiles'::regclass
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT check_non_negative_points
      CHECK (points >= 0);
  END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'check_non_negative_wallet1'
      AND conrelid = 'profiles'::regclass
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT check_non_negative_wallet1
      CHECK (wallet1_balance >= 0);
  END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'check_non_negative_wallet2'
      AND conrelid = 'profiles'::regclass
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT check_non_negative_wallet2
      CHECK (wallet2_balance >= 0);
  END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- ============================================================================
-- DUPLICATE POINT PREVENTION — idempotency log
-- ============================================================================

CREATE TABLE IF NOT EXISTS point_generation_log (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES profiles(id),
  source_type      text NOT NULL CHECK (source_type IN ('purchase','care_club','referral','bonus','winning')),
  source_ref       text,
  points_awarded   integer NOT NULL CHECK (points_awarded >= 0),
  purchase_amount  numeric,
  care_club_amount numeric,
  wallet2_credit   numeric NOT NULL DEFAULT 0,
  week_period      text NOT NULL,
  idempotency_key  text NOT NULL,
  created_at       timestamptz DEFAULT now(),
  UNIQUE(idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_point_gen_user        ON point_generation_log(user_id);
CREATE INDEX IF NOT EXISTS idx_point_gen_source      ON point_generation_log(source_type, source_ref);
CREATE INDEX IF NOT EXISTS idx_point_gen_week        ON point_generation_log(week_period);
CREATE INDEX IF NOT EXISTS idx_point_gen_idempotency ON point_generation_log(idempotency_key);

ALTER TABLE point_generation_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_read_own_points" ON point_generation_log
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_point_log" ON point_generation_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================================
-- IDEMPOTENT POINT AWARD FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION engine_award_points(
  p_user_id          uuid,
  p_source_type      text,
  p_purchase_amount  numeric,
  p_care_club_amount numeric DEFAULT 0,
  p_idempotency_key  text DEFAULT NULL,
  p_source_ref       text DEFAULT NULL
)
RETURNS TABLE (
  points_awarded  integer,
  wallet2_credit  numeric,
  already_existed boolean
) AS $$
DECLARE
  v_key    text;
  v_points integer;
  v_w2     numeric;
  v_week   text;
BEGIN
  v_key := COALESCE(p_idempotency_key,
    p_user_id::text || ':' || p_source_type || ':' ||
    COALESCE(p_source_ref, md5(p_purchase_amount::text || p_care_club_amount::text || now()::text)));
  v_week   := to_char(CURRENT_DATE, 'IYYY-IW');
  v_points := engine_calc_total_points(p_purchase_amount, p_care_club_amount);
  v_w2     := engine_calc_wallet2_total(p_purchase_amount, p_care_club_amount);

  IF EXISTS (SELECT 1 FROM point_generation_log WHERE idempotency_key = v_key) THEN
    RETURN QUERY SELECT v_points, v_w2, true;
    RETURN;
  END IF;

  IF v_points < 0 THEN
    RAISE EXCEPTION 'Invalid points calculation: %', v_points;
  END IF;

  INSERT INTO point_generation_log (
    user_id, source_type, source_ref, points_awarded,
    purchase_amount, care_club_amount, wallet2_credit, week_period, idempotency_key
  ) VALUES (
    p_user_id, p_source_type, p_source_ref, v_points,
    p_purchase_amount, p_care_club_amount, v_w2, v_week, v_key
  );

  UPDATE profiles
  SET points = points + v_points,
      wallet2_balance = wallet2_balance + v_w2
  WHERE id = p_user_id;

  RETURN QUERY SELECT v_points, v_w2, false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- WALLET 2 LOCK ENFORCEMENT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION enforce_wallet2_lock()
RETURNS trigger AS $$
BEGIN
  IF NEW.wallet2_balance < OLD.wallet2_balance THEN
    IF OLD.wallet2_activation_date IS NOT NULL
       AND OLD.wallet2_activation_date > now() THEN
      RAISE EXCEPTION 'Wallet 2 is locked until %', OLD.wallet2_activation_date;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enforce_wallet2_lock'
  ) THEN
    CREATE TRIGGER trg_enforce_wallet2_lock
      BEFORE UPDATE ON profiles
      FOR EACH ROW EXECUTE FUNCTION enforce_wallet2_lock();
  END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- ============================================================================
-- PERFORMANCE INDEXES FOR HIGH-VOLUME TRANSACTIONS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_points      ON profiles(points);
CREATE INDEX IF NOT EXISTS idx_smartcode_alloc_week ON smartcode_allocations(week_period, is_active);
CREATE INDEX IF NOT EXISTS idx_smartcode_alloc_user ON smartcode_allocations(user_id, week_period);
CREATE INDEX IF NOT EXISTS idx_smartcode_alloc_code ON smartcode_allocations(smartcode, week_period);

DO $$
BEGIN
  CREATE INDEX idx_smartcode_active
    ON smartcode_allocations(user_id, week_period)
    WHERE is_active = true;
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- ============================================================================
-- ENGINE HEALTH CHECK FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION engine_health_check()
RETURNS TABLE (check_name text, result text, passed boolean) AS $$
BEGIN
  RETURN QUERY SELECT 'purchase_40'::text,   engine_calc_purchase_points(40)::text,   engine_calc_purchase_points(40)   = 1;
  RETURN QUERY SELECT 'purchase_2000'::text, engine_calc_purchase_points(2000)::text, engine_calc_purchase_points(2000) = 50;
  RETURN QUERY SELECT 'care_club_10'::text,  engine_calc_care_club_points(10)::text,  engine_calc_care_club_points(10)  = 5;
  RETURN QUERY SELECT 'care_club_100'::text, engine_calc_care_club_points(100)::text, engine_calc_care_club_points(100) = 50;
  RETURN QUERY SELECT 'wallet2_purch'::text, engine_calc_wallet2_from_purchase(100)::text, engine_calc_wallet2_from_purchase(100) = 2;
  RETURN QUERY SELECT 'wallet2_cc'::text,    engine_calc_wallet2_from_care_club(100)::text, engine_calc_wallet2_from_care_club(100) = 5;
  RETURN QUERY SELECT 'sc_valid'::text,      engine_is_valid_smartcode('466')::text,  engine_is_valid_smartcode('466');
  RETURN QUERY SELECT 'sc_invalid'::text,    engine_is_valid_smartcode('abc')::text,  engine_is_valid_smartcode('abc') = false;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE r RECORD; all_pass boolean := true;
BEGIN
  FOR r IN SELECT * FROM engine_health_check() LOOP
    IF NOT r.passed THEN
      all_pass := false;
      RAISE WARNING 'FAILED: % → %', r.check_name, r.result;
    END IF;
  END LOOP;
  IF all_pass THEN RAISE NOTICE 'Core Business Engine: ALL HEALTH CHECKS PASSED'; END IF;
END $$;
