-- ============================================================
-- Migration 063: Marketplace Foundation
-- Phase 34.1 — Global AI Marketplace Foundation
-- Enterprise Architecture for Unlimited Scale
-- ============================================================

-- 1. Countries (Global Commerce Ready)
CREATE TABLE countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iso_code text NOT NULL UNIQUE,
  name text NOT NULL,
  dial_code text,
  currency_code text DEFAULT 'INR',
  language_code text DEFAULT 'en',
  is_active boolean DEFAULT true,
  supports_marketplace boolean DEFAULT false,
  supports_trading boolean DEFAULT false,
  supports_affiliate boolean DEFAULT false,
  tax_config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_countries_public" ON countries FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "crud_countries_admin" ON countries FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 2. Currencies (Unlimited Currencies)
CREATE TABLE currencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  symbol text NOT NULL,
  symbol_position text DEFAULT 'left' CHECK (symbol_position IN ('left', 'right')),
  decimal_places integer DEFAULT 2,
  exchange_rate_to_inr numeric DEFAULT 1,
  is_active boolean DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_currencies_public" ON currencies FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "crud_currencies_admin" ON currencies FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Languages (Unlimited Languages)
CREATE TABLE languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  native_name text,
  rtl boolean DEFAULT false,
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_languages_public" ON languages FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "crud_languages_admin" ON languages FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Warehouses (Unlimited Warehouses)
CREATE TABLE warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_code text NOT NULL UNIQUE,
  warehouse_name text NOT NULL,
  warehouse_type text DEFAULT 'fulfillment' CHECK (warehouse_type IN (
    'fulfillment', 'distribution', 'sorting', 'cross_dock', 'cold_storage', 'home_cloud'
  )),
  address text NOT NULL,
  city text NOT NULL,
  state text,
  country text DEFAULT 'India',
  pincode text,
  latitude numeric,
  longitude numeric,
  contact_email text,
  contact_phone text,
  capacity_cubic_meters numeric,
  current_utilization_percent numeric DEFAULT 0,
  supports_express boolean DEFAULT false,
  supports_same_day boolean DEFAULT false,
  supports_cold_chain boolean DEFAULT false,
  is_active boolean DEFAULT true,
  operational_hours jsonb DEFAULT '{"start": "08:00", "end": "22:00"}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_warehouses_admin" ON warehouses FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "crud_warehouses_admin" ON warehouses FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Product Sources (Every product belongs to one source)
CREATE TABLE product_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_code text NOT NULL UNIQUE,
  source_name text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN (
    'vloop_brand', 'partner_product', 'local_shop', 'home_cloud_store',
    'affiliate_product', 'global_supplier', 'distributor', 'manufacturer',
    'private_label', 'import', 'future_vcos'
  )),
  parent_source_id uuid REFERENCES product_sources(id),
  country_id uuid REFERENCES countries(id),
  contact_email text,
  contact_phone text,
  commission_rate numeric DEFAULT 0,
  payment_terms text,
  lead_time_days integer DEFAULT 7,
  quality_score numeric DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE product_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_sources_admin" ON product_sources FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "crud_sources_admin" ON product_sources FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. Add source to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS source_id uuid REFERENCES product_sources(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS warehouse_id uuid REFERENCES warehouses(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS country_of_supply uuid REFERENCES countries(id);

-- 7. Product Media (Videos, Documents, 3D Models)
CREATE TABLE product_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  media_type text NOT NULL CHECK (media_type IN (
    'image', 'video', 'document', '3d_model', 'ar_model', 'manual', 'certificate'
  )),
  media_url text NOT NULL,
  thumbnail_url text,
  alt_text text,
  title text,
  description text,
  file_size_bytes integer,
  duration_seconds integer,
  sort_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_product_media_public" ON product_media FOR SELECT
  TO authenticated, anon USING (true);

CREATE POLICY "crud_product_media_seller" ON product_media FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM products p JOIN sellers s ON p.seller_id = s.id
    WHERE p.id = product_media.product_id AND s.user_id = auth.uid()
  ));

-- 8. Inventory Transactions
CREATE TABLE inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  warehouse_id uuid REFERENCES warehouses(id),
  transaction_type text NOT NULL CHECK (transaction_type IN (
    'purchase', 'sale', 'return', 'adjustment', 'transfer_in', 'transfer_out',
    'damage', 'restock', 'reservation', 'release', 'count_adjustment'
  )),
  quantity_change integer NOT NULL,
  quantity_before integer NOT NULL,
  quantity_after integer NOT NULL,
  reference_type text,
  reference_id uuid,
  unit_cost numeric,
  notes text,
  performed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_inventory_admin" ON inventory_transactions FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "insert_inventory_admin" ON inventory_transactions FOR INSERT
  TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Pricing Rules
CREATE TABLE pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text NOT NULL,
  rule_type text NOT NULL CHECK (rule_type IN (
    'markup', 'markdown', 'discount', 'surcharge', 'bulk_pricing',
    'time_based', 'customer_tier', 'location_based', 'seasonal', 'flash_sale'
  )),
  product_id uuid REFERENCES products(id),
  category_id uuid REFERENCES marketplace_categories(id),
  seller_id uuid REFERENCES sellers(id),
  value_type text DEFAULT 'percentage' CHECK (value_type IN ('percentage', 'fixed')),
  value numeric NOT NULL,
  min_quantity integer DEFAULT 1,
  max_quantity integer,
  start_date timestamptz,
  end_date timestamptz,
  priority integer DEFAULT 0,
  is_stackable boolean DEFAULT false,
  is_active boolean DEFAULT true,
  conditions jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_pricing_admin" ON pricing_rules FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "crud_pricing_admin" ON pricing_rules FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. AI Marketplace Preparation Tables

-- AI Model Registry
CREATE TABLE ai_model_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name text NOT NULL,
  model_type text NOT NULL CHECK (model_type IN (
    'demand_prediction', 'product_recommendation', 'inventory_forecast',
    'price_intelligence', 'trend_analysis', 'customer_segmentation',
    'fraud_detection', 'review_sentiment', 'image_classification'
  )),
  model_version text NOT NULL,
  model_endpoint text,
  model_config jsonb DEFAULT '{}'::jsonb,
  training_data_config jsonb DEFAULT '{}'::jsonb,
  accuracy_score numeric,
  last_trained_at timestamptz,
  is_active boolean DEFAULT false,
  is_production boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_model_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_ai_models_admin" ON ai_model_registry FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- AI Training Queue
CREATE TABLE ai_training_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid REFERENCES ai_model_registry(id),
  training_type text NOT NULL CHECK (training_type IN ('initial', 'incremental', 'retrain', 'fine_tune')),
  data_range_start timestamptz,
  data_range_end timestamptz,
  sample_size integer,
  parameters jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  metrics jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_training_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_ai_training_admin" ON ai_training_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- AI Prediction Cache
CREATE TABLE ai_prediction_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  user_id uuid REFERENCES profiles(id),
  predictions jsonb NOT NULL,
  confidence_score numeric,
  model_version text,
  expires_at timestamptz,
  served_count integer DEFAULT 0,
  click_through boolean DEFAULT false,
  conversion boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_prediction_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_predictions" ON ai_prediction_cache FOR SELECT
  TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "crud_predictions_admin" ON ai_prediction_cache FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- AI Insights Archive
CREATE TABLE ai_insights_archive (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type text NOT NULL,
  insight_date date NOT NULL,
  insight_data jsonb NOT NULL,
  impact_score numeric,
  action_taken text,
  action_result text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(insight_type, insight_date)
);

ALTER TABLE ai_insights_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_insights_admin" ON ai_insights_archive FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. Future VCOS Projects Registry
CREATE TABLE vcos_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code text NOT NULL UNIQUE,
  project_name text NOT NULL,
  project_category text NOT NULL CHECK (project_category IN (
    'logistics', 'delivery', 'warehousing', 'last_mile', 'drone_delivery',
    'autonomous_vehicle', 'smart_inventory', 'sustainability', 'ai_automation',
    'blockchain', 'iot', 'ar_vr', 'voice_commerce', 'social_commerce'
  )),
  description text,
  projected_launch date,
  status text DEFAULT 'planned' CHECK (status IN ('planned', 'in_development', 'pilot', 'launched', 'paused', 'cancelled')),
  priority integer DEFAULT 0,
  budget_allocated numeric DEFAULT 0,
  estimated_impact text,
  dependencies text[],
  is_public boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vcos_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_vcos_public" ON vcos_projects FOR SELECT
  TO authenticated, anon USING (is_public = true);

CREATE POLICY "crud_vcos_admin" ON vcos_projects FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 12. Global Commerce Configuration
CREATE TABLE global_commerce_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key text NOT NULL UNIQUE,
  config_value jsonb NOT NULL,
  config_type text DEFAULT 'general' CHECK (config_type IN (
    'general', 'shipping', 'tax', 'payment', 'localization', 'compliance', 'ai'
  )),
  country_code text,
  is_active boolean DEFAULT true,
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE global_commerce_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_config_public" ON global_commerce_config FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "crud_config_admin" ON global_commerce_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Indexes
CREATE INDEX IF NOT EXISTS idx_products_source ON products(source_id);
CREATE INDEX IF NOT EXISTS idx_products_warehouse ON products(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_products_country_supply ON products(country_of_supply);

CREATE INDEX IF NOT EXISTS idx_countries_iso ON countries(iso_code);
CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(code);
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);

CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(warehouse_code);
CREATE INDEX IF NOT EXISTS idx_warehouses_type ON warehouses(warehouse_type);
CREATE INDEX IF NOT EXISTS idx_warehouses_location ON warehouses(city, state);

CREATE INDEX IF NOT EXISTS idx_product_sources_type ON product_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_product_sources_code ON product_sources(source_code);

CREATE INDEX IF NOT EXISTS idx_product_media_product ON product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_type ON product_media(media_type);

CREATE INDEX IF NOT EXISTS idx_inventory_trans_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_trans_type ON inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_trans_date ON inventory_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pricing_rules_type ON pricing_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_product ON pricing_rules(product_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_dates ON pricing_rules(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_ai_models_type ON ai_model_registry(model_type);
CREATE INDEX IF NOT EXISTS idx_ai_training_status ON ai_training_queue(status);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_type ON ai_prediction_cache(prediction_type);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_expires ON ai_prediction_cache(expires_at);

CREATE INDEX IF NOT EXISTS idx_vcos_status ON vcos_projects(status);
CREATE INDEX IF NOT EXISTS idx_vcos_category ON vcos_projects(project_category);

CREATE INDEX IF NOT EXISTS idx_commerce_config_key ON global_commerce_config(config_key);

-- 14. Triggers for updated_at
DROP TRIGGER IF EXISTS trg_warehouses_updated ON warehouses;
CREATE TRIGGER trg_warehouses_updated BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_product_sources_updated ON product_sources;
CREATE TRIGGER trg_product_sources_updated BEFORE UPDATE ON product_sources FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_pricing_rules_updated ON pricing_rules;
CREATE TRIGGER trg_pricing_rules_updated BEFORE UPDATE ON pricing_rules FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_ai_models_updated ON ai_model_registry;
CREATE TRIGGER trg_ai_models_updated BEFORE UPDATE ON ai_model_registry FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_vcos_updated ON vcos_projects;
CREATE TRIGGER trg_vcos_updated BEFORE UPDATE ON vcos_projects FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_commerce_config_updated ON global_commerce_config;
CREATE TRIGGER trg_commerce_config_updated BEFORE UPDATE ON global_commerce_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 15. Views for Analytics

-- Marketplace Overview View
CREATE OR REPLACE VIEW marketplace_overview AS
SELECT
  (SELECT COUNT(*) FROM products WHERE status = 'active') as active_products,
  (SELECT COUNT(*) FROM sellers WHERE is_active = true AND is_verified = true) as verified_sellers,
  (SELECT COUNT(*) FROM marketplace_categories WHERE is_active = true) as total_categories,
  (SELECT COUNT(*) FROM brands WHERE is_active = true) as total_brands,
  (SELECT COUNT(*) FROM warehouses WHERE is_active = true) as total_warehouses,
  (SELECT COUNT(*) FROM countries WHERE is_active = true) as supported_countries,
  (SELECT COUNT(*) FROM vcos_projects WHERE status IN ('planned', 'in_development', 'pilot')) as upcoming_vcos_projects;

-- AI Readiness View
CREATE OR REPLACE VIEW ai_readiness AS
SELECT
  (SELECT COUNT(*) FROM ai_model_registry WHERE is_active = true) as active_models,
  (SELECT COUNT(*) FROM ai_model_registry WHERE is_production = true) as production_models,
  (SELECT COUNT(*) FROM ai_training_queue WHERE status = 'pending') as pending_training,
  (SELECT COUNT(*) FROM ai_prediction_cache WHERE expires_at > now()) as active_predictions,
  (SELECT COUNT(*) FROM ai_insights_archive) as archived_insights;
