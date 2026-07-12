/**
 * VLOOP GLOBAL AI COMMUNICATION & ENGAGEMENT ENGINE
 * Phase 43 — Enterprise AI Communication Layer
 *
 * This engine provides the complete architecture for:
 * - Global Notification Center
 * - AI Reminder Engine
 * - AI Customer Assistant
 * - Multi-Language Support
 * - Voice AI (Future Ready)
 * - OCR Communication
 * - Admin Communication Center
 * - AI Customer Timeline
 */

import { supabase } from './supabase';

export const AI_COMM_ENGINE_VERSION = '43.0.0' as const;

export const AI_COMM_ENGINE_META = {
  version: AI_COMM_ENGINE_VERSION,
  name: 'VLOOP Global AI Communication & Engagement Engine',
  lockedSince: '2026-07-03',
} as const;

// ============================================================
// NOTIFICATION CATEGORY CONSTANTS
// ============================================================

export const NOTIFICATION_CATEGORIES = {
  // Account
  ACCOUNT_CREATED: 'account_created',
  ACCOUNT_VERIFIED: 'account_verified',
  PROFILE_UPDATED: 'profile_updated',
  // Purchase
  PURCHASE_SUCCESS: 'purchase_success',
  SMARTPOINTS_ADDED: 'smartpoints_added',
  // Care Club
  CARECLUB_CONTRIBUTION: 'careclub_contribution',
  // Wallet
  WALLET_CREDIT: 'wallet_credit',
  WALLET_DEBIT: 'wallet_debit',
  // SmartCode
  SMARTCODE_REGISTERED: 'smartcode_registered',
  WEEKLY_DRAW_STARTED: 'weekly_draw_started',
  WEEKLY_DRAW_COMPLETED: 'weekly_draw_completed',
  REWARD_WON: 'reward_won',
  // Claim
  REWARD_CLAIM_APPROVED: 'reward_claim_approved',
  REWARD_CLAIM_REJECTED: 'reward_claim_rejected',
  // Order
  ORDER_CONFIRMED: 'order_confirmed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  REFUND_PROCESSED: 'refund_processed',
  // Partner
  PARTNER_APPROVED: 'partner_approved',
  // Future
  FUTURE_PROJECT_UPDATE: 'future_project_update',
  // Reminders
  REMINDER_PAYMENT: 'reminder_payment',
  REMINDER_PURCHASE: 'reminder_purchase',
  REMINDER_CARECLUB: 'reminder_careclub',
  REMINDER_SMARTCODE: 'reminder_smartcode',
  REMINDER_WALLET_ACTIVATION: 'reminder_wallet_activation',
  REMINDER_CLAIM_DEADLINE: 'reminder_claim_deadline',
  // Admin
  ADMIN_CUSTOMER_ALERT: 'admin_customer_alert',
  ADMIN_MERCHANT_ALERT: 'admin_merchant_alert',
  ADMIN_PARTNER_ALERT: 'admin_partner_alert',
  ADMIN_SYSTEM_ALERT: 'admin_system_alert',
  ADMIN_FRAUD_ALERT: 'admin_fraud_alert',
  ADMIN_SECURITY_ALERT: 'admin_security_alert',
} as const;

export type NotificationCategory = typeof NOTIFICATION_CATEGORIES[keyof typeof NOTIFICATION_CATEGORIES];

// ============================================================
// NOTIFICATION CHANNEL CONSTANTS
// ============================================================

export const NOTIFICATION_CHANNELS = {
  IN_APP: 'in_app',
  PUSH: 'push',
  SMS: 'sms',
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
} as const;

export type NotificationChannel = typeof NOTIFICATION_CHANNELS[keyof typeof NOTIFICATION_CHANNELS];

// ============================================================
// REMINDER TYPES
// ============================================================

export const REMINDER_TYPES = {
  PENDING_PAYMENT: 'pending_payment',
  INCOMPLETE_PURCHASE: 'incomplete_purchase',
  INCOMPLETE_CARECLUB: 'incomplete_careclub',
  SMARTCODE_REGISTRATION: 'smartcode_registration',
  WALLET_ACTIVATION_30D: 'wallet_activation_30d',
  INSURANCE_ACTIVATION: 'insurance_activation',
  REWARD_CLAIM_DEADLINE: 'reward_claim_deadline',
  FUTURE_PROJECT_REGISTRATION: 'future_project_registration',
  KYC_PENDING: 'kyc_pending',
  PROFILE_INCOMPLETE: 'profile_incomplete',
  INACTIVE_USER: 'inactive_user',
  WALLET_TRANSFER_PENDING: 'wallet_transfer_pending',
} as const;

export type ReminderType = typeof REMINDER_TYPES[keyof typeof REMINDER_TYPES];

// ============================================================
// LANGUAGE CONSTANTS
// ============================================================

export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  ML: 'ml',
  HI: 'hi',
  AR: 'ar',
  TA: 'ta',
  TE: 'te',
  KN: 'kn',
  BN: 'bn',
  MR: 'mr',
  GU: 'gu',
} as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];

export const LANGUAGE_NAMES: Record<SupportedLanguage, { name: string; native: string }> = {
  en: { name: 'English', native: 'English' },
  ml: { name: 'Malayalam', native: 'മലയാളം' },
  hi: { name: 'Hindi', native: 'हिंदी' },
  ar: { name: 'Arabic', native: 'العربية' },
  ta: { name: 'Tamil', native: 'தமிழ்' },
  te: { name: 'Telugu', native: 'తెలుగు' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ' },
  bn: { name: 'Bengali', native: 'বাংলা' },
  mr: { name: 'Marathi', native: 'मराठी' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી' },
};

// ============================================================
// ASSISTANT TYPES
// ============================================================

export const ASSISTANT_SESSION_TYPES = {
  VOICE: 'voice',
  CHAT: 'chat',
  FAQ: 'faq',
  HELP: 'help',
  GUIDED: 'guided',
} as const;

export type AssistantSessionType = typeof ASSISTANT_SESSION_TYPES[keyof typeof ASSISTANT_SESSION_TYPES];

export const ASSISTANT_INTENTS = {
  SMARTCODE_WHAT: 'smartcode_what',
  SMARTCODE_ENTER: 'smartcode_enter',
  SMARTCODE_POINTS: 'smartcode_points',
  SMARTCODE_WINNERS: 'smartcode_winners',
  MARKETPLACE_BROWSE: 'marketplace_browse',
  MARKETPLACE_ORDER: 'marketplace_order',
  CARECLUB_JOIN: 'careclub_join',
  CARECLUB_POINTS: 'careclub_points',
  WALLET_BALANCE: 'wallet_balance',
  WALLET_TRANSFER: 'wallet_transfer',
  INSURANCE_INFO: 'insurance_info',
  PARTNER_APPLY: 'partner_apply',
  ORDER_TRACK: 'order_track',
  REFUND_REQUEST: 'refund_request',
  ACCOUNT_UPDATE: 'account_update',
  FUTURE_PROJECTS: 'future_projects',
} as const;

export type AssistantIntent = typeof ASSISTANT_INTENTS[keyof typeof ASSISTANT_INTENTS];

export const ASSISTANT_CATEGORIES = {
  SMARTCODE_HELP: 'smartcode_help',
  MARKETPLACE_HELP: 'marketplace_help',
  CARECLUB_HELP: 'careclub_help',
  WALLET_HELP: 'wallet_help',
  INSURANCE_HELP: 'insurance_help',
  PARTNER_HELP: 'partner_help',
  ORDER_TRACKING: 'order_tracking',
  REFUND_HELP: 'refund_help',
  ACCOUNT_HELP: 'account_help',
  FUTURE_PROJECT_GUIDE: 'future_project_guide',
} as const;

export type AssistantCategory = typeof ASSISTANT_CATEGORIES[keyof typeof ASSISTANT_CATEGORIES];

// ============================================================
// VOICE AI SESSION TYPES
// ============================================================

export const VOICE_SESSION_TYPES = {
  SMARTCODE_ENTRY: 'smartcode_entry',
  MARKETPLACE_SEARCH: 'marketplace_search',
  ORDER_TRACKING: 'order_tracking',
  CARECLUB_REGISTRATION: 'careclub_registration',
  WALLET_OPERATION: 'wallet_operation',
  GENERAL_QUERY: 'general_query',
} as const;

export type VoiceSessionType = typeof VOICE_SESSION_TYPES[keyof typeof VOICE_SESSION_TYPES];

// ============================================================
// OCR STATUS
// ============================================================

export const OCR_STATUS = {
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  VERIFIED: 'verified',
  FAILED: 'failed',
  MANUAL_REVIEW: 'manual_review',
} as const;

export type OCRStatus = typeof OCR_STATUS[keyof typeof OCR_STATUS];

// ============================================================
// ADMIN ALERT TYPES
// ============================================================

export const ADMIN_ALERT_TYPES = {
  CUSTOMER: 'customer',
  MERCHANT: 'merchant',
  PARTNER: 'partner',
  SYSTEM: 'system',
  FRAUD: 'fraud',
  SECURITY: 'security',
  WEEKLY_REPORT: 'weekly_report',
} as const;

export type AdminAlertType = typeof ADMIN_ALERT_TYPES[keyof typeof ADMIN_ALERT_TYPES];

export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type AlertSeverity = typeof ALERT_SEVERITY[keyof typeof ALERT_SEVERITY];

// ============================================================
// REFERENCE TYPES
// ============================================================

export const REFERENCE_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  WALLET: 'wallet',
  SMARTCODE: 'smartcode',
  CARECLUB: 'careclub',
  REWARD: 'reward',
  PARTNER: 'partner',
  PRODUCT: 'product',
  FUTURE_PROJECT: 'future_project',
} as const;

export type ReferenceType = typeof REFERENCE_TYPES[keyof typeof REFERENCE_TYPES];

// ============================================================
// INTERFACES
// ============================================================

export interface NotificationCategoryConfig {
  id: string;
  category_code: NotificationCategory;
  category_name: string;
  default_priority: number;
  default_channels: NotificationChannel[];
  requires_action: boolean;
}

export interface CustomerNotificationTimeline {
  id: string;
  user_id: string;
  notification_id: string | null;
  category_code: NotificationCategory;
  title: string;
  message: string;
  module_reference: string | null;
  reference_id: string | null;
  reference_type: ReferenceType | null;
  is_read: boolean;
  read_at: string | null;
  is_actionable: boolean;
  action_taken: boolean;
  action_taken_at: string | null;
  priority: number;
  archived: boolean;
  created_at: string;
}

export interface AIReminderEngine {
  id: string;
  user_id: string;
  reminder_type: ReminderType;
  reference_entity: string | null;
  reference_id: string | null;
  trigger_condition: Record<string, unknown>;
  reminder_schedule: Record<string, unknown>;
  max_reminders: number;
  reminder_count: number;
  last_reminder_at: string | null;
  next_reminder_at: string | null;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  response_action: string | null;
  response_at: string | null;
}

export interface AIAssistantSession {
  id: string;
  user_id: string;
  session_type: AssistantSessionType;
  language_code: SupportedLanguage;
  status: 'active' | 'completed' | 'expired' | 'transferred';
  conversation_history: Array<{ role: string; content: string; timestamp: string }>;
  intent_detected: string | null;
  entities_extracted: Record<string, unknown>;
  resolution_status: 'resolved' | 'unresolved' | 'escalated' | 'pending' | null;
  resolution_notes: string | null;
  satisfaction_rating: number | null;
  feedback: string | null;
  started_at: string;
  ended_at: string | null;
}

export interface VoiceAISession {
  id: string;
  user_id: string;
  language_code: SupportedLanguage;
  session_type: VoiceSessionType;
  audio_url: string | null;
  transcript_raw: string | null;
  transcript_normalized: string | null;
  intent_detected: string | null;
  confidence_score: number | null;
  entities: Record<string, unknown>;
  action_performed: string | null;
  action_result: Record<string, unknown>;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  response_text: string | null;
  duration_seconds: number | null;
}

export interface OCRCommunicationLog {
  id: string;
  user_id: string;
  smartcode_entry_id: string | null;
  ocr_status: OCRStatus;
  receipt_url: string | null;
  extracted_data: Record<string, unknown>;
  detected_smartcode: string | null;
  detected_points: number | null;
  confidence_score: number | null;
  verification_status: 'verified' | 'failed' | 'requires_review' | 'fraud_detected' | null;
  requires_manual_review: boolean;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notification_sent: boolean;
}

export interface AdminCommunicationCenter {
  id: string;
  alert_type: AdminAlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  reference_entity: string | null;
  reference_id: string | null;
  affected_users: number;
  broadcast_channels: NotificationChannel[];
  is_active: boolean;
  scheduled_at: string | null;
  sent_at: string | null;
  expires_at: string | null;
  created_by: string | null;
}

export interface UserNotificationPreferences {
  id: string;
  user_id: string;
  category_code: NotificationCategory;
  in_app_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  language_code: SupportedLanguage;
}

// ============================================================
// NOTIFICATION FUNCTIONS
// ============================================================

export async function getNotificationCategories(): Promise<NotificationCategoryConfig[]> {
  const { data, error } = await supabase
    .from('notification_categories')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []) as NotificationCategoryConfig[];
}

export async function createNotification(
  userId: string,
  categoryCode: NotificationCategory,
  title: string,
  message: string,
  options?: {
    moduleReference?: string;
    referenceId?: string;
    referenceType?: ReferenceType;
    metadata?: Record<string, unknown>;
  }
): Promise<string> {
  const { data, error } = await supabase.rpc('create_notification', {
    p_user_id: userId,
    p_category_code: categoryCode,
    p_title: title,
    p_message: message,
    p_module_reference: options?.moduleReference || null,
    p_reference_id: options?.referenceId || null,
    p_reference_type: options?.referenceType || null,
    p_metadata: options?.metadata || {},
  });

  if (error) throw error;
  return data;
}

export async function getNotifications(
  userId: string,
  options?: { unreadOnly?: boolean; limit?: number }
): Promise<CustomerNotificationTimeline[]> {
  let query = supabase
    .from('customer_notification_timeline')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false)
    .order('created_at', { ascending: false });

  if (options?.unreadOnly) {
    query = query.eq('is_read', false);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as CustomerNotificationTimeline[];
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_unread_notification_count', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}

export async function markAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('customer_notification_timeline')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) throw error;
}

export async function markAllAsRead(userId: string): Promise<void> {
  const { error } = await supabase.rpc('mark_notifications_read', {
    p_user_id: userId,
  });

  if (error) throw error;
}

// ============================================================
// REMINDER FUNCTIONS
// ============================================================

export async function createReminder(
  userId: string,
  reminderType: ReminderType,
  schedule: {
    first_reminder: string;
    interval_hours: number;
  max_reminders: number;
  },
  options?: {
    referenceEntity?: string;
    referenceId?: string;
  }
): Promise<string> {
  const { data, error } = await supabase.rpc('create_reminder', {
    p_user_id: userId,
    p_reminder_type: reminderType,
    p_reference_entity: options?.referenceEntity || null,
    p_reference_id: options?.referenceId || null,
    p_schedule: schedule,
  });

  if (error) throw error;
  return data;
}

export async function getReminders(
  userId: string,
  status?: 'active' | 'paused' | 'completed' | 'cancelled'
): Promise<AIReminderEngine[]> {
  let query = supabase
    .from('ai_reminder_engine')
    .select('*')
    .eq('user_id', userId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('next_reminder_at', { ascending: true });
  if (error) throw error;
  return (data || []) as AIReminderEngine[];
}

export async function completeReminder(reminderId: string, responseAction?: string): Promise<void> {
  const { error } = await supabase
    .from('ai_reminder_engine')
    .update({
      status: 'completed',
      response_action: responseAction || null,
      response_at: new Date().toISOString(),
    })
    .eq('id', reminderId);

  if (error) throw error;
}

export function getReminderReminders(): Array<{ type: ReminderType; trigger: string; description: string }> {
  return [
    { type: 'pending_payment', trigger: 'Cart abandoned', description: 'Remind user of pending payment' },
    { type: 'incomplete_purchase', trigger: '24hr no completion', description: 'Complete your purchase' },
    { type: 'incomplete_careclub', trigger: 'Contribution pending', description: 'Complete Care Club contribution' },
    { type: 'smartcode_registration', trigger: 'Weekly reset', description: 'Register this week SmartCode' },
    { type: 'wallet_activation_30d', trigger: 'Wallet 2 pending', description: '30 days holding period activation' },
    { type: 'insurance_activation', trigger: 'Insurance pending', description: 'Activate insurance coverage' },
    { type: 'reward_claim_deadline', trigger: 'Claim expires', description: 'Claim reward before deadline' },
    { type: 'future_project_registration', trigger: 'Project launch', description: 'Register for future project' },
    { type: 'kyc_pending', trigger: 'KYC incomplete', description: 'Complete KYC verification' },
    { type: 'profile_incomplete', trigger: 'Profile < 50%', description: 'Complete your profile' },
    { type: 'inactive_user', trigger: '7 days inactive', description: 'We miss you notification' },
    { type: 'wallet_transfer_pending', trigger: 'Transfer pending', description: 'Complete wallet transfer' },
  ];
}

// ============================================================
// ASSISTANT FUNCTIONS
// ============================================================

export async function createAssistantSession(
  userId: string,
  sessionType: AssistantSessionType,
  options?: {
    languageCode?: SupportedLanguage;
    startContext?: Record<string, unknown>;
  }
): Promise<AIAssistantSession> {
  const { data, error } = await supabase
    .from('ai_assistant_sessions')
    .insert({
      user_id: userId,
      session_type: sessionType,
      language_code: options?.languageCode || 'en',
      start_context: options?.startContext || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data as AIAssistantSession;
}

export async function updateAssistantSession(
  sessionId: string,
  updates: Partial<AIAssistantSession>
): Promise<AIAssistantSession> {
  const { data, error } = await supabase
    .from('ai_assistant_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data as AIAssistantSession;
}

export async function getAssistantIntents(): Promise<Array<{ intent_code: string; intent_name: string; category: string }>> {
  const { data, error } = await supabase
    .from('ai_assistant_intents')
    .select('intent_code, intent_name, category')
    .eq('is_active', true);

  if (error) throw error;
  return data || [];
}

export function getAssistantArchitecture(): Record<AssistantCategory, { intents: string[]; description: string }> {
  return {
    smartcode_help: {
      intents: ['smartcode_what', 'smartcode_enter', 'smartcode_points', 'smartcode_winners'],
      description: 'Help with SmartCode weekly challenge',
    },
    marketplace_help: {
      intents: ['marketplace_browse', 'marketplace_order'],
      description: 'Help with marketplace shopping',
    },
    careclub_help: {
      intents: ['careclub_join', 'careclub_points'],
      description: 'Help with Care Club contributions',
    },
    wallet_help: {
      intents: ['wallet_balance', 'wallet_transfer'],
      description: 'Help with wallet operations',
    },
    insurance_help: {
      intents: ['insurance_info'],
      description: 'Help with insurance coverage',
    },
    partner_help: {
      intents: ['partner_apply'],
      description: 'Help with partner program',
    },
    order_tracking: {
      intents: ['order_track'],
      description: 'Track order status',
    },
    refund_help: {
      intents: ['refund_request'],
      description: 'Help with refund requests',
    },
    account_help: {
      intents: ['account_update'],
      description: 'Help with account management',
    },
    future_project_guide: {
      intents: ['future_projects'],
      description: 'Guide to future projects',
    },
  };
}

// ============================================================
// VOICE AI FUNCTIONS
// ============================================================

export async function createVoiceSession(
  userId: string,
  sessionType: VoiceSessionType,
  languageCode: SupportedLanguage = 'en'
): Promise<VoiceAISession> {
  const { data, error } = await supabase
    .from('voice_ai_sessions')
    .insert({
      user_id: userId,
      session_type: sessionType,
      language_code: languageCode,
    })
    .select()
    .single();

  if (error) throw error;
  return data as VoiceAISession;
}

export async function updateVoiceSession(
  sessionId: string,
  updates: Partial<VoiceAISession>
): Promise<VoiceAISession> {
  const { data, error } = await supabase
    .from('voice_ai_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data as VoiceAISession;
}

export function getVoiceAIArchitecture(): Array<{ sessionType: VoiceSessionType; capabilities: string[] }> {
  return [
    { sessionType: 'smartcode_entry', capabilities: ['Voice-to-Text SmartCode', 'Points allocation', 'Confirmation'] },
    { sessionType: 'marketplace_search', capabilities: ['Product search', 'Voice navigation', 'Add to cart'] },
    { sessionType: 'order_tracking', capabilities: ['Order status query', 'Delivery update', 'Contact support'] },
    { sessionType: 'careclub_registration', capabilities: ['Contribution voice', 'Points confirmation', 'Receipt capture'] },
    { sessionType: 'wallet_operation', capabilities: ['Balance check', 'Transfer commands', 'History query'] },
    { sessionType: 'general_query', capabilities: ['FAQ response', 'Platform navigation', 'Support routing'] },
  ];
}

// ============================================================
// OCR COMMUNICATION FUNCTIONS
// ============================================================

export async function createOCRLog(
  userId: string,
  receiptUrl: string,
  smartcodeEntryId?: string
): Promise<OCRCommunicationLog> {
  const { data, error } = await supabase
    .from('ocr_communication_log')
    .insert({
      user_id: userId,
      smartcode_entry_id: smartcodeEntryId || null,
      ocr_status: 'uploaded',
      receipt_url: receiptUrl,
      receipt_uploaded_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as OCRCommunicationLog;
}

export async function updateOCRStatus(
  logId: string,
  status: OCRStatus,
  extractedData?: Record<string, unknown>
): Promise<OCRCommunicationLog> {
  const updateData: Record<string, unknown> = { ocr_status: status };
  if (extractedData) updateData.extracted_data = extractedData;

  const { data, error } = await supabase
    .from('ocr_communication_log')
    .update(updateData)
    .eq('id', logId)
    .select()
    .single();

  if (error) throw error;
  return data as OCRCommunicationLog;
}

export function getOCRStatusFlow(): Array<{ status: OCRStatus; action: string; nextStatus: OCRStatus | null }> {
  return [
    { status: 'uploaded', action: 'OCR processing starts', nextStatus: 'processing' },
    { status: 'processing', action: 'AI extracts data', nextStatus: 'verified' },
    { status: 'verified', action: 'Data confirmed', nextStatus: null },
    { status: 'failed', action: 'Manual review required', nextStatus: 'manual_review' },
    { status: 'manual_review', action: 'Admin reviews', nextStatus: 'verified' },
  ];
}

// ============================================================
// ADMIN COMMUNICATION FUNCTIONS
// ============================================================

export async function createAdminAlert(
  alert: Partial<AdminCommunicationCenter>
): Promise<AdminCommunicationCenter> {
  const { data, error } = await supabase
    .from('admin_communication_center')
    .insert(alert)
    .select()
    .single();

  if (error) throw error;
  return data as AdminCommunicationCenter;
}

export async function getAdminAlerts(
  options?: { activeOnly?: boolean; alertType?: AdminAlertType }
): Promise<AdminCommunicationCenter[]> {
  let query = supabase.from('admin_communication_center').select('*');

  if (options?.activeOnly) {
    query = query.eq('is_active', true);
  }
  if (options?.alertType) {
    query = query.eq('alert_type', options.alertType);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AdminCommunicationCenter[];
}

export function getAdminAlertCategories(): Array<{ type: AdminAlertType; severity: AlertSeverity; useCase: string }> {
  return [
    { type: 'customer', severity: 'medium', useCase: 'Customer behavior alerts' },
    { type: 'merchant', severity: 'medium', useCase: 'Merchant performance issues' },
    { type: 'partner', severity: 'medium', useCase: 'Partner updates' },
    { type: 'system', severity: 'high', useCase: 'System maintenance/issues' },
    { type: 'fraud', severity: 'critical', useCase: 'Fraud detection alerts' },
    { type: 'security', severity: 'critical', useCase: 'Security breach alerts' },
    { type: 'weekly_report', severity: 'low', useCase: 'Weekly AI reports' },
  ];
}

// ============================================================
// PREFERENCES FUNCTIONS
// ============================================================

export async function getNotificationPreferences(userId: string): Promise<UserNotificationPreferences[]> {
  const { data, error } = await supabase
    .from('user_notification_preferences')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []) as UserNotificationPreferences[];
}

export async function updateNotificationPreferences(
  userId: string,
  categoryCode: NotificationCategory,
  preferences: Partial<UserNotificationPreferences>
): Promise<void> {
  const { error } = await supabase
    .from('user_notification_preferences')
    .upsert(
      {
        user_id: userId,
        category_code: categoryCode,
        ...preferences,
      },
      { onConflict: 'user_id,category_code' }
    );

  if (error) throw error;
}

// ============================================================
// STATISTICS FUNCTIONS
// ============================================================

export async function getCommunicationStats(): Promise<{
  notifications_today: number;
  notifications_unread: number;
  reminders_active: number;
  assistant_sessions_today: number;
  voice_sessions_today: number;
  ocr_pending: number;
  language_distribution: Record<string, number>;
}> {
  const { data, error } = await supabase.rpc('get_communication_stats');

  if (error) throw error;
  return data;
}

// ============================================================
// MULTI-LANGUAGE HELPER
// ============================================================

export async function getSupportedLanguages(): Promise<Array<{ code: SupportedLanguage; name: string; native: string }>> {
  const { data, error } = await supabase
    .from('supported_languages')
    .select('code, name, native_name')
    .eq('is_active', true);

  if (error) throw error;
  return (data || []).map(l => ({
    code: l.code as SupportedLanguage,
    name: l.name,
    native: l.native_name,
  }));
}

export function getLanguageArchitecture(): Array<{ code: SupportedLanguage; voiceReady: boolean; textReady: boolean }> {
  return [
    { code: 'en', voiceReady: true, textReady: true },
    { code: 'ml', voiceReady: false, textReady: true },
    { code: 'hi', voiceReady: false, textReady: true },
    { code: 'ar', voiceReady: false, textReady: true },
    { code: 'ta', voiceReady: false, textReady: true },
    { code: 'te', voiceReady: false, textReady: true },
    { code: 'kn', voiceReady: false, textReady: true },
    { code: 'bn', voiceReady: false, textReady: true },
    { code: 'mr', voiceReady: false, textReady: true },
    { code: 'gu', voiceReady: false, textReady: true },
  ];
}
