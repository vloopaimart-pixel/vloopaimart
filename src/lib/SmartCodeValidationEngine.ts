/**
 * VLOOP Enterprise SmartCode Validation Engine
 * ==============================================
 *
 * Comprehensive validation for all SmartCode operations.
 * Supports high-volume entries (100+, 500+, 1000+, 5000+).
 *
 * Validation Types:
 *   - Point validation
 *   - Duplicate validation (within user's entries)
 *   - Purchase validation
 *   - Care Club validation
 *   - User validation
 *   - Weekly eligibility validation
 *
 * Last Updated: Phase 25 - Enterprise Finalization
 */

import { supabase } from './supabase';
import { getCurrentWeekPeriod } from './engagementEngine';
import { PURCHASE_RULES, CARE_CLUB_RULES } from './vloopEngine';

// ============================================================================
// TYPES
// ============================================================================

export type ValidationSeverity = 'error' | 'warning' | 'info';

export type ValidationCode =
  | 'INVALID_CODE_FORMAT'
  | 'INVALID_POINTS'
  | 'INSUFFICIENT_POINTS'
  | 'EXCEEDS_AVAILABLE_POINTS'
  | 'DUPLICATE_ENTRY'
  | 'USER_NOT_FOUND'
  | 'USER_NOT_ELIGIBLE'
  | 'WEEK_CLOSED'
  | 'SOURCE_INVALID'
  | 'PURCHASE_INVALID'
  | 'CARE_CLUB_INVALID'
  | 'BATCH_LIMIT_EXCEEDED'
  | 'VALID';

export type ValidationResult = {
  valid: boolean;
  code: ValidationCode;
  severity: ValidationSeverity;
  message: string;
  details?: Record<string, any>;
};

export type BatchValidationResult = {
  valid: boolean;
  results: ValidationResult[];
  totalValid: number;
  totalInvalid: number;
  totalPoints: number;
  warnings: ValidationResult[];
};

export type SmartCodeEntry = {
  code: string;
  points: number;
  source?: 'purchase' | 'care_club' | 'bonus';
};

export type UserValidationContext = {
  userId: string;
  availablePoints: number;
  purchasePoints: number;
  careClubPoints: number;
  bonusPoints: number;
  weekPeriod: string;
  existingEntries: number;
  isAdmin: boolean;
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const VALIDATION_RULES = {
  /** Minimum points per entry */
  MIN_POINTS_PER_ENTRY: 1,
  /** Maximum points per single entry */
  MAX_POINTS_PER_ENTRY: 10000,
  /** Maximum entries per batch */
  MAX_BATCH_SIZE: 1000,
  /** Maximum total entries per user per week */
  MAX_ENTRIES_PER_WEEK: 5000,
  /** Code range */
  CODE_MIN: 0,
  CODE_MAX: 999,
  /** Code length */
  CODE_LENGTH: 3,
} as const;

// ============================================================================
// CORE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate SmartCode format (000-999)
 */
export function validateCodeFormat(code: string): ValidationResult {
  if (typeof code !== 'string') {
    return {
      valid: false,
      code: 'INVALID_CODE_FORMAT',
      severity: 'error',
      message: 'SmartCode must be a string',
    };
  }

  const trimmed = code.trim();
  const parsed = parseInt(trimmed, 10);

  if (trimmed.length !== VALIDATION_RULES.CODE_LENGTH) {
    return {
      valid: false,
      code: 'INVALID_CODE_FORMAT',
      severity: 'error',
      message: `SmartCode must be exactly ${VALIDATION_RULES.CODE_LENGTH} digits`,
      details: { code: trimmed, length: trimmed.length },
    };
  }

  if (isNaN(parsed)) {
    return {
      valid: false,
      code: 'INVALID_CODE_FORMAT',
      severity: 'error',
      message: 'SmartCode must contain only digits',
      details: { code: trimmed },
    };
  }

  if (parsed < VALIDATION_RULES.CODE_MIN || parsed > VALIDATION_RULES.CODE_MAX) {
    return {
      valid: false,
      code: 'INVALID_CODE_FORMAT',
      severity: 'error',
      message: `SmartCode must be between ${String(VALIDATION_RULES.CODE_MIN).padStart(3, '0')} and ${VALIDATION_RULES.CODE_MAX}`,
      details: { code: trimmed, parsed },
    };
  }

  return {
    valid: true,
    code: 'VALID',
    severity: 'info',
    message: 'Valid SmartCode format',
    details: { code: trimmed, parsed },
  };
}

/**
 * Validate points for a single entry
 */
export function validatePoints(points: number, availablePoints: number): ValidationResult {
  if (typeof points !== 'number' || isNaN(points)) {
    return {
      valid: false,
      code: 'INVALID_POINTS',
      severity: 'error',
      message: 'Points must be a valid number',
    };
  }

  if (points < VALIDATION_RULES.MIN_POINTS_PER_ENTRY) {
    return {
      valid: false,
      code: 'INVALID_POINTS',
      severity: 'error',
      message: `Minimum ${VALIDATION_RULES.MIN_POINTS_PER_ENTRY} point per entry`,
      details: { points, min: VALIDATION_RULES.MIN_POINTS_PER_ENTRY },
    };
  }

  if (points > VALIDATION_RULES.MAX_POINTS_PER_ENTRY) {
    return {
      valid: false,
      code: 'INVALID_POINTS',
      severity: 'error',
      message: `Maximum ${VALIDATION_RULES.MAX_POINTS_PER_ENTRY} points per entry`,
      details: { points, max: VALIDATION_RULES.MAX_POINTS_PER_ENTRY },
    };
  }

  if (!Number.isInteger(points)) {
    return {
      valid: false,
      code: 'INVALID_POINTS',
      severity: 'error',
      message: 'Points must be a whole number',
      details: { points },
    };
  }

  if (points > availablePoints) {
    return {
      valid: false,
      code: 'INSUFFICIENT_POINTS',
      severity: 'error',
      message: `Insufficient points. Available: ${availablePoints}`,
      details: { points, available: availablePoints },
    };
  }

  return {
    valid: true,
    code: 'VALID',
    severity: 'info',
    message: 'Valid points',
    details: { points },
  };
}

/**
 * Validate duplicate SmartCode (warn but allow)
 */
export function validateDuplicate(
  code: string,
  existingCodes: string[]
): ValidationResult {
  const count = existingCodes.filter(c => c === code).length;

  if (count > 0) {
    return {
      valid: true, // Duplicates ARE allowed
      code: 'DUPLICATE_ENTRY',
      severity: 'warning',
      message: `SmartCode ${code} already has ${count} entr${count === 1 ? 'y' : 'ies'}. Duplicates are allowed.`,
      details: { code, existingCount: count },
    };
  }

  return {
    valid: true,
    code: 'VALID',
    severity: 'info',
    message: 'Unique SmartCode entry',
  };
}

/**
 * Validate user eligibility
 */
export async function validateUser(userId: string): Promise<ValidationResult> {
  if (!userId || typeof userId !== 'string') {
    return {
      valid: false,
      code: 'USER_NOT_FOUND',
      severity: 'error',
      message: 'User ID is required',
    };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, is_active, email')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profile) {
    return {
      valid: false,
      code: 'USER_NOT_FOUND',
      severity: 'error',
      message: 'User not found',
      details: { userId },
    };
  }

  if (!(profile as any).is_active) {
    return {
      valid: false,
      code: 'USER_NOT_ELIGIBLE',
      severity: 'error',
      message: 'User account is not active',
      details: { userId },
    };
  }

  return {
    valid: true,
    code: 'VALID',
    severity: 'info',
    message: 'User validated',
    details: { userId },
  };
}

/**
 * Validate weekly eligibility (is the week still open?)
 */
export async function validateWeeklyEligibility(): Promise<ValidationResult> {
  const weekPeriod = getCurrentWeekPeriod();

  // Check if week is still open for entries
  const { data: weekConfig } = await supabase
    .from('admin_settings')
    .select('value')
    .eq('key', `smartcode_week_${weekPeriod}_status`)
    .maybeSingle();

  const weekStatus = weekConfig ? (weekConfig as any).value : 'open';

  if (weekStatus === 'closed') {
    return {
      valid: false,
      code: 'WEEK_CLOSED',
      severity: 'error',
      message: `Week ${weekPeriod} is closed for new entries`,
      details: { weekPeriod, status: weekStatus },
    };
  }

  return {
    valid: true,
    code: 'VALID',
    severity: 'info',
    message: `Week ${weekPeriod} is open for entries`,
    details: { weekPeriod },
  };
}

/**
 * Validate purchase points source
 */
export function validatePurchasePoints(purchaseAmount: number, claimedPoints: number): ValidationResult {
  const expectedPoints = Math.floor(purchaseAmount / PURCHASE_RULES.POINT_RATE);

  if (claimedPoints > expectedPoints) {
    return {
      valid: false,
      code: 'PURCHASE_INVALID',
      severity: 'error',
      message: `Purchase of ₹${purchaseAmount} can only generate ${expectedPoints} points`,
      details: { purchaseAmount, claimedPoints, expectedPoints },
    };
  }

  return {
    valid: true,
    code: 'VALID',
    severity: 'info',
    message: 'Purchase points validated',
    details: { purchaseAmount, points: claimedPoints },
  };
}

/**
 * Validate Care Club points source
 */
export function validateCareClubPoints(contributionAmount: number, claimedPoints: number): ValidationResult {
  const expectedPoints = Math.floor(contributionAmount / CARE_CLUB_RULES.BASE_AMOUNT) * CARE_CLUB_RULES.POINTS_PER_BASE;

  if (claimedPoints > expectedPoints) {
    return {
      valid: false,
      code: 'CARE_CLUB_INVALID',
      severity: 'error',
      message: `Care Club contribution of ₹${contributionAmount} can only generate ${expectedPoints} points`,
      details: { contributionAmount, claimedPoints, expectedPoints },
    };
  }

  return {
    valid: true,
    code: 'VALID',
    severity: 'info',
    message: 'Care Club points validated',
    details: { contributionAmount, points: claimedPoints },
  };
}

// ============================================================================
// BATCH VALIDATION
// ============================================================================

/**
 * Validate a batch of SmartCode entries
 * Optimized for high-volume (100+, 500+, 1000+, 5000+ entries)
 */
export function validateBatch(
  entries: SmartCodeEntry[],
  context: UserValidationContext
): BatchValidationResult {
  const results: ValidationResult[] = [];
  const warnings: ValidationResult[] = [];
  let totalValid = 0;
  let totalInvalid = 0;
  let totalPoints = 0;

  // Check batch size
  if (entries.length > VALIDATION_RULES.MAX_BATCH_SIZE) {
    return {
      valid: false,
      results: [{
        valid: false,
        code: 'BATCH_LIMIT_EXCEEDED',
        severity: 'error',
        message: `Batch size ${entries.length} exceeds maximum ${VALIDATION_RULES.MAX_BATCH_SIZE}`,
        details: { batchSize: entries.length, max: VALIDATION_RULES.MAX_BATCH_SIZE },
      }],
      totalValid: 0,
      totalInvalid: entries.length,
      totalPoints: 0,
      warnings: [],
    };
  }

  // Check total entries for week
  if (context.existingEntries + entries.length > VALIDATION_RULES.MAX_ENTRIES_PER_WEEK) {
    return {
      valid: false,
      results: [{
        valid: false,
        code: 'BATCH_LIMIT_EXCEEDED',
        severity: 'error',
        message: `Total entries would exceed weekly limit of ${VALIDATION_RULES.MAX_ENTRIES_PER_WEEK}`,
        details: {
          existing: context.existingEntries,
          new: entries.length,
          max: VALIDATION_RULES.MAX_ENTRIES_PER_WEEK,
        },
      }],
      totalValid: 0,
      totalInvalid: entries.length,
      totalPoints: 0,
      warnings: [],
    };
  }

  // Collect existing codes for duplicate check
  const existingCodes: string[] = [];

  // Validate each entry
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    // Code format validation
    const codeResult = validateCodeFormat(entry.code);
    if (!codeResult.valid) {
      results.push({ ...codeResult, details: { ...codeResult.details, index: i } });
      totalInvalid++;
      continue;
    }

    // Points validation
    const pointsResult = validatePoints(entry.points, context.availablePoints - totalPoints);
    if (!pointsResult.valid) {
      results.push({ ...pointsResult, details: { ...pointsResult.details, index: i } });
      totalInvalid++;
      continue;
    }

    // Duplicate check (warning, not error)
    const duplicateResult = validateDuplicate(entry.code, existingCodes);
    if (duplicateResult.code === 'DUPLICATE_ENTRY') {
      warnings.push(duplicateResult);
    }

    // Entry is valid
    results.push({
      valid: true,
      code: 'VALID',
      severity: 'info',
      message: `Entry ${i + 1} valid: ${entry.code} = ${entry.points} pts`,
      details: { index: i, code: entry.code, points: entry.points },
    });

    existingCodes.push(entry.code);
    totalValid++;
    totalPoints += entry.points;
  }

  // Check total points match available
  if (totalValid > 0 && totalPoints !== context.availablePoints) {
    warnings.push({
      valid: true,
      code: 'EXCEEDS_AVAILABLE_POINTS',
      severity: 'warning',
      message: `Total allocated points (${totalPoints}) do not equal available points (${context.availablePoints})`,
      details: { totalPoints, availablePoints: context.availablePoints },
    });
  }

  return {
    valid: totalInvalid === 0 && totalPoints === context.availablePoints,
    results,
    totalValid,
    totalInvalid,
    totalPoints,
    warnings,
  };
}

// ============================================================================
// COMPREHENSIVE VALIDATION
// ============================================================================

/**
 * Full validation for SmartCode submission
 */
export async function validateSmartCodeSubmission(
  userId: string,
  entries: SmartCodeEntry[],
  context?: Partial<UserValidationContext>
): Promise<{ valid: boolean; errors: ValidationResult[]; warnings: ValidationResult[]; context?: UserValidationContext }> {
  const errors: ValidationResult[] = [];
  const warnings: ValidationResult[] = [];

  // 1. User validation
  const userResult = await validateUser(userId);
  if (!userResult.valid) {
    errors.push(userResult);
    return { valid: false, errors, warnings };
  }

  // 2. Weekly eligibility
  const weeklyResult = await validateWeeklyEligibility();
  if (!weeklyResult.valid) {
    errors.push(weeklyResult);
    return { valid: false, errors, warnings };
  }

  // 3. Build context if not provided
  let validationContext: UserValidationContext;
  if (context?.availablePoints !== undefined) {
    validationContext = {
      userId,
      availablePoints: context.availablePoints,
      purchasePoints: context.purchasePoints || context.availablePoints,
      careClubPoints: context.careClubPoints || 0,
      bonusPoints: context.bonusPoints || 0,
      weekPeriod: context.weekPeriod || getCurrentWeekPeriod(),
      existingEntries: context.existingEntries || 0,
      isAdmin: context.isAdmin || false,
    };
  } else {
    // Fetch from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .maybeSingle();

    const { count } = await supabase
      .from('smartcode_allocations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('week_period', getCurrentWeekPeriod())
      .eq('is_active', true);

    validationContext = {
      userId,
      availablePoints: (profile as any)?.points || 0,
      purchasePoints: (profile as any)?.points || 0,
      careClubPoints: 0,
      bonusPoints: 0,
      weekPeriod: getCurrentWeekPeriod(),
      existingEntries: count || 0,
      isAdmin: false,
    };
  }

  // 4. Batch validation
  const batchResult = validateBatch(entries, validationContext);
  if (!batchResult.valid) {
    errors.push(...batchResult.results.filter(r => !r.valid));
  }
  warnings.push(...batchResult.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    context: validationContext,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize SmartCode string (pad with zeros)
 */
export function normalizeSmartCode(code: string | number): string {
  if (typeof code === 'number') {
    return String(code).padStart(3, '0');
  }
  return String(code).trim().padStart(3, '0').slice(-3);
}

/**
 * Parse SmartCode from various input formats
 */
export function parseSmartCode(input: string | number): string | null {
  const normalized = normalizeSmartCode(input);
  const result = validateCodeFormat(normalized);
  return result.valid ? normalized : null;
}

/**
 * Calculate total points from entries
 */
export function calculateTotalPoints(entries: SmartCodeEntry[]): number {
  return entries.reduce((sum, e) => sum + e.points, 0);
}

/**
 * Check if entries exactly match available points
 */
export function arePointsFullyAllocated(entries: SmartCodeEntry[], available: number): boolean {
  return calculateTotalPoints(entries) === available;
}

export default {
  validateCodeFormat,
  validatePoints,
  validateDuplicate,
  validateUser,
  validateWeeklyEligibility,
  validatePurchasePoints,
  validateCareClubPoints,
  validateBatch,
  validateSmartCodeSubmission,
  normalizeSmartCode,
  parseSmartCode,
  calculateTotalPoints,
  arePointsFullyAllocated,
  VALIDATION_RULES,
};
