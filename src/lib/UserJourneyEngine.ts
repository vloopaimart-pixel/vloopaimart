/**
 * VLOOP UNIVERSAL USER JOURNEY & EXPERIENCE ENGINE
 * Phase 5 — Personal Dashboard, Quick Actions, Engagement System
 */

import { supabase } from './supabase';

export const USER_JOURNEY_VERSION = '5.0.0' as const;

// ============================================================
// ZONE TYPES
// ============================================================

export const EXPERIENCE_ZONES = {
  SHOP: 'shop',
  LEARN: 'learn',
  SERVICES: 'services',
  COMMUNITY: 'community',
  WALLET: 'wallet',
} as const;

export type ExperienceZone = typeof EXPERIENCE_ZONES[keyof typeof EXPERIENCE_ZONES];

export const ZONE_LABELS: Record<ExperienceZone, string> = {
  shop: 'Shop & Discover',
  learn: 'Learn & Earn',
  services: 'Essential Services',
  community: 'Community & Care',
  wallet: 'My Wallet & Rewards',
};

export const ZONE_DESCRIPTIONS: Record<ExperienceZone, string> = {
  shop: 'Browse products, deals, and discover new items',
  learn: 'Watch videos, complete quizzes, earn SmartPoints',
  services: 'Pay bills, recharge, and manage utilities',
  community: 'Contribute, volunteer, and support causes',
  wallet: 'Check balances, rewards, and transactions',
};

export const ZONE_ICONS: Record<ExperienceZone, string> = {
  shop: 'ShoppingBag',
  learn: 'GraduationCap',
  services: 'Zap',
  community: 'HeartHandshake',
  wallet: 'Wallet',
};

// ============================================================
// QUICK ACTION TYPES
// ============================================================

export const QUICK_ACTIONS = {
  SEARCH: 'search',
  SCAN: 'scan',
  UPLOAD: 'upload',
  VOICE: 'voice',
  EMERGENCY: 'emergency',
  WALLET: 'wallet',
  NOTIFICATIONS: 'notifications',
} as const;

export type QuickActionType = typeof QUICK_ACTIONS[keyof typeof QUICK_ACTIONS];

export const QUICK_ACTION_LABELS: Record<QuickActionType, string> = {
  search: 'Search',
  scan: 'Scan SmartCode',
  upload: 'Upload Paper Code',
  voice: 'Voice Assistant',
  emergency: 'Emergency',
  wallet: 'Wallet',
  notifications: 'Notifications',
};

// ============================================================
// PROGRESS TYPES
// ============================================================

export const PROGRESS_TYPES = {
  LEARNING: 'learning',
  SHOPPING: 'shopping',
  COMMUNITY: 'community',
  TRUST_SCORE: 'trust_score',
  CHALLENGE: 'challenge',
  REWARD_UNLOCK: 'reward_unlock',
  SMARTCODE: 'smartcode',
  CARE_CLUB: 'care_club',
  ESSENTIAL_SERVICES: 'essential_services',
  VOLUNTEER: 'volunteer',
} as const;

export const PROGRESS_LABELS: Record<string, string> = {
  learning: 'Learning Progress',
  shopping: 'Shopping Progress',
  community: 'Community Contribution',
  trust_score: 'Trust Score Progress',
  challenge: 'Challenge Completion',
  reward_unlock: 'Reward Unlock Progress',
  smartcode: 'SmartCode Participation',
  care_club: 'Care Club Progress',
  essential_services: 'Services Usage',
  volunteer: 'Volunteer Activities',
};

// ============================================================
// OPPORTUNITY TYPES
// ============================================================

export const OPPORTUNITY_TYPES = {
  FEATURED_DEAL: 'featured_deal',
  NEW_LEARNING: 'new_learning',
  DAILY_QUIZ: 'daily_quiz',
  COMMUNITY_MISSION: 'community_mission',
  CARE_CLUB_ACTIVITY: 'care_club_activity',
  MERCHANT_OFFER: 'merchant_offer',
  SMARTCODE_CHALLENGE: 'smartcode_challenge',
  FLASH_SALE: 'flash_sale',
} as const;

export const OPPORTUNITY_LABELS: Record<string, string> = {
  featured_deal: 'Featured Deal',
  new_learning: 'New Learning Video',
  daily_quiz: 'Quiz of the Day',
  community_mission: 'Community Mission',
  care_club_activity: 'Care Club Activity',
  merchant_offer: 'Merchant Offer',
  smartcode_challenge: 'Weekly Challenge',
  flash_sale: 'Flash Sale',
};

// ============================================================
// INTERFACES
// ============================================================

export interface UserExperiencePrefs {
  id: string;
  user_id: string;
  preferred_theme: 'light' | 'dark' | 'auto';
  quick_actions_order: string[];
  deal_alerts: boolean;
  learning_alerts: boolean;
  community_alerts: boolean;
  experience_zones_order: string[];
}

export interface DailyEngagementOpportunity {
  id: string;
  opportunity_date: string;
  opportunity_type: string;
  title: string;
  description: string | null;
  image_url: string | null;
  target_type: string | null;
  target_id: string | null;
  action_url: string | null;
  smartpoints_reward: number;
  bonus_multiplier: number;
  views_count: number;
  clicks_count: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  progress_type: string;
  current_level: number;
  current_points: number;
  points_to_next_level: number;
  total_sessions: number;
  total_actions: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  milestones_achieved: string[];
}

export interface AchievementDefinition {
  id: string;
  achievement_code: string;
  achievement_name: string;
  description: string | null;
  category: string;
  badge_url: string | null;
  badge_color: string;
  requirement_type: string;
  requirement_value: number;
  smartpoints_reward: number;
  badge_level: number;
  is_hidden: boolean;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achievement_code?: string;
  achievement_name?: string;
  achieved_at: string;
  smartpoints_awarded: number;
}

export interface UniversalSearchResult {
  id: string;
  entity_type: string;
  entity_id: string;
  title: string;
  description: string | null;
  category: string | null;
  popularity_score: number;
}

export interface DailyTip {
  id: string;
  tip_type: string;
  title: string;
  content: string;
  icon: string | null;
}

export interface UserZoneStats {
  id: string;
  user_id: string;
  zone_type: string;
  visits_count: number;
  actions_count: number;
  last_visit_at: string | null;
}

export interface UserRecommendation {
  id: string;
  user_id: string;
  recommendation_type: string;
  target_entity_id: string | null;
  relevance_score: number;
  confidence_score: number;
  reason: string | null;
  was_shown: boolean;
  was_clicked: boolean;
}

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function getUserDashboardSummary(userId: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('get_user_dashboard_summary', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function getUserPrefs(userId: string): Promise<UserExperiencePrefs | null> {
  const { data, error } = await supabase
    .from('user_experience_prefs')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as UserExperiencePrefs | null;
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from('user_progress_tracking')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []) as UserProgress[];
}

export async function getUserAchievements(userId: string): Promise<(UserAchievement & { achievement_code?: string; achievement_name?: string })[]> {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievement_definitions(achievement_code, achievement_name)')
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((ua: any) => ({
    ...ua,
    achievement_code: ua.achievement_definitions?.achievement_code,
    achievement_name: ua.achievement_definitions?.achievement_name,
  }));
}

export async function getAchievementDefinitions(): Promise<AchievementDefinition[]> {
  const { data, error } = await supabase
    .from('achievement_definitions')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) throw error;
  return (data || []) as AchievementDefinition[];
}

export async function getTodayOpportunities(): Promise<DailyEngagementOpportunity[]> {
  const { data, error } = await supabase.rpc('get_today_opportunities');
  if (error) throw error;
  return data || [];
}

export async function getDailyTips(): Promise<DailyTip[]> {
  const { data, error } = await supabase
    .from('daily_tips')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) throw error;
  return (data || []) as DailyTip[];
}

export async function trackZoneActivity(userId: string, zoneType: string, actionType: string = 'visit'): Promise<void> {
  await supabase.rpc('track_user_zone_activity', {
    p_user_id: userId,
    p_zone_type: zoneType,
    p_action_type: actionType,
  });
}

export async function universalSearch(query: string, filters?: { entity_type?: string; category?: string }): Promise<UniversalSearchResult[]> {
  let queryBuilder = supabase
    .from('universal_search_index')
    .select('*')
    .eq('is_active', true);

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  if (filters?.entity_type) {
    queryBuilder = queryBuilder.eq('entity_type', filters.entity_type);
  }

  const { data, error } = await queryBuilder.order('popularity_score', { ascending: false }).limit(20);
  if (error) throw error;
  return (data || []) as UniversalSearchResult[];
}

export async function getUserRecommendations(userId: string, limit: number = 10): Promise<UserRecommendation[]> {
  const { data, error } = await supabase
    .from('user_personalized_recommendations')
    .select('*')
    .eq('user_id', userId)
    .eq('was_shown', false)
    .gt('expires_at', new Date().toISOString())
    .order('relevance_score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as UserRecommendation[];
}

export async function getUserZoneStats(userId: string): Promise<UserZoneStats[]> {
  const { data, error } = await supabase
    .from('user_experience_zone_stats')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []) as UserZoneStats[];
}

export async function saveSearchHistory(userId: string, query: string, resultsCount: number, searchType: string = 'text'): Promise<void> {
  const { error } = await supabase
    .from('user_search_history')
    .insert({
      user_id: userId,
      search_query: query,
      search_type: searchType,
      results_count: resultsCount,
    });
  if (error) console.error('Failed to save search history:', error);
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getProgressColor(progress: number): string {
  if (progress >= 80) return 'bg-emerald-500';
  if (progress >= 60) return 'bg-blue-500';
  if (progress >= 40) return 'bg-amber-500';
  if (progress >= 20) return 'bg-orange-500';
  return 'bg-slate-400';
}

export function getProgressGradient(progress: number): string {
  if (progress >= 80) return 'from-emerald-500 to-teal-500';
  if (progress >= 60) return 'from-blue-500 to-indigo-500';
  if (progress >= 40) return 'from-amber-500 to-orange-500';
  if (progress >= 20) return 'from-orange-500 to-red-500';
  return 'from-slate-400 to-slate-500';
}

export function getStreakColor(streak: number): string {
  if (streak >= 30) return 'text-amber-400';
  if (streak >= 14) return 'text-emerald-400';
  if (streak >= 7) return 'text-blue-400';
  if (streak >= 3) return 'text-slate-400';
  return 'text-gray-300';
}

export function getAchievementCategoryColor(category: string): string {
  switch (category) {
    case 'learning': return 'from-blue-500 to-indigo-600';
    case 'shopping': return 'from-emerald-500 to-teal-600';
    case 'community': return 'from-amber-500 to-orange-600';
    case 'trust': return 'from-violet-500 to-purple-600';
    case 'smartcode': return 'from-cyan-500 to-blue-600';
    case 'care': return 'from-rose-500 to-pink-600';
    case 'streak': return 'from-amber-400 to-yellow-500';
    default: return 'from-slate-500 to-gray-600';
  }
}

export function getZoneColor(zone: ExperienceZone): string {
  switch (zone) {
    case 'shop': return 'from-blue-600 to-indigo-600';
    case 'learn': return 'from-emerald-600 to-teal-600';
    case 'services': return 'from-amber-500 to-orange-600';
    case 'community': return 'from-rose-500 to-pink-600';
    case 'wallet': return 'from-violet-600 to-purple-600';
    default: return 'from-slate-600 to-gray-600';
  }
}

export function getZoneDescription(zone: ExperienceZone): string {
  switch (zone) {
    case 'shop': return 'Browse products, deals, and discover new items';
    case 'learn': return 'Watch videos, complete quizzes, earn SmartPoints';
    case 'services': return 'Pay bills, recharge, and manage utilities';
    case 'community': return 'Contribute, volunteer, and support causes';
    case 'wallet': return 'Check balances, rewards, and transactions';
    default: return '';
  }
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockUserProgress(): UserProgress[] {
  return [
    { id: 'p1', user_id: 'user-1', progress_type: 'learning', current_level: 3, current_points: 250, points_to_next_level: 100, total_sessions: 15, total_actions: 45, current_streak: 5, longest_streak: 12, last_activity_date: new Date().toISOString().split('T')[0], milestones_achieved: ['First Video', 'Quiz Master'] },
    { id: 'p2', user_id: 'user-1', progress_type: 'shopping', current_level: 2, current_points: 80, points_to_next_level: 100, total_sessions: 8, total_actions: 20, current_streak: 0, longest_streak: 3, last_activity_date: null, milestones_achieved: [] },
    { id: 'p3', user_id: 'user-1', progress_type: 'community', current_level: 1, current_points: 45, points_to_next_level: 100, total_sessions: 3, total_actions: 8, current_streak: 2, longest_streak: 5, last_activity_date: new Date().toISOString().split('T')[0], milestones_achieved: ['First Contribution'] },
    { id: 'p4', user_id: 'user-1', progress_type: 'trust_score', current_level: 2, current_points: 65, points_to_next_level: 100, total_sessions: 0, total_actions: 0, current_streak: 0, longest_streak: 0, last_activity_date: null, milestones_achieved: [] },
  ];
}

export function getMockTodayOpportunities(): DailyEngagementOpportunity[] {
  return [
    { id: 'opp1', opportunity_date: new Date().toISOString().split('T')[0], opportunity_type: 'featured_deal', title: 'Flash Sale: 50% Off Electronics', description: 'Limited time offer on selected products', image_url: null, target_type: 'product', target_id: null, action_url: '/marketplace', smartpoints_reward: 10, bonus_multiplier: 1.5, views_count: 1250, clicks_count: 450 },
    { id: 'opp2', opportunity_date: new Date().toISOString().split('T')[0], opportunity_type: 'daily_quiz', title: 'Daily Knowledge Quiz', description: 'Complete today\'s quiz for 20 SmartPoints', image_url: null, target_type: 'quiz', target_id: null, action_url: '/quiz', smartpoints_reward: 20, bonus_multiplier: 1.0, views_count: 850, clicks_count: 320 },
    { id: 'opp3', opportunity_date: new Date().toISOString().split('T')[0], opportunity_type: 'smartcode_challenge', title: 'Weekly SmartCode Challenge', description: 'Enter your code before Sunday draw', image_url: null, target_type: 'smartcode', target_id: null, action_url: '/smartcode', smartpoints_reward: 10, bonus_multiplier: 1.0, views_count: 2200, clicks_count: 890 },
    { id: 'opp4', opportunity_date: new Date().toISOString().split('T')[0], opportunity_type: 'care_club_activity', title: 'Community Food Drive', description: 'Support families in need this week', image_url: null, target_type: 'campaign', target_id: null, action_url: '/careclub', smartpoints_reward: 25, bonus_multiplier: 2.0, views_count: 560, clicks_count: 180 },
  ];
}

export function getMockUserAchievements(): (UserAchievement & { achievement_code: string; achievement_name: string })[] {
  return [
    { id: 'ua1', user_id: 'user-1', achievement_id: 'a1', achievement_code: 'first_purchase', achievement_name: 'First Purchase', achieved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), smartpoints_awarded: 10 },
    { id: 'ua2', user_id: 'user-1', achievement_id: 'a2', achievement_code: 'learning_starter', achievement_name: 'Learning Starter', achieved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), smartpoints_awarded: 15 },
    { id: 'ua3', user_id: 'user-1', achievement_id: 'a3', achievement_code: '7_day_streak', achievement_name: 'Week Warrior', achieved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), smartpoints_awarded: 30 },
  ];
}

export function getMockZoneStats(): UserZoneStats[] {
  return [
    { id: 'zs1', user_id: 'user-1', zone_type: 'shop', visits_count: 24, actions_count: 56, last_visit_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'zs2', user_id: 'user-1', zone_type: 'learn', visits_count: 15, actions_count: 32, last_visit_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    { id: 'zs3', user_id: 'user-1', zone_type: 'services', visits_count: 6, actions_count: 8, last_visit_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockDashboardSummary(): Record<string, unknown> {
  return {
    profile: {
      name: 'Alex Kumar',
      trust_score: 65,
      points: 2450,
    },
    wallet_a: {
      smartpoints_balance: 2450,
      total_earned: 3200,
    },
    wallet_b: {
      foe_units_balance: 150,
      active_projects: 2,
    },
    recent_achievements: getMockUserAchievements(),
  };
}
