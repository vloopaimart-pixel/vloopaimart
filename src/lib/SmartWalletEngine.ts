/**
 * VLOOP Smart Wallet Engine
 * Phase 9 — Professional Wallet Dashboard with Trust Score Integration
 */

import { supabase } from './supabase';

export const SMART_WALLET_VERSION = '9.0.0' as const;

// ============================================================
// TYPES
// ============================================================

export interface WalletBalance {
  wallet_1_available: number;
  wallet_2_locked: number;
  smartpoints_balance: number;
  trust_score: number;
  trust_level: string;
}

export interface SmartPointsAnalytics {
  total_balance: number;
  lifetime_earned: number;
  this_month_earned: number;
  estimated_future_rewards: number;
  pending_rewards: number;
  expiring_soon: number;
  redemption_eligible: number;
}

export interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  category_icon: string;
  amount: number;
  smartpoints: number;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  type: 'credit' | 'debit';
  wallet_type: 'wallet_1' | 'wallet_2' | 'smartpoints';
  balance_after: number;
  reference_id: string | null;
}

export interface TrustScoreBreakdown {
  overall_score: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  factors: {
    account_age: number;
    transaction_history: number;
    verification_status: number;
    community_contribution: number;
    consistency_score: number;
  };
  trend: 'up' | 'down' | 'stable';
  trend_value: number;
}

export interface WalletSummaryStats {
  total_transactions: number;
  this_month_transactions: number;
  total_smartpoints_earned: number;
  total_smartpoints_redeemed: number;
  average_monthly_earnings: number;
  next_reward_date: string | null;
}

export const TRANSACTION_CATEGORIES = {
  marketplace_purchase: { label: 'Marketplace Purchase', icon: 'ShoppingBag', color: 'blue' },
  essential_service: { label: 'Essential Service', icon: 'Zap', color: 'amber' },
  smartcode_reward: { label: 'SmartCode Reward', icon: 'QrCode', color: 'violet' },
  quiz_completion: { label: 'Quiz Completion', icon: 'Award', color: 'emerald' },
  care_club: { label: 'Care Club', icon: 'Heart', color: 'rose' },
  referral_bonus: { label: 'Referral Bonus', icon: 'Users', color: 'indigo' },
  daily_login: { label: 'Daily Login', icon: 'Calendar', color: 'orange' },
  learning_reward: { label: 'Learning Reward', icon: 'BookOpen', color: 'cyan' },
  redemption: { label: 'Redemption', icon: 'Gift', color: 'pink' },
  transfer: { label: 'Transfer', icon: 'ArrowRightLeft', color: 'slate' },
} as const;

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function getWalletBalance(userId: string): Promise<WalletBalance | null> {
  const { data, error } = await supabase.rpc('get_user_wallet_balance', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data as WalletBalance | null;
}

export async function getSmartPointsAnalytics(userId: string): Promise<SmartPointsAnalytics | null> {
  const { data, error } = await supabase.rpc('get_smartpoints_analytics', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data as SmartPointsAnalytics | null;
}

export async function getWalletTransactions(
  userId: string,
  options?: {
    limit?: number;
    wallet_type?: 'wallet_1' | 'wallet_2' | 'smartpoints';
    category?: string;
  }
): Promise<WalletTransaction[]> {
  let query = supabase
    .from('wallet_transactions_view')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as WalletTransaction[];
}

export async function getTrustScoreBreakdown(userId: string): Promise<TrustScoreBreakdown | null> {
  const { data, error } = await supabase.rpc('get_trust_score_breakdown', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data as TrustScoreBreakdown | null;
}

export async function getWalletSummaryStats(userId: string): Promise<WalletSummaryStats | null> {
  const { data, error } = await supabase.rpc('get_wallet_summary_stats', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data as WalletSummaryStats | null;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSmartPoints(points: number): string {
  if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
  if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
  return `${points}`;
}

export function getTrustLevelColor(level: string): string {
  const colors: Record<string, string> = {
    Diamond: 'from-cyan-400 to-blue-500',
    Platinum: 'from-slate-300 to-slate-500',
    Gold: 'from-amber-400 to-amber-600',
    Silver: 'from-gray-300 to-gray-500',
    Bronze: 'from-amber-600 to-amber-800',
  };
  return colors[level] || 'from-amber-600 to-amber-800';
}

export function getTrustLevelTextColor(level: string): string {
  const colors: Record<string, string> = {
    Diamond: 'text-cyan-600',
    Platinum: 'text-slate-600',
    Gold: 'text-amber-600',
    Silver: 'text-gray-500',
    Bronze: 'text-amber-700',
  };
  return colors[level] || 'text-amber-700';
}

export function getTransactionCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    violet: 'bg-violet-100 text-violet-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    rose: 'bg-rose-100 text-rose-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    orange: 'bg-orange-100 text-orange-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    pink: 'bg-pink-100 text-pink-600',
    slate: 'bg-slate-100 text-slate-600',
  };
  const cat = TRANSACTION_CATEGORIES[category as keyof typeof TRANSACTION_CATEGORIES];
  return colors[cat?.color || 'slate'];
}

export function getTransactionStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    processing: 'bg-blue-100 text-blue-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getSmartPointsProgress(earned: number, target: number): number {
  return Math.min(100, Math.round((earned / target) * 100));
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockWalletBalance(): WalletBalance {
  return {
    wallet_1_available: 15850,
    wallet_2_locked: 45000,
    smartpoints_balance: 3245,
    trust_score: 782,
    trust_level: 'Gold',
  };
}

export function getMockSmartPointsAnalytics(): SmartPointsAnalytics {
  return {
    total_balance: 3245,
    lifetime_earned: 12580,
    this_month_earned: 485,
    estimated_future_rewards: 850,
    pending_rewards: 125,
    expiring_soon: 0,
    redemption_eligible: 2500,
  };
}

export function getMockTrustScoreBreakdown(): TrustScoreBreakdown {
  return {
    overall_score: 782,
    level: 'Gold',
    factors: {
      account_age: 85,
      transaction_history: 78,
      verification_status: 100,
      community_contribution: 65,
      consistency_score: 72,
    },
    trend: 'up',
    trend_value: 12,
  };
}

export function getMockWalletTransactions(): WalletTransaction[] {
  return [
    {
      id: 'tx001',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      description: 'Electricity Bill Payment',
      category: 'essential_service',
      category_icon: 'Zap',
      amount: 1250,
      smartpoints: 15,
      status: 'completed',
      type: 'credit',
      wallet_type: 'smartpoints',
      balance_after: 3245,
      reference_id: 'ES-20240115001',
    },
    {
      id: 'tx002',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      description: 'Quiz Challenge Completed',
      category: 'quiz_completion',
      category_icon: 'Award',
      amount: 0,
      smartpoints: 50,
      status: 'completed',
      type: 'credit',
      wallet_type: 'smartpoints',
      balance_after: 3230,
      reference_id: 'QZ-20240115042',
    },
    {
      id: 'tx003',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      description: 'Marketplace Purchase',
      category: 'marketplace_purchase',
      category_icon: 'ShoppingBag',
      amount: 2499,
      smartpoints: 25,
      status: 'completed',
      type: 'credit',
      wallet_type: 'smartpoints',
      balance_after: 3180,
      reference_id: 'ORD-20240114567',
    },
    {
      id: 'tx004',
      date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      description: 'Care Club Contribution',
      category: 'care_club',
      category_icon: 'Heart',
      amount: 500,
      smartpoints: 25,
      status: 'completed',
      type: 'credit',
      wallet_type: 'smartpoints',
      balance_after: 3155,
      reference_id: 'CC-202401301',
    },
    {
      id: 'tx005',
      date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      description: 'SmartCode Scanned',
      category: 'smartcode_reward',
      category_icon: 'QrCode',
      amount: 0,
      smartpoints: 100,
      status: 'completed',
      type: 'credit',
      wallet_type: 'smartpoints',
      balance_after: 3130,
      reference_id: 'SC-20240112345',
    },
    {
      id: 'tx006',
      date: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
      description: 'Daily Login Bonus',
      category: 'daily_login',
      category_icon: 'Calendar',
      amount: 0,
      smartpoints: 5,
      status: 'completed',
      type: 'credit',
      wallet_type: 'smartpoints',
      balance_after: 3030,
      reference_id: null,
    },
    {
      id: 'tx007',
      date: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
      description: 'Referral Bonus - Friend Signup',
      category: 'referral_bonus',
      category_icon: 'Users',
      amount: 0,
      smartpoints: 200,
      status: 'completed',
      type: 'credit',
      wallet_type: 'smartpoints',
      balance_after: 3025,
      reference_id: 'REF-202401089',
    },
    {
      id: 'tx008',
      date: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
      description: 'Benefit Redemption - Gift Card',
      category: 'redemption',
      category_icon: 'Gift',
      amount: 0,
      smartpoints: -250,
      status: 'completed',
      type: 'debit',
      wallet_type: 'smartpoints',
      balance_after: 2825,
      reference_id: 'RDM-202401012',
    },
    {
      id: 'tx009',
      date: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(),
      description: 'Learning Module Completed',
      category: 'learning_reward',
      category_icon: 'BookOpen',
      amount: 0,
      smartpoints: 75,
      status: 'completed',
      type: 'credit',
      wallet_type: 'smartpoints',
      balance_after: 3075,
      reference_id: 'LRN-20240089',
    },
    {
      id: 'tx010',
      date: new Date(Date.now() - 192 * 60 * 60 * 1000).toISOString(),
      description: 'Mobile Recharge',
      category: 'essential_service',
      category_icon: 'Zap',
      amount: 299,
      smartpoints: 3,
      status: 'completed',
      type: 'credit',
      wallet_type: 'smartpoints',
      balance_after: 3000,
      reference_id: 'ES-20240102001',
    },
  ];
}

export function getMockWalletSummaryStats(): WalletSummaryStats {
  return {
    total_transactions: 156,
    this_month_transactions: 24,
    total_smartpoints_earned: 12580,
    total_smartpoints_redeemed: 2100,
    average_monthly_earnings: 420,
    next_reward_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
