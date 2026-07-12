/**
 * VLOOP SELLER, PARTNER & FRANCHISE ECOSYSTEM ENGINE
 * Phase 35 — Complete Seller, Partner and Franchise Architecture
 *
 * Enterprise architecture supporting:
 * - 12 Seller Types (Individual to Affiliate Partner)
 * - Partner Management with verification workflow
 * - Home Cloud Store Network
 * - Franchise Hierarchy (5 levels)
 * - Commission Engine (7+ commission types)
 * - Partner Dashboard & Analytics
 * - AI Partner Intelligence
 *
 * No demo data. No hardcoded values. Architecture only.
 */

import { supabase } from './supabase';

export const ECOSYSTEM_ENGINE_VERSION = '35.0.0' as const;

export const ECOSYSTEM_ENGINE_META = {
  version: ECOSYSTEM_ENGINE_VERSION,
  name: 'VLOOP Seller, Partner & Franchise Ecosystem Engine',
  lockedSince: '2026-07-02',
} as const;

// ============================================================
// CONSTANTS
// ============================================================

export const SELLER_TYPES = {
  INDIVIDUAL_SELLER: 'individual_seller',
  LOCAL_SHOP: 'local_shop',
  HOME_BUSINESS: 'home_business',
  MANUFACTURER: 'manufacturer',
  DISTRIBUTOR: 'distributor',
  WHOLESALER: 'wholesaler',
  IMPORTER: 'importer',
  EXPORTER: 'exporter',
  BRAND_OWNER: 'brand_owner',
  SERVICE_PROVIDER: 'service_provider',
  AFFILIATE_PARTNER: 'affiliate_partner',
  HOME_CLOUD_STORE: 'home_cloud_store',
} as const;

export type SellerType = typeof SELLER_TYPES[keyof typeof SELLER_TYPES];

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  DOCUMENT_REVIEW: 'document_review',
  MANUAL_APPROVAL: 'manual_approval',
  AI_VERIFICATION: 'ai_verification',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
} as const;

export type VerificationStatus = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];

export const FRANCHISE_LEVELS = {
  COUNTRY_MASTER: 'country_master',
  STATE_PARTNER: 'state_partner',
  DISTRICT_PARTNER: 'district_partner',
  CITY_PARTNER: 'city_partner',
  LOCAL_PARTNER: 'local_partner',
} as const;

export type FranchiseLevel = typeof FRANCHISE_LEVELS[keyof typeof FRANCHISE_LEVELS];

export const COMMISSION_TYPES = {
  MARKETPLACE_SALES: 'marketplace_sales',
  AFFILIATE_SALES: 'affiliate_sales',
  PRIVATE_LABEL_SALES: 'private_label_sales',
  REFERRAL_REWARDS: 'referral_rewards',
  FRANCHISE_REVENUE: 'franchise_revenue',
  SERVICE_REVENUE: 'service_revenue',
  TRADING_COMMISSION: 'trading_commission',
  OTHER: 'other',
} as const;

export type CommissionType = typeof COMMISSION_TYPES[keyof typeof COMMISSION_TYPES];

export const TRUST_STATUS = {
  NEW: 'new',
  BUILDING: 'building',
  TRUSTED: 'trusted',
  VERIFIED: 'verified',
  FLAGGED: 'flagged',
  SUSPENDED: 'suspended',
} as const;

export type TrustStatus = typeof TRUST_STATUS[keyof typeof TRUST_STATUS];

export const DOCUMENT_TYPES = {
  IDENTITY_PROOF: 'identity_proof',
  ADDRESS_PROOF: 'address_proof',
  BUSINESS_REGISTRATION: 'business_registration',
  GST_CERTIFICATE: 'gst_certificate',
  PAN_CARD: 'pan_card',
  BANK_STATEMENT: 'bank_statement',
  CANCELLED_CHEQUE: 'cancelled_cheque',
  BUSINESS_PHOTO: 'business_photo',
  PRODUCT_CATALOG: 'product_catalog',
  OTHER: 'other',
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

export const AI_INTELLIGENCE_TYPES = {
  SELLER_QUALITY: 'seller_quality',
  DELIVERY_PERFORMANCE: 'delivery_performance',
  CUSTOMER_SATISFACTION: 'customer_satisfaction',
  FRAUD_RISK: 'fraud_risk',
  BUSINESS_GROWTH: 'business_growth',
  INVENTORY_OPTIMIZATION: 'inventory_optimization',
  PRICING_OPTIMIZATION: 'pricing_optimization',
  PRODUCT_RECOMMENDATION: 'product_recommendation',
} as const;

export type AIIntelligenceType = typeof AI_INTELLIGENCE_TYPES[keyof typeof AI_INTELLIGENCE_TYPES];

export const TRUST_EVENT_TYPES = {
  POSITIVE_REVIEW: 'positive_review',
  NEGATIVE_REVIEW: 'negative_review',
  ORDER_COMPLETED: 'order_completed',
  ORDER_CANCELLED: 'order_cancelled',
  DELIVERY_ON_TIME: 'delivery_on_time',
  DELIVERY_LATE: 'delivery_late',
  COMPLAINT: 'complaint',
  COMPLIMENT: 'compliment',
  DOCUMENT_VERIFIED: 'document_verified',
  DOCUMENT_REJECTED: 'document_rejected',
  FRAUD_DETECTED: 'fraud_detected',
  TRUST_MILESTONE: 'trust_milestone',
  MANUAL_ADJUSTMENT: 'manual_adjustment',
} as const;

export type TrustEventType = typeof TRUST_EVENT_TYPES[keyof typeof TRUST_EVENT_TYPES];

// ============================================================
// TYPES
// ============================================================

export interface Seller {
  id: string;
  user_id: string | null;
  seller_type: SellerType;
  business_name: string;
  owner_name: string | null;
  business_email: string | null;
  business_phone: string | null;
  business_address: string | null;
  business_category: string | null;
  city: string | null;
  state: string | null;
  district: string | null;
  country: string;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  gst_number: string | null;
  pan_number: string | null;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  bank_name: string | null;
  commission_rate: number;
  rating: number;
  trust_score: number;
  trust_status: TrustStatus;
  verification_status: VerificationStatus;
  franchise_level: FranchiseLevel | 'none';
  franchise_parent_id: string | null;
  franchise_territory: Record<string, unknown>;
  documents: Record<string, unknown>;
  total_sales: number;
  total_orders: number;
  total_products: number;
  total_revenue: number;
  total_reviews: number;
  delivery_performance_score: number;
  customer_satisfaction_score: number;
  is_verified: boolean;
  is_active: boolean;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  suspended_at: string | null;
  suspended_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface SellerVerificationDocument {
  id: string;
  seller_id: string;
  document_type: DocumentType;
  document_url: string;
  document_name: string | null;
  verification_status: 'pending' | 'approved' | 'rejected' | 'needs_clarification';
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
  created_at: string;
}

export interface VerificationWorkflow {
  id: string;
  seller_id: string;
  current_stage: VerificationStatus;
  previous_stage: string | null;
  stage_started_at: string;
  stage_completed_at: string | null;
  assigned_to: string | null;
  ai_review_score: number | null;
  ai_review_notes: string | null;
  manual_review_notes: string | null;
  is_escalated: boolean;
  escalated_to: string | null;
  escalated_reason: string | null;
}

export interface PartnerProfile {
  id: string;
  user_id: string | null;
  partner_code: string;
  partner_type: SellerType;
  business_name: string;
  owner_name: string;
  business_email: string | null;
  business_phone: string | null;
  business_category: string | null;
  gst_number: string | null;
  tax_id: string | null;
  country: string;
  state: string | null;
  district: string | null;
  city: string | null;
  address: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  trust_score: number;
  trust_status: TrustStatus;
  verification_status: string;
  is_active: boolean;
  total_orders: number;
  total_revenue: number;
  total_products: number;
  rating: number;
  total_reviews: number;
  settlement_balance: number;
  last_settlement_at: string | null;
}

export interface HomeCloudStoreProfile {
  id: string;
  seller_id: string;
  store_name: string;
  store_code: string;
  inventory_limit: number;
  current_inventory_count: number;
  delivery_radius_km: number;
  working_hours_start: string;
  working_hours_end: string;
  working_days: string[];
  delivery_areas: Array<{ name: string; pincode: string }>;
  min_order_value: number;
  delivery_fee: number;
  free_delivery_above: number;
  is_micro_inventory: boolean;
  supports_same_day: boolean;
  supports_express: boolean;
  performance_score: number;
  trust_score: number;
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  average_delivery_time_minutes: number | null;
  customer_rating: number;
  settlement_balance: number;
  is_active: boolean;
  is_verified: boolean;
  verified_at: string | null;
}

export interface FranchiseHierarchy {
  id: string;
  franchise_code: string;
  franchise_name: string;
  franchise_level: FranchiseLevel;
  parent_franchise_id: string | null;
  country: string;
  state: string | null;
  district: string | null;
  city: string | null;
  territory_code: string | null;
  territory_bounds: Record<string, unknown>;
  owner_seller_id: string | null;
  commission_rate: number;
  revenue_share: number;
  total_partners_under: number;
  total_sales: number;
  total_revenue_share: number;
  is_active: boolean;
  contract_start_date: string | null;
  contract_end_date: string | null;
  contract_terms: Record<string, unknown>;
}

export interface CommissionRule {
  id: string;
  rule_name: string;
  rule_code: string;
  commission_type: CommissionType;
  seller_type: string | null;
  product_category_id: string | null;
  min_order_value: number;
  max_order_value: number | null;
  min_quantity: number;
  commission_percent: number;
  fixed_commission: number;
  is_tiered: boolean;
  tier_config: Array<{ min: number; max: number; percent: number }>;
  is_active: boolean;
  priority: number;
  valid_from: string | null;
  valid_to: string | null;
}

export interface CommissionTransaction {
  id: string;
  transaction_code: string;
  seller_id: string;
  order_id: string | null;
  commission_rule_id: string | null;
  commission_type: CommissionType;
  base_amount: number;
  commission_percent: number | null;
  commission_amount: number;
  settlement_status: 'pending' | 'settled' | 'failed' | 'refunded';
  settlement_id: string | null;
  settled_at: string | null;
  settlement_period: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface PartnerSettlement {
  id: string;
  settlement_code: string;
  seller_id: string;
  settlement_period: string;
  period_start: string;
  period_end: string;
  total_orders: number;
  total_revenue: number;
  total_commission: number;
  adjustments: number;
  net_settlement: number;
  payment_status: 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled';
  payment_method: string | null;
  payment_reference: string | null;
  paid_at: string | null;
  paid_by: string | null;
  invoice_number: string | null;
  invoice_url: string | null;
  notes: string | null;
}

export interface PartnerAnalytic {
  id: string;
  seller_id: string;
  date: string;
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  total_commission: number;
  avg_order_value: number;
  avg_delivery_time_minutes: number | null;
  customer_rating_avg: number;
  new_customers: number;
  returning_customers: number;
  product_views: number;
  conversion_rate: number;
  return_rate: number;
}

export interface AIPartnerIntelligence {
  id: string;
  seller_id: string;
  score_type: AIIntelligenceType;
  current_score: number;
  previous_score: number | null;
  score_trend: 'improving' | 'stable' | 'declining' | null;
  factors: Record<string, unknown>;
  recommendations: Array<{ suggestion: string; priority: string }>;
  predictions: Record<string, unknown>;
  last_computed_at: string;
  next_compute_at: string | null;
  model_version: string | null;
  is_active: boolean;
}

export interface PartnerTrustEvent {
  id: string;
  seller_id: string;
  event_type: TrustEventType;
  event_description: string | null;
  trust_points_change: number;
  trust_score_before: number | null;
  trust_score_after: number | null;
  reference_type: string | null;
  reference_id: string | null;
  created_by: string | null;
  created_at: string;
}

// ============================================================
// SELLER FUNCTIONS
// ============================================================

export async function getSeller(sellerId: string): Promise<Seller | null> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', sellerId)
    .maybeSingle();

  if (error) throw error;
  return data as Seller | null;
}

export async function getSellerByUserId(userId: string): Promise<Seller | null> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as Seller | null;
}

export async function searchSellers(filters: {
  query?: string;
  sellerType?: SellerType;
  verificationStatus?: VerificationStatus;
  franchiseLevel?: FranchiseLevel;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  minTrustScore?: number;
  page?: number;
  pageSize?: number;
}): Promise<{ results: Seller[]; total: number }> {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('sellers')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (filters.query) {
    query = query.or(`business_name.ilike.%${filters.query}%,owner_name.ilike.%${filters.query}%,city.ilike.%${filters.query}%`);
  }
  if (filters.sellerType) {
    query = query.eq('seller_type', filters.sellerType);
  }
  if (filters.verificationStatus) {
    query = query.eq('verification_status', filters.verificationStatus);
  }
  if (filters.franchiseLevel) {
    query = query.eq('franchise_level', filters.franchiseLevel);
  }
  if (filters.country) {
    query = query.eq('country', filters.country);
  }
  if (filters.state) {
    query = query.eq('state', filters.state);
  }
  if (filters.district) {
    query = query.eq('district', filters.district);
  }
  if (filters.city) {
    query = query.eq('city', filters.city);
  }
  if (filters.minTrustScore !== undefined) {
    query = query.gte('trust_score', filters.minTrustScore);
  }

  query = query.order('trust_score', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { results: (data || []) as Seller[], total: count || 0 };
}

export async function createSeller(seller: Partial<Seller>): Promise<Seller> {
  const { data, error } = await supabase
    .from('sellers')
    .insert(seller)
    .select()
    .single();

  if (error) throw error;
  return data as Seller;
}

export async function updateSeller(sellerId: string, updates: Partial<Seller>): Promise<void> {
  const { error } = await supabase
    .from('sellers')
    .update(updates)
    .eq('id', sellerId);

  if (error) throw error;
}

// ============================================================
// VERIFICATION FUNCTIONS
// ============================================================

export async function getSellerVerificationDocuments(sellerId: string): Promise<SellerVerificationDocument[]> {
  const { data, error } = await supabase
    .from('seller_verification_documents')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as SellerVerificationDocument[];
}

export async function uploadVerificationDocument(document: Partial<SellerVerificationDocument>): Promise<SellerVerificationDocument> {
  const { data, error } = await supabase
    .from('seller_verification_documents')
    .insert(document)
    .select()
    .single();

  if (error) throw error;
  return data as SellerVerificationDocument;
}

export async function reviewDocument(documentId: string, status: 'approved' | 'rejected' | 'needs_clarification', reviewerId: string, reason?: string): Promise<void> {
  const { error } = await supabase
    .from('seller_verification_documents')
    .update({
      verification_status: status,
      verified_by: reviewerId,
      verified_at: new Date().toISOString(),
      rejection_reason: reason || null,
    })
    .eq('id', documentId);

  if (error) throw error;
}

export async function getVerificationWorkflow(sellerId: string): Promise<VerificationWorkflow | null> {
  const { data, error } = await supabase
    .from('seller_verification_workflow')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as VerificationWorkflow | null;
}

export async function advanceVerificationStage(sellerId: string, newStage: VerificationStatus, adminId: string): Promise<void> {
  const current = await getVerificationWorkflow(sellerId);

  if (current) {
    await supabase
      .from('seller_verification_workflow')
      .update({
        previous_stage: current.current_stage,
        current_stage: newStage,
        stage_completed_at: new Date().toISOString(),
      })
      .eq('id', current.id);
  }

  await supabase.from('seller_verification_workflow').insert({
    seller_id: sellerId,
    current_stage: newStage,
    assigned_to: adminId,
  });

  await supabase
    .from('sellers')
    .update({ verification_status: newStage })
    .eq('id', sellerId);
}

// ============================================================
// PARTNER FUNCTIONS
// ============================================================

export async function getPartnerProfile(partnerId: string): Promise<PartnerProfile | null> {
  const { data, error } = await supabase
    .from('partner_profiles')
    .select('*')
    .eq('id', partnerId)
    .maybeSingle();

  if (error) throw error;
  return data as PartnerProfile | null;
}

export async function getPartnerByCode(partnerCode: string): Promise<PartnerProfile | null> {
  const { data, error } = await supabase
    .from('partner_profiles')
    .select('*')
    .eq('partner_code', partnerCode)
    .maybeSingle();

  if (error) throw error;
  return data as PartnerProfile | null;
}

export async function searchPartners(filters: {
  partnerType?: SellerType;
  trustStatus?: TrustStatus;
  country?: string;
  state?: string;
  minTrustScore?: number;
  page?: number;
  pageSize?: number;
}): Promise<{ results: PartnerProfile[]; total: number }> {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('partner_profiles')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (filters.partnerType) {
    query = query.eq('partner_type', filters.partnerType);
  }
  if (filters.trustStatus) {
    query = query.eq('trust_status', filters.trustStatus);
  }
  if (filters.country) {
    query = query.eq('country', filters.country);
  }
  if (filters.state) {
    query = query.eq('state', filters.state);
  }
  if (filters.minTrustScore !== undefined) {
    query = query.gte('trust_score', filters.minTrustScore);
  }

  query = query.order('trust_score', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { results: (data || []) as PartnerProfile[], total: count || 0 };
}

// ============================================================
// HOME CLOUD STORE FUNCTIONS
// ============================================================

export async function getHomeCloudStore(storeId: string): Promise<HomeCloudStoreProfile | null> {
  const { data, error } = await supabase
    .from('home_cloud_store_profiles')
    .select('*')
    .eq('id', storeId)
    .maybeSingle();

  if (error) throw error;
  return data as HomeCloudStoreProfile | null;
}

export async function getHomeCloudStoresNearby(lat: number, lng: number, radiusKm: number = 5): Promise<HomeCloudStoreProfile[]> {
  const { data, error } = await supabase
    .from('home_cloud_store_profiles')
    .select(`
      *,
      sellers!inner(latitude, longitude)
    `)
    .eq('is_active', true)
    .eq('is_verified', true);

  if (error) throw error;

  const stores = (data || []).filter(s => {
    const sellerLat = (s.sellers as { latitude: number; longitude: number })?.latitude;
    const sellerLng = (s.sellers as { latitude: number; longitude: number })?.longitude;

    if (!sellerLat || !sellerLng) return false;

    const distance = calculateDistance(lat, lng, sellerLat, sellerLng);
    return distance <= radiusKm;
  });

  return stores as HomeCloudStoreProfile[];
}

export async function createHomeCloudStore(store: Partial<HomeCloudStoreProfile>): Promise<HomeCloudStoreProfile> {
  const { data, error } = await supabase
    .from('home_cloud_store_profiles')
    .insert(store)
    .select()
    .single();

  if (error) throw error;
  return data as HomeCloudStoreProfile;
}

// ============================================================
// FRANCHISE FUNCTIONS
// ============================================================

export async function getFranchise(franchiseId: string): Promise<FranchiseHierarchy | null> {
  const { data, error } = await supabase
    .from('franchise_hierarchy')
    .select('*')
    .eq('id', franchiseId)
    .maybeSingle();

  if (error) throw error;
  return data as FranchiseHierarchy | null;
}

export async function getFranchiseByCode(franchiseCode: string): Promise<FranchiseHierarchy | null> {
  const { data, error } = await supabase
    .from('franchise_hierarchy')
    .select('*')
    .eq('franchise_code', franchiseCode)
    .maybeSingle();

  if (error) throw error;
  return data as FranchiseHierarchy | null;
}

export async function getFranchisesByLevel(level: FranchiseLevel, country?: string): Promise<FranchiseHierarchy[]> {
  let query = supabase
    .from('franchise_hierarchy')
    .select('*')
    .eq('franchise_level', level)
    .eq('is_active', true);

  if (country) {
    query = query.eq('country', country);
  }

  const { data, error } = await query.order('franchise_name', { ascending: true });

  if (error) throw error;
  return (data || []) as FranchiseHierarchy[];
}

export async function getFranchiseChildren(parentId: string): Promise<FranchiseHierarchy[]> {
  const { data, error } = await supabase
    .from('franchise_hierarchy')
    .select('*')
    .eq('parent_franchise_id', parentId)
    .eq('is_active', true)
    .order('franchise_name', { ascending: true });

  if (error) throw error;
  return (data || []) as FranchiseHierarchy[];
}

export function getFranchiseHierarchyStructure(): Array<{ level: FranchiseLevel; name: string; description: string }> {
  return [
    { level: 'country_master', name: 'Country Master', description: 'Primary franchise owner for a country' },
    { level: 'state_partner', name: 'State Partner', description: 'State-level franchise under country master' },
    { level: 'district_partner', name: 'District Partner', description: 'District-level franchise under state partner' },
    { level: 'city_partner', name: 'City Partner', description: 'City-level franchise under district partner' },
    { level: 'local_partner', name: 'Local Partner', description: 'Local community franchise under city partner' },
  ];
}

// ============================================================
// COMMISSION FUNCTIONS
// ============================================================

export async function getCommissionRules(commissionType?: CommissionType): Promise<CommissionRule[]> {
  let query = supabase
    .from('commission_rules')
    .select('*')
    .eq('is_active', true);

  if (commissionType) {
    query = query.eq('commission_type', commissionType);
  }

  query = query.order('priority', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as CommissionRule[];
}

export async function getApplicableCommissionRule(sellerType: SellerType, commissionType: CommissionType): Promise<CommissionRule | null> {
  const { data, error } = await supabase
    .from('commission_rules')
    .select('*')
    .eq('is_active', true)
    .eq('commission_type', commissionType)
    .or(`seller_type.eq.${sellerType},seller_type.is.null`)
    .order('priority', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as CommissionRule | null;
}

export async function calculateCommission(sellerId: string, baseAmount: number, commissionType: CommissionType): Promise<number> {
  const seller = await getSeller(sellerId);
  if (!seller) return 0;

  const rule = await getApplicableCommissionRule(seller.seller_type, commissionType);
  if (!rule) return (baseAmount * (seller.commission_rate || 10)) / 100;

  let commission = (baseAmount * rule.commission_percent) / 100;
  commission += rule.fixed_commission;

  return commission;
}

export async function createCommissionTransaction(transaction: Partial<CommissionTransaction>): Promise<CommissionTransaction> {
  const { data, error } = await supabase
    .from('commission_transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;
  return data as CommissionTransaction;
}

export async function getSellerCommissionTransactions(sellerId: string, page: number = 1, pageSize: number = 20): Promise<{ results: CommissionTransaction[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('commission_transactions')
    .select('*', { count: 'exact' })
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { results: (data || []) as CommissionTransaction[], total: count || 0 };
}

// ============================================================
// SETTLEMENT FUNCTIONS
// ============================================================

export async function getPartnerSettlements(sellerId: string, page: number = 1, pageSize: number = 10): Promise<{ results: PartnerSettlement[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('partner_settlements')
    .select('*', { count: 'exact' })
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { results: (data || []) as PartnerSettlement[], total: count || 0 };
}

export async function getPendingSettlementBalance(sellerId: string): Promise<number> {
  const { data, error } = await supabase
    .from('commission_transactions')
    .select('commission_amount')
    .eq('seller_id', sellerId)
    .eq('settlement_status', 'pending');

  if (error) throw error;

  return (data || []).reduce((sum, t) => sum + Number(t.commission_amount || 0), 0);
}

// ============================================================
// ANALYTICS FUNCTIONS
// ============================================================

export async function getPartnerAnalytics(sellerId: string, dateFrom: string, dateTo: string): Promise<PartnerAnalytic[]> {
  const { data, error } = await supabase
    .from('partner_analytics')
    .select('*')
    .eq('seller_id', sellerId)
    .gte('date', dateFrom)
    .lte('date', dateTo)
    .order('date', { ascending: true });

  if (error) throw error;
  return (data || []) as PartnerAnalytic[];
}

export async function getPartnerDashboardStats(sellerId: string): Promise<{
  orders: number;
  revenue: number;
  products: number;
  rating: number;
  trustScore: number;
  commissionBalance: number;
  settlementBalance: number;
}> {
  const { data, error } = await supabase.rpc('get_partner_dashboard_stats', { p_seller_id: sellerId });

  if (error) {
    const seller = await getSeller(sellerId);
    const pendingCommission = await getPendingSettlementBalance(sellerId);

    return {
      orders: seller?.total_orders || 0,
      revenue: seller?.total_revenue || 0,
      products: seller?.total_products || 0,
      rating: seller?.rating || 0,
      trustScore: seller?.trust_score || 0,
      commissionBalance: pendingCommission,
      settlementBalance: 0,
    };
  }

  return data;
}

// ============================================================
// AI INTELLIGENCE FUNCTIONS
// ============================================================

export async function getAIPartnerIntelligence(sellerId: string, scoreType: AIIntelligenceType): Promise<AIPartnerIntelligence | null> {
  const { data, error } = await supabase
    .from('ai_partner_intelligence')
    .select('*')
    .eq('seller_id', sellerId)
    .eq('score_type', scoreType)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data as AIPartnerIntelligence | null;
}

export async function getAllSellerIntelligence(sellerId: string): Promise<AIPartnerIntelligence[]> {
  const { data, error } = await supabase
    .from('ai_partner_intelligence')
    .select('*')
    .eq('seller_id', sellerId)
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as AIPartnerIntelligence[];
}

export function getAIIntelligenceArchitecture(): Array<{ type: AIIntelligenceType; description: string; factors: string[] }> {
  return [
    {
      type: 'seller_quality',
      description: 'Overall seller quality assessment',
      factors: ['order_completion_rate', 'customer_rating', 'return_rate', 'response_time'],
    },
    {
      type: 'delivery_performance',
      description: 'Delivery speed and reliability',
      factors: ['on_time_rate', 'avg_delivery_time', 'damage_rate', 'tracking_accuracy'],
    },
    {
      type: 'customer_satisfaction',
      description: 'Customer happiness score',
      factors: ['avg_rating', 'review_sentiment', 'complaint_rate', 'repeat_customers'],
    },
    {
      type: 'fraud_risk',
      description: 'Fraud detection monitoring',
      factors: ['transaction_patterns', 'account_age', 'document_verification', 'history_flags'],
    },
    {
      type: 'business_growth',
      description: 'Growth trajectory analysis',
      factors: ['revenue_trend', 'product_expansion', 'customer_acquisition', 'market_share'],
    },
    {
      type: 'inventory_optimization',
      description: 'Stock level recommendations',
      factors: ['sales_velocity', 'seasonality', 'lead_time', 'demand_forecast'],
    },
    {
      type: 'pricing_optimization',
      description: 'Dynamic pricing suggestions',
      factors: ['competitor_prices', 'demand_elasticity', 'margin_targets', 'market_trends'],
    },
    {
      type: 'product_recommendation',
      description: 'Product selection suggestions',
      factors: ['category_performance', 'customer_demographics', 'trending_products', 'gap_analysis'],
    },
  ];
}

// ============================================================
// TRUST EVENT FUNCTIONS
// ============================================================

export async function getTrustEvents(sellerId: string, page: number = 1, pageSize: number = 20): Promise<{ results: PartnerTrustEvent[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('partner_trust_events')
    .select('*', { count: 'exact' })
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { results: (data || []) as PartnerTrustEvent[], total: count || 0 };
}

export async function recordTrustEvent(event: Partial<PartnerTrustEvent>): Promise<PartnerTrustEvent> {
  const { data, error } = await supabase
    .from('partner_trust_events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;

  await supabase.rpc('calculate_seller_trust_score', { p_seller_id: event.seller_id });

  return data as PartnerTrustEvent;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getSellerTypeLabel(type: SellerType): string {
  const labels: Record<SellerType, string> = {
    individual_seller: 'Individual Seller',
    local_shop: 'Local Shop',
    home_business: 'Home Business',
    manufacturer: 'Manufacturer',
    distributor: 'Distributor',
    wholesaler: 'Wholesaler',
    importer: 'Importer',
    exporter: 'Exporter',
    brand_owner: 'Brand Owner',
    service_provider: 'Service Provider',
    affiliate_partner: 'Affiliate Partner',
    home_cloud_store: 'Home Cloud Store',
  };
  return labels[type] || type;
}

export function getVerificationStatusLabel(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    pending: 'Pending',
    document_review: 'Document Review',
    manual_approval: 'Manual Approval',
    ai_verification: 'AI Verification',
    verified: 'Verified',
    rejected: 'Rejected',
    suspended: 'Suspended',
  };
  return labels[status] || status;
}

export function getCommissionTypeLabel(type: CommissionType): string {
  const labels: Record<CommissionType, string> = {
    marketplace_sales: 'Marketplace Sales',
    affiliate_sales: 'Affiliate Sales',
    private_label_sales: 'Private Label Sales',
    referral_rewards: 'Referral Rewards',
    franchise_revenue: 'Franchise Revenue',
    service_revenue: 'Service Revenue',
    trading_commission: 'Trading Commission',
    other: 'Other',
  };
  return labels[type] || type;
}

export function getTrustStatusLabel(status: TrustStatus): string {
  const labels: Record<TrustStatus, string> = {
    new: 'New Partner',
    building: 'Building Trust',
    trusted: 'Trusted Partner',
    verified: 'Verified Partner',
    flagged: 'Flagged',
    suspended: 'Suspended',
  };
  return labels[status] || status;
}

export function getFranchiseLevelLabel(level: FranchiseLevel): string {
  const labels: Record<FranchiseLevel, string> = {
    country_master: 'Country Master Franchise',
    state_partner: 'State Partner',
    district_partner: 'District Partner',
    city_partner: 'City Partner',
    local_partner: 'Local Partner',
  };
  return labels[level] || level;
}
