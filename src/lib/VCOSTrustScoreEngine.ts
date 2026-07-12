/**
 * VCOS AI TRUST SCORE & ELIGIBILITY ENGINE
 * Phase 50 — Enterprise Trust Framework
 *
 * Trust Score is NOT a financial credit score.
 * It is an internal VCOS participation score used only inside the VLOOP ecosystem.
 */

import { supabase } from './supabase';

export const VCOS_TRUST_ENGINE_VERSION = '50.0.0' as const;

// ============================================================
// TRUST LEVELS
// ============================================================

export const TRUST_LEVELS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
  ELITE: 'elite',
} as const;

export type TrustLevelCode = typeof TRUST_LEVELS[keyof typeof TRUST_LEVELS];

export const TRUST_LEVEL_CONFIG: Record<TrustLevelCode, { name: string; min: number; max: number; color: string }> = {
  bronze: { name: 'Bronze', min: 0, max: 199, color: '#CD7F32' },
  silver: { name: 'Silver', min: 200, max: 399, color: '#C0C0C0' },
  gold: { name: 'Gold', min: 400, max: 599, color: '#FFD700' },
  platinum: { name: 'Platinum', min: 600, max: 799, color: '#E5E4E2' },
  diamond: { name: 'Diamond', min: 800, max: 899, color: '#B9F2FF' },
  elite: { name: 'Elite', min: 900, max: 1000, color: '#9333EA' },
};

// ============================================================
// TRUST TRENDS
// ============================================================

export const TRUST_TRENDS = {
  RISING: 'rising',
  STABLE: 'stable',
  DECLINING: 'declining',
} as const;

export type TrustTrend = typeof TRUST_TRENDS[keyof typeof TRUST_TRENDS];

export const BEHAVIOUR_TRENDS = {
  IMPROVING: 'improving',
  STABLE: 'stable',
  DECLINING: 'declining',
} as const;

export type BehaviourTrend = typeof BEHAVIOUR_TRENDS[keyof typeof BEHAVIOUR_TRENDS];

// ============================================================
// SCORE HISTORY TYPES
// ============================================================

export const CHANGE_TYPES = {
  INITIAL: 'initial',
  AUTOMATIC: 'automatic',
  MANUAL_OVERRIDE: 'manual_override',
  SYSTEM_ADJUSTMENT: 'system_adjustment',
  PENALTY: 'penalty',
  BONUS: 'bonus',
  RECALCULATION: 'recalculation',
  RESET: 'reset',
} as const;

export type ChangeType = typeof CHANGE_TYPES[keyof typeof CHANGE_TYPES];

// ============================================================
// INTERFACES
// ============================================================

export interface TrustLevel {
  id: string;
  level_name: string;
  level_code: TrustLevelCode;
  min_score: number;
  max_score: number;
  display_order: number;
  badge_color: string;
  benefits: string[];
  is_active: boolean;
}

export interface CustomerTrustScore {
  id: string;
  user_id: string;
  trust_score: number;
  trust_level: TrustLevelCode;

  // Component Scores
  purchase_consistency_score: number;
  careclub_frequency_score: number;
  smartcode_participation_score: number;
  weekly_challenge_score: number;
  wallet_activity_score: number;
  reward_history_score: number;
  account_age_score: number;
  identity_verification_score: number;
  profile_completion_score: number;
  community_participation_score: number;
  foe_participation_score: number;
  ai_behaviour_score: number;

  // Risk Scores
  risk_score: number;
  fraud_risk_score: number;

  // Trends
  trust_trend: TrustTrend;
  behaviour_trend: BehaviourTrend;
  activity_trend: 'increasing' | 'stable' | 'decreasing';

  // AI
  ai_confidence_score: number;
  ai_last_analysis: string | null;
  ai_recommendations: unknown[];
  ai_risk_alerts: unknown[];

  // Override
  is_manually_overridden: boolean;
  override_reason: string | null;
  overridden_by: string | null;
  override_expires_at: string | null;
  is_locked: boolean;
  locked_by: string | null;
  locked_reason: string | null;
  locked_at: string | null;

  // Progress
  points_to_next_level: number;
  progress_percent: number;

  last_calculated_at: string;
  last_activity_at: string;
  created_at: string;
}

export interface TrustScoreHistory {
  id: string;
  user_id: string;
  previous_score: number | null;
  new_score: number;
  score_change: number;
  previous_level: string | null;
  new_level: string;
  change_type: ChangeType;
  change_reason: string | null;
  component_changes: Record<string, unknown>;
  ai_decision: Record<string, unknown>;
  ai_confidence: number | null;
  is_manual_override: boolean;
  overridden_by: string | null;
  override_reason: string | null;
  calculated_by: string;
  created_at: string;
}

export interface TrustFactor {
  id: string;
  factor_code: string;
  factor_name: string;
  category: 'positive' | 'negative' | 'neutral';
  weight: number;
  max_score: number;
  description: string | null;
  is_active: boolean;
  display_order: number;
}

export interface EligibilityRule {
  id: string;
  rule_code: string;
  rule_name: string;
  description: string | null;
  min_trust_level: TrustLevelCode | null;
  min_trust_score: number;
  min_account_age_days: number;
  min_purchases: number;
  min_careclub_contributions: number;
  min_smartcode_participations: number;
  max_risk_score: number;
  max_fraud_risk_score: number;
  requires_identity_verified: boolean;
  is_active: boolean;
}

export interface EligibilityResult {
  eligible: boolean;
  rule_name: string;
  checks: Array<{ reason: string; current: unknown; required: unknown }>;
}

export interface TrustImprovement {
  id: string;
  improvement_code: string;
  title: string;
  description: string | null;
  category: 'activity' | 'verification' | 'participation' | 'profile' | 'community';
  potential_points: number;
  priority: number;
  action_link: string | null;
  is_active: boolean;
}

export interface TrustScoreSummary {
  trust_score: number;
  trust_level: TrustLevelCode;
  trust_trend: TrustTrend;
  behaviour_trend: BehaviourTrend;
  activity_trend: 'increasing' | 'stable' | 'decreasing';
  ai_confidence: number;
  risk_score: number;
  fraud_risk_score: number;
  points_to_next_level: number;
  progress_percent: number;
  component_scores: {
    purchase_consistency: number;
    careclub_frequency: number;
    smartcode_participation: number;
    weekly_challenge: number;
    wallet_activity: number;
    reward_history: number;
    account_age: number;
    identity_verification: number;
    profile_completion: number;
    community_participation: number;
    foe_participation: number;
    ai_behaviour: number;
  };
  is_locked: boolean;
  last_calculated: string | null;
}

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function calculateTrustScore(userId: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('vcos_calculate_trust_score', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data as Record<string, unknown>;
}

export async function getUserTrustSummary(userId: string): Promise<TrustScoreSummary> {
  const { data, error } = await supabase.rpc('vcos_get_user_trust_summary', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data as TrustScoreSummary;
}

export async function checkEligibility(userId: string, ruleCode: string): Promise<EligibilityResult> {
  const { data, error } = await supabase.rpc('vcos_check_eligibility', {
    p_user_id: userId,
    p_rule_code: ruleCode,
  });
  if (error) throw error;
  return data as EligibilityResult;
}

export async function getUserTrustScore(userId: string): Promise<CustomerTrustScore | null> {
  const { data, error } = await supabase
    .from('vcos_customer_trust_score')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as CustomerTrustScore | null;
}

export async function getTrustScoreHistory(userId: string, limit: number = 30): Promise<TrustScoreHistory[]> {
  const { data, error } = await supabase
    .from('vcos_trust_score_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as TrustScoreHistory[];
}

export async function getTrustLevels(): Promise<TrustLevel[]> {
  const { data, error } = await supabase
    .from('vcos_trust_levels')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) throw error;
  return (data || []) as TrustLevel[];
}

export async function getTrustFactors(): Promise<TrustFactor[]> {
  const { data, error } = await supabase
    .from('vcos_trust_factors')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) throw error;
  return (data || []) as TrustFactor[];
}

export async function getEligibilityRules(): Promise<EligibilityRule[]> {
  const { data, error } = await supabase
    .from('vcos_eligibility_rules')
    .select('*')
    .eq('is_active', true);
  if (error) throw error;
  return (data || []) as EligibilityRule[];
}

export async function getTrustImprovements(): Promise<TrustImprovement[]> {
  const { data, error } = await supabase
    .from('vcos_trust_improvements')
    .select('*')
    .eq('is_active', true)
    .order('priority');
  if (error) throw error;
  return (data || []) as TrustImprovement[];
}

// ============================================================
// ADMIN FUNCTIONS
// ============================================================

export async function overrideTrustScore(
  userId: string,
  adminId: string,
  newScore: number,
  reason: string,
  expiresAt?: string
): Promise<void> {
  const { error } = await supabase
    .from('vcos_customer_trust_score')
    .update({
      trust_score: newScore,
      is_manually_overridden: true,
      override_reason: reason,
      overridden_by: adminId,
      override_expires_at: expiresAt || null,
    })
    .eq('user_id', userId);
  if (error) throw error;
}

export async function lockTrustScore(
  userId: string,
  adminId: string,
  reason: string
): Promise<void> {
  const { error } = await supabase
    .from('vcos_customer_trust_score')
    .update({
      is_locked: true,
      locked_by: adminId,
      locked_reason: reason,
      locked_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
  if (error) throw error;
}

export async function unlockTrustScore(userId: string): Promise<void> {
  const { error } = await supabase
    .from('vcos_customer_trust_score')
    .update({
      is_locked: false,
      locked_by: null,
      locked_reason: null,
      locked_at: null,
    })
    .eq('user_id', userId);
  if (error) throw error;
}

export async function resetTrustScore(userId: string): Promise<void> {
  const { error } = await supabase
    .from('vcos_customer_trust_score')
    .update({
      trust_score: 100,
      trust_level: 'bronze',
      is_manually_overridden: false,
      override_reason: null,
      overridden_by: null,
      override_expires_at: null,
    })
    .eq('user_id', userId);
  if (error) throw error;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getTrustLevelName(level: TrustLevelCode): string {
  return TRUST_LEVEL_CONFIG[level]?.name || level;
}

export function getTrustLevelColor(level: TrustLevelCode): string {
  return TRUST_LEVEL_CONFIG[level]?.color || '#6B7280';
}

export function getTrustLevelMin(level: TrustLevelCode): number {
  return TRUST_LEVEL_CONFIG[level]?.min || 0;
}

export function getTrustLevelMax(level: TrustLevelCode): number {
  return TRUST_LEVEL_CONFIG[level]?.max || 199;
}

export function getScoreByTrustLevel(score: number): TrustLevelCode {
  if (score >= 900) return 'elite';
  if (score >= 800) return 'diamond';
  if (score >= 600) return 'platinum';
  if (score >= 400) return 'gold';
  if (score >= 200) return 'silver';
  return 'bronze';
}

export function getTrendIcon(trend: TrustTrend | BehaviourTrend): string {
  if (trend === 'rising' || trend === 'improving') return '↑';
  if (trend === 'declining') return '↓';
  return '→';
}

export function getTrendColor(trend: string): string {
  if (trend === 'rising' || trend === 'improving' || trend === 'increasing') return 'text-emerald-400';
  if (trend === 'declining' || trend === 'decreasing') return 'text-red-400';
  return 'text-slate-400';
}

export function getTrendBgClass(trend: string): string {
  if (trend === 'rising' || trend === 'improving' || trend === 'increasing') return 'bg-emerald-500/20 text-emerald-400';
  if (trend === 'declining' || trend === 'decreasing') return 'bg-red-500/20 text-red-400';
  return 'bg-slate-500/20 text-slate-400';
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function getRiskColor(level: 'low' | 'medium' | 'high' | 'critical'): string {
  const colors = {
    low: 'text-emerald-400',
    medium: 'text-amber-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
  };
  return colors[level];
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}

export function calculateProgressPercent(current: number, level: TrustLevelCode): number {
  const config = TRUST_LEVEL_CONFIG[level];
  if (!config) return 0;
  const range = config.max - config.min;
  const progress = current - config.min;
  return Math.min(100, Math.max(0, (progress / range) * 100));
}

export function getPointsToNextLevel(current: number): number {
  const nextLevel = Object.values(TRUST_LEVEL_CONFIG).find(
    (level) => level.min > current
  );
  return nextLevel ? nextLevel.min - current : 0;
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockTrustSummary(): TrustScoreSummary {
  return {
    trust_score: 485,
    trust_level: 'gold',
    trust_trend: 'rising',
    behaviour_trend: 'improving',
    activity_trend: 'increasing',
    ai_confidence: 92,
    risk_score: 12,
    fraud_risk_score: 5,
    points_to_next_level: 115,
    progress_percent: 42.5,
    component_scores: {
      purchase_consistency: 75,
      careclub_frequency: 60,
      smartcode_participation: 45,
      weekly_challenge: 30,
      wallet_activity: 85,
      reward_history: 70,
      account_age: 45,
      identity_verification: 100,
      profile_completion: 80,
      community_participation: 25,
      foe_participation: 35,
      ai_behaviour: 85,
    },
    is_locked: false,
    last_calculated: new Date().toISOString(),
  };
}

export function getMockTrustHistory(): TrustScoreHistory[] {
  return [
    {
      id: 'hist-1',
      user_id: 'user-1',
      previous_score: 450,
      new_score: 485,
      score_change: 35,
      previous_level: 'silver',
      new_level: 'gold',
      change_type: 'automatic',
      change_reason: 'Weekly recalculation - improved purchase consistency',
      component_changes: { purchase_consistency: '+10', weekly_challenge: '+5' },
      ai_decision: { confidence: 92 },
      ai_confidence: 92,
      is_manual_override: false,
      overridden_by: null,
      override_reason: null,
      calculated_by: 'system',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'hist-2',
      user_id: 'user-1',
      previous_score: 420,
      new_score: 450,
      score_change: 30,
      previous_level: 'silver',
      new_level: 'silver',
      change_type: 'automatic',
      change_reason: 'Care Club contribution bonus',
      component_changes: { careclub_frequency: '+15' },
      ai_decision: { confidence: 88 },
      ai_confidence: 88,
      is_manual_override: false,
      overridden_by: null,
      override_reason: null,
      calculated_by: 'system',
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getMockImprovements(): TrustImprovement[] {
  return [
    {
      id: 'imp-1',
      improvement_code: 'verify_identity',
      title: 'Verify Your Identity',
      description: 'Complete identity verification for a significant trust boost',
      category: 'verification',
      potential_points: 50,
      priority: 1,
      action_link: '/profile/verify',
      is_active: true,
    },
    {
      id: 'imp-2',
      improvement_code: 'participate_smartcode',
      title: 'Join SmartCode Challenges',
      description: 'Participate in weekly SmartCode challenges to improve your score',
      category: 'participation',
      potential_points: 20,
      priority: 2,
      action_link: '/smartcode',
      is_active: true,
    },
    {
      id: 'imp-3',
      improvement_code: 'join_foe',
      title: 'Join Future Opportunities',
      description: 'Participate in FOE projects for substantial trust gains',
      category: 'participation',
      potential_points: 30,
      priority: 3,
      action_link: '/future-opportunities',
      is_active: true,
    },
    {
      id: 'imp-4',
      improvement_code: 'add_referrals',
      title: 'Invite Friends',
      description: 'Refer new members to VLOOP and earn trust points',
      category: 'community',
      potential_points: 15,
      priority: 4,
      action_link: '/dashboard',
      is_active: true,
    },
  ];
}
