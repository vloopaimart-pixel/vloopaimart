/**
 * VLOOP ENTERPRISE AI SECURITY, TRUST & ANTI-FRAUD ENGINE
 * Phase 45 — Permanent Enterprise Security Layer
 *
 * This engine provides the complete architecture for:
 * - VLOOP Trust Engine
 * - AI Behavior Engine
 * - Sybil Shield
 * - OCR Security
 * - Voice Security (Future Ready)
 * - AI Fraud Engine
 * - Risk Engine
 * - Manual Verification
 * - Audit Engine
 * - Compliance
 */

import { supabase } from './supabase';

export const AI_SECURITY_ENGINE_VERSION = '45.0.0' as const;

export const AI_SECURITY_ENGINE_META = {
  version: AI_SECURITY_ENGINE_VERSION,
  name: 'VLOOP Enterprise AI Security, Trust & Anti-Fraud Engine',
  lockedSince: '2026-07-03',
} as const;

// ============================================================
// TRUST CONSTANTS
// ============================================================

export const TRUST_TIERS = {
  NEW: 'new',
  STANDARD: 'standard',
  VERIFIED: 'verified',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export type TrustTier = typeof TRUST_TIERS[keyof typeof TRUST_TIERS];

export const ENTITY_TYPES = {
  CUSTOMER: 'customer',
  MERCHANT: 'merchant',
  PARTNER: 'partner',
  FRANCHISEE: 'franchisee',
  PRIVATE_LABEL_SUPPLIER: 'private_label_supplier',
  FUTURE_PROJECT: 'future_project',
} as const;

export type SecurityEntityType = typeof ENTITY_TYPES[keyof typeof ENTITY_TYPES];

export const VERIFICATION_LEVELS = {
  NONE: 'none',
  BASIC: 'basic',
  ENHANCED: 'enhanced',
  FULL: 'full',
} as const;

export type VerificationLevel = typeof VERIFICATION_LEVELS[keyof typeof VERIFICATION_LEVELS];

export const KYC_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

export type KYCStatus = typeof KYC_STATUS[keyof typeof KYC_STATUS];

// ============================================================
// BEHAVIOR TYPES
// ============================================================

export const BEHAVIOR_TYPES = {
  PURCHASE: 'purchase',
  CARECLUB: 'careclub',
  SMARTCODE: 'smartcode',
  MARKETPLACE: 'marketplace',
  DEVICE: 'device',
  LOCATION: 'location',
  SESSION: 'session',
  ACTIVITY: 'activity',
  WALLET: 'wallet',
  REFERRAL: 'referral',
} as const;

export type BehaviorType = typeof BEHAVIOR_TYPES[keyof typeof BEHAVIOR_TYPES];

// ============================================================
// SYBIL DETECTION TYPES
// ============================================================

export const SYBIL_DETECTION_TYPES = {
  MULTIPLE_ACCOUNTS: 'multiple_accounts',
  FAKE_DEVICES: 'fake_devices',
  FAKE_REGISTRATIONS: 'fake_registrations',
  DUPLICATE_IDENTITY: 'duplicate_identity',
  MASS_SMARTCODE_ABUSE: 'mass_smartcode_abuse',
  MASS_OCR_ABUSE: 'mass_ocr_abuse',
  MASS_REFERRAL_ABUSE: 'mass_referral_abuse',
  COORDINATE_ATTACK: 'coordinate_attack',
} as const;

export type SybilDetectionType = typeof SYBIL_DETECTION_TYPES[keyof typeof SYBIL_DETECTION_TYPES];

export const SYBIL_ACTIONS = {
  MONITORING: 'monitoring',
  RESTRICTED: 'restricted',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  NONE: 'none',
} as const;

export type SybilAction = typeof SYBIL_ACTIONS[keyof typeof SYBIL_ACTIONS];

// ============================================================
// FRAUD TYPES
// ============================================================

export const FRAUD_CASE_TYPES = {
  FAKE_PURCHASE: 'fake_purchase',
  ABNORMAL_TRANSACTION: 'abnormal_transaction',
  BOT_BEHAVIOR: 'bot_behavior',
  POINT_FARMING: 'point_farming',
  WALLET_ABUSE: 'wallet_abuse',
  REWARD_ABUSE: 'reward_abuse',
  MARKETPLACE_ABUSE: 'marketplace_abuse',
  SMARTCODE_ABUSE: 'smartcode_abuse',
  OCR_ABUSE: 'ocr_abuse',
  REFERRAL_ABUSE: 'referral_abuse',
  IDENTITY_THEFT: 'identity_theft',
  ACCOUNT_TAKEOVER: 'account_takeover',
} as const;

export type FraudCaseType = typeof FRAUD_CASE_TYPES[keyof typeof FRAUD_CASE_TYPES];

export const FRAUD_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type FraudSeverity = typeof FRAUD_SEVERITY[keyof typeof FRAUD_SEVERITY];

export const DETECTION_METHODS = {
  ML_MODEL: 'ml_model',
  RULE_ENGINE: 'rule_engine',
  HEURISTIC: 'heuristic',
  MANUAL_REPORT: 'manual_report',
  PATTERN_MATCH: 'pattern_match',
} as const;

export type DetectionMethod = typeof DETECTION_METHODS[keyof typeof DETECTION_METHODS];

// ============================================================
// RISK TYPES
// ============================================================

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS];

export const ASSESSMENT_TYPES = {
  TRANSACTION: 'transaction',
  USER: 'user',
  MERCHANT: 'merchant',
  PARTNER: 'partner',
  SMARTCODE: 'smartcode',
  OCR: 'ocr',
  SYSTEM: 'system',
} as const;

export type AssessmentType = typeof ASSESSMENT_TYPES[keyof typeof ASSESSMENT_TYPES];

// ============================================================
// VERIFICATION TYPES
// ============================================================

export const VERIFICATION_TYPES = {
  KYC_VERIFICATION: 'kyc_verification',
  TRUST_UPGRADE: 'trust_upgrade',
  FRAUD_REVIEW: 'fraud_review',
  RISK_REVIEW: 'risk_review',
  DOCUMENT_VERIFICATION: 'document_verification',
  OCR_REVIEW: 'ocr_review',
  REWARD_CLAIM: 'reward_claim',
  PAYOUT_APPROVAL: 'payout_approval',
  APPEAL_REVIEW: 'appeal_review',
} as const;

export type VerificationType = typeof VERIFICATION_TYPES[keyof typeof VERIFICATION_TYPES];

export const VERIFICATION_DECISIONS = {
  APPROVE: 'approve',
  REJECT: 'reject',
  SUSPEND: 'suspend',
  FREEZE_WALLET: 'freeze_wallet',
  FREEZE_REWARD: 'freeze_reward',
  REQUEST_DOCUMENTS: 'request_documents',
  ESCALATE: 'escalate',
} as const;

export type VerificationDecision = typeof VERIFICATION_DECISIONS[keyof typeof VERIFICATION_DECISIONS];

// ============================================================
// AUDIT TYPES
// ============================================================

export const AUDIT_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  PASSWORD_RESET: 'password_reset',
  PURCHASE: 'purchase',
  CONTRIBUTION: 'contribution',
  SMARTCODE: 'smartcode',
  REWARD: 'reward',
  WALLET: 'wallet',
  MARKETPLACE: 'marketplace',
  PARTNER: 'partner',
  ADMIN_ACTION: 'admin_action',
  VERIFICATION: 'verification',
  FRAUD_ACTION: 'fraud_action',
  RISK_ACTION: 'risk_action',
  TRUST_UPDATE: 'trust_update',
} as const;

export type AuditType = typeof AUDIT_TYPES[keyof typeof AUDIT_TYPES];

// ============================================================
// COMPLIANCE TYPES
// ============================================================

export const COMPLIANCE_REGIONS = {
  IN: 'India',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  QA: 'Qatar',
  EU: 'European Union',
  UK: 'United Kingdom',
  SG: 'Singapore',
  GLOBAL: 'Global Default',
} as const;

export type ComplianceRegion = keyof typeof COMPLIANCE_REGIONS;

export const DATA_SUBJECT_REQUESTS = {
  DATA_ACCESS: 'data_access',
  DATA_DELETION: 'data_deletion',
  DATA_PORTABILITY: 'data_portability',
  DATA_CORRECTION: 'data_correction',
  CONSENT_WITHDRAWAL: 'consent_withdrawal',
  RESTRICTION: 'restriction',
} as const;

export type DataSubjectRequestType = typeof DATA_SUBJECT_REQUESTS[keyof typeof DATA_SUBJECT_REQUESTS];

// ============================================================
// INTERFACES
// ============================================================

export interface TrustProfileExtended {
  id: string;
  entity_type: SecurityEntityType;
  entity_id: string;
  trust_tier: TrustTier;
  trust_score: number;
  trust_factors: Record<string, number>;
  verification_level: VerificationLevel;
  kyc_status: KYCStatus;
  kyc_submitted_at: string | null;
  kyc_verified_at: string | null;
  last_trust_update: string;
  manual_review_required: boolean;
}

export interface AIBehaviorProfile {
  id: string;
  user_id: string;
  behavior_type: BehaviorType;
  behavior_score: number;
  baseline: Record<string, unknown>;
  current_pattern: Record<string, unknown>;
  deviation_score: number;
  anomaly_flags: Array<{ flag: string; score: number; timestamp: string }>;
}

export interface SybilDetectionCase {
  id: string;
  detection_type: SybilDetectionType;
  severity: FraudSeverity;
  detected_users: string[];
  primary_user: string | null;
  common_identifier: string | null;
  common_device: string | null;
  common_ip: string | null;
  detection_score: number;
  action_taken: SybilAction | null;
  status: 'open' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
}

export interface OCRSecurityValidation {
  id: string;
  user_id: string;
  validation_type: string;
  validation_status: 'pending' | 'passed' | 'failed' | 'manual_review';
  validation_score: number;
  fraud_indicators: string[];
  forensic_data: Record<string, unknown>;
}

export interface AIFraudCase {
  id: string;
  case_type: FraudCaseType;
  severity: FraudSeverity;
  user_id: string | null;
  entity_type: string | null;
  detection_method: DetectionMethod | null;
  fraud_score: number;
  fraud_indicators: string[];
  evidence: Record<string, unknown>;
  amount_involved: number;
  points_involved: number;
  status: 'open' | 'investigating' | 'confirmed' | 'false_positive' | 'escalated' | 'resolved';
}

export interface RiskAssessment {
  id: string;
  assessment_type: AssessmentType;
  entity_type: string | null;
  entity_id: string | null;
  user_id: string | null;
  overall_risk_level: RiskLevel;
  risk_score: number;
  risk_factors: Record<string, number>;
  action_recommended: string | null;
}

export interface ManualVerificationQueue {
  id: string;
  verification_type: VerificationType;
  entity_type: string;
  entity_id: string;
  user_id: string | null;
  priority: number;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'escalated';
  documents_required: string[];
  decision: VerificationDecision | null;
}

export interface SecurityAuditLog {
  id: string;
  audit_type: AuditType;
  entity_type: string | null;
  entity_id: string | null;
  user_id: string | null;
  action: string;
  action_details: Record<string, unknown>;
  ip_address: string | null;
  is_suspicious: boolean;
  created_at: string;
}

export interface ComplianceFramework {
  id: string;
  region_code: ComplianceRegion;
  region_name: string;
  gdpr_compliant: boolean;
  retention_days: number;
  right_to_deletion: boolean;
  data_portability: boolean;
}

// ============================================================
// TRUST FUNCTIONS
// ============================================================

export async function getTrustProfile(
  entityType: SecurityEntityType,
  entityId: string
): Promise<TrustProfileExtended | null> {
  const { data, error } = await supabase
    .from('trust_profiles_extended')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .maybeSingle();

  if (error) throw error;
  return data as TrustProfileExtended | null;
}

export async function calculateTrustScore(
  entityType: SecurityEntityType,
  entityId: string
): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_trust_score', {
    p_entity_type: entityType,
    p_entity_id: entityId,
  });

  if (error) throw error;
  return data;
}

export function getTrustTierArchitecture(): Record<TrustTier, { minScore: number; maxScore: number }> {
  return {
    new: { minScore: 0, maxScore: 100 },
    standard: { minScore: 100, maxScore: 500 },
    verified: { minScore: 500, maxScore: 700 },
    premium: { minScore: 700, maxScore: 900 },
    enterprise: { minScore: 900, maxScore: 1000 },
  };
}

// ============================================================
// BEHAVIOR FUNCTIONS
// ============================================================

export async function getBehaviorProfiles(userId: string): Promise<AIBehaviorProfile[]> {
  const { data, error } = await supabase
    .from('ai_behavior_profiles')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []) as AIBehaviorProfile[];
}

export async function logBehaviorEvent(
  userId: string,
  behaviorType: BehaviorType,
  eventType: string,
  eventData: Record<string, unknown>,
  options?: {
    deviceFingerprint?: string;
    ipAddress?: string;
    sessionId?: string;
  }
): Promise<void> {
  const { error } = await supabase.from('ai_behavior_events').insert({
    user_id: userId,
    behavior_type: behaviorType,
    event_type: eventType,
    event_data: eventData,
    device_fingerprint: options?.deviceFingerprint || null,
    ip_address: options?.ipAddress || null,
    session_id: options?.sessionId || null,
  });

  if (error) throw error;
}

export function getBehaviorArchitecture(): Array<{ type: BehaviorType; metrics: string[] }> {
  return [
    { type: 'purchase', metrics: ['order_count', 'avg_value', 'frequency', 'category_diversity'] },
    { type: 'careclub', metrics: ['contribution_frequency', 'amount_pattern', 'timing_pattern'] },
    { type: 'smartcode', metrics: ['code_frequency', 'timing_pattern', 'point_pattern'] },
    { type: 'marketplace', metrics: ['browse_pattern', 'search_pattern', 'cart_behavior'] },
    { type: 'device', metrics: ['device_count', 'device_fingerprint', 'hardware_changes'] },
    { type: 'location', metrics: ['login_locations', 'ip_consistency', 'geo_velocity'] },
    { type: 'session', metrics: ['duration', 'click_pattern', 'navigation_pattern'] },
  ];
}

// ============================================================
// SYBIL FUNCTIONS
// ============================================================

export async function getSybilCases(
  status?: 'open' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved'
): Promise<SybilDetectionCase[]> {
  let query = supabase.from('sybil_detection_log').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as SybilDetectionCase[];
}

export function getSybilArchitecture(): Array<{ detectionType: SybilDetectionType; indicators: string[] }> {
  return [
    { detectionType: 'multiple_accounts', indicators: ['Same device', 'Same IP', 'Same phone', 'Temporal correlation'] },
    { detectionType: 'fake_devices', indicators: ['Emulator detected', 'Device spoofing', 'Inconsistent hardware'] },
    { detectionType: 'fake_registrations', indicators: ['Disposable email', 'Invalid phone', 'Bot patterns'] },
    { detectionType: 'duplicate_identity', indicators: ['Matching ID docs', 'Similar details', 'Phone reuse'] },
    { detectionType: 'mass_smartcode_abuse', indicators: ['Same SmartCode', 'Similar timing', 'Coordinate pattern'] },
    { detectionType: 'mass_ocr_abuse', indicators: ['Duplicate receipts', 'Same images', 'Time clustering'] },
    { detectionType: 'mass_referral_abuse', indicators: ['Referral loops', 'Self-referrals', 'Organized chain'] },
    { detectionType: 'coordinate_attack', indicators: ['Synchronized activity', 'Similar patterns', 'Network clustering'] },
  ];
}

// ============================================================
// FRAUD FUNCTIONS
// ============================================================

export async function getFraudCases(
  options?: {
    status?: string;
    severity?: FraudSeverity;
    userId?: string;
  }
): Promise<AIFraudCase[]> {
  let query = supabase.from('ai_fraud_cases').select('*');

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.severity) {
    query = query.eq('severity', options.severity);
  }
  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as AIFraudCase[];
}

export async function getFraudRules(): Promise<Array<{ rule_code: string; rule_name: string; rule_category: string }>> {
  const { data, error } = await supabase
    .from('ai_fraud_rules')
    .select('rule_code, rule_name, rule_category')
    .eq('is_active', true);

  if (error) throw error;
  return data || [];
}

export function getFraudDetectionArchitecture(): Array<{ type: FraudCaseType; detectionMethods: DetectionMethod[]; severity: FraudSeverity }> {
  return [
    { type: 'fake_purchase', detectionMethods: ['ml_model', 'rule_engine', 'pattern_match'], severity: 'high' },
    { type: 'abnormal_transaction', detectionMethods: ['rule_engine', 'heuristic'], severity: 'high' },
    { type: 'bot_behavior', detectionMethods: ['ml_model', 'heuristic'], severity: 'medium' },
    { type: 'point_farming', detectionMethods: ['pattern_match', 'rule_engine'], severity: 'critical' },
    { type: 'wallet_abuse', detectionMethods: ['rule_engine', 'pattern_match'], severity: 'high' },
    { type: 'reward_abuse', detectionMethods: ['heuristic', 'pattern_match'], severity: 'high' },
    { type: 'marketplace_abuse', detectionMethods: ['ml_model', 'pattern_match'], severity: 'medium' },
    { type: 'smartcode_abuse', detectionMethods: ['rule_engine', 'pattern_match'], severity: 'critical' },
    { type: 'identity_theft', detectionMethods: ['ml_model', 'heuristic'], severity: 'critical' },
    { type: 'account_takeover', detectionMethods: ['ml_model', 'heuristic'], severity: 'critical' },
  ];
}

// ============================================================
// RISK FUNCTIONS
// ============================================================

export async function getRiskAssessment(
  assessmentType: AssessmentType,
  entityId: string
): Promise<RiskAssessment | null> {
  const { data, error } = await supabase
    .from('risk_assessments')
    .select('*')
    .eq('assessment_type', assessmentType)
    .eq('entity_id', entityId)
    .maybeSingle();

  if (error) throw error;
  return data as RiskAssessment | null;
}

export async function assessRiskLevel(riskScore: number): Promise<RiskLevel> {
  const { data, error } = await supabase.rpc('assess_risk_level', {
    p_risk_score: riskScore,
  });

  if (error) throw error;
  return data;
}

export function getRiskArchitecture(): Record<RiskLevel, { scoreRange: [number, number]; autoAction: string }> {
  return {
    low: { scoreRange: [0, 30], autoAction: 'monitor' },
    medium: { scoreRange: [30, 60], autoAction: 'flag' },
    high: { scoreRange: [60, 80], autoAction: 'hold' },
    critical: { scoreRange: [80, 100], autoAction: 'block' },
  };
}

// ============================================================
// VERIFICATION FUNCTIONS
// ============================================================

export async function getVerificationQueue(
  status?: 'pending' | 'in_review' | 'approved' | 'rejected' | 'escalated'
): Promise<ManualVerificationQueue[]> {
  let query = supabase.from('manual_verification_queue').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('priority', { ascending: false }).order('submitted_at', { ascending: true });
  if (error) throw error;
  return (data || []) as ManualVerificationQueue[];
}

export async function submitVerification(
  verificationType: VerificationType,
  entityType: string,
  entityId: string,
  options?: {
    userId?: string;
    priority?: number;
    documentsSubmitted?: string[];
  }
): Promise<ManualVerificationQueue> {
  const { data, error } = await supabase
    .from('manual_verification_queue')
    .insert({
      verification_type: verificationType,
      entity_type: entityType,
      entity_id: entityId,
      user_id: options?.userId || null,
      priority: options?.priority || 5,
      documents_submitted: options?.documentsSubmitted || [],
    })
    .select()
    .single();

  if (error) throw error;
  return data as ManualVerificationQueue;
}

export function getVerificationArchitecture(): Array<{ type: VerificationType; requiredDocuments: string[] }> {
  return [
    { type: 'kyc_verification', requiredDocuments: ['id_proof', 'address_proof', 'photo'] },
    { type: 'trust_upgrade', requiredDocuments: ['id_proof', 'activity_proof'] },
    { type: 'fraud_review', requiredDocuments: ['transaction_records', 'identity_proof'] },
    { type: 'document_verification', requiredDocuments: ['original_document', 'selfie'] },
    { type: 'reward_claim', requiredDocuments: ['winning_proof', 'id_proof'] },
  ];
}

// ============================================================
// AUDIT FUNCTIONS
// ============================================================

export async function logSecurityAudit(
  auditType: AuditType,
  action: string,
  options?: {
    userId?: string;
    entityType?: string;
    entityId?: string;
    details?: Record<string, unknown>;
  }
): Promise<string> {
  const { data, error } = await supabase.rpc('log_security_audit', {
    p_audit_type: auditType,
    p_action: action,
    p_user_id: options?.userId || null,
    p_entity_type: options?.entityType || null,
    p_entity_id: options?.entityId || null,
    p_details: options?.details || {},
  });

  if (error) throw error;
  return data;
}

export async function getAuditLogs(
  options?: {
    auditType?: AuditType;
    userId?: string;
    isSuspicious?: boolean;
  },
  limit: number = 100
): Promise<SecurityAuditLog[]> {
  let query = supabase.from('security_audit_log').select('*');

  if (options?.auditType) {
    query = query.eq('audit_type', options.auditType);
  }
  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }
  if (options?.isSuspicious !== undefined) {
    query = query.eq('is_suspicious', options.isSuspicious);
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return (data || []) as SecurityAuditLog[];
}

// ============================================================
// COMPLIANCE FUNCTIONS
// ============================================================

export async function getComplianceFrameworks(): Promise<ComplianceFramework[]> {
  const { data, error } = await supabase
    .from('compliance_frameworks')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as ComplianceFramework[];
}

export async function createDataSubjectRequest(
  requestType: DataSubjectRequestType,
  regionCode: ComplianceRegion
): Promise<string> {
  const { data, error } = await supabase
    .from('data_subject_requests')
    .insert({
      request_type: requestType,
      region_code: regionCode,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export function getComplianceArchitecture(): Array<{ region: ComplianceRegion; gdpr: boolean; retentionYears: number; features: string[] }> {
  return [
    { region: 'IN', gdpr: false, retentionYears: 7, features: ['Right to deletion', 'Data portability'] },
    { region: 'EU', gdpr: true, retentionYears: 5, features: ['GDPR compliant', 'Right to deletion', 'Data portability'] },
    { region: 'UK', gdpr: true, retentionYears: 5, features: ['GDPR compliant', 'Right to deletion'] },
    { region: 'AE', gdpr: false, retentionYears: 7, features: ['Local compliance'] },
    { region: 'GLOBAL', gdpr: true, retentionYears: 5, features: ['GDPR compliant', 'Max protection'] },
  ];
}

// ============================================================
// DASHBOARD FUNCTIONS
// ============================================================

export async function getSecurityDashboardStats(): Promise<{
  trust: { total_profiles: number; avg_score: number; high_trust: number; low_trust: number };
  fraud: { open_cases: number; critical: number; today_cases: number };
  risk: { critical: number; high: number; medium: number };
  verification: { pending: number; in_review: number };
  sybil: { open_cases: number };
  audit: { today_entries: number; suspicious: number };
}> {
  const { data, error } = await supabase.rpc('get_security_dashboard_stats');
  if (error) throw error;
  return data;
}

export function getSecurityDashboardArchitecture(): Array<{ section: string; metrics: string[]; refreshRate: string }> {
  return [
    { section: 'Trust Analytics', metrics: ['Total Profiles', 'Average Score', 'Tier Distribution'], refreshRate: '5 min' },
    { section: 'Fraud Alerts', metrics: ['Open Cases', 'Critical Priority', 'Today Cases'], refreshRate: '1 min' },
    { section: 'Risk Overview', metrics: ['Critical/High/Medium Counts', 'Top Risks'], refreshRate: '5 min' },
    { section: 'Manual Review', metrics: ['Pending Queue', 'Assignments'], refreshRate: '1 min' },
    { section: 'Sybil Detection', metrics: ['Open Cases', 'Flagged Accounts'], refreshRate: '5 min' },
    { section: 'Audit Trail', metrics: ['Today Entries', 'Suspicious Activity'], refreshRate: 'Real-time' },
  ];
}
