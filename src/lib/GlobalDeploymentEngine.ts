/**
 * VLOOP GLOBAL CLOUD INFRASTRUCTURE, SCALABILITY & PRODUCTION DEPLOYMENT ENGINE
 * Phase 46 — Enterprise Production Deployment Architecture
 *
 * This engine provides the complete architecture for:
 * - Cloud Architecture
 * - Auto Scaling
 * - Global CDN
 * - Database Scaling
 * - Performance Layer
 * - High Availability
 * - Monitoring
 * - Backup Strategy
 * - Deployment Pipeline
 * - Global Readiness
 */

import { supabase } from './supabase';

export const DEPLOYMENT_ENGINE_VERSION = '46.0.0' as const;

export const DEPLOYMENT_ENGINE_META = {
  version: DEPLOYMENT_ENGINE_VERSION,
  name: 'VLOOP Global Cloud Infrastructure & Production Deployment Engine',
  lockedSince: '2026-07-03',
} as const;

// ============================================================
// CLOUD PROVIDER CONSTANTS
// ============================================================

export const CLOUD_PROVIDERS = {
  AWS: 'aws',
  GCP: 'gcp',
  AZURE: 'azure',
  DIGITALOCEAN: 'digitalocean',
  CUSTOM: 'custom',
  FUTURE: 'future',
} as const;

export type CloudProvider = typeof CLOUD_PROVIDERS[keyof typeof CLOUD_PROVIDERS];

export const CLOUD_HEALTH_STATUS = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
  MAINTENANCE: 'maintenance',
} as const;

export type CloudHealthStatus = typeof CLOUD_HEALTH_STATUS[keyof typeof CLOUD_HEALTH_STATUS];

// ============================================================
// REGIONAL CONSTANTS
// ============================================================

export const DEPLOYMENT_REGIONS = {
  IN_SOUTH_1: 'in-south-1',
  IN_WEST_1: 'in-west-1',
  AE_DUBAI_1: 'ae-dubai-1',
  EU_WEST_1: 'eu-west-1',
  US_EAST_1: 'us-east-1',
  SG_SOUTHEAST_1: 'sg-southeast-1',
  UK_LONDON_1: 'uk-london-1',
} as const;

export type DeploymentRegion = typeof DEPLOYMENT_REGIONS[keyof typeof DEPLOYMENT_REGIONS];

export const REGION_NAMES: Record<DeploymentRegion, string> = {
  'in-south-1': 'India South (Mumbai)',
  'in-west-1': 'India West (Hyderabad)',
  'ae-dubai-1': 'UAE Dubai',
  'eu-west-1': 'Europe West (Ireland)',
  'us-east-1': 'US East (Virginia)',
  'sg-southeast-1': 'Singapore',
  'uk-london-1': 'UK London',
};

export const DATA_RESIDENCY = {
  DEFAULT: 'default',
  STRICT: 'strict',
  SOVEREIGN: 'sovereign',
} as const;

export type DataResidency = typeof DATA_RESIDENCY[keyof typeof DATA_RESIDENCY];

// ============================================================
// SCALING CONSTANTS
// ============================================================

export const SERVICE_TYPES = {
  CUSTOMERS: 'customers',
  MERCHANTS: 'merchants',
  PARTNERS: 'partners',
  MARKETPLACE: 'marketplace',
  ORDERS: 'orders',
  PAYMENTS: 'payments',
  SMARTCODE: 'smartcode',
  WEEKLY_DRAW: 'weekly_draw',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  API: 'api',
  CDN: 'cdn',
} as const;

export type ServiceType = typeof SERVICE_TYPES[keyof typeof SERVICE_TYPES];

export const METRIC_TYPES = {
  CPU: 'cpu',
  MEMORY: 'memory',
  REQUESTS: 'requests',
  CONNECTIONS: 'connections',
  QUEUE_DEPTH: 'queue_depth',
  LATENCY: 'latency',
} as const;

export type MetricType = typeof METRIC_TYPES[keyof typeof METRIC_TYPES];

export const SCALING_EVENTS = {
  SCALE_UP: 'scale_up',
  SCALE_DOWN: 'scale_down',
  MIN_REACHED: 'min_reached',
  MAX_REACHED: 'max_reached',
  COOLDOWN: 'cooldown',
} as const;

export type ScalingEvent = typeof SCALING_EVENTS[keyof typeof SCALING_EVENTS];

// ============================================================
// CDN CONSTANTS
// ============================================================

export const CDN_TYPES = {
  CLOUDFRONT: 'cloudfront',
  CLOUDFLARE: 'cloudflare',
  FASTLY: 'fastly',
  CUSTOM: 'custom',
  FUTURE: 'future',
} as const;

export type CDNType = typeof CDN_TYPES[keyof typeof CDN_TYPES];

// ============================================================
// BACKUP CONSTANTS
// ============================================================

export const BACKUP_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  POINT_IN_TIME: 'point_in_time',
  MANUAL: 'manual',
} as const;

export type BackupType = typeof BACKUP_TYPES[keyof typeof BACKUP_TYPES];

export const BACKUP_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  EXPIRED: 'expired',
} as const;

export type BackupStatus = typeof BACKUP_STATUS[keyof typeof BACKUP_STATUS];

// ============================================================
// DEPLOYMENT CONSTANTS
// ============================================================

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  TESTING: 'testing',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

export type Environment = typeof ENVIRONMENTS[keyof typeof ENVIRONMENTS];

export const DEPLOYMENT_TYPES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  DATABASE: 'database',
  INFRASTRUCTURE: 'infrastructure',
  FULL_STACK: 'full_stack',
} as const;

export type DeploymentType = typeof DEPLOYMENT_TYPES[keyof typeof DEPLOYMENT_TYPES];

export const DEPLOYMENT_STATUS = {
  PENDING: 'pending',
  BUILDING: 'building',
  TESTING: 'testing',
  DEPLOYING: 'deploying',
  VERIFYING: 'verifying',
  COMPLETED: 'completed',
  FAILED: 'failed',
  ROLLED_BACK: 'rolled_back',
} as const;

export type DeploymentStatus = typeof DEPLOYMENT_STATUS[keyof typeof DEPLOYMENT_STATUS];

// ============================================================
// HIGH AVAILABILITY CONSTANTS
// ============================================================

export const HA_SERVICE_TYPES = {
  API: 'api',
  DATABASE: 'database',
  CACHE: 'cache',
  QUEUE: 'queue',
  CDN: 'cdn',
  WORKER: 'worker',
} as const;

export type HAServiceType = typeof HA_SERVICE_TYPES[keyof typeof HA_SERVICE_TYPES];

export const FAILOVER_STRATEGIES = {
  ACTIVE_PASSIVE: 'active_passive',
  ACTIVE_ACTIVE: 'active_active',
  ROUND_ROBIN: 'round_robin',
} as const;

export type FailoverStrategy = typeof FAILOVER_STRATEGIES[keyof typeof FAILOVER_STRATEGIES];

export const HA_STATUS = {
  OPERATIONAL: 'operational',
  DEGRADED: 'degraded',
  FAILING_OVER: 'failing_over',
  MAINTENANCE: 'maintenance',
} as const;

export type HAStatus = typeof HA_STATUS[keyof typeof HA_STATUS];

// ============================================================
// DISASTER RECOVERY CONSTANTS
// ============================================================

export const DISASTER_TYPES = {
  REGION_FAILURE: 'region_failure',
  DATABASE_FAILURE: 'database_failure',
  COMPLETE_OUTAGE: 'complete_outage',
  DATA_CORRUPTION: 'data_corruption',
  SECURITY_BREACH: 'security_breach',
  DDOS: 'ddos',
} as const;

export type DisasterType = typeof DISASTER_TYPES[keyof typeof DISASTER_TYPES];

// ============================================================
// INTERFACES
// ============================================================

export interface CloudProviderConfig {
  id: string;
  provider_code: CloudProvider;
  provider_name: string;
  is_primary: boolean;
  is_active: boolean;
  region_config: Record<string, unknown>;
  health_status: CloudHealthStatus;
}

export interface RegionalDeploymentConfig {
  id: string;
  region_code: DeploymentRegion;
  region_name: string;
  provider_code: CloudProvider;
  data_residency: DataResidency;
  primary_database_endpoint: string;
  cdn_endpoint: string;
  is_active: boolean;
}

export interface AutoScalingRule {
  id: string;
  rule_name: string;
  service_type: ServiceType;
  metric_type: MetricType;
  scale_up_threshold: number;
  scale_down_threshold: number;
  cooldown_seconds: number;
  min_instances: number;
  max_instances: number;
  is_active: boolean;
}

export interface ScalingEventLog {
  id: string;
  rule_id: string;
  service_type: ServiceType;
  region_code: DeploymentRegion;
  event_type: ScalingEvent;
  previous_instances: number;
  new_instances: number;
  trigger_metric: string;
  success: boolean;
}

export interface CDNConfig {
  id: string;
  cdn_type: CDNType;
  cdn_name: string;
  origin_url: string;
  cdn_url: string;
  cache_ttl_default: number;
  cache_ttl_static: number;
  compression_enabled: boolean;
  ssl_enabled: boolean;
  waf_enabled: boolean;
}

export interface CDNCacheStats {
  id: string;
  cdn_id: string;
  stat_date: string;
  total_requests: number;
  cache_hits: number;
  cache_misses: number;
  hit_rate: number;
  bandwidth_gb: number;
  avg_latency_ms: number;
}

export interface DatabaseScalingConfig {
  id: string;
  database_type: 'primary' | 'replica' | 'shard';
  database_name: string;
  host_endpoint: string;
  region_code: DeploymentRegion;
  is_read_replica: boolean;
  sharding_strategy: 'none' | 'range' | 'hash' | 'list';
  storage_gb: number;
  health_status: CloudHealthStatus;
}

export interface BackupConfig {
  id: string;
  backup_name: string;
  backup_type: BackupType;
  target_database: string;
  storage_location: string;
  retention_days: number;
  encryption_enabled: boolean;
  schedule_cron: string;
  last_backup_status: BackupStatus;
}

export interface BackupHistory {
  id: string;
  backup_id: string;
  backup_start_at: string;
  backup_end_at: string | null;
  backup_size_gb: number | null;
  status: 'running' | 'completed' | 'failed' | 'verified' | 'expired';
}

export interface PerformanceCacheConfig {
  id: string;
  cache_type: 'redis' | 'memcached' | 'cdn' | 'browser' | 'application';
  cache_name: string;
  target_service: string;
  eviction_policy: 'lru' | 'lfu' | 'fifo' | 'ttl';
  default_ttl_seconds: number;
  max_memory_mb: number;
}

export interface HighAvailabilityConfig {
  id: string;
  service_name: string;
  service_type: HAServiceType;
  redundancy_count: number;
  failover_strategy: FailoverStrategy;
  health_check_interval_s: number;
  automatic_failover: boolean;
  current_primary_region: string;
  status: HAStatus;
}

export interface DeploymentPipeline {
  id: string;
  pipeline_name: string;
  deployment_type: DeploymentType;
  repository_url: string;
  branch: string;
  environments: string[];
  auto_rollback_on_failure: boolean;
  approval_required: boolean;
}

export interface DeploymentHistory {
  id: string;
  pipeline_id: string;
  environment: Environment;
  version: string;
  commit_hash: string | null;
  deployed_by: string | null;
  deployment_started_at: string;
  deployment_completed_at: string | null;
  status: DeploymentStatus;
  rollback_version: string | null;
}

export interface InfrastructureMetrics {
  id: string;
  metric_date: string;
  region_code: DeploymentRegion;
  service_type: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface ProductionDashboardStats {
  id: string;
  stat_date: string;
  total_api_requests: number;
  unique_visitors: number;
  avg_api_latency_ms: number;
  error_rate: number;
  total_orders: number;
  smartcode_entries: number;
  avg_cpu_utilization: number;
  cdn_hit_rate: number;
}

export interface DisasterRecoveryPlan {
  id: string;
  plan_name: string;
  disaster_type: DisasterType;
  priority: number;
  target_recovery_time_hours: number;
  recovery_steps: Array<{ step: number; action: string; responsible: string }>;
  is_active: boolean;
}

// ============================================================
// CLOUD PROVIDER FUNCTIONS
// ============================================================

export async function getCloudProviders(): Promise<CloudProviderConfig[]> {
  const { data, error } = await supabase
    .from('cloud_provider_config')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as CloudProviderConfig[];
}

export function getCloudArchitecture(): Record<CloudProvider, { services: string[]; regions: string[] }> {
  return {
    aws: {
      services: ['EC2', 'RDS', 'S3', 'CloudFront', 'Lambda', 'SQS', 'ElastiCache'],
      regions: ['ap-south-1', 'ap-southeast-1', 'eu-west-1', 'us-east-1'],
    },
    gcp: {
      services: ['Compute Engine', 'Cloud SQL', 'Cloud Storage', 'Cloud CDN', 'Cloud Functions'],
      regions: ['asia-south1', 'europe-west1', 'us-east1'],
    },
    azure: {
      services: ['Virtual Machines', 'Azure SQL', 'Blob Storage', 'Azure CDN', 'Functions'],
      regions: ['centralindia', 'westeurope', 'eastus'],
    },
    digitalocean: {
      services: ['Droplets', 'Managed DB', 'Spaces', 'CDN'],
      regions: ['blr1', 'sgp1', 'nyc1'],
    },
    custom: {
      services: ['Custom Infrastructure'],
      regions: ['custom'],
    },
    future: {
      services: ['Future Provider'],
      regions: ['future'],
    },
  };
}

// ============================================================
// REGIONAL FUNCTIONS
// ============================================================

export async function getRegionalConfig(): Promise<RegionalDeploymentConfig[]> {
  const { data, error } = await supabase
    .from('regional_deployment_config')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as RegionalDeploymentConfig[];
}

export function getGlobalReadinessArchitecture(): Array<{ region: DeploymentRegion; compliance: string[]; dataResidency: DataResidency }> {
  return [
    { region: 'in-south-1', compliance: ['DPDP Act', 'ISO 27001'], dataResidency: 'default' },
    { region: 'ae-dubai-1', compliance: ['UAE Data Law'], dataResidency: 'strict' },
    { region: 'eu-west-1', compliance: ['GDPR', 'ISO 27001', 'SOC 2'], dataResidency: 'strict' },
    { region: 'us-east-1', compliance: ['CCPA', 'SOC 2', 'HIPAA ready'], dataResidency: 'default' },
    { region: 'sg-southeast-1', compliance: ['PDPA'], dataResidency: 'default' },
    { region: 'uk-london-1', compliance: ['UK GDPR', 'ISO 27001'], dataResidency: 'strict' },
  ];
}

// ============================================================
// SCALING FUNCTIONS
// ============================================================

export async function getScalingRules(): Promise<AutoScalingRule[]> {
  const { data, error } = await supabase
    .from('auto_scaling_rules')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as AutoScalingRule[];
}

export async function getScalingEvents(limit: number = 50): Promise<ScalingEventLog[]> {
  const { data, error } = await supabase
    .from('scaling_events_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as ScalingEventLog[];
}

export function getScalingArchitecture(): Record<ServiceType, { defaultMin: number; defaultMax: number; scaleMetric: MetricType }> {
  return {
    customers: { defaultMin: 2, defaultMax: 10, scaleMetric: 'cpu' },
    merchants: { defaultMin: 2, defaultMax: 10, scaleMetric: 'cpu' },
    partners: { defaultMin: 2, defaultMax: 8, scaleMetric: 'cpu' },
    marketplace: { defaultMin: 2, defaultMax: 15, scaleMetric: 'cpu' },
    orders: { defaultMin: 3, defaultMax: 20, scaleMetric: 'requests' },
    payments: { defaultMin: 3, defaultMax: 15, scaleMetric: 'requests' },
    smartcode: { defaultMin: 2, defaultMax: 10, scaleMetric: 'cpu' },
    weekly_draw: { defaultMin: 2, defaultMax: 10, scaleMetric: 'cpu' },
    notifications: { defaultMin: 2, defaultMax: 10, scaleMetric: 'queue_depth' },
    analytics: { defaultMin: 2, defaultMax: 8, scaleMetric: 'cpu' },
    api: { defaultMin: 3, defaultMax: 30, scaleMetric: 'requests' },
    cdn: { defaultMin: 1, defaultMax: 1, scaleMetric: 'requests' },
  };
}

// ============================================================
// CDN FUNCTIONS
// ============================================================

export async function getCDNConfigs(): Promise<CDNConfig[]> {
  const { data, error } = await supabase
    .from('cdn_config')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as CDNConfig[];
}

export async function getCDNStats(cdnId: string, days: number = 7): Promise<CDNCacheStats[]> {
  const { data, error } = await supabase
    .from('cdn_cache_stats')
    .select('*')
    .eq('cdn_id', cdnId)
    .order('stat_date', { ascending: false })
    .limit(days);

  if (error) throw error;
  return (data || []) as CDNCacheStats[];
}

export function getCDNArchitecture(): Array<{ type: CDNType; cacheBehaviors: string[]; features: string[] }> {
  return [
    { type: 'cloudfront', cacheBehaviors: ['Static', 'Dynamic', 'Image'], features: ['WAF', 'DDoS Protection', 'SSL'] },
    { type: 'cloudflare', cacheBehaviors: ['Static', 'Performance'], features: ['WAF', 'DDoS', 'Workers'] },
    { type: 'fastly', cacheBehaviors: ['Edge Computing', 'Real-time'], features: ['WAF', 'Instant Purge'] },
  ];
}

// ============================================================
// DATABASE SCALING FUNCTIONS
// ============================================================

export async function getDatabaseConfigs(): Promise<DatabaseScalingConfig[]> {
  const { data, error } = await supabase
    .from('database_scaling_config')
    .select('*');

  if (error) throw error;
  return (data || []) as DatabaseScalingConfig[];
}

export function getDatabaseScalingArchitecture(): Record<string, { strategy: string; replicas: number; features: string[] }> {
  return {
    primary: {
      strategy: 'Write Master',
      replicas: 0,
      features: ['Automatic Failover', 'Point-in-Time Recovery', 'Encryption at Rest'],
    },
    replica: {
      strategy: 'Read Replica',
      replicas: 3,
      features: ['Read Scaling', 'Geo-Distribution', 'Failover Target'],
    },
    shard: {
      strategy: 'Horizontal Sharding',
      replicas: 5,
      features: ['Hash Partitioning', 'Parallel Query', 'Scale-Out Ready'],
    },
  };
}

// ============================================================
// BACKUP FUNCTIONS
// ============================================================

export async function getBackupConfigs(): Promise<BackupConfig[]> {
  const { data, error } = await supabase
    .from('backup_config')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as BackupConfig[];
}

export async function getBackupHistory(backupId: string, limit: number = 30): Promise<BackupHistory[]> {
  const { data, error } = await supabase
    .from('backup_history')
    .select('*')
    .eq('backup_id', backupId)
    .order('backup_start_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as BackupHistory[];
}

export function getBackupArchitecture(): Array<{ type: BackupType; frequency: string; retention: string; rpo: string }> {
  return [
    { type: 'daily', frequency: 'Daily at 2 AM UTC', retention: '30 days', rpo: '24 hours' },
    { type: 'weekly', frequency: 'Weekly on Sunday', retention: '90 days', rpo: '7 days' },
    { type: 'monthly', frequency: 'Monthly on 1st', retention: '365 days', rpo: '30 days' },
    { type: 'point_in_time', frequency: 'Every 15 minutes', retention: '7 days', rpo: '15 minutes' },
  ];
}

// ============================================================
// PERFORMANCE FUNCTIONS
// ============================================================

export async function getPerformanceCacheConfigs(): Promise<PerformanceCacheConfig[]> {
  const { data, error } = await supabase
    .from('performance_cache_config')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as PerformanceCacheConfig[];
}

export function getPerformanceArchitecture(): Array<{ layer: string; technology: string; purpose: string }> {
  return [
    { layer: 'Browser Cache', technology: 'HTTP Headers', purpose: 'Static assets, user preferences' },
    { layer: 'CDN Cache', technology: 'CloudFront', purpose: 'Images, documents, static content' },
    { layer: 'Application Cache', technology: 'Redis', purpose: 'Session, product catalog, balance' },
    { layer: 'Database Cache', technology: 'PostgreSQL Buffer', purpose: 'Query results, indexes' },
    { layer: 'API Cache', technology: 'Response Headers', purpose: 'Frequently accessed endpoints' },
  ];
}

// ============================================================
// HIGH AVAILABILITY FUNCTIONS
// ============================================================

export async function getHAConfigs(): Promise<HighAvailabilityConfig[]> {
  const { data, error } = await supabase
    .from('high_availability_config')
    .select('*');

  if (error) throw error;
  return (data || []) as HighAvailabilityConfig[];
}

export function getHAArchitecture(): Array<{ component: string; redundancy: number; failover: FailoverStrategy }> {
  return [
    { component: 'API Gateway', redundancy: 3, failover: 'active_active' },
    { component: 'Database Primary', redundancy: 2, failover: 'active_passive' },
    { component: 'Redis Cache', redundancy: 2, failover: 'active_passive' },
    { component: 'Notification Queue', redundancy: 2, failover: 'active_passive' },
    { component: 'CDN Edge', redundancy: 5, failover: 'active_active' },
  ];
}

// ============================================================
// DEPLOYMENT FUNCTIONS
// ============================================================

export async function getDeploymentPipelines(): Promise<DeploymentPipeline[]> {
  const { data, error } = await supabase
    .from('deployment_pipelines')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as DeploymentPipeline[];
}

export async function getDeploymentHistory(
  environment?: Environment,
  limit: number = 20
): Promise<DeploymentHistory[]> {
  let query = supabase
    .from('deployment_history')
    .select('*');

  if (environment) {
    query = query.eq('environment', environment);
  }

  const { data, error } = await query
    .order('deployment_started_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as DeploymentHistory[];
}

export function getCIPipelineArchitecture(): Array<{ stage: string; actions: string[]; gateRequired: boolean }> {
  return [
    { stage: 'Build', actions: ['Compile', 'Bundle', 'Generate Artifacts'], gateRequired: false },
    { stage: 'Test', actions: ['Unit Tests', 'Integration Tests', 'E2E Tests'], gateRequired: true },
    { stage: 'Security Scan', actions: ['SAST', 'Dependency Check', 'Secret Scan'], gateRequired: true },
    { stage: 'Deploy Dev', actions: ['Infrastructure Provision', 'Deploy Services'], gateRequired: false },
    { stage: 'Deploy Staging', actions: ['Database Migration', 'Deploy Application'], gateRequired: true },
    { stage: 'Deploy Production', actions: ['Blue-Green Deploy', 'Health Check', 'Traffic Shift'], gateRequired: true },
  ];
}

// ============================================================
// MONITORING FUNCTIONS
// ============================================================

export async function getInfrastructureMetrics(
  serviceType?: string,
  regionCode?: DeploymentRegion,
  minutes: number = 60
): Promise<InfrastructureMetrics[]> {
  let query = supabase
    .from('infrastructure_metrics')
    .select('*')
    .gte('metric_date', new Date(Date.now() - minutes * 60 * 1000).toISOString());

  if (serviceType) {
    query = query.eq('service_type', serviceType);
  }
  if (regionCode) {
    query = query.eq('region_code', regionCode);
  }

  const { data, error } = await query.order('metric_date', { ascending: false });
  if (error) throw error;
  return (data || []) as InfrastructureMetrics[];
}

export function getMonitoringArchitecture(): Array<{ type: string; services: string[]; alertThreshold: number }> {
  return [
    { type: 'CPU', services: ['EC2', 'RDS', 'ElastiCache'], alertThreshold: 75 },
    { type: 'Memory', services: ['EC2', 'RDS', 'ElastiCache'], alertThreshold: 80 },
    { type: 'Storage', services: ['RDS', 'S3', 'EBS'], alertThreshold: 85 },
    { type: 'Network', services: ['VPC', 'CloudFront'], alertThreshold: 1000 },
    { type: 'API', services: ['API Gateway', 'Lambda'], alertThreshold: 500 },
    { type: 'Database', services: ['RDS Primary', 'Replicas'], alertThreshold: 100 },
  ];
}

// ============================================================
// DR FUNCTIONS
// ============================================================

export async function getDisasterRecoveryPlans(): Promise<DisasterRecoveryPlan[]> {
  const { data, error } = await supabase
    .from('disaster_recovery_plans')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as DisasterRecoveryPlan[];
}

export function getDRArchitecture(): Array<{ disaster: DisasterType; rto: number; rpo: number; strategy: string }> {
  return [
    { disaster: 'region_failure', rto: 4, rpo: 1, strategy: 'Failover to secondary region' },
    { disaster: 'database_failure', rto: 2, rpo: 0.25, strategy: 'Point-in-time recovery' },
    { disaster: 'complete_outage', rto: 8, rpo: 1, strategy: 'Multi-region deployment' },
    { disaster: 'data_corruption', rto: 4, rpo: 0.25, strategy: 'Backup restore + PITR' },
    { disaster: 'security_breach', rto: 2, rpo: 0, strategy: 'Isolate + analyze + restore' },
    { disaster: 'ddos', rto: 0.5, rpo: 0, strategy: 'CDN + WAF mitigation' },
  ];
}

// ============================================================
// PRODUCTION DASHBOARD FUNCTIONS
// ============================================================

export async function getProductionDashboard(): Promise<ProductionDashboardStats | null> {
  const { data, error } = await supabase
    .from('production_dashboard_stats')
    .select('*')
    .order('stat_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as ProductionDashboardStats | null;
}

export async function getProductionDashboardTrend(days: number = 7): Promise<ProductionDashboardStats[]> {
  const { data, error } = await supabase
    .from('production_dashboard_stats')
    .select('*')
    .order('stat_date', { ascending: false })
    .limit(days);

  if (error) throw error;
  return (data || []) as ProductionDashboardStats[];
}

export async function getInfrastructureSummary(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('get_infrastructure_summary');
  if (error) throw error;
  return data;
}

export function getDashboardArchitecture(): Array<{ section: string; metrics: string[]; refreshRate: string }> {
  return [
    { section: 'System Health', metrics: ['CPU', 'Memory', 'Storage', 'Network'], refreshRate: '1 min' },
    { section: 'Performance', metrics: ['Latency P50/P95/P99', 'Throughput', 'Error Rate'], refreshRate: '1 min' },
    { section: 'Traffic', metrics: ['Requests/s', 'Active Users', 'Geographic Distribution'], refreshRate: '5 min' },
    { section: 'Orders', metrics: ['Order Count', 'Success Rate', 'Processing Time'], refreshRate: 'Real-time' },
    { section: 'Payments', metrics: ['Transactions', 'Success Rate', 'Revenue'], refreshRate: 'Real-time' },
    { section: 'SmartCode', metrics: ['Entries', 'Registrations', 'Weekly Draw'], refreshRate: '5 min' },
    { section: 'Marketplace', metrics: ['Active Products', 'Active Merchants', 'Orders'], refreshRate: '5 min' },
    { section: 'Security', metrics: ['Incidents', 'Alerts', 'Trust Score'], refreshRate: '1 min' },
  ];
}
