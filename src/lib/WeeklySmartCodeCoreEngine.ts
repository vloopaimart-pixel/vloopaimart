/**
 * VLOOP WEEKLY SMARTCODE AI CORE ENGINE
 * Phase 40 — VLOOP Weekly SmartCode Challenge FINAL CORE
 *
 * LOCKED BASE RULES (Immutable):
 * - Purchase: ₹40 = 1 SmartPoint
 * - Care Club: ₹10 = 5 SmartPoints
 *
 * Entry Methods:
 * - AI Automatic SmartCode
 * - Manual SmartCode Entry (unlimited)
 * - Offline OCR SmartCode (photo upload)
 * - Voice SmartCode (future)
 * - WhatsApp SmartCode (future)
 *
 * Reward Pools (AI Assigned Only):
 * - Prime Reward: ₹400 (First Prize)
 * - Premium Reward: ₹200 (Second Prize)
 * - Standard Reward: ₹100 (Third Prize)
 *
 * No demo data. No hardcoded values. Architecture only.
 */

import { supabase } from './supabase';

export const SMARTCODE_CORE_VERSION = '40.0.0' as const;

export const SMARTCODE_CORE_META = {
  version: SMARTCODE_CORE_VERSION,
  name: 'VLOOP Weekly SmartCode AI Core Engine',
  lockedSince: '2026-07-02',
  lockedRules: {
    purchase: { amount: 40, currency: 'INR', points: 1, description: '₹40 Purchase = 1 SmartPoint' },
    careClub: { amount: 10, currency: 'INR', points: 5, description: '₹10 Care Club = 5 SmartPoints' },
  },
} as const;

// ============================================================
// LOCKED CONSTANTS (Immutable)
// ============================================================

export const LOCKED_PURCHASE_RATE = {
  amount: 40,
  currency: 'INR',
  points: 1,
  formula: 'FLOOR(purchase_amount / 40)',
  description: '₹40 Purchase = 1 SmartPoint',
} as const;

export const LOCKED_CARECLUB_RATE = {
  amount: 10,
  currency: 'INR',
  points: 5,
  formula: 'FLOOR(contribution_amount / 10) * 5',
  description: '₹10 Care Club Contribution = 5 SmartPoints',
} as const;

export const SMARTCODE_RANGE = {
  min: 0,
  max: 999,
  pattern: '^[0-9]{3}$',
  format: '000–999',
} as const;

export const ENTRY_METHODS = {
  AI_AUTOMATIC: 'ai_automatic',
  MANUAL: 'manual',
  OFFLINE_OCR: 'offline_ocr',
  VOICE: 'voice',
  WHATSAPP: 'whatsapp',
} as const;

export type EntryMethod = typeof ENTRY_METHODS[keyof typeof ENTRY_METHODS];

export const REWARD_POOLS = {
  PRIME: 'prime',
  PREMIUM: 'premium',
  STANDARD: 'standard',
} as const;

export type RewardPoolType = typeof REWARD_POOLS[keyof typeof REWARD_POOLS];

export const LOCKED_REWARDS: Record<RewardPoolType, { amount: number; position: number; name: string }> = {
  prime: { amount: 400, position: 1, name: 'Prime Reward (First Prize)' },
  premium: { amount: 200, position: 2, name: 'Premium Reward (Second Prize)' },
  standard: { amount: 100, position: 3, name: 'Standard Reward (Third Prize)' },
};

export const VOICE_LANGUAGES = {
  EN: 'en',
  ML: 'ml',
  HI: 'hi',
  AR: 'ar',
} as const;

export type VoiceLanguage = typeof VOICE_LANGUAGES[keyof typeof VOICE_LANGUAGES];

export const VALIDATION_TYPES = {
  OCR_VERIFICATION: 'ocr_verification',
  RECEIPT_MATCHING: 'receipt_matching',
  CUSTOMER_VERIFICATION: 'customer_verification',
  DUPLICATE_DETECTION: 'duplicate_detection',
  BEHAVIOR_ANALYSIS: 'behavior_analysis',
  FRAUD_DETECTION: 'fraud_detection',
  PATTERN_ANALYSIS: 'pattern_analysis',
  VELOCITY_CHECK: 'velocity_check',
  LOCATION_CHECK: 'location_check',
  DEVICE_CHECK: 'device_check',
} as const;

export type ValidationType = typeof VALIDATION_TYPES[keyof typeof VALIDATION_TYPES];

// ============================================================
// TYPES
// ============================================================

export interface SmartCodeEntry {
  id: string;
  user_id: string;
  week_period: string;
  smartcode: string;
  point_allocation: number;
  entry_method: EntryMethod;
  source_reference: string | null;
  receipt_url: string | null;
  receipt_verified: boolean;
  is_duplicate: boolean;
  duplicate_of: string | null;
  ai_confidence_score: number | null;
  ai_validation_status: 'pending' | 'validated' | 'rejected' | 'requires_review';
  ai_validation_notes: string | null;
  fraud_score: number;
  fraud_flags: Array<{ type: string; timestamp: string }>;
  requires_manual_review: boolean;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_status: 'approved' | 'rejected' | 'escalated' | null;
  review_notes: string | null;
  is_winner: boolean;
  winner_pool_type: RewardPoolType | null;
  winner_position: number | null;
  winner_reward_amount: number | null;
  winner_reward_paid: boolean;
  metadata: Record<string, unknown>;
}

export interface WeeklyRewardAssignment {
  id: string;
  week_period: string;
  user_id: string;
  smartcode_entry_id: string | null;
  pool_type: RewardPoolType;
  position: number;
  assignment_type: 'ai_automatic' | 'manual_override' | 'admin_approved';
  ai_score: number | null;
  ai_factors: Record<string, unknown>;
  requires_admin_approval: boolean;
  admin_approved_at: string | null;
  admin_approved_by: string | null;
  reward_amount: number;
  reward_status: 'pending' | 'approved' | 'paid' | 'cancelled' | 'disqualified';
  paid_at: string | null;
  payout_reference: string | null;
}

export interface AIWeeklyEvaluation {
  id: string;
  week_period: string;
  user_id: string;
  total_smartcodes: number;
  total_points: number;
  purchase_activity_score: number;
  careclub_activity_score: number;
  weekly_activity_score: number;
  performance_score: number;
  rule_compliance_score: number;
  fraud_risk_score: number;
  manual_review_score: number;
  overall_score: number;
  percentile_rank: number | null;
  weightage_factor: number;
  eligible_for_draw: boolean;
  disqualification_reason: string | null;
  ai_factors: Record<string, unknown>;
  ai_recommendation: string | null;
  model_version: string | null;
}

export interface AIWeeklyDrawSession {
  id: string;
  week_period: string;
  draw_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  draw_started_at: string | null;
  draw_completed_at: string | null;
  total_entries: number;
  total_participants: number;
  validation_passed: number;
  validation_failed: number;
  duplicates_detected: number;
  fraud_flagged: number;
  prime_winner_id: string | null;
  premium_winner_id: string | null;
  standard_winner_id: string | null;
  prime_smartcode: string | null;
  premium_smartcode: string | null;
  standard_smartcode: string | null;
}

export interface SmartCodeMultiEntry {
  id: string;
  user_id: string;
  week_period: string;
  batch_code: string | null;
  smartcodes: Array<{ code: string; points: number }>;
  total_points: number;
  entry_method: EntryMethod;
  batch_status: 'pending' | 'processing' | 'completed' | 'partial' | 'failed';
  processed_smartcodes: number;
  failed_smartcodes: number;
  created_smartcode_ids: string[];
}

export interface VoiceSmartCodeSession {
  id: string;
  user_id: string;
  language: VoiceLanguage;
  audio_url: string | null;
  transcript_raw: string | null;
  transcript_normalized: string | null;
  detected_smartcode: string | null;
  detected_point_allocation: number | null;
  confidence_score: number | null;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  smartcode_entry_id: string | null;
}

export interface WhatsAppSmartCodeSession {
  id: string;
  user_id: string;
  phone_number: string | null;
  message_text: string | null;
  detected_smartcode: string | null;
  detected_point_allocation: number | null;
  message_type: 'text' | 'image' | 'voice' | 'unknown' | null;
  media_url: string | null;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  smartcode_entry_id: string | null;
}

export interface SmartCodeSecurityValidation {
  id: string;
  smartcode_entry_id: string | null;
  user_id: string;
  validation_type: ValidationType;
  validation_status: 'pending' | 'passed' | 'failed' | 'requires_review';
  validation_score: number;
  validation_details: Record<string, unknown>;
  flags: Array<{ type: string; severity: string; details: string }>;
  requires_manual_override: boolean;
  override_applied: boolean;
  override_reason: string | null;
}

// ============================================================
// POINT CALCULATION FUNCTIONS (LOCKED RULES)
// ============================================================

export function calculatePointsFromPurchase(purchaseAmount: number): number {
  return Math.floor(purchaseAmount / LOCKED_PURCHASE_RATE.amount);
}

export function calculatePointsFromCareClub(contributionAmount: number): number {
  return Math.floor(contributionAmount / LOCKED_CARECLUB_RATE.amount) * LOCKED_CARECLUB_RATE.points;
}

export async function calculatePointsFromPurchaseAsync(purchaseAmount: number): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_smartpoints_from_purchase', {
    purchase_amount: purchaseAmount,
  });
  if (error) throw error;
  return data;
}

export async function calculatePointsFromCareClubAsync(contributionAmount: number): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_smartpoints_from_careclub', {
    contribution_amount: contributionAmount,
  });
  if (error) throw error;
  return data;
}

// ============================================================
// SMARTCODE VALIDATION
// ============================================================

export function validateSmartCodeFormat(smartcode: string): boolean {
  return /^[0-9]{3}$/.test(smartcode);
}

export function normalizeSmartCode(smartcode: string): string {
  const cleaned = smartcode.replace(/\D/g, '').slice(0, 3);
  return cleaned.padStart(3, '0');
}

export async function validateSmartCodeAsync(smartcode: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('validate_smartcode', {
    p_smartcode: smartcode,
  });
  if (error) throw error;
  return data;
}

// ============================================================
// WEEK PERIOD FUNCTIONS
// ============================================================

export function getCurrentWeekPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + start.getDay() + 1) / 7);
  return `${year}-${weekNumber.toString().padStart(2, '0')}`;
}

export async function getCurrentWeekPeriodAsync(): Promise<string> {
  const { data, error } = await supabase.rpc('get_current_week_period');
  if (error) throw error;
  return data;
}

// ============================================================
// SMARTCODE REGISTRATION
// ============================================================

export async function registerSmartCode(
  userId: string,
  smartcode: string,
  points: number,
  method: EntryMethod
): Promise<string> {
  const { data, error } = await supabase.rpc('register_smartcode', {
    p_user_id: userId,
    p_smartcode: smartcode,
    p_points: points,
    p_method: method,
  });
  if (error) throw error;
  return data;
}

export async function registerManualSmartCode(
  userId: string,
  entries: Array<{ smartcode: string; points: number }>
): Promise<SmartCodeMultiEntry> {
  const weekPeriod = getCurrentWeekPeriod();

  const { data, error } = await supabase
    .from('smartcode_multi_entries')
    .insert({
      user_id: userId,
      week_period: weekPeriod,
      smartcodes: entries,
      total_points: entries.reduce((sum, e) => sum + e.points, 0),
      entry_method: ENTRY_METHODS.MANUAL,
    })
    .select()
    .single();

  if (error) throw error;
  return data as SmartCodeMultiEntry;
}

export async function getSmartCodeEntries(userId: string, weekPeriod?: string): Promise<SmartCodeEntry[]> {
  const week = weekPeriod || getCurrentWeekPeriod();

  const { data, error } = await supabase
    .from('smartcode_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('week_period', week)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as SmartCodeEntry[];
}

export async function getSmartCodeEntry(entryId: string): Promise<SmartCodeEntry | null> {
  const { data, error } = await supabase
    .from('smartcode_entries')
    .select('*')
    .eq('id', entryId)
    .maybeSingle();

  if (error) throw error;
  return data as SmartCodeEntry | null;
}

// ============================================================
// REWARD POOL FUNCTIONS
// ============================================================

export function getRewardPoolInfo(poolType: RewardPoolType): { amount: number; position: number; name: string } {
  return LOCKED_REWARDS[poolType];
}

export async function getRewardPools(): Promise<Array<{ pool_type: RewardPoolType; amount: number; name: string }>> {
  const { data, error } = await supabase
    .from('smartcode_reward_pools')
    .select('*')
    .eq('is_active', true)
    .order('position', { ascending: true });

  if (error) throw error;
  return (data || []).map((p: { pool_type: RewardPoolType; reward_amount: number; pool_name: string }) => ({
    pool_type: p.pool_type,
    amount: p.reward_amount,
    name: p.pool_name,
  }));
}

export async function getWeeklyRewardAssignments(weekPeriod: string): Promise<WeeklyRewardAssignment[]> {
  const { data, error } = await supabase
    .from('weekly_reward_assignments')
    .select('*')
    .eq('week_period', weekPeriod)
    .order('position', { ascending: true });

  if (error) throw error;
  return (data || []) as WeeklyRewardAssignment[];
}

// ============================================================
// AI WEEKLY DRAW FUNCTIONS
// ============================================================

export async function getWeeklyDrawSession(weekPeriod: string): Promise<AIWeeklyDrawSession | null> {
  const { data, error } = await supabase
    .from('ai_weekly_draw_sessions')
    .select('*')
    .eq('week_period', weekPeriod)
    .maybeSingle();

  if (error) throw error;
  return data as AIWeeklyDrawSession | null;
}

export async function getAIWeeklyEvaluation(userId: string, weekPeriod: string): Promise<AIWeeklyEvaluation | null> {
  const { data, error } = await supabase
    .from('ai_weekly_evaluations')
    .select('*')
    .eq('user_id', userId)
    .eq('week_period', weekPeriod)
    .maybeSingle();

  if (error) throw error;
  return data as AIWeeklyEvaluation | null;
}

// ============================================================
// OFFLINE OCR FUNCTIONS
// ============================================================

export async function registerOfflineSmartCode(
  userId: string,
  smartcode: string,
  points: number,
  receiptUrl: string,
  metadata: Record<string, unknown> = {}
): Promise<SmartCodeEntry> {
  const weekPeriod = getCurrentWeekPeriod();

  const { data, error } = await supabase
    .from('smartcode_entries')
    .insert({
      user_id: userId,
      week_period: weekPeriod,
      smartcode,
      point_allocation: points,
      entry_method: ENTRY_METHODS.OFFLINE_OCR,
      receipt_url: receiptUrl,
      requires_manual_review: true,
      metadata: { ...metadata, ocr_processed: false },
    })
    .select()
    .single();

  if (error) throw error;
  return data as SmartCodeEntry;
}

// ============================================================
// VOICE SMARTCODE FUNCTIONS (Architecture)
// ============================================================

export async function createVoiceSession(
  userId: string,
  language: VoiceLanguage = 'en',
  audioUrl?: string
): Promise<VoiceSmartCodeSession> {
  const { data, error } = await supabase
    .from('voice_smartcode_sessions')
    .insert({
      user_id: userId,
      language,
      audio_url: audioUrl || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as VoiceSmartCodeSession;
}

export async function updateVoiceSession(
  sessionId: string,
  updates: Partial<VoiceSmartCodeSession>
): Promise<VoiceSmartCodeSession> {
  const { data, error } = await supabase
    .from('voice_smartcode_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data as VoiceSmartCodeSession;
}

export function getVoiceLanguageLabel(lang: VoiceLanguage): string {
  const labels: Record<VoiceLanguage, string> = {
    en: 'English',
    ml: 'Malayalam',
    hi: 'Hindi',
    ar: 'Arabic',
  };
  return labels[lang] || lang;
}

// ============================================================
// WHATSAPP SMARTCODE FUNCTIONS (Architecture)
// ============================================================

export async function createWhatsAppSession(
  userId: string,
  messageText: string,
  phoneNumber?: string
): Promise<WhatsAppSmartCodeSession> {
  const { data, error } = await supabase
    .from('whatsapp_smartcode_sessions')
    .insert({
      user_id: userId,
      message_text: messageText,
      phone_number: phoneNumber || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as WhatsAppSmartCodeSession;
}

export function parseWhatsAppMessage(message: string): { smartcode: string | null; points: number | null } {
  const smartcodeMatch = message.match(/\b(\d{3})\b/);
  const pointsMatch = message.match(/=\s*(\d+)/);

  return {
    smartcode: smartcodeMatch ? smartcodeMatch[1] : null,
    points: pointsMatch ? parseInt(pointsMatch[1], 10) : null,
  };
}

// ============================================================
// SECURITY VALIDATION FUNCTIONS
// ============================================================

export async function getSecurityValidations(entryId: string): Promise<SmartCodeSecurityValidation[]> {
  const { data, error } = await supabase
    .from('smartcode_security_validation')
    .select('*')
    .eq('smartcode_entry_id', entryId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as SmartCodeSecurityValidation[];
}

export async function createSecurityValidation(
  validation: Partial<SmartCodeSecurityValidation>
): Promise<SmartCodeSecurityValidation> {
  const { data, error } = await supabase
    .from('smartcode_security_validation')
    .insert(validation)
    .select()
    .single();

  if (error) throw error;
  return data as SmartCodeSecurityValidation;
}

// ============================================================
// ADMIN APPROVAL FUNCTIONS
// ============================================================

export async function getPendingApprovals(): Promise<Array<{ id: string; week_period: string; user_id: string; pool_type: string; reward_amount: number; priority: string }>> {
  const { data, error } = await supabase
    .from('admin_reward_approval_queue')
    .select('*')
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as Array<{ id: string; week_period: string; user_id: string; pool_type: string; reward_amount: number; priority: string }>;
}

export async function approveReward(
  assignmentId: string,
  adminId: string,
  notes?: string
): Promise<WeeklyRewardAssignment> {
  const { data, error } = await supabase
    .from('weekly_reward_assignments')
    .update({
      admin_approved_at: new Date().toISOString(),
      admin_approved_by: adminId,
      admin_notes: notes,
      reward_status: 'approved',
    })
    .eq('id', assignmentId)
    .select()
    .single();

  if (error) throw error;
  return data as WeeklyRewardAssignment;
}

// ============================================================
// DASHBOARD FUNCTIONS
// ============================================================

export async function getSmartCodeDashboardStats(): Promise<{
  current_week: string;
  total_entries: number;
  total_participants: number;
  total_points: number;
  pending_reviews: number;
  pending_approvals: number;
  prime_pool: number;
  premium_pool: number;
  standard_pool: number;
}> {
  const { data, error } = await supabase.rpc('get_smartcode_dashboard_stats');

  if (error) {
    const weekPeriod = getCurrentWeekPeriod();
    const [
      { count: total_entries },
      { count: pending_reviews },
      { count: pending_approvals },
    ] = await Promise.all([
      supabase.from('smartcode_entries').select('*', { count: 'exact', head: true }).eq('week_period', weekPeriod),
      supabase.from('smartcode_entries').select('*', { count: 'exact', head: true }).eq('requires_manual_review', true).is('review_status', null),
      supabase.from('admin_reward_approval_queue').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    const { data: participants } = await supabase
      .from('smartcode_entries')
      .select('user_id')
      .eq('week_period', weekPeriod);

    const { data: pointsSum } = await supabase
      .from('smartcode_entries')
      .select('point_allocation')
      .eq('week_period', weekPeriod);

    const uniqueParticipants = new Set(participants?.map(p => p.user_id) || []).size;
    const totalPoints = pointsSum?.reduce((sum: number, p: { point_allocation: number }) => sum + p.point_allocation, 0) || 0;

    return {
      current_week: weekPeriod,
      total_entries: total_entries || 0,
      total_participants: uniqueParticipants,
      total_points: totalPoints,
      pending_reviews: pending_reviews || 0,
      pending_approvals: pending_approvals || 0,
      prime_pool: LOCKED_REWARDS.prime.amount,
      premium_pool: LOCKED_REWARDS.premium.amount,
      standard_pool: LOCKED_REWARDS.standard.amount,
    };
  }

  return data;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function getEntryMethodLabel(method: EntryMethod): string {
  const labels: Record<EntryMethod, string> = {
    ai_automatic: 'AI Automatic SmartCode',
    manual: 'Manual Entry',
    offline_ocr: 'Offline OCR',
    voice: 'Voice SmartCode',
    whatsapp: 'WhatsApp SmartCode',
  };
  return labels[method] || method;
}

export function getPoolTypeLabel(pool: RewardPoolType): string {
  const labels: Record<RewardPoolType, string> = {
    prime: 'Prime Reward (₹400)',
    premium: 'Premium Reward (₹200)',
    standard: 'Standard Reward (₹100)',
  };
  return labels[pool] || pool;
}

export function formatSmartCode(code: string): string {
  return code.padStart(3, '0').slice(-3);
}

export function getLockedRulesInfo(): Array<{ rule: string; formula: string; locked: boolean }> {
  return [
    { rule: 'Purchase Points', formula: '₹40 = 1 SmartPoint', locked: true },
    { rule: 'Care Club Points', formula: '₹10 = 5 SmartPoints', locked: true },
    { rule: 'SmartCode Range', formula: '000–999', locked: true },
    { rule: 'Prime Reward', formula: '₹400 (First Prize)', locked: true },
    { rule: 'Premium Reward', formula: '₹200 (Second Prize)', locked: true },
    { rule: 'Standard Reward', formula: '₹100 (Third Prize)', locked: true },
  ];
}
