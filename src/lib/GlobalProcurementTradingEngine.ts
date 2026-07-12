/**
 * VLOOP GLOBAL PROCUREMENT & TRADING AI ENGINE
 * Phase 37 — Enterprise Global Procurement & Trading Architecture
 *
 * Enterprise architecture supporting:
 * - Global Supplier Network (India, UAE/GCC, China, Europe, USA, Future Markets)
 * - Supplier Profiles with Verification & Trust Score
 * - Procurement Engine (Direct, Bulk, Wholesale, Import, Export, Private Label, OEM, ODM)
 * - AI Supplier Intelligence (Recommendation, Price Comparison, Quality, Risk, Forecast)
 * - Trading Engine (Domestic, Cross-Border, B2B, Container Orders)
 * - Private Label Brand Architecture (VLOOP Essentials, Aura, Apparel, etc.)
 * - Compliance Layer (Tax, Import, Export, Customs, Country-Specific)
 *
 * No demo data. No hardcoded values. Architecture only.
 */

import { supabase } from './supabase';

export const PROCUREMENT_ENGINE_VERSION = '37.0.0' as const;

export const PROCUREMENT_ENGINE_META = {
  version: PROCUREMENT_ENGINE_VERSION,
  name: 'VLOOP Global Procurement & Trading AI Engine',
  lockedSince: '2026-07-02',
} as const;

// ============================================================
// CONSTANTS
// ============================================================

export const SUPPLIER_NETWORK_REGIONS = {
  INDIA: 'india',
  UAE_GCC: 'uae_gcc',
  CHINA: 'china',
  EUROPE: 'europe',
  USA: 'usa',
  ASIA_PACIFIC: 'asia_pacific',
  AFRICA: 'africa',
  LATAM: 'latam',
  GLOBAL: 'global',
  FUTURE_REGION: 'future_region',
} as const;

export type SupplierNetworkRegion = typeof SUPPLIER_NETWORK_REGIONS[keyof typeof SUPPLIER_NETWORK_REGIONS];

export const BUSINESS_TYPES = {
  MANUFACTURER: 'manufacturer',
  WHOLESALER: 'wholesaler',
  DISTRIBUTOR: 'distributor',
  IMPORTER: 'importer',
  EXPORTER: 'exporter',
  TRADING_COMPANY: 'trading_company',
  OEM: 'oem',
  ODM: 'odm',
  PRIVATE_LABEL: 'private_label',
  BRAND_OWNER: 'brand_owner',
} as const;

export type BusinessType = typeof BUSINESS_TYPES[keyof typeof BUSINESS_TYPES];

export const PURCHASE_ORDER_TYPES = {
  DIRECT_PURCHASE: 'direct_purchase',
  BULK_PURCHASE: 'bulk_purchase',
  WHOLESALE: 'wholesale',
  IMPORT: 'import',
  EXPORT: 'export',
  PRIVATE_LABEL: 'private_label',
  OEM: 'oem',
  ODM: 'odm',
  CONTAINER: 'container',
  B2B: 'b2b',
} as const;

export type PurchaseOrderType = typeof PURCHASE_ORDER_TYPES[keyof typeof PURCHASE_ORDER_TYPES];

export const TRADE_TYPES = {
  DOMESTIC: 'domestic',
  CROSS_BORDER: 'cross_border',
  WHOLESALE_MARKETPLACE: 'wholesale_marketplace',
  BULK_ORDER: 'bulk_order',
  CONTAINER_ORDER: 'container_order',
  B2B_ORDER: 'b2b_order',
  DISTRIBUTION: 'distribution',
  FUTURE_TRADING: 'future_trading',
} as const;

export type TradeType = typeof TRADE_TYPES[keyof typeof TRADE_TYPES];

export const PRIVATE_LABEL_BRANDS = {
  VLOOP_ESSENTIALS: 'vloop_essentials',
  VLOOP_AURA: 'vloop_aura',
  VLOOP_APPAREL: 'vloop_apparel',
  VLOOP_ORGANIC: 'vloop_organic',
  VLOOP_HOME: 'vloop_home',
  VLOOP_ELECTRONICS: 'vloop_electronics',
  VLOOP_KITCHEN: 'vloop_kitchen',
  VLOOP_KIDS: 'vloop_kids',
  VLOOP_HEALTH: 'vloop_health',
  VLOOP_BEAUTY: 'vloop_beauty',
  FUTURE_BRAND: 'future_brand',
} as const;

export type PrivateLabelBrandCategory = typeof PRIVATE_LABEL_BRANDS[keyof typeof PRIVATE_LABEL_BRANDS];

export const COMPLIANCE_RULE_TYPES = {
  TAX: 'tax',
  IMPORT: 'import',
  EXPORT: 'export',
  CUSTOMS: 'customs',
  BUSINESS_VERIFICATION: 'business_verification',
  PRODUCT_COMPLIANCE: 'product_compliance',
  LABELING: 'labeling',
  CERTIFICATION: 'certification',
  COUNTRY_SPECIFIC: 'country_specific',
} as const;

export type ComplianceRuleType = typeof COMPLIANCE_RULE_TYPES[keyof typeof COMPLIANCE_RULE_TYPES];

export const AI_INTELLIGENCE_TYPES = {
  SUPPLIER_RECOMMENDATION: 'supplier_recommendation',
  PRICE_COMPARISON: 'price_comparison',
  QUALITY_ANALYSIS: 'quality_analysis',
  LEAD_TIME_PREDICTION: 'lead_time_prediction',
  RISK_ANALYSIS: 'risk_analysis',
  DEMAND_FORECAST: 'demand_forecast',
  SEASONAL_PROCUREMENT: 'seasonal_procurement',
  NEGOTIATION_SUPPORT: 'negotiation_support',
  MARKET_ANALYSIS: 'market_analysis',
} as const;

export type AIIntelligenceType = typeof AI_INTELLIGENCE_TYPES[keyof typeof AI_INTELLIGENCE_TYPES];

export const PRODUCTION_STATUS = {
  CONCEPT: 'concept',
  DESIGN: 'design',
  SOURCING: 'sourcing',
  SAMPLING: 'sampling',
  APPROVAL: 'approval',
  PRODUCTION: 'production',
  LAUNCHED: 'launched',
  DISCONTINUED: 'discontinued',
} as const;

export type ProductionStatus = typeof PRODUCTION_STATUS[keyof typeof PRODUCTION_STATUS];

export const INCOTERMS = {
  EX_WORKS: 'ex_works',
  FOB: 'fob',
  CIF: 'cif',
  CFR: 'cfr',
  DDP: 'ddp',
  DAP: 'dap',
  FCA: 'fca',
  OTHER: 'other',
} as const;

export type Incoterm = typeof INCOTERMS[keyof typeof INCOTERMS];

// ============================================================
// TYPES
// ============================================================

export interface SupplierNetwork {
  id: string;
  network_code: string;
  network_name: string;
  region: SupplierNetworkRegion;
  country_codes: string[];
  description: string | null;
  is_active: boolean;
}

export interface SupplierProfile {
  id: string;
  supplier_code: string;
  company_name: string;
  trading_name: string | null;
  country: string;
  state: string | null;
  city: string | null;
  address: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  business_type: BusinessType;
  industry: string | null;
  product_categories: string[] | null;
  year_established: number | null;
  employee_count: number | null;
  annual_revenue_range: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_person: string | null;
  verification_status: 'pending' | 'documents_submitted' | 'under_review' | 'verified' | 'rejected' | 'suspended';
  trust_score: number;
  rating: number;
  total_orders: number;
  total_order_value: number;
  on_time_delivery_rate: number;
  quality_rating: number;
  response_time_hours: number | null;
  lead_time_days: number;
  moq: number;
  shipping_supported: boolean;
  international_shipping: boolean;
  compliance_status: 'pending' | 'verified' | 'issues_found' | 'non_compliant' | 'exempted';
  certifications: string[] | null;
  payment_terms: string | null;
  bank_details: Record<string, unknown>;
  tax_id: string | null;
  gst_number: string | null;
  import_export_license: string | null;
  documents: Record<string, unknown>;
  notes: string | null;
  is_active: boolean;
  is_featured: boolean;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplierNetworkMember {
  id: string;
  supplier_id: string;
  network_id: string;
  membership_status: 'pending' | 'active' | 'suspended' | 'terminated';
  joined_at: string | null;
  membership_tier: 'standard' | 'premium' | 'enterprise' | 'platinum';
  commission_rate: number;
  contract_start: string | null;
  contract_end: string | null;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  buyer_id: string | null;
  seller_id: string | null;
  order_type: PurchaseOrderType;
  order_status: 'draft' | 'submitted' | 'confirmed' | 'production' | 'shipped' | 'in_transit' | 'customs' | 'delivered' | 'completed' | 'cancelled' | 'returned';
  currency: string;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  customs_duty: number;
  other_charges: number;
  total_amount: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
  paid_amount: number;
  payment_terms: string | null;
  payment_due_date: string | null;
  lead_time_days: number | null;
  expected_delivery_date: string | null;
  actual_delivery_date: string | null;
  shipping_method: string | null;
  shipping_terms: Incoterm | null;
  origin_country: string | null;
  origin_port: string | null;
  destination_country: string;
  destination_port: string | null;
  tracking_number: string | null;
  container_number: string | null;
  customs_clearance_status: 'pending' | 'submitted' | 'cleared' | 'held' | 'rejected' | null;
  customs_documents: Array<{ type: string; url: string; uploaded_at: string }>;
  notes: string | null;
  internal_notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string | null;
  sku: string | null;
  product_name: string;
  product_description: string | null;
  category: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  total_price: number;
  specifications: Record<string, unknown>;
  customizations: Record<string, unknown>;
  is_private_label: boolean;
  brand_label: string | null;
  item_status: 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
  received_quantity: number;
  quality_check_status: 'pending' | 'passed' | 'partial' | 'failed' | 'rejected' | null;
  created_at: string;
}

export interface TradingOrder {
  id: string;
  trading_code: string | null;
  trade_type: TradeType | null;
  buyer_id: string | null;
  buyer_seller_id: string | null;
  supplier_id: string | null;
  product_id: string | null;
  order_type: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  currency: string;
  exchange_rate: number | null;
  buyer_country: string | null;
  supplier_country: string | null;
  trade_direction: 'import' | 'export' | 'domestic' | null;
  trade_status: string | null;
  payment_status: string;
  delivery_status: string;
  incoterms: string | null;
  origin_port: string | null;
  destination_port: string | null;
  expected_ship_date: string | null;
  actual_ship_date: string | null;
  expected_delivery: string | null;
  actual_delivery: string | null;
  customs_status: string | null;
  tracking_number: string | null;
  documents: Array<{ type: string; url: string }>;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrivateLabelBrand {
  id: string;
  brand_code: string | null;
  brand_name: string;
  brand_category: PrivateLabelBrandCategory | null;
  description: string | null;
  logo_url: string | null;
  brand_guidelines_url: string | null;
  target_market: string | null;
  price_tier: 'budget' | 'economy' | 'mid_range' | 'premium' | 'luxury' | null;
  quality_tier: 'basic' | 'standard' | 'premium' | 'ultra_premium' | null;
  launch_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrivateLabelProduct {
  id: string;
  brand_id: string;
  product_id: string | null;
  supplier_id: string | null;
  product_name: string;
  internal_sku: string;
  category: string | null;
  specifications: Record<string, unknown>;
  formulation: Record<string, unknown>;
  packaging: Record<string, unknown>;
  target_cost: number | null;
  target_margin: number | null;
  target_retail_price: number | null;
  production_status: ProductionStatus;
  launch_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProcurementComplianceRule {
  id: string;
  rule_code: string;
  rule_name: string;
  rule_type: ComplianceRuleType;
  country_code: string;
  category: string | null;
  rule_data: Record<string, unknown>;
  effective_from: string | null;
  effective_to: string | null;
  is_active: boolean;
  priority: number;
}

export interface SupplierComplianceRecord {
  id: string;
  supplier_id: string;
  compliance_rule_id: string | null;
  country_code: string | null;
  compliance_type: string | null;
  status: 'pending' | 'compliant' | 'non_compliant' | 'under_review' | 'exempted';
  documents: Array<{ type: string; url: string; uploaded_at: string }>;
  verified_at: string | null;
  verified_by: string | null;
  expiry_date: string | null;
  notes: string | null;
}

export interface AISupplierIntelligence {
  id: string;
  supplier_id: string;
  intelligence_type: AIIntelligenceType;
  score: number;
  confidence_level: number | null;
  analysis_data: Record<string, unknown>;
  factors: Record<string, unknown>;
  recommendations: Array<{ suggestion: string; priority: string }>;
  predictions: Record<string, unknown>;
  model_version: string | null;
  last_computed_at: string | null;
  valid_until: string | null;
  is_active: boolean;
}

// ============================================================
// SUPPLIER NETWORK FUNCTIONS
// ============================================================

export async function getSupplierNetworks(): Promise<SupplierNetwork[]> {
  const { data, error } = await supabase
    .from('supplier_networks')
    .select('*')
    .eq('is_active', true)
    .order('network_name', { ascending: true });

  if (error) throw error;
  return (data || []) as SupplierNetwork[];
}

export async function getSupplierNetwork(networkId: string): Promise<SupplierNetwork | null> {
  const { data, error } = await supabase
    .from('supplier_networks')
    .select('*')
    .eq('id', networkId)
    .maybeSingle();

  if (error) throw error;
  return data as SupplierNetwork | null;
}

export async function getNetworksByRegion(region: SupplierNetworkRegion): Promise<SupplierNetwork[]> {
  const { data, error } = await supabase
    .from('supplier_networks')
    .select('*')
    .eq('is_active', true)
    .eq('region', region);

  if (error) throw error;
  return (data || []) as SupplierNetwork[];
}

export function getRegionArchitecture(): Array<{ region: SupplierNetworkRegion; name: string; countries: string[] }> {
  return [
    { region: 'india', name: 'India', countries: ['IN'] },
    { region: 'uae_gcc', name: 'UAE / GCC', countries: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'] },
    { region: 'china', name: 'China', countries: ['CN'] },
    { region: 'europe', name: 'Europe', countries: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE'] },
    { region: 'usa', name: 'USA', countries: ['US'] },
    { region: 'asia_pacific', name: 'Asia Pacific', countries: ['JP', 'KR', 'AU', 'NZ', 'SG', 'TH', 'VN', 'MY'] },
    { region: 'africa', name: 'Africa', countries: ['ZA', 'EG', 'NG', 'KE'] },
    { region: 'latam', name: 'Latin America', countries: ['BR', 'MX', 'AR', 'CL', 'CO'] },
  ];
}

// ============================================================
// SUPPLIER FUNCTIONS
// ============================================================

export async function getSupplierProfiles(filters?: {
  country?: string;
  businessType?: BusinessType;
  verificationStatus?: string;
  minTrustScore?: number;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{ results: SupplierProfile[]; total: number }> {
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('supplier_profiles')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (filters?.country) {
    query = query.eq('country', filters.country);
  }
  if (filters?.businessType) {
    query = query.eq('business_type', filters.businessType);
  }
  if (filters?.verificationStatus) {
    query = query.eq('verification_status', filters.verificationStatus);
  }
  if (filters?.minTrustScore !== undefined) {
    query = query.gte('trust_score', filters.minTrustScore);
  }
  if (filters?.featured) {
    query = query.eq('is_featured', true);
  }

  query = query.order('trust_score', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { results: (data || []) as SupplierProfile[], total: count || 0 };
}

export async function getSupplierProfile(supplierId: string): Promise<SupplierProfile | null> {
  const { data, error } = await supabase
    .from('supplier_profiles')
    .select('*')
    .eq('id', supplierId)
    .maybeSingle();

  if (error) throw error;
  return data as SupplierProfile | null;
}

export async function getSupplierByCode(supplierCode: string): Promise<SupplierProfile | null> {
  const { data, error } = await supabase
    .from('supplier_profiles')
    .select('*')
    .eq('supplier_code', supplierCode)
    .maybeSingle();

  if (error) throw error;
  return data as SupplierProfile | null;
}

export async function createSupplierProfile(supplier: Partial<SupplierProfile>): Promise<SupplierProfile> {
  const { data, error } = await supabase
    .from('supplier_profiles')
    .insert(supplier)
    .select()
    .single();

  if (error) throw error;
  return data as SupplierProfile;
}

export async function updateSupplierTrustScore(supplierId: string): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_supplier_trust_score', {
    p_supplier_id: supplierId,
  });

  if (error) throw error;
  return data;
}

// ============================================================
// PURCHASE ORDER FUNCTIONS
// ============================================================

export async function getPurchaseOrders(filters?: {
  supplierId?: string;
  orderType?: PurchaseOrderType;
  orderStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ results: PurchaseOrder[]; total: number }> {
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('purchase_orders')
    .select('*', { count: 'exact' });

  if (filters?.supplierId) {
    query = query.eq('supplier_id', filters.supplierId);
  }
  if (filters?.orderType) {
    query = query.eq('order_type', filters.orderType);
  }
  if (filters?.orderStatus) {
    query = query.eq('order_status', filters.orderStatus);
  }
  if (filters?.dateFrom) {
    query = query.gte('created_at', filters.dateFrom);
  }
  if (filters?.dateTo) {
    query = query.lte('created_at', filters.dateTo);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { results: (data || []) as PurchaseOrder[], total: count || 0 };
}

export async function getPurchaseOrder(orderId: string): Promise<PurchaseOrder | null> {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (error) throw error;
  return data as PurchaseOrder | null;
}

export async function createPurchaseOrder(order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  const { data, error } = await supabase
    .from('purchase_orders')
    .insert(order)
    .select()
    .single();

  if (error) throw error;
  return data as PurchaseOrder;
}

export async function getPurchaseOrderItems(poId: string): Promise<PurchaseOrderItem[]> {
  const { data, error } = await supabase
    .from('purchase_order_items')
    .select('*')
    .eq('purchase_order_id', poId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as PurchaseOrderItem[];
}

export function getOrderTypeLabel(type: PurchaseOrderType): string {
  const labels: Record<PurchaseOrderType, string> = {
    direct_purchase: 'Direct Purchase',
    bulk_purchase: 'Bulk Purchase',
    wholesale: 'Wholesale',
    import: 'Import Order',
    export: 'Export Order',
    private_label: 'Private Label Manufacturing',
    oem: 'OEM Manufacturing',
    odm: 'ODM Manufacturing',
    container: 'Container Order',
    b2b: 'B2B Order',
  };
  return labels[type] || type;
}

// ============================================================
// TRADING FUNCTIONS
// ============================================================

export async function getTradingOrders(filters?: {
  tradeType?: TradeType;
  tradeStatus?: string;
  buyerCountry?: string;
  supplierCountry?: string;
  direction?: 'import' | 'export' | 'domestic';
}): Promise<TradingOrder[]> {
  let query = supabase
    .from('trading_orders')
    .select('*');

  if (filters?.tradeType) {
    query = query.eq('trade_type', filters.tradeType);
  }
  if (filters?.tradeStatus) {
    query = query.eq('trade_status', filters.tradeStatus);
  }
  if (filters?.buyerCountry) {
    query = query.eq('buyer_country', filters.buyerCountry);
  }
  if (filters?.supplierCountry) {
    query = query.eq('supplier_country', filters.supplierCountry);
  }
  if (filters?.direction) {
    query = query.eq('trade_direction', filters.direction);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as TradingOrder[];
}

export function getTradeTypeLabel(type: TradeType): string {
  const labels: Record<TradeType, string> = {
    domestic: 'Domestic Trading',
    cross_border: 'Cross-Border Trading',
    wholesale_marketplace: 'Wholesale Marketplace',
    bulk_order: 'Bulk Order',
    container_order: 'Container Order',
    b2b_order: 'B2B Order',
    distribution: 'Distribution',
    future_trading: 'Future Trading',
  };
  return labels[type] || type;
}

// ============================================================
// PRIVATE LABEL FUNCTIONS
// ============================================================

export async function getPrivateLabelBrands(): Promise<PrivateLabelBrand[]> {
  const { data, error } = await supabase
    .from('private_label_brands')
    .select('*')
    .order('brand_name', { ascending: true });

  if (error) throw error;
  return (data || []) as PrivateLabelBrand[];
}

export async function getPrivateLabelBrand(brandId: string): Promise<PrivateLabelBrand | null> {
  const { data, error } = await supabase
    .from('private_label_brands')
    .select('*')
    .eq('id', brandId)
    .maybeSingle();

  if (error) throw error;
  return data as PrivateLabelBrand | null;
}

export async function getPrivateLabelProducts(filters?: {
  brandId?: string;
  supplierId?: string;
  productionStatus?: ProductionStatus;
}): Promise<PrivateLabelProduct[]> {
  let query = supabase
    .from('private_label_products')
    .select('*')
    .eq('is_active', true);

  if (filters?.brandId) {
    query = query.eq('brand_id', filters.brandId);
  }
  if (filters?.supplierId) {
    query = query.eq('supplier_id', filters.supplierId);
  }
  if (filters?.productionStatus) {
    query = query.eq('production_status', filters.productionStatus);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as PrivateLabelProduct[];
}

export function getBrandArchitecture(): Array<{ category: PrivateLabelBrandCategory; name: string; description: string }> {
  return [
    { category: 'vloop_essentials', name: 'VLOOP Essentials', description: 'Everyday essential products at great value' },
    { category: 'vloop_aura', name: 'VLOOP Aura', description: 'Premium beauty and personal care' },
    { category: 'vloop_apparel', name: 'VLOOP Apparel', description: 'Fashion and clothing line' },
    { category: 'vloop_organic', name: 'VLOOP Organic', description: 'Organic and natural products' },
    { category: 'vloop_home', name: 'VLOOP Home', description: 'Home and living products' },
    { category: 'vloop_electronics', name: 'VLOOP Electronics', description: 'Consumer electronics' },
    { category: 'vloop_kitchen', name: 'VLOOP Kitchen', description: 'Kitchen appliances and tools' },
    { category: 'vloop_kids', name: 'VLOOP Kids', description: 'Children products and toys' },
    { category: 'vloop_health', name: 'VLOOP Health', description: 'Health and wellness products' },
    { category: 'vloop_beauty', name: 'VLOOP Beauty', description: 'Beauty and cosmetics' },
  ];
}

// ============================================================
// COMPLIANCE FUNCTIONS
// ============================================================

export async function getComplianceRules(filters?: {
  ruleType?: ComplianceRuleType;
  countryCode?: string;
}): Promise<ProcurementComplianceRule[]> {
  let query = supabase
    .from('procurement_compliance_rules')
    .select('*')
    .eq('is_active', true);

  if (filters?.ruleType) {
    query = query.eq('rule_type', filters.ruleType);
  }
  if (filters?.countryCode) {
    query = query.eq('country_code', filters.countryCode);
  }

  query = query.order('priority', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ProcurementComplianceRule[];
}

export async function getSupplierComplianceRecords(supplierId: string): Promise<SupplierComplianceRecord[]> {
  const { data, error } = await supabase
    .from('supplier_compliance_records')
    .select('*')
    .eq('supplier_id', supplierId);

  if (error) throw error;
  return (data || []) as SupplierComplianceRecord[];
}

// ============================================================
// AI SUPPLIER INTELLIGENCE FUNCTIONS
// ============================================================

export async function getAISupplierIntelligence(supplierId: string, filters?: {
  intelligenceType?: AIIntelligenceType;
}): Promise<AISupplierIntelligence[]> {
  let query = supabase
    .from('ai_supplier_intelligence')
    .select('*')
    .eq('supplier_id', supplierId)
    .eq('is_active', true);

  if (filters?.intelligenceType) {
    query = query.eq('intelligence_type', filters.intelligenceType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AISupplierIntelligence[];
}

export function getAIIntelligenceArchitecture(): Array<{ type: AIIntelligenceType; description: string; factors: string[] }> {
  return [
    {
      type: 'supplier_recommendation',
      description: 'Recommend best suppliers for specific products',
      factors: ['trust_score', 'rating', 'lead_time', 'price_competitiveness', 'quality_rating'],
    },
    {
      type: 'price_comparison',
      description: 'Compare prices across suppliers',
      factors: ['unit_price', 'bulk_discounts', 'shipping_cost', 'customs', 'total_landed_cost'],
    },
    {
      type: 'quality_analysis',
      description: 'Analyze supplier quality performance',
      factors: ['defect_rate', 'return_rate', 'quality_rating', 'customer_feedback', 'certifications'],
    },
    {
      type: 'lead_time_prediction',
      description: 'Predict delivery timelines',
      factors: ['historical_lead_time', 'production_capacity', 'shipping_route', 'seasonality'],
    },
    {
      type: 'risk_analysis',
      description: 'Assess supplier and trade risks',
      factors: ['country_risk', 'financial_stability', 'compliance_score', 'dependency_risk'],
    },
    {
      type: 'demand_forecast',
      description: 'Predict future product demand',
      factors: ['historical_sales', 'seasonality', 'market_trends', 'growth_rate'],
    },
    {
      type: 'seasonal_procurement',
      description: 'Optimize seasonal buying',
      factors: ['demand_peaks', 'inventory_costs', 'price_fluctuations', 'lead_times'],
    },
    {
      type: 'negotiation_support',
      description: 'AI-assisted negotiation insights',
      factors: ['market_prices', 'supplier_cost_structure', 'volume_discounts', 'competitor_deals'],
    },
    {
      type: 'market_analysis',
      description: 'Market trends and opportunities',
      factors: ['price_trends', 'supply_availability', 'new_suppliers', 'category_growth'],
    },
  ];
}

// ============================================================
// DASHBOARD FUNCTIONS
// ============================================================

export async function getProcurementDashboard(): Promise<{
  total_suppliers: number;
  verified_suppliers: number;
  pending_orders: number;
  in_transit_orders: number;
  total_purchase_value: number;
  active_trades: number;
  private_label_products: number;
  compliance_rules: number;
}> {
  const { data, error } = await supabase.rpc('get_procurement_dashboard');

  if (error) {
    const [
      { count: total_suppliers },
      { count: verified_suppliers },
      { count: pending_orders },
      { count: in_transit_orders },
      { count: active_trades },
      { count: private_label_products },
      { count: compliance_rules },
    ] = await Promise.all([
      supabase.from('supplier_profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('supplier_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
      supabase.from('purchase_orders').select('*', { count: 'exact', head: true }).in('order_status', ['draft', 'submitted', 'confirmed']),
      supabase.from('purchase_orders').select('*', { count: 'exact', head: true }).in('order_status', ['shipped', 'in_transit', 'customs']),
      supabase.from('trading_orders').select('*', { count: 'exact', head: true }),
      supabase.from('private_label_products').select('*', { count: 'exact', head: true }).eq('production_status', 'launched'),
      supabase.from('procurement_compliance_rules').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    return {
      total_suppliers: total_suppliers || 0,
      verified_suppliers: verified_suppliers || 0,
      pending_orders: pending_orders || 0,
      in_transit_orders: in_transit_orders || 0,
      total_purchase_value: 0,
      active_trades: active_trades || 0,
      private_label_products: private_label_products || 0,
      compliance_rules: compliance_rules || 0,
    };
  }

  return data;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getBusinessTypeLabel(type: BusinessType): string {
  const labels: Record<BusinessType, string> = {
    manufacturer: 'Manufacturer',
    wholesaler: 'Wholesaler',
    distributor: 'Distributor',
    importer: 'Importer',
    exporter: 'Exporter',
    trading_company: 'Trading Company',
    oem: 'OEM',
    odm: 'ODM',
    private_label: 'Private Label',
    brand_owner: 'Brand Owner',
  };
  return labels[type] || type;
}

export function getComplianceTypeLabel(type: ComplianceRuleType): string {
  const labels: Record<ComplianceRuleType, string> = {
    tax: 'Tax Regulations',
    import: 'Import Regulations',
    export: 'Export Regulations',
    customs: 'Customs Documentation',
    business_verification: 'Business Verification',
    product_compliance: 'Product Compliance',
    labeling: 'Labeling Requirements',
    certification: 'Certification Requirements',
    country_specific: 'Country-Specific Rules',
  };
  return labels[type] || type;
}

export function getProductionStatusLabel(status: ProductionStatus): string {
  const labels: Record<ProductionStatus, string> = {
    concept: 'Concept Phase',
    design: 'Design Phase',
    sourcing: 'Material Sourcing',
    sampling: 'Sampling',
    approval: 'Approval Stage',
    production: 'In Production',
    launched: 'Launched',
    discontinued: 'Discontinued',
  };
  return labels[status] || status;
}

export function getIncotermLabel(term: Incoterm): string {
  const labels: Record<Incoterm, string> = {
    ex_works: 'EX Works (EXW)',
    fob: 'Free On Board (FOB)',
    cif: 'Cost, Insurance & Freight (CIF)',
    cfr: 'Cost and Freight (CFR)',
    ddp: 'Delivered Duty Paid (DDP)',
    dap: 'Delivered at Place (DAP)',
    fca: 'Free Carrier (FCA)',
    other: 'Other Terms',
  };
  return labels[term] || term;
}
