/**
 * VLOOP Calculations — Compatibility Shim
 * =========================================
 *
 * This file previously contained conflicting/deprecated business rules.
 * Phase 27.5: All logic now delegates to CoreBusinessEngine.ts.
 *
 * DO NOT add new calculations here.
 * Import from CoreBusinessEngine.ts or vloopEngine.ts instead.
 */

import {
  PURCHASE_RULES,
  CARE_CLUB_RULES,
  REFERRAL_RULES,
  REWARD_TIER_TABLE,
  getRewardTier,
  getAllTierBenefits,
  calcPurchasePoints,
  calcCareClubPoints,
} from './CoreBusinessEngine';

// ============================================================================
// BACKWARD-COMPAT CONSTANTS
// Kept so existing imports don't break; values now match CoreBusinessEngine.
// ============================================================================

/**
 * @deprecated Use PURCHASE_RULES and CARE_CLUB_RULES from CoreBusinessEngine.
 */
export const POINT_RULES = {
  PURCHASE_RATE: PURCHASE_RULES.POINT_RATE,
  /** Kept for code that reads this; correct rule is now ₹10 = 5 pts */
  CARE_CLUB_RATE: CARE_CLUB_RULES.BASE_AMOUNT,
} as const;

/**
 * @deprecated Wallet multipliers are no longer fixed per-point values.
 * Wallet 1 is reward-tier-based; Wallet 2 is percentage-based.
 * Kept as 0 to prevent silent wrong calculations.
 */
export const WALLET_RULES = {
  WALLET_1_MULTIPLIER: 0, // Wallet 1 only credited on winning, not per-point
  WALLET_2_MULTIPLIER: 0, // Wallet 2 is percentage-based, not per-point
} as const;

/**
 * @deprecated Hardcoded default replaced by CARE_CLUB_RULES.MINIMUM_CONTRIBUTION.
 */
export const CARE_CLUB_DEFAULT = CARE_CLUB_RULES.MINIMUM_CONTRIBUTION;

/**
 * SmartPoints earned per confirmed referral.
 */
export const REFERRAL_BONUS_POINTS = REFERRAL_RULES.BONUS_POINTS;

// ============================================================================
// BACKWARD-COMPAT TYPES & FUNCTIONS
// ============================================================================

export type RewardTier = 'standard' | 'premium' | 'prime';

export type RewardTierRow = {
  points: number;
  standard: number;
  premium: number;
  prime: number;
};

/**
 * @deprecated Use REWARD_TIER_TABLE from CoreBusinessEngine.
 */
export { REWARD_TIER_TABLE };

/**
 * @deprecated Use getRewardTier() from CoreBusinessEngine.
 */
export function getRewardLevel(points: number): { tier: RewardTier; label: string; amount: number } {
  const row = getRewardTier(points);
  return {
    tier: 'standard',
    label: `₹${row.standard.toLocaleString('en-IN')}`,
    amount: row.standard,
  };
}

/**
 * @deprecated Use getAllTierBenefits() from CoreBusinessEngine.
 */
export { getAllTierBenefits };

/**
 * @deprecated Use calcPurchasePoints() from CoreBusinessEngine.
 */
export { calcPurchasePoints };

/**
 * @deprecated Use calcCareClubPoints() from CoreBusinessEngine.
 * Old rule (₹20 = 1 pt) is gone — this now uses the correct rule (₹10 = 5 pts).
 */
export { calcCareClubPoints };

/**
 * @deprecated Wallet 1 is NEVER credited per-point. Returns 0.
 */
export function calcWallet1Credit(_points: number): number {
  return 0;
}

/**
 * @deprecated Wallet 2 is percentage-based. Returns 0 here.
 * Use calcWallet2TotalCredit() from CoreBusinessEngine.
 */
export function calcWallet2Credit(_points: number): number {
  return 0;
}

/**
 * @deprecated Use calculateTransaction() from CoreBusinessEngine.
 */
export type TransactionBreakdown = {
  purchaseAmount: number;
  careClubContribution: number;
  totalPayment: number;
  purchasePoints: number;
  careClubPoints: number;
  totalPoints: number;
  wallet1Credit: number;
  wallet2Credit: number;
  totalWalletCredit: number;
  standardBenefit: number;
  premiumBenefit: number;
  primeBenefit: number;
  smartCodeEligible: boolean;
  referralBonus: number;
  totalMemberValue: number;
  isBalanced: boolean;
  balanceCheck: string;
};

export function isSmartCodeEligible(points: number): boolean {
  return points >= 1;
}

export type BenefitEstimate = {
  points: number;
  wallet1Credit: number;
  wallet2Credit: number;
  estimatedBenefit: string;
};

/**
 * @deprecated Use estimateBenefits() from points.ts instead.
 */
export function estimateBenefits(activity: 'purchase' | 'careclub', amount: number): BenefitEstimate {
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

  return { points, wallet1Credit: 0, wallet2Credit: 0, estimatedBenefit };
}

export function validateCalculation(
  actual: number,
  expected: number,
  label: string
): { valid: boolean; actual: number; expected: number; label: string } {
  return { valid: actual === expected, actual, expected, label };
}
