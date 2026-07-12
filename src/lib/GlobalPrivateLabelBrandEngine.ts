/**
 * VLOOP GLOBAL PRIVATE LABEL & BRAND ECOSYSTEM ENGINE
 * Phase 38 — Enterprise Private Label & Brand Management Architecture
 *
 * Enterprise architecture supporting:
 * - Brand Management Engine (Unlimited VLOOP brands)
 * - Brand Identity (Logo, Colors, Story, Values, Country Availability)
 * - Private Label Engine (OEM, ODM, White Label, Co-Branding, Licensed)
 * - Packaging Engine (Templates, Barcode, QR Code, Batch Numbers)
 * - Quality Control Engine (Factory Approval, Inspections, Batch Verification)
 * - Brand Compliance (Country Regulations, Food, Cosmetic, Electronics)
 * - AI Brand Intelligence (Demand Forecast, Trends, Price Optimization)
 *
 * No demo data. No hardcoded values. Architecture only.
 */

import { supabase } from './supabase';

export const BRAND_ENGINE_VERSION = '38.0.0' as const;

export const BRAND_ENGINE_META = {
  version: BRAND_ENGINE_VERSION,
  name: 'VLOOP Global Private Label & Brand Ecosystem Engine',
  lockedSince: '2026-07-02',
} as const;

// ============================================================
// CONSTANTS
// ============================================================

export const MANUFACTURER_TYPES = {
  OEM: 'oem',
  ODM: 'odm',
  CONTRACT_MANUFACTURER: 'contract_manufacturer',
  WHITE_LABEL: 'white_label',
  CO_MANUFACTURER: 'co_manufacturer',
  LICENSED: 'licensed',
  FUTURE_TYPE: 'future_type',
} as const;

export type ManufacturerType = typeof MANUFACTURER_TYPES[keyof typeof MANUFACTURER_TYPES];

export const MANUFACTURING_TYPES = {
  OEM: 'oem',
  ODM: 'odm',
  WHITE_LABEL: 'white_label',
  PRIVATE_LABEL: 'private_label',
  CO_BRANDING: 'co_branding',
  LICENSED: 'licensed',
  FUTURE_TYPE: 'future_type',
} as const;

export type ManufacturingType = typeof MANUFACTURING_TYPES[keyof typeof MANUFACTURING_TYPES];

export const BRAND_STATUS = {
  CONCEPT: 'concept',
  DEVELOPMENT: 'development',
  LAUNCHING: 'launching',
  ACTIVE: 'active',
  PAUSED: 'paused',
  DISCONTINUED: 'discontinued',
} as const;

export type BrandStatus = typeof BRAND_STATUS[keyof typeof BRAND_STATUS];

export const VISIBILITY_TYPES = {
  PUBLIC: 'public',
  REGISTERED: 'registered',
  PREMIUM: 'premium',
  HIDDEN: 'hidden',
} as const;

export type VisibilityType = typeof VISIBILITY_TYPES[keyof typeof VISIBILITY_TYPES];

export const INSPECTION_TYPES = {
  INITIAL_APPROVAL: 'initial_approval',
  ROUTINE: 'routine',
  QUALITY_ISSUE: 'quality_issue',
  RENEWAL: 'renewal',
  COMPLAINT_FOLLOWUP: 'complaint_followup',
  SPECIAL_AUDIT: 'special_audit',
} as const;

export type InspectionType = typeof INSPECTION_TYPES[keyof typeof INSPECTION_TYPES];

export const QUALITY_INSPECTION_TYPES = {
  FACTORY_APPROVAL: 'factory_approval',
  PRE_SHIPMENT: 'pre_shipment',
  INCOMING: 'incoming',
  IN_PROCESS: 'in_process',
  FINAL: 'final',
  RANDOM: 'random',
  COMPLAINT_INVESTIGATION: 'complaint_investigation',
} as const;

export type QualityInspectionType = typeof QUALITY_INSPECTION_TYPES[keyof typeof QUALITY_INSPECTION_TYPES];

export const BATCH_STATUS = {
  PRODUCTION: 'production',
  QUALITY_CHECK: 'quality_check',
  PASSED: 'passed',
  FAILED: 'failed',
  RELEASED: 'released',
  RECALLED: 'recalled',
  EXPIRED: 'expired',
} as const;

export type BatchStatus = typeof BATCH_STATUS[keyof typeof BATCH_STATUS];

export const RECALL_STATUS = {
  NONE: 'none',
  PARTIAL: 'partial',
  FULL: 'full',
} as const;

export type RecallStatus = typeof RECALL_STATUS[keyof typeof RECALL_STATUS];

export const COMPLIANCE_TYPES = {
  FOOD: 'food',
  COSMETIC: 'cosmetic',
  ELECTRONICS: 'electronics',
  TEXTILE: 'textile',
  TOY: 'toy',
  PHARMACEUTICAL: 'pharmaceutical',
  GENERAL: 'general',
  COUNTRY_SPECIFIC: 'country_specific',
} as const;

export type ComplianceType = typeof COMPLIANCE_TYPES[keyof typeof COMPLIANCE_TYPES];

export const BARCODE_TYPES = {
  EAN13: 'ean13',
  EAN8: 'ean8',
  UPC: 'upc',
  CODE128: 'code128',
  QR: 'qr',
  DATAMATRIX: 'datamatrix',
  NONE: 'none',
} as const;

export type BarcodeType = typeof BARCODE_TYPES[keyof typeof BARCODE_TYPES];

export const AI_BRAND_INTEL_TYPES = {
  DEMAND_FORECAST: 'demand_forecast',
  TREND_PREDICTION: 'trend_prediction',
  PRICE_OPTIMIZATION: 'price_optimization',
  CUSTOMER_PREFERENCE: 'customer_preference',
  SEASONAL_ANALYSIS: 'seasonal_analysis',
  SALES_INTELLIGENCE: 'sales_intelligence',
  MARKET_POSITION: 'market_position',
  COMPETITOR_ANALYSIS: 'competitor_analysis',
  GROWTH_OPPORTUNITY: 'growth_opportunity',
} as const;

export type AIBrandIntelType = typeof AI_BRAND_INTEL_TYPES[keyof typeof AI_BRAND_INTEL_TYPES];

// ============================================================
// TYPES
// ============================================================

export interface Manufacturer {
  id: string;
  manufacturer_code: string;
  manufacturer_name: string;
  manufacturer_type: ManufacturerType;
  country: string;
  state: string | null;
  city: string | null;
  address: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  year_established: number | null;
  employee_count: number | null;
  certifications: string[] | null;
  production_capacity: number | null;
  moq: number;
  lead_time_days: number;
  specialties: string[] | null;
  quality_rating: number;
  on_time_rate: number;
  trust_score: number;
  verification_status: 'pending' | 'documents_submitted' | 'under_review' | 'verified' | 'rejected' | 'suspended';
  is_active: boolean;
  is_approved: boolean;
  approved_at: string | null;
  approved_by: string | null;
  notes: string | null;
}

export interface FactoryInspection {
  id: string;
  manufacturer_id: string;
  inspection_type: InspectionType;
  inspection_date: string;
  inspector_id: string | null;
  inspector_name: string | null;
  inspection_status: 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  overall_score: number;
  quality_score: number;
  safety_score: number;
  compliance_score: number;
  findings: Array<{ category: string; issue: string; severity: string }>;
  recommendations: string[] | null;
  corrective_actions: Array<{ action: string; due_date: string; responsible: string }>;
  follow_up_required: boolean;
  follow_up_date: string | null;
  next_inspection_date: string | null;
  report_url: string | null;
  notes: string | null;
}

export interface PackagingTemplate {
  id: string;
  template_code: string;
  template_name: string;
  category: string;
  description: string | null;
  dimensions: { length: number; width: number; height: number; unit: string };
  weight_grams: number | null;
  materials: string[] | null;
  print_specifications: Record<string, unknown>;
  barcode_type: BarcodeType;
  barcode_position: Record<string, unknown>;
  qr_code_enabled: boolean;
  qr_code_position: Record<string, unknown>;
  batch_number_format: string | null;
  batch_number_position: Record<string, unknown>;
  manufacturing_date_enabled: boolean;
  expiry_date_enabled: boolean;
  date_position: Record<string, unknown>;
  country_label_required: boolean;
  country_label_position: Record<string, unknown>;
  language_variants: Array<{ language: string; label_text: Record<string, unknown> }>;
  template_url: string | null;
  preview_url: string | null;
  cost_per_unit: number;
  min_order_quantity: number;
  is_active: boolean;
}

export interface ProductPackaging {
  id: string;
  product_id: string;
  template_id: string | null;
  barcode: string | null;
  qr_code_url: string | null;
  batch_code_prefix: string | null;
  batch_counter: number;
  label_language: string;
  label_text: Record<string, unknown>;
  warning_labels: string[] | null;
  nutritional_info: Record<string, unknown>;
  ingredients_list: string | null;
  allergen_info: string[] | null;
  manufacturing_date: string | null;
  expiry_date: string | null;
  best_before_date: string | null;
  country_of_origin: string;
  is_active: boolean;
}

export interface QualityInspection {
  id: string;
  inspection_code: string;
  product_id: string;
  batch_id: string | null;
  manufacturer_id: string | null;
  inspection_type: QualityInspectionType;
  inspection_date: string;
  inspector_id: string | null;
  inspector_name: string | null;
  inspection_status: 'scheduled' | 'in_progress' | 'passed' | 'failed' | 'conditional' | 'pending_retest';
  sample_size: number;
  sample_passed: number;
  sample_failed: number;
  pass_rate: number;
  parameters_tested: Array<{ parameter: string; specification: string; result: string }>;
  results: Record<string, unknown>;
  defects_found: Array<{ defect: string; count: number; severity: string }>;
  overall_grade: string | null;
  notes: string | null;
  corrective_actions: Array<{ action: string; responsible: string; due_date: string }>;
  retest_required: boolean;
  retest_date: string | null;
  report_url: string | null;
}

export interface ProductBatch {
  id: string;
  batch_code: string;
  product_id: string;
  manufacturer_id: string | null;
  production_date: string;
  expiry_date: string | null;
  best_before_date: string | null;
  quantity_produced: number;
  quantity_passed: number;
  quantity_failed: number;
  quantity_released: number;
  quantity_shipped: number;
  batch_status: BatchStatus;
  quality_inspection_id: string | null;
  quality_status: 'pending' | 'approved' | 'conditional' | 'rejected' | 'recalled';
  release_date: string | null;
  released_by: string | null;
  recall_status: RecallStatus;
  recall_date: string | null;
  recall_reason: string | null;
  notes: string | null;
}

export interface BrandComplianceRecord {
  id: string;
  brand_id: string;
  country_code: string;
  compliance_type: ComplianceType;
  regulation_name: string;
  requirement: string | null;
  status: 'pending' | 'compliant' | 'non_compliant' | 'exempted' | 'under_review';
  documents: Array<{ type: string; url: string; uploaded_at: string }>;
  certification_required: string | null;
  certification_obtained: string | null;
  certification_expiry: string | null;
  verified_at: string | null;
  verified_by: string | null;
  notes: string | null;
}

export interface ProductComplianceRecord {
  id: string;
  product_id: string;
  country_code: string;
  compliance_type: string;
  regulation_name: string | null;
  status: 'pending' | 'compliant' | 'non_compliant' | 'exempted' | 'under_review';
  documents: Array<{ type: string; url: string; uploaded_at: string }>;
  certification_number: string | null;
  certification_expiry: string | null;
  verified_at: string | null;
  verified_by: string | null;
  notes: string | null;
}

export interface AIBrandIntelligence {
  id: string;
  brand_id: string;
  intelligence_type: AIBrandIntelType;
  score: number;
  confidence_level: number | null;
  analysis_data: Record<string, unknown>;
  factors: Record<string, unknown>;
  recommendations: Array<{ suggestion: string; priority: string }>;
  predictions: Record<string, unknown>;
  historical_trend: Array<{ date: string; value: number }>;
  model_version: string | null;
  last_computed_at: string | null;
  valid_until: string | null;
  is_active: boolean;
}

export interface BrandAnalytic {
  id: string;
  date: string;
  brand_id: string;
  total_orders: number;
  total_revenue: number;
  total_units: number;
  avg_order_value: number;
  new_customers: number;
  returning_customers: number;
  product_views: number;
  cart_adds: number;
  conversion_rate: number;
  return_rate: number;
  rating_avg: number;
  reviews_count: number;
}

// ============================================================
// MANUFACTURER FUNCTIONS
// ============================================================

export async function getManufacturers(filters?: {
  country?: string;
  manufacturerType?: ManufacturerType;
  verificationStatus?: string;
  isApproved?: boolean;
}): Promise<Manufacturer[]> {
  let query = supabase
    .from('manufacturers')
    .select('*')
    .eq('is_active', true);

  if (filters?.country) {
    query = query.eq('country', filters.country);
  }
  if (filters?.manufacturerType) {
    query = query.eq('manufacturer_type', filters.manufacturerType);
  }
  if (filters?.verificationStatus) {
    query = query.eq('verification_status', filters.verificationStatus);
  }
  if (filters?.isApproved !== undefined) {
    query = query.eq('is_approved', filters.isApproved);
  }

  query = query.order('trust_score', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Manufacturer[];
}

export async function getManufacturer(manufacturerId: string): Promise<Manufacturer | null> {
  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('id', manufacturerId)
    .maybeSingle();

  if (error) throw error;
  return data as Manufacturer | null;
}

export async function createManufacturer(manufacturer: Partial<Manufacturer>): Promise<Manufacturer> {
  const { data, error } = await supabase
    .from('manufacturers')
    .insert(manufacturer)
    .select()
    .single();

  if (error) throw error;
  return data as Manufacturer;
}

export function getManufacturerTypeLabel(type: ManufacturerType): string {
  const labels: Record<ManufacturerType, string> = {
    oem: 'OEM (Original Equipment Manufacturer)',
    odm: 'ODM (Original Design Manufacturer)',
    contract_manufacturer: 'Contract Manufacturer',
    white_label: 'White Label',
    co_manufacturer: 'Co-Manufacturer',
    licensed: 'Licensed Manufacturer',
    future_type: 'Future Manufacturing Type',
  };
  return labels[type] || type;
}

// ============================================================
// FACTORY INSPECTION FUNCTIONS
// ============================================================

export async function getFactoryInspections(manufacturerId?: string): Promise<FactoryInspection[]> {
  let query = supabase
    .from('factory_inspections')
    .select('*');

  if (manufacturerId) {
    query = query.eq('manufacturer_id', manufacturerId);
  }

  query = query.order('inspection_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as FactoryInspection[];
}

export async function createFactoryInspection(inspection: Partial<FactoryInspection>): Promise<FactoryInspection> {
  const { data, error } = await supabase
    .from('factory_inspections')
    .insert(inspection)
    .select()
    .single();

  if (error) throw error;
  return data as FactoryInspection;
}

export function getInspectionTypeLabel(type: InspectionType): string {
  const labels: Record<InspectionType, string> = {
    initial_approval: 'Initial Factory Approval',
    routine: 'Routine Inspection',
    quality_issue: 'Quality Issue Follow-up',
    renewal: 'Renewal Inspection',
    complaint_followup: 'Complaint Follow-up',
    special_audit: 'Special Audit',
  };
  return labels[type] || type;
}

// ============================================================
// PACKAGING TEMPLATE FUNCTIONS
// ============================================================

export async function getPackagingTemplates(category?: string): Promise<PackagingTemplate[]> {
  let query = supabase
    .from('packaging_templates')
    .select('*')
    .eq('is_active', true);

  if (category) {
    query = query.eq('category', category);
  }

  query = query.order('template_name', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as PackagingTemplate[];
}

export async function getPackagingTemplate(templateId: string): Promise<PackagingTemplate | null> {
  const { data, error } = await supabase
    .from('packaging_templates')
    .select('*')
    .eq('id', templateId)
    .maybeSingle();

  if (error) throw error;
  return data as PackagingTemplate | null;
}

export async function createPackagingTemplate(template: Partial<PackagingTemplate>): Promise<PackagingTemplate> {
  const { data, error } = await supabase
    .from('packaging_templates')
    .insert(template)
    .select()
    .single();

  if (error) throw error;
  return data as PackagingTemplate;
}

export function getBarcodeTypeLabel(type: BarcodeType): string {
  const labels: Record<BarcodeType, string> = {
    ean13: 'EAN-13 (13 digits)',
    ean8: 'EAN-8 (8 digits)',
    upc: 'UPC-A (12 digits)',
    code128: 'Code 128',
    qr: 'QR Code',
    datamatrix: 'DataMatrix',
    none: 'No Barcode',
  };
  return labels[type] || type;
}

// ============================================================
// QUALITY INSPECTION FUNCTIONS
// ============================================================

export async function getQualityInspections(filters?: {
  productId?: string;
  manufacturerId?: string;
  inspectionStatus?: string;
}): Promise<QualityInspection[]> {
  let query = supabase
    .from('quality_inspections')
    .select('*');

  if (filters?.productId) {
    query = query.eq('product_id', filters.productId);
  }
  if (filters?.manufacturerId) {
    query = query.eq('manufacturer_id', filters.manufacturerId);
  }
  if (filters?.inspectionStatus) {
    query = query.eq('inspection_status', filters.inspectionStatus);
  }

  query = query.order('inspection_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as QualityInspection[];
}

export async function createQualityInspection(inspection: Partial<QualityInspection>): Promise<QualityInspection> {
  const { data, error } = await supabase
    .from('quality_inspections')
    .insert(inspection)
    .select()
    .single();

  if (error) throw error;
  return data as QualityInspection;
}

export function getQualityInspectionTypeLabel(type: QualityInspectionType): string {
  const labels: Record<QualityInspectionType, string> = {
    factory_approval: 'Factory Approval Inspection',
    pre_shipment: 'Pre-Shipment Inspection',
    incoming: 'Incoming Quality Check',
    in_process: 'In-Process Inspection',
    final: 'Final Inspection',
    random: 'Random Sampling',
    complaint_investigation: 'Complaint Investigation',
  };
  return labels[type] || type;
}

// ============================================================
// PRODUCT BATCH FUNCTIONS
// ============================================================

export async function getProductBatches(filters?: {
  productId?: string;
  batchStatus?: BatchStatus;
  recallStatus?: RecallStatus;
}): Promise<ProductBatch[]> {
  let query = supabase
    .from('product_batches')
    .select('*');

  if (filters?.productId) {
    query = query.eq('product_id', filters.productId);
  }
  if (filters?.batchStatus) {
    query = query.eq('batch_status', filters.batchStatus);
  }
  if (filters?.recallStatus) {
    query = query.eq('recall_status', filters.recallStatus);
  }

  query = query.order('production_date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ProductBatch[];
}

export async function getProductBatch(batchId: string): Promise<ProductBatch | null> {
  const { data, error } = await supabase
    .from('product_batches')
    .select('*')
    .eq('id', batchId)
    .maybeSingle();

  if (error) throw error;
  return data as ProductBatch | null;
}

export async function generateBatchCode(productId: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_batch_code', {
    p_product_id: productId,
  });

  if (error) throw error;
  return data;
}

export async function createProductBatch(batch: Partial<ProductBatch>): Promise<ProductBatch> {
  const { data, error } = await supabase
    .from('product_batches')
    .insert(batch)
    .select()
    .single();

  if (error) throw error;
  return data as ProductBatch;
}

export function getBatchStatusLabel(status: BatchStatus): string {
  const labels: Record<BatchStatus, string> = {
    production: 'In Production',
    quality_check: 'Quality Check',
    passed: 'Passed QC',
    failed: 'Failed QC',
    released: 'Released',
    recalled: 'Recalled',
    expired: 'Expired',
  };
  return labels[status] || status;
}

// ============================================================
// COMPLIANCE FUNCTIONS
// ============================================================

export async function getBrandComplianceRecords(brandId: string): Promise<BrandComplianceRecord[]> {
  const { data, error } = await supabase
    .from('brand_compliance')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as BrandComplianceRecord[];
}

export async function getProductComplianceRecords(productId: string): Promise<ProductComplianceRecord[]> {
  const { data, error } = await supabase
    .from('product_compliance')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ProductComplianceRecord[];
}

export function getComplianceTypeLabel(type: ComplianceType): string {
  const labels: Record<ComplianceType, string> = {
    food: 'Food Safety & Standards',
    cosmetic: 'Cosmetic Regulations',
    electronics: 'Electronics Standards',
    textile: 'Textile & Apparel',
    toy: 'Toy Safety',
    pharmaceutical: 'Pharmaceutical Standards',
    general: 'General Product Safety',
    country_specific: 'Country-Specific Regulations',
  };
  return labels[type] || type;
}

// ============================================================
// AI BRAND INTELLIGENCE FUNCTIONS
// ============================================================

export async function getAIBrandIntelligence(brandId: string, intelligenceType?: AIBrandIntelType): Promise<AIBrandIntelligence[]> {
  let query = supabase
    .from('ai_brand_intelligence')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true);

  if (intelligenceType) {
    query = query.eq('intelligence_type', intelligenceType);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AIBrandIntelligence[];
}

export function getAIBrandIntelArchitecture(): Array<{ type: AIBrandIntelType; description: string; factors: string[] }> {
  return [
    {
      type: 'demand_forecast',
      description: 'Predict product demand',
      factors: ['historical_sales', 'seasonality', 'market_trends', 'pricing'],
    },
    {
      type: 'trend_prediction',
      description: 'Identify market trends',
      factors: ['social_media', 'competitor_activity', 'consumer_sentiment'],
    },
    {
      type: 'price_optimization',
      description: 'Optimize pricing strategy',
      factors: ['cost_structure', 'margin_targets', 'competitor_prices', 'demand_elasticity'],
    },
    {
      type: 'customer_preference',
      description: 'Analyze customer preferences',
      factors: ['purchase_history', 'reviews', 'returns', 'surveys'],
    },
    {
      type: 'seasonal_analysis',
      description: 'Seasonal demand patterns',
      factors: ['holiday_sales', 'weather_correlation', 'event_calendar'],
    },
    {
      type: 'sales_intelligence',
      description: 'Sales performance insights',
      factors: ['conversion_rates', 'channel_performance', 'product_mix'],
    },
    {
      type: 'market_position',
      description: 'Market positioning analysis',
      factors: ['brand_perception', 'market_share', 'price_positioning'],
    },
    {
      type: 'competitor_analysis',
      description: 'Competitive intelligence',
      factors: ['competitor_products', 'pricing', 'marketing', 'new_launches'],
    },
    {
      type: 'growth_opportunity',
      description: 'Identify growth opportunities',
      factors: ['market_gaps', 'expansion_potential', 'new_segments'],
    },
  ];
}

// ============================================================
// BRAND DASHBOARD FUNCTIONS
// ============================================================

export async function getBrandDashboardStats(brandId: string): Promise<{
  total_products: number;
  active_products: number;
  total_revenue: number;
  pending_quality_checks: number;
  active_batches: number;
  manufacturers: number;
  compliance_status: boolean;
}> {
  const { data, error } = await supabase.rpc('get_brand_dashboard', {
    p_brand_id: brandId,
  });

  if (error) {
    return {
      total_products: 0,
      active_products: 0,
      total_revenue: 0,
      pending_quality_checks: 0,
      active_batches: 0,
      manufacturers: 0,
      compliance_status: true,
    };
  }

  return data;
}

export async function getBrandAnalytics(brandId: string, dateFrom: string, dateTo: string): Promise<BrandAnalytic[]> {
  const { data, error } = await supabase
    .from('brand_analytics')
    .select('*')
    .eq('brand_id', brandId)
    .gte('date', dateFrom)
    .lte('date', dateTo)
    .order('date', { ascending: true });

  if (error) throw error;
  return (data || []) as BrandAnalytic[];
}

// ============================================================
// BRAND ARCHITECTURE FUNCTIONS
// ============================================================

export function getVLOOPBrandArchitecture(): Array<{ category: string; name: string; description: string; specialties: string[] }> {
  return [
    {
      category: 'vloop_essentials',
      name: 'VLOOP Essentials',
      description: 'Everyday essential products at great value',
      specialties: ['household_items', 'daily_needs', 'value_packs'],
    },
    {
      category: 'vloop_aura',
      name: 'VLOOP Aura',
      description: 'Premium beauty and personal care',
      specialties: ['skincare', 'haircare', 'fragrance', 'personal_care'],
    },
    {
      category: 'vloop_apparel',
      name: 'VLOOP Apparel',
      description: 'Fashion and clothing line',
      specialties: ['casual_wear', 'formal_wear', 'ethnic', 'accessories'],
    },
    {
      category: 'vloop_organic',
      name: 'VLOOP Organic',
      description: 'Organic and natural products',
      specialties: ['organic_foods', 'natural_beauty', 'eco_friendly'],
    },
    {
      category: 'vloop_home',
      name: 'VLOOP Home',
      description: 'Home and living products',
      specialties: ['furniture', 'decor', 'bedding', 'kitchenware'],
    },
    {
      category: 'vloop_electronics',
      name: 'VLOOP Electronics',
      description: 'Consumer electronics',
      specialties: ['smart_devices', 'audio', 'accessories', 'gadgets'],
    },
    {
      category: 'vloop_kitchen',
      name: 'VLOOP Kitchen',
      description: 'Kitchen appliances and tools',
      specialties: ['appliances', 'cookware', 'utensils', 'storage'],
    },
    {
      category: 'vloop_kids',
      name: 'VLOOP Kids',
      description: 'Children products and toys',
      specialties: ['toys', 'apparel', 'school_supplies', 'baby_care'],
    },
    {
      category: 'vloop_health',
      name: 'VLOOP Health',
      description: 'Health and wellness products',
      specialties: ['supplements', 'fitness', 'wellness', 'medical_supplies'],
    },
    {
      category: 'vloop_beauty',
      name: 'VLOOP Beauty',
      description: 'Beauty and cosmetics',
      specialties: ['makeup', 'skincare', 'haircare', 'beauty_tools'],
    },
  ];
}

export function getManufacturingTypeLabel(type: ManufacturingType): string {
  const labels: Record<ManufacturingType, string> = {
    oem: 'OEM Manufacturing',
    odm: 'ODM Manufacturing',
    white_label: 'White Label',
    private_label: 'Private Label',
    co_branding: 'Co-Branding',
    licensed: 'Licensed Manufacturing',
    future_type: 'Future Manufacturing Model',
  };
  return labels[type] || type;
}

export function getBrandStatusLabel(status: BrandStatus): string {
  const labels: Record<BrandStatus, string> = {
    concept: 'Concept Phase',
    development: 'In Development',
    launching: 'Launching',
    active: 'Active',
    paused: 'Paused',
    discontinued: 'Discontinued',
  };
  return labels[status] || status;
}

export function getVisibilityLabel(visibility: VisibilityType): string {
  const labels: Record<VisibilityType, string> = {
    public: 'Public - Visible to all',
    registered: 'Registered Users Only',
    premium: 'Premium Members Only',
    hidden: 'Hidden - Admin Only',
  };
  return labels[visibility] || visibility;
}
