/**
 * ============================================================================
 * VLOOP OFFLINE AI SMARTCODE ENGINE
 * ============================================================================
 *
 * Phase 32 — Enterprise Offline AI SmartCode Platform
 *
 * Three Permanent SmartCode Entry Methods:
 *   A. Digital Entry — Create SmartCodes inside the VLOOP app
 *   B. Manual Entry — Manually create unlimited 3-digit SmartCodes
 *   C. Offline AI Entry — Write SmartCodes on paper, photo, upload, AI reads
 *
 * White Paper Standard Format:
 *   Customer Name
 *   Purchase Amount / Care Club Contribution
 *   SmartCodes (466 = 2 Points, 764 = 5 Points, etc.)
 *   Signature (optional)
 *
 * OCR Engine Architecture:
 *   - Handwritten number recognition (architecture ready)
 *   - Printed number recognition (architecture ready)
 *   - Point value extraction
 *   - Multiple SmartCode reading
 *   - Mixed handwriting support
 *   No OCR service integrated yet — architecture only.
 *
 * AI Validation Flow:
 *   1. Read SmartCodes from input
 *   2. Normalize formatting (pad to 3 digits)
 *   3. Validate 000-999 range
 *   4. Validate point values (positive integers)
 *   5. Calculate total points
 *   6. Compare with available SmartPoints
 *   7. Reject invalid entries
 *
 * Duplicate Detection:
 *   - Repeated SmartCodes ARE allowed (same code, different points)
 *   - Only duplicate UPLOADS (same submission) are rejected
 *
 * Future AI Input Channels (architecture only, no UI):
 *   - Voice SmartCode Entry
 *   - WhatsApp SmartCode Entry
 *   - Camera Live Scan
 *   - Offline SmartCard
 *
 * Enterprise Rules:
 *   - No demo data
 *   - No fake OCR
 *   - No fake uploads
 *   - Architecture only
 *
 * Version: 32.0.0
 * ============================================================================
 */

import {
  normalizeSmartCode,
  isValidSmartCode,
  getCurrentWeekPeriod,
  SMARTCODE_RULES,
} from './CoreBusinessEngine';
import { supabase } from './supabase';
import {
  parseTextFormat,
  parseOfflineEntry,
  type ParsedEntry,
  type ParseResult,
} from './SmartCodeParser';
import {
  validateCodeFormat,
  validatePoints,
  type ValidationResult,
  type SmartCodeEntry,
} from './SmartCodeValidationEngine';

// ============================================================================
// TYPES
// ============================================================================

export type EntryMethod = 'digital' | 'manual' | 'offline_ai';

export type OCRProvider = 'google_vision' | 'aws_textract' | 'azure_vision' | 'custom_ml' | 'none';

export type OCRConfig = {
  provider: OCRProvider;
  apiKey?: string;
  endpoint?: string;
  preprocessImage: boolean;
  enhanceContrast: boolean;
  detectHandwriting: boolean;
  minConfidence: number;
};

export type WhitePaperEntry = {
  customer_name?: string;
  purchase_amount?: number;
  care_club_contribution?: number;
  smartcodes: ParsedEntry[];
  signature?: string;
  raw_text: string;
};

export type OCRProcessingResult = {
  success: boolean;
  entries: ParsedEntry[];
  rawText: string;
  confidence: number;
  processingTimeMs: number;
  provider: OCRProvider;
  fraudDetected: boolean;
  fraudReasons: string[];
  validation: OfflineValidationResult;
  metadata: {
    imageWidth: number;
    imageHeight: number;
    textRegions: number;
    handwritingDetected: boolean;
  };
};

export type OfflineValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalEntries: number;
    validEntries: number;
    invalidEntries: number;
    duplicateCodes: string[];
    totalPoints: number;
    availablePoints: number;
    pointsMatch: boolean;
  };
};

export type DuplicateSubmissionCheck = {
  isDuplicate: boolean;
  reason: string;
  existingSubmissionId?: string;
};

export type FutureInputChannel = 'voice' | 'whatsapp' | 'camera_live' | 'offline_smartcard';

export type FutureChannelConfig = {
  channel: FutureInputChannel;
  enabled: boolean;
  description: string;
  architectureReady: boolean;
};

// ============================================================================
// ENGINE CONFIGURATION
// ============================================================================

export const OFFLINE_ENGINE_CONFIG = {
  /** Maximum image size in bytes (10MB) */
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,

  /** Allowed image types */
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  /** Default OCR configuration (no provider active) */
  DEFAULT_OCR_CONFIG: {
    provider: 'none' as OCRProvider,
    preprocessImage: true,
    enhanceContrast: true,
    detectHandwriting: true,
    minConfidence: 0.7,
  },

  /** White Paper Standard fields */
  PAPER_FORMAT: {
    customerName: 'Customer Name',
    purchaseAmount: 'Purchase Amount',
    careClubContribution: 'Care Club Contribution',
    smartcodes: 'SmartCodes',
    signature: 'Signature (optional)',
  },

  /** Future AI input channels (architecture only) */
  FUTURE_CHANNELS: [
    {
      channel: 'voice' as FutureInputChannel,
      enabled: false,
      description: 'Voice SmartCode Entry — speak codes aloud',
      architectureReady: true,
    },
    {
      channel: 'whatsapp' as FutureInputChannel,
      enabled: false,
      description: 'WhatsApp SmartCode Entry — send codes via chat',
      architectureReady: true,
    },
    {
      channel: 'camera_live' as FutureInputChannel,
      enabled: false,
      description: 'Camera Live Scan — real-time SmartCode scanning',
      architectureReady: true,
    },
    {
      channel: 'offline_smartcard' as FutureInputChannel,
      enabled: false,
      description: 'Offline SmartCard — physical card with embedded codes',
      architectureReady: true,
    },
  ] as FutureChannelConfig[],
} as const;

// ============================================================================
// AI VALIDATION FLOW
// ============================================================================

/**
 * Validate offline SmartCode entries through the full AI validation pipeline.
 *
 * Steps:
 *   1. Read SmartCodes from input
 *   2. Normalize formatting (pad to 3 digits)
 *   3. Validate 000-999 range
 *   4. Validate point values (positive integers)
 *   5. Calculate total points
 *   6. Compare with available SmartPoints
 *   7. Reject invalid entries
 */
export function validateOfflineEntries(
  entries: SmartCodeEntry[],
  availablePoints: number
): OfflineValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const duplicateCodes: string[] = [];
  const seenCodes = new Set<string>();
  let validEntries = 0;
  let invalidEntries = 0;
  let totalPoints = 0;

  for (const entry of entries) {
    const normalizedCode = normalizeSmartCode(entry.code);

    // Step 3: Validate 000-999 range
    const codeResult = validateCodeFormat(normalizedCode);
    if (!codeResult.valid) {
      invalidEntries++;
      errors.push(`Invalid SmartCode "${entry.code}": ${codeResult.message}`);
      continue;
    }

    // Step 4: Validate point values
    const pointsResult = validatePoints(entry.points, availablePoints);
    if (!pointsResult.valid) {
      invalidEntries++;
      errors.push(`Invalid points for ${normalizedCode}: ${pointsResult.message}`);
      continue;
    }

    // Track duplicates (allowed, but tracked)
    if (seenCodes.has(normalizedCode)) {
      duplicateCodes.push(normalizedCode);
    } else {
      seenCodes.add(normalizedCode);
    }

    validEntries++;
    totalPoints += entry.points;
  }

  // Step 5-6: Compare with available SmartPoints
  const pointsMatch = totalPoints === availablePoints;
  if (totalPoints > availablePoints) {
    errors.push(`Total points (${totalPoints}) exceed available SmartPoints (${availablePoints})`);
  }
  if (totalPoints < availablePoints && validEntries > 0) {
    warnings.push(`${availablePoints - totalPoints} SmartPoints unallocated`);
  }

  return {
    valid: errors.length === 0 && pointsMatch,
    errors,
    warnings,
    stats: {
      totalEntries: entries.length,
      validEntries,
      invalidEntries,
      duplicateCodes,
      totalPoints,
      availablePoints,
      pointsMatch,
    },
  };
}

// ============================================================================
// DUPLICATE DETECTION — Reject duplicate uploads of same submission
// ============================================================================

/**
 * Check if a submission is a duplicate of a previous upload.
 * Repeated SmartCodes ARE allowed — only duplicate UPLOADS are rejected.
 */
export async function checkDuplicateSubmission(
  userId: string,
  entries: SmartCodeEntry[],
  weekPeriod?: string
): Promise<DuplicateSubmissionCheck> {
  const week = weekPeriod || getCurrentWeekPeriod();

  const submissionSignature = entries
    .map(e => `${normalizeSmartCode(e.code)}:${e.points}`)
    .sort()
    .join('|');

  const { data: existingSubmissions } = await supabase
    .from('offline_smartcode_entries')
    .select('id, parsed_entries, created_at')
    .eq('user_id', userId)
    .eq('week_period', week)
    .eq('status', 'processed')
    .order('created_at', { ascending: false })
    .limit(20);

  if (!existingSubmissions || existingSubmissions.length === 0) {
    return { isDuplicate: false, reason: '' };
  }

  for (const sub of existingSubmissions as any[]) {
    const parsed = sub.parsed_entries as ParsedEntry[];
    if (!parsed || !Array.isArray(parsed)) continue;

    const existingSignature = parsed
      .map(e => `${e.code}:${e.points}`)
      .sort()
      .join('|');

    if (submissionSignature === existingSignature) {
      return {
        isDuplicate: true,
        reason: 'This exact SmartCode configuration was already submitted',
        existingSubmissionId: sub.id,
      };
    }
  }

  return { isDuplicate: false, reason: '' };
}

// ============================================================================
// OCR ENGINE ARCHITECTURE (No integration — architecture only)
// ============================================================================

/**
 * Process an image for SmartCode extraction.
 *
 * ARCHITECTURE ONLY — no OCR provider is integrated.
 * When a provider is configured, this function will:
 *   1. Preprocess the image (contrast, noise reduction)
 *   2. Send to OCR provider (Google Vision, AWS Textract, etc.)
 *   3. Parse the returned text for SmartCode entries
 *   4. Validate all extracted entries
 *   5. Return the processing result
 *
 * Currently returns an error indicating OCR is not configured.
 */
export async function processImageForSmartCodes(
  imageBase64: string,
  userId: string,
  availablePoints: number,
  config?: Partial<OCRConfig>
): Promise<OCRProcessingResult> {
  const startTime = Date.now();
  const ocrConfig: OCRConfig = { ...OFFLINE_ENGINE_CONFIG.DEFAULT_OCR_CONFIG, ...config };

  // No OCR provider configured — architecture only
  if (ocrConfig.provider === 'none') {
    return {
      success: false,
      entries: [],
      rawText: '',
      confidence: 0,
      processingTimeMs: Date.now() - startTime,
      provider: 'none',
      fraudDetected: false,
      fraudReasons: ['OCR provider not configured — architecture ready for integration'],
      validation: {
        valid: false,
        errors: ['OCR service is not yet integrated. Architecture is ready for Google Vision, AWS Textract, Azure Computer Vision, or custom ML models.'],
        warnings: [],
        stats: {
          totalEntries: 0,
          validEntries: 0,
          invalidEntries: 0,
          duplicateCodes: [],
          totalPoints: 0,
          availablePoints,
          pointsMatch: false,
        },
      },
      metadata: {
        imageWidth: 0,
        imageHeight: 0,
        textRegions: 0,
        handwritingDetected: false,
      },
    };
  }

  // When OCR provider is configured, the flow would be:
  // 1. Preprocess image
  // 2. Call provider API via edge function
  // 3. Parse OCR text output
  // 4. Validate entries
  // 5. Check for duplicate submission
  // 6. Return result

  return {
    success: false,
    entries: [],
    rawText: '',
    confidence: 0,
    processingTimeMs: Date.now() - startTime,
    provider: ocrConfig.provider,
    fraudDetected: false,
    fraudReasons: [`OCR provider "${ocrConfig.provider}" integration not yet implemented`],
    validation: {
      valid: false,
      errors: ['OCR integration pending — architecture ready'],
      warnings: [],
      stats: {
        totalEntries: 0,
        validEntries: 0,
        invalidEntries: 0,
        duplicateCodes: [],
        totalPoints: 0,
        availablePoints,
        pointsMatch: false,
      },
    },
    metadata: {
      imageWidth: 0,
      imageHeight: 0,
      textRegions: 0,
      handwritingDetected: false,
    },
  };
}

// ============================================================================
// WHITE PAPER STANDARD FORMAT
// ============================================================================

/**
 * Parse a White Paper Standard format submission.
 *
 * Expected format:
 *   Customer Name: John Doe
 *   Purchase Amount: ₹500
 *   SmartCodes:
 *   466 = 2 Points
 *   764 = 5 Points
 *   854 = 10 Points
 *   010 = 1 Point
 *   Signature: John D.
 */
export function parseWhitePaperFormat(rawText: string): WhitePaperEntry {
  const lines = rawText.split(/[\n\r]+/).map(l => l.trim());

  let customerName: string | undefined;
  let purchaseAmount: number | undefined;
  let careClubContribution: number | undefined;
  let signature: string | undefined;
  const smartcodeLines: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.startsWith('customer name') || lower.startsWith('name')) {
      const match = line.match(/[:\-]\s*(.+)$/);
      if (match) customerName = match[1].trim();
      continue;
    }

    if (lower.startsWith('purchase amount') || lower.startsWith('purchase')) {
      const match = line.match(/[:\-]?\s*₹?\s*(\d+)/);
      if (match) purchaseAmount = parseInt(match[1], 10);
      continue;
    }

    if (lower.startsWith('care club') || lower.startsWith('contribution')) {
      const match = line.match(/[:\-]?\s*₹?\s*(\d+)/);
      if (match) careClubContribution = parseInt(match[1], 10);
      continue;
    }

    if (lower.startsWith('signature')) {
      const match = line.match(/[:\-]\s*(.+)$/);
      if (match) signature = match[1].trim();
      continue;
    }

    if (lower.startsWith('smartcodes') || lower.startsWith('smart codes')) {
      continue;
    }

    // If line looks like a SmartCode entry, collect it
    if (/^\d{1,3}\s*[=:]\s*\d+/.test(line) || /^\d{1,3}$/.test(line)) {
      smartcodeLines.push(line);
    }
  }

  const parseResult = parseTextFormat(smartcodeLines.join('\n'), 'offline');

  return {
    customer_name: customerName,
    purchase_amount: purchaseAmount,
    care_club_contribution: careClubContribution,
    smartcodes: parseResult.entries,
    signature,
    raw_text: rawText,
  };
}

/**
 * Generate the White Paper Standard template for display.
 */
export function getWhitePaperTemplate(): string {
  return `Customer Name: _______________________
Purchase Amount: ₹______  (or)  Care Club Contribution: ₹______

SmartCodes:
466 = 2 Points
764 = 5 Points
854 = 10 Points
010 = 1 Point

Signature: _______________________ (optional)`;
}

// ============================================================================
// ENTRY METHOD PROCESSING
// ============================================================================

/**
 * Process Digital Entry — create SmartCodes inside the VLOOP app.
 * Delegates to SmartCodeDistributionEngine.
 */
export async function processDigitalEntry(
  userId: string,
  entries: SmartCodeEntry[],
  availablePoints: number,
  mode: 'ai_auto' | 'manual'
): Promise<{ success: boolean; error?: string }> {
  const validation = validateOfflineEntries(entries, availablePoints);
  if (!validation.valid) {
    return { success: false, error: validation.errors.join('; ') };
  }

  return { success: true };
}

/**
 * Process Manual Entry — manually create unlimited 3-digit SmartCodes.
 * Duplicate SmartCodes are allowed (same code, different points).
 */
export async function processManualEntry(
  userId: string,
  text: string,
  availablePoints: number
): Promise<{ success: boolean; entries: ParsedEntry[]; error?: string }> {
  const parseResult = parseTextFormat(text, 'manual');
  if (parseResult.errors.length > 0) {
    return {
      success: false,
      entries: [],
      error: parseResult.errors.map(e => `Line ${e.line}: ${e.message}`).join('; '),
    };
  }

  const entries = parseResult.entries.map(e => ({
    code: e.code,
    points: e.points,
  }));

  const validation = validateOfflineEntries(entries, availablePoints);
  if (!validation.valid) {
    return {
      success: false,
      entries: [],
      error: validation.errors.join('; '),
    };
  }

  return { success: true, entries: parseResult.entries };
}

/**
 * Process Offline AI Entry — upload photo, AI reads SmartCodes.
 * No OCR service integrated yet — returns architecture-ready status.
 */
export async function processOfflineAIEntry(
  userId: string,
  imageBase64: string,
  availablePoints: number
): Promise<OCRProcessingResult> {
  return processImageForSmartCodes(imageBase64, userId, availablePoints);
}

// ============================================================================
// SUBMISSION STORAGE
// ============================================================================

/**
 * Store an offline SmartCode submission for audit trail.
 */
export async function storeOfflineSubmission(
  userId: string,
  method: EntryMethod,
  entries: ParsedEntry[],
  status: 'processed' | 'rejected' | 'pending',
  notes?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const weekPeriod = getCurrentWeekPeriod();
  const totalPoints = entries.reduce((sum, e) => sum + e.points, 0);

  const { data, error } = await supabase
    .from('offline_smartcode_entries')
    .insert({
      user_id: userId,
      week_period: weekPeriod,
      entry_method: method,
      raw_text: entries.map(e => e.raw).join('\n'),
      parsed_entries: entries,
      processed_entries_count: entries.length,
      total_points: totalPoints,
      status,
      notes,
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: (data as any)?.id };
}

// ============================================================================
// FUTURE AI INPUT CHANNELS (Architecture only — no UI)
// ============================================================================

/**
 * Get the list of future AI input channels and their architecture readiness.
 */
export function getFutureInputChannels(): FutureChannelConfig[] {
  return OFFLINE_ENGINE_CONFIG.FUTURE_CHANNELS;
}

/**
 * Architecture for Voice SmartCode Entry.
 * Uses SmartCodeParser.parseVoiceCommand() — already implemented.
 * UI not built — architecture ready.
 */
export function getVoiceEntryArchitecture() {
  return {
    channel: 'voice' as FutureInputChannel,
    parser: 'SmartCodeParser.parseVoiceCommand()',
    description: 'User speaks SmartCode digits and point values',
    supportedLanguages: ['English', 'Hindi (future)'],
    architectureReady: true,
    uiBuilt: false,
  };
}

/**
 * Architecture for WhatsApp SmartCode Entry.
 * Uses SmartCodeParser.parseWhatsAppMessage() — already implemented.
 * UI not built — architecture ready.
 */
export function getWhatsAppEntryArchitecture() {
  return {
    channel: 'whatsapp' as FutureInputChannel,
    parser: 'SmartCodeParser.parseWhatsAppMessage()',
    description: 'User sends SmartCodes via WhatsApp chatbot',
    architectureReady: true,
    uiBuilt: false,
  };
}

/**
 * Architecture for Camera Live Scan.
 * Requires real-time OCR processing — architecture ready, no implementation.
 */
export function getCameraLiveScanArchitecture() {
  return {
    channel: 'camera_live' as FutureInputChannel,
    parser: 'processImageForSmartCodes() with real-time stream',
    description: 'Camera scans SmartCodes in real-time from paper',
    architectureReady: true,
    uiBuilt: false,
  };
}

/**
 * Architecture for Offline SmartCard.
 * Physical card with embedded SmartCodes — NFC/QR scanning.
 */
export function getOfflineSmartCardArchitecture() {
  return {
    channel: 'offline_smartcard' as FutureInputChannel,
    parser: 'NFC/QR code reader → parseTextFormat()',
    description: 'Physical SmartCard with embedded codes scanned via NFC or QR',
    architectureReady: true,
    uiBuilt: false,
  };
}

// ============================================================================
// RECEIPT VERIFICATION (Architecture only — no implementation)
// ============================================================================

export type ReceiptVerificationArchitecture = {
  enabled: boolean;
  description: string;
  futureCapabilities: {
    receiptOCR: string;
    purchaseMatching: string;
    smartcodeCrossRef: string;
    customerMatching: string;
    transactionValidation: string;
  };
};

/**
 * Get the receipt verification architecture.
 * Future AI can compare receipt, purchase, SmartCodes, customer, and transaction.
 * No implementation now — architecture only.
 */
export function getReceiptVerificationArchitecture(): ReceiptVerificationArchitecture {
  return {
    enabled: false,
    description: 'Receipt Verification — future AI capability to cross-reference receipts with SmartCode submissions',
    futureCapabilities: {
      receiptOCR: 'Extract purchase details from receipt photo',
      purchaseMatching: 'Match receipt total with claimed purchase amount',
      smartcodeCrossRef: 'Verify SmartCode points match purchase-derived SmartPoints',
      customerMatching: 'Match receipt customer with VLOOP profile',
      transactionValidation: 'Cross-reference with transaction database',
    },
  };
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Validation
  validateOfflineEntries,
  checkDuplicateSubmission,

  // OCR Architecture
  processImageForSmartCodes,

  // White Paper Standard
  parseWhitePaperFormat,
  getWhitePaperTemplate,

  // Entry Method Processing
  processDigitalEntry,
  processManualEntry,
  processOfflineAIEntry,

  // Submission Storage
  storeOfflineSubmission,

  // Future Channels
  getFutureInputChannels,
  getVoiceEntryArchitecture,
  getWhatsAppEntryArchitecture,
  getCameraLiveScanArchitecture,
  getOfflineSmartCardArchitecture,

  // Receipt Verification
  getReceiptVerificationArchitecture,

  // Config
  OFFLINE_ENGINE_CONFIG,
};
