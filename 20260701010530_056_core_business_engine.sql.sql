-- ============================================================
-- Migration 072: Global AI Business Intelligence & Analytics Engine
-- Phase 44 — Enterprise AI Business Intelligence & Analytics Layer
-- ============================================================

-- 1. Customer Analytics
CREATE TABLE customer_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analytics_period text NOT NULL CHECK (analytics_period IN ('daily', 'weekly', 'monthly', 'yearly', 'lifetime')),
  total_purchases integer DEFAULT 0,
  purchase_frequency numeric DEFAULT 0,
  average_purchase_value numeric DEFAULT 0,
  total_spent numeric DEFAULT 0,
  careclub_contributions integer DEFAULT 0,
  careclub_total numeric DEFAULT 0,
  smartpoints_earned integer DEFAULT 0,
  smartpoints_redeemed integer DEFAULT 0,
  smartcodes_generated integer DEFAULT 0,
  weekly_draws_participated integer DEFAULT 0,
  rewards_won integer DEFAULT 0,
  rewards_total_value numeric DEFAULT 0,
  wallet1_credits numeric DEFAULT 0,
  wallet1_debits numeric DEFAULT 0,
  wallet2_credits numeric DEFAULT 0,
  wallet2_debits numeric DEFAULT 0,
  referrals_made integer DEFAULT 0,
  successful_referrals integer DEFAULT 0,
  customer_lifetime_value numeric DEFAULT 0,
  last_purchase_at timestamptz,
  first_purchase_at timestamptz,
  computed_at timestamptz DEFAULT now(),
  period_start timestamptz,
  period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, analytics_period, period_start)
);

ALTER TABLE customer_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_cust_analytics_own" ON customer_analytics;
CREATE POLICY "select_cust_analytics_own" ON customer_analytics FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_cust_analytics_admin" ON customer_analytics;
CREATE POLICY "crud_cust_analytics_admin" ON customer_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 2. Merchant Analytics Extended
CREATE TABLE merchant_analytics_extended (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  analytics_period text NOT NULL CHECK (analytics_period IN ('daily', 'weekly', 'monthly', 'yearly', 'lifetime')),
  total_sales integer DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  platform_fees numeric DEFAULT 0,
  net_earnings numeric DEFAULT 0,
  unique_customers integer DEFAULT 0,
  repeat_customers integer DEFAULT 0,
  repeat_rate numeric DEFAULT 0,
  cancellations integer DEFAULT 0,
  cancellation_rate numeric DEFAULT 0,
  refunds integer DEFAULT 0,
  refund_rate numeric DEFAULT 0,
  refund_amount numeric DEFAULT 0,
  avg_rating numeric,
  total_reviews integer DEFAULT 0,
  five_star_reviews integer DEFAULT 0,
  one_star_reviews integer DEFAULT 0,
  avg_fulfillment_hours numeric,
  on_time_delivery_rate numeric DEFAULT 0,
  settlement_pending numeric DEFAULT 0,
  settlement_completed numeric DEFAULT 0,
  health_score numeric DEFAULT 50,
  health_factors jsonb DEFAULT '{}'::jsonb,
  last_order_at timestamptz,
  computed_at timestamptz DEFAULT now(),
  period_start timestamptz,
  period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(seller_id, analytics_period, period_start)
);

ALTER TABLE merchant_analytics_extended ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_merch_analytics_own" ON merchant_analytics_extended;
CREATE POLICY "select_merch_analytics_own" ON merchant_analytics_extended FOR SELECT
  TO authenticated USING (seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "crud_merch_analytics_admin" ON merchant_analytics_extended;
CREATE POLICY "crud_merch_analytics_admin" ON merchant_analytics_extended FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Partner Analytics Extended (for ecosystem partners)
CREATE TABLE partner_ecosystem_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  partner_type text NOT NULL CHECK (partner_type IN ('district', 'state', 'global')),
  analytics_period text NOT NULL CHECK (analytics_period IN ('daily', 'weekly', 'monthly', 'yearly', 'lifetime')),
  new_members_recruited integer DEFAULT 0,
  active_members integer DEFAULT 0,
  total_members integer DEFAULT 0,
  business_generated numeric DEFAULT 0,
  transactions_facilitated integer DEFAULT 0,
  commission_earned numeric DEFAULT 0,
  commission_pending numeric DEFAULT 0,
  regional_growth_rate numeric DEFAULT 0,
  avg_member_purchase numeric DEFAULT 0,
  trust_index numeric DEFAULT 50,
  trust_factors jsonb DEFAULT '{}'::jsonb,
  computed_at timestamptz DEFAULT now(),
  period_start timestamptz,
  period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(partner_id, analytics_period, period_start)
);

ALTER TABLE partner_ecosystem_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_part_analytics_own" ON partner_ecosystem_analytics;
CREATE POLICY "select_part_analytics_own" ON partner_ecosystem_analytics FOR SELECT
  TO authenticated USING (partner_id = auth.uid());

DROP POLICY IF EXISTS "crud_part_analytics_admin" ON partner_ecosystem_analytics;
CREATE POLICY "crud_part_analytics_admin" ON partner_ecosystem_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. SmartCode Analytics
CREATE TABLE smartcode_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_period text NOT NULL CHECK (analytics_period IN ('daily', 'weekly', 'monthly', 'yearly')),
  period_date date NOT NULL,
  total_smartcodes_generated integer DEFAULT 0,
  total_points_committed integer DEFAULT 0,
  unique_users_participating integer DEFAULT 0,
  avg_smartcodes_per_user numeric DEFAULT 0,
  duplicate_attempts integer DEFAULT 0,
  duplicate_blocked integer DEFAULT 0,
  registration_success_rate numeric DEFAULT 0,
  weekly_draws_completed integer DEFAULT 0,
  prime_winners integer DEFAULT 0,
  premium_winners integer DEFAULT 0,
  standard_winners integer DEFAULT 0,
  total_rewards_distributed numeric DEFAULT 0,
  pool_allocation_accuracy numeric DEFAULT 0,
  ai_validation_success_rate numeric DEFAULT 0,
  fraud_attempts_detected integer DEFAULT 0,
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(analytics_period, period_date)
);

ALTER TABLE smartcode_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_smart_analytics_admin" ON smartcode_analytics;
CREATE POLICY "crud_smart_analytics_admin" ON smartcode_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Care Club Analytics
CREATE TABLE careclub_analytics_extended (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_period text NOT NULL CHECK (analytics_period IN ('daily', 'weekly', 'monthly', 'yearly', 'lifetime')),
  period_date date NOT NULL,
  total_contributions integer DEFAULT 0,
  total_contribution_amount numeric DEFAULT 0,
  unique_contributors integer DEFAULT 0,
  new_contributors integer DEFAULT 0,
  avg_contribution_per_user numeric DEFAULT 0,
  daily_growth_rate numeric DEFAULT 0,
  weekly_growth_rate numeric DEFAULT 0,
  monthly_growth_rate numeric DEFAULT 0,
  contribution_frequency numeric DEFAULT 0,
  retention_rate numeric DEFAULT 0,
  community_health_index numeric DEFAULT 50,
  fund_utilization_rate numeric DEFAULT 0,
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(analytics_period, period_date)
);

ALTER TABLE careclub_analytics_extended ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_careclub_analytics_admin" ON careclub_analytics_extended;
CREATE POLICY "crud_careclub_analytics_admin" ON careclub_analytics_extended FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. Wallet Analytics
CREATE TABLE wallet_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analytics_period text NOT NULL CHECK (analytics_period IN ('daily', 'weekly', 'monthly', 'yearly')),
  period_date date NOT NULL,
  total_wallet1_balance numeric DEFAULT 0,
  total_wallet2_balance numeric DEFAULT 0,
  wallet1_credits_count integer DEFAULT 0,
  wallet1_credits_total numeric DEFAULT 0,
  wallet1_debits_count integer DEFAULT 0,
  wallet1_debits_total numeric DEFAULT 0,
  wallet2_credits_count integer DEFAULT 0,
  wallet2_credits_total numeric DEFAULT 0,
  wallet2_releases_count integer DEFAULT 0,
  wallet2_releases_total numeric DEFAULT 0,
  activation_queue_count integer DEFAULT 0,
  activation_queue_amount numeric DEFAULT 0,
  expiring_soon_count integer DEFAULT 0,
  expiring_soon_amount numeric DEFAULT 0,
  avg_wallet_balance numeric DEFAULT 0,
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(analytics_period, period_date)
);

ALTER TABLE wallet_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_wallet_analytics_admin" ON wallet_analytics;
CREATE POLICY "crud_wallet_analytics_admin" ON wallet_analytics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. AI Prediction Models
CREATE TABLE ai_prediction_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_code text NOT NULL UNIQUE,
  model_name text NOT NULL,
  prediction_type text NOT NULL CHECK (prediction_type IN (
    'sales_forecast', 'demand_forecast', 'customer_retention',
    'reward_budget', 'careclub_growth', 'inventory_forecast',
    'partner_expansion', 'future_project_readiness', 'clv_prediction',
    'churn_prediction', 'purchase_probability'
  )),
  model_version text DEFAULT '1.0',
  model_config jsonb DEFAULT '{}'::jsonb,
  training_data_config jsonb DEFAULT '{}'::jsonb,
  features_used text[] DEFAULT ARRAY[]::text[],
  accuracy_score numeric,
  precision_score numeric,
  recall_score numeric,
  last_trained_at timestamptz,
  prediction_horizon_days integer DEFAULT 30,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_prediction_models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_prediction_admin" ON ai_prediction_models;
CREATE POLICY "crud_prediction_admin" ON ai_prediction_models FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert prediction models
INSERT INTO ai_prediction_models (model_code, model_name, prediction_type, prediction_horizon_days) VALUES
('sales_forecast_v1', 'Sales Forecast Model', 'sales_forecast', 30),
('demand_forecast_v1', 'Demand Forecast Model', 'demand_forecast', 30),
('customer_retention_v1', 'Customer Retention Model', 'customer_retention', 90),
('reward_budget_v1', 'Reward Budget Forecast', 'reward_budget', 7),
('careclub_growth_v1', 'Care Club Growth Model', 'careclub_growth', 30),
('inventory_forecast_v1', 'Inventory Forecast Model', 'inventory_forecast', 14),
('partner_expansion_v1', 'Partner Expansion Model', 'partner_expansion', 90),
('future_project_v1', 'Future Project Readiness', 'future_project_readiness', 180),
('clv_prediction_v1', 'Customer Lifetime Value', 'clv_prediction', 365),
('churn_prediction_v1', 'Customer Churn Prediction', 'churn_prediction', 30),
('purchase_prob_v1', 'Purchase Probability Model', 'purchase_probability', 7);

-- 8. AI Predictions Storage
CREATE TABLE ai_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES ai_prediction_models(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('customer', 'merchant', 'partner', 'product', 'category', 'platform')),
  entity_id uuid,
  prediction_date date NOT NULL,
  prediction_horizon text NOT NULL,
  predicted_value numeric NOT NULL,
  confidence_score numeric DEFAULT 0,
  confidence_interval_low numeric,
  confidence_interval_high numeric,
  features_json jsonb DEFAULT '{}'::jsonb,
  recommendation text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'actualized', 'invalidated')),
  actual_value numeric,
  variance numeric,
  created_at timestamptz DEFAULT now(),
  validated_at timestamptz
);

ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_predictions_admin" ON ai_predictions;
CREATE POLICY "crud_predictions_admin" ON ai_predictions FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Executive KPI Panel
CREATE TABLE executive_kpi_panel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_date date NOT NULL UNIQUE,
  -- Customer KPIs
  total_customers integer DEFAULT 0,
  active_customers_today integer DEFAULT 0,
  active_customers_week integer DEFAULT 0,
  active_customers_month integer DEFAULT 0,
  new_customers_today integer DEFAULT 0,
  new_customers_week integer DEFAULT 0,
  new_customers_month integer DEFAULT 0,
  -- Order KPIs
  daily_orders integer DEFAULT 0,
  weekly_orders integer DEFAULT 0,
  monthly_orders integer DEFAULT 0,
  daily_revenue numeric DEFAULT 0,
  weekly_revenue numeric DEFAULT 0,
  monthly_revenue numeric DEFAULT 0,
  -- Care Club KPIs
  careclub_fund_total numeric DEFAULT 0,
  careclub_contributors_today integer DEFAULT 0,
  careclub_contributions_today numeric DEFAULT 0,
  -- SmartPoints KPIs
  smartpoints_generated_today integer DEFAULT 0,
  smartpoints_generated_week integer DEFAULT 0,
  smartpoints_generated_month integer DEFAULT 0,
  -- SmartCode KPIs
  weekly_winners_count integer DEFAULT 0,
  weekly_rewards_distributed numeric DEFAULT 0,
  smartcodes_registered_today integer DEFAULT 0,
  -- Merchant KPIs
  total_merchants integer DEFAULT 0,
  active_merchants integer DEFAULT 0,
  -- Partner KPIs
  total_partners integer DEFAULT 0,
  active_partners integer DEFAULT 0,
  -- Trust Score
  avg_trust_score numeric DEFAULT 0,
  high_trust_customers integer DEFAULT 0,
  -- Growth
  week_over_week_growth numeric DEFAULT 0,
  month_over_month_growth numeric DEFAULT 0,
  -- Computed
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE executive_kpi_panel ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_exec_kpi_admin" ON executive_kpi_panel;
CREATE POLICY "select_exec_kpi_admin" ON executive_kpi_panel FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_exec_kpi_admin" ON executive_kpi_panel;
CREATE POLICY "crud_exec_kpi_admin" ON executive_kpi_panel FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. AI Insights Generation
CREATE TABLE ai_insights_bq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type text NOT NULL CHECK (insight_type IN (
    'top_performing_region', 'most_active_customers', 'fastest_growing_category',
    'risk_alert', 'business_opportunity', 'growth_suggestion', 'anomaly_detection',
    'trend_analysis', 'performance_alert', 'optimization_recommendation'
  )),
  insight_category text NOT NULL CHECK (insight_category IN (
    'customer', 'merchant', 'partner', 'marketplace', 'smartcode',
    'careclub', 'wallet', 'revenue', 'growth', 'risk', 'operations'
  )),
  title text NOT NULL,
  description text NOT NULL,
  entity_type text,
  entity_id uuid,
  data_reference jsonb DEFAULT '{}'::jsonb,
  metrics jsonb DEFAULT '{}'::jsonb,
  severity text DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical', 'opportunity')),
  confidence_score numeric DEFAULT 0,
  action_suggested text,
  action_taken boolean DEFAULT false,
  action_taken_at timestamptz,
  action_taken_by uuid REFERENCES profiles(id),
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_insights_bq ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_insights_admin" ON ai_insights_bq;
CREATE POLICY "select_insights_admin" ON ai_insights_bq FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_insights_admin" ON ai_insights_bq;
CREATE POLICY "crud_insights_admin" ON ai_insights_bq FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. Dashboard Configurations
CREATE TABLE dashboard_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_type text NOT NULL CHECK (dashboard_type IN ('customer', 'merchant', 'partner', 'admin', 'executive')),
  name text NOT NULL,
  config_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  widgets jsonb DEFAULT '[]'::jsonb,
  default_refresh_interval integer DEFAULT 300,
  is_default boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE dashboard_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_dashboards_admin" ON dashboard_configurations;
CREATE POLICY "select_dashboards_admin" ON dashboard_configurations FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_dashboards_admin" ON dashboard_configurations;
CREATE POLICY "crud_dashboards_admin" ON dashboard_configurations FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert default dashboards
INSERT INTO dashboard_configurations (dashboard_type, name, is_default, widgets) VALUES
('customer', 'Customer Overview Dashboard', true, '[
  {"type": "kpi", "title": "Total Purchases", "metric": "total_purchases"},
  {"type": "kpi", "title": "SmartPoints Balance", "metric": "smartpoints"},
  {"type": "chart", "title": "Purchase History", "metric": "purchase_trend"},
  {"type": "list", "title": "Recent Orders", "metric": "recent_orders"}
]'::jsonb),
('merchant', 'Merchant Performance Dashboard', true, '[
  {"type": "kpi", "title": "Total Sales", "metric": "total_sales"},
  {"type": "kpi", "title": "Revenue", "metric": "total_revenue"},
  {"type": "kpi", "title": "Health Score", "metric": "health_score"},
  {"type": "chart", "title": "Sales Trend", "metric": "sales_trend"},
  {"type": "list", "title": "Recent Orders", "metric": "recent_orders"}
]'::jsonb),
('partner', 'Partner Growth Dashboard', true, '[
  {"type": "kpi", "title": "Total Members", "metric": "total_members"},
  {"type": "kpi", "title": "Commission Earned", "metric": "commission_earned"},
  {"type": "kpi", "title": "Trust Index", "metric": "trust_index"},
  {"type": "chart", "title": "Member Growth", "metric": "member_trend"}
]'::jsonb),
('admin', 'Admin Operations Dashboard', true, '[
  {"type": "kpi", "title": "Active Orders", "metric": "active_orders"},
  {"type": "kpi", "title": "Pending Refunds", "metric": "pending_refunds"},
  {"type": "kpi", "title": "Fraud Alerts", "metric": "fraud_alerts"},
  {"type": "chart", "title": "Transaction Volume", "metric": "transaction_trend"}
]'::jsonb),
('executive', 'Executive KPI Dashboard', true, '[
  {"type": "kpi", "title": "Total Customers", "metric": "total_customers"},
  {"type": "kpi", "title": "Daily Revenue", "metric": "daily_revenue"},
  {"type": "kpi", "title": "Monthly Revenue", "metric": "monthly_revenue"},
  {"type": "kpi", "title": "Avg Trust Score", "metric": "avg_trust_score"},
  {"type": "chart", "title": "Revenue Trend", "metric": "revenue_trend"},
  {"type": "chart", "title": "Customer Growth", "metric": "customer_trend"}
]'::jsonb);

-- 12. Export Configuration
CREATE TABLE export_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  export_type text NOT NULL CHECK (export_type IN ('pdf', 'excel', 'csv', 'json')),
  report_name text NOT NULL,
  report_category text CHECK (report_category IN (
    'customer_analytics', 'merchant_analytics', 'partner_analytics',
    'marketplace_analytics', 'smartcode_analytics', 'careclub_analytics',
    'wallet_analytics', 'executive_summary', 'custom'
  )),
  query_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  columns_config jsonb DEFAULT '[]'::jsonb,
  filters jsonb DEFAULT '{}'::jsonb,
  sorting jsonb DEFAULT '[]'::jsonb,
  is_scheduled boolean DEFAULT false,
  schedule_config jsonb DEFAULT '{}'::jsonb,
  last_export_at timestamptz,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE export_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_exports_admin" ON export_configurations;
CREATE POLICY "select_exports_admin" ON export_configurations FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_exports_admin" ON export_configurations;
CREATE POLICY "crud_exports_admin" ON export_configurations FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Analytics Audit Log
CREATE TABLE analytics_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL CHECK (action_type IN ('computed', 'viewed', 'exported', 'scheduled', 'shared')),
  analytics_type text NOT NULL,
  entity_type text,
  entity_id uuid,
  accessed_by uuid REFERENCES profiles(id),
  access_duration_ms integer,
  row_count integer,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_audit_admin" ON analytics_audit_log;
CREATE POLICY "crud_audit_admin" ON analytics_audit_log FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 14. Indexes
CREATE INDEX IF NOT EXISTS idx_cust_analytics_user ON customer_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_cust_analytics_period ON customer_analytics(analytics_period);
CREATE INDEX IF NOT EXISTS idx_cust_analytics_date ON customer_analytics(period_start);

CREATE INDEX IF NOT EXISTS idx_merch_ext_analytics_seller ON merchant_analytics_extended(seller_id);
CREATE INDEX IF NOT EXISTS idx_merch_ext_analytics_period ON merchant_analytics_extended(analytics_period);

CREATE INDEX IF NOT EXISTS idx_part_eco_analytics_partner ON partner_ecosystem_analytics(partner_id);
CREATE INDEX IF NOT EXISTS idx_part_eco_analytics_type ON partner_ecosystem_analytics(partner_type);

CREATE INDEX IF NOT EXISTS idx_smartcode_analytics_date ON smartcode_analytics(period_date);

CREATE INDEX IF NOT EXISTS idx_careclub_ext_analytics_date ON careclub_analytics_extended(period_date);

CREATE INDEX IF NOT EXISTS idx_wallet_analytics_date ON wallet_analytics(period_date);

CREATE INDEX IF NOT EXISTS idx_predictions_model ON ai_predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_predictions_date ON ai_predictions(prediction_date);
CREATE INDEX IF NOT EXISTS idx_predictions_entity ON ai_predictions(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_insights_bq_type ON ai_insights_bq(insight_type);
CREATE INDEX IF NOT EXISTS idx_insights_bq_active ON ai_insights_bq(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_insights_bq_severity ON ai_insights_bq(severity);

CREATE INDEX IF NOT EXISTS idx_exec_kpi_date ON executive_kpi_panel(kpi_date);

-- 15. Triggers
DROP TRIGGER IF EXISTS trg_prediction_updated ON ai_prediction_models;
CREATE TRIGGER trg_prediction_updated BEFORE UPDATE ON ai_prediction_models
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_dashboard_updated ON dashboard_configurations;
CREATE TRIGGER trg_dashboard_updated BEFORE UPDATE ON dashboard_configurations
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 16. Functions
CREATE OR REPLACE FUNCTION compute_customer_analytics(p_user_id uuid, p_period text)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO customer_analytics (
    user_id, analytics_period, period_start, period_end,
    total_purchases, total_spent, smartpoints_earned,
    smartcodes_generated, careclub_contributions, careclub_total,
    computed_at
  )
  SELECT
    p_user_id,
    p_period,
    CASE p_period
      WHEN 'daily' THEN current_date::timestamptz
      WHEN 'weekly' THEN date_trunc('week', now())::timestamptz
      WHEN 'monthly' THEN date_trunc('month', now())::timestamptz
      WHEN 'yearly' THEN date_trunc('year', now())::timestamptz
      ELSE date_trunc('year', '2020-01-01'::date)::timestamptz
    END,
    now(),
    COALESCE((SELECT COUNT(*) FROM orders WHERE user_id = p_user_id), 0),
    COALESCE((SELECT SUM(total_amount) FROM orders WHERE user_id = p_user_id), 0),
    COALESCE((SELECT SUM(points_earned) FROM orders WHERE user_id = p_user_id), 0),
    COALESCE((SELECT COUNT(*) FROM smartcode_participation WHERE user_id = p_user_id), 0),
    COALESCE((SELECT COUNT(*) FROM care_club_contributions WHERE user_id = p_user_id), 0),
    COALESCE((SELECT SUM(amount) FROM care_club_contributions WHERE user_id = p_user_id), 0),
    now()
  ON CONFLICT (user_id, analytics_period, period_start) DO UPDATE SET
    total_purchases = EXCLUDED.total_purchases,
    total_spent = EXCLUDED.total_spent,
    smartpoints_earned = EXCLUDED.smartpoints_earned,
    smartcodes_generated = EXCLUDED.smartcodes_generated,
    careclub_contributions = EXCLUDED.careclub_contributions,
    computed_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION compute_executive_kpis()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO executive_kpi_panel (
    kpi_date,
    total_customers,
    active_customers_today,
    daily_orders,
    daily_revenue,
    smartcodes_registered_today,
    computed_at
  )
  SELECT
    current_date,
    (SELECT COUNT(*) FROM profiles),
    (SELECT COUNT(DISTINCT user_id) FROM orders WHERE created_at::date = current_date),
    (SELECT COUNT(*) FROM orders WHERE created_at::date = current_date),
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at::date = current_date),
    (SELECT COUNT(*) FROM smartcode_participation WHERE created_at::date = current_date),
    now()
  ON CONFLICT (kpi_date) DO UPDATE SET
    total_customers = EXCLUDED.total_customers,
    active_customers_today = EXCLUDED.active_customers_today,
    daily_orders = EXCLUDED.daily_orders,
    daily_revenue = EXCLUDED.daily_revenue,
    smartcodes_registered_today = EXCLUDED.smartcodes_registered_today,
    computed_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION get_analytics_summary()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_summary jsonb;
BEGIN
  SELECT jsonb_build_object(
    'customers', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM profiles),
      'active_week', (SELECT COUNT(DISTINCT user_id) FROM orders WHERE created_at > now() - interval '7 days')
    ),
    'orders', jsonb_build_object(
      'today', (SELECT COUNT(*) FROM orders WHERE created_at::date = current_date),
      'week', (SELECT COUNT(*) FROM orders WHERE created_at > now() - interval '7 days'),
      'month', (SELECT COUNT(*) FROM orders WHERE created_at > now() - interval '30 days')
    ),
    'revenue', jsonb_build_object(
      'today', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at::date = current_date),
      'week', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at > now() - interval '7 days'),
      'month', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at > now() - interval '30 days')
    ),
    'careclub', jsonb_build_object(
      'total_contributions', (SELECT COALESCE(SUM(amount), 0) FROM care_club_contributions),
      'contributors', (SELECT COUNT(DISTINCT user_id) FROM care_club_contributions)
    ),
    'smartcode', jsonb_build_object(
      'today_registered', (SELECT COUNT(*) FROM smartcode_participation WHERE created_at::date = current_date)
    ),
    'merchants', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM sellers),
      'active', (SELECT COUNT(DISTINCT seller_id) FROM orders WHERE created_at > now() - interval '30 days')
    )
  ) INTO v_summary;

  RETURN v_summary;
END;
$function$;

CREATE OR REPLACE FUNCTION generate_insight(
  p_insight_type text,
  p_category text,
  p_title text,
  p_description text,
  p_metrics jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  v_insight_id uuid;
BEGIN
  INSERT INTO ai_insights_bq (
    insight_type, insight_category, title, description, metrics
  )
  VALUES (
    p_insight_type, p_category, p_title, p_description, p_metrics
  ) RETURNING id INTO v_insight_id;

  RETURN v_insight_id;
END;
$function$;
