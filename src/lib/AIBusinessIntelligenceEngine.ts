/**
 * VLOOP GLOBAL AI BUSINESS INTELLIGENCE & ANALYTICS ENGINE
 * Phase 44 — Enterprise AI Business Intelligence & Analytics Layer
 *
 * This engine provides the complete architecture for:
 * - Global AI Analytics Center
 * - Customer Analytics
 * - Merchant Analytics
 * - Partner Analytics
 * - Marketplace Analytics
 * - SmartCode Analytics
 * - Care Club Analytics
 * - Wallet Analytics
 * - AI Prediction Engine
 * - Executive KPI Panel
 * - AI Insights
 * - Export System
 */

import { supabase } from './supabase';

export const AI_BI_ENGINE_VERSION = '44.0.0' as const;

export const AI_BI_ENGINE_META = {
  version: AI_BI_ENGINE_VERSION,
  name: 'VLOOP Global AI Business Intelligence & Analytics Engine',
  lockedSince: '2026-07-03',
} as const;

// ============================================================
// ANALYTICS PERIOD CONSTANTS
// ============================================================

export const ANALYTICS_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime',
} as const;

export type AnalyticsPeriod = typeof ANALYTICS_PERIODS[keyof typeof ANALYTICS_PERIODS];

// ============================================================
// PREDICTION TYPES
// ============================================================

export const PREDICTION_TYPES = {
  SALES_FORECAST: 'sales_forecast',
  DEMAND_FORECAST: 'demand_forecast',
  CUSTOMER_RETENTION: 'customer_retention',
  REWARD_BUDGET: 'reward_budget',
  CARECLUB_GROWTH: 'careclub_growth',
  INVENTORY_FORECAST: 'inventory_forecast',
  PARTNER_EXPANSION: 'partner_expansion',
  FUTURE_PROJECT_READINESS: 'future_project_readiness',
  CLV_PREDICTION: 'clv_prediction',
  CHURN_PREDICTION: 'churn_prediction',
  PURCHASE_PROBABILITY: 'purchase_probability',
} as const;

export type PredictionType = typeof PREDICTION_TYPES[keyof typeof PREDICTION_TYPES];

// ============================================================
// INSIGHT TYPES
// ============================================================

export const INSIGHT_TYPES = {
  TOP_PERFORMING_REGION: 'top_performing_region',
  MOST_ACTIVE_CUSTOMERS: 'most_active_customers',
  FASTEST_GROWING_CATEGORY: 'fastest_growing_category',
  RISK_ALERT: 'risk_alert',
  BUSINESS_OPPORTUNITY: 'business_opportunity',
  GROWTH_SUGGESTION: 'growth_suggestion',
  ANOMALY_DETECTION: 'anomaly_detection',
  TREND_ANALYSIS: 'trend_analysis',
  PERFORMANCE_ALERT: 'performance_alert',
  OPTIMIZATION_RECOMMENDATION: 'optimization_recommendation',
} as const;

export type InsightType = typeof INSIGHT_TYPES[keyof typeof INSIGHT_TYPES];

export const INSIGHT_CATEGORIES = {
  CUSTOMER: 'customer',
  MERCHANT: 'merchant',
  PARTNER: 'partner',
  MARKETPLACE: 'marketplace',
  SMARTCODE: 'smartcode',
  CARECLUB: 'careclub',
  WALLET: 'wallet',
  REVENUE: 'revenue',
  GROWTH: 'growth',
  RISK: 'risk',
  OPERATIONS: 'operations',
} as const;

export type InsightCategory = typeof INSIGHT_CATEGORIES[keyof typeof INSIGHT_CATEGORIES];

export const INSIGHT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical',
  OPPORTUNITY: 'opportunity',
} as const;

export type InsightSeverity = typeof INSIGHT_SEVERITY[keyof typeof INSIGHT_SEVERITY];

// ============================================================
// DASHBOARD TYPES
// ============================================================

export const DASHBOARD_TYPES = {
  CUSTOMER: 'customer',
  MERCHANT: 'merchant',
  PARTNER: 'partner',
  ADMIN: 'admin',
  EXECUTIVE: 'executive',
} as const;

export type DashboardType = typeof DASHBOARD_TYPES[keyof typeof DASHBOARD_TYPES];

// ============================================================
// EXPORT TYPES
// ============================================================

export const EXPORT_TYPES = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json',
} as const;

export type ExportType = typeof EXPORT_TYPES[keyof typeof EXPORT_TYPES];

export const REPORT_CATEGORIES = {
  CUSTOMER_ANALYTICS: 'customer_analytics',
  MERCHANT_ANALYTICS: 'merchant_analytics',
  PARTNER_ANALYTICS: 'partner_analytics',
  MARKETPLACE_ANALYTICS: 'marketplace_analytics',
  SMARTCODE_ANALYTICS: 'smartcode_analytics',
  CARECLUB_ANALYTICS: 'careclub_analytics',
  WALLET_ANALYTICS: 'wallet_analytics',
  EXECUTIVE_SUMMARY: 'executive_summary',
  CUSTOM: 'custom',
} as const;

export type ReportCategory = typeof REPORT_CATEGORIES[keyof typeof REPORT_CATEGORIES];

// ============================================================
// ENTITY TYPES
// ============================================================

export const ENTITY_TYPES = {
  CUSTOMER: 'customer',
  MERCHANT: 'merchant',
  PARTNER: 'partner',
  PRODUCT: 'product',
  CATEGORY: 'category',
  PLATFORM: 'platform',
} as const;

export type EntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES];

// ============================================================
// INTERFACES
// ============================================================

export interface CustomerAnalytics {
  id: string;
  user_id: string;
  analytics_period: AnalyticsPeriod;
  total_purchases: number;
  purchase_frequency: number;
  average_purchase_value: number;
  total_spent: number;
  careclub_contributions: number;
  careclub_total: number;
  smartpoints_earned: number;
  smartpoints_redeemed: number;
  smartcodes_generated: number;
  weekly_draws_participated: number;
  rewards_won: number;
  rewards_total_value: number;
  wallet1_credits: number;
  wallet1_debits: number;
  wallet2_credits: number;
  wallet2_debits: number;
  referrals_made: number;
  successful_referrals: number;
  customer_lifetime_value: number;
  last_purchase_at: string | null;
  first_purchase_at: string | null;
  computed_at: string;
}

export interface MerchantAnalyticsExtended {
  id: string;
  seller_id: string;
  analytics_period: AnalyticsPeriod;
  total_sales: number;
  total_orders: number;
  total_revenue: number;
  platform_fees: number;
  net_earnings: number;
  unique_customers: number;
  repeat_customers: number;
  repeat_rate: number;
  cancellations: number;
  cancellation_rate: number;
  refunds: number;
  refund_rate: number;
  refund_amount: number;
  avg_rating: number | null;
  total_reviews: number;
  health_score: number;
  last_order_at: string | null;
}

export interface PartnerEcosystemAnalytics {
  id: string;
  partner_id: string;
  partner_type: 'district' | 'state' | 'global';
  analytics_period: AnalyticsPeriod;
  new_members_recruited: number;
  active_members: number;
  total_members: number;
  business_generated: number;
  transactions_facilitated: number;
  commission_earned: number;
  commission_pending: number;
  regional_growth_rate: number;
  avg_member_purchase: number;
  trust_index: number;
}

export interface SmartCodeAnalytics {
  id: string;
  analytics_period: AnalyticsPeriod;
  period_date: string;
  total_smartcodes_generated: number;
  total_points_committed: number;
  unique_users_participating: number;
  avg_smartcodes_per_user: number;
  duplicate_attempts: number;
  duplicate_blocked: number;
  registration_success_rate: number;
  weekly_draws_completed: number;
  prime_winners: number;
  premium_winners: number;
  standard_winners: number;
  total_rewards_distributed: number;
  pool_allocation_accuracy: number;
  ai_validation_success_rate: number;
  fraud_attempts_detected: number;
}

export interface CareClubAnalyticsExtended {
  id: string;
  analytics_period: AnalyticsPeriod;
  period_date: string;
  total_contributions: number;
  total_contribution_amount: number;
  unique_contributors: number;
  new_contributors: number;
  avg_contribution_per_user: number;
  daily_growth_rate: number;
  weekly_growth_rate: number;
  monthly_growth_rate: number;
  contribution_frequency: number;
  retention_rate: number;
  community_health_index: number;
  fund_utilization_rate: number;
}

export interface WalletAnalytics {
  id: string;
  analytics_period: AnalyticsPeriod;
  period_date: string;
  total_wallet1_balance: number;
  total_wallet2_balance: number;
  wallet1_credits_count: number;
  wallet1_credits_total: number;
  wallet1_debits_count: number;
  wallet1_debits_total: number;
  wallet2_credits_count: number;
  wallet2_credits_total: number;
  wallet2_releases_count: number;
  wallet2_releases_total: number;
  activation_queue_count: number;
  activation_queue_amount: number;
  expiring_soon_count: number;
  expiring_soon_amount: number;
  avg_wallet_balance: number;
}

export interface AIPredictionModel {
  id: string;
  model_code: string;
  model_name: string;
  prediction_type: PredictionType;
  model_version: string;
  model_config: Record<string, unknown>;
  features_used: string[];
  accuracy_score: number | null;
  precision_score: number | null;
  recall_score: number | null;
  last_trained_at: string | null;
  prediction_horizon_days: number;
  is_active: boolean;
}

export interface AIPrediction {
  id: string;
  model_id: string;
  entity_type: EntityType;
  entity_id: string | null;
  prediction_date: string;
  prediction_horizon: string;
  predicted_value: number;
  confidence_score: number;
  confidence_interval_low: number | null;
  confidence_interval_high: number | null;
  features_json: Record<string, unknown>;
  recommendation: string | null;
  status: 'pending' | 'validated' | 'actualized' | 'invalidated';
  actual_value: number | null;
  variance: number | null;
}

export interface ExecutiveKPI {
  id: string;
  kpi_date: string;
  total_customers: number;
  active_customers_today: number;
  active_customers_week: number;
  active_customers_month: number;
  new_customers_today: number;
  new_customers_week: number;
  new_customers_month: number;
  daily_orders: number;
  weekly_orders: number;
  monthly_orders: number;
  daily_revenue: number;
  weekly_revenue: number;
  monthly_revenue: number;
  careclub_fund_total: number;
  careclub_contributors_today: number;
  careclub_contributions_today: number;
  smartpoints_generated_today: number;
  smartpoints_generated_week: number;
  smartpoints_generated_month: number;
  weekly_winners_count: number;
  weekly_rewards_distributed: number;
  smartcodes_registered_today: number;
  total_merchants: number;
  active_merchants: number;
  total_partners: number;
  active_partners: number;
  avg_trust_score: number;
  high_trust_customers: number;
  week_over_week_growth: number;
  month_over_month_growth: number;
}

export interface AIInsight {
  id: string;
  insight_type: InsightType;
  insight_category: InsightCategory;
  title: string;
  description: string;
  entity_type: string | null;
  entity_id: string | null;
  data_reference: Record<string, unknown>;
  metrics: Record<string, unknown>;
  severity: InsightSeverity;
  confidence_score: number;
  action_suggested: string | null;
  action_taken: boolean;
  is_active: boolean;
  created_at: string;
}

export interface DashboardConfiguration {
  id: string;
  dashboard_type: DashboardType;
  name: string;
  config_json: Record<string, unknown>;
  widgets: Array<{ type: string; title: string; metric: string }>;
  default_refresh_interval: number;
  is_default: boolean;
}

export interface ExportConfiguration {
  id: string;
  export_type: ExportType;
  report_name: string;
  report_category: ReportCategory;
  query_config: Record<string, unknown>;
  columns_config: Array<{ field: string; label: string }>;
  filters: Record<string, unknown>;
  sorting: Array<{ field: string; direction: 'asc' | 'desc' }>;
  is_scheduled: boolean;
  schedule_config: Record<string, unknown>;
}

// ============================================================
// CUSTOMER ANALYTICS FUNCTIONS
// ============================================================

export async function getCustomerAnalytics(
  userId: string,
  period?: AnalyticsPeriod
): Promise<CustomerAnalytics[]> {
  let query = supabase
    .from('customer_analytics')
    .select('*')
    .eq('user_id', userId);

  if (period) {
    query = query.eq('analytics_period', period);
  }

  const { data, error } = await query.order('computed_at', { ascending: false });
  if (error) throw error;
  return (data || []) as CustomerAnalytics[];
}

export async function computeCustomerAnalytics(
  userId: string,
  period: AnalyticsPeriod
): Promise<void> {
  const { error } = await supabase.rpc('compute_customer_analytics', {
    p_user_id: userId,
    p_period: period,
  });
  if (error) throw error;
}

export function getCustomerMetrics(): Array<{ metric: string; description: string; type: string }> {
  return [
    { metric: 'total_purchases', description: 'Total number of purchases', type: 'count' },
    { metric: 'purchase_frequency', description: 'Average purchases per month', type: 'rate' },
    { metric: 'average_purchase_value', description: 'Avg order amount', type: 'currency' },
    { metric: 'total_spent', description: 'Lifetime spend', type: 'currency' },
    { metric: 'careclub_contributions', description: 'Care Club contributions', type: 'count' },
    { metric: 'smartpoints_earned', description: 'Total SmartPoints earned', type: 'points' },
    { metric: 'smartcodes_generated', description: 'SmartCodes created', type: 'count' },
    { metric: 'weekly_draws_participated', description: 'Weekly draws joined', type: 'count' },
    { metric: 'rewards_won', description: 'Rewards won', type: 'count' },
    { metric: 'customer_lifetime_value', description: 'Predicted CLV', type: 'currency' },
  ];
}

// ============================================================
// MERCHANT ANALYTICS FUNCTIONS
// ============================================================

export async function getMerchantAnalytics(
  sellerId: string,
  period?: AnalyticsPeriod
): Promise<MerchantAnalyticsExtended[]> {
  let query = supabase
    .from('merchant_analytics_extended')
    .select('*')
    .eq('seller_id', sellerId);

  if (period) {
    query = query.eq('analytics_period', period);
  }

  const { data, error } = await query.order('computed_at', { ascending: false });
  if (error) throw error;
  return (data || []) as MerchantAnalyticsExtended[];
}

export function getMerchantMetrics(): Array<{ metric: string; description: string; type: string }> {
  return [
    { metric: 'total_sales', description: 'Total items sold', type: 'count' },
    { metric: 'total_orders', description: 'Total orders', type: 'count' },
    { metric: 'total_revenue', description: 'Total revenue', type: 'currency' },
    { metric: 'platform_fees', description: 'Platform fees paid', type: 'currency' },
    { metric: 'net_earnings', description: 'Net earnings', type: 'currency' },
    { metric: 'unique_customers', description: 'Unique customers', type: 'count' },
    { metric: 'repeat_rate', description: 'Customer repeat rate', type: 'percent' },
    { metric: 'cancellation_rate', description: 'Order cancellation rate', type: 'percent' },
    { metric: 'refund_rate', description: 'Refund rate', type: 'percent' },
    { metric: 'avg_rating', description: 'Average rating', type: 'rating' },
    { metric: 'health_score', description: 'Health score (0-100)', type: 'score' },
  ];
}

// ============================================================
// PARTNER ANALYTICS FUNCTIONS
// ============================================================

export async function getPartnerAnalytics(
  partnerId: string,
  period?: AnalyticsPeriod
): Promise<PartnerEcosystemAnalytics[]> {
  let query = supabase
    .from('partner_ecosystem_analytics')
    .select('*')
    .eq('partner_id', partnerId);

  if (period) {
    query = query.eq('analytics_period', period);
  }

  const { data, error } = await query.order('computed_at', { ascending: false });
  if (error) throw error;
  return (data || []) as PartnerEcosystemAnalytics[];
}

export function getPartnerMetrics(): Array<{ metric: string; description: string; type: string }> {
  return [
    { metric: 'new_members_recruited', description: 'New members this period', type: 'count' },
    { metric: 'active_members', description: 'Active members', type: 'count' },
    { metric: 'total_members', description: 'Total members under network', type: 'count' },
    { metric: 'business_generated', description: 'Business generated', type: 'currency' },
    { metric: 'commission_earned', description: 'Commission earned', type: 'currency' },
    { metric: 'regional_growth_rate', description: 'Regional growth rate', type: 'percent' },
    { metric: 'trust_index', description: 'Partner trust index', type: 'score' },
  ];
}

// ============================================================
// SMARTCODE ANALYTICS FUNCTIONS
// ============================================================

export async function getSmartCodeAnalytics(
  startDate?: string,
  endDate?: string
): Promise<SmartCodeAnalytics[]> {
  let query = supabase
    .from('smartcode_analytics')
    .select('*');

  if (startDate) {
    query = query.gte('period_date', startDate);
  }
  if (endDate) {
    query = query.lte('period_date', endDate);
  }

  const { data, error } = await query.order('period_date', { ascending: false });
  if (error) throw error;
  return (data || []) as SmartCodeAnalytics[];
}

export function getSmartCodeMetrics(): Array<{ metric: string; description: string; type: string }> {
  return [
    { metric: 'total_smartcodes_generated', description: 'Total SmartCodes created', type: 'count' },
    { metric: 'total_points_committed', description: 'Points committed to codes', type: 'points' },
    { metric: 'unique_users_participating', description: 'Unique participants', type: 'count' },
    { metric: 'duplicate_attempts', description: 'Duplicate code attempts', type: 'count' },
    { metric: 'registration_success_rate', description: 'Registration success', type: 'percent' },
    { metric: 'prime_winners', description: 'Prime winners (₹400)', type: 'count' },
    { metric: 'premium_winners', description: 'Premium winners (₹200)', type: 'count' },
    { metric: 'standard_winners', description: 'Standard winners (₹100)', type: 'count' },
    { metric: 'total_rewards_distributed', description: 'Total rewards paid', type: 'currency' },
    { metric: 'pool_allocation_accuracy', description: 'AI allocation accuracy', type: 'percent' },
  ];
}

// ============================================================
// CARECLUB ANALYTICS FUNCTIONS
// ============================================================

export async function getCareClubAnalytics(
  startDate?: string,
  endDate?: string
): Promise<CareClubAnalyticsExtended[]> {
  let query = supabase
    .from('careclub_analytics_extended')
    .select('*');

  if (startDate) {
    query = query.gte('period_date', startDate);
  }
  if (endDate) {
    query = query.lte('period_date', endDate);
  }

  const { data, error } = await query.order('period_date', { ascending: false });
  if (error) throw error;
  return (data || []) as CareClubAnalyticsExtended[];
}

export function getCareClubMetrics(): Array<{ metric: string; description: string; type: string }> {
  return [
    { metric: 'total_contributions', description: 'Total contributions', type: 'count' },
    { metric: 'total_contribution_amount', description: 'Total contributed', type: 'currency' },
    { metric: 'unique_contributors', description: 'Unique contributors', type: 'count' },
    { metric: 'daily_growth_rate', description: 'Daily growth rate', type: 'percent' },
    { metric: 'weekly_growth_rate', description: 'Weekly growth rate', type: 'percent' },
    { metric: 'monthly_growth_rate', description: 'Monthly growth rate', type: 'percent' },
    { metric: 'retention_rate', description: 'Contributor retention', type: 'percent' },
    { metric: 'community_health_index', description: 'Community health', type: 'score' },
  ];
}

// ============================================================
// WALLET ANALYTICS FUNCTIONS
// ============================================================

export async function getWalletAnalytics(
  startDate?: string,
  endDate?: string
): Promise<WalletAnalytics[]> {
  let query = supabase.from('wallet_analytics').select('*');

  if (startDate) {
    query = query.gte('period_date', startDate);
  }
  if (endDate) {
    query = query.lte('period_date', endDate);
  }

  const { data, error } = await query.order('period_date', { ascending: false });
  if (error) throw error;
  return (data || []) as WalletAnalytics[];
}

export function getWalletMetrics(): Array<{ metric: string; description: string; type: string }> {
  return [
    { metric: 'total_wallet1_balance', description: 'Total Wallet-1 balance', type: 'currency' },
    { metric: 'total_wallet2_balance', description: 'Total Wallet-2 balance', type: 'currency' },
    { metric: 'wallet1_credits_total', description: 'Wallet-1 credits', type: 'currency' },
    { metric: 'wallet1_debits_total', description: 'Wallet-1 debits', type: 'currency' },
    { metric: 'wallet2_credits_total', description: 'Wallet-2 credits', type: 'currency' },
    { metric: 'wallet2_releases_total', description: 'Wallet-2 releases', type: 'currency' },
    { metric: 'activation_queue_count', description: 'Pending activations', type: 'count' },
    { metric: 'avg_wallet_balance', description: 'Average user balance', type: 'currency' },
  ];
}

// ============================================================
// PREDICTION FUNCTIONS
// ============================================================

export async function getPredictionModels(): Promise<AIPredictionModel[]> {
  const { data, error } = await supabase
    .from('ai_prediction_models')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as AIPredictionModel[];
}

export async function getPredictions(
  modelId?: string,
  entityType?: EntityType
): Promise<AIPrediction[]> {
  let query = supabase.from('ai_predictions').select('*');

  if (modelId) {
    query = query.eq('model_id', modelId);
  }
  if (entityType) {
    query = query.eq('entity_type', entityType);
  }

  const { data, error } = await query.order('prediction_date', { ascending: false });
  if (error) throw error;
  return (data || []) as AIPrediction[];
}

export function getPredictionArchitecture(): Array<{ type: PredictionType; horizonDays: number; purpose: string }> {
  return [
    { type: 'sales_forecast', horizonDays: 30, purpose: 'Predict daily/weekly sales' },
    { type: 'demand_forecast', horizonDays: 30, purpose: 'Predict product demand' },
    { type: 'customer_retention', horizonDays: 90, purpose: 'Predict at-risk customers' },
    { type: 'reward_budget', horizonDays: 7, purpose: 'Predict weekly reward allocation' },
    { type: 'careclub_growth', horizonDays: 30, purpose: 'Predict Care Club growth' },
    { type: 'inventory_forecast', horizonDays: 14, purpose: 'Predict inventory needs' },
    { type: 'partner_expansion', horizonDays: 90, purpose: 'Predict partner opportunities' },
    { type: 'future_project_readiness', horizonDays: 180, purpose: 'Project launch readiness' },
    { type: 'clv_prediction', horizonDays: 365, purpose: 'Customer lifetime value' },
    { type: 'churn_prediction', horizonDays: 30, purpose: 'Predict customer churn' },
    { type: 'purchase_probability', horizonDays: 7, purpose: 'Purchase likelihood' },
  ];
}

// ============================================================
// EXECUTIVE KPI FUNCTIONS
// ============================================================

export async function getExecutiveKPIs(date?: string): Promise<ExecutiveKPI | null> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('executive_kpi_panel')
    .select('*')
    .eq('kpi_date', targetDate)
    .maybeSingle();

  if (error) throw error;
  return data as ExecutiveKPI | null;
}

export async function computeExecutiveKPIs(): Promise<void> {
  const { error } = await supabase.rpc('compute_executive_kpis');
  if (error) throw error;
}

export async function getAnalyticsSummary(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('get_analytics_summary');
  if (error) throw error;
  return data;
}

export function getExecutiveKPIMetrics(): Array<{ metric: string; description: string; category: string }> {
  return [
    // Customer
    { metric: 'total_customers', description: 'Total registered customers', category: 'Customer' },
    { metric: 'active_customers_today', description: 'Active today', category: 'Customer' },
    { metric: 'active_customers_week', description: 'Active this week', category: 'Customer' },
    { metric: 'active_customers_month', description: 'Active this month', category: 'Customer' },
    { metric: 'new_customers_month', description: 'New this month', category: 'Customer' },
    // Orders
    { metric: 'daily_orders', description: 'Orders today', category: 'Orders' },
    { metric: 'weekly_orders', description: 'Orders this week', category: 'Orders' },
    { metric: 'monthly_orders', description: 'Orders this month', category: 'Orders' },
    // Revenue
    { metric: 'daily_revenue', description: 'Revenue today', category: 'Revenue' },
    { metric: 'weekly_revenue', description: 'Revenue this week', category: 'Revenue' },
    { metric: 'monthly_revenue', description: 'Revenue this month', category: 'Revenue' },
    // Care Club
    { metric: 'careclub_fund_total', description: 'Care Club fund total', category: 'Care Club' },
    { metric: 'careclub_contributors_today', description: 'Contributors today', category: 'Care Club' },
    // SmartCode
    { metric: 'weekly_winners_count', description: 'Winners this week', category: 'SmartCode' },
    { metric: 'weekly_rewards_distributed', description: 'Rewards distributed', category: 'SmartCode' },
    // Trust
    { metric: 'avg_trust_score', description: 'Average trust score', category: 'Trust' },
    { metric: 'high_trust_customers', description: 'High trust customers', category: 'Trust' },
    // Growth
    { metric: 'week_over_week_growth', description: 'W-O-W growth %', category: 'Growth' },
    { metric: 'month_over_month_growth', description: 'M-O-M growth %', category: 'Growth' },
  ];
}

// ============================================================
// INSIGHTS FUNCTIONS
// ============================================================

export async function getInsights(
  options?: {
    category?: InsightCategory;
    severity?: InsightSeverity;
    activeOnly?: boolean;
  }
): Promise<AIInsight[]> {
  let query = supabase.from('ai_insights_bq').select('*');

  if (options?.category) {
    query = query.eq('insight_category', options.category);
  }
  if (options?.severity) {
    query = query.eq('severity', options.severity);
  }
  if (options?.activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as AIInsight[];
}

export async function generateInsight(
  insightType: InsightType,
  category: InsightCategory,
  title: string,
  description: string,
  metrics?: Record<string, unknown>
): Promise<string> {
  const { data, error } = await supabase.rpc('generate_insight', {
    p_insight_type: insightType,
    p_category: category,
    p_title: title,
    p_description: description,
    p_metrics: metrics || {},
  });

  if (error) throw error;
  return data;
}

export async function markInsightAction(insightId: string, actionTaken: boolean): Promise<void> {
  const { error } = await supabase
    .from('ai_insights_bq')
    .update({
      action_taken: actionTaken,
      action_taken_at: actionTaken ? new Date().toISOString() : null,
    })
    .eq('id', insightId);

  if (error) throw error;
}

export function getInsightTemplates(): Array<{ type: InsightType; category: InsightCategory; template: string }> {
  return [
    { type: 'top_performing_region', category: 'growth', template: '{region} leads with {value}% growth' },
    { type: 'most_active_customers', category: 'customer', template: 'Top {count} customers generated {value}' },
    { type: 'fastest_growing_category', category: 'marketplace', template: '{category} grew {percent}% this month' },
    { type: 'risk_alert', category: 'risk', template: '{count} potential issues detected in {area}' },
    { type: 'business_opportunity', category: 'growth', template: 'Opportunity: {description}' },
    { type: 'growth_suggestion', category: 'growth', template: 'Consider {suggestion} to increase {metric}' },
    { type: 'anomaly_detection', category: 'operations', template: 'Unusual pattern in {area}: {details}' },
    { type: 'trend_analysis', category: 'revenue', template: '{metric} trending {direction} by {percent}%' },
    { type: 'performance_alert', category: 'merchant', template: '{metric} below threshold for {entity}' },
    { type: 'optimization_recommendation', category: 'operations', template: 'Optimize {area} to save {value}' },
  ];
}

// ============================================================
// DASHBOARD FUNCTIONS
// ============================================================

export async function getDashboardConfigurations(
  type?: DashboardType
): Promise<DashboardConfiguration[]> {
  let query = supabase.from('dashboard_configurations').select('*');

  if (type) {
    query = query.eq('dashboard_type', type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as DashboardConfiguration[];
}

export async function getDefaultDashboard(type: DashboardType): Promise<DashboardConfiguration | null> {
  const { data, error } = await supabase
    .from('dashboard_configurations')
    .select('*')
    .eq('dashboard_type', type)
    .eq('is_default', true)
    .maybeSingle();

  if (error) throw error;
  return data as DashboardConfiguration | null;
}

export function getDashboardArchitecture(): Record<DashboardType, { widgets: string[]; description: string }> {
  return {
    customer: {
      widgets: ['total_purchases', 'smartpoints', 'purchase_trend', 'recent_orders'],
      description: 'Customer personal analytics dashboard',
    },
    merchant: {
      widgets: ['total_sales', 'revenue', 'health_score', 'sales_trend', 'recent_orders'],
      description: 'Merchant performance dashboard',
    },
    partner: {
      widgets: ['total_members', 'commission_earned', 'trust_index', 'member_trend'],
      description: 'Partner growth dashboard',
    },
    admin: {
      widgets: ['active_orders', 'pending_refunds', 'fraud_alerts', 'transaction_trend'],
      description: 'Admin operations dashboard',
    },
    executive: {
      widgets: ['total_customers', 'daily_revenue', 'monthly_revenue', 'avg_trust_score', 'revenue_trend', 'customer_trend'],
      description: 'Executive KPI dashboard',
    },
  };
}

// ============================================================
// EXPORT FUNCTIONS
// ============================================================

export async function getExportConfigurations(): Promise<ExportConfiguration[]> {
  const { data, error } = await supabase
    .from('export_configurations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ExportConfiguration[];
}

export function getExportArchitecture(): Array<{ type: ExportType; formats: string[]; useCase: string }> {
  return [
    { type: 'pdf', formats: ['.pdf'], useCase: 'Executive reports, summaries' },
    { type: 'excel', formats: ['.xlsx', '.xls'], useCase: 'Data analysis, spreadsheets' },
    { type: 'csv', formats: ['.csv'], useCase: 'Data export, integration' },
    { type: 'json', formats: ['.json'], useCase: 'API data, raw export' },
  ];
}

// ============================================================
// AUDIT FUNCTIONS
// ============================================================

export async function logAnalyticsAccess(
  actionType: 'computed' | 'viewed' | 'exported' | 'scheduled' | 'shared',
  analyticsType: string,
  options?: {
    entityType?: string;
    entityId?: string;
    rowCount?: number;
    durationMs?: number;
  }
): Promise<void> {
  const { error } = await supabase.from('analytics_audit_log').insert({
    action_type: actionType,
    analytics_type: analyticsType,
    entity_type: options?.entityType || null,
    entity_id: options?.entityId || null,
    row_count: options?.rowCount || null,
    access_duration_ms: options?.durationMs || null,
  });

  if (error) throw error;
}
