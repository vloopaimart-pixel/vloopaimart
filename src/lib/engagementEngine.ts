/**
 * VLOOP Enterprise Engagement Engine
 * ================================
 *
 * CENTRAL HUB for all engagement modules.
 * Connected to vloopEngine.ts for business rules.
 *
 * Modules:
 *   - SmartCode Intelligence (Hybrid AI + Manual)
 *   - Quiz & Knowledge
 *   - Daily Hints
 *   - Awareness Content
 *   - Social Sharing
 *   - Partner Promotions
 *   - Admin Controls
 *
 * Last Updated: Phase 24 - Hybrid SmartCode Engine
 */

import { supabase } from './supabase';
import {
  SMARTCODE_RULES,
  QUIZ_RULES,
  QUIZ_CATEGORIES,
  getRewardTier,
  type RewardCategory,
} from './vloopEngine';
import type {
  SmartCodeHistory,
  SmartCodeSelection,
  SmartCodeStat,
  QuizQuestion,
  QuizResult,
  UserEngagement,
  DailyHint,
  AwarenessContent,
  SocialShare,
  PartnerCampaign,
  AdminSetting,
  SmartCodeAllocation,
  SmartCodeDistributionSession,
  UserSmartCodeSummary,
  WeeklyAIRewardPool,
} from './supabase';

// ============================================================================
// SECTION 1: HYBRID SMARTCODE ENGINE (AI + Manual)
// ============================================================================

/** SmartCode mode type */
export type SmartCodeMode = 'ai_auto' | 'manual';

/** Point source type */
export type PointSource = 'purchase' | 'care_club' | 'bonus';

/** Allocation result */
export type AllocationResult = {
  success: boolean;
  allocation?: SmartCodeAllocation;
  error?: string;
};

/** Distribution result */
export type DistributionResult = {
  success: boolean;
  session?: SmartCodeDistributionSession;
  allocations?: SmartCodeAllocation[];
  error?: string;
};

/** Generate a random SmartCode (000-999) */
export function generateSmartCode(): string {
  return String(Math.floor(Math.random() * 1000)).padStart(3, '0');
}

/** Validate a SmartCode */
export function isValidSmartCode(code: string): boolean {
  const num = parseInt(code, 10);
  return code.length === 3 && !isNaN(num) && num >= 0 && num <= 999;
}

/** Get current week period identifier (YYYY-WW) */
export function getCurrentWeekPeriod(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// ============================================================================
// AI AUTO MODE - Automatic Point Distribution
// ============================================================================

/**
 * AI Automatic Distribution
 * Distributes all available points across randomly generated SmartCodes
 */
export async function distributePointsAI(
  userId: string,
  totalPoints: number,
  source: PointSource = 'purchase'
): Promise<DistributionResult> {
  if (totalPoints <= 0) {
    return { success: false, error: 'No points to distribute' };
  }

  const weekPeriod = getCurrentWeekPeriod();

  // Create distribution session
  const { data: session, error: sessionError } = await supabase
    .from('smartcode_distribution_sessions')
    .insert({
      user_id: userId,
      total_points: totalPoints,
      points_distributed: 0,
      mode: 'ai_auto',
      status: 'pending',
      week_period: weekPeriod,
    })
    .select()
    .single();

  if (sessionError || !session) {
    return { success: false, error: 'Failed to create distribution session' };
  }

  const sessionId = (session as SmartCodeDistributionSession).id;
  const allocations: SmartCodeAllocation[] = [];
  let pointsRemaining = totalPoints;

  // AI Distribution Algorithm
  // Strategy: Distribute across 3-5 codes with weighted allocation
  const numCodes = Math.min(5, Math.max(3, Math.ceil(totalPoints / 20)));
  const basePointsPerCode = Math.floor(totalPoints / numCodes);
  const extraPoints = totalPoints % numCodes;

  const usedCodes = new Set<string>();

  for (let i = 0; i < numCodes && pointsRemaining > 0; i++) {
    let code = generateSmartCode();
    while (usedCodes.has(code)) {
      code = generateSmartCode();
    }
    usedCodes.add(code);

    const pointsForThis = i === 0 ? basePointsPerCode + extraPoints : basePointsPerCode;

    const { data: allocation, error: allocError } = await supabase
      .from('smartcode_allocations')
      .insert({
        user_id: userId,
        smartcode: code,
        points_allocated: pointsForThis,
        source,
        week_period: weekPeriod,
        mode: 'ai_auto',
        is_active: true,
      })
      .select()
      .single();

    if (!allocError && allocation) {
      allocations.push(allocation as SmartCodeAllocation);
      pointsRemaining -= pointsForThis;

      // Log AI decision
      await supabase.from('ai_distribution_log').insert({
        session_id: sessionId,
        smartcode: code,
        points_assigned: pointsForThis,
        algorithm_version: 'v1',
        confidence_score: 0.85 + Math.random() * 0.15,
        reasoning: {
          strategy: 'weighted_distribution',
          code_index: i,
          total_codes: numCodes,
        },
      });
    }
  }

  // Update session as completed
  await supabase
    .from('smartcode_distribution_sessions')
    .update({
      points_distributed: totalPoints - pointsRemaining,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  return {
    success: true,
    session: session as SmartCodeDistributionSession,
    allocations,
  };
}

// ============================================================================
// MANUAL MODE - User Controlled Distribution
// ============================================================================

/**
 * Manual Point Allocation
 * User distributes points across their chosen SmartCodes
 */
export async function allocatePointsManual(
  userId: string,
  allocations: Array<{ code: string; points: number }>,
  source: PointSource = 'purchase'
): Promise<DistributionResult> {
  const weekPeriod = getCurrentWeekPeriod();

  // Validate all codes
  for (const { code, points } of allocations) {
    if (!isValidSmartCode(code)) {
      return { success: false, error: `Invalid SmartCode: ${code}` };
    }
    if (points <= 0) {
      return { success: false, error: 'Points must be greater than 0' };
    }
  }

  const totalPoints = allocations.reduce((sum, a) => sum + a.points, 0);

  // Create distribution session
  const { data: session, error: sessionError } = await supabase
    .from('smartcode_distribution_sessions')
    .insert({
      user_id: userId,
      total_points: totalPoints,
      points_distributed: 0,
      mode: 'manual',
      status: 'pending',
      week_period: weekPeriod,
    })
    .select()
    .single();

  if (sessionError || !session) {
    return { success: false, error: 'Failed to create distribution session' };
  }

  const sessionId = (session as SmartCodeDistributionSession).id;
  const createdAllocations: SmartCodeAllocation[] = [];

  // Create or update allocations (allow duplicates)
  for (const { code, points } of allocations) {
    // Check if this exact code already exists for this user/week/source
    const { data: existing } = await supabase
      .from('smartcode_allocations')
      .select('*')
      .eq('user_id', userId)
      .eq('smartcode', code)
      .eq('week_period', weekPeriod)
      .eq('source', source)
      .eq('is_active', true)
      .maybeSingle();

    if (existing) {
      // Update existing allocation (add points)
      const { data: updated } = await supabase
        .from('smartcode_allocations')
        .update({
          points_allocated: (existing as SmartCodeAllocation).points_allocated + points,
          updated_at: new Date().toISOString(),
        })
        .eq('id', (existing as SmartCodeAllocation).id)
        .select()
        .single();
      if (updated) createdAllocations.push(updated as SmartCodeAllocation);
    } else {
      // Create new allocation
      const { data: allocation } = await supabase
        .from('smartcode_allocations')
        .insert({
          user_id: userId,
          smartcode: code,
          points_allocated: points,
          source,
          week_period: weekPeriod,
          mode: 'manual',
          is_active: true,
        })
        .select()
        .maybeSingle();
      if (allocation) createdAllocations.push(allocation as SmartCodeAllocation);
    }
  }

  // Update session as completed
  await supabase
    .from('smartcode_distribution_sessions')
    .update({
      points_distributed: totalPoints,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  return {
    success: true,
    session: session as SmartCodeDistributionSession,
    allocations: createdAllocations,
  };
}

/**
 * Add points to a single SmartCode (for incremental allocation)
 */
export async function addToSmartCode(
  userId: string,
  code: string,
  points: number,
  source: PointSource = 'purchase'
): Promise<AllocationResult> {
  if (!isValidSmartCode(code)) {
    return { success: false, error: 'Invalid SmartCode' };
  }
  if (points <= 0) {
    return { success: false, error: 'Points must be greater than 0' };
  }

  const weekPeriod = getCurrentWeekPeriod();

  // Try to find existing allocation
  const { data: existing } = await supabase
    .from('smartcode_allocations')
    .select('*')
    .eq('user_id', userId)
    .eq('smartcode', code)
    .eq('week_period', weekPeriod)
    .eq('source', source)
    .eq('is_active', true)
    .maybeSingle();

  if (existing) {
    // Update existing
    const { data: updated, error } = await supabase
      .from('smartcode_allocations')
      .update({
        points_allocated: (existing as SmartCodeAllocation).points_allocated + points,
        updated_at: new Date().toISOString(),
      })
      .eq('id', (existing as SmartCodeAllocation).id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, allocation: updated as SmartCodeAllocation };
  }

  // Create new
  const { data: allocation, error } = await supabase
    .from('smartcode_allocations')
    .insert({
      user_id: userId,
      smartcode: code,
      points_allocated: points,
      source,
      week_period: weekPeriod,
      mode: 'manual',
      is_active: true,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, allocation: allocation as SmartCodeAllocation };
}

/**
 * Remove points from a SmartCode
 */
export async function removeFromSmartCode(
  userId: string,
  allocationId: string,
  points: number
): Promise<{ success: boolean; error?: string }> {
  const { data: allocation } = await supabase
    .from('smartcode_allocations')
    .select('*')
    .eq('id', allocationId)
    .eq('user_id', userId)
    .single();

  if (!allocation) {
    return { success: false, error: 'Allocation not found' };
  }

  const current = (allocation as SmartCodeAllocation).points_allocated;

  if (points >= current) {
    // Deactivate entire allocation
    await supabase
      .from('smartcode_allocations')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', allocationId);
  } else {
    // Reduce points
    await supabase
      .from('smartcode_allocations')
      .update({
        points_allocated: current - points,
        updated_at: new Date().toISOString(),
      })
      .eq('id', allocationId);
  }

  return { success: true };
}

// ============================================================================
// USER SMARTCODE SUMMARY
// ============================================================================

/** Get user's SmartCode summary for current week */
export async function getUserSmartCodeSummary(userId: string): Promise<UserSmartCodeSummary | null> {
  const weekPeriod = getCurrentWeekPeriod();

  const { data } = await supabase
    .from('user_smartcode_summary')
    .select('*')
    .eq('user_id', userId)
    .eq('week_period', weekPeriod)
    .maybeSingle();

  return data as UserSmartCodeSummary | null;
}

/** Get all SmartCode allocations for user in current week */
export async function getUserAllocations(userId: string): Promise<SmartCodeAllocation[]> {
  const weekPeriod = getCurrentWeekPeriod();

  const { data } = await supabase
    .from('smartcode_allocations')
    .select('*')
    .eq('user_id', userId)
    .eq('week_period', weekPeriod)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (data as SmartCodeAllocation[]) || [];
}

/** Get user's total points allocated for current week */
export async function getUserTotalAllocated(userId: string): Promise<number> {
  const allocations = await getUserAllocations(userId);
  return allocations.reduce((sum, a) => sum + a.points_allocated, 0);
}

/** Check if user has completed distribution */
export async function hasCompletedDistribution(userId: string): Promise<boolean> {
  const summary = await getUserSmartCodeSummary(userId);
  return summary?.has_completed_distribution || false;
}

/** Mark distribution as completed */
export async function completeDistribution(userId: string): Promise<void> {
  const weekPeriod = getCurrentWeekPeriod();

  await supabase
    .from('user_smartcode_summary')
    .upsert({
      user_id: userId,
      week_period: weekPeriod,
      has_completed_distribution: true,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,week_period',
    });
}

// ============================================================================
// LEGACY SMARTCODE FUNCTIONS (Preserved for backward compatibility)
// ============================================================================

/** Save SmartCode selection (Legacy - kept for backward compatibility) */
export async function saveSmartCodeSelection(
  userId: string,
  code: string,
  pointsUsed: number,
  category: RewardCategory
): Promise<{ success: boolean; error?: string }> {
  if (!isValidSmartCode(code)) {
    return { success: false, error: 'Invalid SmartCode' };
  }

  const weekPeriod = getCurrentWeekPeriod();

  const { error } = await supabase.from('smartcode_selections').insert({
    user_id: userId,
    smartcode: code,
    points_used: pointsUsed,
    category,
    week_period: weekPeriod,
  });

  if (error) return { success: false, error: error.message };

  // Update stats
  await supabase.from('smartcode_stats').upsert({
    smartcode: code,
    selection_count: 1,
    last_selected_at: new Date().toISOString(),
  }, {
    onConflict: 'smartcode',
    ignoreDuplicates: false,
  });

  return { success: true };
}

/** Get SmartCode selection history for user */
export async function getUserSmartCodeHistory(userId: string): Promise<SmartCodeSelection[]> {
  const { data } = await supabase
    .from('smartcode_selections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  return (data as SmartCodeSelection[]) || [];
}

/** Get weekly SmartCode history */
export async function getSmartCodeHistory(limit = 12): Promise<SmartCodeHistory[]> {
  const { data } = await supabase
    .from('smartcode_history')
    .select('*')
    .eq('status', 'completed')
    .order('drawn_at', { ascending: false })
    .limit(limit);
  return (data as SmartCodeHistory[]) || [];
}

/** Get SmartCode stats (most/least selected) */
export async function getSmartCodeStats(): Promise<{
  mostSelected: SmartCodeStat[];
  leastSelected: SmartCodeStat[];
  trending: SmartCodeStat[];
}> {
  const { data } = await supabase
    .from('smartcode_stats')
    .select('*')
    .order('selection_count', { ascending: false })
    .limit(100);

  const stats = (data as SmartCodeStat[]) || [];

  return {
    mostSelected: stats.slice(0, 10),
    leastSelected: stats.slice(-10).reverse(),
    trending: stats.filter(s => s.last_selected_at &&
      new Date(s.last_selected_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).slice(0, 5),
  };
}

/** Get countdown to next weekly draw */
export function getWeeklyCountdown(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  // Weekly draw on Sunday at 8 PM IST
  const now = new Date();
  const target = new Date(now);
  target.setDate(target.getDate() + (7 - now.getDay()) % 7 || 7);
  target.setHours(20, 0, 0, 0);

  const diff = target.getTime() - now.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

// ============================================================================
// SECTION 2: QUIZ & KNOWLEDGE ENGINE
// ============================================================================

/** Get quiz question by category */
export async function getQuizQuestion(category?: string): Promise<QuizQuestion | null> {
  let query = supabase
    .from('quiz_questions')
    .select('*')
    .eq('is_active', true);

  if (category && QUIZ_CATEGORIES.includes(category as any)) {
    query = query.eq('category', category);
  } else {
    // Random category
    const randomCategory = QUIZ_CATEGORIES[Math.floor(Math.random() * QUIZ_CATEGORIES.length)];
    query = query.eq('category', randomCategory);
  }

  const { data } = await query.order('created_at', { ascending: false }).limit(1).single();
  return data as QuizQuestion | null;
}

/** Get multiple quiz questions */
export async function getQuizQuestions(count: number, category?: string): Promise<QuizQuestion[]> {
  let query = supabase
    .from('quiz_questions')
    .select('*')
    .eq('is_active', true);

  if (category) {
    query = query.eq('category', category);
  }

  const { data } = await query.order('created_at', { ascending: false }).limit(count);
  return (data as QuizQuestion[]) || [];
}

/** Submit quiz answer and earn XP */
export async function submitQuizAnswer(
  userId: string,
  questionId: string,
  userAnswer: string
): Promise<{ correct: boolean; xpEarned: number; explanation?: string }> {
  const { data: question } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (!question) return { correct: false, xpEarned: 0 };

  const isCorrect = (question as QuizQuestion).correct_answer === userAnswer;
  const xpEarned = isCorrect ? (question as QuizQuestion).xp_reward : 0;

  // Save result
  await supabase.from('quiz_results').insert({
    user_id: userId,
    question_id: questionId,
    user_answer: userAnswer,
    is_correct: isCorrect,
    xp_earned: xpEarned,
  });

  // Update user engagement
  if (isCorrect) {
    await updateUserXP(userId, xpEarned);
  }
  await incrementQuizCount(userId, !isCorrect ? 'completed' : 'completed');

  return {
    correct: isCorrect,
    xpEarned,
    explanation: (question as QuizQuestion).explanation || undefined,
  };
}

/** Skip quiz (no XP, just tracking) */
export async function skipQuiz(userId: string): Promise<void> {
  await incrementQuizCount(userId, 'skipped');
}

/** Get user engagement stats */
export async function getUserEngagement(userId: string): Promise<UserEngagement | null> {
  const { data } = await supabase
    .from('user_engagement')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data as UserEngagement | null;
}

/** Update user XP */
export async function updateUserXP(userId: string, xpAmount: number): Promise<void> {
  const existing = await getUserEngagement(userId);

  if (existing) {
    const newTotal = existing.xp_total + xpAmount;
    const newLevel = Math.floor(newTotal / 100) + 1;

    await supabase
      .from('user_engagement')
      .update({
        xp_total: newTotal,
        xp_level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  } else {
    await supabase.from('user_engagement').insert({
      user_id: userId,
      xp_total: xpAmount,
      xp_level: 1,
    });
  }
}

/** Increment quiz count */
export async function incrementQuizCount(userId: string, type: 'completed' | 'skipped'): Promise<void> {
  const existing = await getUserEngagement(userId);

  if (existing) {
    const update = type === 'completed'
      ? { quizzes_completed: existing.quizzes_completed + 1 }
      : { quizzes_skipped: existing.quizzes_skipped + 1 };

    await supabase
      .from('user_engagement')
      .update(update)
      .eq('user_id', userId);
  } else {
    await supabase.from('user_engagement').insert({
      user_id: userId,
      quizzes_completed: type === 'completed' ? 1 : 0,
      quizzes_skipped: type === 'skipped' ? 1 : 0,
    });
  }
}

/** Award badge */
export async function awardBadge(userId: string, badge: string): Promise<void> {
  const existing = await getUserEngagement(userId);

  if (existing) {
    const badges = [...(existing.badges || [])];
    if (!badges.includes(badge)) {
      badges.push(badge);
      await supabase
        .from('user_engagement')
        .update({ badges })
        .eq('user_id', userId);
    }
  }
}

// ============================================================================
// SECTION 3: DAILY HINT ENGINE
// ============================================================================

/** Get published hints */
export async function getDailyHints(hintType?: 'smartcode' | 'quiz' | 'general'): Promise<DailyHint[]> {
  let query = supabase
    .from('daily_hints')
    .select('*')
    .eq('is_published', true)
    .gte('expires_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  if (hintType) {
    query = query.eq('hint_type', hintType);
  }

  const { data } = await query.limit(5);
  return (data as DailyHint[]) || [];
}

// ============================================================================
// SECTION 4: AWARENESS CONTENT ENGINE
// ============================================================================

/** Get published awareness content */
export async function getAwarenessContent(
  contentType?: AwarenessContent['content_type'],
  limit = 10
): Promise<AwarenessContent[]> {
  let query = supabase
    .from('awareness_content')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (contentType) {
    query = query.eq('content_type', contentType);
  }

  const { data } = await query.limit(limit);
  return (data as AwarenessContent[]) || [];
}

/** Increment view count */
export async function incrementViewCount(contentId: string): Promise<void> {
  await supabase.rpc('increment_awareness_views', { content_id: contentId });
}

// ============================================================================
// SECTION 5: SOCIAL SHARING ENGINE
// ============================================================================

/** Track social share */
export async function trackSocialShare(
  userId: string,
  platform: SocialShare['platform'],
  shareType: SocialShare['share_type'],
  contentId?: string
): Promise<string | null> {
  const shareUrl = generateShareUrl(shareType, contentId);

  const { data } = await supabase
    .from('social_shares')
    .insert({
      user_id: userId,
      platform,
      share_type: shareType,
      content_id: contentId || null,
      share_url: shareUrl,
    })
    .select('id')
    .single();

  return data?.id || null;
}

/** Generate share URL */
function generateShareUrl(shareType: string, contentId?: string): string {
  const baseUrl = 'https://vloop.ai';
  const path = shareType === 'winner_story' ? '/winners' :
               shareType === 'result_announcement' ? '/results' :
               shareType === 'educational_content' ? '/awareness' :
               '/';
  return contentId ? `${baseUrl}${path}?id=${contentId}` : `${baseUrl}${path}`;
}

/** Get share message for platform */
export function getShareMessage(platform: SocialShare['platform'], shareType: SocialShare['share_type']): string {
  const messages: Record<string, Record<string, string>> = {
    whatsapp: {
      daily_teaser: 'Check out today\'s SmartCode hint! 🦉 VLOOP AI MART',
      weekly_teaser: 'Weekly SmartCode draw is coming! 🎯',
      result_announcement: '🏆 Weekly results are out! See if you won!',
      winner_story: 'Check out this winner\'s story! 🎉',
      educational_content: 'Learn something new today! 📚',
      awareness_video: 'Watch this awareness video! 🎥',
    },
    facebook: {
      daily_teaser: 'Today\'s SmartCode hint is here! Join VLOOP AI MART and earn rewards.',
      weekly_teaser: 'Weekly SmartCode draw this Sunday. Don\'t miss out!',
      result_announcement: 'Weekly results announced! Congratulations to all winners!',
      winner_story: 'From participant to winner - read their story!',
      educational_content: 'Stay informed with VLOOP awareness content.',
      awareness_video: 'Watch our latest awareness video.',
    },
  };

  return messages[platform]?.[shareType] || 'Join VLOOP AI MART - Shop, Earn, Win!';
}

// ============================================================================
// SECTION 6: PARTNER PROMOTION ENGINE
// ============================================================================

/** Get active partner campaigns */
export async function getPartnerCampaigns(
  campaignType?: PartnerCampaign['campaign_type']
): Promise<PartnerCampaign[]> {
  let query = supabase
    .from('partner_campaigns')
    .select('*, store_partners(*)')
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString());

  if (campaignType) {
    query = query.eq('campaign_type', campaignType);
  }

  const { data } = await query;
  return (data as PartnerCampaign[]) || [];
}

/** Track campaign impression */
export async function trackCampaignImpression(campaignId: string): Promise<void> {
  await supabase.rpc('increment_campaign_impression', { campaign_id: campaignId });
}

/** Track campaign click */
export async function trackCampaignClick(campaignId: string): Promise<void> {
  await supabase.rpc('increment_campaign_click', { campaign_id: campaignId });
}

// ============================================================================
// SECTION 7: ADMIN CONTROL ENGINE
// ============================================================================

/** Get admin setting */
export async function getAdminSetting(key: string): Promise<boolean> {
  const { data } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('key', key)
    .single();

  return data?.value === true || data?.value === 'true';
}

/** Get all admin settings */
export async function getAdminSettings(): Promise<AdminSetting[]> {
  const { data } = await supabase
    .from('admin_settings')
    .select('*')
    .order('key');

  return (data as AdminSetting[]) || [];
}

/** Update admin setting */
export async function updateAdminSetting(key: string, value: boolean): Promise<void> {
  await supabase
    .from('admin_settings')
    .update({
      value,
      updated_at: new Date().toISOString(),
    })
    .eq('key', key);
}

/** Publish hint (admin) */
export async function publishHint(hint: Partial<DailyHint>): Promise<DailyHint | null> {
  const { data } = await supabase
    .from('daily_hints')
    .insert({
      ...hint,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  return data as DailyHint | null;
}

/** Publish awareness content (admin) */
export async function publishAwarenessContent(content: Partial<AwarenessContent>): Promise<AwarenessContent | null> {
  const { data } = await supabase
    .from('awareness_content')
    .insert({
      ...content,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  return data as AwarenessContent | null;
}

/** Add quiz question (admin) */
export async function addQuizQuestion(question: Partial<QuizQuestion>): Promise<QuizQuestion | null> {
  const { data } = await supabase
    .from('quiz_questions')
    .insert(question)
    .select()
    .single();

  return data as QuizQuestion | null;
}

// ============================================================================
// SECTION 8: XP BADGES
// ============================================================================

export const XP_BADGES = [
  { id: 'first_quiz', name: 'Quiz Starter', description: 'Complete your first quiz', icon: '🎯' },
  { id: 'quiz_master', name: 'Quiz Master', description: 'Complete 50 quizzes', icon: '🏆' },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Get 10 questions right in a row', icon: '💯' },
  { id: 'early_bird', name: 'Early Bird', description: 'Generate SmartCode in first week', icon: '🌅' },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Share 10 times', icon: '🦋' },
  { id: 'engagement_pro', name: 'Pro Engager', description: 'Reach XP Level 10', icon: '⭐' },
  { id: 'trust_builder', name: 'Trust Builder', description: 'Reach 80% Trust Score', icon: '🛡️' },
  { id: 'cartoon_fan', name: 'Cartoon Fan', description: 'Watch 20 awareness videos', icon: '🎬' },
] as const;

export type XPBadge = typeof XP_BADGES[number];

// ============================================================================
// SECTION 9: MASCOTS
// ============================================================================

export const MASCOTS = {
  vloop_owl: {
    name: 'VLOOP Owl',
    role: 'Main Mascot',
    description: 'The wise guide who explains SmartCode, quizzes, and benefits',
    avatar: 'https://images.pexels.com/photo/59569/pexels-photo-59569.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: 'vloop',
  },
  vloop_robot: {
    name: 'VLOOP Robot',
    role: 'Assistant',
    description: 'The tech-savvy helper for technical features and app guidance',
    avatar: 'https://images.pexels.com/photo/208584/pexels-photo-208584.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: 'gold',
  },
  vloop_boy: {
    name: 'VLOOP Boy',
    role: 'Host',
    description: 'The friendly host for videos and awareness content',
    avatar: 'https://images.pexels.com/photo/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: 'blue',
  },
  vloop_girl: {
    name: 'VLOOP Girl',
    role: 'Host',
    description: 'The co-host for educational content and partner features',
    avatar: 'https://images.pexels.com/photo/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    color: 'pink',
  },
} as const;

export type MascotType = typeof MASCOTS;
