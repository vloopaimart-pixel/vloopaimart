-- ============================================================
-- Migration 082: Wallet, Care Club & Essential Services Operating System
-- Phase 4 — Dual Wallet + Essential Services + Emergency Care
-- ============================================================

-- 1. DUAL WALLET SYSTEM

-- Wallet A: Smart Wallet (SmartPoints Balance, Rewards)
CREATE TABLE IF NOT EXISTS wallet_a_smart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Balances
  smartpoints_balance integer DEFAULT 0,
  activity_rewards_balance numeric DEFAULT 0,
  learning_rewards_balance numeric DEFAULT 0,
  quiz_rewards_balance numeric DEFAULT 0,
  volunteer_rewards_balance numeric DEFAULT 0,
  
  -- Totals
  total_earned integer DEFAULT 0,
  total_redeemed integer DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  locked_reason text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

ALTER TABLE wallet_a_smart ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wallet_a" ON wallet_a_smart;
CREATE POLICY "select_own_wallet_a" ON wallet_a_smart FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "update_own_wallet_a" ON wallet_a_smart;
CREATE POLICY "update_own_wallet_a" ON wallet_a_smart FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

-- Wallet A Transactions
CREATE TABLE IF NOT EXISTS wallet_a_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallet_a_smart(id) ON DELETE CASCADE,
  
  transaction_type text NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'transfer', 'redeem')),
  category text NOT NULL CHECK (category IN (
    'marketplace_purchase', 'essential_service', 'educational', 'quiz', 
    'volunteer', 'care_club', 'community_campaign', 'system', 'redeem'
  )),
  
  amount integer NOT NULL,
  balance_after integer NOT NULL,
  
  source_type text,
  source_id uuid,
  description text,
  
  -- AI Verification
  is_verified boolean DEFAULT true,
  ai_checksum text,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wallet_a_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_transactions_a" ON wallet_a_transactions;
CREATE POLICY "select_own_transactions_a" ON wallet_a_transactions FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM wallet_a_smart WHERE wallet_a_smart.id = wallet_a_transactions.wallet_id AND wallet_a_smart.user_id = auth.uid()
  ));

-- Wallet B: Future Opportunity Wallet
CREATE TABLE IF NOT EXISTS wallet_b_foe (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- FOE Units
  foe_units_balance numeric DEFAULT 0,
  total_foe_units_earned numeric DEFAULT 0,
  
  -- Project Participation
  active_projects integer DEFAULT 0,
  completed_projects integer DEFAULT 0,
  
  -- Benefits
  total_benefits_earned numeric DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

ALTER TABLE wallet_b_foe ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wallet_b" ON wallet_b_foe;
CREATE POLICY "select_own_wallet_b" ON wallet_b_foe FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- Wallet B Transactions
CREATE TABLE IF NOT EXISTS wallet_b_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallet_b_foe(id) ON DELETE CASCADE,
  
  transaction_type text NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'project_allocation', 'benefit_release')),
  project_code text,
  
  amount numeric NOT NULL,
  balance_after numeric NOT NULL,
  
  description text,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wallet_b_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_transactions_b" ON wallet_b_transactions;
CREATE POLICY "select_own_transactions_b" ON wallet_b_transactions FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM wallet_b_foe WHERE wallet_b_foe.id = wallet_b_transactions.wallet_id AND wallet_b_foe.user_id = auth.uid()
  ));

-- 2. ESSENTIAL SERVICES HUB
CREATE TABLE IF NOT EXISTS essential_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_code text NOT NULL UNIQUE,
  service_name text NOT NULL,
  service_category text NOT NULL CHECK (service_category IN (
    'electricity', 'water', 'mobile', 'broadband', 'gas', 
    'insurance', 'fastag', 'transport', 'government', 'healthcare'
  )),
  
  -- Provider
  provider_name text,
  provider_logo_url text,
  
  -- Country Support
  country_code text DEFAULT 'IN',
  is_global boolean DEFAULT false,
  supported_countries jsonb DEFAULT '["IN"]'::jsonb,
  
  -- Fees
  convenience_fee numeric DEFAULT 0,
  smartpoints_reward integer DEFAULT 0,
  
  -- Status
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  
  -- Integration
  api_endpoint text,
  integration_type text DEFAULT 'manual',
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE essential_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_services_all" ON essential_services;
CREATE POLICY "select_services_all" ON essential_services FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- Insert Essential Services
INSERT INTO essential_services (service_code, service_name, service_category, display_order, smartpoints_reward) VALUES
('electricity', 'Electricity Bill Payment', 'electricity', 1, 5),
('water', 'Water Bill Payment', 'water', 2, 5),
('mobile-prepaid', 'Mobile Prepaid Recharge', 'mobile', 3, 3),
('mobile-postpaid', 'Mobile Postpaid Bill', 'mobile', 4, 5),
('broadband', 'Broadband / Internet Bill', 'broadband', 5, 5),
('lpg-gas', 'LPG Gas Cylinder Booking', 'gas', 6, 5),
('insurance-life', 'Life Insurance Premium', 'insurance', 7, 10),
('insurance-health', 'Health Insurance Premium', 'insurance', 8, 10),
('insurance-motor', 'Motor Insurance Premium', 'insurance', 9, 10),
('fastag', 'FASTag Recharge', 'fastag', 10, 3),
('metro', 'Metro Card Recharge', 'transport', 11, 3),
('property-tax', 'Property Tax Payment', 'government', 12, 10),
('passport', 'Passport Services Fee', 'government', 13, 15),
('visa', 'Visa Application Fee', 'government', 14, 15),
('healthcare', 'Healthcare Payment', 'healthcare', 15, 10)
ON CONFLICT (service_code) DO NOTHING;

-- Essential Service Transactions
CREATE TABLE IF NOT EXISTS essential_service_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_code text NOT NULL REFERENCES essential_services(service_code),
  
  -- Transaction Details
  transaction_reference text NOT NULL,
  consumer_reference text,  -- Account number, mobile number, etc.
  
  amount numeric NOT NULL,
  convenience_fee numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  
  -- Status
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  
  -- Rewards
  smartpoints_earned integer DEFAULT 0,
  smartpoints_credited boolean DEFAULT false,
  
  -- Integration Response
  provider_response jsonb,
  acknowledgement_number text,
  
  -- Timestamps
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  -- Country
  country_code text DEFAULT 'IN'
);

ALTER TABLE essential_service_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_services" ON essential_service_transactions;
CREATE POLICY "select_own_services" ON essential_service_transactions FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_service_transactions_user ON essential_service_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_service_transactions_service ON essential_service_transactions(service_code);

-- 3. CARE CLUB ENGINE
CREATE TABLE IF NOT EXISTS care_club_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  contribution_type text NOT NULL CHECK (contribution_type IN ('food', 'medicine', 'education', 'clothing', 'shelter', 'general')),
  amount numeric NOT NULL,
  
  -- Impact
  beneficiaries_estimate integer DEFAULT 1,
  
  -- Reward
  smartpoints_earned integer DEFAULT 0,
  
  -- Status
  status text DEFAULT 'completed',
  is_anonymous boolean DEFAULT false,
  
  -- Notes
  notes text,
  
  -- Verification
  is_verified boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE care_club_contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_contributions" ON care_club_contributions;
CREATE POLICY "select_own_contributions" ON care_club_contributions FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_contributions_user ON care_club_contributions(user_id);

-- Care Club User Profile
CREATE TABLE IF NOT EXISTS care_club_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Care Level
  care_level text DEFAULT 'bronze' CHECK (care_level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  care_score integer DEFAULT 0,
  
  -- Totals
  total_contributions integer DEFAULT 0,
  total_amount_contributed numeric DEFAULT 0,
  total_beneficiaries integer DEFAULT 0,
  
  -- Badges
  badges jsonb DEFAULT '[]'::jsonb,
  
  -- Preferences
  preferred_causes jsonb DEFAULT '[]'::jsonb,
  is_active_contributor boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

ALTER TABLE care_club_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_care_profile" ON care_club_profiles;
CREATE POLICY "select_own_care_profile" ON care_club_profiles FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "update_own_care_profile" ON care_club_profiles;
CREATE POLICY "update_own_care_profile" ON care_club_profiles FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

-- 4. EMERGENCY CARE REQUESTS
CREATE TABLE IF NOT EXISTS emergency_care_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  request_type text NOT NULL CHECK (request_type IN (
    'food_support', 'medicine_support', 'blood_request', 
    'shelter_assistance', 'mental_wellness', 'senior_support',
    'women_support', 'child_support', 'disaster_relief'
  )),
  
  urgency_level text DEFAULT 'normal' CHECK (urgency_level IN ('normal', 'urgent', 'critical')),
  
  description text,
  location text,
  contact_number text,
  
  -- Status
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  
  -- Response
  assigned_partner text,
  assigned_partner_id uuid REFERENCES profiles(id),
  response_notes text,
  
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  -- Verification
  is_verified boolean DEFAULT false,
  verification_notes text
);

ALTER TABLE emergency_care_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_emergency" ON emergency_care_requests;
CREATE POLICY "select_own_emergency" ON emergency_care_requests FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_emergency" ON emergency_care_requests;
CREATE POLICY "insert_own_emergency" ON emergency_care_requests FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- 5. CARE PARTNERS (NGOs, Hospitals, etc.)
CREATE TABLE IF NOT EXISTS care_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_type text NOT NULL CHECK (partner_type IN ('ngo', 'hospital', 'food_bank', 'shelter', 'mental_health', 'senior_care', 'women_support', 'child_care')),
  
  partner_name text NOT NULL,
  partner_code text NOT NULL UNIQUE,
  
  description text,
  logo_url text,
  
  -- Contact
  address text,
  city text,
  state text,
  pincode text,
  phone text,
  email text,
  website text,
  
  -- Coverage
  service_areas jsonb DEFAULT '[]'::jsonb,
  operating_hours text,
  
  -- Verification
  is_verified boolean DEFAULT false,
  verification_level text DEFAULT 'basic',
  
  -- Status
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE care_partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_partners_all" ON care_partners;
CREATE POLICY "select_partners_all" ON care_partners FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- 6. COMMUNITY IMPACT DASHBOARD
CREATE TABLE IF NOT EXISTS community_impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date NOT NULL DEFAULT current_date,
  
  -- Contributions
  total_contributions_day integer DEFAULT 0,
  total_amount_contributed_day numeric DEFAULT 0,
  
  -- Beneficiaries
  beneficiaries_helped_day integer DEFAULT 0,
  
  -- Volunteers
  active_volunteers_day integer DEFAULT 0,
  volunteer_hours_day integer DEFAULT 0,
  
  -- Emergency
  emergency_requests_day integer DEFAULT 0,
  emergencies_resolved_day integer DEFAULT 0,
  
  -- Learning
  quiz_completions_day integer DEFAULT 0,
  educational_video_views_day integer DEFAULT 0,
  
  -- Community
  new_members_day integer DEFAULT 0,
  smartpoints_earned_day integer DEFAULT 0,
  
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(stat_date)
);

ALTER TABLE community_impact_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_impact_all" ON community_impact_stats;
CREATE POLICY "select_impact_all" ON community_impact_stats FOR SELECT
  TO authenticated, anon USING (true);

-- 7. GLOBAL SERVICE REGIONS
CREATE TABLE IF NOT EXISTS service_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL UNIQUE,
  country_name text NOT NULL,
  
  -- Config
  currency_code text DEFAULT 'INR',
  currency_symbol text DEFAULT '₹',
  time_zone text DEFAULT 'Asia/Kolkata',
  
  -- Services Available
  enabled_services jsonb DEFAULT '["electricity", "water", "mobile", "broadband"]'::jsonb,
  
  -- Status
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_regions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_regions_all" ON service_regions;
CREATE POLICY "select_regions_all" ON service_regions FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- Insert default regions
INSERT INTO service_regions (country_code, country_name, currency_code, currency_symbol) VALUES
('IN', 'India', 'INR', '₹'),
('AE', 'UAE', 'AED', 'د.إ'),
('SA', 'Saudi Arabia', 'SAR', '﷼'),
('GB', 'United Kingdom', 'GBP', '£'),
('CA', 'Canada', 'CAD', '$'),
('AU', 'Australia', 'AUD', '$'),
('US', 'United States', 'USD', '$')
ON CONFLICT (country_code) DO NOTHING;

-- 8. ADMIN CARE MANAGEMENT
CREATE TABLE IF NOT EXISTS admin_care_management (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES profiles(id),
  
  -- Activities
  activity_type text NOT NULL CHECK (activity_type IN (
    'partner_approval', 'emergency_verification', 'contribution_verification',
    'service_update', 'region_enable', 'audit_log'
  )),
  
  target_id text,
  target_type text,
  
  details jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_care_management ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_admin_activity" ON admin_care_management;
CREATE POLICY "select_admin_activity" ON admin_care_management FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. INDEXES
CREATE INDEX IF NOT EXISTS idx_wallet_a_user ON wallet_a_smart(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_a_trans_wallet ON wallet_a_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_b_user ON wallet_b_foe(user_id);
CREATE INDEX IF NOT EXISTS idx_essential_services_category ON essential_services(service_category);
CREATE INDEX IF NOT EXISTS idx_care_contributions_user ON care_club_contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_user ON emergency_care_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_community_impact_date ON community_impact_stats(stat_date);

-- 10. TRIGGERS
DROP TRIGGER IF EXISTS trg_wallet_a_updated ON wallet_a_smart;
CREATE TRIGGER trg_wallet_a_updated BEFORE UPDATE ON wallet_a_smart
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_wallet_b_updated ON wallet_b_foe;
CREATE TRIGGER trg_wallet_b_updated BEFORE UPDATE ON wallet_b_foe
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 11. FUNCTIONS

-- Credit SmartPoints to Wallet A
CREATE OR REPLACE FUNCTION credit_smartpoints(
  p_user_id uuid,
  p_amount integer,
  p_category text,
  p_source_type text DEFAULT null,
  p_source_id uuid DEFAULT null,
  p_description text DEFAULT null
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_wallet RECORD;
  v_new_balance integer;
BEGIN
  -- Get or create wallet
  SELECT * INTO v_wallet FROM wallet_a_smart WHERE user_id = p_user_id;
  
  IF v_wallet IS NULL THEN
    INSERT INTO wallet_a_smart (user_id, smartpoints_balance, total_earned)
    VALUES (p_user_id, p_amount, p_amount)
    RETURNING * INTO v_wallet;
    v_new_balance := p_amount;
  ELSE
    UPDATE wallet_a_smart SET
      smartpoints_balance = smartpoints_balance + p_amount,
      total_earned = total_earned + p_amount,
      updated_at = now()
    WHERE user_id = p_user_id
    RETURNING * INTO v_wallet;
    v_new_balance := v_wallet.smartpoints_balance;
  END IF;
  
  -- Record transaction
  INSERT INTO wallet_a_transactions (wallet_id, transaction_type, category, amount, balance_after, source_type, source_id, description)
  VALUES (v_wallet.id, 'credit', p_category, p_amount, v_new_balance, p_source_type, p_source_id, p_description);
  
  RETURN jsonb_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'amount_credited', p_amount
  );
END;
$function$;

-- Get User Wallet Summary
CREATE OR REPLACE FUNCTION get_user_wallet_summary(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_wallet_a RECORD;
  v_wallet_b RECORD;
  v_summary jsonb;
BEGIN
  SELECT * INTO v_wallet_a FROM wallet_a_smart WHERE user_id = p_user_id;
  SELECT * INTO v_wallet_b FROM wallet_b_foe WHERE user_id = p_user_id;
  
  SELECT jsonb_build_object(
    'wallet_a', CASE WHEN v_wallet_a IS NULL THEN jsonb_build_object(
      'smartpoints_balance', 0,
      'total_earned', 0,
      'total_redeemed', 0,
      'is_active', true
    ) ELSE jsonb_build_object(
      'smartpoints_balance', v_wallet_a.smartpoints_balance,
      'activity_rewards', v_wallet_a.activity_rewards_balance,
      'learning_rewards', v_wallet_a.learning_rewards_balance,
      'total_earned', v_wallet_a.total_earned,
      'is_active', v_wallet_a.is_active
    ) END,
    'wallet_b', CASE WHEN v_wallet_b IS NULL THEN jsonb_build_object(
      'foe_units_balance', 0,
      'active_projects', 0,
      'total_benefits_earned', 0,
      'is_active', true
    ) ELSE jsonb_build_object(
      'foe_units_balance', v_wallet_b.foe_units_balance,
      'active_projects', v_wallet_b.active_projects,
      'completed_projects', v_wallet_b.completed_projects,
      'total_benefits_earned', v_wallet_b.total_benefits_earned,
      'is_active', v_wallet_b.is_active
    ) END
  ) INTO v_summary;
  
  RETURN v_summary;
END;
$function$;

-- Update Care Level
CREATE OR REPLACE FUNCTION update_care_level(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
  v_score integer;
  v_level text;
BEGIN
  SELECT COALESCE(SUM(amount)::integer, 0) INTO v_score
  FROM care_club_contributions
  WHERE user_id = p_user_id;
  
  v_level := CASE
    WHEN v_score >= 100000 THEN 'diamond'
    WHEN v_score >= 50000 THEN 'platinum'
    WHEN v_score >= 20000 THEN 'gold'
    WHEN v_score >= 5000 THEN 'silver'
    ELSE 'bronze'
  END;
  
  INSERT INTO care_club_profiles (user_id, care_level, care_score, total_amount_contributed)
  SELECT p_user_id, v_level, v_score, v_score
  WHERE NOT EXISTS (SELECT 1 FROM care_club_profiles WHERE user_id = p_user_id)
  ON CONFLICT (user_id) DO UPDATE SET
    care_level = v_level,
    care_score = v_score,
    updated_at = now();
END;
$function$;

-- Get Community Impact
CREATE OR REPLACE FUNCTION get_community_impact()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_impact jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_contributors', (SELECT COUNT(DISTINCT user_id) FROM care_club_contributions),
    'total_contributions', (SELECT COALESCE(SUM(amount), 0) FROM care_club_contributions),
    'beneficiaries_helped', (SELECT COALESCE(SUM(beneficiaries_estimate), 0) FROM care_club_contributions),
    'emergency_requests_resolved', (SELECT COUNT(*) FROM emergency_care_requests WHERE status = 'resolved'),
    'active_partners', (SELECT COUNT(*) FROM care_partners WHERE is_active = true)
  ) INTO v_impact;
  
  RETURN v_impact;
END;
$function$;
