/**
 * VLOOP Points Module
 * ====================
 *
 * Re-exports from CoreBusinessEngine — the PERMANENT single source of truth.
 * All modules should import from here for backward compatibility.
 *
 * LOCKED BUSINESS RULES (Phase 27.5):
 *   Purchase:   ₹40 minimum → 1 SmartPoint per ₹40 → 2% to Wallet 2
 *   Care Club:  ₹10 minimum → 5 SmartPoints per ₹10 → 5% to Wallet 2
 *   Wallet 2:   Locked 30 days → auto-activates
 *   Wallet 1:   ONLY credited after winning (never at purchase time)
 *   SmartCode:  000–999, duplicates allowed, unlimited entries
 */

export {
  // Engine meta
  ENGINE_VERSION,
  ENGINE_META,

  // Purchase Engine
  PURCHASE_RULES,
  calcPurchasePoints,
  calcWallet2FromPurchase,
  isPurchaseValid,

  // Care Club Engine
  CARE_CLUB_RULES,
  calcCareClubPoints,
  calcWallet2FromCareClub,
  isCareClubContributionValid,

  // Wallet 2 Engine
  WALLET2_RULES,
  calcWallet2TotalCredit,
  calcWallet2ActivationDate,
  isWallet2Unlocked,

  // Wallet 1 Engine
  WALLET1_RULES,
  calcWallet1WinCredit,

  // SmartPoint Combined
  calcTotalSmartPoints,
  isSmartCodeEligible,

  // SmartCode Engine
  SMARTCODE_RULES,
  normalizeSmartCode,
  isValidSmartCode,
  generateSmartCode,

  // Weekly Reward Engine
  REWARD_CATEGORIES,
  REWARD_TIER_TABLE,
  getRewardTier,
  getBenefitAmount,
  getAllTierBenefits,
  type RewardCategory,

  // Admin Engine
  ADMIN_STATUS,
  COMPANY_RULES,
  calcCompanyReserve,
  type WinnerStatus,

  // Quiz Engine
  QUIZ_RULES,
  QUIZ_CATEGORIES,
  type QuizCategory,

  // Transaction Engine
  calculateTransaction,
  validateTransaction,
  type TransactionBreakdown,

  // Validation Engine
  validatePurchase,
  validateCareClubContribution,
  validateSmartCodeAllocation,
  type ValidationResult,

  // Integrity Guards
  guardNonNegativePoints,
  guardNonNegativeBalance,
  hasDuplicateAllocation,

  // Week Engine
  getCurrentWeekPeriod,
  getWeekDateRange,

  // Referral Engine
  REFERRAL_RULES,
  calcReferralPoints,

  // Point Value Engine
  POINT_DISPLAY_VALUE,
  calcApproxPointValue,
} from './CoreBusinessEngine';

// Legacy compatibility exports that points.ts previously pulled from vloopCalculations
export {
  POINT_RULES,
  WALLET_RULES,
  CARE_CLUB_DEFAULT,
  REFERRAL_BONUS_POINTS,
} from './vloopCalculations';

// ============================================================================
// estimateBenefits — kept as a named export for backward compatibility
// ============================================================================

import {
  calcPurchasePoints,
  calcCareClubPoints,
  getRewardTier,
} from './CoreBusinessEngine';

export function estimateBenefits(
  activity: 'purchase' | 'careclub',
  amount: number
): {
  points: number;
  wallet1Credit: number;
  wallet2Credit: number;
  estimatedBenefit: string;
} {
  const points = activity === 'purchase'
    ? calcPurchasePoints(amount)
    : calcCareClubPoints(amount);

  const tier = getRewardTier(points);

  let estimatedBenefit = 'Standard tier benefits available';
  if (points >= 200) estimatedBenefit = 'Prime tier — up to ₹80,000 benefit claim';
  else if (points >= 100) estimatedBenefit = 'Prime tier — up to ₹40,000 benefit claim';
  else if (points >= 50)  estimatedBenefit = 'Premium tier — up to ₹20,000 benefit claim';
  else if (points >= 25)  estimatedBenefit = 'Premium tier — up to ₹10,000 benefit claim';
  else if (points >= 10)  estimatedBenefit = 'Standard tier — up to ₹4,000 benefit claim';
  else if (points >= 5)   estimatedBenefit = 'Standard tier — up to ₹2,000 benefit claim';
  else if (points >= 1)   estimatedBenefit = `Standard tier — up to ₹${tier.standard} benefit claim`;

  return {
    points,
    wallet1Credit: 0, // Wallet 1 never credited at purchase time
    wallet2Credit: 0, // Wallet 2 is percentage-based, not returned here
    estimatedBenefit,
  };
}
