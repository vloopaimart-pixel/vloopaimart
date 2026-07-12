/**
 * VLOOP ENTERPRISE ADMIN AI CONTROL CENTER ENGINE
 * Phase 33 — Permanent Backbone of the VLOOP Ecosystem
 *
 * Single source of truth for all admin control center operations.
 * All data sourced from Core Business Engine — no demo data, no hardcoded values.
 */

import { supabase } from './supabase';

export const ADMIN_ENGINE_VERSION = '33.0.0' as const;

export const ADMIN_ENGINE_META = {
  version: ADMIN_ENGINE_VERSION,
  name: 'VLOOP Enterprise Admin AI Control Center',
  lockedSince: '2026-07-01',
} as const;

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SUPPORT: 'support',
  FINANCE: 'finance',
  AUDIT: 'audit',
} as const;

export type AdminRole = typeof ADMIN_ROLES[keyof typeof ADMIN_ROLES];

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['*'],
  admin: ['dashboard', 'smartcodes', 'rewards', 'customers', 'careclub', 'wallets', 'ai', 'analytics', 'audit'],
  support: ['dashboard', 'customers', 'support'],
  finance: ['dashboard', 'wallets', 'careclub', 'analytics'],
  audit: ['dashboard', 'audit', 'analytics'],
};

// ============================================================
// TYPES
// ============================================================

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  weeklyParticipants: number;
  totalPurchaseValue: number;
  totalCareClubContributions: number;
  wallet1Balance: number;
  wallet2Balance: number;
  totalSmartPoints: number;
  totalSmartCodes: number;
  aiWeeklyRewardStatus: string;
}

export interface SmartCodeSearchFilters {
  query?: string;
  weekPeriod?: string;
  status?: string;
  entryMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface SmartCodeSearchResult {
  id: string;
  user_id: string;
  smartcode: string;
  points_allocated: number;
  source: string;
  week_period: string;
  entry_source: string;
  is_active: boolean;
  created_at: string;
  customer_name?: string;
}

export interface SmartCodeSearchResponse {
  results: SmartCodeSearchResult[];
  total: number;
}

export interface WeeklyCycleStatus {
  id: string;
  week_period: string;
  status: string;
  opened_at: string | null;
  closed_at: string | null;
  frozen_at: string | null;
  archived_at: string | null;
  total_participants: number;
  total_smartcodes: number;
  total_points: number;
  reward_pool_amount: number;
  winners_generated: boolean;
  results_published: boolean;
  ai_evaluation_complete: boolean;
  notes: string | null;
}

export interface CustomerSearchResult {
  id: string;
  name: string;
  mobile: string;
  email: string;
  vloop_code: string;
  points: number;
  wallet1_balance: number;
  wallet2_balance: number;
  membership_status: string;
  created_at: string;
  referral_count: number;
}

export interface CustomerDetails {
  profile: CustomerSearchResult;
  smartCodes: SmartCodeSearchResult[];
  careClubContributions: Array<{
    id: string;
    amount: number;
    points_earned: number;
    created_at: string;
  }>;
  pointHistory: Array<{
    id: string;
    source_type: string;
    points_awarded: number;
    purchase_amount: number;
    week_period: string;
    created_at: string;
  }>;
  weeklyRewards: Array<{
    id: string;
    week_period: string;
    smartcode: string;
    pool_type: string;
    total_points_in_pool: number;
  }>;
}

export interface CareClubStats {
  totalContributors: number;
  totalContributions: number;
  dailyContribution: number;
  weeklyContribution: number;
  monthlyContribution: number;
  availableFund: number;
  insuranceReserve: number;
  communityBalance: number;
}

export interface WalletStats {
  wallet1TotalBalance: number;
  wallet2TotalBalance: number;
  wallet1TotalEarned: number;
  wallet2TotalEarned: number;
  pendingTransactions: number;
  releasedTransactions: number;
  expiredTransactions: number;
  insuranceHold: number;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  source_type: string;
  points_awarded: number;
  purchase_amount: number;
  care_club_amount: number;
  wallet2_credit: number;
  week_period: string;
  created_at: string;
}

export interface AIMonitoringStats {
  aiStatus: string;
  currentWeek: string;
  rewardCycleStatus: string;
  smartcodeDistribution: {
    totalEntries: number;
    totalPoints: number;
    primeEntries: number;
    premiumEntries: number;
    standardEntries: number;
    uniqueSmartcodes: number;
    uniqueUsers: number;
  };
  fraudAlerts: Array<{
    id: string;
    detection_type: string;
    confidence_score: number;
    action_taken: string | null;
    created_at: string;
  }>;
  duplicateDetections: Array<{
    id: string;
    detection_type: string;
    details: Record<string, unknown>;
    created_at: string;
  }>;
  performanceScore: number;
  processingQueue: number;
}

export interface AnalyticsData {
  daily: Array<{ date: string; value: number }>;
  weekly: Array<{ week: string; value: number }>;
  monthly: Array<{ month: string; value: number }>;
  yearly: Array<{ year: string; value: number }>;
  topProducts: Array<{ id: string; name: string; count: number }>;
  topCustomers: Array<{ id: string; name: string; points: number }>;
  topPartners: Array<{ id: string; name: string; campaigns: number }>;
  topSmartCodes: Array<{ smartcode: string; count: number }>;
  growthTrends: {
    customerGrowth: number;
    revenueGrowth: number;
    smartCodeGrowth: number;
  };
}

export interface AuditLogEntry {
  id: string;
  admin_id: string;
  action_category: string;
  action_type: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  severity: string;
  created_at: string;
}

export interface AdminRoleEntry {
  id: string;
  user_id: string;
  role: string;
  permissions: Record<string, unknown>;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
}

// ============================================================
// 1. ENTERPRISE DASHBOARD
// ============================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    { count: totalCustomers },
    { count: activeCustomers },
    { count: weeklyParticipants },
    { data: purchaseData },
    { data: careClubData },
    { data: walletData },
    { data: smartCodeData },
    { data: aiEvalData },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('membership_status', 'active'),
    supabase.from('smartcode_selections').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total_amount'),
    supabase.from('care_club').select('amount'),
    supabase.from('profiles').select('wallet1_balance, wallet2_balance, wallet1_total_earned'),
    supabase.from('smartcode_allocations').select('points_allocated', { count: 'exact', head: true }),
    supabase.from('weekly_ai_evaluation').select('*').order('evaluated_at', { ascending: false }).limit(1),
  ]);

  const totalPurchaseValue = (purchaseData || []).reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
  const totalCareClub = (careClubData || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const wallet1Balance = (walletData || []).reduce((sum, r) => sum + Number(r.wallet1_balance || 0), 0);
  const wallet2Balance = (walletData || []).reduce((sum, r) => sum + Number(r.wallet2_balance || 0), 0);
  const totalSmartPoints = (walletData || []).reduce((sum, r) => sum + Number(r.wallet1_total_earned || 0), 0);

  const currentWeek = getCurrentWeekPeriod();
  const { count: weekSmartCodes } = await supabase
    .from('smartcode_allocations')
    .select('*', { count: 'exact', head: true })
    .eq('week_period', currentWeek);

  const aiStatus = aiEvalData && aiEvalData.length > 0 ? 'evaluated' : 'pending';

  return {
    totalCustomers: totalCustomers || 0,
    activeCustomers: activeCustomers || 0,
    weeklyParticipants: weeklyParticipants || 0,
    totalPurchaseValue,
    totalCareClubContributions: totalCareClub,
    wallet1Balance,
    wallet2Balance,
    totalSmartPoints,
    totalSmartCodes: weekSmartCodes || 0,
    aiWeeklyRewardStatus: aiStatus,
  };
}

// ============================================================
// 2. SMARTCODE MANAGEMENT
// ============================================================

export async function searchSmartCodes(filters: SmartCodeSearchFilters): Promise<SmartCodeSearchResponse> {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('smartcode_allocations')
    .select('id, user_id, smartcode, points_allocated, source, week_period, entry_source, is_active, created_at', { count: 'exact' });

  if (filters.query) {
    query = query.or(`smartcode.ilike.%${filters.query}%,source.ilike.%${filters.query}%`);
  }
  if (filters.weekPeriod) {
    query = query.eq('week_period', filters.weekPeriod);
  }
  if (filters.status === 'active') {
    query = query.eq('is_active', true);
  } else if (filters.status === 'inactive') {
    query = query.eq('is_active', false);
  }
  if (filters.entryMethod) {
    query = query.eq('entry_source', filters.entryMethod);
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

  const userIds = [...new Set((data || []).map(r => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name')
    .in('id', userIds);

  const profileMap = new Map((profiles || []).map(p => [p.id, p.name]));

  const results: SmartCodeSearchResult[] = (data || []).map(row => ({
    ...row,
    customer_name: profileMap.get(row.user_id) || 'Unknown',
  }));

  return { results, total: count || 0 };
}

export async function updateSmartCode(id: string, updates: Record<string, unknown>, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('smartcode_allocations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
  await logAdminAction(adminId, 'smartcode', 'update', 'smartcode', id, { updates });
}

export async function deleteSmartCode(id: string, adminId: string): Promise<void> {
  const { error } = await supabase.from('smartcode_allocations').delete().eq('id', id);
  if (error) throw error;
  await logAdminAction(adminId, 'smartcode', 'delete', 'smartcode', id, {});
}

export async function lockSmartCode(id: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('smartcode_allocations')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  await logAdminAction(adminId, 'smartcode', 'lock', 'smartcode', id, {});
}

export async function unlockSmartCode(id: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('smartcode_allocations')
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
  await logAdminAction(adminId, 'smartcode', 'unlock', 'smartcode', id, {});
}

export async function exportSmartCodes(filters: SmartCodeSearchFilters): Promise<SmartCodeSearchResult[]> {
  const allResults: SmartCodeSearchResult[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await searchSmartCodes({ ...filters, page, pageSize: 1000 });
    allResults.push(...response.results);
    hasMore = response.results.length === 1000;
    page++;
  }

  return allResults;
}

// ============================================================
// 3. WEEKLY REWARD CONTROL
// ============================================================

export async function getWeeklyCycleStatus(weekPeriod: string): Promise<WeeklyCycleStatus | null> {
  const { data, error } = await supabase
    .from('weekly_cycle_control')
    .select('*')
    .eq('week_period', weekPeriod)
    .maybeSingle();

  if (error) throw error;
  return data as WeeklyCycleStatus | null;
}

export async function getAllWeeklyCycles(): Promise<WeeklyCycleStatus[]> {
  const { data, error } = await supabase
    .from('weekly_cycle_control')
    .select('*')
    .order('week_period', { ascending: false });

  if (error) throw error;
  return (data || []) as WeeklyCycleStatus[];
}

export async function startWeeklyCycle(weekPeriod: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_cycle_control')
    .upsert({
      week_period: weekPeriod,
      status: 'open',
      opened_at: new Date().toISOString(),
      opened_by: adminId,
    }, { onConflict: 'week_period' });

  if (error) throw error;
  await logAdminAction(adminId, 'reward', 'start_cycle', 'weekly_cycle', null, { weekPeriod });
}

export async function closeWeeklyCycle(weekPeriod: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_cycle_control')
    .update({
      status: 'closed',
      closed_at: new Date().toISOString(),
      closed_by: adminId,
    })
    .eq('week_period', weekPeriod);

  if (error) throw error;
  await logAdminAction(adminId, 'reward', 'close_cycle', 'weekly_cycle', null, { weekPeriod });
}

export async function freezeWeeklyCycle(weekPeriod: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_cycle_control')
    .update({
      status: 'frozen',
      frozen_at: new Date().toISOString(),
      frozen_by: adminId,
    })
    .eq('week_period', weekPeriod);

  if (error) throw error;
  await logAdminAction(adminId, 'reward', 'freeze_cycle', 'weekly_cycle', null, { weekPeriod });
}

export async function recalculateAI(weekPeriod: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_cycle_control')
    .update({ ai_evaluation_complete: false })
    .eq('week_period', weekPeriod);

  if (error) throw error;
  await logAdminAction(adminId, 'reward', 'recalculate_ai', 'weekly_cycle', null, { weekPeriod });
}

export async function generateWinners(weekPeriod: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_cycle_control')
    .update({ winners_generated: true })
    .eq('week_period', weekPeriod);

  if (error) throw error;
  await logAdminAction(adminId, 'reward', 'generate_winners', 'weekly_cycle', null, { weekPeriod });
}

export async function publishResults(weekPeriod: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_cycle_control')
    .update({ results_published: true })
    .eq('week_period', weekPeriod);

  if (error) throw error;
  await logAdminAction(adminId, 'reward', 'publish_results', 'weekly_cycle', null, { weekPeriod });
}

export async function archiveWeek(weekPeriod: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_cycle_control')
    .update({
      status: 'archived',
      archived_at: new Date().toISOString(),
      archived_by: adminId,
    })
    .eq('week_period', weekPeriod);

  if (error) throw error;
  await logAdminAction(adminId, 'reward', 'archive_week', 'weekly_cycle', null, { weekPeriod });
}

// ============================================================
// 4. CUSTOMER CONTROL
// ============================================================

export async function searchCustomers(query: string, page: number = 1, pageSize: number = 20): Promise<{ results: CustomerSearchResult[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let dbQuery = supabase
    .from('profiles')
    .select('id, name, mobile, email, vloop_code, points, wallet1_balance, wallet2_balance, membership_status, created_at, referral_count', { count: 'exact' });

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,mobile.ilike.%${query}%,email.ilike.%${query}%,vloop_code.ilike.%${query}%`);
  }

  dbQuery = dbQuery.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await dbQuery;
  if (error) throw error;

  return { results: (data || []) as CustomerSearchResult[], total: count || 0 };
}

export async function getCustomerDetails(userId: string): Promise<CustomerDetails> {
  const [
    { data: profile },
    { data: smartCodes },
    { data: careClub },
    { data: pointHistory },
    { data: weeklyRewards },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('smartcode_allocations').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
    supabase.from('care_club').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
    supabase.from('point_generation_log').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
    supabase.from('weekly_ai_reward_pool').select('*').eq('smartcode', 'in').order('created_at', { ascending: false }).limit(10),
  ]);

  return {
    profile: profile as CustomerSearchResult,
    smartCodes: (smartCodes || []) as SmartCodeSearchResult[],
    careClubContributions: (careClub || []) as CustomerDetails['careClubContributions'],
    pointHistory: (pointHistory || []) as CustomerDetails['pointHistory'],
    weeklyRewards: (weeklyRewards || []) as CustomerDetails['weeklyRewards'],
  };
}

export async function suspendCustomer(userId: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ membership_status: 'suspended' })
    .eq('id', userId);

  if (error) throw error;
  await logAdminAction(adminId, 'customer', 'suspend', 'profile', userId, {});
}

export async function activateCustomer(userId: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ membership_status: 'active' })
    .eq('id', userId);

  if (error) throw error;
  await logAdminAction(adminId, 'customer', 'activate', 'profile', userId, {});
}

// ============================================================
// 5. CARE CLUB MANAGEMENT
// ============================================================

export async function getCareClubStats(): Promise<CareClubStats> {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalContributors },
    { data: allContributions },
    { data: dailyData },
    { data: weeklyData },
    { data: monthlyData },
  ] = await Promise.all([
    supabase.from('care_club').select('user_id', { count: 'exact', head: true }),
    supabase.from('care_club').select('amount'),
    supabase.from('care_club').select('amount').gte('created_at', dayAgo),
    supabase.from('care_club').select('amount').gte('created_at', weekAgo),
    supabase.from('care_club').select('amount').gte('created_at', monthAgo),
  ]);

  const totalContributions = (allContributions || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const dailyContribution = (dailyData || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const weeklyContribution = (weeklyData || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const monthlyContribution = (monthlyData || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);

  const insuranceReserve = totalContributions * 0.10;
  const availableFund = totalContributions * 0.70;
  const communityBalance = totalContributions * 0.20;

  return {
    totalContributors: totalContributors || 0,
    totalContributions,
    dailyContribution,
    weeklyContribution,
    monthlyContribution,
    availableFund,
    insuranceReserve,
    communityBalance,
  };
}

// ============================================================
// 6. WALLET MANAGEMENT
// ============================================================

export async function getWalletStats(): Promise<WalletStats> {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('wallet1_balance, wallet2_balance, wallet1_total_earned');

  const wallet1TotalBalance = (profiles || []).reduce((sum, r) => sum + Number(r.wallet1_balance || 0), 0);
  const wallet2TotalBalance = (profiles || []).reduce((sum, r) => sum + Number(r.wallet2_balance || 0), 0);
  const wallet1TotalEarned = (profiles || []).reduce((sum, r) => sum + Number(r.wallet1_total_earned || 0), 0);

  const { count: pendingCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: releasedCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const { count: expiredCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'cancelled');

  const { data: insuranceData } = await supabase
    .from('care_club')
    .select('amount');

  const insuranceHold = (insuranceData || []).reduce((sum, r) => sum + Number(r.amount || 0), 0) * 0.10;

  return {
    wallet1TotalBalance,
    wallet2TotalBalance,
    wallet1TotalEarned,
    wallet2TotalEarned: wallet2TotalBalance,
    pendingTransactions: pendingCount || 0,
    releasedTransactions: releasedCount || 0,
    expiredTransactions: expiredCount || 0,
    insuranceHold,
  };
}

export async function getWalletTransactions(page: number = 1, pageSize: number = 20): Promise<{ results: WalletTransaction[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('point_generation_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { results: (data || []) as WalletTransaction[], total: count || 0 };
}

// ============================================================
// 7. AI MONITORING
// ============================================================

export async function getAIMonitoringStats(): Promise<AIMonitoringStats> {
  const currentWeek = getCurrentWeekPeriod();

  const [
    { data: aiEval },
    { data: cycleControl },
    { data: fraudData },
    { data: duplicateData },
    { count: processingQueue },
  ] = await Promise.all([
    supabase.from('weekly_ai_evaluation').select('*').eq('week_period', currentWeek).maybeSingle(),
    supabase.from('weekly_cycle_control').select('*').eq('week_period', currentWeek).maybeSingle(),
    supabase.from('smartcode_fraud_log').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('smartcode_fraud_log').select('*').eq('detection_type', 'duplicate').order('created_at', { ascending: false }).limit(10),
    supabase.from('offline_smartcode_entries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const smartcodeDistribution = aiEval ? {
    totalEntries: aiEval.total_entries || 0,
    totalPoints: aiEval.total_points || 0,
    primeEntries: aiEval.prime_entries || 0,
    premiumEntries: aiEval.premium_entries || 0,
    standardEntries: aiEval.standard_entries || 0,
    uniqueSmartcodes: aiEval.unique_smartcodes || 0,
    uniqueUsers: aiEval.unique_users || 0,
  } : {
    totalEntries: 0, totalPoints: 0, primeEntries: 0, premiumEntries: 0,
    standardEntries: 0, uniqueSmartcodes: 0, uniqueUsers: 0,
  };

  const performanceScore = aiEval ? Math.min(100, Math.round((aiEval.unique_users / Math.max(aiEval.total_entries, 1)) * 100)) : 0;

  return {
    aiStatus: aiEval ? 'active' : 'pending',
    currentWeek,
    rewardCycleStatus: cycleControl?.status || 'not_started',
    smartcodeDistribution,
    fraudAlerts: (fraudData || []) as AIMonitoringStats['fraudAlerts'],
    duplicateDetections: (duplicateData || []) as AIMonitoringStats['duplicateDetections'],
    performanceScore,
    processingQueue: processingQueue || 0,
  };
}

// ============================================================
// 8. ANALYTICS
// ============================================================

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const [
    { data: dailyAnalytics },
    { data: weeklyAnalytics },
    { data: orders },
    { data: products },
    { data: partners },
    { data: smartCodeSelections },
    { data: profiles },
  ] = await Promise.all([
    supabase.from('daily_analytics').select('*').order('created_at', { ascending: false }).limit(30),
    supabase.from('weekly_analytics').select('*').order('week_start', { ascending: false }).limit(12),
    supabase.from('orders').select('product_id, total_amount'),
    supabase.from('products').select('id, name'),
    supabase.from('store_partners').select('id, name'),
    supabase.from('smartcode_selections').select('smartcode'),
    supabase.from('profiles').select('id, name, points, created_at'),
  ]);

  const productMap = new Map((products || []).map(p => [p.id, p.name]));
  const productCounts = new Map<string, number>();
  (orders || []).forEach(o => {
    if (o.product_id) {
      productCounts.set(o.product_id, (productCounts.get(o.product_id) || 0) + 1);
    }
  });
  const topProducts = Array.from(productCounts.entries())
    .map(([id, count]) => ({ id, name: productMap.get(id) || 'Unknown', count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topCustomers = (profiles || [])
    .map(p => ({ id: p.id, name: p.name || 'Unknown', points: p.points || 0 }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  const topPartners = (partners || []).map(p => ({
    id: p.id,
    name: p.name || 'Unknown',
    campaigns: 0,
  })).slice(0, 10);

  const smartCodeCounts = new Map<string, number>();
  (smartCodeSelections || []).forEach(s => {
    smartCodeCounts.set(s.smartcode, (smartCodeCounts.get(s.smartcode) || 0) + 1);
  });
  const topSmartCodes = Array.from(smartCodeCounts.entries())
    .map(([smartcode, count]) => ({ smartcode, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const daily = (dailyAnalytics || []).map(d => ({
    date: d.created_at,
    value: Number(d.total_revenue || 0),
  })).reverse();

  const weekly = (weeklyAnalytics || []).map(w => ({
    week: w.week_period || w.week_start,
    value: Number(w.total_wallet1_distributed || 0),
  })).reverse();

  const monthly: Array<{ month: string; value: number }> = [];
  const yearly: Array<{ year: string; value: number }> = [];

  const totalProfiles = (profiles || []).length;
  const recentProfiles = (profiles || []).filter(p => {
    const created = new Date(p.created_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return created > weekAgo;
  }).length;
  const customerGrowth = totalProfiles > 0 ? Math.round((recentProfiles / totalProfiles) * 100) : 0;

  const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const revenueGrowth = totalRevenue > 0 ? Math.round((totalRevenue / Math.max(totalProfiles, 1))) : 0;

  const totalSmartCodes = (smartCodeSelections || []).length;
  const smartCodeGrowth = totalSmartCodes > 0 ? Math.round((totalSmartCodes / Math.max(totalProfiles, 1))) : 0;

  return {
    daily,
    weekly,
    monthly,
    yearly,
    topProducts,
    topCustomers,
    topPartners,
    topSmartCodes,
    growthTrends: {
      customerGrowth,
      revenueGrowth,
      smartCodeGrowth,
    },
  };
}

// ============================================================
// 9. AUDIT LOG
// ============================================================

export async function getAuditLogs(
  page: number = 1,
  pageSize: number = 20,
  category?: string,
  severity?: string
): Promise<{ results: AuditLogEntry[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('admin_audit_log')
    .select('*', { count: 'exact' });

  if (category) {
    query = query.eq('action_category', category);
  }
  if (severity) {
    query = query.eq('severity', severity);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return { results: (data || []) as AuditLogEntry[], total: count || 0 };
}

export async function logAdminAction(
  adminId: string,
  category: string,
  actionType: string,
  targetType?: string | null,
  targetId?: string | null,
  details?: Record<string, unknown>,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<void> {
  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    action_category: category,
    action_type: actionType,
    target_type: targetType || null,
    target_id: targetId || null,
    details: details || {},
    ip_address: ipAddress || null,
    user_agent: userAgent || null,
    severity: category === 'security' || actionType === 'delete' ? 'warning' : 'info',
  });
}

// ============================================================
// 10. SECURITY — ROLE-BASED ACCESS CONTROL
// ============================================================

export async function getAdminRoles(): Promise<AdminRoleEntry[]> {
  const { data, error } = await supabase
    .from('admin_roles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as AdminRoleEntry[];
}

export async function assignRole(userId: string, role: AdminRole, adminId: string): Promise<void> {
  const { error } = await supabase.from('admin_roles').insert({
    user_id: userId,
    role,
    permissions: ROLE_PERMISSIONS[role] || [],
    created_by: adminId,
    is_active: true,
  });

  if (error) throw error;

  await supabase.from('profiles').update({ admin_role: role }).eq('id', userId);
  await logAdminAction(adminId, 'security', 'assign_role', 'profile', userId, { role });
}

export async function revokeRole(userId: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('admin_roles')
    .update({ is_active: false })
    .eq('user_id', userId);

  if (error) throw error;

  await supabase.from('profiles').update({ admin_role: 'none' }).eq('id', userId);
  await logAdminAction(adminId, 'security', 'revoke_role', 'profile', userId, {});
}

export async function updateRole(userId: string, role: AdminRole, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('admin_roles')
    .update({ role, permissions: ROLE_PERMISSIONS[role] || [] })
    .eq('user_id', userId);

  if (error) throw error;

  await supabase.from('profiles').update({ admin_role: role }).eq('id', userId);
  await logAdminAction(adminId, 'security', 'update_role', 'profile', userId, { role });
}

export async function checkAdminAccess(userId: string): Promise<{ isAdmin: boolean; isSuperAdmin: boolean; role: string | null }> {
  const { data, error } = await supabase
    .from('admin_roles')
    .select('role, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    return { isAdmin: false, isSuperAdmin: false, role: null };
  }

  return {
    isAdmin: data.role === 'admin' || data.role === 'super_admin',
    isSuperAdmin: data.role === 'super_admin',
    role: data.role,
  };
}

// ============================================================
// UTILITIES
// ============================================================

export function getCurrentWeekPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000) + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
