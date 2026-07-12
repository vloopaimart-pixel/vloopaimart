/**
 * VLOOP Enterprise Business Engine
 * ================================
 *
 * DELEGATES ALL CALCULATIONS to CoreBusinessEngine.ts.
 * This file is kept for backward compatibility of existing imports.
 *
 * Single Source of Truth: src/lib/CoreBusinessEngine.ts
 *
 * Last Updated: Phase 27.5 - Core Business Engine
 */

export {
  // Engine meta
  ENGINE_VERSION,
  ENGINE_META,

  // Purchase
  PURCHASE_RULES,
  calcPurchasePoints,
  calcWallet2FromPurchase,

  // Care Club
  CARE_CLUB_RULES,
  calcCareClubPoints,
  calcWallet2FromCareClub,

  // Wallet 2
  WALLET2_RULES,
  calcWallet2TotalCredit,
  calcWallet2ActivationDate,
  isWallet2Unlocked,

  // Wallet 1
  WALLET1_RULES,
  calcWallet1WinCredit,

  // SmartPoints
  calcTotalSmartPoints,
  isSmartCodeEligible,
  isPurchaseValid,
  isCareClubContributionValid,

  // SmartCode
  SMARTCODE_RULES,
  normalizeSmartCode,
  isValidSmartCode,
  generateSmartCode,

  // Rewards
  REWARD_CATEGORIES,
  REWARD_TIER_TABLE,
  getRewardTier,
  getBenefitAmount,
  getAllTierBenefits,
  type RewardCategory,

  // Admin
  ADMIN_STATUS,
  COMPANY_RULES,
  calcCompanyReserve,
  type WinnerStatus,

  // Quiz
  QUIZ_RULES,
  QUIZ_CATEGORIES,
  type QuizCategory,

  // Transaction
  calculateTransaction,
  type TransactionBreakdown,

  // Validation
  validatePurchase,
  validateCareClubContribution,
  validateSmartCodeAllocation,
  validateTransaction,
  type ValidationResult,

  // Integrity guards
  guardNonNegativePoints,
  guardNonNegativeBalance,
  hasDuplicateAllocation,

  // Week
  getCurrentWeekPeriod,
  getWeekDateRange,

  // Referral
  REFERRAL_RULES,
  calcReferralPoints,

  // Point value
  POINT_DISPLAY_VALUE,
  calcApproxPointValue,
} from './CoreBusinessEngine';
