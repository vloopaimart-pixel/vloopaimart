-- ============================================================
-- Migration 065: Global Logistics & Fulfillment Engine
-- Phase 36 — Complete Logistics Architecture
-- ============================================================

-- 1. Delivery Zones
CREATE TABLE delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_code text NOT NULL UNIQUE,
  zone_name text NOT NULL,
  zone_type text NOT NULL CHECK (zone_type IN (
    'country', 'state', 'district', 'city', 'pincode', 'custom'
  )),
  country text NOT NULL,
  state text,
  district text,
  city text,
  pincodes text[],
  bounds jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_zones_public" ON delivery_zones FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "crud_zones_admin" ON delivery_zones FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 2. Delivery Models
CREATE TABLE delivery_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_code text NOT NULL UNIQUE,
  model_name text NOT NULL,
  model_type text NOT NULL CHECK (model_type IN (
    'store_pickup', 'local_shop_delivery', 'home_cloud_delivery',
    'warehouse_delivery', 'courier_delivery', 'international_shipping',
    'same_day_express', 'hyper_local', 'drone_delivery', 'future_service'
  )),
  description text,
  min_delivery_hours integer DEFAULT 24,
  max_delivery_hours integer DEFAULT 168,
  is_same_day boolean DEFAULT false,
  is_express boolean DEFAULT false,
  is_international boolean DEFAULT false,
  requires_address boolean DEFAULT true,
  supports_tracking boolean DEFAULT true,
  supports_cod boolean DEFAULT true,
  supports_returns boolean DEFAULT true,
  base_charge numeric DEFAULT 0,
  per_km_charge numeric DEFAULT 0,
  weight_charge_per_kg numeric DEFAULT 0,
  cod_charge numeric DEFAULT 0,
  min_order_value numeric DEFAULT 0,
  free_delivery_above numeric DEFAULT 0,
  max_weight_kg numeric,
  max_dimensions_cm text,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_models_public" ON delivery_models FOR SELECT
  TO authenticated, anon USING (is_active = true);

CREATE POLICY "crud_models_admin" ON delivery_models FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Extend Warehouses with logistics fields
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS warehouse_level text DEFAULT 'city'
  CHECK (warehouse_level IN ('country', 'state', 'district', 'city', 'micro', 'home_cloud'));
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS service_radius_km numeric DEFAULT 50;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS supports_pickup boolean DEFAULT true;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS supports_delivery boolean DEFAULT true;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS daily_capacity integer DEFAULT 1000;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS current_queue integer DEFAULT 0;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS processing_time_hours integer DEFAULT 4;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS zone_id uuid REFERENCES delivery_zones(id);

-- 4. Order Delivery Details
CREATE TABLE order_delivery_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  delivery_model_id uuid REFERENCES delivery_models(id),
  warehouse_id uuid REFERENCES warehouses(id),
  seller_id uuid REFERENCES sellers(id),
  home_cloud_store_id uuid REFERENCES home_cloud_store_profiles(id),
  delivery_zone_id uuid REFERENCES delivery_zones(id),
  pickup_address text,
  pickup_city text,
  pickup_state text,
  pickup_pincode text,
  pickup_latitude numeric,
  pickup_longitude numeric,
  delivery_address text,
  delivery_city text,
  delivery_state text,
  delivery_pincode text,
  delivery_latitude numeric,
  delivery_longitude numeric,
  delivery_instructions text,
  delivery_contact_name text,
  delivery_contact_phone text,
  delivery_status text DEFAULT 'order_received'
    CHECK (delivery_status IN (
      'order_received', 'confirmed', 'processing', 'packed', 'ready',
      'assigned', 'picked_up', 'in_transit', 'out_for_delivery',
      'delivered', 'cancelled', 'returned', 'refunded', 'failed'
    )),
  status_history jsonb DEFAULT '[]'::jsonb,
  estimated_pickup_at timestamptz,
  actual_pickup_at timestamptz,
  estimated_delivery_at timestamptz,
  actual_delivery_at timestamptz,
  delivery_attempts integer DEFAULT 0,
  delivery_partner_type text CHECK (delivery_partner_type IN (
    'own_delivery', 'partner_delivery', 'courier', 'third_party_logistics', 'drone'
  )),
  delivery_partner_id uuid,
  delivery_partner_name text,
  tracking_number text,
  tracking_url text,
  delivery_distance_km numeric,
  delivery_charges numeric DEFAULT 0,
  cod_charges numeric DEFAULT 0,
  packaging_charges numeric DEFAULT 0,
  total_delivery_cost numeric DEFAULT 0,
  delivery_rating integer,
  delivery_rating_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE order_delivery_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_delivery" ON order_delivery_details FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_delivery_details.order_id AND orders.user_id = auth.uid()
  ));

CREATE POLICY "select_seller_delivery" ON order_delivery_details FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = order_delivery_details.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "crud_delivery_admin" ON order_delivery_details FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Delivery Partners
CREATE TABLE delivery_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_code text NOT NULL UNIQUE,
  partner_name text NOT NULL,
  partner_type text NOT NULL CHECK (partner_type IN (
    'own_fleet', 'local_partner', 'courier_company', 'third_party_logistics',
    'drone_service', 'hyper_local', 'international_courier'
  )),
  country text DEFAULT 'India',
  contact_email text,
  contact_phone text,
  api_endpoint text,
  api_key_encrypted text,
  webhook_url text,
  supported_models text[] DEFAULT ARRAY['warehouse_delivery', 'courier_delivery'],
  supported_zones text[],
  tracking_support boolean DEFAULT true,
  cod_support boolean DEFAULT true,
  returns_support boolean DEFAULT true,
  insurance_support boolean DEFAULT false,
  base_charge numeric DEFAULT 0,
  per_kg_charge numeric DEFAULT 0,
  per_km_charge numeric DEFAULT 0,
  min_charge numeric DEFAULT 0,
  max_weight_kg numeric,
  max_dimensions_cm text,
  rating numeric DEFAULT 0,
  total_deliveries integer DEFAULT 0,
  on_time_rate numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  contract_start date,
  contract_end date,
  contract_terms jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_partners_admin" ON delivery_partners FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "crud_partners_admin" ON delivery_partners FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. AI Order Allocation Queue
CREATE TABLE ai_order_allocation_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  allocation_type text NOT NULL CHECK (allocation_type IN (
    'nearest_warehouse', 'nearest_shop', 'nearest_home_cloud',
    'fastest_route', 'lowest_cost', 'highest_rating', 'ai_optimized'
  )),
  allocation_criteria jsonb DEFAULT '{}'::jsonb,
  candidate_sources jsonb DEFAULT '[]'::jsonb,
  selected_source_id uuid,
  selected_source_type text CHECK (selected_source_type IN ('warehouse', 'seller', 'home_cloud')),
  selected_warehouse_id uuid REFERENCES warehouses(id),
  selected_seller_id uuid REFERENCES sellers(id),
  selected_home_cloud_id uuid REFERENCES home_cloud_store_profiles(id),
  selection_score numeric,
  selection_factors jsonb DEFAULT '{}'::jsonb,
  estimated_pickup_time timestamptz,
  estimated_delivery_time timestamptz,
  estimated_cost numeric,
  optimization_score numeric DEFAULT 0,
  is_processed boolean DEFAULT false,
  processed_at timestamptz,
  is_assigned boolean DEFAULT false,
  assigned_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_order_allocation_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_allocation_admin" ON ai_order_allocation_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. Delivery Status Timeline
CREATE TABLE delivery_status_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_delivery_id uuid NOT NULL REFERENCES order_delivery_details(id) ON DELETE CASCADE,
  status text NOT NULL,
  previous_status text,
  status_description text,
  location text,
  latitude numeric,
  longitude numeric,
  notes text,
  images text[],
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_status_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_timeline_own" ON delivery_status_timeline FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM order_delivery_details odd
    JOIN orders o ON o.id = odd.order_id
    WHERE odd.id = delivery_status_timeline.order_delivery_id AND o.user_id = auth.uid()
  ));

CREATE POLICY "crud_timeline_admin" ON delivery_status_timeline FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Inventory Sync Queue
CREATE TABLE inventory_sync_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type text NOT NULL CHECK (sync_type IN (
    'warehouse_stock', 'seller_stock', 'partner_stock', 'home_cloud_inventory', 'full_sync'
  )),
  product_id uuid REFERENCES products(id),
  warehouse_id uuid REFERENCES warehouses(id),
  seller_id uuid REFERENCES sellers(id),
  home_cloud_store_id uuid REFERENCES home_cloud_store_profiles(id),
  quantity_before integer,
  quantity_after integer,
  sync_reason text,
  sync_status text DEFAULT 'pending' CHECK (sync_status IN ('pending', 'processing', 'synced', 'failed')),
  sync_started_at timestamptz,
  sync_completed_at timestamptz,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_sync_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_sync_admin" ON inventory_sync_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Inventory Locations
CREATE TABLE inventory_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  location_type text NOT NULL CHECK (location_type IN (
    'warehouse', 'seller', 'home_cloud_store', 'partner', 'transit'
  )),
  warehouse_id uuid REFERENCES warehouses(id),
  seller_id uuid REFERENCES sellers(id),
  home_cloud_store_id uuid REFERENCES home_cloud_store_profiles(id),
  quantity_available integer DEFAULT 0,
  quantity_reserved integer DEFAULT 0,
  quantity_in_transit integer DEFAULT 0,
  quantity_damaged integer DEFAULT 0,
  last_stock_check_at timestamptz,
  next_sync_at timestamptz,
  sync_status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_locations_admin" ON inventory_locations FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "crud_locations_admin" ON inventory_locations FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. AI Logistics Intelligence
CREATE TABLE ai_logistics_intelligence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intelligence_type text NOT NULL CHECK (intelligence_type IN (
    'demand_forecast', 'stock_prediction', 'delivery_optimization',
    'route_optimization', 'traffic_analysis', 'warehouse_recommendation',
    'cost_optimization', 'capacity_planning'
  )),
  entity_type text NOT NULL,
  entity_id uuid,
  prediction_data jsonb NOT NULL,
  confidence_score numeric,
  model_version text,
  factors jsonb DEFAULT '{}'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  valid_from timestamptz,
  valid_to timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_logistics_intelligence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_intelligence_admin" ON ai_logistics_intelligence FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. Delivery Routes
CREATE TABLE delivery_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_code text NOT NULL UNIQUE,
  route_name text,
  delivery_partner_id uuid REFERENCES delivery_partners(id),
  warehouse_id uuid REFERENCES warehouses(id),
  delivery_date date NOT NULL,
  route_sequence jsonb DEFAULT '[]'::jsonb,
  total_stops integer DEFAULT 0,
  total_distance_km numeric DEFAULT 0,
  estimated_duration_minutes integer DEFAULT 0,
  actual_duration_minutes integer,
  started_at timestamptz,
  completed_at timestamptz,
  route_status text DEFAULT 'planned' CHECK (route_status IN (
    'planned', 'in_progress', 'completed', 'cancelled'
  )),
  optimization_score numeric,
  driver_name text,
  driver_phone text,
  vehicle_number text,
  vehicle_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_routes_admin" ON delivery_routes FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 12. Route Stops
CREATE TABLE route_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid NOT NULL REFERENCES delivery_routes(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id),
  delivery_detail_id uuid REFERENCES order_delivery_details(id),
  stop_sequence integer NOT NULL,
  stop_type text DEFAULT 'delivery' CHECK (stop_type IN ('pickup', 'delivery', 'return')),
  address text,
  city text,
  pincode text,
  latitude numeric,
  longitude numeric,
  contact_name text,
  contact_phone text,
  estimated_arrival timestamptz,
  actual_arrival timestamptz,
  estimated_departure timestamptz,
  actual_departure timestamptz,
  stop_status text DEFAULT 'pending' CHECK (stop_status IN (
    'pending', 'arrived', 'completed', 'failed', 'skipped'
  )),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_stops_admin" ON route_stops FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Logistics Analytics
CREATE TABLE logistics_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  warehouse_id uuid REFERENCES warehouses(id),
  zone_id uuid REFERENCES delivery_zones(id),
  delivery_model_id uuid REFERENCES delivery_models(id),
  delivery_partner_id uuid REFERENCES delivery_partners(id),
  total_orders integer DEFAULT 0,
  delivered_orders integer DEFAULT 0,
  cancelled_orders integer DEFAULT 0,
  returned_orders integer DEFAULT 0,
  on_time_deliveries integer DEFAULT 0,
  delayed_deliveries integer DEFAULT 0,
  avg_delivery_time_hours numeric DEFAULT 0,
  avg_delivery_cost numeric DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  on_time_rate numeric DEFAULT 0,
  cancellation_rate numeric DEFAULT 0,
  return_rate numeric DEFAULT 0,
  customer_rating_avg numeric DEFAULT 0,
  unique_customers integer DEFAULT 0,
  unique_zones integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE logistics_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crud_analytics_admin" ON logistics_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 14. Indexes
CREATE INDEX IF NOT EXISTS idx_delivery_zones_type ON delivery_zones(zone_type);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_country ON delivery_zones(country);

CREATE INDEX IF NOT EXISTS idx_delivery_models_type ON delivery_models(model_type);
CREATE INDEX IF NOT EXISTS idx_delivery_models_active ON delivery_models(is_active);

CREATE INDEX IF NOT EXISTS idx_warehouses_level ON warehouses(warehouse_level);
CREATE INDEX IF NOT EXISTS idx_warehouses_zone ON warehouses(zone_id);

CREATE INDEX IF NOT EXISTS idx_order_delivery_order ON order_delivery_details(order_id);
CREATE INDEX IF NOT EXISTS idx_order_delivery_status ON order_delivery_details(delivery_status);
CREATE INDEX IF NOT EXISTS idx_order_delivery_warehouse ON order_delivery_details(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_order_delivery_seller ON order_delivery_details(seller_id);
CREATE INDEX IF NOT EXISTS idx_order_delivery_pincode ON order_delivery_details(delivery_pincode);

CREATE INDEX IF NOT EXISTS idx_delivery_partners_type ON delivery_partners(partner_type);

CREATE INDEX IF NOT EXISTS idx_allocation_queue_order ON ai_order_allocation_queue(order_id);
CREATE INDEX IF NOT EXISTS idx_allocation_queue_processed ON ai_order_allocation_queue(is_processed);

CREATE INDEX IF NOT EXISTS idx_status_timeline_delivery ON delivery_status_timeline(order_delivery_id);
CREATE INDEX IF NOT EXISTS idx_status_timeline_date ON delivery_status_timeline(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_sync_status ON inventory_sync_queue(sync_status);
CREATE INDEX IF NOT EXISTS idx_inventory_sync_product ON inventory_sync_queue(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_locations_product ON inventory_locations(product_id);

CREATE INDEX IF NOT EXISTS idx_logistics_intelligence_type ON ai_logistics_intelligence(intelligence_type);

CREATE INDEX IF NOT EXISTS idx_delivery_routes_date ON delivery_routes(delivery_date);
CREATE INDEX IF NOT EXISTS idx_delivery_routes_status ON delivery_routes(route_status);

CREATE INDEX IF NOT EXISTS idx_route_stops_route ON route_stops(route_id);

CREATE INDEX IF NOT EXISTS idx_logistics_analytics_date ON logistics_analytics(date DESC);

-- 15. Triggers
DROP TRIGGER IF EXISTS trg_delivery_zones_updated ON delivery_zones;
CREATE TRIGGER trg_delivery_zones_updated BEFORE UPDATE ON delivery_zones
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_delivery_models_updated ON delivery_models;
CREATE TRIGGER trg_delivery_models_updated BEFORE UPDATE ON delivery_models
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_order_delivery_updated ON order_delivery_details;
CREATE TRIGGER trg_order_delivery_updated BEFORE UPDATE ON order_delivery_details
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_delivery_partners_updated ON delivery_partners;
CREATE TRIGGER trg_delivery_partners_updated BEFORE UPDATE ON delivery_partners
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_inventory_locations_updated ON inventory_locations;
CREATE TRIGGER trg_inventory_locations_updated BEFORE UPDATE ON inventory_locations
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_delivery_routes_updated ON delivery_routes;
CREATE TRIGGER trg_delivery_routes_updated BEFORE UPDATE ON delivery_routes
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_ai_logistics_updated ON ai_logistics_intelligence;
CREATE TRIGGER trg_ai_logistics_updated BEFORE UPDATE ON ai_logistics_intelligence
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 16. Functions
CREATE OR REPLACE FUNCTION update_delivery_status(
  p_delivery_id uuid,
  p_new_status text,
  p_location text DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_updated_by uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
  v_old_status text;
  v_status_entry jsonb;
BEGIN
  SELECT delivery_status INTO v_old_status
  FROM order_delivery_details WHERE id = p_delivery_id;

  v_status_entry := jsonb_build_object(
    'status', v_old_status,
    'timestamp', now(),
    'location', p_location,
    'notes', p_notes
  );

  UPDATE order_delivery_details
  SET
    delivery_status = p_new_status,
    status_history = status_history || v_status_entry,
    updated_at = now()
  WHERE id = p_delivery_id;

  INSERT INTO delivery_status_timeline (
    order_delivery_id, status, previous_status, status_description,
    location, notes, updated_by
  ) VALUES (
    p_delivery_id, p_new_status, v_old_status,
    COALESCE(p_notes, 'Status updated to ' || p_new_status),
    p_location, p_notes, p_updated_by
  );
END;
$function$;

CREATE OR REPLACE FUNCTION calculate_delivery_cost(
  p_delivery_model_id uuid,
  p_distance_km numeric,
  p_weight_kg numeric,
  p_order_value numeric DEFAULT 0,
  p_is_cod boolean DEFAULT false
)
RETURNS numeric
LANGUAGE plpgsql
AS $function$
DECLARE
  v_model record;
  v_cost numeric := 0;
BEGIN
  SELECT * INTO v_model FROM delivery_models WHERE id = p_delivery_model_id AND is_active = true;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  v_cost := v_cost + v_model.base_charge;

  IF p_distance_km > 0 AND v_model.per_km_charge > 0 THEN
    v_cost := v_cost + (p_distance_km * v_model.per_km_charge);
  END IF;

  IF p_weight_kg > 0 AND v_model.weight_charge_per_kg > 0 THEN
    v_cost := v_cost + (p_weight_kg * v_model.weight_charge_per_kg);
  END IF;

  IF p_is_cod AND v_model.cod_charge > 0 THEN
    v_cost := v_cost + v_model.cod_charge;
  END IF;

  IF v_model.min_order_value > 0 AND p_order_value >= v_model.min_order_value THEN
    v_cost := 0;
  END IF;

  IF v_model.free_delivery_above > 0 AND p_order_value >= v_model.free_delivery_above THEN
    v_cost := 0;
  END IF;

  RETURN v_cost;
END;
$function$;

-- 17. Views
CREATE OR REPLACE VIEW logistics_dashboard AS
SELECT
  (SELECT COUNT(*) FROM order_delivery_details WHERE delivery_status = 'order_received') as orders_received,
  (SELECT COUNT(*) FROM order_delivery_details WHERE delivery_status = 'packed') as orders_packed,
  (SELECT COUNT(*) FROM order_delivery_details WHERE delivery_status = 'out_for_delivery') as out_for_delivery,
  (SELECT COUNT(*) FROM order_delivery_details WHERE delivery_status = 'delivered' AND actual_delivery_at::date = current_date) as delivered_today,
  (SELECT COUNT(*) FROM order_delivery_details WHERE delivery_status = 'cancelled') as cancelled_orders,
  (SELECT AVG(delivery_distance_km) FROM order_delivery_details WHERE delivery_status = 'delivered') as avg_distance,
  (SELECT COUNT(*) FROM warehouses WHERE is_active = true) as active_warehouses,
  (SELECT COUNT(*) FROM delivery_partners WHERE is_active = true) as active_partners;
