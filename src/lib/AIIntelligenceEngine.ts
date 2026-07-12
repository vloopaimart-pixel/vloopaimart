/**
 * VLOOP AI INTELLIGENCE & AUTOMATION ENGINE
 * Phase 6 — AI Assistants, Trust Engine, Fraud Detection, OCR Layer
 */

import { supabase } from './supabase';

export const AI_INTELLIGENCE_VERSION = '6.0.0' as const;

// ============================================================
// AI ASSISTANT TYPES
// ============================================================

export const AI_ASSISTANT_TYPES = {
  UNIVERSAL: 'universal',
  SHOPPING: 'shopping',
  LEARNING: 'learning',
  MERCHANT: 'merchant',
  ESSENTIAL_SERVICES: 'essential_services',
  VOICE: 'voice',
} as const;

export type AIAssistantType = typeof AI_ASSISTANT_TYPES[keyof typeof AI_ASSISTANT_TYPES];

export const AI_ASSISTANT_LABELS: Record<AIAssistantType, string> = {
  universal: 'VLOOP AI Assistant',
  shopping: 'AI Shopping Assistant',
  learning: 'AI Learning Guide',
  merchant: 'AI Merchant Partner',
  essential_services: 'AI Services Guide',
  voice: 'Voice Mode AI',
};

// ============================================================
// AI CONVERSATION TYPES
// ============================================================

export const CONVERSATION_STATUS = {
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  ABANDONED: 'abandoned',
  ESCALATED: 'escalated',
} as const;

export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const;

export const MESSAGE_TYPES = {
  TEXT: 'text',
  PRODUCT_RECOMMENDATION: 'product_recommendation',
  SERVICE_SUGGESTION: 'service_suggestion',
  LEARNING_PATH: 'learning_path',
  MERCHANT_INSIGHT: 'merchant_insight',
  QUIZ_HINT: 'quiz_hint',
  SMARTCODE_HELP: 'smartcode_help',
  ORDER_STATUS: 'order_status',
  WALLET_INFO: 'wallet_info',
  EMERGENCY_HELP: 'emergency_help',
} as const;

// ============================================================
// FRAUD DETECTION TYPES
// ============================================================

export const FRAUD_TYPES = {
  DUPLICATE_ACCOUNT: 'duplicate_account',
  FAKE_IDENTITY: 'fake_identity',
  DEVICE_ABUSE: 'device_abuse',
  MULTIPLE_IDENTITY: 'multiple_identity',
  SUSPICIOUS_BEHAVIOR: 'suspicious_behavior',
  PROMOTION_ABUSE: 'promotion_abuse',
  REFERRAL_FRAUD: 'referral_fraud',
  TRANSACTION_FRAUD: 'transaction_fraud',
  COLLUSION: 'collusion',
  AUTOMATION_ABUSE: 'automation_abuse',
} as const;

export const FRAUD_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const FRAUD_STATUS = {
  DETECTED: 'detected',
  INVESTIGATING: 'investigating',
  CONFIRMED: 'confirmed',
  FALSE_POSITIVE: 'false_positive',
  RESOLVED: 'resolved',
} as const;

// ============================================================
// TRUST ENGINE TYPES
// ============================================================

export const TRUST_FACTORS = {
  ACCOUNT_AGE: 'account_age',
  ACTIVITY_CONSISTENCY: 'activity_consistency',
  VERIFICATION_LEVEL: 'verification_level',
  SOCIAL_PROOF: 'social_proof',
  TRANSACTION_HISTORY: 'transaction_history',
  COMMUNITY_REPUTATION: 'community_reputation',
  SMARTCODE_CONSISTENCY: 'smartcode_consistency',
  ENGAGEMENT_QUALITY: 'engagement_quality',
} as const;

export const TRUST_LEVELS = {
  NEW: 'new',
  BASIC: 'basic',
  VERIFIED: 'verified',
  TRUSTED: 'trusted',
  ELITE: 'elite',
} as const;

// ============================================================
// OCR TYPES
// ============================================================

export const OCR_DOCUMENT_TYPES = {
  SMARTCODE_RECEIPT: 'smartcode_receipt',
  PRODUCT_LABEL: 'product_label',
  BILL_RECEIPT: 'bill_receipt',
  ID_DOCUMENT: 'id_document',
  INVOICE: 'invoice',
} as const;

export const OCR_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REQUIRES_REVIEW: 'requires_review',
} as const;

// ============================================================
// RECOMMENDATION TYPES
// ============================================================

export const RECOMMENDATION_TYPES = {
  PRODUCT: 'product',
  LEARNING: 'learning',
  SERVICE: 'service',
  MERCHANT: 'merchant',
  DEAL: 'deal',
  COMMUNITY: 'community',
} as const;

// ============================================================
// INTERFACES
// ============================================================

export interface AIConversation {
  id: string;
  user_id: string;
  session_id: string;
  assistant_type: AIAssistantType;
  status: string;
  message_count: number;
  resolved_query: boolean;
  satisfaction_rating: number | null;
  feedback_notes: string | null;
  context_data: Record<string, unknown> | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  message_type: string;
  content: string;
  metadata: Record<string, unknown> | null;
  is_helpful: boolean | null;
  created_at: string;
}

export interface AIShoppingAssistantLog {
  id: string;
  user_id: string;
  conversation_id: string | null;
  query_text: string;
  intent_detected: string;
  products_recommended: string[];
  products_clicked: string[];
  products_purchased: string[];
  recommendation_strategy: string;
  confidence_score: number;
  created_at: string;
}

export interface AILearningProgress {
  id: string;
  user_id: string;
  learning_style: string;
  preferred_difficulty: string;
  topics_completed: string[];
  current_topic: string | null;
  quiz_scores: Record<string, number>;
  time_spent_minutes: number;
  ai_recommendations: string[];
  strengths: string[];
  areas_to_improve: string[];
  created_at: string;
  updated_at: string;
}

export interface AIMerchantInsight {
  id: string;
  merchant_id: string;
  insight_type: string;
  insight_title: string;
  insight_description: string;
  recommendation: string;
  priority: string;
  data_source: string;
  insight_data: Record<string, unknown>;
  is_read: boolean;
  is_actioned: boolean;
  valid_from: string;
  valid_until: string | null;
  created_at: string;
}

export interface AIServiceGuide {
  id: string;
  user_id: string;
  conversation_id: string | null;
  service_type: string;
  user_intent: string;
  services_recommended: string[];
  provider_suggestions: string[];
  cost_estimates: Record<string, number>;
  tips_provided: string[];
  user_feedback: string | null;
  created_at: string;
}

export interface AIVoiceSession {
  id: string;
  user_id: string;
  session_token: string;
  language: string;
  commands_processed: number;
  successful_commands: number;
  failed_commands: number;
  avg_response_time_ms: number;
  session_duration_seconds: number;
  end_reason: string | null;
  created_at: string;
  ended_at: string | null;
}

export interface AIOCRRequest {
  id: string;
  user_id: string;
  document_type: string;
  image_url: string;
  extracted_text: string | null;
  extracted_data: Record<string, unknown> | null;
  confidence_score: number;
  processing_time_ms: number;
  status: string;
  error_message: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface AITrustEngineLog {
  id: string;
  user_id: string;
  trust_score_before: number;
  trust_score_after: number;
  trust_level: string;
  factor_scores: Record<string, number>;
  risk_indicators: string[];
  verification_flags: string[];
  ai_confidence: number;
  analysis_type: string;
  created_at: string;
}

export interface AIFraudDetectionLog {
  id: string;
  user_id: string | null;
  fraud_type: string;
  severity: string;
  status: string;
  detection_method: string;
  risk_score: number;
  indicators: string[];
  evidence_data: Record<string, unknown>;
  ai_confidence: number;
  false_positive_probability: number;
  assigned_to: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface AIRecommendationWeight {
  id: string;
  user_id: string;
  recommendation_type: string;
  category_weights: Record<string, number>;
  brand_affinities: Record<string, number>;
  price_range_preference: Record<string, number>;
  time_preferences: Record<string, number>;
  learning_topic_affinities: Record<string, number>;
  service_usage_patterns: Record<string, number>;
  social_influence_weight: number;
  recency_bias: number;
  diversity_factor: number;
  updated_at: string;
}

export interface AIGlobalConfig {
  id: string;
  country_code: string;
  language_code: string;
  assistant_personality: string;
  supported_intents: string[];
  localized_responses: Record<string, string>;
  cultural_adjustments: Record<string, unknown>;
  measurement_units: string;
  currency_format: string;
  date_format: string;
  is_active: boolean;
}

export interface AIFeatureFlag {
  id: string;
  feature_name: string;
  feature_description: string;
  is_enabled: boolean;
  rollout_percentage: number;
  target_user_groups: string[];
  target_regions: string[];
  config_data: Record<string, unknown>;
  updated_at: string;
}

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function createConversation(
  userId: string,
  assistantType: AIAssistantType,
  sessionId: string,
  contextData?: Record<string, unknown>
): Promise<AIConversation> {
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      user_id: userId,
      session_id: sessionId,
      assistant_type: assistantType,
      status: 'active',
      context_data: contextData || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as AIConversation;
}

export async function getConversation(sessionId: string): Promise<AIConversation | null> {
  const { data, error } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('session_id', sessionId)
    .eq('status', 'active')
    .maybeSingle();
  if (error) throw error;
  return data as AIConversation | null;
}

export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  messageType: string = 'text',
  metadata?: Record<string, unknown>
): Promise<AIMessage> {
  const { data, error } = await supabase
    .from('ai_messages')
    .insert({
      conversation_id: conversationId,
      role,
      message_type: messageType,
      content,
      metadata: metadata || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as AIMessage;
}

export async function getMessages(conversationId: string, limit: number = 50): Promise<AIMessage[]> {
  const { data, error } = await supabase
    .from('ai_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data || []) as AIMessage[];
}

export async function endConversation(
  conversationId: string,
  resolved: boolean = true,
  rating?: number,
  feedback?: string
): Promise<void> {
  const { error } = await supabase
    .from('ai_conversations')
    .update({
      status: 'resolved',
      resolved_query: resolved,
      satisfaction_rating: rating || null,
      feedback_notes: feedback || null,
      ended_at: new Date().toISOString(),
    })
    .eq('id', conversationId);
  if (error) throw error;
}

export async function logShoppingInteraction(
  userId: string,
  query: string,
  intent: string,
  products: string[],
  strategy: string,
  confidence: number,
  conversationId?: string
): Promise<void> {
  const { error } = await supabase
    .from('ai_shopping_assistant_logs')
    .insert({
      user_id: userId,
      conversation_id: conversationId || null,
      query_text: query,
      intent_detected: intent,
      products_recommended: products,
      recommendation_strategy: strategy,
      confidence_score: confidence,
    });
  if (error) console.error('Failed to log shopping interaction:', error);
}

export async function getLearningProgress(userId: string): Promise<AILearningProgress | null> {
  const { data, error } = await supabase
    .from('ai_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as AILearningProgress | null;
}

export async function updateLearningProgress(
  userId: string,
  updates: Partial<AILearningProgress>
): Promise<void> {
  const { error } = await supabase
    .from('ai_learning_progress')
    .upsert({
      user_id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function getMerchantInsights(merchantId: string): Promise<AIMerchantInsight[]> {
  const { data, error } = await supabase
    .from('ai_merchant_insights')
    .select('*')
    .eq('merchant_id', merchantId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as AIMerchantInsight[];
}

export async function createOCRRequest(
  userId: string,
  documentType: string,
  imageUrl: string
): Promise<AIOCRRequest> {
  const { data, error } = await supabase
    .from('ai_ocr_requests')
    .insert({
      user_id: userId,
      document_type: documentType,
      image_url: imageUrl,
      status: 'pending',
    })
    .select()
    .single();
  if (error) throw error;
  return data as AIOCRRequest;
}

export async function getTrustEngineLog(userId: string, limit: number = 10): Promise<AITrustEngineLog[]> {
  const { data, error } = await supabase
    .from('ai_trust_engine_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as AITrustEngineLog[];
}

export async function getFraudLogs(status?: string, limit: number = 50): Promise<AIFraudDetectionLog[]> {
  let query = supabase
    .from('ai_fraud_detection_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AIFraudDetectionLog[];
}

export async function getRecommendationWeights(userId: string): Promise<AIRecommendationWeight | null> {
  const { data, error } = await supabase
    .from('ai_recommendation_weights')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as AIRecommendationWeight | null;
}

export async function getAIFeatureFlags(): Promise<AIFeatureFlag[]> {
  const { data, error } = await supabase
    .from('ai_feature_flags')
    .select('*')
    .eq('is_enabled', true);
  if (error) throw error;
  return (data || []) as AIFeatureFlag[];
}

export async function getAIGlobalConfigs(): Promise<AIGlobalConfig[]> {
  const { data, error } = await supabase
    .from('ai_global_configs')
    .select('*')
    .eq('is_active', true);
  if (error) throw error;
  return (data || []) as AIGlobalConfig[];
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getAssistantColor(type: AIAssistantType): string {
  switch (type) {
    case 'shopping': return 'from-blue-500 to-indigo-600';
    case 'learning': return 'from-emerald-500 to-teal-600';
    case 'merchant': return 'from-amber-500 to-orange-600';
    case 'essential_services': return 'from-rose-500 to-pink-600';
    case 'voice': return 'from-violet-500 to-purple-600';
    default: return 'from-cyan-500 to-blue-600';
  }
}

export function getAssistantIcon(type: AIAssistantType): string {
  switch (type) {
    case 'shopping': return 'ShoppingBag';
    case 'learning': return 'GraduationCap';
    case 'merchant': return 'Store';
    case 'essential_services': return 'Zap';
    case 'voice': return 'Mic';
    default: return 'Bot';
  }
}

export function getFraudSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-amber-500 text-white';
    default: return 'bg-blue-500 text-white';
  }
}

export function getFraudStatusColor(status: string): string {
  switch (status) {
    case 'confirmed': return 'bg-red-100 text-red-700';
    case 'investigating': return 'bg-amber-100 text-amber-700';
    case 'detected': return 'bg-orange-100 text-orange-700';
    case 'false_positive': return 'bg-emerald-100 text-emerald-700';
    case 'resolved': return 'bg-slate-100 text-slate-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function getTrustLevelColor(level: string): string {
  switch (level) {
    case 'elite': return 'from-amber-400 to-yellow-500';
    case 'trusted': return 'from-emerald-400 to-teal-500';
    case 'verified': return 'from-blue-400 to-indigo-500';
    case 'basic': return 'from-slate-400 to-gray-500';
    default: return 'from-gray-300 to-slate-400';
  }
}

export function getTrustScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-500';
  if (score >= 70) return 'text-blue-500';
  if (score >= 50) return 'text-amber-500';
  if (score >= 30) return 'text-orange-500';
  return 'text-red-500';
}

export function getIntentLabel(intent: string): string {
  const labels: Record<string, string> = {
    product_search: 'Product Search',
    price_comparison: 'Price Comparison',
    deal_hunting: 'Deal Hunting',
    category_browse: 'Category Browsing',
    brand_search: 'Brand Search',
    recommendation_request: 'Get Recommendations',
    order_status: 'Order Status',
    smartcode_help: 'SmartCode Help',
    wallet_balance: 'Wallet Balance',
    learning_path: 'Learning Path',
    service_payment: 'Service Payment',
    emergency_help: 'Emergency Help',
  };
  return labels[intent] || intent;
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockConversations(): AIConversation[] {
  return [
    {
      id: 'conv1',
      user_id: 'user-1',
      session_id: 'sess-001',
      assistant_type: 'universal',
      status: 'active',
      message_count: 5,
      resolved_query: false,
      satisfaction_rating: null,
      feedback_notes: null,
      context_data: { current_page: 'home' },
      started_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      ended_at: null,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
  ];
}

export function getMockMessages(): AIMessage[] {
  return [
    { id: 'm1', conversation_id: 'conv1', role: 'user', message_type: 'text', content: 'Show me the best deals available today', metadata: null, is_helpful: null, created_at: new Date(Date.now() - 9 * 60 * 1000).toISOString() },
    { id: 'm2', conversation_id: 'conv1', role: 'assistant', message_type: 'text', content: 'I found 3 great deals for you today! There\'s a 40% discount on electronics, a buy-1-get-1 offer on groceries, and free delivery on orders above ₹500. Would you like me to show you more details?', metadata: { deals_count: 3 }, is_helpful: null, created_at: new Date(Date.now() - 9 * 60 * 1000 + 2000).toISOString() },
    { id: 'm3', conversation_id: 'conv1', role: 'user', message_type: 'text', content: 'Tell me more about the electronics deal', metadata: null, is_helpful: null, created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
    { id: 'm4', conversation_id: 'conv1', role: 'assistant', message_type: 'product_recommendation', content: 'The electronics flash sale includes smartphones, laptops, and accessories. Top picks: Samsung Galaxy A54 at ₹24,999 (30% off), boat earbuds at ₹1,299 (50% off). Valid until midnight today!', metadata: { products: ['p1', 'p2'] }, is_helpful: null, created_at: new Date(Date.now() - 8 * 60 * 1000 + 3000).toISOString() },
  ];
}

export function getMockShoppingLogs(): AIShoppingAssistantLog[] {
  return [
    {
      id: 'sl1',
      user_id: 'user-1',
      conversation_id: 'conv1',
      query_text: 'Show me best deals',
      intent_detected: 'deal_hunting',
      products_recommended: ['p1', 'p2', 'p3'],
      products_clicked: ['p1'],
      products_purchased: [],
      recommendation_strategy: 'trending_deals',
      confidence_score: 0.92,
      created_at: new Date().toISOString(),
    },
  ];
}

export function getMockLearningProgress(): AILearningProgress {
  return {
    id: 'lp1',
    user_id: 'user-1',
    learning_style: 'visual',
    preferred_difficulty: 'intermediate',
    topics_completed: ['VLOOP Basics', 'SmartCode Introduction', 'Trust Score Guide'],
    current_topic: 'SmartPoints Earning',
    quiz_scores: { 'VLOOP Basics': 85, 'SmartCode Introduction': 92 },
    time_spent_minutes: 45,
    ai_recommendations: ['Complete SmartPoints Earning quiz', 'Watch video on Trust Score improvement'],
    strengths: ['Quick learner', 'Good quiz performance'],
    areas_to_improve: ['More hands-on practice', 'Watch more video tutorials'],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function getMockMerchantInsights(): AIMerchantInsight[] {
  return [
    {
      id: 'mi1',
      merchant_id: 'merchant-1',
      insight_type: 'sales_opportunity',
      insight_title: 'Demand Spike Detected',
      insight_description: 'Your electronics category shows 45% higher search volume this week.',
      recommendation: 'Consider running a promotional offer or restocking popular items.',
      priority: 'high',
      data_source: 'search_analytics',
      insight_data: { category: 'electronics', spike_percent: 45 },
      is_read: false,
      is_actioned: false,
      valid_from: new Date().toISOString(),
      valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'mi2',
      merchant_id: 'merchant-1',
      insight_type: 'inventory_alert',
      insight_title: 'Low Stock Warning',
      insight_description: '3 of your top-selling products are below 10 units.',
      recommendation: 'Restock within 2-3 days to avoid stockouts.',
      priority: 'medium',
      data_source: 'inventory_system',
      insight_data: { products: ['SKU-001', 'SKU-042', 'SKU-089'] },
      is_read: false,
      is_actioned: false,
      valid_from: new Date().toISOString(),
      valid_until: null,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getMockServiceGuides(): AIServiceGuide[] {
  return [
    {
      id: 'sg1',
      user_id: 'user-1',
      conversation_id: null,
      service_type: 'electricity',
      user_intent: 'bill_payment',
      services_recommended: ['electricity'],
      provider_suggestions: ['BESCOM', 'Tata Power'],
      cost_estimates: { convenience_fee: 0 },
      tips_provided: ['Check due date to avoid late fees', 'Set up auto-pay for convenience'],
      user_feedback: null,
      created_at: new Date().toISOString(),
    },
  ];
}

export function getMockVoiceSessions(): AIVoiceSession[] {
  return [
    {
      id: 'vs1',
      user_id: 'user-1',
      session_token: 'voice-sess-001',
      language: 'en-IN',
      commands_processed: 8,
      successful_commands: 7,
      failed_commands: 1,
      avg_response_time_ms: 450,
      session_duration_seconds: 180,
      end_reason: 'user_ended',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      ended_at: new Date(Date.now() - 24 * 60 * 60 * 1000 + 180 * 1000).toISOString(),
    },
  ];
}

export function getMockOCRRequests(): AIOCRRequest[] {
  return [
    {
      id: 'ocr1',
      user_id: 'user-1',
      document_type: 'smartcode_receipt',
      image_url: 'https://example.com/image.jpg',
      extracted_text: 'SmartCode: 789, Date: 2024-01-15',
      extracted_data: { smartcode: '789', date: '2024-01-15' },
      confidence_score: 0.95,
      processing_time_ms: 1200,
      status: 'completed',
      error_message: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getMockTrustEngineLogs(): AITrustEngineLog[] {
  return [
    {
      id: 'te1',
      user_id: 'user-1',
      trust_score_before: 60,
      trust_score_after: 65,
      trust_level: 'verified',
      factor_scores: { account_age: 80, activity_consistency: 70, verification_level: 60 },
      risk_indicators: [],
      verification_flags: [],
      ai_confidence: 0.88,
      analysis_type: 'weekly_update',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getMockFraudLogs(): AIFraudDetectionLog[] {
  return [
    {
      id: 'fl1',
      user_id: 'suspicious-user-42',
      fraud_type: 'duplicate_account',
      severity: 'high',
      status: 'investigating',
      detection_method: 'device_fingerprint',
      risk_score: 85,
      indicators: ['Same device ID', 'Similar email pattern', 'Matching IP range'],
      evidence_data: { device_id: 'DEV-12345', ip_range: '192.168.1.x' },
      ai_confidence: 0.92,
      false_positive_probability: 0.08,
      assigned_to: 'admin-1',
      resolution_notes: null,
      resolved_at: null,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'fl2',
      user_id: null,
      fraud_type: 'automation_abuse',
      severity: 'critical',
      status: 'detected',
      detection_method: 'behavior_pattern',
      risk_score: 95,
      indicators: ['Bot-like request patterns', 'Superhuman speed', 'Multiple accounts targeted'],
      evidence_data: { requests_per_second: 50, user_agents: ['curl', 'python-requests'] },
      ai_confidence: 0.98,
      false_positive_probability: 0.02,
      assigned_to: null,
      resolution_notes: null,
      resolved_at: null,
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'fl3',
      user_id: 'user-500',
      fraud_type: 'promotion_abuse',
      severity: 'medium',
      status: 'false_positive',
      detection_method: 'multi_factor',
      risk_score: 45,
      indicators: ['Multiple promotions used', 'Order pattern variation'],
      evidence_data: { promotions_used: 5, order_count: 12 },
      ai_confidence: 0.65,
      false_positive_probability: 0.55,
      assigned_to: 'admin-1',
      resolution_notes: 'User has legitimate family orders - not abuse',
      resolved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export function getMockRecommendationWeights(): AIRecommendationWeight {
  return {
    id: 'rw1',
    user_id: 'user-1',
    recommendation_type: 'hybrid',
    category_weights: { electronics: 0.35, groceries: 0.25, fashion: 0.20, home: 0.20 },
    brand_affinities: { samsung: 0.8, boat: 0.6, nike: 0.5 },
    price_range_preference: { min: 500, max: 5000, preferred: 2000 },
    time_preferences: { peak_hours: Number([10, 14, 20]), weekend_boost: 1.2 },
    learning_topic_affinities: { technology: 0.7, finance: 0.5, health: 0.3 },
    service_usage_patterns: { electricity: 1.5, mobile: 2.0, broadband: 1.0 },
    social_influence_weight: 0.3,
    recency_bias: 0.4,
    diversity_factor: 0.25,
    updated_at: new Date().toISOString(),
  };
}

export function getMockAIFeatureFlags(): AIFeatureFlag[] {
  return [
    {
      id: 'ff1',
      feature_name: 'ai_shopping_assistant',
      feature_description: 'AI-powered shopping recommendations and product search',
      is_enabled: true,
      rollout_percentage: 100,
      target_user_groups: ['all'],
      target_regions: ['IN', 'US', 'UK'],
      config_data: { max_suggestions: 5, cache_ttl: 300 },
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ff2',
      feature_name: 'ai_voice_mode',
      feature_description: 'Voice-enabled AI assistant for hands-free interaction',
      is_enabled: false,
      rollout_percentage: 0,
      target_user_groups: ['beta_testers'],
      target_regions: ['IN'],
      config_data: { languages: ['en-IN', 'hi-IN'] },
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ff3',
      feature_name: 'ai_ocr_layer',
      feature_description: 'OCR parsing for paper SmartCodes and receipts',
      is_enabled: true,
      rollout_percentage: 50,
      target_user_groups: ['trusted', 'verified'],
      target_regions: ['IN'],
      config_data: { supported_formats: ['jpg', 'png'], max_file_size: 5 },
      updated_at: new Date().toISOString(),
    },
    {
      id: 'ff4',
      feature_name: 'ai_fraud_detection',
      feature_description: 'Real-time fraud detection and prevention',
      is_enabled: true,
      rollout_percentage: 100,
      target_user_groups: ['all'],
      target_regions: ['all'],
      config_data: { sensitivity: 'high', auto_block_threshold: 90 },
      updated_at: new Date().toISOString(),
    },
  ];
}

export function getMockGlobalConfigs(): AIGlobalConfig[] {
  return [
    {
      id: 'gc1',
      country_code: 'IN',
      language_code: 'en-IN',
      assistant_personality: 'friendly_helpful',
      supported_intents: ['product_search', 'deal_hunting', 'service_payment', 'smartcode_help'],
      localized_responses: { greeting: 'Hello! How can I help you today?', farewell: 'Thank you for using VLOOP!' },
      cultural_adjustments: { formality_level: 'moderate', use_honorifics: true },
      measurement_units: 'metric',
      currency_format: 'INR',
      date_format: 'DD/MM/YYYY',
      is_active: true,
    },
    {
      id: 'gc2',
      country_code: 'US',
      language_code: 'en-US',
      assistant_personality: 'friendly_casual',
      supported_intents: ['product_search', 'deal_hunting', 'service_payment', 'smartcode_help'],
      localized_responses: { greeting: 'Hi there! What can I help you with?', farewell: 'Thanks for stopping by!' },
      cultural_adjustments: { formality_level: 'casual', use_honorifics: false },
      measurement_units: 'imperial',
      currency_format: 'USD',
      date_format: 'MM/DD/YYYY',
      is_active: true,
    },
  ];
}
