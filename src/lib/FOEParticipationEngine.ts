/**
 * VLOOP FUTURE OPPORTUNITY EXCHANGE (FOE) PARTICIPATION ENGINE
 * Phase 47 — SmartPoints-Based Participation Engine
 *
 * VCOS CORE RULES (Permanent):
 * - Purchase: ₹40 = 1 SmartPoint, 2% Cashback (Wallet-1), 30-Day Activation
 * - Care Club: ₹10 Contribution = 5 SmartPoints, 5% Benefit (Wallet-2), 30-Day Activation
 *
 * FOE is NOT a payment system, banking system, investment platform, lottery, or financial return engine.
 * FOE is a SmartPoints-based Participation Engine operating completely inside the VCOS ecosystem.
 */

import { supabase } from './supabase';

export const FOE_ENGINE_VERSION = '47.0.0' as const;

export const FOE_ENGINE_META = {
  version: FOE_ENGINE_VERSION,
  name: 'VLOOP Future Opportunity Exchange Participation Engine',
  lockedSince: '2026-07-03',
} as const;

// ============================================================
// VCOS CORE RULES (Permanent)
// ============================================================

export const VCOS_RULES = {
  PURCHASE: {
    CURRENCY_TO_SP: 40, // ₹40 = 1 SmartPoint
    CASHBACK_PERCENT: 2, // 2% Cashback
    WALLET_TYPE: 1, // Wallet-1
    ACTIVATION_DAYS: 30,
  },
  CARECLUB: {
    CURRENCY_TO_SP: 10, // ₹10 = 5 SmartPoints
    SP_PER_CONTRIBUTION: 5,
    BENEFIT_PERCENT: 5, // 5% Benefit
    WALLET_TYPE: 2, // Wallet-2
    ACTIVATION_DAYS: 30,
  },
} as const;

// ============================================================
// PARTICIPATION UNIT TYPES
// ============================================================

export const UNIT_TYPES = {
  SP_100: 'SP-100',
  SP_250: 'SP-250',
  SP_500: 'SP-500',
  SP_1000: 'SP-1000',
} as const;

export type UnitTypeCode = typeof UNIT_TYPES[keyof typeof UNIT_TYPES];

export const UNIT_TIERS = {
  STANDARD: 'standard',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;

export type UnitTier = typeof UNIT_TIERS[keyof typeof UNIT_TIERS];

export const UNIT_VALUES: Record<UnitTypeCode, number> = {
  'SP-100': 100,
  'SP-250': 250,
  'SP-500': 500,
  'SP-1000': 1000,
};

export const DEFAULT_UNITS = [
  { code: 'SP-1000', smartpoints: 1000, tier: 'platinum' as UnitTier },
  { code: 'SP-500', smartpoints: 500, tier: 'gold' as UnitTier },
  { code: 'SP-250', smartpoints: 250, tier: 'silver' as UnitTier },
  { code: 'SP-100', smartpoints: 100, tier: 'standard' as UnitTier },
];

// ============================================================
// UNIT STATUS
// ============================================================

export const UNIT_STATUS = {
  PENDING: 'pending',
  ALLOCATED: 'allocated',
  LOCKED: 'locked',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

export type UnitStatus = typeof UNIT_STATUS[keyof typeof UNIT_STATUS];

// ============================================================
// TRANSACTION TYPES
// ============================================================

export const TRANSACTION_TYPES = {
  EARN_PURCHASE: 'earn_purchase',
  EARN_CARECLUB: 'earn_careclub',
  ALLOCATE: 'allocate',
  LOCK: 'lock',
  UNLOCK: 'unlock',
  COMPLETE: 'complete',
  EXPIRE: 'expire',
  ADJUSTMENT: 'adjustment',
  REFUND: 'refund',
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

// ============================================================
// WALLETS
// ============================================================

export const WALLET_TYPES = {
  WALLET_1: 1, // Purchase - 2% Cashback
  WALLET_2: 2, // Care Club - 5% Benefit
} as const;

// ============================================================
// INTERFACES
// ============================================================

export interface FOESmartPointsConfig {
  id: string;
  source_type: 'purchase' | 'careclub';
  points_per_unit: number;
  cashback_percent: number;
  benefit_percent: number;
  activation_days: number;
  description: string;
}

export interface FOEUnitType {
  id: string;
  unit_code: UnitTypeCode;
  smartpoints_required: number;
  tier: UnitTier;
  display_name: string;
  description: string;
}

export interface FOEUserSmartPoints {
  id: string;
  user_id: string;
  total_purchase_sp: number;
  total_careclub_sp: number;
  total_earned_sp: number;
  total_allocated_sp: number;
  total_locked_sp: number;
  available_sp: number;
  pending_activation_sp: number;
}

export interface FOEWallet {
  id: string;
  user_id: string;
  wallet_balance: number;
  allocated_balance: number;
  locked_balance: number;
  completed_units: number;
  pending_units: number;
  total_participation_value: number;
}

export interface FOEWalletTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  transaction_type: TransactionType;
  amount: number;
  previous_balance: number | null;
  new_balance: number | null;
  source_reference: string | null;
  description: string | null;
  created_at: string;
}

export interface FOEEarningsLog {
  id: string;
  user_id: string;
  source_type: 'purchase' | 'careclub';
  source_amount: number;
  smartpoints_earned: number;
  wallet_type: number;
  activation_date: string;
  is_activated: boolean;
  status: 'pending' | 'activated' | 'used' | 'expired';
}

export interface FOEParticipationUnit {
  id: string;
  unit_id: string;
  unit_code: UnitTypeCode;
  user_id: string;
  project_id: string | null;
  smartpoints_value: number;
  status: UnitStatus;
  qr_code: string | null;
  ai_verification_status: 'pending' | 'verified' | 'flagged';
  ai_verification_score: number;
  allocated_at: string | null;
  locked_at: string | null;
  created_at: string;
}

export interface FOEUnitAuditEntry {
  id: string;
  unit_id: string;
  user_id: string;
  action: string;
  previous_status: string | null;
  new_status: string | null;
  actor_type: 'system' | 'ai' | 'admin' | 'user';
  details: Record<string, unknown>;
  created_at: string;
}

export interface FOEProjectParticipation {
  id: string;
  project_id: string;
  user_id: string;
  total_units: number;
  total_smartpoints: number;
  status: 'active' | 'completed' | 'withdrawn';
}

export interface FOEProjectProgress {
  id: string;
  project_id: string;
  total_target_units: number;
  total_units_generated: number;
  total_units_remaining: number;
  total_participants: number;
  total_smartpoints_allocated: number;
  progress_percent: number;
  transparency_score: number;
}

export interface FOECustomerDashboard {
  available_sp: number;
  allocated_sp: number;
  locked_sp: number;
  purchase_sp: number;
  careclub_sp: number;
  total_earned: number;
  wallet_balance: number;
  total_units: number;
  active_units: number;
  completed_units: number;
  pending_units: number;
  projects_count: number;
}

export interface UnitConversion {
  unit_code: UnitTypeCode;
  smartpoints: number;
  quantity: number;
}

export interface EligibilityResult {
  eligible: boolean;
  factors: Record<string, unknown>;
  reasons: Array<{ code: string; message: string }>;
}

// ============================================================
// SMARTPOINTS FUNCTIONS
// ============================================================

export async function getUserSmartPoints(userId: string): Promise<FOEUserSmartPoints | null> {
  const { data, error } = await supabase
    .from('foe_user_smartpoints')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as FOEUserSmartPoints | null;
}

export async function getOrCreateUserSmartPoints(userId: string): Promise<string> {
  const { data, error } = await supabase.rpc('foe_get_or_create_user_sp', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}

export async function getSmartPointsConfig(): Promise<FOESmartPointsConfig[]> {
  const { data, error } = await supabase
    .from('foe_smartpoints_config')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as FOESmartPointsConfig[];
}

export function calculateSmartPointsFromPurchase(purchaseAmount: number): number {
  return Math.floor(purchaseAmount / VCOS_RULES.PURCHASE.CURRENCY_TO_SP);
}

export function calculateSmartPointsFromContribution(contributionAmount: number): number {
  return Math.floor(contributionAmount / VCOS_RULES.CARECLUB.CURRENCY_TO_SP) * VCOS_RULES.CARECLUB.SP_PER_CONTRIBUTION;
}

// ============================================================
// WALLET FUNCTIONS
// ============================================================

export async function getWallet(userId: string): Promise<FOEWallet | null> {
  const { data, error } = await supabase
    .from('foe_wallets')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as FOEWallet | null;
}

export async function getOrCreateWallet(userId: string): Promise<string> {
  const { data, error } = await supabase.rpc('foe_get_or_create_wallet', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}

export async function getWalletTransactions(
  userId: string,
  limit: number = 50
): Promise<FOEWalletTransaction[]> {
  const { data, error } = await supabase
    .from('foe_wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as FOEWalletTransaction[];
}

// ============================================================
// UNIT CONVERSION FUNCTIONS
// ============================================================

export async function convertSmartPointsToUnits(
  smartpoints: number,
  conversionType: 'optimal' | 'greedy' = 'optimal'
): Promise<UnitConversion[]> {
  const { data, error } = await supabase.rpc('foe_convert_smartpoints_to_units', {
    p_smartpoints: smartpoints,
    p_conversion_type: conversionType,
  });

  if (error) throw error;
  return (data || []) as UnitConversion[];
}

export function convertSmartPointsLocally(smartpoints: number): UnitConversion[] {
  let remaining = smartpoints;
  const result: UnitConversion[] = [];

  for (const unit of DEFAULT_UNITS) {
    if (remaining >= unit.smartpoints) {
      const quantity = Math.floor(remaining / unit.smartpoints);
      result.push({
        unit_code: unit.code as UnitTypeCode,
        smartpoints: unit.smartpoints,
        quantity,
      });
      remaining -= quantity * unit.smartpoints;
    }
  }

  return result;
}

// ============================================================
// UNIT GENERATION FUNCTIONS
// ============================================================

export async function getUnitTypes(): Promise<FOEUnitType[]> {
  const { data, error } = await supabase
    .from('foe_unit_types')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: true });

  if (error) throw error;
  return (data || []) as FOEUnitType[];
}

export async function getUserUnits(
  userId: string,
  status?: UnitStatus
): Promise<FOEParticipationUnit[]> {
  let query = supabase
    .from('foe_participation_units')
    .select('*')
    .eq('user_id', userId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as FOEParticipationUnit[];
}

export async function generateUnitId(): Promise<string> {
  const { data, error } = await supabase.rpc('generate_unit_id');
  if (error) throw error;
  return data;
}

export async function generateQRForUnit(unitId: string): Promise<string> {
  const { data, error } = await supabase.rpc('foe_generate_unit_qr', {
    p_unit_id: unitId,
  });

  if (error) throw error;
  return data;
}

// ============================================================
// ELIGIBILITY FUNCTIONS
// ============================================================

export async function validateEligibility(
  userId: string,
  smartpoints: number,
  projectId?: string
): Promise<EligibilityResult> {
  const { data, error } = await supabase.rpc('foe_validate_eligibility', {
    p_user_id: userId,
    p_smartpoints: smartpoints,
    p_project_id: projectId || null,
  });

  if (error) throw error;
  return data as EligibilityResult;
}

export async function checkProjectEligibility(
  userId: string,
  projectId: string
): Promise<boolean> {
  const result = await validateEligibility(userId, 0, projectId);
  return result.eligible;
}

// ============================================================
// PROJECT PARTICIPATION FUNCTIONS
// ============================================================

export async function getProjectProgress(projectId: string): Promise<FOEProjectProgress | null> {
  const { data, error } = await supabase
    .from('foe_project_progress')
    .select('*')
    .eq('project_id', projectId)
    .maybeSingle();

  if (error) throw error;
  return data as FOEProjectProgress | null;
}

export async function getTransparencyStats(projectId: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('foe_get_project_transparency', {
    p_project_id: projectId,
  });

  if (error) throw error;
  return data;
}

export async function getUserProjectParticipations(userId: string): Promise<FOEProjectParticipation[]> {
  const { data, error } = await supabase
    .from('foe_project_participation')
    .select('*, project:future_projects_catalog(*)')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []) as FOEProjectParticipation[];
}

// ============================================================
// AUDIT TRAIL FUNCTIONS
// ============================================================

export async function getUnitAuditTrail(unitId: string): Promise<FOEUnitAuditEntry[]> {
  const { data, error } = await supabase
    .from('foe_unit_audit_trail')
    .select('*')
    .eq('unit_id', unitId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as FOEUnitAuditEntry[];
}

export async function logUnitAudit(
  unitId: string,
  userId: string,
  action: string,
  previousStatus: string | null,
  newStatus: string | null,
  actorType: 'system' | 'ai' | 'admin' | 'user' = 'system',
  details: Record<string, unknown> = {}
): Promise<void> {
  const { error } = await supabase.rpc('foe_log_unit_audit', {
    p_unit_id: unitId,
    p_user_id: userId,
    p_action: action,
    p_prev_status: previousStatus,
    p_new_status: newStatus,
    p_actor_type: actorType,
    p_details: details,
  });

  if (error) throw error;
}

// ============================================================
// CUSTOMER DASHBOARD FUNCTIONS
// ============================================================

export async function getCustomerDashboard(userId: string): Promise<FOECustomerDashboard> {
  const { data, error } = await supabase.rpc('foe_get_customer_dashboard', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data as FOECustomerDashboard;
}

// ============================================================
// FRAUD DETECTION FUNCTIONS
// ============================================================

export async function checkDuplicateAllocation(
  userId: string,
  projectId: string,
  smartpoints: number
): Promise<boolean> {
  // Check if user already has units allocated to the same project with same SP value
  const { data, error } = await supabase
    .from('foe_participation_units')
    .select('id')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .eq('smartpoints_value', smartpoints)
    .eq('status', UNIT_STATUS.ALLOCATED);

  if (error) throw error;
  return (data?.length || 0) > 0;
}

export async function velocityCheck(userId: string, threshold: number = 10): Promise<boolean> {
  // Check how many units generated in last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from('foe_participation_units')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneHourAgo);

  if (error) throw error;
  return (count || 0) >= threshold;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getStatusLabel(status: UnitStatus): string {
  const labels: Record<UnitStatus, string> = {
    pending: 'Pending',
    allocated: 'Allocated',
    locked: 'Locked',
    active: 'Active',
    completed: 'Completed',
    expired: 'Expired',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
}

export function getTierLabel(tier: UnitTier): string {
  const labels: Record<UnitTier, string> = {
    standard: 'Standard',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
  };
  return labels[tier] || tier;
}

export function getTierColor(tier: UnitTier): string {
  const colors: Record<UnitTier, string> = {
    standard: 'from-slate-500 to-slate-700',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-amber-500 to-amber-700',
    platinum: 'from-cyan-400 to-cyan-600',
  };
  return colors[tier] || 'from-gray-500 to-gray-700';
}

export function formatSmartpoints(value: number): string {
  return value.toLocaleString() + ' SP';
}

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}
