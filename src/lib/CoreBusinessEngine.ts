/**
 * ============================================================================
 * VLOOP CORE BUSINESS ENGINE
 * ============================================================================
 *
 * PHASE 27.5 — Permanent Enterprise Business Rules
 *
 * This is the IMMUTABLE single source of truth for every calculation,
 * rule, constant, and validation in the entire VLOOP platform.
 *
 * Every module MUST import from here. No module may calculate points,
 * wallets, or rewards independently.
 *
 * Modules bound to this engine:
 *   • SmartCode Engine (AI Auto + Manual)
 *   • Weekly Reward Engine
 *   • OCR Registration
 *   • Voice Registration (future)
 *   • WhatsApp Registration (future)
 *   • Analytics
 *   • Admin Dashboard
 *   • All future AI modules
 *
 * LOCKED RULES (do not modify without version bump):
 *   Purchase:   ₹40 minimum → 1 SmartPoint per ₹40
 *   Care Club:  ₹10 minimum → 5 SmartPoints per ₹10
 *   Wallet 2:   2% of purchase + 5% of Care Club → 30-day lock
 *   Wallet 1:   Credit ONLY after winning (admin-approved)
 *   SmartCode:  000–999 (3 digits), duplicates allowed, unlimited entries
 *
 * Version: 27.5.0
 * ============================================================================
 */

// ============================================================================
// ENGINE VERSION
// ============================================================================

export const ENGINE_VERSION = '27.5.0' as const;

export const ENGINE_META = {
  version: ENGINE_VERSION,
  name: 'VLOOP Core Business Engine',
  lockedSince: '2026-07-01',
} as const;

// ============================================================================
// SECTION 1 — PURCHASE ENGINE
// ============================================================================

/**
 * LOCKED RULE: ₹40 purchase = 1 SmartPoint
 *
 * Minimum purchase: ₹40
 * Formula: floor(amount / 40)
 *
 * Examples:
 *   ₹40  → 1 pt
 *   ₹80  → 2 pts
 *   ₹400 → 10 pts
 *   ₹2000 → 50 pts
 */
export const PURCHASE_RULES = {
  /** Minimum purchase amount in rupees */
  MINIMUM_AMOUNT: 40,
  /** Rupees required per SmartPoint */
  POINT_RATE: 40,
  /** Wallet 2 credit percentage of purchase amount */
  WALLET2_PERCENTAGE: 2,
} as const;

/** Calculate SmartPoints earned from a purchase */
export function calcPurchasePoints(amount: number): number {
  if (amount < PURCHASE_RULES.MINIMUM_AMOUNT) return 0;
  return Math.floor(amount / PURCHASE_RULES.POINT_RATE);
}

/** Calculate Wallet 2 credit from a purchase (2%) */
export function calcWallet2FromPurchase(amount: number): number {
  if (amount <= 0) return 0;
  return Math.floor((amount * PURCHASE_RULES.WALLET2_PERCENTAGE) / 100);
}

// ============================================================================
// SECTION 2 — CARE CLUB ENGINE
// ============================================================================

/**
 * LOCKED RULE: ₹10 contribution = 5 SmartPoints
 *
 * Minimum contribution: ₹10
 * Formula: floor(amount / 10) × 5
 *
 * NOTE: Different from purchase formula. Do NOT mix.
 *
 * Examples:
 *   ₹10  → 5 pts
 *   ₹20  → 10 pts
 *   ₹40  → 20 pts
 *   ₹100 → 50 pts
 */
export const CARE_CLUB_RULES = {
  /** Minimum contribution amount in rupees */
  MINIMUM_CONTRIBUTION: 10,
  /** Base rupee amount for point calculation */
  BASE_AMOUNT: 10,
  /** SmartPoints earned per base amount */
  POINTS_PER_BASE: 5,
  /** Wallet 2 credit percentage of contribution */
  WALLET2_PERCENTAGE: 5,
} as const;

/** Calculate SmartPoints earned from a Care Club contribution */
export function calcCareClubPoints(amount: number): number {
  if (amount < CARE_CLUB_RULES.MINIMUM_CONTRIBUTION) return 0;
  return Math.floor(amount / CARE_CLUB_RULES.BASE_AMOUNT) * CARE_CLUB_RULES.POINTS_PER_BASE;
}

/** Calculate Wallet 2 credit from a Care Club contribution (5%) */
export function calcWallet2FromCareClub(amount: number): number {
  if (amount <= 0) return 0;
  return Math.floor((amount * CARE_CLUB_RULES.WALLET2_PERCENTAGE) / 100);
}

// ============================================================================
// SECTION 3 — WALLET 2 ENGINE
// ============================================================================

/**
 * LOCKED RULE:
 *   Wallet 2 = (Purchase × 2%) + (Care Club × 5%)
 *   Lock period: 30 days
 *   Activation: Automatic after lock period
 */
export const WALLET2_RULES = {
  /** Lock period in days before Wallet 2 activates */
  LOCK_PERIOD_DAYS: 30,
} as const;

/** Calculate total Wallet 2 credit for a transaction */
export function calcWallet2TotalCredit(purchaseAmount: number, careClubAmount: number): number {
  return calcWallet2FromPurchase(purchaseAmount) + calcWallet2FromCareClub(careClubAmount);
}

/** Calculate Wallet 2 activation date (30 days from transaction) */
export function calcWallet2ActivationDate(fromDate?: Date): string {
  const base = fromDate ?? new Date();
  const activation = new Date(base);
  activation.setDate(activation.getDate() + WALLET2_RULES.LOCK_PERIOD_DAYS);
  return activation.toISOString();
}

/** Returns true if Wallet 2 lock period has passed */
export function isWallet2Unlocked(activationDate: string | null): boolean {
  if (!activationDate) return false;
  return new Date(activationDate) <= new Date();
}

// ============================================================================
// SECTION 4 — WALLET 1 ENGINE
// ============================================================================

/**
 * LOCKED RULE:
 *   Wallet 1 receives credit ONLY after winning in Weekly SmartCode Program.
 *   NO instant credit after purchase.
 *
 * Flow:
 *   Purchase → SmartPoints → Weekly Challenge → Win → Admin Approval → Wallet 1
 */
export const WALLET1_RULES = {
  /** Credit only happens after winning — never on purchase */
  CREDIT_ON_WINNING_ONLY: true,
  /** Days after admin approval before credit is available (0 = immediate) */
  CREDIT_DELAY_DAYS: 0,
} as const;

/** Credit Wallet 1 after winning (use ONLY in reward flow, never on purchase) */
export function calcWallet1WinCredit(winningAmount: number): number {
  return winningAmount > 0 ? winningAmount : 0;
}

// ============================================================================
// SECTION 5 — SMARTPOINT COMBINED ENGINE
// ============================================================================

/** Total SmartPoints from both sources */
export function calcTotalSmartPoints(purchaseAmount: number, careClubAmount: number): number {
  return calcPurchasePoints(purchaseAmount) + calcCareClubPoints(careClubAmount);
}

/** Check if user has enough points for SmartCode participation */
export function isSmartCodeEligible(points: number): boolean {
  return points >= 1;
}

/** Check if a purchase amount meets the minimum */
export function isPurchaseValid(amount: number): boolean {
  return amount >= PURCHASE_RULES.MINIMUM_AMOUNT;
}

/** Check if a Care Club contribution meets the minimum */
export function isCareClubContributionValid(amount: number): boolean {
  return amount >= CARE_CLUB_RULES.MINIMUM_CONTRIBUTION;
}

// ============================================================================
// SECTION 6 — SMARTCODE ENGINE
// ============================================================================

/**
 * LOCKED RULE:
 *   Valid codes: 000–999 (3 digits, zero-padded)
 *   Duplicates allowed (multiple users can hold same code)
 *   Multiple entries for same code allowed per user
 *   Unlimited entries per week
 */
export const SMARTCODE_RULES = {
  CODE_MIN: 0,
  CODE_MAX: 999,
  CODE_LENGTH: 3,
  ALLOW_DUPLICATE_CODES: true,
  ALLOW_MULTIPLE_ENTRIES: true,
} as const;

/** Normalize a raw code string to zero-padded 3-digit format */
export function normalizeSmartCode(raw: string | number): string {
  return String(typeof raw === 'number' ? raw : parseInt(raw, 10) || 0)
    .padStart(SMARTCODE_RULES.CODE_LENGTH, '0')
    .slice(-SMARTCODE_RULES.CODE_LENGTH);
}

/** Returns true if the code is a valid 3-digit SmartCode */
export function isValidSmartCode(code: string): boolean {
  const n = parseInt(code, 10);
  return (
    code.length === SMARTCODE_RULES.CODE_LENGTH &&
    !isNaN(n) &&
    n >= SMARTCODE_RULES.CODE_MIN &&
    n <= SMARTCODE_RULES.CODE_MAX
  );
}

/** Generate a random SmartCode */
export function generateSmartCode(): string {
  return String(Math.floor(Math.random() * (SMARTCODE_RULES.CODE_MAX + 1))).padStart(3, '0');
}

// ============================================================================
// SECTION 7 — WEEKLY REWARD ENGINE
// ============================================================================

/**
 * LOCKED RULE:
 *   Reward tiers: Standard (1×), Premium (2×), Prime (4×)
 *   AI Weekly Reward Engine assigns pools automatically.
 *   Admin cannot manually select winners.
 */
export const REWARD_CATEGORIES = {
  prime:    { label: 'Prime Reward',    multiplier: 4, color: 'gold' },
  premium:  { label: 'Premium Reward',  multiplier: 2, color: 'blue' },
  standard: { label: 'Standard Reward', multiplier: 1, color: 'gray' },
} as const;

export type RewardCategory = keyof typeof REWARD_CATEGORIES;

/**
 * Reward Tier Table
 * Standard × 1 = Standard, × 2 = Premium, × 4 = Prime
 */
export const REWARD_TIER_TABLE = [
  { points: 1,   standard: 100,   premium: 200,   prime: 400   },
  { points: 5,   standard: 500,   premium: 1000,  prime: 2000  },
  { points: 10,  standard: 1000,  premium: 2000,  prime: 4000  },
  { points: 25,  standard: 2500,  premium: 5000,  prime: 10000 },
  { points: 50,  standard: 5000,  premium: 10000, prime: 20000 },
  { points: 100, standard: 10000, premium: 20000, prime: 40000 },
  { points: 200, standard: 20000, premium: 40000, prime: 80000 },
] as const;

/** Get the highest qualifying reward tier for a given point count */
export function getRewardTier(points: number): typeof REWARD_TIER_TABLE[number] {
  for (let i = REWARD_TIER_TABLE.length - 1; i >= 0; i--) {
    if (points >= REWARD_TIER_TABLE[i].points) return REWARD_TIER_TABLE[i];
  }
  return REWARD_TIER_TABLE[0];
}

/** Get benefit amount for a specific reward category */
export function getBenefitAmount(points: number, category: RewardCategory): number {
  return getRewardTier(points)[category];
}

/** Get all tier benefits for display */
export function getAllTierBenefits(points: number): { standard: number; premium: number; prime: number } {
  const tier = getRewardTier(points);
  return { standard: tier.standard, premium: tier.premium, prime: tier.prime };
}

// ============================================================================
// SECTION 8 — ADMIN ENGINE
// ============================================================================

export const ADMIN_STATUS = {
  PENDING:   'pending',
  APPROVED:  'approved',
  REJECTED:  'rejected',
  DISBURSED: 'disbursed',
} as const;

export type WinnerStatus = typeof ADMIN_STATUS[keyof typeof ADMIN_STATUS];

export const COMPANY_RULES = {
  /** Percentage reserved for company operations */
  RESERVE_PERCENTAGE: 10,
} as const;

export function calcCompanyReserve(totalDistribution: number): number {
  return Math.floor((totalDistribution * COMPANY_RULES.RESERVE_PERCENTAGE) / 100);
}

// ============================================================================
// SECTION 9 — QUIZ ENGINE
// ============================================================================

export const QUIZ_RULES = {
  SKIP_ENABLED: true,
  DEFAULT_QUESTIONS: 1,
  QUESTION_OPTIONS: [1, 5, 10] as const,
} as const;

export const QUIZ_CATEGORIES = [
  'Shopping',
  'Consumer Awareness',
  'Health',
  'Insurance',
  'VLOOP',
  'Partner Offers',
] as const;

export type QuizCategory = typeof QUIZ_CATEGORIES[number];

// ============================================================================
// SECTION 10 — TRANSACTION ENGINE
// ============================================================================

export type TransactionBreakdown = {
  // Inputs
  purchaseAmount: number;
  careClubAmount: number;

  // SmartPoints
  purchasePoints: number;
  careClubPoints: number;
  totalPoints: number;

  // Wallet 2 (immediate, locked 30 days)
  wallet2FromPurchase: number;
  wallet2FromCareClub: number;
  wallet2Total: number;
  wallet2ActivationDate: string;

  // Wallet 1 (ONLY credited after winning — always 0 at purchase time)
  wallet1Credit: 0;

  // Eligibility
  smartCodeEligible: boolean;

  // Reward tiers (for display)
  standardBenefit: number;
  premiumBenefit: number;
  primeBenefit: number;
};

/**
 * Calculate complete transaction breakdown.
 * This is the ONLY function that may compose purchase + Care Club calculations.
 */
export function calculateTransaction(
  purchaseAmount: number,
  careClubAmount: number = 0
): TransactionBreakdown {
  const purchasePoints    = calcPurchasePoints(purchaseAmount);
  const careClubPoints    = calcCareClubPoints(careClubAmount);
  const totalPoints       = purchasePoints + careClubPoints;

  const wallet2FromPurchase  = calcWallet2FromPurchase(purchaseAmount);
  const wallet2FromCareClub  = calcWallet2FromCareClub(careClubAmount);
  const wallet2Total         = wallet2FromPurchase + wallet2FromCareClub;
  const wallet2ActivationDate = calcWallet2ActivationDate();

  const tier = getRewardTier(totalPoints);

  return {
    purchaseAmount,
    careClubAmount,
    purchasePoints,
    careClubPoints,
    totalPoints,
    wallet2FromPurchase,
    wallet2FromCareClub,
    wallet2Total,
    wallet2ActivationDate,
    wallet1Credit: 0,           // NEVER credited at purchase time
    smartCodeEligible: isSmartCodeEligible(totalPoints),
    standardBenefit: tier.standard,
    premiumBenefit:  tier.premium,
    primeBenefit:    tier.prime,
  };
}

// ============================================================================
// SECTION 11 — VALIDATION ENGINE
// ============================================================================

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

/** Validate a purchase before processing */
export function validatePurchase(amount: number): ValidationResult {
  const errors: string[] = [];
  if (amount <= 0)                                  errors.push('Purchase amount must be positive');
  if (amount < PURCHASE_RULES.MINIMUM_AMOUNT)       errors.push(`Minimum purchase is ₹${PURCHASE_RULES.MINIMUM_AMOUNT}`);
  if (!Number.isFinite(amount))                     errors.push('Purchase amount must be a valid number');
  return { valid: errors.length === 0, errors };
}

/** Validate a Care Club contribution before processing */
export function validateCareClubContribution(amount: number): ValidationResult {
  const errors: string[] = [];
  if (amount < 0)                                            errors.push('Contribution cannot be negative');
  if (amount > 0 && amount < CARE_CLUB_RULES.MINIMUM_CONTRIBUTION)
    errors.push(`Minimum Care Club contribution is ₹${CARE_CLUB_RULES.MINIMUM_CONTRIBUTION}`);
  if (!Number.isFinite(amount))                              errors.push('Contribution must be a valid number');
  return { valid: errors.length === 0, errors };
}

/** Validate a SmartCode allocation (code + points, against available balance) */
export function validateSmartCodeAllocation(
  code: string,
  points: number,
  availablePoints: number
): ValidationResult {
  const errors: string[] = [];
  if (!isValidSmartCode(normalizeSmartCode(code)))  errors.push(`Invalid SmartCode: ${code} (must be 000–999)`);
  if (!Number.isInteger(points) || points < 1)      errors.push('Points must be a positive whole number');
  if (points > availablePoints)                     errors.push(`Insufficient points (have ${availablePoints}, need ${points})`);
  return { valid: errors.length === 0, errors };
}

/** Validate full transaction inputs */
export function validateTransaction(purchaseAmount: number, careClubAmount: number): ValidationResult {
  const purchaseCheck  = validatePurchase(purchaseAmount);
  const careClubCheck  = careClubAmount > 0 ? validateCareClubContribution(careClubAmount) : { valid: true, errors: [] };
  const errors = [...purchaseCheck.errors, ...careClubCheck.errors];
  return { valid: errors.length === 0, errors };
}

// ============================================================================
// SECTION 12 — INTEGRITY GUARDS
// ============================================================================

/**
 * Guards to prevent duplicate point generation, negative balances,
 * and invalid calculations at the application layer.
 * Database-level enforcement is handled in migration 056.
 */

/** Ensure points never go negative */
export function guardNonNegativePoints(current: number, delta: number): number {
  return Math.max(0, current + delta);
}

/** Ensure wallet balance never goes negative */
export function guardNonNegativeBalance(balance: number, debit: number): {
  allowed: boolean;
  newBalance: number;
} {
  if (debit > balance) return { allowed: false, newBalance: balance };
  return { allowed: true, newBalance: balance - debit };
}

/** Check for duplicate SmartCode allocation in a list */
export function hasDuplicateAllocation(
  existing: Array<{ code: string; points: number }>,
  newCode: string,
  newPoints: number
): boolean {
  // Duplicates are ALLOWED per business rules — this checks for exact duplicates
  // (same code AND same points in same submission) which may indicate a double-submit
  return existing.some(e => e.code === newCode && e.points === newPoints);
}

// ============================================================================
// SECTION 13 — WEEK PERIOD ENGINE
// ============================================================================

/** Returns the current ISO week identifier as YYYY-WW */
export function getCurrentWeekPeriod(): string {
  const now = new Date();
  const jan4 = new Date(now.getFullYear(), 0, 4);
  const weekNum = Math.ceil(((now.getTime() - jan4.getTime()) / 86400000 + jan4.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

/** Get the start and end dates for a given week period (YYYY-WW) */
export function getWeekDateRange(period: string): { start: Date; end: Date } {
  const [year, week] = period.split('-W').map(Number);
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return { start: weekStart, end: weekEnd };
}

// ============================================================================
// SECTION 14 — REFERRAL ENGINE
// ============================================================================

export const REFERRAL_RULES = {
  /** SmartPoints earned per confirmed referral */
  BONUS_POINTS: 5,
} as const;

export function calcReferralPoints(confirmedReferrals: number): number {
  return confirmedReferrals * REFERRAL_RULES.BONUS_POINTS;
}

// ============================================================================
// SECTION 15 — POINT VALUE ENGINE
// ============================================================================

/**
 * 1 SmartPoint display value (informational only).
 * Wallet 1 credit is reward-tier-based, not a fixed per-point rate.
 */
export const POINT_DISPLAY_VALUE = {
  /** Approximate display value per point in rupees */
  APPROX_VALUE_INR: 2,
} as const;

export function calcApproxPointValue(points: number): number {
  return points * POINT_DISPLAY_VALUE.APPROX_VALUE_INR;
}
