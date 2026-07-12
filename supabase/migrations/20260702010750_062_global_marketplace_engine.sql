-- ============================================================
-- Migration 062: Global Marketplace Core Engine
-- Phase 34 — Complete Marketplace Backbone
-- ============================================================

-- 1. Marketplace Categories (Scalable Enterprise Architecture)
CREATE TABLE marketplace_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  parent_id uuid REFERENCES marketplace_categories(id),
  level integer DEFAULT 0,
  icon text,
  description text,
 sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_categories_public" ON marketplace_categories FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "insert_categories_admin" ON marketplace_categories FOR INSERT
  TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "update_categories_admin" ON marketplace_categories FOR UPDATE
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 2. Sellers (All Seller Types)
CREATE TABLE sellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  seller_type text NOT NULL CHECK (seller_type IN (
    'individual', 'local_shop', 'distributor', 'brand', 'manufacturer',
    'importer', 'home_business', 'district_franchise', 'state_franchise',
    'international_supplier', 'affiliate_partner'
  )),
  business_name text NOT NULL,
  business_email text,
  business_phone text,
  business_address text,
  city text,
  state text,
  country text DEFAULT 'India',
  pincode text,
  gst_number text,
  pan_number text,
  bank_account_number text,
  bank_ifsc text,
  bank_name text,
  commission_rate numeric DEFAULT 10,
  rating numeric DEFAULT 0,
  total_sales integer DEFAULT 0,
  total_products integer DEFAULT 0,
  total_reviews integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_sellers_public" ON sellers FOR SELECT
  TO authenticated, anon USING (is_active = true AND is_verified = true);

CREATE POLICY "select_own_seller" ON sellers FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "insert_seller_user" ON sellers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_seller" ON sellers FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "update_seller_admin" ON sellers FOR UPDATE
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Brands
CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  description text,
  country_of_origin text,
  is_private_label boolean DEFAULT false,
  private_label_owner text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_brands_public" ON brands FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "crud_brands_admin" ON brands FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Extend Products with Marketplace Fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES sellers(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id uuid REFERENCES brands(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES marketplace_categories(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS mrp numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percent numeric DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_type text DEFAULT 'standard'
  CHECK (delivery_type IN ('standard', 'express', 'same_day', 'pickup', 'digital', 'hyper_local'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_months integer DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_text text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS weight_kg numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions_cm text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS country_of_origin text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS hsn_code text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tax_percent numeric DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_order_qty integer DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS max_order_qty integer DEFAULT 100;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type text DEFAULT 'physical'
  CHECK (product_type IN ('physical', 'digital', 'service', 'trading', 'affiliate'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public'
  CHECK (visibility IN ('public', 'private', 'unlisted', 'members_only'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft'
  CHECK (status IN ('draft', 'pending_review', 'active', 'inactive', 'rejected', 'archived'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS ai_tags text[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS ai_category_score numeric DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_trending boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 5. Product Images
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_product_images_public" ON product_images FOR SELECT
  TO authenticated, anon USING (true);

CREATE POLICY "crud_product_images_seller" ON product_images FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM products p JOIN sellers s ON p.seller_id = s.id
    WHERE p.id = product_images.product_id AND s.user_id = auth.uid()
  ));

-- 6. Product Specifications
CREATE TABLE product_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_name text NOT NULL,
  spec_value text NOT NULL,
  spec_group text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_specs_public" ON product_specifications FOR SELECT
  TO authenticated, anon USING (true);

CREATE POLICY "crud_specs_seller" ON product_specifications FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM products p JOIN sellers s ON p.seller_id = s.id
    WHERE p.id = product_specifications.product_id AND s.user_id = auth.uid()
  ));

-- 7. Product Inventory
CREATE TABLE product_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_location text,
  quantity_available integer DEFAULT 0,
  quantity_reserved integer DEFAULT 0,
  quantity_in_transit integer DEFAULT 0,
  reorder_level integer DEFAULT 10,
  reorder_quantity integer DEFAULT 50,
  last_restocked_at timestamptz,
  restock_lead_days integer DEFAULT 7,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, warehouse_location)
);

ALTER TABLE product_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_inventory_seller" ON product_inventory FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM products p JOIN sellers s ON p.seller_id = s.id
    WHERE p.id = product_inventory.product_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "crud_inventory_admin" ON product_inventory FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Trading Suppliers (International)
CREATE TABLE trading_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name text NOT NULL,
  supplier_type text NOT NULL CHECK (supplier_type IN (
    'india', 'dubai', 'china', 'usa', 'europe', 'southeast_asia', 'other'
  )),
  country text NOT NULL,
  city text,
  address text,
  contact_email text,
  contact_phone text,
  website text,
  gst_or_tax_id text,
  bank_details jsonb DEFAULT '{}'::jsonb,
  payment_terms text,
  moq integer DEFAULT 1,
  lead_time_days integer DEFAULT 30,
  currency text DEFAULT 'INR',
  rating numeric DEFAULT 0,
  total_orders integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trading_suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_trading_admin" ON trading_suppliers FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "crud_trading_admin" ON trading_suppliers FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Trading Orders
CREATE TABLE trading_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES trading_suppliers(id),
  product_id uuid REFERENCES products(id),
  order_type text CHECK (order_type IN ('import', 'export', 'wholesale', 'bulk', 'container')),
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  total_value numeric NOT NULL,
  currency text DEFAULT 'INR',
  exchange_rate numeric DEFAULT 1,
  payment_status text DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  delivery_status text DEFAULT 'pending'
    CHECK (delivery_status IN ('pending', 'processing', 'shipped', 'customs', 'delivered', 'cancelled')),
  estimated_delivery date,
  actual_delivery date,
  documents jsonb DEFAULT '{}'::jsonb,
  tracking_number text,
  notes text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trading_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_trading_orders_admin" ON trading_orders FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Affiliate Products
CREATE TABLE affiliate_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  external_platform text NOT NULL CHECK (external_platform IN (
    'amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'nykaa', 'other'
  )),
  external_product_id text,
  external_product_url text NOT NULL,
  affiliate_url text,
  commission_percent numeric DEFAULT 0,
  commission_type text DEFAULT 'percentage' CHECK (commission_type IN ('percentage', 'fixed')),
  fixed_commission numeric DEFAULT 0,
  smart_points_reward integer DEFAULT 0,
  price_at_sync numeric,
  last_synced_at timestamptz,
  sync_status text DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed', 'discontinued')),
  is_active boolean DEFAULT true,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  total_commission_earned numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_affiliate_public" ON affiliate_products FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "crud_affiliate_admin" ON affiliate_products FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. Home Cloud Stores
CREATE TABLE home_cloud_stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES sellers(id),
  store_name text NOT NULL,
  store_slug text NOT NULL UNIQUE,
  store_description text,
  store_image_url text,
  address text NOT NULL,
  city text NOT NULL,
  state text,
  pincode text,
  latitude numeric,
  longitude numeric,
  delivery_radius_km integer DEFAULT 5,
  delivery_hours jsonb DEFAULT '{"start": "09:00", "end": "21:00"}'::jsonb,
  delivery_days text[] DEFAULT ARRAY['mon','tue','wed','thu','fri','sat','sun'],
  min_order_value numeric DEFAULT 0,
  delivery_fee numeric DEFAULT 0,
  free_delivery_above numeric DEFAULT 0,
  is_micro_inventory boolean DEFAULT true,
  max_products integer DEFAULT 50,
  total_products integer DEFAULT 0,
  rating numeric DEFAULT 0,
  total_orders integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE home_cloud_stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_home_cloud_public" ON home_cloud_stores FOR SELECT
  TO authenticated, anon USING (is_active = true AND is_verified = true);

CREATE POLICY "select_own_home_cloud" ON home_cloud_stores FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers s WHERE s.id = home_cloud_stores.seller_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "crud_home_cloud_seller" ON home_cloud_stores FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers s WHERE s.id = home_cloud_stores.seller_id AND s.user_id = auth.uid()
  ));

-- 12. Private Label Brands
CREATE TABLE private_label_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL,
  brand_slug text NOT NULL UNIQUE,
  brand_category text NOT NULL CHECK (brand_category IN (
    'essentials', 'aura', 'apparel', 'home', 'organic', 'kitchen',
    'health', 'kids', 'electronics', 'beauty', 'sports', 'future'
  )),
  tagline text,
  description text,
  logo_url text,
  brand_color text,
  target_audience text,
  price_positioning text CHECK (price_positioning IN ('budget', 'mid_range', 'premium', 'luxury')),
  launch_status text DEFAULT 'planned' CHECK (launch_status IN ('planned', 'in_development', 'soft_launch', 'launched', 'discontinued')),
  launch_date date,
  total_products integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  is_active boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE private_label_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_private_label_admin" ON private_label_brands FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true AND role IN ('super_admin', 'admin')
  ));

-- 13. Marketplace Analytics
CREATE TABLE marketplace_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  metric_type text NOT NULL,
  metric_key text NOT NULL,
  metric_value numeric NOT NULL,
  dimension_type text,
  dimension_value text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(date, metric_type, metric_key, dimension_type, dimension_value)
);

ALTER TABLE marketplace_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_analytics_admin" ON marketplace_analytics FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "crud_analytics_admin" ON marketplace_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 14. AI Recommendation Queue
CREATE TABLE ai_recommendation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  recommendation_type text NOT NULL CHECK (recommendation_type IN (
    'home', 'category', 'product_detail', 'search', 'cart', 'checkout', 'weekly'
  )),
  context_data jsonb DEFAULT '{}'::jsonb,
  recommended_products jsonb DEFAULT '[]'::jsonb,
  recommendation_score numeric DEFAULT 0,
  factors jsonb DEFAULT '{}'::jsonb,
  is_processed boolean DEFAULT false,
  processed_at timestamptz,
  is_served boolean DEFAULT false,
  served_at timestamptz,
  served_context text,
  click_through boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_recommendation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_recommendations" ON ai_recommendation_queue FOR SELECT
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "crud_recommendations_admin" ON ai_recommendation_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 15. Extend Orders with Marketplace Fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id uuid REFERENCES sellers(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number text UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_city text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_state text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_pincode text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_type text DEFAULT 'standard';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_date date;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_slot text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'cod'
  CHECK (payment_method IN ('cod', 'prepaid', 'upi', 'card', 'wallet', 'net_banking'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending'
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial_refund'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_transaction_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_url text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refunded_amount numeric DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_earnings numeric DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS platform_fee numeric DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee numeric DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_affiliate_order boolean DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_commission numeric DEFAULT 0;

-- 16. Indexes
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_visibility ON products(visibility);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON products(category_id, status);
CREATE INDEX IF NOT EXISTS idx_products_ai_tags ON products USING GIN(ai_tags);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);

CREATE INDEX IF NOT EXISTS idx_sellers_type ON sellers(seller_type);
CREATE INDEX IF NOT EXISTS idx_sellers_user ON sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_verified ON sellers(is_verified);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON marketplace_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON marketplace_categories(slug);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specs_product ON product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_inventory_product ON product_inventory(product_id);

CREATE INDEX IF NOT EXISTS idx_trading_suppliers_type ON trading_suppliers(supplier_type);
CREATE INDEX IF NOT EXISTS idx_trading_orders_supplier ON trading_orders(supplier_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_platform ON affiliate_products(external_platform);
CREATE INDEX IF NOT EXISTS idx_home_cloud_location ON home_cloud_stores(city, state);
CREATE INDEX IF NOT EXISTS idx_private_label_status ON private_label_brands(launch_status);

CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_date ON marketplace_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_type ON marketplace_analytics(metric_type);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user ON ai_recommendation_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_processed ON ai_recommendation_queue(is_processed);

-- 17. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_marketplace_categories_updated ON marketplace_categories;
CREATE TRIGGER trg_marketplace_categories_updated BEFORE UPDATE ON marketplace_categories FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_sellers_updated ON sellers;
CREATE TRIGGER trg_sellers_updated BEFORE UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_brands_updated ON brands;
CREATE TRIGGER trg_brands_updated BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_product_inventory_updated ON product_inventory;
CREATE TRIGGER trg_product_inventory_updated BEFORE UPDATE ON product_inventory FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_trading_suppliers_updated ON trading_suppliers;
CREATE TRIGGER trg_trading_suppliers_updated BEFORE UPDATE ON trading_suppliers FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_trading_orders_updated ON trading_orders;
CREATE TRIGGER trg_trading_orders_updated BEFORE UPDATE ON trading_orders FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_affiliate_products_updated ON affiliate_products;
CREATE TRIGGER trg_affiliate_products_updated BEFORE UPDATE ON affiliate_products FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_home_cloud_stores_updated ON home_cloud_stores;
CREATE TRIGGER trg_home_cloud_stores_updated BEFORE UPDATE ON home_cloud_stores FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_private_label_brands_updated ON private_label_brands;
CREATE TRIGGER trg_private_label_brands_updated BEFORE UPDATE ON private_label_brands FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 18. Order number generation function
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_number text;
begin
  v_number := 'VLP' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('order_number_seq')::text, 6, '0');
  RETURN v_number;
END;
$function$;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Trigger to auto-generate order number
DROP TRIGGER IF EXISTS trg_orders_number ON orders;
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'VLP' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('order_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER trg_orders_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION set_order_number();
