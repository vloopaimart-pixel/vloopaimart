/**
 * VLOOP MARKETPLACE FOUNDATION ENGINE
 * Phase 34.1 — Global AI Marketplace Foundation
 *
 * Enterprise architecture supporting:
 * - Physical Products, Digital Products, Services
 * - Local Shops, Home Businesses, International Trading
 * - Affiliate Products, Future VCOS Projects
 * - Unlimited Products, Sellers, Countries, Languages, Currencies, Warehouses, Categories
 * - AI Preparation (Demand Prediction, Recommendations, Inventory Forecast, Price Intelligence)
 *
 * No demo data. No hardcoded values. Architecture only.
 */

import { supabase } from './supabase';

export const FOUNDATION_ENGINE_VERSION = '34.1.0' as const;

export const FOUNDATION_ENGINE_META = {
  version: FOUNDATION_ENGINE_VERSION,
  name: 'VLOOP Marketplace Foundation Engine',
  lockedSince: '2026-07-02',
} as const;

// ============================================================
// PRODUCT SOURCE TYPES
// ============================================================

export const PRODUCT_SOURCE_TYPES = {
  VLOOP_BRAND: 'vloop_brand',
  PARTNER_PRODUCT: 'partner_product',
  LOCAL_SHOP: 'local_shop',
  HOME_CLOUD_STORE: 'home_cloud_store',
  AFFILIATE_PRODUCT: 'affiliate_product',
  GLOBAL_SUPPLIER: 'global_supplier',
  DISTRIBUTOR: 'distributor',
  MANUFACTURER: 'manufacturer',
  PRIVATE_LABEL: 'private_label',
  IMPORT: 'import',
  FUTURE_VCOS: 'future_vcos',
} as const;

export type ProductSourceType = typeof PRODUCT_SOURCE_TYPES[keyof typeof PRODUCT_SOURCE_TYPES];

// ============================================================
// WAREHOUSE TYPES
// ============================================================

export const WAREHOUSE_TYPES = {
  FULFILLMENT: 'fulfillment',
  DISTRIBUTION: 'distribution',
  SORTING: 'sorting',
  CROSS_DOCK: 'cross_dock',
  COLD_STORAGE: 'cold_storage',
  HOME_CLOUD: 'home_cloud',
} as const;

export type WarehouseType = typeof WAREHOUSE_TYPES[keyof typeof WAREHOUSE_TYPES];

// ============================================================
// AI MODEL TYPES
// ============================================================

export const AI_MODEL_TYPES = {
  DEMAND_PREDICTION: 'demand_prediction',
  PRODUCT_RECOMMENDATION: 'product_recommendation',
  INVENTORY_FORECAST: 'inventory_forecast',
  PRICE_INTELLIGENCE: 'price_intelligence',
  TREND_ANALYSIS: 'trend_analysis',
  CUSTOMER_SEGMENTATION: 'customer_segmentation',
  FRAUD_DETECTION: 'fraud_detection',
  REVIEW_SENTIMENT: 'review_sentiment',
  IMAGE_CLASSIFICATION: 'image_classification',
} as const;

export type AIModelType = typeof AI_MODEL_TYPES[keyof typeof AI_MODEL_TYPES];

// ============================================================
// VCOS PROJECT CATEGORIES
// ============================================================

export const VCOS_CATEGORIES = {
  LOGISTICS: 'logistics',
  DELIVERY: 'delivery',
  WAREHOUSING: 'warehousing',
  LAST_MILE: 'last_mile',
  DRONE_DELIVERY: 'drone_delivery',
  AUTONOMOUS_VEHICLE: 'autonomous_vehicle',
  SMART_INVENTORY: 'smart_inventory',
  SUSTAINABILITY: 'sustainability',
  AI_AUTOMATION: 'ai_automation',
  BLOCKCHAIN: 'blockchain',
  IOT: 'iot',
  AR_VR: 'ar_vr',
  VOICE_COMMERCE: 'voice_commerce',
  SOCIAL_COMMERCE: 'social_commerce',
} as const;

export type VCOSCategory = typeof VCOS_CATEGORIES[keyof typeof VCOS_CATEGORIES];

// ============================================================
// PRICING RULE TYPES
// ============================================================

export const PRICING_RULE_TYPES = {
  MARKUP: 'markup',
  MARKDOWN: 'markdown',
  DISCOUNT: 'discount',
  SURCHARGE: 'surcharge',
  BULK_PRICING: 'bulk_pricing',
  TIME_BASED: 'time_based',
  CUSTOMER_TIER: 'customer_tier',
  LOCATION_BASED: 'location_based',
  SEASONAL: 'seasonal',
  FLASH_SALE: 'flash_sale',
} as const;

export type PricingRuleType = typeof PRICING_RULE_TYPES[keyof typeof PRICING_RULE_TYPES];

// ============================================================
// INVENTORY TRANSACTION TYPES
// ============================================================

export const INVENTORY_TRANSACTION_TYPES = {
  PURCHASE: 'purchase',
  SALE: 'sale',
  RETURN: 'return',
  ADJUSTMENT: 'adjustment',
  TRANSFER_IN: 'transfer_in',
  TRANSFER_OUT: 'transfer_out',
  DAMAGE: 'damage',
  RESTOCK: 'restock',
  RESERVATION: 'reservation',
  RELEASE: 'release',
  COUNT_ADJUSTMENT: 'count_adjustment',
} as const;

export type InventoryTransactionType = typeof INVENTORY_TRANSACTION_TYPES[keyof typeof INVENTORY_TRANSACTION_TYPES];

// ============================================================
// MEDIA TYPES
// ============================================================

export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  THREE_D_MODEL: '3d_model',
  AR_MODEL: 'ar_model',
  MANUAL: 'manual',
  CERTIFICATE: 'certificate',
} as const;

export type MediaType = typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES];

// ============================================================
// TYPES
// ============================================================

export interface Country {
  id: string;
  iso_code: string;
  name: string;
  dial_code: string | null;
  currency_code: string;
  language_code: string;
  is_active: boolean;
  supports_marketplace: boolean;
  supports_trading: boolean;
  supports_affiliate: boolean;
  tax_config: Record<string, unknown>;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  symbol_position: 'left' | 'right';
  decimal_places: number;
  exchange_rate_to_inr: number;
  is_active: boolean;
  last_synced_at: string | null;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string | null;
  rtl: boolean;
  is_active: boolean;
  is_default: boolean;
}

export interface Warehouse {
  id: string;
  warehouse_code: string;
  warehouse_name: string;
  warehouse_type: WarehouseType;
  address: string;
  city: string;
  state: string | null;
  country: string;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_email: string | null;
  contact_phone: string | null;
  capacity_cubic_meters: number | null;
  current_utilization_percent: number;
  supports_express: boolean;
  supports_same_day: boolean;
  supports_cold_chain: boolean;
  is_active: boolean;
  operational_hours: { start: string; end: string };
}

export interface ProductSource {
  id: string;
  source_code: string;
  source_name: string;
  source_type: ProductSourceType;
  parent_source_id: string | null;
  country_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  commission_rate: number;
  payment_terms: string | null;
  lead_time_days: number;
  quality_score: number;
  is_verified: boolean;
  is_active: boolean;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  media_type: MediaType;
  media_url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  title: string | null;
  description: string | null;
  file_size_bytes: number | null;
  duration_seconds: number | null;
  sort_order: number;
  is_primary: boolean;
  metadata: Record<string, unknown>;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  warehouse_id: string | null;
  transaction_type: InventoryTransactionType;
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reference_type: string | null;
  reference_id: string | null;
  unit_cost: number | null;
  notes: string | null;
  performed_by: string | null;
  created_at: string;
}

export interface PricingRule {
  id: string;
  rule_name: string;
  rule_type: PricingRuleType;
  product_id: string | null;
  category_id: string | null;
  seller_id: string | null;
  value_type: 'percentage' | 'fixed';
  value: number;
  min_quantity: number;
  max_quantity: number | null;
  start_date: string | null;
  end_date: string | null;
  priority: number;
  is_stackable: boolean;
  is_active: boolean;
  conditions: Record<string, unknown>;
}

export interface AIModel {
  id: string;
  model_name: string;
  model_type: AIModelType;
  model_version: string;
  model_endpoint: string | null;
  model_config: Record<string, unknown>;
  training_data_config: Record<string, unknown>;
  accuracy_score: number | null;
  last_trained_at: string | null;
  is_active: boolean;
  is_production: boolean;
}

export interface AITrainingQueue {
  id: string;
  model_id: string | null;
  training_type: 'initial' | 'incremental' | 'retrain' | 'fine_tune';
  data_range_start: string | null;
  data_range_end: string | null;
  sample_size: number | null;
  parameters: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  metrics: Record<string, unknown>;
}

export interface AIPredictionCache {
  id: string;
  prediction_type: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  predictions: Array<{ id: string; score: number; data: Record<string, unknown> }>;
  confidence_score: number | null;
  model_version: string | null;
  expires_at: string | null;
  served_count: number;
  click_through: boolean;
  conversion: boolean;
}

export interface AIInsight {
  id: string;
  insight_type: string;
  insight_date: string;
  insight_data: Record<string, unknown>;
  impact_score: number | null;
  action_taken: string | null;
  action_result: string | null;
}

export interface VCOSProject {
  id: string;
  project_code: string;
  project_name: string;
  project_category: VCOSCategory;
  description: string | null;
  projected_launch: string | null;
  status: 'planned' | 'in_development' | 'pilot' | 'launched' | 'paused' | 'cancelled';
  priority: number;
  budget_allocated: number;
  estimated_impact: string | null;
  dependencies: string[] | null;
  is_public: boolean;
  notes: string | null;
}

export interface GlobalCommerceConfig {
  id: string;
  config_key: string;
  config_value: Record<string, unknown>;
  config_type: 'general' | 'shipping' | 'tax' | 'payment' | 'localization' | 'compliance' | 'ai';
  country_code: string | null;
  is_active: boolean;
}

// ============================================================
// COUNTRY FUNCTIONS
// ============================================================

export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []) as Country[];
}

export async function getCountryByCode(isoCode: string): Promise<Country | null> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('iso_code', isoCode.toUpperCase())
    .maybeSingle();

  if (error) throw error;
  return data as Country | null;
}

export async function getMarketplaceCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('is_active', true)
    .eq('supports_marketplace', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []) as Country[];
}

// ============================================================
// CURRENCY FUNCTIONS
// ============================================================

export async function getCurrencies(): Promise<Currency[]> {
  const { data, error } = await supabase
    .from('currencies')
    .select('*')
    .eq('is_active', true)
    .order('code', { ascending: true });

  if (error) throw error;
  return (data || []) as Currency[];
}

export async function getCurrencyByCode(code: string): Promise<Currency | null> {
  const { data, error } = await supabase
    .from('currencies')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as Currency | null;
}

export async function convertCurrency(amount: number, fromCode: string, toCode: string): Promise<number> {
  const [fromCurrency, toCurrency] = await Promise.all([
    getCurrencyByCode(fromCode),
    getCurrencyByCode(toCode),
  ]);

  if (!fromCurrency || !toCurrency) {
    throw new Error('Currency not found');
  }

  const amountInINR = amount * fromCurrency.exchange_rate_to_inr;
  return amountInINR / toCurrency.exchange_rate_to_inr;
}

// ============================================================
// LANGUAGE FUNCTIONS
// ============================================================

export async function getLanguages(): Promise<Language[]> {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return (data || []) as Language[];
}

export async function getDefaultLanguage(): Promise<Language | null> {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .eq('is_active', true)
    .eq('is_default', true)
    .maybeSingle();

  if (error) throw error;
  return data as Language | null;
}

// ============================================================
// WAREHOUSE FUNCTIONS
// ============================================================

export async function getWarehouses(filters?: {
  warehouseType?: WarehouseType;
  city?: string;
  country?: string;
  supportsExpress?: boolean;
  supportsColdChain?: boolean;
}): Promise<Warehouse[]> {
  let query = supabase
    .from('warehouses')
    .select('*')
    .eq('is_active', true);

  if (filters?.warehouseType) {
    query = query.eq('warehouse_type', filters.warehouseType);
  }
  if (filters?.city) {
    query = query.eq('city', filters.city);
  }
  if (filters?.country) {
    query = query.eq('country', filters.country);
  }
  if (filters?.supportsExpress) {
    query = query.eq('supports_express', true);
  }
  if (filters?.supportsColdChain) {
    query = query.eq('supports_cold_chain', true);
  }

  query = query.order('warehouse_name', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Warehouse[];
}

export async function getWarehouse(warehouseId: string): Promise<Warehouse | null> {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', warehouseId)
    .maybeSingle();

  if (error) throw error;
  return data as Warehouse | null;
}

// ============================================================
// PRODUCT SOURCE FUNCTIONS
// ============================================================

export async function getProductSources(filters?: {
  sourceType?: ProductSourceType;
  countryId?: string;
  verified?: boolean;
}): Promise<ProductSource[]> {
  let query = supabase
    .from('product_sources')
    .select('*')
    .eq('is_active', true);

  if (filters?.sourceType) {
    query = query.eq('source_type', filters.sourceType);
  }
  if (filters?.countryId) {
    query = query.eq('country_id', filters.countryId);
  }
  if (filters?.verified !== undefined) {
    query = query.eq('is_verified', filters.verified);
  }

  query = query.order('source_name', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ProductSource[];
}

export async function getProductSource(sourceId: string): Promise<ProductSource | null> {
  const { data, error } = await supabase
    .from('product_sources')
    .select('*')
    .eq('id', sourceId)
    .maybeSingle();

  if (error) throw error;
  return data as ProductSource | null;
}

// ============================================================
// PRODUCT MEDIA FUNCTIONS
// ============================================================

export async function getProductMedia(productId: string): Promise<ProductMedia[]> {
  const { data, error } = await supabase
    .from('product_media')
    .select('*')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data || []) as ProductMedia[];
}

export async function getProductPrimaryImage(productId: string): Promise<ProductMedia | null> {
  const { data, error } = await supabase
    .from('product_media')
    .select('*')
    .eq('product_id', productId)
    .eq('media_type', 'image')
    .eq('is_primary', true)
    .maybeSingle();

  if (error) throw error;
  return data as ProductMedia | null;
}

// ============================================================
// INVENTORY TRANSACTION FUNCTIONS
// ============================================================

export async function getInventoryTransactions(filters: {
  productId?: string;
  warehouseId?: string;
  transactionType?: InventoryTransactionType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ results: InventoryTransaction[]; total: number }> {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 50;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('inventory_transactions')
    .select('*', { count: 'exact' });

  if (filters.productId) {
    query = query.eq('product_id', filters.productId);
  }
  if (filters.warehouseId) {
    query = query.eq('warehouse_id', filters.warehouseId);
  }
  if (filters.transactionType) {
    query = query.eq('transaction_type', filters.transactionType);
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte('created_at', filters.dateTo);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { results: (data || []) as InventoryTransaction[], total: count || 0 };
}

export async function recordInventoryTransaction(transaction: Partial<InventoryTransaction>): Promise<InventoryTransaction> {
  const { data, error } = await supabase
    .from('inventory_transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;
  return data as InventoryTransaction;
}

// ============================================================
// PRICING RULE FUNCTIONS
// ============================================================

export async function getPricingRules(filters?: {
  ruleType?: PricingRuleType;
  productId?: string;
  categoryId?: string;
  active?: boolean;
}): Promise<PricingRule[]> {
  let query = supabase
    .from('pricing_rules')
    .select('*');

  if (filters?.ruleType) {
    query = query.eq('rule_type', filters.ruleType);
  }
  if (filters?.productId) {
    query = query.eq('product_id', filters.productId);
  }
  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }
  if (filters?.active !== undefined) {
    query = query.eq('is_active', filters.active);
  }

  query = query.order('priority', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as PricingRule[];
}

export async function getApplicablePricingRules(productId: string, quantity: number): Promise<PricingRule[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('pricing_rules')
    .select('*')
    .eq('is_active', true)
    .or(`product_id.eq.${productId},product_id.is.null`)
    .lte('min_quantity', quantity)
    .or(`max_quantity.gte.${quantity},max_quantity.is.null`)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order('priority', { ascending: false });

  if (error) throw error;
  return (data || []) as PricingRule[];
}

// ============================================================
// AI MODEL REGISTRY FUNCTIONS
// ============================================================

export async function getAIModels(filters?: {
  modelType?: AIModelType;
  active?: boolean;
  production?: boolean;
}): Promise<AIModel[]> {
  let query = supabase
    .from('ai_model_registry')
    .select('*');

  if (filters?.modelType) {
    query = query.eq('model_type', filters.modelType);
  }
  if (filters?.active !== undefined) {
    query = query.eq('is_active', filters.active);
  }
  if (filters?.production !== undefined) {
    query = query.eq('is_production', filters.production);
  }

  query = query.order('model_name', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AIModel[];
}

export async function getAIModel(modelId: string): Promise<AIModel | null> {
  const { data, error } = await supabase
    .from('ai_model_registry')
    .select('*')
    .eq('id', modelId)
    .maybeSingle();

  if (error) throw error;
  return data as AIModel | null;
}

export async function getProductionModel(modelType: AIModelType): Promise<AIModel | null> {
  const { data, error } = await supabase
    .from('ai_model_registry')
    .select('*')
    .eq('model_type', modelType)
    .eq('is_production', true)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as AIModel | null;
}

// ============================================================
// AI TRAINING FUNCTIONS
// ============================================================

export async function getTrainingQueue(status?: 'pending' | 'processing' | 'completed' | 'failed'): Promise<AITrainingQueue[]> {
  let query = supabase
    .from('ai_training_queue')
    .select('*');

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AITrainingQueue[];
}

export async function queueModelTraining(training: Partial<AITrainingQueue>): Promise<AITrainingQueue> {
  const { data, error } = await supabase
    .from('ai_training_queue')
    .insert({ ...training, status: 'pending' })
    .select()
    .single();

  if (error) throw error;
  return data as AITrainingQueue;
}

// ============================================================
// AI PREDICTION CACHE FUNCTIONS
// ============================================================

export async function getCachedPrediction(
  predictionType: string,
  userId?: string,
  entityId?: string
): Promise<AIPredictionCache | null> {
  let query = supabase
    .from('ai_prediction_cache')
    .select('*')
    .eq('prediction_type', predictionType)
    .gt('expires_at', new Date().toISOString());

  if (userId) {
    query = query.eq('user_id', userId);
  }
  if (entityId) {
    query = query.eq('entity_id', entityId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) throw error;

  if (data) {
    await supabase
      .from('ai_prediction_cache')
      .update({ served_count: data.served_count + 1 })
      .eq('id', data.id);
  }

  return data as AIPredictionCache | null;
}

export async function cachePrediction(prediction: Partial<AIPredictionCache>): Promise<AIPredictionCache> {
  const { data, error } = await supabase
    .from('ai_prediction_cache')
    .insert(prediction)
    .select()
    .single();

  if (error) throw error;
  return data as AIPredictionCache;
}

export async function markPredictionClickThrough(predictionId: string): Promise<void> {
  const { error } = await supabase
    .from('ai_prediction_cache')
    .update({ click_through: true })
    .eq('id', predictionId);

  if (error) throw error;
}

export async function markPredictionConversion(predictionId: string): Promise<void> {
  const { error } = await supabase
    .from('ai_prediction_cache')
    .update({ conversion: true })
    .eq('id', predictionId);

  if (error) throw error;
}

// ============================================================
// AI INSIGHTS FUNCTIONS
// ============================================================

export async function getAIInsights(insightType?: string, dateFrom?: string, dateTo?: string): Promise<AIInsight[]> {
  let query = supabase
    .from('ai_insights_archive')
    .select('*');

  if (insightType) {
    query = query.eq('insight_type', insightType);
  }
  if (dateFrom) {
    query = query.gte('insight_date', dateFrom);
  }
  if (dateTo) {
    query = query.lte('insight_date', dateTo);
  }

  query = query.order('insight_date', { ascending: false }).limit(100);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AIInsight[];
}

// ============================================================
// VCOS PROJECTS FUNCTIONS
// ============================================================

export async function getVCOSProjects(filters?: {
  category?: VCOSCategory;
  status?: string;
  publicOnly?: boolean;
}): Promise<VCOSProject[]> {
  let query = supabase
    .from('vcos_projects')
    .select('*');

  if (filters?.category) {
    query = query.eq('project_category', filters.category);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.publicOnly) {
    query = query.eq('is_public', true);
  }

  query = query.order('priority', { ascending: false }).order('project_name', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as VCOSProject[];
}

export async function getVCOSProject(projectId: string): Promise<VCOSProject | null> {
  const { data, error } = await supabase
    .from('vcos_projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();

  if (error) throw error;
  return data as VCOSProject | null;
}

export function getVCOSArchitecture(): Array<{
  category: VCOSCategory;
  projects: Array<{ name: string; description: string; status: string }>;
}> {
  return [
    {
      category: 'logistics',
      projects: [
        { name: 'Smart Route Optimization', description: 'AI-powered delivery route optimization', status: 'planned' },
        { name: 'Multi-Modal Logistics', description: 'Integration with road, rail, air logistics', status: 'planned' },
      ],
    },
    {
      category: 'delivery',
      projects: [
        { name: 'Hyper-Local Delivery Network', description: '50-minute delivery in metro areas', status: 'planned' },
        { name: 'Same-Day Premium', description: 'Guaranteed same-day delivery', status: 'planned' },
      ],
    },
    {
      category: 'drone_delivery',
      projects: [
        { name: 'VLOOP Drone Fleet', description: 'Autonomous drone delivery for remote areas', status: 'planned' },
      ],
    },
    {
      category: 'autonomous_vehicle',
      projects: [
        { name: 'Self-Driving Delivery Pods', description: 'Last-mile autonomous delivery', status: 'planned' },
      ],
    },
    {
      category: 'smart_inventory',
      projects: [
        { name: 'Predictive Stock Management', description: 'AI-driven inventory forecasting', status: 'planned' },
        { name: 'Auto-Replenishment System', description: 'Automatic stock reordering', status: 'planned' },
      ],
    },
    {
      category: 'ai_automation',
      projects: [
        { name: 'Demand Prediction Engine', description: 'ML-based demand forecasting', status: 'planned' },
        { name: 'Dynamic Pricing Intelligence', description: 'Real-time price optimization', status: 'planned' },
      ],
    },
    {
      category: 'ar_vr',
      projects: [
        { name: 'AR Product Preview', description: 'Augmented reality product visualization', status: 'planned' },
        { name: 'Virtual Showroom', description: 'Immersive shopping experience', status: 'planned' },
      ],
    },
    {
      category: 'voice_commerce',
      projects: [
        { name: 'Voice Shopping Assistant', description: 'Natural language shopping', status: 'planned' },
      ],
    },
    {
      category: 'social_commerce',
      projects: [
        { name: 'Live Commerce Platform', description: 'Live streaming commerce integration', status: 'planned' },
      ],
    },
    {
      category: 'blockchain',
      projects: [
        { name: 'Supply Chain Transparency', description: 'Blockchain-based product tracing', status: 'planned' },
      ],
    },
    {
      category: 'iot',
      projects: [
        { name: 'Smart Shelf System', description: 'IoT-enabled inventory tracking', status: 'planned' },
      ],
    },
    {
      category: 'sustainability',
      projects: [
        { name: 'Carbon Footprint Tracker', description: 'Eco-friendly delivery options', status: 'planned' },
        { name: 'Green Packaging Initiative', description: 'Sustainable packaging solutions', status: 'planned' },
      ],
    },
  ];
}

// ============================================================
// GLOBAL COMMERCE CONFIG FUNCTIONS
// ============================================================

export async function getCommerceConfig(key: string): Promise<GlobalCommerceConfig | null> {
  const { data, error } = await supabase
    .from('global_commerce_config')
    .select('*')
    .eq('config_key', key)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as GlobalCommerceConfig | null;
}

export async function getCommerceConfigsByType(configType: string): Promise<GlobalCommerceConfig[]> {
  const { data, error } = await supabase
    .from('global_commerce_config')
    .select('*')
    .eq('config_type', configType)
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as GlobalCommerceConfig[];
}

// ============================================================
// MARKETPLACE OVERVIEW FUNCTIONS
// ============================================================

export async function getMarketplaceOverview(): Promise<{
  active_products: number;
  verified_sellers: number;
  total_categories: number;
  total_brands: number;
  total_warehouses: number;
  supported_countries: number;
  upcoming_vcos_projects: number;
}> {
  const { data, error } = await supabase
    .rpc('get_marketplace_overview');

  if (error) {
    const [
      { count: active_products },
      { count: verified_sellers },
      { count: total_categories },
      { count: total_brands },
      { count: total_warehouses },
      { count: supported_countries },
      { count: upcoming_vcos_projects },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('sellers').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('is_verified', true),
      supabase.from('marketplace_categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('brands').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('warehouses').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('countries').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('vcos_projects').select('*', { count: 'exact', head: true }).in('status', ['planned', 'in_development', 'pilot']),
    ]);

    return {
      active_products: active_products || 0,
      verified_sellers: verified_sellers || 0,
      total_categories: total_categories || 0,
      total_brands: total_brands || 0,
      total_warehouses: total_warehouses || 0,
      supported_countries: supported_countries || 0,
      upcoming_vcos_projects: upcoming_vcos_projects || 0,
    };
  }

  return data;
}

export async function getAIReadiness(): Promise<{
  active_models: number;
  production_models: number;
  pending_training: number;
  active_predictions: number;
  archived_insights: number;
}> {
  const { data, error } = await supabase
    .rpc('get_ai_readiness');

  if (error) {
    const [
      { count: active_models },
      { count: production_models },
      { count: pending_training },
      { count: active_predictions },
      { count: archived_insights },
    ] = await Promise.all([
      supabase.from('ai_model_registry').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('ai_model_registry').select('*', { count: 'exact', head: true }).eq('is_production', true),
      supabase.from('ai_training_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('ai_prediction_cache').select('*', { count: 'exact', head: true }).gt('expires_at', new Date().toISOString()),
      supabase.from('ai_insights_archive').select('*', { count: 'exact', head: true }),
    ]);

    return {
      active_models: active_models || 0,
      production_models: production_models || 0,
      pending_training: pending_training || 0,
      active_predictions: active_predictions || 0,
      archived_insights: archived_insights || 0,
    };
  }

  return data;
}

// ============================================================
// AI PREPARATION ARCHITECTURE
// ============================================================

export function getAIPreparationArchitecture(): {
  modules: Array<{ name: string; description: string; status: string; dependencies: string[] }>;
  readiness: {
    data_pipeline: boolean;
    model_registry: boolean;
    training_infrastructure: boolean;
    inference_pipeline: boolean;
    monitoring: boolean;
  };
  implementation: string;
} {
  return {
    modules: [
      {
        name: 'Demand Prediction',
        description: 'ML-based demand forecasting for inventory management',
        status: 'architecture',
        dependencies: ['sales_history', 'seasonality', 'promotions', 'external_factors'],
      },
      {
        name: 'Product Recommendation',
        description: 'Personalized product recommendations for customers',
        status: 'architecture',
        dependencies: ['user_behavior', 'purchase_history', 'collaborative_filtering', 'content_features'],
      },
      {
        name: 'Inventory Forecast',
        description: 'Predict optimal inventory levels for each warehouse',
        status: 'architecture',
        dependencies: ['demand_prediction', 'lead_times', 'safety_stock', 'reorder_points'],
      },
      {
        name: 'Price Intelligence',
        description: 'Dynamic pricing optimization based on market conditions',
        status: 'architecture',
        dependencies: ['competitor_prices', 'demand_elasticity', 'profit_margins', 'market_trends'],
      },
      {
        name: 'Trend Analysis',
        description: 'Identify emerging product trends and market opportunities',
        status: 'architecture',
        dependencies: ['search_trends', 'social_signals', 'sales_velocity', 'category_performance'],
      },
      {
        name: 'Customer Recommendation',
        description: 'Cross-sell and upsell recommendations at checkout',
        status: 'architecture',
        dependencies: ['cart_analysis', 'purchase_patterns', 'product_affinity', 'profitability'],
      },
    ],
    readiness: {
      data_pipeline: true,
      model_registry: true,
      training_infrastructure: true,
      inference_pipeline: true,
      monitoring: true,
    },
    implementation: 'All tables and functions ready. ML models to be trained when historical data accumulates.',
  };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getSourceTypeLabel(sourceType: ProductSourceType): string {
  const labels: Record<ProductSourceType, string> = {
    vloop_brand: 'VLOOP Brand',
    partner_product: 'Partner Product',
    local_shop: 'Local Shop',
    home_cloud_store: 'Home Cloud Store',
    affiliate_product: 'Affiliate Product',
    global_supplier: 'Global Supplier',
    distributor: 'Distributor',
    manufacturer: 'Manufacturer',
    private_label: 'Private Label',
    import: 'Import',
    future_vcos: 'Future VCOS Project',
  };
  return labels[sourceType] || sourceType;
}

export function getWarehouseTypeLabel(warehouseType: WarehouseType): string {
  const labels: Record<WarehouseType, string> = {
    fulfillment: 'Fulfillment Center',
    distribution: 'Distribution Center',
    sorting: 'Sorting Center',
    cross_dock: 'Cross-Dock Facility',
    cold_storage: 'Cold Storage',
    home_cloud: 'Home Cloud Store',
  };
  return labels[warehouseType] || warehouseType;
}

export function getAIModelTypeLabel(modelType: AIModelType): string {
  const labels: Record<AIModelType, string> = {
    demand_prediction: 'Demand Prediction',
    product_recommendation: 'Product Recommendation',
    inventory_forecast: 'Inventory Forecast',
    price_intelligence: 'Price Intelligence',
    trend_analysis: 'Trend Analysis',
    customer_segmentation: 'Customer Segmentation',
    fraud_detection: 'Fraud Detection',
    review_sentiment: 'Review Sentiment Analysis',
    image_classification: 'Image Classification',
  };
  return labels[modelType] || modelType;
}

export function getVCOSCategoryLabel(category: VCOSCategory): string {
  const labels: Record<VCOSCategory, string> = {
    logistics: 'Logistics',
    delivery: 'Delivery',
    warehousing: 'Warehousing',
    last_mile: 'Last Mile',
    drone_delivery: 'Drone Delivery',
    autonomous_vehicle: 'Autonomous Vehicles',
    smart_inventory: 'Smart Inventory',
    sustainability: 'Sustainability',
    ai_automation: 'AI Automation',
    blockchain: 'Blockchain',
    iot: 'IoT',
    ar_vr: 'AR/VR',
    voice_commerce: 'Voice Commerce',
    social_commerce: 'Social Commerce',
  };
  return labels[category] || category;
}

export function formatWithCurrency(amount: number, currencyCode: string): string {
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
    CNY: '¥',
  };

  const symbol = currencySymbols[currencyCode] || currencyCode;

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount).replace('₹', symbol);
}
