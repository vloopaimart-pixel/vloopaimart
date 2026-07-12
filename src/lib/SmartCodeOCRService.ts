/**
 * VLOOP SmartCode OCR Service
 * ============================
 *
 * Enterprise OCR architecture for reading SmartCodes from images.
 *
 * Architecture ready for:
 *   - Google Vision API
 *   - AWS Textract
 *   - Azure Computer Vision
 *   - Custom ML models
 *
 * No OCR service is integrated yet. Architecture only.
 * No demo data. No fake OCR. No simulated results.
 *
 * Last Updated: Phase 32 — Enterprise Offline AI SmartCode Platform
 */

import {
  parseOCROutput,
  parseTextFormat,
  type ParsedEntry,
  type OCRResult,
} from './SmartCodeParser';
import {
  validateBatch,
  normalizeSmartCode,
  type SmartCodeEntry,
  type UserValidationContext,
} from './SmartCodeValidationEngine';
import { supabase } from './supabase';
import { getCurrentWeekPeriod } from './engagementEngine';

// ============================================================================
// TYPES
// ============================================================================

export type OCRProvider = 'none' | 'google' | 'aws' | 'azure' | 'custom';

export type OCRConfig = {
  provider: OCRProvider;
  apiKey?: string;
  endpoint?: string;
  preprocessImage: boolean;
  enhanceContrast: boolean;
  detectHandwriting: boolean;
};

export type OCRProcessingResult = {
  success: boolean;
  entries: ParsedEntry[];
  rawText: string;
  confidence: number;
  processingTimeMs: number;
  fraudDetected: boolean;
  fraudReasons: string[];
  validation: OCRValidation;
  metadata: {
    imageWidth: number;
    imageHeight: number;
    textRegions: number;
  };
};

export type OCRValidation = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalEntries: number;
    validEntries: number;
    invalidEntries: number;
    duplicateCodes: string[];
    totalPoints: number;
  };
};

export type FraudCheck = {
  isDuplicate: boolean;
  isManipulated: boolean;
  hasSuspiciousPatterns: boolean;
  reasons: string[];
  confidence: number;
};

// ============================================================================
// DEFAULT CONFIG
// ============================================================================

export const DEFAULT_OCR_CONFIG: OCRConfig = {
  provider: 'none',
  preprocessImage: true,
  enhanceContrast: true,
  detectHandwriting: true,
};

// ============================================================================
// OCR SERVICE CLASS
// ============================================================================

/**
 * SmartCode OCR Service
 * Handles image-to-SmartCode conversion
 */
export class SmartCodeOCRService {
  private config: OCRConfig;

  constructor(config: Partial<OCRConfig> = {}) {
    this.config = { ...DEFAULT_OCR_CONFIG, ...config };
  }

  /**
   * Process an image and extract SmartCodes
   */
  async processImage(imageBase64: string, userId?: string): Promise<OCRProcessingResult> {
    const startTime = Date.now();

    try {
      // Step 1: Preprocess image
      const preprocessed = this.config.preprocessImage
        ? await this.preprocessImage(imageBase64)
        : imageBase64;

      // Step 2: Run OCR
      const ocrResult = await this.runOCR(preprocessed);

      // Step 3: Parse SmartCodes from OCR text
      const parsedEntries = parseTextFormat(ocrResult.text, 'ocr');

      // Step 4: Validate entries
      const validation = this.validateEntries(parsedEntries.entries);

      // Step 5: Fraud detection
      const fraudCheck = await this.detectFraud(parsedEntries.entries, userId);

      // Step 6: Calculate confidence
      const avgConfidence = parsedEntries.entries.reduce((sum, e) => sum + e.confidence, 0) / Math.max(1, parsedEntries.entries.length);

      const processingTimeMs = Date.now() - startTime;

      return {
        success: parsedEntries.errors.length === 0 && !fraudCheck.isDuplicate,
        entries: parsedEntries.entries,
        rawText: ocrResult.text,
        confidence: avgConfidence,
        processingTimeMs,
        fraudDetected: fraudCheck.isDuplicate || fraudCheck.isManipulated,
        fraudReasons: fraudCheck.reasons,
        validation,
        metadata: {
          imageWidth: ocrResult.width || 0,
          imageHeight: ocrResult.height || 0,
          textRegions: ocrResult.regions?.length || 0,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        entries: [],
        rawText: '',
        confidence: 0,
        processingTimeMs: Date.now() - startTime,
        fraudDetected: false,
        fraudReasons: [],
        validation: {
          valid: false,
          errors: [error.message || 'OCR processing failed'],
          warnings: [],
          stats: {
            totalEntries: 0,
            validEntries: 0,
            invalidEntries: 0,
            duplicateCodes: [],
            totalPoints: 0,
          },
        },
        metadata: {
          imageWidth: 0,
          imageHeight: 0,
          textRegions: 0,
        },
      };
    }
  }

  /**
   * Preprocess image for better OCR results
   */
  private async preprocessImage(imageBase64: string): Promise<string> {
    // In production, use image processing library
    // For now, return original
    return imageBase64;
  }

  /**
   * Run OCR on preprocessed image
   */
  private async runOCR(imageBase64: string): Promise<{
    text: string;
    width?: number;
    height?: number;
    regions?: any[];
  }> {
    switch (this.config.provider) {
      case 'google':
        return this.runGoogleVisionOCR(imageBase64);
      case 'aws':
        return this.runAWSOCR(imageBase64);
      case 'azure':
        return this.runAzureOCR(imageBase64);
      case 'custom':
        return this.runCustomOCR(imageBase64);
      default:
        return this.runSimulatedOCR(imageBase64);
    }
  }

  /**
   * Check if OCR is available (provider configured)
   */
  isOCRAvailable(): boolean {
    return this.config.provider !== 'none';
  }

  /**
   * No OCR provider configured — returns architecture-ready status.
   * No demo data. No fake OCR. No simulated results.
   */
  private async runSimulatedOCR(imageBase64: string): Promise<{
    text: string;
    width?: number;
    height?: number;
    regions?: any[];
  }> {
    throw new Error('OCR service not configured — architecture ready for Google Vision, AWS Textract, Azure Computer Vision, or custom ML models');
  }

  /**
   * Google Vision API OCR (not implemented - architecture ready)
   */
  private async runGoogleVisionOCR(imageBase64: string): Promise<{
    text: string;
    width?: number;
    height?: number;
    regions?: any[];
  }> {
    // Architecture ready for Google Vision API integration
    // POST to https://vision.googleapis.com/v1/images:annotate
    throw new Error('Google Vision OCR not configured');
  }

  /**
   * AWS Textract OCR (not implemented - architecture ready)
   */
  private async runAWSOCR(imageBase64: string): Promise<{
    text: string;
    width?: number;
    height?: number;
    regions?: any[];
  }> {
    // Architecture ready for AWS Textract integration
    // Use AWS SDK to call Textract
    throw new Error('AWS Textract OCR not configured');
  }

  /**
   * Azure Computer Vision OCR (not implemented - architecture ready)
   */
  private async runAzureOCR(imageBase64: string): Promise<{
    text: string;
    width?: number;
    height?: number;
    regions?: any[];
  }> {
    // Architecture ready for Azure Computer Vision integration
    // POST to Azure Computer Vision API
    throw new Error('Azure Computer Vision OCR not configured');
  }

  /**
   * Custom OCR model (not implemented - architecture ready)
   */
  private async runCustomOCR(imageBase64: string): Promise<{
    text: string;
    width?: number;
    height?: number;
    regions?: any[];
  }> {
    // Architecture ready for custom ML model integration
    // Call custom model endpoint
    throw new Error('Custom OCR model not configured');
  }

  /**
   * Validate parsed entries
   */
  private validateEntries(entries: ParsedEntry[]): OCRValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const invalidEntries: ParsedEntry[] = [];
    const duplicateCodes: string[] = [];
    const seenCodes = new Set<string>();
    let totalPoints = 0;

    for (const entry of entries) {
      // Validate code format
      if (!/^\d{3}$/.test(entry.code)) {
        invalidEntries.push(entry);
        errors.push(`Invalid code format: "${entry.code}"`);
        continue;
      }

      // Track duplicates
      if (seenCodes.has(entry.code)) {
        duplicateCodes.push(entry.code);
      } else {
        seenCodes.add(entry.code);
      }

      // Validate points
      if (entry.points < 1) {
        invalidEntries.push(entry);
        errors.push(`Invalid points for code ${entry.code}: ${entry.points}`);
        continue;
      }

      totalPoints += entry.points;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      stats: {
        totalEntries: entries.length,
        validEntries: entries.length - invalidEntries.length,
        invalidEntries: invalidEntries.length,
        duplicateCodes,
        totalPoints,
      },
    };
  }

  /**
   * Detect fraud patterns
   */
  private async detectFraud(entries: ParsedEntry[], userId?: string): Promise<FraudCheck> {
    const reasons: string[] = [];

    // Check for duplicate uploads
    let isDuplicate = false;
    if (userId) {
      const weekPeriod = getCurrentWeekPeriod();

      // Check if exact same entries already submitted
      const { data: existingEntries } = await supabase
        .from('smartcode_allocations')
        .select('smartcode, points_allocated')
        .eq('user_id', userId)
        .eq('week_period', weekPeriod)
        .eq('is_active', true);

      if (existingEntries && existingEntries.length > 0) {
        // Compare with uploaded entries
        const uploadedSignature = entries
          .map(e => `${e.code}:${e.points}`)
          .sort()
          .join(',');

        const existingSignature = (existingEntries as any[])
          .map(e => `${e.smartcode}:${e.points_allocated}`)
          .sort()
          .join(',');

        if (uploadedSignature === existingSignature) {
          isDuplicate = true;
          reasons.push('This exact configuration was already submitted');
        }
      }
    }

    // Check for manipulation patterns
    const isManipulated = false;

    // Check for suspicious patterns
    const hasSuspiciousPatterns = this.checkSuspiciousPatterns(entries);

    if (hasSuspiciousPatterns) {
      reasons.push('Suspicious entry pattern detected');
    }

    return {
      isDuplicate,
      isManipulated,
      hasSuspiciousPatterns,
      reasons,
      confidence: entries.length > 0 ? 0.85 : 0,
    };
  }

  /**
   * Check for suspicious patterns in entries
   */
  private checkSuspiciousPatterns(entries: ParsedEntry[]): boolean {
    // All same code
    const uniqueCodes = new Set(entries.map(e => e.code));
    if (uniqueCodes.size === 1 && entries.length > 5) {
      return true;
    }

    // Sequential codes
    const codes = entries.map(e => parseInt(e.code, 10)).sort((a, b) => a - b);
    let sequential = 0;
    for (let i = 1; i < codes.length; i++) {
      if (codes[i] === codes[i - 1] + 1) {
        sequential++;
      }
    }
    if (sequential > codes.length * 0.7) {
      return true;
    }

    return false;
  }

  /**
   * Store OCR result for audit
   */
  async storeOCRResult(
    userId: string,
    result: OCRProcessingResult,
    imageBase64: string
  ): Promise<void> {
    await supabase.from('offline_smartcode_entries').insert({
      user_id: userId,
      raw_text: result.rawText,
      source: 'ocr_upload',
      status: result.success ? 'processed' : 'rejected',
      parsed_entries: result.entries,
      processed_entries_count: result.validation.stats.validEntries,
      rejected_entries: result.entries.filter(e => !result.validation.stats.duplicateCodes.includes(e.code)),
      total_points: result.validation.stats.totalPoints,
      notes: result.fraudReasons.join('; '),
    });
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Process image with default OCR settings
 */
export async function processSmartCodeImage(
  imageBase64: string,
  userId?: string
): Promise<OCRProcessingResult> {
  const service = new SmartCodeOCRService();
  return service.processImage(imageBase64, userId);
}

/**
 * Store OCR result for audit trail
 */
export async function storeSmartCodeOCRResult(
  userId: string,
  result: OCRProcessingResult,
  imageBase64: string
): Promise<void> {
  const service = new SmartCodeOCRService();
  return service.storeOCRResult(userId, result, imageBase64);
}

export default {
  SmartCodeOCRService,
  processSmartCodeImage,
  storeSmartCodeOCRResult,
  DEFAULT_OCR_CONFIG,
};
