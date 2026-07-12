/*
# VLOOP Essential Services Expansion - Phase 7
# Universal Daily Life Service Hub

Extend the essential_services table with new categories and add supporting infrastructure.
*/

-- ============================================================
-- DROP AND RECREATE CHECK CONSTRAINT FOR NEW CATEGORIES
-- ============================================================

ALTER TABLE essential_services DROP CONSTRAINT IF EXISTS essential_services_service_category_check;

ALTER TABLE essential_services ADD CONSTRAINT essential_services_service_category_check
  CHECK (service_category = ANY (ARRAY[
    'electricity', 'water', 'mobile', 'broadband', 'gas', 'insurance',
    'fastag', 'transport', 'government', 'healthcare', 'dth', 'railway',
    'education', 'municipality', 'entertainment'
  ]));

-- ============================================================
-- ADD NEW ACTIVE SERVICES
-- ============================================================

INSERT INTO essential_services (service_code, service_name, service_category, country_code, smartpoints_reward, is_active, display_order) VALUES
('dth', 'DTH Recharge', 'dth', 'IN', 5, true, 9),
('metro-card', 'Metro Card Recharge', 'transport', 'IN', 3, true, 12),
('bus-pass', 'Bus Pass Renewal', 'transport', 'IN', 3, true, 13)
ON CONFLICT (service_code) DO NOTHING;

-- ============================================================
-- ADD FUTURE SERVICES (DISABLED)
-- ============================================================

INSERT INTO essential_services (service_code, service_name, service_category, country_code, smartpoints_reward, is_active, display_order) VALUES
('railway', 'Railway Services', 'railway', 'IN', 10, false, 20),
('govt-fees', 'Government Fees', 'government', 'IN', 5, false, 21),
('property-tax', 'Property Tax', 'government', 'IN', 5, false, 22),
('passport', 'Passport Services', 'government', 'IN', 10, false, 23),
('visa', 'Visa Services', 'government', 'IN', 10, false, 24),
('healthcare-pay', 'Healthcare Payments', 'healthcare', 'IN', 5, false, 25),
('school-fees', 'School Fees', 'education', 'IN', 5, false, 26),
('college-fees', 'College Fees', 'education', 'IN', 5, false, 27),
('municipality', 'Municipal Services', 'municipality', 'IN', 5, false, 28)
ON CONFLICT (service_code) DO NOTHING;

-- ============================================================
-- ESSENTIAL SERVICE PROVIDERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS essential_service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_code text NOT NULL,
  provider_code text NOT NULL,
  provider_name text NOT NULL,
  provider_logo_url text,
  provider_type text NOT NULL DEFAULT 'operator',
  country_code text NOT NULL DEFAULT 'IN',
  regions text[] NOT NULL DEFAULT '{}',
  api_endpoint text,
  api_credentials jsonb,
  commission_percentage numeric(5,2) DEFAULT 0,
  smartpoints_reward_override integer,
  min_amount integer DEFAULT 1,
  max_amount integer DEFAULT 100000,
  processing_time_seconds integer DEFAULT 30,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(service_code, provider_code, country_code)
);

CREATE INDEX IF NOT EXISTS idx_service_providers_service ON essential_service_providers(service_code);
CREATE INDEX IF NOT EXISTS idx_service_providers_country ON essential_service_providers(country_code);
CREATE INDEX IF NOT EXISTS idx_service_providers_active ON essential_service_providers(is_active);

ALTER TABLE essential_service_providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_service_providers" ON essential_service_providers;
CREATE POLICY "select_service_providers" ON essential_service_providers FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- ESSENTIAL SERVICE REGIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS essential_service_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_code text NOT NULL,
  country_code text NOT NULL,
  region_name text NOT NULL,
  currency_code text NOT NULL DEFAULT 'INR',
  currency_symbol text NOT NULL DEFAULT '₹',
  convenience_fee numeric(8,2) DEFAULT 0,
  convenience_fee_type text DEFAULT 'fixed',
  tax_percentage numeric(5,2) DEFAULT 0,
  smartpoints_base integer DEFAULT 5,
  smartpoints_per_hundred integer DEFAULT 1,
  min_transaction_amount integer DEFAULT 1,
  max_transaction_amount integer DEFAULT 100000,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(service_code, country_code)
);

CREATE INDEX IF NOT EXISTS idx_service_regions_service ON essential_service_regions(service_code);
CREATE INDEX IF NOT EXISTS idx_service_regions_country ON essential_service_regions(country_code);

ALTER TABLE essential_service_regions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_service_regions" ON essential_service_regions;
CREATE POLICY "select_service_regions" ON essential_service_regions FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- SERVICE PAYMENT HISTORY TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS service_payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  service_code text NOT NULL,
  provider_code text,
  transaction_reference text NOT NULL UNIQUE,
  consumer_reference text NOT NULL,
  consumer_name text,
  consumer_phone text,
  amount numeric(12,2) NOT NULL,
  convenience_fee numeric(8,2) DEFAULT 0,
  total_amount numeric(12,2) NOT NULL,
  payment_method text DEFAULT 'wallet',
  status text NOT NULL DEFAULT 'pending',
  operator_reference text,
  acknowledgement_number text,
  receipt_url text,
  smartpoints_earned integer DEFAULT 0,
  smartpoints_credited boolean DEFAULT false,
  care_contribution_amount numeric(12,2) DEFAULT 0,
  care_smartpoints_earned integer DEFAULT 0,
  vcos_lock_status text DEFAULT 'pending',
  vcos_lock_start_date timestamptz,
  vcos_lock_end_date timestamptz,
  wallet1_credit_date timestamptz,
  country_code text DEFAULT 'IN',
  ip_address text,
  device_info jsonb,
  failure_reason text,
  retry_count integer DEFAULT 0,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_history_user ON service_payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_service ON service_payment_history(service_code);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON service_payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_date ON service_payment_history(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_history_reference ON service_payment_history(transaction_reference);

ALTER TABLE service_payment_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_payments" ON service_payment_history;
CREATE POLICY "select_own_payments" ON service_payment_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_payments" ON service_payment_history;
CREATE POLICY "insert_own_payments" ON service_payment_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_payments" ON service_payment_history;
CREATE POLICY "update_own_payments" ON service_payment_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- USER SERVICE FAVORITES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS user_service_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  service_code text NOT NULL,
  is_favorite boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_code)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON user_service_favorites(user_id);

ALTER TABLE user_service_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_favorites" ON user_service_favorites;
CREATE POLICY "select_own_favorites" ON user_service_favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_favorites" ON user_service_favorites;
CREATE POLICY "insert_own_favorites" ON user_service_favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_favorites" ON user_service_favorites;
CREATE POLICY "update_own_favorites" ON user_service_favorites FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_favorites" ON user_service_favorites;
CREATE POLICY "delete_own_favorites" ON user_service_favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- SERVICE REMINDERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS service_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  service_code text NOT NULL,
  consumer_reference text NOT NULL,
  reminder_name text,
  reminder_type text NOT NULL DEFAULT 'monthly',
  reminder_day integer DEFAULT 1,
  reminder_time text DEFAULT '09:00',
  last_reminder_sent timestamptz,
  next_reminder_date timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  notification_channels text[] DEFAULT ARRAY['push', 'email'],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user ON service_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_next_date ON service_reminders(next_reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON service_reminders(is_active);

ALTER TABLE service_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reminders" ON service_reminders;
CREATE POLICY "select_own_reminders" ON service_reminders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reminders" ON service_reminders;
CREATE POLICY "insert_own_reminders" ON service_reminders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reminders" ON service_reminders;
CREATE POLICY "update_own_reminders" ON service_reminders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reminders" ON service_reminders;
CREATE POLICY "delete_own_reminders" ON service_reminders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- CARE CONTRIBUTION IN PAYMENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS care_contribution_in_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES service_payment_history(id) ON DELETE SET NULL,
  contribution_amount numeric(12,2) NOT NULL,
  smartpoints_earned integer NOT NULL DEFAULT 0,
  smartpoints_credited boolean DEFAULT false,
  contribution_type text DEFAULT 'general',
  is_anonymous boolean DEFAULT false,
  status text DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_care_contributions_user ON care_contribution_in_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_care_contributions_payment ON care_contribution_in_payments(payment_id);

ALTER TABLE care_contribution_in_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_care_contrib" ON care_contribution_in_payments;
CREATE POLICY "select_own_care_contrib" ON care_contribution_in_payments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_care_contrib" ON care_contribution_in_payments;
CREATE POLICY "insert_own_care_contrib" ON care_contribution_in_payments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- INSERT SERVICE REGIONS
-- ============================================================

INSERT INTO essential_service_regions (service_code, country_code, region_name, smartpoints_base, smartpoints_per_hundred, is_enabled) VALUES
('electricity', 'IN', 'India', 5, 1, true),
('water', 'IN', 'India', 5, 1, true),
('mobile-prepaid', 'IN', 'India', 3, 1, true),
('broadband', 'IN', 'India', 5, 1, true),
('lpg-gas', 'IN', 'India', 5, 1, true),
('insurance', 'IN', 'India', 10, 2, true),
('fastag', 'IN', 'India', 3, 1, true),
('dth', 'IN', 'India', 5, 1, true),
('metro-card', 'IN', 'India', 3, 1, true),
('bus-pass', 'IN', 'India', 3, 1, true)
ON CONFLICT (service_code, country_code) DO NOTHING;

-- ============================================================
-- INSERT DEFAULT PROVIDERS
-- ============================================================

INSERT INTO essential_service_providers (service_code, provider_code, provider_name, provider_type, country_code, regions, is_active, display_order) VALUES
('electricity', 'mseb', 'MSEB', 'operator', 'IN', ARRAY['Maharashtra'], true, 1),
('electricity', 'bescom', 'BESCOM', 'operator', 'IN', ARRAY['Karnataka'], true, 2),
('electricity', 'tata-power', 'Tata Power', 'operator', 'IN', ARRAY['Maharashtra', 'Delhi'], true, 3),
('mobile-prepaid', 'jio', 'Jio', 'operator', 'IN', ARRAY['ALL'], true, 1),
('mobile-prepaid', 'airtel', 'Airtel', 'operator', 'IN', ARRAY['ALL'], true, 2),
('mobile-prepaid', 'vi', 'Vodafone Idea', 'operator', 'IN', ARRAY['ALL'], true, 3),
('broadband', 'jio-fiber', 'JioFiber', 'operator', 'IN', ARRAY['ALL'], true, 1),
('broadband', 'airtel-xstream', 'Airtel Xstream', 'operator', 'IN', ARRAY['ALL'], true, 2),
('lpg-gas', 'indane', 'Indane', 'operator', 'IN', ARRAY['ALL'], true, 1),
('lpg-gas', 'bharat-gas', 'Bharat Gas', 'operator', 'IN', ARRAY['ALL'], true, 2),
('lpg-gas', 'hp-gas', 'HP Gas', 'operator', 'IN', ARRAY['ALL'], true, 3)
ON CONFLICT (service_code, provider_code, country_code) DO NOTHING;

-- ============================================================
-- UPDATE TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_service_payment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_service_payment ON service_payment_history;
CREATE TRIGGER trigger_update_service_payment
  BEFORE UPDATE ON service_payment_history
  FOR EACH ROW
  EXECUTE FUNCTION update_service_payment_timestamp();

DROP TRIGGER IF EXISTS trigger_update_service_reminder ON service_reminders;
CREATE TRIGGER trigger_update_service_reminder
  BEFORE UPDATE ON service_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_service_payment_timestamp();
