-- ============================================================
-- Migration 067: Global Private Label & Brand Ecosystem
-- Phase 38 — Enterprise Private Label & Brand Management Architecture
-- ============================================================

-- 1. Extend private_label_brands for brand identity
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS brand_colors jsonb DEFAULT '{}'::jsonb;
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS brand_story text;
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS brand_values text[];
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS country_availability text[] DEFAULT ARRAY['India']::text[];
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'registered', 'premium', 'hidden'));
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS brand_status text DEFAULT 'concept' CHECK (brand_status IN ('concept', 'development', 'launching', 'active', 'paused', 'discontinued'));
ALTER TABLE private_label_brands ADD COLUMN IF NOT EXISTS brand_manager_id uuid REFERENCES profiles(id);

-- 2. Extend private_label_products for manufacturing
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS manufacturing_type text DEFAULT 'private_label' CHECK (manufacturing_type IN ('oem', 'odm', 'white_label', 'private_label', 'co_branding', 'licensed', 'future_type'));
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS manufacturer_id uuid;
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS factory_id uuid;
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS sku_prefix text;
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS batch_code_format text;
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS barcode text;
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS manufacturing_cost numeric DEFAULT 0;
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS landed_cost numeric DEFAULT 0;
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS quality_status text DEFAULT 'pending' CHECK (quality_status IN ('pending', 'approved', 'rejected', 'recalled', 'suspended'));
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS certification_status text DEFAULT 'pending';
ALTER TABLE private_label_products ADD COLUMN IF NOT EXISTS compliance_status text DEFAULT 'pending';

-- 3. Manufacturers / Factories
CREATE TABLE manufacturers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_code text NOT NULL UNIQUE,
  manufacturer_name text NOT NULL,
  manufacturer_type text NOT NULL CHECK (manufacturer_type IN ('oem', 'odm', 'contract_manufacturer', 'white_label', 'co_manufacturer', 'licensed', 'future_type')),
  country text NOT NULL,
  state text,
  city text,
  address text,
  pincode text,
  latitude numeric,
  longitude numeric,
  contact_person text,
  contact_email text,
  contact_phone text,
  website text,
  year_established integer,
  employee_count integer,
  certifications text[],
  production_capacity integer,
  moq numeric DEFAULT 100,
  lead_time_days integer DEFAULT 30,
  specialties text[],
  quality_rating numeric DEFAULT 0,
  on_time_rate numeric DEFAULT 0,
  trust_score numeric DEFAULT 0,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'documents_submitted', 'under_review', 'verified', 'rejected', 'suspended')),
  is_active boolean DEFAULT true,
  is_approved boolean DEFAULT false,
  approved_at timestamptz,
  approved_by uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_manufacturers_admin" ON manufacturers;
CREATE POLICY "select_manufacturers_admin" ON manufacturers FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_manufacturers_admin" ON manufacturers;
CREATE POLICY "crud_manufacturers_admin" ON manufacturers FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Factory Inspections
CREATE TABLE factory_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_id uuid NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
  inspection_type text NOT NULL CHECK (inspection_type IN ('initial_approval', 'routine', 'quality_issue', 'renewal', 'complaint_followup', 'special_audit')),
  inspection_date date NOT NULL,
  inspector_id uuid REFERENCES profiles(id),
  inspector_name text,
  inspection_status text DEFAULT 'scheduled' CHECK (inspection_status IN ('scheduled', 'in_progress', 'completed', 'failed', 'cancelled')),
  overall_score numeric DEFAULT 0,
  quality_score numeric DEFAULT 0,
  safety_score numeric DEFAULT 0,
  compliance_score numeric DEFAULT 0,
  findings jsonb DEFAULT '[]'::jsonb,
  recommendations text[],
  corrective_actions jsonb DEFAULT '[]'::jsonb,
  follow_up_required boolean DEFAULT false,
  follow_up_date date,
  next_inspection_date date,
  report_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE factory_inspections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_inspections_admin" ON factory_inspections;
CREATE POLICY "crud_inspections_admin" ON factory_inspections FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Packaging Templates
CREATE TABLE packaging_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code text NOT NULL UNIQUE,
  template_name text NOT NULL,
  category text NOT NULL,
  description text,
  dimensions jsonb DEFAULT '{}'::jsonb,
  weight_grams numeric,
  materials text[],
  print_specifications jsonb DEFAULT '{}'::jsonb,
  barcode_type text DEFAULT 'ean13' CHECK (barcode_type IN ('ean13', 'ean8', 'upc', 'code128', 'qr', 'datamatrix', 'none')),
  barcode_position jsonb DEFAULT '{}'::jsonb,
  qr_code_enabled boolean DEFAULT true,
  qr_code_position jsonb DEFAULT '{}'::jsonb,
  batch_number_format text,
  batch_number_position jsonb DEFAULT '{}'::jsonb,
  manufacturing_date_enabled boolean DEFAULT true,
  expiry_date_enabled boolean DEFAULT false,
  date_position jsonb DEFAULT '{}'::jsonb,
  country_label_required boolean DEFAULT true,
  country_label_position jsonb DEFAULT '{}'::jsonb,
  language_variants jsonb DEFAULT '[]'::jsonb,
  template_url text,
  preview_url text,
  cost_per_unit numeric DEFAULT 0,
  min_order_quantity integer DEFAULT 100,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE packaging_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_packaging_admin" ON packaging_templates;
CREATE POLICY "select_packaging_admin" ON packaging_templates FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_packaging_admin" ON packaging_templates;
CREATE POLICY "crud_packaging_admin" ON packaging_templates FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. Product Packaging Assignments
CREATE TABLE product_packaging (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES private_label_products(id) ON DELETE CASCADE,
  template_id uuid REFERENCES packaging_templates(id),
  barcode text,
  qr_code_url text,
  batch_code_prefix text,
  batch_counter integer DEFAULT 0,
  label_language text DEFAULT 'en',
  label_text jsonb DEFAULT '{}'::jsonb,
  warning_labels text[],
  nutritional_info jsonb DEFAULT '{}'::jsonb,
  ingredients_list text,
  allergen_info text[],
  manufacturing_date date,
  expiry_date date,
  best_before_date date,
  country_of_origin text DEFAULT 'India',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_packaging ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_prodpkg_admin" ON product_packaging;
CREATE POLICY "crud_prodpkg_admin" ON product_packaging FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. Quality Control Inspections
CREATE TABLE quality_inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_code text NOT NULL UNIQUE,
  product_id uuid NOT NULL REFERENCES private_label_products(id),
  batch_id uuid,
  manufacturer_id uuid REFERENCES manufacturers(id),
  inspection_type text NOT NULL CHECK (inspection_type IN ('factory_approval', 'pre_shipment', 'incoming', 'in_process', 'final', 'random', 'complaint_investigation')),
  inspection_date date NOT NULL,
  inspector_id uuid REFERENCES profiles(id),
  inspector_name text,
  inspection_status text DEFAULT 'scheduled' CHECK (inspection_status IN ('scheduled', 'in_progress', 'passed', 'failed', 'conditional', 'pending_retest')),
  sample_size integer DEFAULT 1,
  sample_passed integer DEFAULT 0,
  sample_failed integer DEFAULT 0,
  pass_rate numeric DEFAULT 0,
  parameters_tested jsonb DEFAULT '[]'::jsonb,
  results jsonb DEFAULT '{}'::jsonb,
  defects_found jsonb DEFAULT '[]'::jsonb,
  overall_grade text,
  notes text,
  corrective_actions jsonb DEFAULT '[]'::jsonb,
  retest_required boolean DEFAULT false,
  retest_date date,
  report_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quality_inspections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_qinsp_admin" ON quality_inspections;
CREATE POLICY "crud_qinsp_admin" ON quality_inspections FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Product Batches
CREATE TABLE product_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_code text NOT NULL UNIQUE,
  product_id uuid NOT NULL REFERENCES private_label_products(id),
  manufacturer_id uuid REFERENCES manufacturers(id),
  production_date date NOT NULL,
  expiry_date date,
  best_before_date date,
  quantity_produced integer DEFAULT 0,
  quantity_passed integer DEFAULT 0,
  quantity_failed integer DEFAULT 0,
  quantity_released integer DEFAULT 0,
  quantity_shipped integer DEFAULT 0,
  batch_status text DEFAULT 'production' CHECK (batch_status IN ('production', 'quality_check', 'passed', 'failed', 'released', 'recalled', 'expired')),
  quality_inspection_id uuid REFERENCES quality_inspections(id),
  quality_status text DEFAULT 'pending' CHECK (quality_status IN ('pending', 'approved', 'conditional', 'rejected', 'recalled')),
  release_date date,
  released_by uuid REFERENCES profiles(id),
  recall_status text DEFAULT 'none' CHECK (recall_status IN ('none', 'partial', 'full')),
  recall_date date,
  recall_reason text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_batches_own" ON product_batches;
CREATE POLICY "select_batches_own" ON product_batches FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "crud_batches_admin" ON product_batches;
CREATE POLICY "crud_batches_admin" ON product_batches FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Brand Compliance
CREATE TABLE brand_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES private_label_brands(id) ON DELETE CASCADE,
  country_code text NOT NULL,
  compliance_type text NOT NULL CHECK (compliance_type IN ('food', 'cosmetic', 'electronics', 'textile', 'toy', 'pharmaceutical', 'general', 'country_specific')),
  regulation_name text NOT NULL,
  requirement text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'compliant', 'non_compliant', 'exempted', 'under_review')),
  documents jsonb DEFAULT '[]'::jsonb,
  certification_required text,
  certification_obtained text,
  certification_expiry date,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brand_compliance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_bcompliance_admin" ON brand_compliance;
CREATE POLICY "crud_bcompliance_admin" ON brand_compliance FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Product Compliance
CREATE TABLE product_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES private_label_products(id) ON DELETE CASCADE,
  country_code text NOT NULL,
  compliance_type text NOT NULL,
  regulation_name text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'compliant', 'non_compliant', 'exempted', 'under_review')),
  documents jsonb DEFAULT '[]'::jsonb,
  certification_number text,
  certification_expiry date,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_compliance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_pcompliance_admin" ON product_compliance;
CREATE POLICY "crud_pcompliance_admin" ON product_compliance FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. AI Brand Intelligence
CREATE TABLE ai_brand_intelligence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES private_label_brands(id) ON DELETE CASCADE,
  intelligence_type text NOT NULL CHECK (intelligence_type IN (
    'demand_forecast', 'trend_prediction', 'price_optimization',
    'customer_preference', 'seasonal_analysis', 'sales_intelligence',
    'market_position', 'competitor_analysis', 'growth_opportunity'
  )),
  score numeric DEFAULT 0,
  confidence_level numeric,
  analysis_data jsonb DEFAULT '{}'::jsonb,
  factors jsonb DEFAULT '{}'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  predictions jsonb DEFAULT '{}'::jsonb,
  historical_trend jsonb DEFAULT '[]'::jsonb,
  model_version text,
  last_computed_at timestamptz,
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_brand_intelligence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_abintel_admin" ON ai_brand_intelligence;
CREATE POLICY "crud_abintel_admin" ON ai_brand_intelligence FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 12. Brand Analytics
CREATE TABLE brand_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  brand_id uuid NOT NULL REFERENCES private_label_brands(id),
  total_orders integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  total_units integer DEFAULT 0,
  avg_order_value numeric DEFAULT 0,
  new_customers integer DEFAULT 0,
  returning_customers integer DEFAULT 0,
  product_views integer DEFAULT 0,
  cart_adds integer DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  return_rate numeric DEFAULT 0,
  rating_avg numeric DEFAULT 0,
  reviews_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, brand_id)
);

ALTER TABLE brand_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_branalytics_admin" ON brand_analytics;
CREATE POLICY "crud_branalytics_admin" ON brand_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Add foreign key constraints after tables exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_plp_manufacturer' AND table_name = 'private_label_products'
  ) THEN
    ALTER TABLE private_label_products ADD CONSTRAINT fk_plp_manufacturer 
      FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id);
  END IF;
END $$;

-- 14. Indexes
CREATE INDEX IF NOT EXISTS idx_manufacturers_country ON manufacturers(country);
CREATE INDEX IF NOT EXISTS idx_manufacturers_type ON manufacturers(manufacturer_type);
CREATE INDEX IF NOT EXISTS idx_manufacturers_verify ON manufacturers(verification_status);

CREATE INDEX IF NOT EXISTS idx_factoryinsp_manufacturer ON factory_inspections(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_factoryinsp_date ON factory_inspections(inspection_date DESC);

CREATE INDEX IF NOT EXISTS idx_packaging_templ_cat ON packaging_templates(category);
CREATE INDEX IF NOT EXISTS idx_packaging_templ_active ON packaging_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_prodpkg_product ON product_packaging(product_id);

CREATE INDEX IF NOT EXISTS idx_qinsp_product ON quality_inspections(product_id);
CREATE INDEX IF NOT EXISTS idx_qinsp_status ON quality_inspections(inspection_status);
CREATE INDEX IF NOT EXISTS idx_qinsp_date ON quality_inspections(inspection_date DESC);

CREATE INDEX IF NOT EXISTS idx_batch_product ON product_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batch_status ON product_batches(batch_status);
CREATE INDEX IF NOT EXISTS idx_batch_recall ON product_batches(recall_status);

CREATE INDEX IF NOT EXISTS idx_brandcomp_brand ON brand_compliance(brand_id);
CREATE INDEX IF NOT EXISTS idx_brandcomp_country ON brand_compliance(country_code);

CREATE INDEX IF NOT EXISTS idx_prodcomp_product ON product_compliance(product_id);

CREATE INDEX IF NOT EXISTS idx_aibintel_brand ON ai_brand_intelligence(brand_id);
CREATE INDEX IF NOT EXISTS idx_aibintel_type ON ai_brand_intelligence(intelligence_type);

CREATE INDEX IF NOT EXISTS idx_branalytics_date ON brand_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_branalytics_brand ON brand_analytics(brand_id);

-- 15. Triggers
DROP TRIGGER IF EXISTS trg_manufacturers_updated ON manufacturers;
CREATE TRIGGER trg_manufacturers_updated BEFORE UPDATE ON manufacturers
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_factoryinsp_updated ON factory_inspections;
CREATE TRIGGER trg_factoryinsp_updated BEFORE UPDATE ON factory_inspections
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_packaging_templ_updated ON packaging_templates;
CREATE TRIGGER trg_packaging_templ_updated BEFORE UPDATE ON packaging_templates
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_qinsp_updated ON quality_inspections;
CREATE TRIGGER trg_qinsp_updated BEFORE UPDATE ON quality_inspections
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_batch_updated ON product_batches;
CREATE TRIGGER trg_batch_updated BEFORE UPDATE ON product_batches
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_aibintel_updated ON ai_brand_intelligence;
CREATE TRIGGER trg_aibintel_updated BEFORE UPDATE ON ai_brand_intelligence
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 16. Functions
CREATE OR REPLACE FUNCTION get_brand_dashboard(p_brand_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_products', COALESCE((SELECT COUNT(*) FROM private_label_products WHERE brand_id = p_brand_id AND is_active = true), 0),
    'active_products', COALESCE((SELECT COUNT(*) FROM private_label_products WHERE brand_id = p_brand_id AND production_status = 'launched'), 0),
    'total_revenue', COALESCE((SELECT total_revenue FROM private_label_brands WHERE id = p_brand_id), 0),
    'pending_quality_checks', COALESCE((SELECT COUNT(*) FROM quality_inspections qi
      JOIN private_label_products plp ON plp.id = qi.product_id
      WHERE plp.brand_id = p_brand_id AND qi.inspection_status IN ('scheduled', 'in_progress')), 0),
    'active_batches', COALESCE((SELECT COUNT(*) FROM product_batches pb
      JOIN private_label_products plp ON plp.id = pb.product_id
      WHERE plp.brand_id = p_brand_id AND pb.batch_status IN ('production', 'quality_check')), 0),
    'manufacturers', COALESCE((SELECT COUNT(DISTINCT manufacturer_id) FROM private_label_products WHERE brand_id = p_brand_id), 0),
    'compliance_status', COALESCE((SELECT COUNT(*) = 0 FROM brand_compliance 
      WHERE brand_id = p_brand_id AND status = 'non_compliant'), true)
  ) INTO v_stats;

  RETURN v_stats;
END;
$function$;

CREATE OR REPLACE FUNCTION generate_batch_code(p_product_id uuid)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_prefix text;
  v_counter integer;
  v_batch_code text;
BEGIN
  SELECT COALESCE(batch_code_prefix, 'BAT') INTO v_prefix
  FROM private_label_products WHERE id = p_product_id;

  SELECT COALESCE(MAX(batch_counter), 0) + 1 INTO v_counter
  FROM product_batches pb
  JOIN private_label_products plp ON plp.id = pb.product_id
  WHERE plp.id = p_product_id;

  v_batch_code := v_prefix || '-' || to_char(current_date, 'YYYYMMDD') || '-' || lpad(v_counter::text, 4, '0');

  RETURN v_batch_code;
END;
$function$;
