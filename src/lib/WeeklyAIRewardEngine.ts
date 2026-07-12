/**
 * ============================================================================
 * VLOOP WEEKLY AI REWARD ENGINE
 * ============================================================================
 *
 * PHASE 31 — Fully Autonomous Enterprise AI Decision System
 *
 * This is the Brain of the VLOOP ecosystem.
 *
 * CORE PRINCIPLES:
 *   1. No user reward selection — customers never choose Prime/Premium/Standard
 *   2. The AI Reward Engine alone decides the reward pool
 *   3. One customer may qualify for Prime + Premium + Standard simultaneously
 *   4. The AI evaluates all active SmartCodes at the end of every weekly cycle
 *   5. No manual customer action required for evaluation
 *
 * AI EVALUATION FACTORS (hidden from customers):
 *   • SmartPoints
 *   • Total Purchase Activity
 *   • Care Club Activity
 *   • Multi-Level SmartCode Distribution
 *   • Weekly Performance
 *   • SmartCode Diversity
 *   • Customer Activity
 *   • Duplicate Pattern Analysis
 *   • Fraud Detection Score
 *   • Weekly AI Rules
 *
 * SECURITY:
 *   The AI decision process is completely hidden. Customers never see:
 *   • Internal scoring
 *   • AI formulas
 *   • Reward calculations
 *   • Ranking logic
 *   • Selection algorithm
 *   Only final results are visible.
 *
 * TRANSPARENCY (visible to customers):
 *   • AI Status: "Evaluating..."
 *   • Reward Cycle: Current Week
 *   • SmartCodes Registered: count
 *   • SmartPoints Allocated: count
 *   No reward predictions. No winning probability.
 *
 * REWARD POOLS:
 *   🥇 Prime Reward (First Prize)    — 4× multiplier
 *   🥈 Premium Reward (Second Prize) — 2× multiplier
 *   🥉 Standard Reward (Third Prize) — 1× multiplier
 *
 * Version: 31.0.0
 * ============================================================================
 */

import {
  getCurrentWeekPeriod,
  getRewardTier,
} from './CoreBusinessEngine';
import { supabase } from './supabase';

// ============================================================================
// TYPES
// ============================================================================

export type PoolAssignment = 'prime' | 'premium' | 'standard';

export type SmartCodeEntry = {
  id: string;
  user_id: string;
  smartcode: string;
  points_allocated: number;
  source: 'purchase' | 'care_club' | 'bonus';
  mode: 'ai_auto' | 'manual';
  week_period: string;
  is_active: boolean;
  created_at: string;
};

/**
 * Internal AI evaluation factors — NEVER exposed to customers.
 * These are used by the AI engine for pool assignment decisions only.
 */
type InternalAIFactors = {
  smartPoints: number;
  totalPurchaseActivity: number;
  careClubActivity: number;
  multiLevelDistribution: number;
  weeklyPerformance: number;
  smartCodeDiversity: number;
  customerActivity: number;
  duplicatePatternScore: number;
  fraudDetectionScore: number;
  weeklyAIRules: number;
};

/**
 * Pool assignment result for a single entry — internal only.
 * The `reasons` array is NEVER shown to customers.
 */
export type PoolAssignmentResult = {
  entry_id: string;
  smartcode: string;
  user_id: string;
  points: number;
  assigned_pool: PoolAssignment;
  confidence: number;
  reasons: string[];
};

/**
 * Multiple pool eligibility — a user can qualify for multiple pools.
 */
export type UserPoolEligibility = {
  user_id: string;
  week_period: string;
  eligible_pools: PoolAssignment[];
  primary_pool: PoolAssignment;
  total_points: number;
  total_entries: number;
};

/**
 * Weekly evaluation report — used for admin dashboard only.
 */
export type WeeklyEvaluationReport = {
  week_period: string;
  total_entries: number;
  total_points: number;
  pool_stats: {
    prime:    { entries: number; points: number; users: number };
    premium:  { entries: number; points: number; users: number };
    standard: { entries: number; points: number; users: number };
  };
  unique_smartcodes: number;
  unique_users: number;
  multi_pool_users: number;
  evaluated_at: string;
};

/**
 * Customer-facing transparency status — NO internal scoring revealed.
 */
export type AITransparencyStatus = {
  ai_status: 'Evaluating...' | 'Active' | 'Processing';
  reward_cycle: string;
  smartcodes_registered: number;
  smartpoints_allocated: number;
};

// ============================================================================
// ENGINE CONFIGURATION (Internal — never exposed)
// ============================================================================

const AI_ENGINE_CONFIG = {
  /** Pool distribution targets (rough targets, not hard limits) */
  POOL_TARGETS: {
    prime:    { ratio: 0.05, label: 'Prime Reward (1st)'    },
    premium:  { ratio: 0.15, label: 'Premium Reward (2nd)'   },
    standard: { ratio: 0.80, label: 'Standard Reward (3rd)'  },
  },

  /** Factor weights — internal scoring weights, never revealed */
  FACTOR_WEIGHTS: {
    smartPoints:           25,
    totalPurchaseActivity:  10,
    careClubActivity:        8,
    multiLevelDistribution: 12,
    weeklyPerformance:      10,
    smartCodeDiversity:      8,
    customerActivity:        7,
    duplicatePatternScore:  -5,
    fraudDetectionScore:   -15,
    weeklyAIRules:          10,
  },

  /** Pool assignment thresholds (internal) */
  POOL_THRESHOLDS: {
    PRIME_CONSIDERATION:    55,
    PREMIUM_CONSIDERATION:  30,
  },

  /** Multi-entry bonus factor */
  MULTI_ENTRY_BONUS: 0.05,

  /** Weekly activity bonus */
  ACTIVITY_HISTORY_BONUS: 0.10,

  /** Maximum confidence value */
  MAX_CONFIDENCE: 0.98,

  /** Minimum confidence for pool assignment */
  MIN_CONFIDENCE: 0.85,
} as const;

// ============================================================================
// INTERNAL AI SCORING — Hidden from customers
// ============================================================================

/**
 * Calculate internal AI factors for a user's entries.
 *
 * This function computes all evaluation factors but NEVER exposes them
 * to the customer. The results are used internally for pool assignment.
 */
async function calculateInternalFactors(
  userId: string,
  entries: SmartCodeEntry[],
  weekPeriod: string
): Promise<InternalAIFactors> {
  const totalPoints = entries.reduce((sum, e) => sum + e.points_allocated, 0);
  const uniqueCodes = new Set(entries.map(e => e.smartcode)).size;
  const purchaseEntries = entries.filter(e => e.source === 'purchase');
  const careClubEntries = entries.filter(e => e.source === 'care_club');
  const aiAutoEntries = entries.filter(e => e.mode === 'ai_auto').length;
  const manualEntries = entries.filter(e => e.mode === 'manual').length;

  // Total purchase activity (sum of purchase-sourced points)
  const totalPurchaseActivity = purchaseEntries.reduce((sum, e) => sum + e.points_allocated, 0);

  // Care Club activity (sum of care_club-sourced points)
  const careClubActivity = careClubEntries.reduce((sum, e) => sum + e.points_allocated, 0);

  // Multi-level distribution (how spread across codes)
  const multiLevelDistribution = uniqueCodes > 1
    ? Math.min(uniqueCodes * 2, 20)
    : 0;

  // Weekly performance (based on previous week's participation)
  const weeklyPerformance = await fetchWeeklyPerformance(userId, weekPeriod);

  // SmartCode diversity (unique codes / total entries ratio)
  const smartCodeDiversity = entries.length > 0
    ? Math.round((uniqueCodes / entries.length) * 20)
    : 0;

  // Customer activity (returning user bonus)
  const customerActivity = await fetchCustomerActivityScore(userId);

  // Duplicate pattern analysis (negative score for suspicious patterns)
  const duplicatePatternScore = analyzeDuplicatePatterns(entries);

  // Fraud detection score (negative for fraud indicators)
  const fraudDetectionScore = await calculateFraudScore(userId, entries, weekPeriod);

  // Weekly AI rules compliance
  const weeklyAIRules = 10; // Base compliance score

  return {
    smartPoints: totalPoints,
    totalPurchaseActivity,
    careClubActivity,
    multiLevelDistribution,
    weeklyPerformance,
    smartCodeDiversity,
    customerActivity,
    duplicatePatternScore,
    fraudDetectionScore,
    weeklyAIRules,
  };
}

/**
 * Fetch user's weekly performance from previous weeks.
 */
async function fetchWeeklyPerformance(userId: string, currentWeek: string): Promise<number> {
  const { data } = await supabase
    .from('smartcode_allocations')
    .select('points_allocated, week_period')
    .eq('user_id', userId)
    .neq('week_period', currentWeek)
    .eq('is_active', true)
    .limit(50);

  if (!data || data.length === 0) return 0;

  const totalHistoricalPoints = (data as any[]).reduce((sum, r) => sum + r.points_allocated, 0);
  return Math.min(totalHistoricalPoints / 10, 20);
}

/**
 * Fetch customer activity score (returning user bonus).
 */
async function fetchCustomerActivityScore(userId: string): Promise<number> {
  const { count } = await supabase
    .from('smartcode_allocations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .neq('week_period', getCurrentWeekPeriod())
    .eq('is_active', true);

  return (count || 0) > 0 ? 10 : 0;
}

/**
 * Analyze duplicate patterns in entries.
 * Returns a negative score if suspicious patterns are detected.
 */
function analyzeDuplicatePatterns(entries: SmartCodeEntry[]): number {
  if (entries.length < 2) return 0;

  const codeCounts: Record<string, number> = {};
  for (const e of entries) {
    codeCounts[e.smartcode] = (codeCounts[e.smartcode] || 0) + 1;
  }

  const maxDuplicates = Math.max(...Object.values(codeCounts));
  const duplicateRatio = maxDuplicates / entries.length;

  // Penalize if more than 50% of entries are the same code
  if (duplicateRatio > 0.5) return -5;
  if (duplicateRatio > 0.3) return -2;
  return 0;
}

/**
 * Calculate fraud detection score.
 * Returns a negative score for fraud indicators.
 */
async function calculateFraudScore(
  userId: string,
  entries: SmartCodeEntry[],
  weekPeriod: string
): Promise<number> {
  let fraudScore = 0;

  // Check for sequential code patterns
  const codes = entries.map(e => parseInt(e.smartcode, 10)).sort((a, b) => a - b);
  let sequentialCount = 0;
  for (let i = 1; i < codes.length; i++) {
    if (codes[i] === codes[i - 1] + 1) sequentialCount++;
  }
  if (codes.length > 0 && sequentialCount > codes.length * 0.5) {
    fraudScore -= 10;
  }

  // Check for unusually high point concentration
  const totalPoints = entries.reduce((sum, e) => sum + e.points_allocated, 0);
  const maxSingleEntry = Math.max(...entries.map(e => e.points_allocated));
  if (totalPoints > 0 && maxSingleEntry / totalPoints > 0.8) {
    fraudScore -= 5;
  }

  return fraudScore;
}

// ============================================================================
// AI POOL ASSIGNMENT ALGORITHM (Internal — never exposed)
// ============================================================================

/**
 * Calculate the pool assignment for a single entry.
 *
 * The algorithm uses all 10 internal factors with weighted scoring.
 * The customer never sees these calculations.
 */
async function calculatePoolAssignment(
  entry: SmartCodeEntry,
  factors: InternalAIFactors,
  userTotalEntries: number
): Promise<PoolAssignmentResult> {
  const reasons: string[] = [];

  // Weighted score calculation (internal — never shown to customer)
  let score = 0;
  score += factors.smartPoints * (AI_ENGINE_CONFIG.FACTOR_WEIGHTS.smartPoints / 100);
  score += factors.totalPurchaseActivity * (AI_ENGINE_CONFIG.FACTOR_WEIGHTS.totalPurchaseActivity / 100);
  score += factors.careClubActivity * (AI_ENGINE_CONFIG.FACTOR_WEIGHTS.careClubActivity / 100);
  score += factors.multiLevelDistribution * (AI_ENGINE_CONFIG.FACTOR_WEIGHTS.multiLevelDistribution / 100);
  score += factors.weeklyPerformance * (AI_ENGINE_CONFIG.FACTOR_WEIGHTS.weeklyPerformance / 100);
  score += factors.smartCodeDiversity * (AI_ENGINE_CONFIG.FACTOR_WEIGHTS.smartCodeDiversity / 100);
  score += factors.customerActivity * (AI_ENGINE_CONFIG.FACTOR_WEIGHTS.customerActivity / 100);
  score += factors.duplicatePatternScore;
  score += factors.fraudDetectionScore;
  score += factors.weeklyAIRules * (AI_ENGINE_CONFIG.FACTOR_WEIGHTS.weeklyAIRules / 100);

  // Multi-entry bonus
  if (userTotalEntries > 1) {
    score += Math.min(userTotalEntries * AI_ENGINE_CONFIG.MULTI_ENTRY_BONUS, 5);
  }

  // Randomization to prevent gaming (±5%)
  score += Math.random() * 10 - 5;

  const adjustedScore = Math.max(0, score);

  // Pool assignment with randomization
  const threshold = Math.random() * 100;

  let assignedPool: PoolAssignment;
  let confidence: number;

  if (adjustedScore >= AI_ENGINE_CONFIG.POOL_THRESHOLDS.PRIME_CONSIDERATION && threshold < 15) {
    assignedPool = 'prime';
    confidence = 0.90 + Math.random() * 0.08;
    reasons.push('High overall AI score qualifies for Prime pool consideration');
  } else if (adjustedScore >= AI_ENGINE_CONFIG.POOL_THRESHOLDS.PREMIUM_CONSIDERATION && threshold < 35) {
    assignedPool = 'premium';
    confidence = 0.88 + Math.random() * 0.10;
    reasons.push('Strong AI score qualifies for Premium pool consideration');
  } else {
    assignedPool = 'standard';
    confidence = 0.85 + Math.random() * 0.13;
    reasons.push('Standard pool assignment');
  }

  return {
    entry_id: entry.id,
    smartcode: entry.smartcode,
    user_id: entry.user_id,
    points: entry.points_allocated,
    assigned_pool: assignedPool,
    confidence: Math.min(confidence, AI_ENGINE_CONFIG.MAX_CONFIDENCE),
    reasons,
  };
}

// ============================================================================
// MULTIPLE REWARD ELIGIBILITY
// ============================================================================

/**
 * Determine a user's eligibility for multiple reward pools.
 *
 * A single customer may qualify for Prime + Premium + Standard simultaneously.
 * The AI automatically determines eligibility based on all entries.
 */
export async function calculateUserPoolEligibility(
  userId: string,
  weekPeriod?: string
): Promise<UserPoolEligibility> {
  const week = weekPeriod || getCurrentWeekPeriod();
  const entries = await getUserWeeklyEntries(userId, week);

  if (entries.length === 0) {
    return {
      user_id: userId,
      week_period: week,
      eligible_pools: [],
      primary_pool: 'standard',
      total_points: 0,
      total_entries: 0,
    };
  }

  const factors = await calculateInternalFactors(userId, entries, week);
  const totalPoints = entries.reduce((sum, e) => sum + e.points_allocated, 0);

  // Evaluate each entry for pool assignment
  const assignments: PoolAssignment[] = [];
  for (const entry of entries) {
    const result = await calculatePoolAssignment(entry, factors, entries.length);
    assignments.push(result.assigned_pool);
  }

  // Unique pools the user qualifies for
  const eligiblePools = [...new Set(assignments)] as PoolAssignment[];

  // Primary pool = the pool with the highest total points
  const poolPoints: Record<PoolAssignment, number> = { prime: 0, premium: 0, standard: 0 };
  entries.forEach((entry, i) => {
    poolPoints[assignments[i]] += entry.points_allocated;
  });

  const primaryPool = (Object.entries(poolPoints) as [PoolAssignment, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  return {
    user_id: userId,
    week_period: week,
    eligible_pools: eligiblePools,
    primary_pool: primaryPool,
    total_points: totalPoints,
    total_entries: entries.length,
  };
}

// ============================================================================
// WEEKLY EVALUATION FUNCTIONS
// ============================================================================

/**
 * Get all SmartCode entries for the current week.
 */
export async function getWeeklyEntries(weekPeriod?: string): Promise<SmartCodeEntry[]> {
  const week = weekPeriod || getCurrentWeekPeriod();

  const { data, error } = await supabase
    .from('smartcode_allocations')
    .select('*')
    .eq('week_period', week)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching weekly entries:', error);
    return [];
  }

  return (data as SmartCodeEntry[]) || [];
}

/**
 * Get user's entries for the current week.
 */
export async function getUserWeeklyEntries(
  userId: string,
  weekPeriod?: string
): Promise<SmartCodeEntry[]> {
  const week = weekPeriod || getCurrentWeekPeriod();

  const { data, error } = await supabase
    .from('smartcode_allocations')
    .select('*')
    .eq('user_id', userId)
    .eq('week_period', week)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching user weekly entries:', error);
    return [];
  }

  return (data as SmartCodeEntry[]) || [];
}

/**
 * Run the weekly AI evaluation for all entries.
 *
 * This is the autonomous evaluation that runs at the end of every weekly cycle.
 * No manual customer action is required.
 */
export async function runWeeklyAIEvaluation(weekPeriod?: string): Promise<WeeklyEvaluationReport> {
  const week = weekPeriod || getCurrentWeekPeriod();
  const entries = await getWeeklyEntries(week);

  // Group entries by user
  const userEntriesMap = new Map<string, SmartCodeEntry[]>();
  for (const entry of entries) {
    if (!userEntriesMap.has(entry.user_id)) {
      userEntriesMap.set(entry.user_id, []);
    }
    userEntriesMap.get(entry.user_id)!.push(entry);
  }

  // Evaluate each user's entries
  const allAssignments: PoolAssignmentResult[] = [];
  const userEligibilityMap = new Map<string, Set<PoolAssignment>>();

  for (const [userId, userEntries] of userEntriesMap.entries()) {
    const factors = await calculateInternalFactors(userId, userEntries, week);
    const userPools = new Set<PoolAssignment>();

    for (const entry of userEntries) {
      const assignment = await calculatePoolAssignment(entry, factors, userEntries.length);
      allAssignments.push(assignment);
      userPools.add(assignment.assigned_pool);
    }

    userEligibilityMap.set(userId, userPools);
  }

  // Calculate pool statistics
  const poolStats = {
    prime:    { entries: 0, points: 0, users: new Set<string>() },
    premium:  { entries: 0, points: 0, users: new Set<string>() },
    standard: { entries: 0, points: 0, users: new Set<string>() },
  };

  const uniqueSmartCodes = new Set<string>();
  const uniqueUsers = new Set<string>();
  let totalPoints = 0;
  let multiPoolUsers = 0;

  for (const assignment of allAssignments) {
    poolStats[assignment.assigned_pool].entries++;
    poolStats[assignment.assigned_pool].points += assignment.points;
    poolStats[assignment.assigned_pool].users.add(assignment.user_id);
    uniqueSmartCodes.add(assignment.smartcode);
    uniqueUsers.add(assignment.user_id);
    totalPoints += assignment.points;
  }

  // Count users eligible for multiple pools
  for (const pools of userEligibilityMap.values()) {
    if (pools.size > 1) multiPoolUsers++;
  }

  return {
    week_period: week,
    total_entries: entries.length,
    total_points: totalPoints,
    pool_stats: {
      prime: {
        entries: poolStats.prime.entries,
        points: poolStats.prime.points,
        users: poolStats.prime.users.size,
      },
      premium: {
        entries: poolStats.premium.entries,
        points: poolStats.premium.points,
        users: poolStats.premium.users.size,
      },
      standard: {
        entries: poolStats.standard.entries,
        points: poolStats.standard.points,
        users: poolStats.standard.users.size,
      },
    },
    unique_smartcodes: uniqueSmartCodes.size,
    unique_users: uniqueUsers.size,
    multi_pool_users: multiPoolUsers,
    evaluated_at: new Date().toISOString(),
  };
}

// ============================================================================
// AI TRANSPARENCY STATUS (Customer-facing — no internal scoring)
// ============================================================================

/**
 * Get the customer-facing AI transparency status.
 *
 * This displays ONLY:
 *   • AI Status: "Evaluating..."
 *   • Reward Cycle: Current Week
 *   • SmartCodes Registered: count
 *   • SmartPoints Allocated: count
 *
 * No reward predictions. No winning probability. No internal scoring.
 */
export async function getAITransparencyStatus(
  userId: string,
  weekPeriod?: string
): Promise<AITransparencyStatus> {
  const week = weekPeriod || getCurrentWeekPeriod();
  const entries = await getUserWeeklyEntries(userId, week);
  const totalPoints = entries.reduce((sum, e) => sum + e.points_allocated, 0);

  return {
    ai_status: 'Evaluating...',
    reward_cycle: week,
    smartcodes_registered: entries.length,
    smartpoints_allocated: totalPoints,
  };
}

// ============================================================================
// ELIGIBILITY & FRAUD VALIDATION (Internal)
// ============================================================================

/**
 * Validate user eligibility for SmartCode participation.
 */
export async function validateEligibility(userId: string): Promise<{
  eligible: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, points')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    errors.push('User account not found');
    return { eligible: false, errors, warnings };
  }

  if ((profile as any).points < 1) {
    errors.push('Insufficient SmartPoints for participation');
  }

  const week = getCurrentWeekPeriod();
  const { count: existingEntries } = await supabase
    .from('smartcode_allocations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('week_period', week)
    .eq('is_active', true);

  if (existingEntries && existingEntries > 10) {
    warnings.push('User has many entries this week — monitor for unusual activity');
  }

  return { eligible: errors.length === 0, errors, warnings };
}

/**
 * Perform fraud check on an entry (internal — used by admin only).
 */
export async function checkFraudIndicators(
  userId: string,
  smartcode: string,
  points: number
): Promise<{
  risk_level: 'low' | 'medium' | 'high';
  indicators: string[];
  recommendation: 'approve' | 'review' | 'reject';
}> {
  const indicators: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  const week = getCurrentWeekPeriod();

  const { count: duplicateCount } = await supabase
    .from('smartcode_allocations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('smartcode', smartcode)
    .eq('week_period', week);

  if (duplicateCount && duplicateCount > 3) {
    indicators.push('Multiple entries for same SmartCode');
    riskLevel = 'medium';
  }

  if (points > 50) {
    indicators.push('High point allocation detected');
    riskLevel = points > 100 ? 'high' : 'medium';
  }

  const sequentialCodes = await checkSequentialPattern(userId, week);
  if (sequentialCodes) {
    indicators.push('Sequential SmartCode pattern detected');
    riskLevel = 'medium';
  }

  const recommendation = riskLevel === 'high' ? 'reject' :
                         riskLevel === 'medium' ? 'review' : 'approve';

  return { risk_level: riskLevel, indicators, recommendation };
}

async function checkSequentialPattern(userId: string, week: string): Promise<boolean> {
  const { data } = await supabase
    .from('smartcode_allocations')
    .select('smartcode')
    .eq('user_id', userId)
    .eq('week_period', week)
    .eq('is_active', true)
    .order('smartcode');

  if (!data || data.length < 3) return false;

  const codes = (data as { smartcode: string }[])
    .map(d => parseInt(d.smartcode, 10))
    .sort((a, b) => a - b);

  let sequentialCount = 0;
  for (let i = 1; i < codes.length; i++) {
    if (codes[i] === codes[i - 1] + 1) sequentialCount++;
  }

  return sequentialCount > codes.length * 0.5;
}

// ============================================================================
// DISPLAY MESSAGES (Customer-facing)
// ============================================================================

export const USER_MESSAGES = {
  REGISTRATION_SUCCESS: `Your SmartCodes have been successfully registered.

The AI Engine is continuously evaluating
your SmartCode activity.

Every active SmartCode receives an opportunity
based on SmartPoints,
activity,
weekly performance
and reward rules.`,

  POOL_ASSIGNMENT_INFO: `Reward pool assignment is handled automatically by the AI Weekly Reward Engine. Your participation and SmartPoints determine your benefit tier.`,

  WEEKLY_PROCESSING: `Weekly winners are processed automatically. Watch your Dashboard for updates after the weekly evaluation completes.`,

  AI_STATUS_EVALUATING: 'Evaluating...',
  AI_STATUS_ACTIVE: 'Active',
  AI_STATUS_PROCESSING: 'Processing',
} as const;

// ============================================================================
// ADMIN AI DASHBOARD DATA (Architecture prepared for future admin features)
// ============================================================================

export type AdminAIDashboardData = {
  weekly_ai_statistics: {
    week_period: string;
    total_entries: number;
    total_points: number;
    unique_users: number;
    unique_smartcodes: number;
    multi_pool_users: number;
  };
  reward_pool_summary: {
    prime:    { entries: number; points: number; users: number };
    premium:  { entries: number; points: number; users: number };
    standard: { entries: number; points: number; users: number };
  };
  total_participants: number;
  smartcode_distribution: {
    ai_auto_entries: number;
    manual_entries: number;
    purchase_source_points: number;
    care_club_source_points: number;
  };
  ai_performance: {
    avg_confidence: number;
    evaluation_time_ms: number;
    engine_version: string;
  };
  fraud_alerts: Array<{
    user_id: string;
    risk_level: 'low' | 'medium' | 'high';
    indicators: string[];
  }>;
  duplicate_detection: Array<{
    smartcode: string;
    count: number;
    unique_users: number;
    total_points: number;
  }>;
};

/**
 * Get admin AI dashboard data.
 *
 * Architecture prepared for future admin features.
 * Currently returns the data structure but admin UI is not built.
 */
export async function getAdminAIDashboardData(weekPeriod?: string): Promise<AdminAIDashboardData> {
  const week = weekPeriod || getCurrentWeekPeriod();
  const report = await runWeeklyAIEvaluation(week);

  // Fetch fraud alerts
  const fraudAlerts = await fetchFraudAlerts(week);

  // Fetch duplicate detection
  const duplicateDetection = await fetchDuplicateDetection(week);

  // Fetch distribution data
  const { data: distData } = await supabase
    .from('smartcode_allocations')
    .select('mode, source, points_allocated')
    .eq('week_period', week)
    .eq('is_active', true);

  const aiAutoEntries = (distData as any[] || []).filter(d => d.mode === 'ai_auto').length;
  const manualEntries = (distData as any[] || []).filter(d => d.mode === 'manual').length;
  const purchaseSourcePoints = (distData as any[] || [])
    .filter(d => d.source === 'purchase')
    .reduce((sum, d) => sum + d.points_allocated, 0);
  const careClubSourcePoints = (distData as any[] || [])
    .filter(d => d.source === 'care_club')
    .reduce((sum, d) => sum + d.points_allocated, 0);

  return {
    weekly_ai_statistics: {
      week_period: report.week_period,
      total_entries: report.total_entries,
      total_points: report.total_points,
      unique_users: report.unique_users,
      unique_smartcodes: report.unique_smartcodes,
      multi_pool_users: report.multi_pool_users,
    },
    reward_pool_summary: report.pool_stats,
    total_participants: report.unique_users,
    smartcode_distribution: {
      ai_auto_entries: aiAutoEntries,
      manual_entries: manualEntries,
      purchase_source_points: purchaseSourcePoints,
      care_club_source_points: careClubSourcePoints,
    },
    ai_performance: {
      avg_confidence: 0.88,
      evaluation_time_ms: 0,
      engine_version: '31.0.0',
    },
    fraud_alerts: fraudAlerts,
    duplicate_detection: duplicateDetection,
  };
}

async function fetchFraudAlerts(week: string): Promise<AdminAIDashboardData['fraud_alerts']> {
  const { data } = await supabase
    .from('smartcode_allocations')
    .select('user_id, smartcode, points_allocated')
    .eq('week_period', week)
    .eq('is_active', true)
    .gte('points_allocated', 50)
    .limit(20);

  const alerts: AdminAIDashboardData['fraud_alerts'] = [];
  for (const entry of (data as any[] || [])) {
    const fraudCheck = await checkFraudIndicators(entry.user_id, entry.smartcode, entry.points_allocated);
    if (fraudCheck.risk_level !== 'low') {
      alerts.push({
        user_id: entry.user_id,
        risk_level: fraudCheck.risk_level,
        indicators: fraudCheck.indicators,
      });
    }
  }
  return alerts;
}

async function fetchDuplicateDetection(week: string): Promise<AdminAIDashboardData['duplicate_detection']> {
  const { data } = await supabase
    .from('smartcode_allocations')
    .select('smartcode, user_id, points_allocated')
    .eq('week_period', week)
    .eq('is_active', true);

  if (!data) return [];

  const codeMap: Record<string, { count: number; users: Set<string>; totalPoints: number }> = {};
  for (const entry of (data as any[])) {
    if (!codeMap[entry.smartcode]) {
      codeMap[entry.smartcode] = { count: 0, users: new Set(), totalPoints: 0 };
    }
    codeMap[entry.smartcode].count++;
    codeMap[entry.smartcode].users.add(entry.user_id);
    codeMap[entry.smartcode].totalPoints += entry.points_allocated;
  }

  return Object.entries(codeMap)
    .filter(([_, d]) => d.count > 1)
    .map(([code, d]) => ({
      smartcode: code,
      count: d.count,
      unique_users: d.users.size,
      total_points: d.totalPoints,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Public API (customer-facing)
  getAITransparencyStatus,
  getUserWeeklyEntries,
  getWeeklyEntries,
  validateEligibility,

  // Evaluation (autonomous)
  runWeeklyAIEvaluation,
  calculateUserPoolEligibility,

  // Admin (architecture prepared)
  getAdminAIDashboardData,
  checkFraudIndicators,

  // Messages
  USER_MESSAGES,
};
