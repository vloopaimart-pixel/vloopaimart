-- ============================================================
-- Migration 066: Global Procurement & Trading AI Engine
-- Phase 37 — Enterprise Global Procurement & Trading Architecture
-- ============================================================

-- 1. Supplier Networks
CREATE TABLE IF NOT EXISTS supplier_networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  network_code text NOT NULL UNIQUE,
  network_name text NOT NULL,
  region text NOT NULL CHECK (region IN (
    'india', 'uae_gcc', 'china', 'europe', 'usa', 'asia_pacific',
    'africa', 'latam', 'global', 'future_region'
  )),
  country_codes text[] NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE supplier_networks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_networks_public" ON supplier_networks;
CREATE POLICY "select_networks_public" ON supplier_networks FOR SELECT
  TO authenticated, anon USING (is_active = true);

DROP POLICY IF EXISTS "crud_networks_admin" ON supplier_networks;
CREATE POLICY "crud_networks_admin" ON supplier_networks FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 2. Supplier Profiles
CREATE TABLE supplier_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_code text NOT NULL UNIQUE,
  company_name text NOT NULL,
  trading_name text,
  country text NOT NULL,
  state text,
  city text,
  address text,
  pincode text,
  latitude numeric,
  longitude numeric,
  business_type text NOT NULL CHECK (business_type IN (
    'manufacturer', 'wholesaler', 'distributor', 'importer', 'exporter',
    'trading_company', 'oem', 'odm', 'private_label', 'brand_owner'
  )),
  industry text,
  product_categories text[],
  year_established integer,
  employee_count integer,
  annual_revenue_range text,
  website text,
  contact_email text,
  contact_phone text,
  contact_person text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN (
    'pending', 'documents_submitted', 'under_review', 'verified', 'rejected', 'suspended'
  )),
  trust_score numeric DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_orders integer DEFAULT 0,
  total_order_value numeric DEFAULT 0,
  on_time_delivery_rate numeric DEFAULT 0,
  quality_rating numeric DEFAULT 0,
  response_time_hours integer,
  lead_time_days integer DEFAULT 30,
  moq numeric DEFAULT 1,
  shipping_supported boolean DEFAULT true,
  international_shipping boolean DEFAULT false,
  compliance_status text DEFAULT 'pending' CHECK (compliance_status IN (
    'pending', 'verified', 'issues_found', 'non_compliant', 'exempted'
  )),
  certifications text[],
  payment_terms text,
  bank_details jsonb DEFAULT '{}'::jsonb,
  tax_id text,
  gst_number text,
  import_export_license text,
  documents jsonb DEFAULT '{}'::jsonb,
  notes text,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE supplier_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_suppliers_verified" ON supplier_profiles;
CREATE POLICY "select_suppliers_verified" ON supplier_profiles FOR SELECT
  TO authenticated, anon USING (is_active = true AND verification_status = 'verified');

DROP POLICY IF EXISTS "crud_suppliers_admin" ON supplier_profiles;
CREATE POLICY "crud_suppliers_admin" ON supplier_profiles FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Supplier Network Membership
CREATE TABLE supplier_network_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES supplier_profiles(id) ON DELETE CASCADE,
  network_id uuid NOT NULL REFERENCES supplier_networks(id),
  membership_status text DEFAULT 'pending' CHECK (membership_status IN (
    'pending', 'active', 'suspended', 'terminated'
  )),
  joined_at timestamptz,
  membership_tier text DEFAULT 'standard' CHECK (membership_tier IN (
    'standard', 'premium', 'enterprise', 'platinum'
  )),
  commission_rate numeric DEFAULT 0,
  contract_start date,
  contract_end date,
  created_at timestamptz DEFAULT now(),
  UNIQUE(supplier_id, network_id)
);

ALTER TABLE supplier_network_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_network_members_admin" ON supplier_network_members;
CREATE POLICY "crud_network_members_admin" ON supplier_network_members FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Purchase Orders
CREATE TABLE purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number text NOT NULL UNIQUE,
  supplier_id uuid NOT NULL REFERENCES supplier_profiles(id),
  buyer_id uuid REFERENCES profiles(id),
  seller_id uuid REFERENCES sellers(id),
  order_type text NOT NULL CHECK (order_type IN (
    'direct_purchase', 'bulk_purchase', 'wholesale', 'import',
    'export', 'private_label', 'oem', 'odm', 'container', 'b2b'
  )),
  order_status text DEFAULT 'draft' CHECK (order_status IN (
    'draft', 'submitted', 'confirmed', 'production', 'shipped',
    'in_transit', 'customs', 'delivered', 'completed', 'cancelled', 'returned'
  )),
  currency text DEFAULT 'INR',
  subtotal numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  shipping_cost numeric DEFAULT 0,
  customs_duty numeric DEFAULT 0,
  other_charges numeric DEFAULT 0,
  total_amount numeric DEFAULT 0,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'partial', 'paid', 'refunded', 'failed'
  )),
  paid_amount numeric DEFAULT 0,
  payment_terms text,
  payment_due_date date,
  lead_time_days integer,
  expected_delivery_date date,
  actual_delivery_date date,
  shipping_method text,
  shipping_terms text CHECK (shipping_terms IN (
    'ex_works', 'fob', 'cif', 'cfr', 'ddp', 'dap', 'fca', 'other'
  )),
  origin_country text,
  origin_port text,
  destination_country text DEFAULT 'India',
  destination_port text,
  tracking_number text,
  container_number text,
  customs_clearance_status text CHECK (customs_clearance_status IN (
    'pending', 'submitted', 'cleared', 'held', 'rejected'
  )),
  customs_documents jsonb DEFAULT '[]'::jsonb,
  notes text,
  internal_notes text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_po_admin" ON purchase_orders;
CREATE POLICY "select_po_admin" ON purchase_orders FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "select_own_po" ON purchase_orders;
CREATE POLICY "select_own_po" ON purchase_orders FOR SELECT
  TO authenticated USING (buyer_id = auth.uid() OR seller_id IN (
    SELECT id FROM sellers WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "crud_po_admin" ON purchase_orders;
CREATE POLICY "crud_po_admin" ON purchase_orders FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Purchase Order Items
CREATE TABLE purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  sku text,
  product_name text NOT NULL,
  product_description text,
  category text,
  quantity numeric NOT NULL,
  unit text DEFAULT 'piece',
  unit_price numeric NOT NULL,
  discount_percent numeric DEFAULT 0,
  total_price numeric NOT NULL,
  specifications jsonb DEFAULT '{}'::jsonb,
  customizations jsonb DEFAULT '{}'::jsonb,
  is_private_label boolean DEFAULT false,
  brand_label text,
  item_status text DEFAULT 'pending' CHECK (item_status IN (
    'pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'
  )),
  received_quantity numeric DEFAULT 0,
  quality_check_status text CHECK (quality_check_status IN (
    'pending', 'passed', 'partial', 'failed', 'rejected'
  )),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_items_admin" ON purchase_order_items;
CREATE POLICY "select_items_admin" ON purchase_order_items FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_items_admin" ON purchase_order_items;
CREATE POLICY "crud_items_admin" ON purchase_order_items FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. Extend existing trading_orders
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS trading_code text;
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS trade_type text;
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS buyer_id uuid REFERENCES profiles(id);
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS buyer_seller_id uuid REFERENCES sellers(id);
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS buyer_country text DEFAULT 'India';
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS supplier_country text;
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS trade_direction text;
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS trade_status text DEFAULT 'initiated';
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS incoterms text;
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS origin_port text;
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS destination_port text;
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS expected_ship_date date;
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS actual_ship_date date;
ALTER TABLE trading_orders ADD COLUMN IF NOT EXISTS customs_status text DEFAULT 'pending';

-- Update trading_code for existing records
UPDATE trading_orders SET trading_code = 'TRD-' || to_char(created_at, 'YYYYMMDDHH24MISS') || '-' || substr(md5(id::text), 1, 4) WHERE trading_code IS NULL;

-- 7. Extend existing private_label_brands
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS brand_code text;
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS brand_category text;
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS brand_guidelines_url text;
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS target_market text;
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS price_tier text DEFAULT 'mid_range';
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS quality_tier text DEFAULT 'standard';
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS launch_date date;

-- Update brand_code for existing records
UPDATE private_label_brands SET brand_code = 'VLB-' || to_char(created_at, 'YYYYMMDDHH24MISS') WHERE brand_code IS NULL;

-- 8. Private Label Products
CREATE TABLE private_label_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES private_label_brands(id),
  product_id uuid REFERENCES products(id),
  supplier_id uuid REFERENCES supplier_profiles(id),
  product_name text NOT NULL,
  internal_sku text NOT NULL UNIQUE,
  category text,
  specifications jsonb DEFAULT '{}'::jsonb,
  formulation jsonb DEFAULT '{}'::jsonb,
  packaging jsonb DEFAULT '{}'::jsonb,
  target_cost numeric,
  target_margin numeric,
  target_retail_price numeric,
  production_status text DEFAULT 'concept' CHECK (production_status IN (
    'concept', 'design', 'sourcing', 'sampling', 'approval', 'production', 'launched', 'discontinued'
  )),
  launch_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE private_label_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_plp_admin" ON private_label_products;
CREATE POLICY "crud_plp_admin" ON private_label_products FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Compliance Rules
CREATE TABLE procurement_compliance_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_code text NOT NULL UNIQUE,
  rule_name text NOT NULL,
  rule_type text NOT NULL CHECK (rule_type IN (
    'tax', 'import', 'export', 'customs', 'business_verification',
    'product_compliance', 'labeling', 'certification', 'country_specific'
  )),
  country_code text NOT NULL,
  category text,
  rule_data jsonb NOT NULL,
  effective_from date,
  effective_to date,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE procurement_compliance_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_proc_compliance_public" ON procurement_compliance_rules;
CREATE POLICY "select_proc_compliance_public" ON procurement_compliance_rules FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_proc_compliance_admin" ON procurement_compliance_rules;
CREATE POLICY "crud_proc_compliance_admin" ON procurement_compliance_rules FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Supplier Compliance Records
CREATE TABLE supplier_compliance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES supplier_profiles(id) ON DELETE CASCADE,
  compliance_rule_id uuid REFERENCES procurement_compliance_rules(id),
  country_code text,
  compliance_type text,
  status text DEFAULT 'pending' CHECK (status IN (
    'pending', 'compliant', 'non_compliant', 'under_review', 'exempted'
  )),
  documents jsonb DEFAULT '[]'::jsonb,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  expiry_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE supplier_compliance_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_scompliance_admin" ON supplier_compliance_records;
CREATE POLICY "crud_scompliance_admin" ON supplier_compliance_records FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. AI Supplier Intelligence
CREATE TABLE ai_supplier_intelligence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES supplier_profiles(id) ON DELETE CASCADE,
  intelligence_type text NOT NULL CHECK (intelligence_type IN (
    'supplier_recommendation', 'price_comparison', 'quality_analysis',
    'lead_time_prediction', 'risk_analysis', 'demand_forecast',
    'seasonal_procurement', 'negotiation_support', 'market_analysis'
  )),
  score numeric DEFAULT 0,
  confidence_level numeric,
  analysis_data jsonb DEFAULT '{}'::jsonb,
  factors jsonb DEFAULT '{}'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  predictions jsonb DEFAULT '{}'::jsonb,
  model_version text,
  last_computed_at timestamptz,
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_supplier_intelligence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_sintel_admin" ON ai_supplier_intelligence;
CREATE POLICY "crud_sintel_admin" ON ai_supplier_intelligence FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 12. Procurement Analytics
CREATE TABLE procurement_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  supplier_id uuid REFERENCES supplier_profiles(id),
  country text,
  order_type text,
  category text,
  total_orders integer DEFAULT 0,
  total_value numeric DEFAULT 0,
  avg_order_value numeric DEFAULT 0,
  on_time_rate numeric DEFAULT 0,
  quality_rate numeric DEFAULT 0,
  cost_savings numeric DEFAULT 0,
  lead_time_avg integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, supplier_id, order_type, category)
);

ALTER TABLE procurement_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_procanalytics_admin" ON procurement_analytics;
CREATE POLICY "crud_procanalytics_admin" ON procurement_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Trading Analytics
CREATE TABLE trading_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  trade_type text,
  direction text CHECK (direction IN ('import', 'export', 'domestic')),
  buyer_country text,
  supplier_country text,
  total_trades integer DEFAULT 0,
  total_value numeric DEFAULT 0,
  avg_trade_value numeric DEFAULT 0,
  customs_clearance_rate numeric DEFAULT 0,
  avg_transit_days integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, trade_type, direction, buyer_country, supplier_country)
);

ALTER TABLE trading_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_tradinganalytics_admin" ON trading_analytics;
CREATE POLICY "crud_tradinganalytics_admin" ON trading_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 14. Indexes
CREATE INDEX IF NOT EXISTS idx_suppliernetworks_region ON supplier_networks(region);
CREATE INDEX IF NOT EXISTS idx_supplierprofiles_country ON supplier_profiles(country);
CREATE INDEX IF NOT EXISTS idx_supplierprofiles_bustype ON supplier_profiles(business_type);
CREATE INDEX IF NOT EXISTS idx_supplierprofiles_verify ON supplier_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_supplierprofiles_trust ON supplier_profiles(trust_score DESC);
CREATE INDEX IF NOT EXISTS idx_supplierprofiles_rating ON supplier_profiles(rating DESC);

CREATE INDEX IF NOT EXISTS idx_suppliernetworkmem_supplier ON supplier_network_members(supplier_id);
CREATE INDEX IF NOT EXISTS idx_suppliernetworkmem_network ON supplier_network_members(network_id);

CREATE INDEX IF NOT EXISTS idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_po_type ON purchase_orders(order_type);
CREATE INDEX IF NOT EXISTS idx_po_dates ON purchase_orders(expected_delivery_date);

CREATE INDEX IF NOT EXISTS idx_poitems_order ON purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_poitems_product ON purchase_order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_trading_type ON trading_orders(trade_type);
CREATE INDEX IF NOT EXISTS idx_trading_tstatus ON trading_orders(trade_status);

CREATE INDEX IF NOT EXISTS idx_plproducts_brand ON private_label_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_plproducts_supplier ON private_label_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_plproducts_status ON private_label_products(production_status);

CREATE INDEX IF NOT EXISTS idx_proccomp_rules_country ON procurement_compliance_rules(country_code);
CREATE INDEX IF NOT EXISTS idx_proccomp_rules_type ON procurement_compliance_rules(rule_type);

CREATE INDEX IF NOT EXISTS idx_aisintell_supplier ON ai_supplier_intelligence(supplier_id);
CREATE INDEX IF NOT EXISTS idx_aisintell_type ON ai_supplier_intelligence(intelligence_type);

CREATE INDEX IF NOT EXISTS idx_procanalytics_date ON procurement_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_tradinganalytics_date ON trading_analytics(date DESC);

-- 15. Triggers
DROP TRIGGER IF EXISTS trg_supplernetworks_updated ON supplier_networks;
CREATE TRIGGER trg_supplernetworks_updated BEFORE UPDATE ON supplier_networks
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_supplierprofiles_updated ON supplier_profiles;
CREATE TRIGGER trg_supplierprofiles_updated BEFORE UPDATE ON supplier_profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_po_updated ON purchase_orders;
CREATE TRIGGER trg_po_updated BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_plproducts_updated ON private_label_products;
CREATE TRIGGER trg_plproducts_updated BEFORE UPDATE ON private_label_products
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_aisintell_updated ON ai_supplier_intelligence;
CREATE TRIGGER trg_aisintell_updated BEFORE UPDATE ON ai_supplier_intelligence
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 16. Functions
CREATE OR REPLACE FUNCTION calculate_supplier_trust_score(p_supplier_id uuid)
RETURNS numeric
LANGUAGE plpgsql
AS $function$
DECLARE
  v_score numeric := 50;
  v_rating numeric;
  v_on_time_rate numeric;
  v_quality numeric;
  v_orders integer;
  v_verified boolean;
BEGIN
  SELECT rating, on_time_delivery_rate, quality_rating, total_orders,
         (verification_status = 'verified')
  INTO v_rating, v_on_time_rate, v_quality, v_orders, v_verified
  FROM supplier_profiles WHERE id = p_supplier_id;

  IF v_verified THEN v_score := v_score + 20; END IF;
  IF v_rating > 4 THEN v_score := v_score + 10; END IF;
  IF v_rating > 4.5 THEN v_score := v_score + 5; END IF;
  IF v_on_time_rate > 90 THEN v_score := v_score + 10; END IF;
  IF v_quality > 90 THEN v_score := v_score + 5; END IF;
  IF v_orders > 100 THEN v_score := v_score + 5; END IF;
  IF v_orders > 500 THEN v_score := v_score + 5; END IF;

  v_score := LEAST(100, v_score);
  v_score := GREATEST(0, v_score);

  UPDATE supplier_profiles SET trust_score = v_score WHERE id = p_supplier_id;

  RETURN v_score;
END;
$function$;

CREATE OR REPLACE FUNCTION get_procurement_dashboard()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_suppliers', (SELECT COUNT(*) FROM supplier_profiles WHERE is_active = true),
    'verified_suppliers', (SELECT COUNT(*) FROM supplier_profiles WHERE verification_status = 'verified'),
    'pending_orders', (SELECT COUNT(*) FROM purchase_orders WHERE order_status IN ('draft', 'submitted', 'confirmed')),
    'in_transit_orders', (SELECT COUNT(*) FROM purchase_orders WHERE order_status IN ('shipped', 'in_transit', 'customs')),
    'total_purchase_value', COALESCE((SELECT SUM(total_amount) FROM purchase_orders WHERE order_status NOT IN ('draft', 'cancelled')), 0),
    'active_trades', (SELECT COUNT(*) FROM trading_orders WHERE trade_status NOT IN ('completed', 'cancelled') OR trade_status IS NULL),
    'private_label_products', (SELECT COUNT(*) FROM private_label_products WHERE production_status = 'launched'),
    'compliance_rules', (SELECT COUNT(*) FROM procurement_compliance_rules WHERE is_active = true)
  ) INTO v_stats;

  RETURN v_stats;
END;
$function$;
