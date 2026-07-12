-- ============================================================
-- Migration 064: Seller, Partner & Franchise Ecosystem
-- Phase 35 — Complete Seller, Partner and Franchise Architecture
-- ============================================================

-- 1. Extend Sellers with new fields
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS owner_name text;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS business_category text;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS district text;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS latitude numeric;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS longitude numeric;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS trust_score numeric DEFAULT 0;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending'
  CHECK (verification_status IN ('pending', 'document_review', 'manual_approval', 'ai_verification', 'verified', 'rejected', 'suspended'));
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS documents jsonb DEFAULT '{}'::jsonb;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS suspended_at timestamptz;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS suspended_reason text;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS total_orders integer DEFAULT 0;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS total_revenue numeric DEFAULT 0;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS delivery_performance_score numeric DEFAULT 0;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS customer_satisfaction_score numeric DEFAULT 0;
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS franchise_parent_id uuid REFERENCES sellers(id);
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS franchise_level text DEFAULT 'none'
  CHECK (franchise_level IN ('none', 'country_master', 'state_partner', 'district_partner', 'city_partner', 'local_partner'));
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS franchise_territory jsonb DEFAULT '{}'::jsonb;

-- 2. Seller Verification Documents
CREATE TABLE seller_verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN (
    'identity_proof', 'address_proof', 'business_registration', 'gst_certificate',
    'pan_card', 'bank_statement', 'cancelled_cheque', 'business_photo',
    'product_catalog', 'other'
  )),
  document_url text NOT NULL,
  document_name text,
  verification_status text DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'approved', 'rejected', 'needs_clarification')),
  verified_by uuid REFERENCES profiles(id),
  verified_at timestamptz,
  rejection_reason text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seller_verification_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_verification_docs" ON seller_verification_documents FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = seller_verification_documents.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "crud_verification_docs_admin" ON seller_verification_documents FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Seller Verification Workflow
CREATE TABLE seller_verification_workflow (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  current_stage text NOT NULL CHECK (current_stage IN (
    'pending', 'document_review', 'manual_approval', 'ai_verification', 'verified', 'rejected', 'suspended'
  )),
  previous_stage text,
  stage_started_at timestamptz DEFAULT now(),
  stage_completed_at timestamptz,
  assigned_to uuid REFERENCES profiles(id),
  ai_review_score numeric,
  ai_review_notes text,
  manual_review_notes text,
  is_escalated boolean DEFAULT false,
  escalated_to uuid REFERENCES profiles(id),
  escalated_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE seller_verification_workflow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_verification_workflow_admin" ON seller_verification_workflow FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Partner Profiles
CREATE TABLE partner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  partner_code text NOT NULL UNIQUE,
  partner_type text NOT NULL CHECK (partner_type IN (
    'individual_seller', 'local_shop', 'home_business', 'manufacturer',
    'distributor', 'wholesaler', 'importer', 'exporter', 'brand_owner',
    'service_provider', 'affiliate_partner', 'home_cloud_store'
  )),
  business_name text NOT NULL,
  owner_name text NOT NULL,
  business_email text,
  business_phone text,
  business_category text,
  gst_number text,
  tax_id text,
  country text DEFAULT 'India',
  state text,
  district text,
  city text,
  address text,
  pincode text,
  latitude numeric,
  longitude numeric,
  trust_score numeric DEFAULT 0,
  trust_status text DEFAULT 'new' CHECK (trust_status IN ('new', 'building', 'trusted', 'verified', 'flagged', 'suspended')),
  verification_status text DEFAULT 'pending',
  is_active boolean DEFAULT true,
  total_orders integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  total_products integer DEFAULT 0,
  rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  settlement_balance numeric DEFAULT 0,
  last_settlement_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partner_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_partner" ON partner_profiles FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "insert_partner_user" ON partner_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_partner" ON partner_profiles FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "crud_partner_admin" ON partner_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Home Cloud Store Extensions
CREATE TABLE home_cloud_store_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  store_name text NOT NULL,
  store_code text NOT NULL UNIQUE,
  inventory_limit integer DEFAULT 50,
  current_inventory_count integer DEFAULT 0,
  delivery_radius_km numeric DEFAULT 5,
  working_hours_start text DEFAULT '09:00',
  working_hours_end text DEFAULT '21:00',
  working_days text[] DEFAULT ARRAY['mon','tue','wed','thu','fri','sat','sun'],
  delivery_areas jsonb DEFAULT '[]'::jsonb,
  min_order_value numeric DEFAULT 0,
  delivery_fee numeric DEFAULT 0,
  free_delivery_above numeric DEFAULT 0,
  is_micro_inventory boolean DEFAULT true,
  supports_same_day boolean DEFAULT true,
  supports_express boolean DEFAULT false,
  performance_score numeric DEFAULT 0,
  trust_score numeric DEFAULT 0,
  total_orders integer DEFAULT 0,
  completed_orders integer DEFAULT 0,
  cancelled_orders integer DEFAULT 0,
  average_delivery_time_minutes integer,
  customer_rating numeric DEFAULT 0,
  settlement_balance numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE home_cloud_store_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_home_cloud_verified" ON home_cloud_store_profiles FOR SELECT
  TO authenticated, anon USING (is_active = true AND is_verified = true);

CREATE POLICY "select_own_home_cloud" ON home_cloud_store_profiles FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = home_cloud_store_profiles.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "crud_home_cloud_admin" ON home_cloud_store_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. Franchise Hierarchy
CREATE TABLE franchise_hierarchy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_code text NOT NULL UNIQUE,
  franchise_name text NOT NULL,
  franchise_level text NOT NULL CHECK (franchise_level IN (
    'country_master', 'state_partner', 'district_partner', 'city_partner', 'local_partner'
  )),
  parent_franchise_id uuid REFERENCES franchise_hierarchy(id),
  country text NOT NULL,
  state text,
  district text,
  city text,
  territory_code text,
  territory_bounds jsonb DEFAULT '{}'::jsonb,
  owner_seller_id uuid REFERENCES sellers(id),
  commission_rate numeric DEFAULT 0,
  revenue_share numeric DEFAULT 0,
  total_partners_under integer DEFAULT 0,
  total_sales numeric DEFAULT 0,
  total_revenue_share numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  contract_start_date date,
  contract_end_date date,
  contract_terms jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE franchise_hierarchy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_franchise_public" ON franchise_hierarchy FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "crud_franchise_admin" ON franchise_hierarchy FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. Commission Rules
CREATE TABLE commission_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text NOT NULL,
  rule_code text NOT NULL UNIQUE,
  commission_type text NOT NULL CHECK (commission_type IN (
    'marketplace_sales', 'affiliate_sales', 'private_label_sales',
    'referral_rewards', 'franchise_revenue', 'service_revenue', 'trading_commission', 'other'
  )),
  seller_type text,
  product_category_id uuid REFERENCES marketplace_categories(id),
  min_order_value numeric DEFAULT 0,
  max_order_value numeric,
  min_quantity integer DEFAULT 1,
  commission_percent numeric DEFAULT 0,
  fixed_commission numeric DEFAULT 0,
  is_tiered boolean DEFAULT false,
  tier_config jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,
  valid_from date,
  valid_to date,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE commission_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_commission_rules_public" ON commission_rules FOR SELECT
  TO authenticated USING (is_active = true);

CREATE POLICY "crud_commission_admin" ON commission_rules FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Commission Transactions
CREATE TABLE commission_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_code text NOT NULL UNIQUE,
  seller_id uuid NOT NULL REFERENCES sellers(id),
  order_id uuid REFERENCES orders(id),
  commission_rule_id uuid REFERENCES commission_rules(id),
  commission_type text NOT NULL,
  base_amount numeric NOT NULL,
  commission_percent numeric,
  commission_amount numeric NOT NULL,
  settlement_status text DEFAULT 'pending'
    CHECK (settlement_status IN ('pending', 'settled', 'failed', 'refunded')),
  settlement_id uuid,
  settled_at timestamptz,
  settlement_period text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE commission_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_commission" ON commission_transactions FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = commission_transactions.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "crud_commission_admin" ON commission_transactions FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Partner Settlements
CREATE TABLE partner_settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settlement_code text NOT NULL UNIQUE,
  seller_id uuid NOT NULL REFERENCES sellers(id),
  settlement_period text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_orders integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  total_commission numeric DEFAULT 0,
  adjustments numeric DEFAULT 0,
  net_settlement numeric NOT NULL,
  payment_status text DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  payment_method text,
  payment_reference text,
  paid_at timestamptz,
  paid_by uuid REFERENCES profiles(id),
  invoice_number text,
  invoice_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partner_settlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_settlement" ON partner_settlements FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = partner_settlements.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "crud_settlement_admin" ON partner_settlements FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Partner Analytics
CREATE TABLE partner_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_orders integer DEFAULT 0,
  completed_orders integer DEFAULT 0,
  cancelled_orders integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  total_commission numeric DEFAULT 0,
  avg_order_value numeric DEFAULT 0,
  avg_delivery_time_minutes integer,
  customer_rating_avg numeric DEFAULT 0,
  new_customers integer DEFAULT 0,
  returning_customers integer DEFAULT 0,
  product_views integer DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  return_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(seller_id, date)
);

ALTER TABLE partner_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_analytics" ON partner_analytics FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = partner_analytics.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "crud_analytics_admin" ON partner_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. AI Partner Intelligence
CREATE TABLE ai_partner_intelligence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  score_type text NOT NULL CHECK (score_type IN (
    'seller_quality', 'delivery_performance', 'customer_satisfaction',
    'fraud_risk', 'business_growth', 'inventory_optimization',
    'pricing_optimization', 'product_recommendation'
  )),
  current_score numeric DEFAULT 0,
  previous_score numeric,
  score_trend text CHECK (score_trend IN ('improving', 'stable', 'declining')),
  factors jsonb DEFAULT '{}'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  predictions jsonb DEFAULT '{}'::jsonb,
  last_computed_at timestamptz DEFAULT now(),
  next_compute_at timestamptz,
  model_version text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_partner_intelligence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_intelligence" ON ai_partner_intelligence FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = ai_partner_intelligence.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "crud_intelligence_admin" ON ai_partner_intelligence FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 12. Partner Trust Events
CREATE TABLE partner_trust_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES sellers(id),
  event_type text NOT NULL CHECK (event_type IN (
    'positive_review', 'negative_review', 'order_completed', 'order_cancelled',
    'delivery_on_time', 'delivery_late', 'complaint', 'compliment',
    'document_verified', 'document_rejected', 'fraud_detected',
    'trust_milestone', 'manual_adjustment'
  )),
  event_description text,
  trust_points_change integer NOT NULL,
  trust_score_before numeric,
  trust_score_after numeric,
  reference_type text,
  reference_id uuid,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partner_trust_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_trust_events" ON partner_trust_events FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = partner_trust_events.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "crud_trust_admin" ON partner_trust_events FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Indexes
CREATE INDEX IF NOT EXISTS idx_sellers_verification ON sellers(verification_status);
CREATE INDEX IF NOT EXISTS idx_sellers_franchise ON sellers(franchise_level);
CREATE INDEX IF NOT EXISTS idx_sellers_parent ON sellers(franchise_parent_id);
CREATE INDEX IF NOT EXISTS idx_sellers_trust ON sellers(trust_score DESC);

CREATE INDEX IF NOT EXISTS idx_verification_docs_seller ON seller_verification_documents(seller_id);
CREATE INDEX IF NOT EXISTS idx_verification_docs_status ON seller_verification_documents(verification_status);

CREATE INDEX IF NOT EXISTS idx_verification_workflow_seller ON seller_verification_workflow(seller_id);
CREATE INDEX IF NOT EXISTS idx_verification_workflow_stage ON seller_verification_workflow(current_stage);

CREATE INDEX IF NOT EXISTS idx_partner_user ON partner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_type ON partner_profiles(partner_type);
CREATE INDEX IF NOT EXISTS idx_partner_trust ON partner_profiles(trust_status);

CREATE INDEX IF NOT EXISTS idx_home_cloud_seller ON home_cloud_store_profiles(seller_id);
CREATE INDEX IF NOT EXISTS idx_home_cloud_active ON home_cloud_store_profiles(is_active, is_verified);

CREATE INDEX IF NOT EXISTS idx_franchise_level ON franchise_hierarchy(franchise_level);
CREATE INDEX IF NOT EXISTS idx_franchise_parent ON franchise_hierarchy(parent_franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_owner ON franchise_hierarchy(owner_seller_id);

CREATE INDEX IF NOT EXISTS idx_commission_rules_type ON commission_rules(commission_type);
CREATE INDEX IF NOT EXISTS idx_commission_rules_active ON commission_rules(is_active);

CREATE INDEX IF NOT EXISTS idx_commission_trans_seller ON commission_transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_commission_trans_status ON commission_transactions(settlement_status);
CREATE INDEX IF NOT EXISTS idx_commission_trans_period ON commission_transactions(settlement_period);

CREATE INDEX IF NOT EXISTS idx_settlements_seller ON partner_settlements(seller_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON partner_settlements(payment_status);
CREATE INDEX IF NOT EXISTS idx_settlements_period ON partner_settlements(settlement_period);

CREATE INDEX IF NOT EXISTS idx_partner_analytics_seller ON partner_analytics(seller_id);
CREATE INDEX IF NOT EXISTS idx_partner_analytics_date ON partner_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_ai_intelligence_seller ON ai_partner_intelligence(seller_id);
CREATE INDEX IF NOT EXISTS idx_ai_intelligence_type ON ai_partner_intelligence(score_type);

CREATE INDEX IF NOT EXISTS idx_trust_events_seller ON partner_trust_events(seller_id);
CREATE INDEX IF NOT EXISTS idx_trust_events_type ON partner_trust_events(event_type);

-- 14. Triggers
DROP TRIGGER IF EXISTS trg_seller_verification_updated ON seller_verification_workflow;
CREATE TRIGGER trg_seller_verification_updated BEFORE UPDATE ON seller_verification_workflow
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_partner_profile_updated ON partner_profiles;
CREATE TRIGGER trg_partner_profile_updated BEFORE UPDATE ON partner_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_home_cloud_updated ON home_cloud_store_profiles;
CREATE TRIGGER trg_home_cloud_updated BEFORE UPDATE ON home_cloud_store_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_franchise_updated ON franchise_hierarchy;
CREATE TRIGGER trg_franchise_updated BEFORE UPDATE ON franchise_hierarchy
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_commission_rules_updated ON commission_rules;
CREATE TRIGGER trg_commission_rules_updated BEFORE UPDATE ON commission_rules
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_settlements_updated ON partner_settlements;
CREATE TRIGGER trg_settlements_updated BEFORE UPDATE ON partner_settlements
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_ai_intelligence_updated ON ai_partner_intelligence;
CREATE TRIGGER trg_ai_intelligence_updated BEFORE UPDATE ON ai_partner_intelligence
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 15. Functions
CREATE OR REPLACE FUNCTION calculate_seller_trust_score(p_seller_id uuid)
RETURNS numeric
LANGUAGE plpgsql
AS $function$
DECLARE
  v_score numeric := 50;
  v_orders integer;
  v_rating numeric;
  v_completed_rate numeric;
  v_verified boolean;
BEGIN
  SELECT total_orders, rating, is_verified INTO v_orders, v_rating, v_verified
  FROM sellers WHERE id = p_seller_id;

  IF v_verified THEN v_score := v_score + 20; END IF;
  IF v_orders > 100 THEN v_score := v_score + 10; END IF;
  IF v_orders > 500 THEN v_score := v_score + 10; END IF;
  IF v_rating > 4 THEN v_score := v_score + 10; END IF;
  IF v_rating > 4.5 THEN v_score := v_score + 5; END IF;

  v_score := LEAST(100, v_score);
  v_score := GREATEST(0, v_score);

  UPDATE sellers SET trust_score = v_score WHERE id = p_seller_id;

  RETURN v_score;
END;
$function$;

CREATE OR REPLACE FUNCTION get_partner_dashboard_stats(p_seller_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'orders', COALESCE((SELECT total_orders FROM sellers WHERE id = p_seller_id), 0),
    'revenue', COALESCE((SELECT total_revenue FROM sellers WHERE id = p_seller_id), 0),
    'products', COALESCE((SELECT total_products FROM sellers WHERE id = p_seller_id), 0),
    'rating', COALESCE((SELECT rating FROM sellers WHERE id = p_seller_id), 0),
    'trust_score', COALESCE((SELECT trust_score FROM sellers WHERE id = p_seller_id), 0),
    'commission_balance', COALESCE((SELECT SUM(commission_amount) FROM commission_transactions WHERE seller_id = p_seller_id AND settlement_status = 'pending'), 0),
    'settlement_balance', COALESCE((SELECT settlement_balance FROM partner_profiles WHERE seller_id = p_seller_id), 0)
  ) INTO v_stats;

  RETURN v_stats;
END;
$function$;
