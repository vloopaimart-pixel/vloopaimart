/**
 * VLOOP AI TRUST SCORE & FINANCIAL INTELLIGENCE ENGINE
 * Phase 39 — Enterprise AI Trust Score, Reputation & Financial Intelligence
 *
 * Enterprise architecture supporting:
 * - Universal Trust Score Engine (0-1000 dynamic score)
 * - Trust Factors (16 different scoring factors)
 * - AI Reputation Engine (Customer, Seller, Partner, Franchise, Brand)
 * - Financial Intelligence (Growth, Trends, Savings, Credit Recommendation)
 * - Future Eligibility Engine (Housing, EV, Land, Business Finance)
 * - AI Risk Analysis (Fraud, Business, Transaction, Behavior Risk)
 *
 * No demo data. No hardcoded values. Architecture only.
 */

import { supabase } from './supabase';

export const TRUST_ENGINE_VERSION = '39.0.0' as const;

export const TRUST_ENGINE_META = {
  version: TRUST_ENGINE_VERSION,
  name: 'VLOOP AI Trust Score & Financial Intelligence Engine',
  lockedSince: '2026-07-02',
} as const;

// ============================================================
// CONSTANTS
// ============================================================

export const TRUST_LEVELS = {
  NEW: 'new',
  BUILDING: 'building',
  ESTABLISHED: 'established',
  TRUSTED: 'trusted',
  PREMIUM: 'premium',
  ELITE: 'elite',
} as const;

export type TrustLevel = typeof TRUST_LEVELS[keyof typeof TRUST_LEVELS];

export const TRUST_LEVEL_THRESHOLDS: Record<TrustLevel, { min: number; max: number }> = {
  new: { min: 0, max: 199 },
  building: { min: 200, max: 399 },
  established: { min: 400, max: 599 },
  trusted: { min: 600, max: 749 },
  premium: { min: 750, max: 899 },
  elite: { min: 900, max: 1000 },
};

export const TRUST_FACTOR_TYPES = {
  PURCHASE_HISTORY: 'purchase_history',
  CARE_CLUB_PARTICIPATION: 'care_club_participation',
  SUCCESSFUL_DELIVERIES: 'successful_deliveries',
  SELLER_REPUTATION: 'seller_reputation',
  CUSTOMER_REVIEWS: 'customer_reviews',
  REFUND_HISTORY: 'refund_history',
  FRAUD_DETECTION: 'fraud_detection',
  ACCOUNT_VERIFICATION: 'account_verification',
  PLATFORM_ACTIVITY: 'platform_activity',
  COMMUNITY_CONTRIBUTION: 'community_contribution',
  FINANCIAL_BEHAVIOR: 'financial_behavior',
  SMARTCODE_PARTICIPATION: 'smartcode_participation',
  WALLET_ACTIVITY: 'wallet_activity',
  REFERRAL_SUCCESS: 'referral_success',
  SUPPORT_INTERACTIONS: 'support_interactions',
  PROFILE_COMPLETENESS: 'profile_completeness',
} as const;

export type TrustFactorType = typeof TRUST_FACTOR_TYPES[keyof typeof TRUST_FACTOR_TYPES];

export const ENTITY_TYPES = {
  CUSTOMER: 'customer',
  SELLER: 'seller',
  PARTNER: 'partner',
  FRANCHISE: 'franchise',
  BRAND: 'brand',
  MANUFACTURER: 'manufacturer',
} as const;

export type EntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES];

export const SPENDING_TIERS = {
  BASIC: 'basic',
  REGULAR: 'regular',
  FREQUENT: 'frequent',
  PREMIUM: 'premium',
  ELITE: 'elite',
} as const;

export type SpendingTier = typeof SPENDING_TIERS[keyof typeof SPENDING_TIERS];

export const RISK_LEVELS = {
  MINIMAL: 'minimal',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS];

export const EVENT_TYPES = {
  PURCHASE_COMPLETED: 'purchase_completed',
  DELIVERY_CONFIRMED: 'delivery_confirmed',
  REVIEW_SUBMITTED: 'review_submitted',
  REVIEW_RECEIVED: 'review_received',
  REFUND_REQUESTED: 'refund_requested',
  REFUND_PROCESSED: 'refund_processed',
  RETURNED_ITEM: 'returned_item',
  CARE_CLUB_JOINED: 'care_club_joined',
  CARE_CLUB_RENEWED: 'care_club_renewed',
  SMARTCODE_SCANNED: 'smartcode_scanned',
  SMARTCODE_WINNER: 'smartcode_winner',
  WALLET_TOPUP: 'wallet_topup',
  WALLET_WITHDRAWAL: 'wallet_withdrawal',
  REFERRAL_COMPLETED: 'referral_completed',
  SUPPORT_TICKET_RESOLVED: 'support_ticket_resolved',
  PROFILE_VERIFIED: 'profile_verified',
  FRAUD_DETECTED: 'fraud_detected',
  DISPUTE_LOST: 'dispute_lost',
  DISPUTE_WON: 'dispute_won',
  ORDER_CANCELLED: 'order_cancelled',
  LATE_PAYMENT: 'late_payment',
  EARLY_PAYMENT: 'early_payment',
  LOYALTY_MILESTONE: 'loyalty_milestone',
  COMMUNITY_CONTRIBUTION: 'community_contribution',
  SELLER_UPGRADE: 'seller_upgrade',
  PARTNER_UPGRADE: 'partner_upgrade',
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export const RISK_EVENT_TYPES = {
  SUSPICIOUS_TRANSACTION: 'suspicious_transaction',
  UNUSUAL_PATTERN: 'unusual_pattern',
  MULTIPLE_REFUNDS: 'multiple_refunds',
  HIGH_VALUE_RETURN: 'high_value_return',
  ACCOUNT_TAKEOVER_ATTEMPT: 'account_takeover_attempt',
  VELOCITY_BREACH: 'velocity_breach',
  LOCATION_ANOMALY: 'location_anomaly',
  DEVICE_CHANGE: 'device_change',
  BEHAVIOR_ANOMALY: 'behavior_anomaly',
  CHARGEBACK_FILED: 'chargeback_filed',
  DISPUTE_PATTERN: 'dispute_pattern',
  REVIEW_REQUEST: 'review_request',
  TRUST_DEVIATION_DETECTED: 'trust_deviation_detected',
  MANUAL_FLAG: 'manual_flag',
  SYSTEM_FLAG: 'system_flag',
  CLEARED: 'cleared',
} as const;

export type RiskEventType = typeof RISK_EVENT_TYPES[keyof typeof RISK_EVENT_TYPES];

export const CREDIT_RECOMMENDATIONS = {
  NOT_RECOMMENDED: 'not_recommended',
  CAUTION: 'caution',
  STANDARD: 'standard',
  PREFERRED: 'preferred',
  PREMIUM: 'premium',
} as const;

export type CreditRecommendation = typeof CREDIT_RECOMMENDATIONS[keyof typeof CREDIT_RECOMMENDATIONS];

// ============================================================
// TYPES
// ============================================================

export interface TrustScoreProfile {
  id: string;
  user_id: string;
  trust_score: number;
  trust_level: TrustLevel;
  score_version: string;
  last_calculated_at: string | null;
  next_calculation_at: string | null;
  calculation_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  is_verified: boolean;
  is_frozen: boolean;
  frozen_reason: string | null;
  frozen_at: string | null;
  frozen_by: string | null;
  manual_override: number | null;
  override_reason: string | null;
  override_by: string | null;
  override_expires_at: string | null;
}

export interface TrustScoreFactor {
  id: string;
  profile_id: string;
  factor_type: TrustFactorType;
  factor_score: number;
  factor_weight: number;
  weighted_score: number;
  raw_value: number | null;
  normalized_value: number | null;
  percentile_rank: number | null;
  trend_direction: 'up' | 'down' | 'stable' | null;
  trend_strength: number | null;
  last_updated_at: string | null;
  data_points: number;
  confidence_level: number;
  contributing_events: number;
}

export interface TrustScoreHistory {
  id: string;
  profile_id: string;
  user_id: string;
  previous_score: number | null;
  new_score: number;
  score_change: number | null;
  change_reason: string | null;
  change_type: 'calculation' | 'manual_override' | 'event_trigger' | 'system_adjustment' | 'fraud_penalty' | 'verification_bonus';
  contributing_factors: Record<string, unknown>;
  algorithm_version: string | null;
  calculated_at: string;
}

export interface TrustScoreEvent {
  id: string;
  profile_id: string;
  user_id: string;
  event_type: EventType;
  event_reference_id: string | null;
  event_reference_type: string | null;
  score_impact: number;
  factor_impacted: string | null;
  event_data: Record<string, unknown>;
  processed_at: string | null;
  is_processed: boolean;
}

export interface ReputationProfile {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  reputation_score: number;
  reputation_level: 'new' | 'rising' | 'established' | 'top_rated' | 'premium' | 'legendary';
  rating_avg: number;
  rating_count: number;
  review_count: number;
  response_rate: number;
  response_time_avg: number | null;
  resolution_rate: number;
  repeat_customer_rate: number;
  referral_count: number;
  successful_transactions: number;
  issue_rate: number;
  complaint_count: number;
  dispute_win_rate: number;
  trust_signals: Record<string, unknown>;
}

export interface FinancialIntelligenceProfile {
  id: string;
  user_id: string;
  financial_score: number;
  spending_tier: SpendingTier;
  savings_score: number;
  contribution_score: number;
  growth_trajectory: 'declining' | 'stable' | 'growing' | 'accelerating' | null;
  purchase_trend_direction: string | null;
  purchase_trend_strength: number | null;
  savings_trend_direction: string | null;
  savings_trend_strength: number | null;
  weekly_spending_avg: number;
  monthly_spending_avg: number;
  yearly_spending: number;
  lifetime_value: number;
  predicted_yearly_spending: number | null;
  churn_risk_level: 'low' | 'medium' | 'high' | 'critical';
  engagement_score: number;
  activity_frequency: 'dormant' | 'occasional' | 'regular' | 'active' | 'highly_active' | null;
  days_since_last_activity: number | null;
  credit_recommendation: CreditRecommendation | null;
  credit_recommendation_score: number | null;
  ai_analysis: Record<string, unknown>;
  model_version: string | null;
}

export interface EligibilityProfile {
  id: string;
  user_id: string;
  affordable_housing_eligible: boolean;
  affordable_housing_score: number;
  ev_project_eligible: boolean;
  ev_project_score: number;
  land_project_eligible: boolean;
  land_project_score: number;
  business_finance_eligible: boolean;
  business_finance_score: number;
  partner_upgrade_eligible: boolean;
  partner_upgrade_score: number;
  premium_membership_eligible: boolean;
  premium_membership_score: number;
  enterprise_opportunity_eligible: boolean;
  enterprise_opportunity_score: number;
  overall_eligibility_score: number;
  eligibility_factors: Record<string, unknown>;
  restrictions: string[] | null;
  next_review_date: string | null;
  last_reviewed_at: string | null;
}

export interface RiskAnalysisProfile {
  id: string;
  user_id: string;
  overall_risk_level: RiskLevel;
  overall_risk_score: number;
  fraud_risk_score: number;
  fraud_risk_level: RiskLevel | null;
  business_risk_score: number;
  business_risk_level: RiskLevel | null;
  transaction_risk_score: number;
  transaction_risk_level: RiskLevel | null;
  behavior_risk_score: number;
  behavior_risk_level: RiskLevel | null;
  trust_deviation_score: number;
  trust_deviation_direction: string | null;
  manual_review_required: boolean;
  manual_review_reason: string | null;
  review_priority: 'low' | 'medium' | 'high' | 'urgent' | null;
  flags: Array<{ type: string; timestamp: string; details: string }>;
  risk_factors: Record<string, unknown>;
  mitigation_recommendations: Array<{ recommendation: string; priority: string }>;
  last_assessed_at: string | null;
  assessment_count: number;
}

export interface RiskEvent {
  id: string;
  user_id: string;
  risk_profile_id: string | null;
  event_type: RiskEventType;
  severity: 'info' | 'warning' | 'high' | 'critical';
  event_data: Record<string, unknown>;
  detected_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  resolution_status: 'open' | 'investigating' | 'resolved' | 'false_positive' | 'escalated';
  escalation_level: number;
  assigned_to: string | null;
}

// ============================================================
// TRUST SCORE FUNCTIONS
// ============================================================

export async function getTrustScoreProfile(userId: string): Promise<TrustScoreProfile | null> {
  const { data, error } = await supabase
    .from('trust_score_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as TrustScoreProfile | null;
}

export async function createTrustScoreProfile(userId: string): Promise<TrustScoreProfile> {
  const { data, error } = await supabase
    .from('trust_score_profiles')
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as TrustScoreProfile;
}

export async function calculateUserTrustScore(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_trust_score', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}

export async function getTrustLevelFromScore(score: number): Promise<TrustLevel> {
  const { data, error } = await supabase.rpc('get_trust_level', {
    p_score: score,
  });

  if (error) {
    if (score >= 900) return 'elite';
    if (score >= 750) return 'premium';
    if (score >= 600) return 'trusted';
    if (score >= 400) return 'established';
    if (score >= 200) return 'building';
    return 'new';
  }
  return data;
}

export async function getTrustScoreFactors(profileId: string): Promise<TrustScoreFactor[]> {
  const { data, error } = await supabase
    .from('trust_score_factors')
    .select('*')
    .eq('profile_id', profileId);

  if (error) throw error;
  return (data || []) as TrustScoreFactor[];
}

export async function getTrustScoreHistory(userId: string, limit: number = 100): Promise<TrustScoreHistory[]> {
  const { data, error } = await supabase
    .from('trust_score_history')
    .select('*')
    .eq('user_id', userId)
    .order('calculated_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as TrustScoreHistory[];
}

export async function recordTrustScoreEvent(event: Partial<TrustScoreEvent>): Promise<TrustScoreEvent> {
  const { data, error } = await supabase
    .from('trust_score_events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data as TrustScoreEvent;
}

export async function processPendingTrustEvents(): Promise<number> {
  const { data, error } = await supabase
    .from('trust_score_events')
    .select('*')
    .eq('is_processed', false);

  if (error) throw error;
  return data?.length || 0;
}

export function getTrustFactorArchitecture(): Array<{ factor: TrustFactorType; description: string; weight: number; impact: 'positive' | 'negative' | 'neutral' }> {
  return [
    { factor: 'purchase_history', description: 'Total purchase value and frequency', weight: 100, impact: 'positive' },
    { factor: 'care_club_participation', description: 'Care Club membership and renewals', weight: 80, impact: 'positive' },
    { factor: 'successful_deliveries', description: 'Completed deliveries without issues', weight: 70, impact: 'positive' },
    { factor: 'seller_reputation', description: 'Rating as seller (if applicable)', weight: 60, impact: 'positive' },
    { factor: 'customer_reviews', description: 'Reviews given and received', weight: 80, impact: 'positive' },
    { factor: 'refund_history', description: 'Refund requests frequency', weight: -50, impact: 'negative' },
    { factor: 'fraud_detection', description: 'Fraud flags and violations', weight: -100, impact: 'negative' },
    { factor: 'account_verification', description: 'Account verification status', weight: 100, impact: 'positive' },
    { factor: 'platform_activity', description: 'Regular platform engagement', weight: 50, impact: 'positive' },
    { factor: 'community_contribution', description: 'Community participation', weight: 50, impact: 'positive' },
    { factor: 'financial_behavior', description: 'Payment history and reliability', weight: 70, impact: 'positive' },
    { factor: 'smartcode_participation', description: 'SmartCode engagement', weight: 40, impact: 'positive' },
    { factor: 'wallet_activity', description: 'Wallet usage and balance', weight: 30, impact: 'positive' },
    { factor: 'referral_success', description: 'Successful referrals', weight: 60, impact: 'positive' },
    { factor: 'support_interactions', description: 'Support ticket history', weight: 20, impact: 'neutral' },
    { factor: 'profile_completeness', description: 'Profile information completeness', weight: 30, impact: 'positive' },
  ];
}

// ============================================================
// REPUTATION FUNCTIONS
// ============================================================

export async function getReputationProfile(entityType: EntityType, entityId: string): Promise<ReputationProfile | null> {
  const { data, error } = await supabase
    .from('reputation_profiles')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .maybeSingle();

  if (error) throw error;
  return data as ReputationProfile | null;
}

export async function createReputationProfile(entityType: EntityType, entityId: string): Promise<ReputationProfile> {
  const { data, error } = await supabase
    .from('reputation_profiles')
    .insert({ entity_type: entityType, entity_id: entityId })
    .select()
    .single();

  if (error) throw error;
  return data as ReputationProfile;
}

export function getReputationLevelArchitecture(): Array<{ level: string; name: string; score_range: string; benefits: string[] }> {
  return [
    {
      level: 'new',
      name: 'New',
      score_range: '0-20',
      benefits: ['Basic features', 'Standard support'],
    },
    {
      level: 'rising',
      name: 'Rising Star',
      score_range: '21-40',
      benefits: ['Priority support', 'Extended returns'],
    },
    {
      level: 'established',
      name: 'Established',
      score_range: '41-60',
      benefits: ['Premium support', 'Early access', 'Discount codes'],
    },
    {
      level: 'top_rated',
      name: 'Top Rated',
      score_range: '61-80',
      benefits: ['VIP support', 'Exclusive offers', 'Beta features'],
    },
    {
      level: 'premium',
      name: 'Premium',
      score_range: '81-90',
      benefits: ['Dedicated manager', 'Custom benefits', 'Priority listing'],
    },
    {
      level: 'legendary',
      name: 'Legendary',
      score_range: '91-100',
      benefits: ['All premium benefits', 'Brand partnership', 'Revenue share opportunities'],
    },
  ];
}

// ============================================================
// FINANCIAL INTELLIGENCE FUNCTIONS
// ============================================================

export async function getFinancialIntelligenceProfile(userId: string): Promise<FinancialIntelligenceProfile | null> {
  const { data, error } = await supabase
    .from('financial_intelligence_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as FinancialIntelligenceProfile | null;
}

export async function createFinancialIntelligenceProfile(userId: string): Promise<FinancialIntelligenceProfile> {
  const { data, error } = await supabase
    .from('financial_intelligence_profiles')
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as FinancialIntelligenceProfile;
}

export function getFinancialIntelligenceArchitecture(): Array<{ metric: string; description: string; factors: string[] }> {
  return [
    {
      metric: 'Customer Growth',
      description: 'New customer acquisition rate',
      factors: ['referrals', 'new_signups', 'retention'],
    },
    {
      metric: 'Business Growth',
      description: 'Business revenue trajectory',
      factors: ['revenue_trend', 'margin_growth', 'market_share'],
    },
    {
      metric: 'Purchase Trends',
      description: 'Purchase pattern analysis',
      factors: ['frequency', 'basket_size', 'category_mix'],
    },
    {
      metric: 'Savings Pattern',
      description: 'Savings behavior analysis',
      factors: ['wallet_balance', 'point_savings', 'discount_usage'],
    },
    {
      metric: 'Contribution Pattern',
      description: 'Community contribution behavior',
      factors: ['reviews_written', 'referrals_made', 'helpful_votes'],
    },
  ];
}

// ============================================================
// ELIGIBILITY FUNCTIONS
// ============================================================

export async function getEligibilityProfile(userId: string): Promise<EligibilityProfile | null> {
  const { data, error } = await supabase
    .from('eligibility_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as EligibilityProfile | null;
}

export async function createEligibilityProfile(userId: string): Promise<EligibilityProfile> {
  const { data, error } = await supabase
    .from('eligibility_profiles')
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as EligibilityProfile;
}

export function getFutureEligibilityArchitecture(): Array<{ program: string; description: string; eligibility_factors: string[] }> {
  return [
    {
      program: 'Affordable Housing',
      description: 'Eligibility for affordable housing projects',
      eligibility_factors: ['trust_score', 'income_verification', 'residency', 'payment_history'],
    },
    {
      program: 'EV Projects',
      description: 'Electric vehicle financing programs',
      eligibility_factors: ['trust_score', 'driving_history', 'environmental_score', 'financial_stability'],
    },
    {
      program: 'Land Projects',
      description: 'Land acquisition programs',
      eligibility_factors: ['trust_score', 'residency', 'financial_capacity', 'community_standing'],
    },
    {
      program: 'Business Finance',
      description: 'Business financing opportunities',
      eligibility_factors: ['trust_score', 'business_performance', 'seller_rating', 'revenue_history'],
    },
    {
      program: 'Partner Upgrade',
      description: 'Eligibility for partner tier upgrade',
      eligibility_factors: ['trust_score', 'performance_metrics', 'compliance', 'customer_satisfaction'],
    },
    {
      program: 'Premium Membership',
      description: 'Premium membership eligibility',
      eligibility_factors: ['trust_score', 'activity_level', 'spending_tier', 'loyalty_score'],
    },
    {
      program: 'Enterprise Opportunities',
      description: 'Enterprise-level opportunities',
      eligibility_factors: ['trust_score', 'business_scale', 'compliance', 'track_record'],
    },
  ];
}

// ============================================================
// RISK ANALYSIS FUNCTIONS
// ============================================================

export async function getRiskAnalysisProfile(userId: string): Promise<RiskAnalysisProfile | null> {
  const { data, error } = await supabase
    .from('risk_analysis_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as RiskAnalysisProfile | null;
}

export async function createRiskAnalysisProfile(userId: string): Promise<RiskAnalysisProfile> {
  const { data, error } = await supabase
    .from('risk_analysis_profiles')
    .insert({ user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as RiskAnalysisProfile;
}

export async function getRiskEvents(userId: string, status?: string): Promise<RiskEvent[]> {
  let query = supabase
    .from('risk_events')
    .select('*')
    .eq('user_id', userId);

  if (status) {
    query = query.eq('resolution_status', status);
  }

  query = query.order('detected_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as RiskEvent[];
}

export async function getPendingRiskReviews(): Promise<RiskEvent[]> {
  const { data, error } = await supabase
    .from('risk_events')
    .select('*')
    .in('resolution_status', ['open', 'investigating'])
    .order('detected_at', { ascending: true });

  if (error) throw error;
  return (data || []) as RiskEvent[];
}

export function getRiskAnalysisArchitecture(): Array<{ risk_type: string; description: string; indicators: string[] }> {
  return [
    {
      risk_type: 'Fraud Risk',
      description: 'Fraud and account security risk',
      indicators: ['suspicious_transactions', 'velocity_patterns', 'device_fingerprint', 'location_anomalies'],
    },
    {
      risk_type: 'Business Risk',
      description: 'Business-related risks',
      indicators: ['seller_performance', 'refund_rates', 'complaint_frequency', 'compliance_violations'],
    },
    {
      risk_type: 'Transaction Risk',
      description: 'Transaction-level risks',
      indicators: ['high_value_transactions', 'unusual_patterns', 'chargeback_history', 'payment_failures'],
    },
    {
      risk_type: 'Behavior Risk',
      description: 'User behavior risk',
      indicators: ['activity_patterns', 'engagement_deviation', 'trust_deviation', 'lifecycle_signals'],
    },
    {
      risk_type: 'Trust Deviation',
      description: 'Trust score anomalies',
      indicators: ['score_volatility', 'unexpected_changes', 'manual_flags', 'audit_results'],
    },
  ];
}

// ============================================================
// DASHBOARD FUNCTIONS
// ============================================================

export async function getTrustDashboard(): Promise<{
  total_profiles: number;
  verified_profiles: number;
  avg_trust_score: number;
  elite_users: number;
  premium_users: number;
  trusted_users: number;
  high_risk_users: number;
  pending_reviews: number;
  pending_events: number;
  level_distribution: Array<{ level: string; count: number }>;
}> {
  const { data, error } = await supabase.rpc('get_trust_dashboard');

  if (error) {
    const [
      { count: total_profiles },
      { count: verified_profiles },
      { count: elite_users },
      { count: premium_users },
      { count: trusted_users },
      { count: high_risk_users },
      { count: pending_reviews },
      { count: pending_events },
    ] = await Promise.all([
      supabase.from('trust_score_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('trust_score_profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true),
      supabase.from('trust_score_profiles').select('*', { count: 'exact', head: true }).eq('trust_level', 'elite'),
      supabase.from('trust_score_profiles').select('*', { count: 'exact', head: true }).eq('trust_level', 'premium'),
      supabase.from('trust_score_profiles').select('*', { count: 'exact', head: true }).eq('trust_level', 'trusted'),
      supabase.from('risk_analysis_profiles').select('*', { count: 'exact', head: true }).in('overall_risk_level', ['high', 'critical']),
      supabase.from('risk_analysis_profiles').select('*', { count: 'exact', head: true }).eq('manual_review_required', true),
      supabase.from('trust_score_events').select('*', { count: 'exact', head: true }).eq('is_processed', false),
    ]);

    return {
      total_profiles: total_profiles || 0,
      verified_profiles: verified_profiles || 0,
      avg_trust_score: 0,
      elite_users: elite_users || 0,
      premium_users: premium_users || 0,
      trusted_users: trusted_users || 0,
      high_risk_users: high_risk_users || 0,
      pending_reviews: pending_reviews || 0,
      pending_events: pending_events || 0,
      level_distribution: [],
    };
  }

  return data;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getTrustLevelLabel(level: TrustLevel): string {
  const labels: Record<TrustLevel, string> = {
    new: 'New Member',
    building: 'Building Trust',
    established: 'Established',
    trusted: 'Trusted',
    premium: 'Premium',
    elite: 'Elite',
  };
  return labels[level] || level;
}

export function getRiskLevelLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    minimal: 'Minimal Risk',
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical Risk',
  };
  return labels[level] || level;
}

export function getSpendingTierLabel(tier: SpendingTier): string {
  const labels: Record<SpendingTier, string> = {
    basic: 'Basic Spender',
    regular: 'Regular Customer',
    frequent: 'Frequent Buyer',
    premium: 'Premium Customer',
    elite: 'Elite Customer',
  };
  return labels[tier] || tier;
}

export function getCreditRecommendationLabel(rec: CreditRecommendation): string {
  const labels: Record<CreditRecommendation, string> = {
    not_recommended: 'Not Recommended',
    caution: 'Caution',
    standard: 'Standard',
    preferred: 'Preferred',
    premium: 'Premium',
  };
  return labels[rec] || rec;
}

export function formatTrustScore(score: number): string {
  return score.toLocaleString() + ' / 1,000';
}

export function getScoreProgress(score: number): { level: TrustLevel; progress: number; nextLevel: TrustLevel | null } {
  const thresholds = Object.entries(TRUST_LEVEL_THRESHOLDS) as [TrustLevel, { min: number; max: number }][];
  const levels = thresholds.sort((a, b) => a[1].min - b[1].min);

  for (let i = 0; i < levels.length; i++) {
    const [level, range] = levels[i];
    if (score <= range.max) {
      const nextLevel = i < levels.length - 1 ? levels[i + 1][0] : null;
      const progress = ((score - range.min) / (range.max - range.min)) * 100;
      return { level, progress, nextLevel };
    }
  }

  return { level: 'elite', progress: 100, nextLevel: null };
}
