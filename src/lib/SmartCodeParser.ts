/**
 * VLOOP Enterprise SmartCode Parser Service
 * ============================================
 *
 * Multi-channel SmartCode parsing for:
 *   - Voice input ready ("Five Four Two" → 542)
 *   - OCR reading ready (future paper entry scanning)
 *   - WhatsApp ready (future chatbot integration)
 *   - Offline entry (paper-based entries)
 *
 * Architecture ready for future integrations.
 * No UI implementation required.
 *
 * Last Updated: Phase 25 - Enterprise Finalization
 */

import { normalizeSmartCode, validateCodeFormat, parseSmartCode, type ValidationResult } from './SmartCodeValidationEngine';

// ============================================================================
// TYPES
// ============================================================================

export type ParsedEntry = {
  code: string;
  points: number;
  raw: string;
  confidence: number;
  source: ParsedSource;
  lineNumber?: number;
};

export type ParsedSource = 'text' | 'voice' | 'ocr' | 'whatsapp' | 'offline' | 'manual';

export type ParseResult = {
  success: boolean;
  entries: ParsedEntry[];
  errors: ParseError[];
  warnings: ParseWarning[];
  totalParsed: number;
  totalValid: number;
};

export type ParseError = {
  line: number;
  raw: string;
  message: string;
  code: string;
};

export type ParseWarning = {
  line: number;
  raw: string;
  message: string;
};

export type VoiceMapping = Record<string, string>;

// ============================================================================
// VOICE RECOGNITION MAPPINGS
// ============================================================================

/**
 * Voice-to-digit mappings for multiple languages/accents
 * Ready for future voice input integration
 */
export const VOICE_DIGIT_MAP: VoiceMapping = {
  // English
  'zero': '0',
  'oh': '0',
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',

  // Number shortcuts
  'won': '1',
  'to': '2',
  'too': '2',
  'for': '4',
  'ate': '8',

  // Hindi (future support)
  'शून्य': '0',
  'एक': '1',
  'दो': '2',
  'तीन': '3',
  'चार': '4',
  'पांच': '5',
  'छह': '6',
  'सात': '7',
  'आठ': '8',
  'नौ': '9',
};

/**
 * Voice number mappings for two-digit combinations
 */
export const VOICE_NUMBER_MAP: Record<string, string> = {
  'ten': '10',
  'eleven': '11',
  'twelve': '12',
  'thirteen': '13',
  'fourteen': '14',
  'fifteen': '15',
  'sixteen': '16',
  'seventeen': '17',
  'eighteen': '18',
  'nineteen': '19',
  'twenty': '20',
  'thirty': '30',
  'forty': '40',
  'fifty': '50',
  'sixty': '60',
  'seventy': '70',
  'eighty': '80',
  'ninety': '90',
  'hundred': '100',
};

// ============================================================================
// TEXT PARSER (Core)
// ============================================================================

/**
 * Parse SmartCode entries from text format
 * Supports multiple formats:
 *   "466 = 1"
 *   "466 = 1 Point"
 *   "466: 1"
 *   "466 1"
 *   "466,1"
 */
export function parseTextFormat(input: string, source: ParsedSource = 'text'): ParseResult {
  const entries: ParsedEntry[] = [];
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];

  const lines = input.split(/[\n\r]+/);

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;

    const parsed = parseLine(raw, source, i + 1);
    if (parsed) {
      if (parsed.valid) {
        entries.push(parsed.entry!);
      } else if (parsed.error) {
        errors.push(parsed.error);
      }
      if (parsed.warning) {
        warnings.push(parsed.warning);
      }
    }
  }

  return {
    success: errors.length === 0,
    entries,
    errors,
    warnings,
    totalParsed: lines.filter(l => l.trim()).length,
    totalValid: entries.length,
  };
}

/**
 * Parse a single line
 */
function parseLine(
  raw: string,
  source: ParsedSource,
  lineNumber: number
): { valid: boolean; entry?: ParsedEntry; error?: ParseError; warning?: ParseWarning } | null {
  if (!raw.trim()) return null;

  // Try multiple patterns
  const patterns = [
    // "466 = 1" or "466 = 1 Point"
    /^(\d{1,3})\s*[=:]\s*(\d+)/i,
    // "466 1" or "466, 1"
    /^(\d{1,3})[\s,]+(\d+)/,
    // "466" (code only, 1 point default)
    /^(\d{1,3})$/,
  ];

  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match) {
      const codeRaw = match[1];
      const pointsRaw = match[2] || '1';

      const code = normalizeSmartCode(codeRaw);
      const points = parseInt(pointsRaw, 10);

      const codeValidation = validateCodeFormat(code);

      if (!codeValidation.valid) {
        return {
          valid: false,
          error: {
            line: lineNumber,
            raw,
            message: codeValidation.message,
            code: codeValidation.code,
          },
        };
      }

      if (isNaN(points) || points < 1) {
        return {
          valid: false,
          error: {
            line: lineNumber,
            raw,
            message: 'Points must be a positive number',
            code: 'INVALID_POINTS',
          },
        };
      }

      // Check for duplicate code in same session (warning)
      const warning: ParseWarning | undefined = undefined;

      return {
        valid: true,
        entry: {
          code,
          points,
          raw,
          confidence: 1.0,
          source,
          lineNumber,
        },
        warning,
      };
    }
  }

  // No pattern matched
  return {
    valid: false,
    error: {
      line: lineNumber,
      raw,
      message: 'Could not parse SmartCode entry',
      code: 'PARSE_ERROR',
    },
  };
}

// ============================================================================
// VOICE PARSER (Future Ready)
// ============================================================================

/**
 * Parse voice input to SmartCode
 * Architecture ready for voice integration
 *
 * Example: "Five Four Two" → "542"
 */
export function parseVoiceCommand(voiceInput: string): ParseResult {
  const entries: ParsedEntry[] = [];
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];

  const normalized = voiceInput.toLowerCase().trim();

  // Pattern: "code five four two points five" or "five four two equals five"
  const codeMatch = normalized.match(/(?:code\s+)?(?:smartcode\s+)?([a-z\s]+?)(?:\s+(?:equals|=|points?))\s*(\d+)/);

  if (codeMatch) {
    const codeWords = codeMatch[1].trim();
    const pointsStr = codeMatch[2];
    const points = parseInt(pointsStr, 10);

    const code = voiceWordsToCode(codeWords);

    if (code) {
      entries.push({
        code,
        points: isNaN(points) ? 1 : points,
        raw: voiceInput,
        confidence: 0.85,
        source: 'voice',
      });
    } else {
      errors.push({
        line: 1,
        raw: voiceInput,
        message: 'Could not parse SmartCode from voice input',
        code: 'VOICE_PARSE_ERROR',
      });
    }
  } else {
    // Try parsing as individual digits
    const digits = voiceInputToDigits(voiceInput, 3);

    if (digits && digits.length === 3) {
      entries.push({
        code: digits,
        points: 1,
        raw: voiceInput,
        confidence: 0.75,
        source: 'voice',
      });
    } else {
      errors.push({
        line: 1,
        raw: voiceInput,
        message: 'Could not parse voice command',
        code: 'VOICE_PARSE_ERROR',
      });
    }
  }

  return {
    success: errors.length === 0,
    entries,
    errors,
    warnings,
    totalParsed: 1,
    totalValid: entries.length,
  };
}

/**
 * Convert voice words to SmartCode digits
 */
function voiceWordsToCode(words: string): string | null {
  const wordList = words.split(/\s+/);
  const digits: string[] = [];

  for (const word of wordList) {
    const cleanWord = word.toLowerCase().trim();

    // Check single digit mapping
    if (VOICE_DIGIT_MAP[cleanWord]) {
      digits.push(VOICE_DIGIT_MAP[cleanWord]);
      continue;
    }

    // Check number mapping (like "twenty", "fifty")
    if (VOICE_NUMBER_MAP[cleanWord]) {
      digits.push(...VOICE_NUMBER_MAP[cleanWord].split(''));
      continue;
    }

    // Try parsing as direct number
    const num = parseInt(cleanWord, 10);
    if (!isNaN(num) && num >= 0 && num <= 9) {
      digits.push(String(num));
    }
  }

  if (digits.length === 3) {
    return digits.join('');
  }

  return null;
}

/**
 * Extract N digits from voice input
 */
function voiceInputToDigits(input: string, count: number): string | null {
  const words = input.toLowerCase().split(/\s+/);
  const digits: string[] = [];

  for (const word of words) {
    if (VOICE_DIGIT_MAP[word]) {
      digits.push(VOICE_DIGIT_MAP[word]);
    }

    // Also check if word contains a digit
    for (const char of word) {
      if (/\d/.test(char)) {
        digits.push(char);
      }
    }

    if (digits.length >= count) break;
  }

  if (digits.length >= count) {
    return digits.slice(0, count).join('');
  }

  return null;
}

// ============================================================================
// OCR PARSER (Future Ready)
// ============================================================================

/**
 * Parse OCR output for SmartCode entries
 * Architecture ready for paper entry scanning
 *
 * OCR would provide:
 *   - Confidence score for each character
 *   - Bounding box positions
 *   - Multiple candidates per character
 */
export interface OCRResult {
  text: string;
  confidence: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export function parseOCROutput(ocrResults: OCRResult[]): ParseResult {
  const entries: ParsedEntry[] = [];
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];

  // Combine OCR results into text
  const combinedText = ocrResults
    .map(r => r.text)
    .join('\n');

  // Parse as text format
  const textResult = parseTextFormat(combinedText, 'ocr');

  // Add OCR-specific confidence
  for (const entry of textResult.entries) {
    // Calculate confidence from OCR results
    const avgConfidence = ocrResults
      .filter(r => r.text.includes(entry.code) || r.text.includes(String(entry.points)))
      .reduce((sum, r) => sum + r.confidence, 0) / Math.max(1, ocrResults.length);

    entries.push({
      ...entry,
      source: 'ocr',
      confidence: Math.min(avgConfidence, 1.0),
    });
  }

  return {
    success: textResult.errors.length === 0,
    entries,
    errors: textResult.errors,
    warnings: textResult.warnings,
    totalParsed: textResult.totalParsed,
    totalValid: entries.length,
  };
}

// ============================================================================
// WHATSAPP PARSER (Future Ready)
// ============================================================================

/**
 * Parse WhatsApp message for SmartCode entries
 * Architecture ready for chatbot integration
 *
 * Example WhatsApp message:
 * "Register code 542 with 5 points"
 * "My codes: 466=2, 542=5, 764=20"
 */
export function parseWhatsAppMessage(message: string, phoneNumber?: string): ParseResult {
  const entries: ParsedEntry[] = [];
  const errors: ParseError[] = [];
  const warnings: ParseWarning[] = [];

  // Normalize WhatsApp formatting
  const normalized = message
    .replace(/[*_~`]/g, '') // Remove WhatsApp formatting
    .replace(/register\s+(?:code|smartcode)?\s*/i, '')
    .replace(/my\s+codes?[:\s]+/i, '');

  // Try parsing as comma-separated or newline-separated
  const textResult = parseTextFormat(normalized, 'whatsapp');

  for (const entry of textResult.entries) {
    entries.push({
      ...entry,
      source: 'whatsapp',
      confidence: 0.9, // Higher confidence for WhatsApp (typed input)
    });
  }

  return {
    success: textResult.errors.length === 0,
    entries,
    errors: textResult.errors,
    warnings: textResult.warnings,
    totalParsed: textResult.totalParsed,
    totalValid: entries.length,
  };
}

// ============================================================================
// OFFLINE ENTRY PARSER
// ============================================================================

/**
 * Parse offline/paper entry format
 * For paper-based SmartCode entries
 *
 * Example:
 * 466 = 2
 * 542 = 5
 * 764 = 20
 */
export function parseOfflineEntry(input: string): ParseResult {
  return parseTextFormat(input, 'offline');
}

/**
 * Validate offline entry sheet
 * For batch processing paper entries
 */
export function parseOfflineBatchSheet(
  input: string,
  userId: string,
  timestamp?: string
): ParseResult & { userId: string; timestamp: string } {
  const result = parseOfflineEntry(input);

  return {
    ...result,
    userId,
    timestamp: timestamp || new Date().toISOString(),
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format SmartCode entries for display/export
 */
export function formatEntries(entries: ParsedEntry[]): string {
  return entries
    .map(e => `${e.code} = ${e.points}`)
    .join('\n');
}

/**
 * Export entries as JSON for API
 */
export function exportEntriesAsJSON(entries: ParsedEntry[]): string {
  return JSON.stringify(
    entries.map(e => ({
      code: e.code,
      points: e.points,
      source: e.source,
      confidence: e.confidence,
    })),
    null,
    2
  );
}

/**
 * Export entries as CSV for offline processing
 */
export function exportEntriesAsCSV(entries: ParsedEntry[]): string {
  const header = 'Code,Points,Source,Confidence,Raw';
  const rows = entries.map(e =>
    `${e.code},${e.points},${e.source},${e.confidence},"${e.raw.replace(/"/g, '""')}"`
  );
  return [header, ...rows].join('\n');
}

export default {
  parseTextFormat,
  parseVoiceCommand,
  parseOCROutput,
  parseWhatsAppMessage,
  parseOfflineEntry,
  parseOfflineBatchSheet,
  formatEntries,
  exportEntriesAsJSON,
  exportEntriesAsCSV,
  normalizeSmartCode,
  VOICE_DIGIT_MAP,
  VOICE_NUMBER_MAP,
};
