-- ============================================================
-- Migration 074: Global Cloud Infrastructure, Scalability & Production Deployment Engine
-- Phase 46 — Enterprise Production Deployment Architecture
-- ============================================================

-- 1. Cloud Architecture Configuration
CREATE TABLE cloud_provider_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_code text NOT NULL UNIQUE CHECK (provider_code IN ('aws', 'gcp', 'azure', 'digitalocean', 'custom', 'future')),
  provider_name text NOT NULL,
  is_primary boolean DEFAULT false,
  is_active boolean DEFAULT true,
  region_config jsonb DEFAULT '{}'::jsonb,
  compute_config jsonb DEFAULT '{}'::jsonb,
  storage_config jsonb DEFAULT '{}'::jsonb,
  database_config jsonb DEFAULT '{}'::jsonb,
  networking_config jsonb DEFAULT '{}'::jsonb,
  security_config jsonb DEFAULT '{}'::jsonb,
  api_credentials_ref text,
  cost_config jsonb DEFAULT '{}'::jsonb,
  last_health_check timestamptz,
  health_status text DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'degraded', 'unhealthy', 'maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cloud_provider_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_cloud_admin" ON cloud_provider_config;
CREATE POLICY "crud_cloud_admin" ON cloud_provider_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO cloud_provider_config (provider_code, provider_name, is_primary, is_active) VALUES
('aws', 'Amazon Web Services', true, true),
('gcp', 'Google Cloud Platform', false, true),
('azure', 'Microsoft Azure', false, true),
('digitalocean', 'DigitalOcean', false, true);

-- 2. Regional Deployment Config
CREATE TABLE regional_deployment_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_code text NOT NULL UNIQUE CHECK (region_code IN (
    'in-south-1', 'in-west-1', 'in-north-1',
    'ae-dubai-1', 'ae-abudhabi-1',
    'sa-riyadh-1', 'sa-jeddah-1',
    'eu-west-1', 'eu-central-1', 'eu-north-1',
    'us-east-1', 'us-west-1', 'us-central-1',
    'sg-southeast-1', 'uk-london-1', 'future'
  )),
  region_name text NOT NULL,
  provider_code text REFERENCES cloud_provider_config(provider_code),
  data_residency text DEFAULT 'default' CHECK (data_residency IN ('default', 'strict', 'sovereign')),
  compliance_requirements jsonb DEFAULT '[]'::jsonb,
  primary_database_endpoint text,
  replica_endpoints jsonb DEFAULT '[]'::jsonb,
  cdn_endpoint text,
  load_balancer_endpoint text,
  is_active boolean DEFAULT true,
  latency_target_ms integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE regional_deployment_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_region_admin" ON regional_deployment_config;
CREATE POLICY "crud_region_admin" ON regional_deployment_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO regional_deployment_config (region_code, region_name, provider_code) VALUES
('in-south-1', 'India South (Mumbai)', 'aws'),
('in-west-1', 'India West (Hyderabad)', 'aws'),
('ae-dubai-1', 'UAE Dubai', 'aws'),
('eu-west-1', 'Europe West (Ireland)', 'aws'),
('us-east-1', 'US East (Virginia)', 'aws'),
('sg-southeast-1', 'Singapore', 'aws'),
('uk-london-1', 'UK London', 'aws');

-- 3. Auto Scaling Rules
CREATE TABLE auto_scaling_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text NOT NULL UNIQUE,
  service_type text NOT NULL CHECK (service_type IN (
    'customers', 'merchants', 'partners', 'marketplace',
    'orders', 'payments', 'smartcode', 'weekly_draw',
    'notifications', 'analytics', 'api', 'cdn'
  )),
  metric_type text NOT NULL CHECK (metric_type IN ('cpu', 'memory', 'requests', 'connections', 'queue_depth', 'latency')),
  scale_up_threshold numeric NOT NULL,
  scale_down_threshold numeric NOT NULL,
  cooldown_seconds integer DEFAULT 300,
  min_instances integer DEFAULT 1,
  max_instances integer DEFAULT 20,
  scale_up_increment integer DEFAULT 1,
  scale_down_increment integer DEFAULT 1,
  target_utilization numeric DEFAULT 70,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE auto_scaling_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_scaling_admin" ON auto_scaling_rules;
CREATE POLICY "crud_scaling_admin" ON auto_scaling_rules FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO auto_scaling_rules (rule_name, service_type, metric_type, scale_up_threshold, scale_down_threshold, min_instances, max_instances) VALUES
('customers_cpu', 'customers', 'cpu', 75, 30, 2, 10),
('merchants_cpu', 'merchants', 'cpu', 75, 30, 2, 10),
('orders_requests', 'orders', 'requests', 1000, 200, 3, 20),
('payments_requests', 'payments', 'requests', 500, 100, 3, 15),
('smartcode_cpu', 'smartcode', 'cpu', 70, 25, 2, 10),
('weekly_draw_cpu', 'weekly_draw', 'cpu', 80, 30, 2, 10),
('marketplace_cpu', 'marketplace', 'cpu', 70, 30, 2, 15),
('notifications_queue', 'notifications', 'queue_depth', 1000, 100, 2, 10),
('analytics_cpu', 'analytics', 'cpu', 80, 30, 2, 8),
('api_requests', 'api', 'requests', 5000, 500, 3, 30);

-- 4. Scaling Events Log
CREATE TABLE scaling_events_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES auto_scaling_rules(id),
  service_type text NOT NULL,
  region_code text REFERENCES regional_deployment_config(region_code),
  event_type text NOT NULL CHECK (event_type IN ('scale_up', 'scale_down', 'min_reached', 'max_reached', 'cooldown')),
  previous_instances integer NOT NULL,
  new_instances integer NOT NULL,
  trigger_metric text NOT NULL,
  trigger_value numeric NOT NULL,
  threshold_value numeric NOT NULL,
  execution_time_ms integer,
  success boolean DEFAULT true,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scaling_events_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_scaling_evt_admin" ON scaling_events_log;
CREATE POLICY "crud_scaling_evt_admin" ON scaling_events_log FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. CDN Configuration
CREATE TABLE cdn_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cdn_type text NOT NULL CHECK (cdn_type IN ('cloudfront', 'cloudflare', 'fastly', 'custom', 'future')),
  cdn_name text NOT NULL,
  origin_url text NOT NULL,
  cdn_url text NOT NULL,
  cache_behaviors jsonb DEFAULT '[]'::jsonb,
  cache_ttl_default integer DEFAULT 3600,
  cache_ttl_static integer DEFAULT 86400,
  cache_ttl_images integer DEFAULT 604800,
  cache_ttl_api integer DEFAULT 60,
 Compression_enabled boolean DEFAULT true,
  ssl_enabled boolean DEFAULT true,
  waf_enabled boolean DEFAULT true,
  ddos_protection boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cdn_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_cdn_admin" ON cdn_config;
CREATE POLICY "crud_cdn_admin" ON cdn_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO cdn_config (cdn_type, cdn_name, origin_url, cdn_url) VALUES
('cloudfront', 'VLOOP Static CDN', 'https://api.vloop.in', 'https://cdn.vloop.in'),
('cloudfront', 'VLOOP Images CDN', 'https://images.vloop.in', 'https://img.vloop.in'),
('cloudfront', 'VLOOP Documents CDN', 'https://docs.vloop.in', 'https://assets.vloop.in');

-- 6. CDN Cache Statistics
CREATE TABLE cdn_cache_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cdn_id uuid REFERENCES cdn_config(id),
  stat_date date NOT NULL,
  total_requests bigint DEFAULT 0,
  cache_hits bigint DEFAULT 0,
  cache_misses bigint DEFAULT 0,
  hit_rate numeric DEFAULT 0,
  bandwidth_gb numeric DEFAULT 0,
  avg_latency_ms numeric DEFAULT 0,
  error_rate numeric DEFAULT 0,
  peak_bandwidth_gbps numeric DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  country_distribution jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(cdn_id, stat_date)
);

ALTER TABLE cdn_cache_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_cdn_stats_admin" ON cdn_cache_stats;
CREATE POLICY "crud_cdn_stats_admin" ON cdn_cache_stats FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. Database Scaling Configuration
CREATE TABLE database_scaling_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  database_type text NOT NULL CHECK (database_type IN ('primary', 'replica', 'shard')),
  database_name text NOT NULL,
  host_endpoint text NOT NULL,
  port integer DEFAULT 5432,
  region_code text REFERENCES regional_deployment_config(region_code),
  is_read_replica boolean DEFAULT false,
  replica_lag_ms integer DEFAULT 0,
  sharding_strategy text CHECK (sharding_strategy IN ('none', 'range', 'hash', 'list')),
  shard_key text,
  shard_range_start integer,
  shard_range_end integer,
  max_connections integer DEFAULT 100,
  current_connections integer DEFAULT 0,
  storage_gb numeric DEFAULT 0,
  storage_limit_gb numeric DEFAULT 1000,
  backup_enabled boolean DEFAULT true,
  last_backup_at timestamptz,
  is_active boolean DEFAULT true,
  health_status text DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'degraded', 'unhealthy', 'maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE database_scaling_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_db_scale_admin" ON database_scaling_config;
CREATE POLICY "crud_db_scale_admin" ON database_scaling_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Backup Configuration
CREATE TABLE backup_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name text NOT NULL UNIQUE,
  backup_type text NOT NULL CHECK (backup_type IN ('daily', 'weekly', 'monthly', 'point_in_time', 'manual')),
  target_database text NOT NULL,
  storage_location text NOT NULL,
  retention_days integer DEFAULT 30,
  encryption_enabled boolean DEFAULT true,
  compression_enabled boolean DEFAULT true,
  schedule_cron text,
  last_backup_at timestamptz,
  last_backup_size_gb numeric,
  last_backup_duration_s integer,
  last_backup_status text DEFAULT 'pending' CHECK (last_backup_status IN ('pending', 'running', 'completed', 'failed', 'expired')),
  recovery_timeObjective_hours integer DEFAULT 4,
  recovery_point_objective_hours integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE backup_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_backup_cfg_admin" ON backup_config;
CREATE POLICY "crud_backup_cfg_admin" ON backup_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO backup_config (backup_name, backup_type, target_database, storage_location, schedule_cron) VALUES
('daily_primary_db', 'daily', 'primary', 's3://vloop-backups/daily', '0 2 * * *'),
('weekly_full_backup', 'weekly', 'primary', 's3://vloop-backups/weekly', '0 3 * * 0'),
('monthly_archive', 'monthly', 'primary', 's3://vloop-backups/monthly', '0 4 1 * *'),
('pit_recovery', 'point_in_time', 'primary', 's3://vloop-backups/pit', '*/15 * * * *');

-- 9. Backup History
CREATE TABLE backup_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id uuid REFERENCES backup_config(id),
  backup_start_at timestamptz NOT NULL,
  backup_end_at timestamptz,
  backup_size_gb numeric,
  backup_location text,
  checksum text,
  status text DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'verified', 'expired')),
  verification_status text CHECK (verification_status IN ('pending', 'passed', 'failed')),
  verified_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE backup_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_backup_hist_admin" ON backup_history;
CREATE POLICY "crud_backup_hist_admin" ON backup_history FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Performance Caching
CREATE TABLE performance_cache_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_type text NOT NULL CHECK (cache_type IN ('redis', 'memcached', 'cdn', 'browser', 'application')),
  cache_name text NOT NULL UNIQUE,
  target_service text NOT NULL,
  eviction_policy text DEFAULT 'lru' CHECK (eviction_policy IN ('lru', 'lfu', 'fifo', 'ttl')),
  default_ttl_seconds integer DEFAULT 3600,
  max_memory_mb integer DEFAULT 1024,
  compression_enabled boolean DEFAULT true,
  serialization text DEFAULT 'json' CHECK (serialization IN ('json', 'protobuf', 'msgpack')),
  hit_rate_target numeric DEFAULT 80,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE performance_cache_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_perf_cache_admin" ON performance_cache_config;
CREATE POLICY "crud_perf_cache_admin" ON performance_cache_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO performance_cache_config (cache_type, cache_name, target_service) VALUES
('redis', 'user_session_cache', 'customers'),
('redis', 'product_catalog_cache', 'marketplace'),
('redis', 'smartpoint_balance_cache', 'wallet'),
('cdn', 'static_assets_cache', 'cdn'),
('browser', 'user_preferences_cache', 'customers');

-- 11. High Availability Configuration
CREATE TABLE high_availability_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL UNIQUE,
  service_type text NOT NULL CHECK (service_type IN ('api', 'database', 'cache', 'queue', 'cdn', 'worker')),
  redundancy_count integer DEFAULT 2,
  failover_strategy text DEFAULT 'active_passive' CHECK (failover_strategy IN ('active_passive', 'active_active', 'round_robin')),
  health_check_interval_s integer DEFAULT 30,
  health_check_endpoint text,
  failover_threshold integer DEFAULT 3,
  automatic_failover boolean DEFAULT true,
  current_primary_region text,
  primary_endpoint text,
  secondary_endpoints jsonb DEFAULT '[]'::jsonb,
  last_failover_at timestamptz,
  failover_count integer DEFAULT 0,
  status text DEFAULT 'operational' CHECK (status IN ('operational', 'degraded', 'failing_over', 'maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE high_availability_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_ha_admin" ON high_availability_config;
CREATE POLICY "crud_ha_admin" ON high_availability_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO high_availability_config (service_name, service_type, redundancy_count, current_primary_region) VALUES
('api_gateway', 'api', 3, 'in-south-1'),
('primary_database', 'database', 2, 'in-south-1'),
('redis_cache', 'cache', 2, 'in-south-1'),
('notification_queue', 'queue', 2, 'in-south-1'),
('cdn_edge', 'cdn', 5, 'global');

-- 12. Infrastructure Monitoring Metrics
CREATE TABLE infrastructure_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date timestamptz NOT NULL,
  region_code text REFERENCES regional_deployment_config(region_code),
  service_type text NOT NULL CHECK (service_type IN ('cpu', 'memory', 'storage', 'network', 'api', 'database', 'payment', 'marketplace', 'smartcode')),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_unit text NOT NULL,
  threshold_warning numeric,
  threshold_critical numeric,
  status text DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'critical')),
  node_id text,
  additional_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE infrastructure_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_metrics_admin" ON infrastructure_metrics;
CREATE POLICY "crud_metrics_admin" ON infrastructure_metrics FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Deployment Pipeline Configuration
CREATE TABLE deployment_pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_name text NOT NULL UNIQUE,
  deployment_type text NOT NULL CHECK (deployment_type IN ('frontend', 'backend', 'database', 'infrastructure', 'full_stack')),
  repository_url text,
  branch text DEFAULT 'main',
  environments jsonb DEFAULT '["development", "staging", "production"]'::jsonb,
  build_command text,
  test_command text,
  deploy_command text,
  rollback_command text,
  health_check_command text,
  auto_rollback_on_failure boolean DEFAULT true,
  approval_required boolean DEFAULT true,
  notification_channels jsonb DEFAULT '["slack", "email"]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deployment_pipelines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_pipeline_admin" ON deployment_pipelines;
CREATE POLICY "crud_pipeline_admin" ON deployment_pipelines FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO deployment_pipelines (pipeline_name, deployment_type, repository_url) VALUES
('frontend_pipeline', 'frontend', 'https://github.com/vloop/frontend'),
('backend_api_pipeline', 'backend', 'https://github.com/vloop/backend'),
('database_migration_pipeline', 'database', 'https://github.com/vloop/database'),
('infrastructure_pipeline', 'infrastructure', 'https://github.com/vloop/infra'),
('full_release_pipeline', 'full_stack', 'https://github.com/vloop/vloop');

-- 14. Deployment History
CREATE TABLE deployment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id uuid REFERENCES deployment_pipelines(id),
  environment text NOT NULL CHECK (environment IN ('development', 'testing', 'staging', 'production')),
  version text NOT NULL,
  commit_hash text,
  deployed_by uuid REFERENCES profiles(id),
  deployment_started_at timestamptz DEFAULT now(),
  deployment_completed_at timestamptz,
  duration_seconds integer,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'testing', 'deploying', 'verifying', 'completed', 'failed', 'rolled_back')),
  health_check_passed boolean,
  rollback_version text,
  rollback_at timestamptz,
  rollback_by uuid REFERENCES profiles(id),
  error_message text,
  deployment_log text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deployment_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_deploy_hist_admin" ON deployment_history;
CREATE POLICY "crud_deploy_hist_admin" ON deployment_history FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 15. Production Dashboard Stats
CREATE TABLE production_dashboard_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date NOT NULL UNIQUE,
  -- Traffic
  total_api_requests bigint DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  -- Performance
  avg_api_latency_ms numeric DEFAULT 0,
  p95_api_latency_ms numeric DEFAULT 0,
  p99_api_latency_ms numeric DEFAULT 0,
  error_rate numeric DEFAULT 0,
  -- Orders
  total_orders integer DEFAULT 0,
  orders_per_hour_peak integer DEFAULT 0,
  -- Payments
  total_transactions integer DEFAULT 0,
  payment_success_rate numeric DEFAULT 0,
  -- SmartCode
  smartcode_entries integer DEFAULT 0,
  weekly_draw_processed boolean DEFAULT false,
  -- Marketplace
  active_products integer DEFAULT 0,
  active_merchants integer DEFAULT 0,
  -- Infrastructure
  avg_cpu_utilization numeric DEFAULT 0,
  avg_memory_utilization numeric DEFAULT 0,
  storage_used_gb numeric DEFAULT 0,
  cdn_hit_rate numeric DEFAULT 0,
  -- Health
  services_healthy integer DEFAULT 0,
  services_degraded integer DEFAULT 0,
  incidents_critical integer DEFAULT 0,
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE production_dashboard_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_prod_dash_admin" ON production_dashboard_stats;
CREATE POLICY "crud_prod_dash_admin" ON production_dashboard_stats FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 16. Disaster Recovery Plan
CREATE TABLE disaster_recovery_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL UNIQUE,
  disaster_type text NOT NULL CHECK (disaster_type IN ('region_failure', 'database_failure', 'complete_outage', 'data_corruption', 'security_breach', 'ddos')),
  priority integer DEFAULT 5,
  target_recovery_time_hours integer DEFAULT 4,
  recovery_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  communication_plan jsonb DEFAULT '{}'::jsonb,
  responsible_team jsonb DEFAULT '[]'::jsonb,
  last_tested_at timestamptz,
  test_result text CHECK (test_result IN ('passed', 'failed', 'partial')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE disaster_recovery_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_dr_admin" ON disaster_recovery_plans;
CREATE POLICY "crud_dr_admin" ON disaster_recovery_plans FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO disaster_recovery_plans (plan_name, disaster_type, priority) VALUES
('region_failover', 'region_failure', 1),
('database_point_in_time_recovery', 'database_failure', 1),
('complete_system_failover', 'complete_outage', 1),
('data_integrity_recovery', 'data_corruption', 2),
('security_incident_response', 'security_breach', 1),
('ddos_mitigation', 'ddos', 2);

-- 17. Global Load Balancer Configuration
CREATE TABLE global_load_balancer_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lb_name text NOT NULL UNIQUE,
  lb_type text NOT NULL CHECK (lb_type IN ('application', 'network', 'global')),
  algorithm text DEFAULT 'round_robin' CHECK (algorithm IN ('round_robin', 'least_connections', 'ip_hash', 'weighted')),
  health_check_path text DEFAULT '/health',
  health_check_interval_s integer DEFAULT 30,
  health_check_timeout_s integer DEFAULT 5,
  healthy_threshold integer DEFAULT 3,
  unhealthy_threshold integer DEFAULT 3,
  regions jsonb DEFAULT '[]'::jsonb,
  backends jsonb DEFAULT '[]'::jsonb,
  ssl_certificate_arn text,
  enable_stickiness boolean DEFAULT true,
  session_timeout_s integer DEFAULT 3600,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE global_load_balancer_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_lb_admin" ON global_load_balancer_config;
CREATE POLICY "crud_lb_admin" ON global_load_balancer_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 18. Indexes
CREATE INDEX IF NOT EXISTS idx_cloud_provider_code ON cloud_provider_config(provider_code);
CREATE INDEX IF NOT EXISTS idx_regional_region ON regional_deployment_config(region_code);
CREATE INDEX IF NOT EXISTS idx_rules_service ON auto_scaling_rules(service_type);
CREATE INDEX IF NOT EXISTS idx_scaling_evt_time ON scaling_events_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cdn_stats_date ON cdn_cache_stats(stat_date);
CREATE INDEX IF NOT EXISTS idx_db_scaling_region ON database_scaling_config(region_code);
CREATE INDEX IF NOT EXISTS idx_backup_history_time ON backup_history(backup_start_at DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON infrastructure_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_service ON infrastructure_metrics(service_type);
CREATE INDEX IF NOT EXISTS idx_deploy_hist_status ON deployment_history(status);
CREATE INDEX IF NOT EXISTS idx_prod_dash_date ON production_dashboard_stats(stat_date);

-- 19. Triggers
DROP TRIGGER IF EXISTS trg_cloud_updated ON cloud_provider_config;
CREATE TRIGGER trg_cloud_updated BEFORE UPDATE ON cloud_provider_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_region_updated ON regional_deployment_config;
CREATE TRIGGER trg_region_updated BEFORE UPDATE ON regional_deployment_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_scaling_rules_updated ON auto_scaling_rules;
CREATE TRIGGER trg_scaling_rules_updated BEFORE UPDATE ON auto_scaling_rules FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_cdn_updated ON cdn_config;
CREATE TRIGGER trg_cdn_updated BEFORE UPDATE ON cdn_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_db_scaling_updated ON database_scaling_config;
CREATE TRIGGER trg_db_scaling_updated BEFORE UPDATE ON database_scaling_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_backup_cfg_updated ON backup_config;
CREATE TRIGGER trg_backup_cfg_updated BEFORE UPDATE ON backup_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS tr_perf_cache_updated ON performance_cache_config;
CREATE TRIGGER tr_perf_cache_updated BEFORE UPDATE ON performance_cache_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_ha_updated ON high_availability_config;
CREATE TRIGGER trg_ha_updated BEFORE UPDATE ON high_availability_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_pipeline_updated ON deployment_pipelines;
CREATE TRIGGER trg_pipeline_updated BEFORE UPDATE ON deployment_pipelines FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_dr_updated ON disaster_recovery_plans;
CREATE TRIGGER trg_dr_updated BEFORE UPDATE ON disaster_recovery_plans FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_lb_updated ON global_load_balancer_config;
CREATE TRIGGER trg_lb_updated BEFORE UPDATE ON global_load_balancer_config FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 20. Functions
CREATE OR REPLACE FUNCTION get_infrastructure_summary()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_summary jsonb;
BEGIN
  SELECT jsonb_build_object(
    'cloud_providers', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM cloud_provider_config WHERE is_active = true),
      'primary', (SELECT provider_code FROM cloud_provider_config WHERE is_primary = true LIMIT 1)
    ),
    'regions', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM regional_deployment_config WHERE is_active = true),
      'healthy', (SELECT COUNT(*) FROM regional_deployment_config WHERE is_active = true)
    ),
    'scaling', jsonb_build_object(
      'active_rules', (SELECT COUNT(*) FROM auto_scaling_rules WHERE is_active = true),
      'events_today', (SELECT COUNT(*) FROM scaling_events_log WHERE created_at::date = current_date)
    ),
    'backups', jsonb_build_object(
      'active_configs', (SELECT COUNT(*) FROM backup_config WHERE is_active = true),
      'last_backup', (SELECT MAX(backup_end_at) FROM backup_history WHERE status = 'completed')
    ),
    'deployments', jsonb_build_object(
      'active_pipelines', (SELECT COUNT(*) FROM deployment_pipelines WHERE is_active = true),
      'production_version', (SELECT version FROM deployment_history WHERE environment = 'production' AND status = 'completed' ORDER BY deployment_completed_at DESC LIMIT 1)
    ),
    'health', jsonb_build_object(
      'services_healthy', (SELECT COUNT(*) FROM high_availability_config WHERE status = 'operational'),
      'services_degraded', (SELECT COUNT(*) FROM high_availability_config WHERE status = 'degraded')
    )
  ) INTO v_summary;

  RETURN v_summary;
END;
$function$;

CREATE OR REPLACE FUNCTION trigger_scaling_rule(
  p_rule_id uuid,
  p_service_type text,
  p_region_code text
)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
  v_rule RECORD;
BEGIN
  SELECT * INTO v_rule FROM auto_scaling_rules WHERE id = p_rule_id AND is_active = true;

  IF v_rule IS NULL THEN
    RAISE EXCEPTION 'Rule not found or inactive';
  END IF;

  INSERT INTO scaling_events_log (
    rule_id, service_type, region_code,
    event_type, previous_instances, new_instances,
    trigger_metric, trigger_value, threshold_value
  )
  SELECT
    p_rule_id, p_service_type, p_region_code,
    'scale_up', 1, 2,
    v_rule.metric_type, 80, v_rule.scale_up_threshold
  WHERE NOT EXISTS (
    SELECT 1 FROM scaling_events_log 
    WHERE rule_id = p_rule_id 
    AND created_at > now() - interval '5 minutes'
  );
END;
$function$;
