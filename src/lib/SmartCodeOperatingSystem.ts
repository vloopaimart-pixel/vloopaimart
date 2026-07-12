/**
 * VLOOP SMARTCODE™ OPERATING SYSTEM
 * Phase 3 — Complete SmartCode, SmartPoints, Trust Score Integration
 *
 * SmartPoints can ONLY be earned through approved ecosystem activities.
 * SmartPoints are NEVER directly purchasable.
 */

import { supabase } from './supabase';

export const SMARTCODE_OS_VERSION = '3.0.0' as const;

// ============================================================
// ACTIVITY TYPES (SmartPoints Earning)
// ============================================================

export const ACTIVITY_TYPES = {
  MARKETPLACE_PURCHASE: 'marketplace_purchase',
  CARE_CLUB_CONTRIBUTION: 'care_club_contribution',
  EDUCATIONAL_VIDEO: 'educational_video',
  KNOWLEDGE_QUIZ_PASS: 'knowledge_quiz_pass',
  ESSENTIAL_SERVICE: 'essential_service',
  VOLUNTEER_ACTIVITY: 'volunteer_activity',
  COMMUNITY_PARTICIPATION: 'community_participation',
  DAILY_LOGIN: 'daily_login',
  REFERRAL_COMPLETE: 'referral_complete',
  SMARTCODE_ENTRY: 'smartcode_entry',
} as const;

export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  marketplace_purchase: 'Marketplace Purchase',
  care_club_contribution: 'Care Club Contribution',
  educational_video: 'Educational Video',
  knowledge_quiz_pass: 'Knowledge Quiz',
  essential_service: 'Essential Service',
  volunteer_activity: 'Volunteer Activity',
  community_participation: 'Community Participation',
  daily_login: 'Daily Login',
  referral_complete: 'Successful Referral',
  smartcode_entry: 'SmartCode Entry',
};

// ============================================================
// INTERFACES
// ============================================================

export interface SmartPointsEarningRule {
  id: string;
  activity_type: ActivityType;
  activity_name: string;
  activity_category: string;
  base_points: number;
  multiplier: number;
  max_daily_points: number;
  max_weekly_points: number;
  is_active: boolean;
  description: string | null;
}

export interface SmartPointsEarning {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  points_earned: number;
  source_type: string | null;
  source_id: string | null;
  is_validated: boolean;
  validation_notes: string | null;
  ai_risk_score: number;
  ai_checked: boolean;
  created_at: string;
}

export interface KnowledgeChallenge {
  id: string;
  challenge_code: string;
  challenge_type: 'video' | 'article' | 'interactive';
  title: string;
  description: string | null;
  category: string | null;
  video_url: string | null;
  article_content: string | null;
  duration_minutes: number;
  quiz_questions: QuizQuestion[];
  passing_score: number;
  max_attempts: number;
  smartpoints_reward: number;
  bonus_points_first_pass: number;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}

export interface UserChallengeProgress {
  id: string;
  user_id: string;
  challenge_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  video_watched: boolean;
  video_progress_percent: number;
  quiz_attempts: number;
  quiz_score: number | null;
  quiz_passed: boolean;
  quiz_answers: Record<number, number> | null;
  points_awarded: number;
  bonus_awarded: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface WeeklyAIValidation {
  id: string;
  week_id: string | null;
  user_id: string;
  duplicate_check_passed: boolean;
  fake_account_check_passed: boolean;
  device_abuse_check_passed: boolean;
  multiple_identity_check_passed: boolean;
  suspicious_behavior_check_passed: boolean;
  rule_violation_check_passed: boolean;
  overall_risk_score: number;
  ai_confidence: number;
  ai_recommendation: string | null;
  has_flags: boolean;
  flags: unknown[];
  is_validated: boolean;
  validation_status: 'pending' | 'approved' | 'rejected' | 'manual_review';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface TransparencyStats {
  id: string;
  stat_date: string;
  total_active_participants: number;
  new_participants_today: number;
  verified_participants: number;
  total_entries_today: number;
  verified_entries_today: number;
  rejected_entries_today: number;
  current_week_entries: number;
  current_week_participants: number;
  rewards_distributed_today: number;
  smartpoints_earned_today: number;
  avg_trust_score: number;
  high_trust_users: number;
  marketplace_transactions: number;
  careclub_contributions: number;
  quizzes_completed: number;
  videos_watched: number;
  fraud_attempts_blocked: number;
  duplicate_accounts_detected: number;
  suspicious_activity_flags: number;
  computed_at: string;
}

export interface SmartCodeAcademyContent {
  id: string;
  content_type: 'guide' | 'video' | 'faq' | 'rule' | 'tutorial';
  title: string;
  content: string | null;
  video_url: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface UserSmartPointsSummary {
  user_id: string;
  name: string;
  total_points_earned: number;
  points_last_7_days: number;
  points_last_30_days: number;
  total_earnings_count: number;
  last_earning_at: string | null;
}

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function getEarningRules(): Promise<SmartPointsEarningRule[]> {
  const { data, error } = await supabase
    .from('smartpoints_earning_rules')
    .select('*')
    .eq('is_active', true)
    .order('activity_name');
  if (error) throw error;
  return (data || []) as SmartPointsEarningRule[];
}

export async function getUserEarnings(userId: string, limit: number = 50): Promise<SmartPointsEarning[]> {
  const { data, error } = await supabase
    .from('smartpoints_earnings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as SmartPointsEarning[];
}

export async function getUserPointsSummary(userId: string): Promise<UserSmartPointsSummary | null> {
  const { data, error } = await supabase
    .from('user_smartpoints_summary')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as UserSmartPointsSummary | null;
}

export async function earnSmartPoints(
  userId: string,
  activityType: ActivityType,
  sourceId?: string,
  sourceType?: string
): Promise<{ success: boolean; points_earned?: number; error?: string }> {
  const { data, error } = await supabase.rpc('earn_smartpoints', {
    p_user_id: userId,
    p_activity_type: activityType,
    p_source_id: sourceId || null,
    p_source_type: sourceType || null,
  });
  if (error) throw error;
  return data;
}

export async function validateUserParticipation(userId: string): Promise<{
  valid: boolean;
  trust_score?: number;
  trust_level?: string;
  risk_score?: number;
  flags?: unknown[];
}> {
  const { data, error } = await supabase.rpc('validate_user_participation', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function getKnowledgeChallenges(): Promise<KnowledgeChallenge[]> {
  const { data, error } = await supabase
    .from('knowledge_challenges')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) throw error;
  return (data || []) as KnowledgeChallenge[];
}

export async function getUserChallengeProgress(userId: string): Promise<UserChallengeProgress[]> {
  const { data, error } = await supabase
    .from('user_challenge_progress')
    .select('*, knowledge_challenges(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as UserChallengeProgress[];
}

export async function startChallenge(userId: string, challengeId: string): Promise<void> {
  const { error } = await supabase
    .from('user_challenge_progress')
    .upsert({
      user_id: userId,
      challenge_id: challengeId,
      status: 'in_progress',
      started_at: new Date().toISOString(),
    }, { onConflict: 'user_id,challenge_id' });
  if (error) throw error;
}

export async function completeChallenge(
  userId: string,
  challengeId: string,
  quizScore: number,
  quizAnswers: Record<number, number>,
  pointsAwarded: number,
  bonusAwarded: number
): Promise<void> {
  const passed = quizScore >= 70;
  const { error } = await supabase
    .from('user_challenge_progress')
    .upsert({
      user_id: userId,
      challenge_id: challengeId,
      status: passed ? 'completed' : 'failed',
      quiz_score: quizScore,
      quiz_passed: passed,
      quiz_answers: quizAnswers,
      points_awarded: pointsAwarded,
      bonus_awarded: bonusAwarded,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,challenge_id' });
  if (error) throw error;
}

export async function updateVideoProgress(
  userId: string,
  challengeId: string,
  progress: number
): Promise<void> {
  const { error } = await supabase
    .from('user_challenge_progress')
    .upsert({
      user_id: userId,
      challenge_id: challengeId,
      video_progress_percent: progress,
      video_watched: progress >= 90,
      status: 'in_progress',
    }, { onConflict: 'user_id,challenge_id' });
  if (error) throw error;
}

export async function getTransparencyStats(): Promise<TransparencyStats[]> {
  const { data, error } = await supabase
    .from('transparency_stats')
    .select('*')
    .order('stat_date', { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data || []) as TransparencyStats[];
}

export async function getWeeklySmartCodeStats(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('get_weekly_smartcode_stats');
  if (error) throw error;
  return data;
}

export async function getAcademyContent(): Promise<SmartCodeAcademyContent[]> {
  const { data, error } = await supabase
    .from('smartcode_academy')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) throw error;
  return (data || []) as SmartCodeAcademyContent[];
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getActivityLabel(type: string): string {
  return ACTIVITY_LABELS[type as ActivityType] || type;
}

export function formatSmartPoints(points: number): string {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M SP`;
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K SP`;
  }
  return `${points} SP`;
}

export function getPointsColor(points: number): string {
  if (points >= 1000) return 'text-amber-400';
  if (points >= 500) return 'text-emerald-400';
  if (points >= 100) return 'text-blue-400';
  return 'text-slate-400';
}

export function getChallengeStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-emerald-500/20 text-emerald-400';
    case 'in_progress': return 'bg-blue-500/20 text-blue-400';
    case 'failed': return 'bg-red-500/20 text-red-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
}

export function getValidationStatusColor(status: string): string {
  switch (status) {
    case 'approved': return 'bg-emerald-500/20 text-emerald-400';
    case 'pending': return 'bg-amber-500/20 text-amber-400';
    case 'rejected': return 'bg-red-500/20 text-red-400';
    case 'manual_review': return 'bg-violet-500/20 text-violet-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockEarningRules(): SmartPointsEarningRule[] {
  return [
    { id: 'r1', activity_type: 'marketplace_purchase', activity_name: 'Marketplace Purchase', activity_category: 'marketplace_purchase', base_points: 1, multiplier: 1, max_daily_points: 0, max_weekly_points: 0, is_active: true, description: 'Earn 1 point per ₹4 spent' },
    { id: 'r2', activity_type: 'care_club_contribution', activity_name: 'Care Club Contribution', activity_category: 'care_club', base_points: 5, multiplier: 1, max_daily_points: 100, max_weekly_points: 500, is_active: true, description: '5 points per ₹10 contribution' },
    { id: 'r3', activity_type: 'educational_video', activity_name: 'Watch Educational Video', activity_category: 'education', base_points: 10, multiplier: 1, max_daily_points: 50, max_weekly_points: 200, is_active: true, description: 'Complete video lessons' },
    { id: 'r4', activity_type: 'knowledge_quiz_pass', activity_name: 'Knowledge Quiz', activity_category: 'quiz', base_points: 20, multiplier: 1, max_daily_points: 100, max_weekly_points: 400, is_active: true, description: 'Pass knowledge quizzes' },
    { id: 'r5', activity_type: 'daily_login', activity_name: 'Daily Login', activity_category: 'daily_engagement', base_points: 5, multiplier: 1, max_daily_points: 5, max_weekly_points: 35, is_active: true, description: 'Login daily to earn' },
    { id: 'r6', activity_type: 'smartcode_entry', activity_name: 'SmartCode Entry', activity_category: 'smartcode_participation', base_points: 10, multiplier: 1, max_daily_points: 70, max_weekly_points: 70, is_active: true, description: 'Weekly SmartCode participation' },
  ];
}

export function getMockChallenges(): KnowledgeChallenge[] {
  return [
    {
      id: 'c1',
      challenge_code: 'vloop-basics',
      challenge_type: 'video',
      title: 'VLOOP Platform Introduction',
      description: 'Learn about VLOOP ecosystem and how to participate',
      category: 'Getting Started',
      video_url: 'https://example.com/video1',
      article_content: null,
      duration_minutes: 5,
      quiz_questions: [
        { question: 'What is VLOOP?', options: ['Shopping platform', 'Banking app', 'A lottery', 'Ecosystem platform'], correct_index: 3 },
        { question: 'How do you earn SmartPoints?', options: ['By purchasing them', 'Only through activities', 'From friends', 'Randomly'], correct_index: 1 },
      ],
      passing_score: 70,
      max_attempts: 3,
      smartpoints_reward: 20,
      bonus_points_first_pass: 10,
      is_active: true,
      is_featured: true,
      display_order: 1,
    },
    {
      id: 'c2',
      challenge_code: 'smartcode-intro',
      challenge_type: 'interactive',
      title: 'SmartCode Explained',
      description: 'Understanding the 3-digit participation system',
      category: 'SmartCode',
      video_url: null,
      article_content: 'SmartCode is VLOOP\'s unique 3-digit code system...',
      duration_minutes: 3,
      quiz_questions: [
        { question: 'How many digits in SmartCode?', options: ['2', '3', '4', '5'], correct_index: 1 },
      ],
      passing_score: 70,
      max_attempts: 3,
      smartpoints_reward: 15,
      bonus_points_first_pass: 5,
      is_active: true,
      is_featured: true,
      display_order: 2,
    },
  ];
}

export function getMockTransparencyStats(): TransparencyStats {
  return {
    id: 'ts1',
    stat_date: new Date().toISOString().split('T')[0],
    total_active_participants: 45230,
    new_participants_today: 156,
    verified_participants: 38420,
    total_entries_today: 28750,
    verified_entries_today: 27890,
    rejected_entries_today: 860,
    current_week_entries: 185420,
    current_week_participants: 42850,
    rewards_distributed_today: 2.5,
    smartpoints_earned_today: 1250000,
    avg_trust_score: 65.4,
    high_trust_users: 12450,
    marketplace_transactions: 8920,
    careclub_contributions: 1560,
    quizzes_completed: 3250,
    videos_watched: 7840,
    fraud_attempts_blocked: 48,
    duplicate_accounts_detected: 12,
    suspicious_activity_flags: 23,
    computed_at: new Date().toISOString(),
  };
}

export function getMockUserSummary(): UserSmartPointsSummary {
  return {
    user_id: 'user-1',
    name: 'Test User',
    total_points_earned: 2450,
    points_last_7_days: 125,
    points_last_30_days: 480,
    total_earnings_count: 52,
    last_earning_at: new Date().toISOString(),
  };
}

export function getMockAcademyContent(): SmartCodeAcademyContent[] {
  return [
    { id: 'a1', content_type: 'guide', title: 'What is SmartCode?', content: 'SmartCode is VLOOP\'s unique 3-digit participation system.', video_url: null, image_url: null, display_order: 1, is_active: true },
    { id: 'a2', content_type: 'guide', title: 'How to Participate', content: 'Enter your SmartCode weekly and build your Trust Score.', video_url: null, image_url: null, display_order: 2, is_active: true },
    { id: 'a3', content_type: 'rule', title: 'Weekly Participation', content: 'One SmartCode entry per week per user.', video_url: null, image_url: null, display_order: 3, is_active: true },
    { id: 'a4', content_type: 'faq', title: 'Can I buy SmartPoints?', content: 'No. SmartPoints can ONLY be earned through approved activities. They are never purchasable.', video_url: null, image_url: null, display_order: 4, is_active: true },
    { id: 'a5', content_type: 'tutorial', title: 'Entering Your SmartCode', content: '1. Login to your account\n2. Navigate to SmartCode\n3. Enter your 3-digit code\n4. Submit before deadline', video_url: null, image_url: null, display_order: 5, is_active: true },
  ];
}

export function getMockEarnings(): SmartPointsEarning[] {
  return [
    { id: 'e1', user_id: 'user-1', activity_type: 'smartcode_entry', points_earned: 10, source_type: 'weekly_smartcode', source_id: 'w1', is_validated: true, validation_notes: null, ai_risk_score: 0, ai_checked: true, created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'e2', user_id: 'user-1', activity_type: 'daily_login', points_earned: 5, source_type: null, source_id: null, is_validated: true, validation_notes: null, ai_risk_score: 0, ai_checked: true, created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 'e3', user_id: 'user-1', activity_type: 'knowledge_quiz_pass', points_earned: 20, source_type: 'challenge', source_id: 'c1', is_validated: true, validation_notes: 'Quiz score: 85%', ai_risk_score: 0, ai_checked: true, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'e4', user_id: 'user-1', activity_type: 'marketplace_purchase', points_earned: 25, source_type: 'order', source_id: 'o1', is_validated: true, validation_notes: 'Order: ₹100', ai_risk_score: 0, ai_checked: true, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  ];
}
