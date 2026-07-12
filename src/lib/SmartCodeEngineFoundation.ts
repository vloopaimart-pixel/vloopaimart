/**
 * VLOOP SmartCode Engine Foundation
 * Phase 12 — Professional SmartCode Module
 */

import { supabase } from './supabase';

export const SMARTCODE_ENGINE_VERSION = '12.0.0' as const;

// ============================================================
// TYPES
// ============================================================

export interface SmartCodeStats {
  total_submitted: number;
  verified_codes: number;
  pending_verification: number;
  invalid_codes: number;
  expired_codes: number;
  duplicate_codes: number;
  weekly_eligible_entries: number;
  total_points_earned: number;
  today_submissions: number;
  monthly_submissions: number;
}

export interface SmartCodeEntry {
  id: string;
  code: string;
  user_id: string;
  merchant_id: string;
  merchant_name: string;
  merchant_logo: string | null;
  category: string;
  product_name: string | null;
  submitted_at: string;
  verified_at: string | null;
  status: 'verified' | 'pending' | 'invalid' | 'duplicate' | 'expired';
  reward_points: number;
  bonus_points: number;
  trust_score_impact: number;
  verification_notes: string | null;
  expires_at: string | null;
}

export interface SmartCodeVerificationResult {
  success: boolean;
  status: 'verified' | 'pending' | 'invalid' | 'duplicate' | 'expired';
  code: string;
  merchant_name: string | null;
  product_name: string | null;
  reward_points: number;
  bonus_points: number;
  trust_score_impact: number;
  message: string;
  details: string | null;
}

export interface WeeklyChallenge {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  time_remaining: string;
  eligible_entries: number;
  max_entries_per_user: number;
  reward_pool: number;
  bonus_multiplier: number;
  sponsor_name: string;
  sponsor_logo: string | null;
  status: 'active' | 'upcoming' | 'completed';
  leaderboard: ChallengeLeaderboardEntry[];
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  avatar_url: string | null;
  entries_count: number;
  total_points: number;
  is_current_user: boolean;
}

export interface SmartCodeRewardPreview {
  expected_smartpoints: number;
  bonus_eligibility: boolean;
  bonus_percentage: number;
  trust_score_impact: number;
  current_trust_score: number;
  new_trust_score: number;
  reward_tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  streak_multiplier: number;
  referral_bonus: number;
}

export interface SmartCodeNotification {
  id: string;
  type: 'submission_success' | 'verification_complete' | 'reward_credited' | 'challenge_update' | 'warning' | 'error';
  title: string;
  message: string;
  code: string | null;
  points: number | null;
  created_at: string;
  read: boolean;
}

export interface SmartCodeCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  points_multiplier: number;
  merchant_count: number;
}

export const VERIFICATION_STATUS_COLORS: Record<string, string> = {
  verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  invalid: 'bg-red-100 text-red-700 border-red-200',
  duplicate: 'bg-orange-100 text-orange-700 border-orange-200',
  expired: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const VERIFICATION_STATUS_ICONS: Record<string, string> = {
  verified: 'CheckCircle',
  pending: 'Clock',
  invalid: 'XCircle',
  duplicate: 'Copy',
  expired: 'Calendar',
};

export const SMARTCODE_CATEGORIES: SmartCodeCategory[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: 'Zap', color: 'from-amber-500 to-orange-500', points_multiplier: 1.0, merchant_count: 156 },
  { id: '2', name: 'Fashion', slug: 'fashion', icon: 'Shirt', color: 'from-pink-500 to-rose-500', points_multiplier: 1.2, merchant_count: 234 },
  { id: '3', name: 'Grocery', slug: 'grocery', icon: 'ShoppingCart', color: 'from-emerald-500 to-teal-500', points_multiplier: 0.8, merchant_count: 89 },
  { id: '4', name: 'Home & Living', slug: 'home-living', icon: 'Home', color: 'from-blue-500 to-indigo-500', points_multiplier: 1.1, merchant_count: 167 },
  { id: '5', name: 'Health & Wellness', slug: 'health-wellness', icon: 'Heart', color: 'from-red-500 to-pink-500', points_multiplier: 1.3, merchant_count: 78 },
  { id: '6', name: 'Beauty', slug: 'beauty', icon: 'Sparkles', color: 'from-violet-500 to-purple-500', points_multiplier: 1.4, merchant_count: 145 },
];

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function getSmartCodeStats(userId: string): Promise<SmartCodeStats | null> {
  const { data, error } = await supabase.rpc('get_smartcode_stats', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data as SmartCodeStats | null;
}

export async function getSmartCodeHistory(userId: string, limit?: number): Promise<SmartCodeEntry[]> {
  let query = supabase
    .from('smartcode_entries')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as SmartCodeEntry[];
}

export async function submitSmartCode(userId: string, code: string): Promise<SmartCodeVerificationResult> {
  const { data, error } = await supabase.rpc('submit_smartcode', {
    p_user_id: userId,
    p_code: code,
  });
  if (error) throw error;
  return data as SmartCodeVerificationResult;
}

export async function getActiveChallenge(): Promise<WeeklyChallenge | null> {
  const { data, error } = await supabase.rpc('get_active_smartcode_challenge');
  if (error) throw error;
  return data as WeeklyChallenge | null;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function formatPoints(points: number): string {
  if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
  if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
  return `${points}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTimeRemaining(endDateStr: string): string {
  const end = new Date(endDateStr);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

export function getStatusColor(status: string): string {
  return VERIFICATION_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockSmartCodeStats(): SmartCodeStats {
  return {
    total_submitted: 1245,
    verified_codes: 1089,
    pending_verification: 45,
    invalid_codes: 67,
    expired_codes: 23,
    duplicate_codes: 21,
    weekly_eligible_entries: 89,
    total_points_earned: 24580,
    today_submissions: 12,
    monthly_submissions: 156,
  };
}

export function getMockSmartCodeHistory(): SmartCodeEntry[] {
  return [
    { id: 'sc1', code: 'VLP-2024-ABC123XYZ', user_id: 'u1', merchant_id: 'm1', merchant_name: 'TechStore India', merchant_logo: null, category: 'Electronics', product_name: 'Wireless Earbuds', submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), verified_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), status: 'verified', reward_points: 100, bonus_points: 10, trust_score_impact: 2, verification_notes: null, expires_at: null },
    { id: 'sc2', code: 'VLP-2024-DEF456QRS', user_id: 'u1', merchant_id: 'm2', merchant_name: 'Fashion Bazaar', merchant_logo: null, category: 'Fashion', product_name: 'Designer Kurti', submitted_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), verified_at: null, status: 'pending', reward_points: 0, bonus_points: 0, trust_score_impact: 0, verification_notes: null, expires_at: null },
    { id: 'sc3', code: 'VLP-2024-GHI789TUV', user_id: 'u1', merchant_id: 'm3', merchant_name: 'Home Decor Hub', merchant_logo: null, category: 'Home & Living', product_name: 'Wooden Chair', submitted_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), verified_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), status: 'verified', reward_points: 75, bonus_points: 15, trust_score_impact: 3, verification_notes: 'Premium product bonus applied', expires_at: null },
    { id: 'sc4', code: 'VLP-2024-JKL012WXY', user_id: 'u1', merchant_id: 'm1', merchant_name: 'TechStore India', merchant_logo: null, category: 'Electronics', product_name: null, submitted_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), verified_at: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(), status: 'invalid', reward_points: 0, bonus_points: 0, trust_score_impact: -1, verification_notes: 'Code format invalid', expires_at: null },
    { id: 'sc5', code: 'VLP-2024-MNO345PQR', user_id: 'u1', merchant_id: 'm4', merchant_name: 'Organic Foods', merchant_logo: null, category: 'Grocery', product_name: 'Organic Honey', submitted_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), verified_at: new Date(Date.now() - 71 * 60 * 60 * 1000).toISOString(), status: 'verified', reward_points: 50, bonus_points: 5, trust_score_impact: 1, verification_notes: null, expires_at: null },
    { id: 'sc6', code: 'VLP-2024-STU678VWX', user_id: 'u1', merchant_id: 'm1', merchant_name: 'TechStore India', merchant_logo: null, category: 'Electronics', product_name: 'Smart Watch', submitted_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), verified_at: new Date(Date.now() - 95 * 60 * 60 * 1000).toISOString(), status: 'duplicate', reward_points: 0, bonus_points: 0, trust_score_impact: 0, verification_notes: 'Code already submitted on 2024-01-01', expires_at: null },
    { id: 'sc7', code: 'VLP-2024-YZA901BCD', user_id: 'u1', merchant_id: 'm5', merchant_name: 'Health Plus', merchant_logo: null, category: 'Health & Wellness', product_name: 'Vitamin Supplements', submitted_at: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(), verified_at: new Date(Date.now() - 119 * 60 * 60 * 1000).toISOString(), status: 'expired', reward_points: 0, bonus_points: 0, trust_score_impact: 0, verification_notes: 'Code expired on 2023-12-31', expires_at: '2023-12-31T23:59:59Z' },
  ];
}

export function getMockWeeklyChallenge(): WeeklyChallenge {
  return {
    id: 'challenge-1',
    name: 'Scan & Win Weekly Challenge',
    description: 'Submit SmartCodes from participating merchants to win bonus rewards and climb the leaderboard!',
    start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    time_remaining: getTimeRemaining(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()),
    eligible_entries: 1234,
    max_entries_per_user: 50,
    reward_pool: 50000,
    bonus_multiplier: 2.5,
    sponsor_name: 'TechStore India',
    sponsor_logo: null,
    status: 'active',
    leaderboard: [
      { rank: 1, user_id: 'u2', user_name: 'Priya P.', avatar_url: null, entries_count: 45, total_points: 4500, is_current_user: false },
      { rank: 2, user_id: 'u3', user_name: 'Amit K.', avatar_url: null, entries_count: 42, total_points: 4200, is_current_user: false },
      { rank: 3, user_id: 'u1', user_name: 'You', avatar_url: null, entries_count: 38, total_points: 3800, is_current_user: true },
      { rank: 4, user_id: 'u4', user_name: 'Sneha R.', avatar_url: null, entries_count: 35, total_points: 3500, is_current_user: false },
      { rank: 5, user_id: 'u5', user_name: 'Vikram S.', avatar_url: null, entries_count: 32, total_points: 3200, is_current_user: false },
    ],
  };
}

export function getMockRewardPreview(): SmartCodeRewardPreview {
  return {
    expected_smartpoints: 85,
    bonus_eligibility: true,
    bonus_percentage: 15,
    trust_score_impact: 2,
    current_trust_score: 782,
    new_trust_score: 784,
    reward_tier: 'gold',
    streak_multiplier: 1.2,
    referral_bonus: 10,
  };
}

export function getMockSmartCodeNotifications(): SmartCodeNotification[] {
  return [
    { id: 'n1', type: 'submission_success', title: 'Code Submitted', message: 'Your SmartCode VLP-2024-ABC123XYZ has been submitted successfully', code: 'VLP-2024-ABC123XYZ', points: null, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false },
    { id: 'n2', type: 'verification_complete', title: 'Verification Complete', message: 'Your SmartCode has been verified! 100 SmartPoints credited to your account', code: 'VLP-2024-ABC123XYZ', points: 100, created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), read: false },
    { id: 'n3', type: 'reward_credited', title: 'Bonus Reward!', message: 'Weekly challenge bonus: 10 extra SmartPoints added', code: null, points: 10, created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), read: true },
    { id: 'n4', type: 'challenge_update', title: 'Leaderboard Update', message: 'You moved to #3 position in the weekly challenge!', code: null, points: null, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: true },
    { id: 'n5', type: 'warning', title: 'Expiring Soon', message: '2 of your pending codes will expire in 24 hours', code: null, points: null, created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), read: true },
  ];
}

export function getMockVerificationResult(code: string): SmartCodeVerificationResult {
  // Simulate different results based on code pattern
  if (code.includes('INVALID')) {
    return {
      success: false,
      status: 'invalid',
      code,
      merchant_name: null,
      product_name: null,
      reward_points: 0,
      bonus_points: 0,
      trust_score_impact: -1,
      message: 'Invalid SmartCode',
      details: 'The code format is not recognized. Please check and try again.',
    };
  }
  if (code.includes('DUPLICATE')) {
    return {
      success: false,
      status: 'duplicate',
      code,
      merchant_name: 'TechStore India',
      product_name: 'Wireless Earbuds',
      reward_points: 0,
      bonus_points: 0,
      trust_score_impact: 0,
      message: 'Duplicate Code',
      details: 'This SmartCode has already been submitted on 2024-01-15.',
    };
  }
  if (code.includes('EXPIRED')) {
    return {
      success: false,
      status: 'expired',
      code,
      merchant_name: 'Health Plus',
      product_name: 'Vitamin Supplements',
      reward_points: 0,
      bonus_points: 0,
      trust_score_impact: 0,
      message: 'Code Expired',
      details: 'This SmartCode expired on 2023-12-31 and is no longer valid.',
    };
  }
  if (code.includes('PENDING')) {
    return {
      success: true,
      status: 'pending',
      code,
      merchant_name: 'Fashion Bazaar',
      product_name: 'Designer Kurti',
      reward_points: 0,
      bonus_points: 0,
      trust_score_impact: 0,
      message: 'Under Review',
      details: 'Your SmartCode is being verified. This usually takes 1-2 hours.',
    };
  }
  // Default: verified
  return {
    success: true,
    status: 'verified',
    code,
    merchant_name: 'TechStore India',
    product_name: 'Wireless Bluetooth Earbuds Pro',
    reward_points: 100,
    bonus_points: 10,
    trust_score_impact: 2,
    message: 'Verification Successful!',
    details: '100 SmartPoints credited. Bonus: +10 SP for weekly challenge participation.',
  };
}
