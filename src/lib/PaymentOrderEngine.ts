/**
 * VLOOP GLOBAL PAYMENT, ORDER & TRANSACTION ENGINE
 * Phase 42 — Enterprise Payment & Order Management Layer
 *
 * This engine provides the complete architecture for:
 * - Order Life Cycle Management
 * - Payment Processing Architecture
 * - Transaction Audit Logging
 * - Fraud Detection Integration
 * - Merchant Order Management
 * - Admin Control Panels
 * - Notification Architecture
 *
 * No real payment integration. Architecture only.
 */

import { supabase } from './supabase';

export const PAYMENT_ORDER_ENGINE_VERSION = '42.0.0' as const;

export const PAYMENT_ORDER_ENGINE_META = {
  version: PAYMENT_ORDER_ENGINE_VERSION,
  name: 'VLOOP Global Payment & Order Engine',
  lockedSince: '2026-07-03',
} as const;

// ============================================================
// ORDER STATUS CONSTANTS
// ============================================================

export const ORDER_STATUS = {
  DRAFT: 'draft',
  CONFIRMED: 'confirmed',
  PACKED: 'packed',
  DISPATCHED: 'dispatched',
  TRANSIT: 'transit',
  DELIVERED: 'delivered',
  RETURNED: 'returned',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: 'Draft',
  confirmed: 'Confirmed',
  packed: 'Packed',
  dispatched: 'Dispatched',
  transit: 'In Transit',
  delivered: 'Delivered',
  returned: 'Returned',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
  completed: 'Completed',
};

export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  draft: ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled', 'rejected'],
  packed: ['dispatched', 'cancelled'],
  dispatched: ['transit', 'cancelled'],
  transit: ['delivered', 'returned', 'cancelled'],
  delivered: ['completed', 'returned'],
  returned: ['completed', 'cancelled'],
  cancelled: [],
  rejected: ['confirmed', 'cancelled'],
  completed: [],
};

// ============================================================
// PAYMENT CONSTANTS
// ============================================================

export const PAYMENT_METHODS = {
  UPI: 'upi',
  DEBIT_CARD: 'debit_card',
  CREDIT_CARD: 'credit_card',
  NET_BANKING: 'net_banking',
  WALLET: 'wallet',
  INTERNATIONAL: 'international',
  COD: 'cod',
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  upi: 'UPI Payment',
  debit_card: 'Debit Card',
  credit_card: 'Credit Card',
  net_banking: 'Net Banking',
  wallet: 'VLOOP Wallet',
  international: 'International Payment',
  cod: 'Cash on Delivery',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  AUTHORIZED: 'authorized',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUND_PENDING: 'refund_pending',
  REFUND_COMPLETED: 'refund_completed',
  DISPUTED: 'disputed',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  authorized: 'Authorized',
  paid: 'Paid',
  failed: 'Failed',
  cancelled: 'Cancelled',
  refund_pending: 'Refund Pending',
  refund_completed: 'Refund Completed',
  disputed: 'Disputed',
};

// ============================================================
// TRANSACTION TYPES
// ============================================================

export const TRANSACTION_TYPES = {
  ORDER_CREATED: 'order_created',
  ORDER_UPDATED: 'order_updated',
  ORDER_CANCELLED: 'order_cancelled',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_REFUNDED: 'payment_refunded',
  WALLET_CREDIT: 'wallet_credit',
  WALLET_DEBIT: 'wallet_debit',
  SMARTCODE_GENERATED: 'smartcode_generated',
  POINTS_EARNED: 'points_earned',
  POINTS_REDEEMED: 'points_redeemed',
  CARECLUB_CONTRIBUTION: 'careclub_contribution',
  REWARD_PAID: 'reward_paid',
  SETTLEMENT_PROCESSED: 'settlement_processed',
  REFUND_PROCESSED: 'refund_processed',
  FLAG_RAISED: 'flag_raised',
  REVIEW_COMPLETED: 'review_completed',
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

export const REFERENCE_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  WALLET: 'wallet',
  SMARTCODE: 'smartcode',
  POINTS: 'points',
  CARECLUB: 'careclub',
  REWARD: 'reward',
  SETTLEMENT: 'settlement',
  REFUND: 'refund',
} as const;

export type ReferenceType = typeof REFERENCE_TYPES[keyof typeof REFERENCE_TYPES];

// ============================================================
// VALIDATION TYPES
// ============================================================

export const VALIDATION_TYPES = {
  DUPLICATE_DETECTION: 'duplicate_detection',
  FAKE_ORDER: 'fake_order',
  ABNORMAL_PURCHASE: 'abnormal_purchase',
  VELOCITY_CHECK: 'velocity_check',
  DEVICE_VALIDATION: 'device_validation',
  LOCATION_VALIDATION: 'location_validation',
  BEHAVIOR_ANALYSIS: 'behavior_analysis',
  FRAUD_CHECK: 'fraud_check',
} as const;

export type ValidationType = typeof VALIDATION_TYPES[keyof typeof VALIDATION_TYPES];

export const FRAUD_TYPES = {
  DUPLICATE_ORDER: 'duplicate_order',
  FAKE_PAYMENT: 'fake_payment',
  VELOCITY_ABUSE: 'velocity_abuse',
  LOCATION_MISMATCH: 'location_mismatch',
  DEVICE_MISMATCH: 'device_mismatch',
  SUSPICIOUS_PATTERN: 'suspicious_pattern',
  COLLUSION: 'collusion',
  REFUND_ABUSE: 'refund_abuse',
  COUPON_ABUSE: 'coupon_abuse',
} as const;

export type FraudType = typeof FRAUD_TYPES[keyof typeof FRAUD_TYPES];

export const FRAUD_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type FraudSeverity = typeof FRAUD_SEVERITY[keyof typeof FRAUD_SEVERITY];

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export const NOTIFICATION_CHANNELS = {
  SMS: 'sms',
  EMAIL: 'email',
  WHATSAPP: 'whatsapp',
  PUSH: 'push',
  IN_APP: 'in_app',
} as const;

export type NotificationChannel = typeof NOTIFICATION_CHANNELS[keyof typeof NOTIFICATION_CHANNELS];

export const NOTIFICATION_TYPES = {
  ORDER_CONFIRMED: 'order_confirmed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  REFUND_PROCESSED: 'refund_processed',
  SMARTCODE_WINNER: 'smartcode_winner',
  REWARD_CREDITED: 'reward_credited',
  WALLET_CREDIT: 'wallet_credit',
  WALLET_DEBIT: 'wallet_debit',
  PROMOTION: 'promotion',
  ALERT: 'alert',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

// ============================================================
// MERCHANT QUEUE STATUS
// ============================================================

export const MERCHANT_QUEUE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PACKING: 'packing',
  READY_DISPATCH: 'ready_dispatch',
  HANDED_OVER: 'handed_over',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type MerchantQueueStatus = typeof MERCHANT_QUEUE_STATUS[keyof typeof MERCHANT_QUEUE_STATUS];

// ============================================================
// TRACKING STATUS
// ============================================================

export const TRACKING_STATUS = {
  ORDER_PLACED: 'order_placed',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PACKED: 'packed',
  READY_DISPATCH: 'ready_dispatch',
  PICKED_UP: 'picked_up',
  TRANSIT: 'transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  RETURNED: 'returned',
  CANCELLED: 'cancelled',
} as const;

export type TrackingStatus = typeof TRACKING_STATUS[keyof typeof TRACKING_STATUS];

// ============================================================
// INTERFACES
// ============================================================

export interface PaymentMethodConfig {
  id: string;
  method_code: PaymentMethod;
  method_name: string;
  is_active: boolean;
  requires_verification: boolean;
  processing_fee_percentage: number;
  processing_fee_fixed: number;
  min_amount: number;
  max_amount: number | null;
  settlement_delay_hours: number;
  supported_countries: string[];
  gateway_provider: string | null;
}

export interface PaymentTransaction {
  id: string;
  transaction_id: string;
  order_id: string | null;
  user_id: string;
  merchant_id: string | null;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  gateway_transaction_id: string | null;
  gateway_response: Record<string, unknown>;
  authorization_code: string | null;
  refund_amount: number;
  refund_reason: string | null;
  refunded_at: string | null;
  failure_code: string | null;
  failure_message: string | null;
  retry_count: number;
  risk_score: number;
  risk_flags: Array<{ type: string; details: string }>;
  is_verified: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  seller_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_per_item: number;
  tax_amount: number;
  item_status: OrderStatus;
  seller_confirmed: boolean;
  seller_confirmed_at: string | null;
  seller_rejected_reason: string | null;
  smartpoints_earned: number;
  careclub_contribution: number;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  status_reason: string | null;
  changed_by: string | null;
  changed_by_type: 'customer' | 'merchant' | 'admin' | 'system' | null;
  location: string | null;
  notes: string | null;
  created_at: string;
}

export interface AIOrderValidation {
  id: string;
  order_id: string;
  user_id: string;
  validation_type: ValidationType;
  validation_status: 'pending' | 'passed' | 'failed' | 'reviewing';
  validation_score: number;
  threshold_score: number;
  is_passed: boolean;
  flags: Array<{ rule: string; score: number; details: string }>;
  recommendation: string | null;
  requires_manual_review: boolean;
}

export interface MerchantOrderQueue {
  id: string;
  order_id: string;
  order_item_id: string | null;
  seller_id: string;
  queue_status: MerchantQueueStatus;
  priority: number;
  estimated_packing_time: number | null;
  actual_packing_time: number | null;
  packing_started_at: string | null;
  packing_completed_at: string | null;
  ready_for_dispatch_at: string | null;
  is_rush_order: boolean;
  settlement_status: 'pending' | 'processing' | 'completed' | 'on_hold';
  settlement_amount: number | null;
}

export interface TransactionAuditLog {
  id: string;
  transaction_type: TransactionType;
  reference_type: ReferenceType;
  reference_id: string | null;
  user_id: string | null;
  merchant_id: string | null;
  admin_id: string | null;
  action: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  changes: Record<string, unknown>;
  amount: number | null;
  currency: string;
  ip_address: string | null;
  is_reversible: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface NotificationQueueItem {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  data: Record<string, unknown>;
  priority: number;
  status: 'pending' | 'processing' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  scheduled_at: string | null;
  sent_at: string | null;
}

export interface RefundQueueItem {
  id: string;
  order_id: string;
  payment_transaction_id: string | null;
  user_id: string;
  refund_type: 'full' | 'partial' | 'item' | 'shipping';
  refund_reason: string;
  requested_amount: number;
  approved_amount: number | null;
  refund_status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  processed_at: string | null;
  processed_by: string | null;
  rejection_reason: string | null;
  refund_to_wallet: boolean;
}

export interface LiveOrderTracking {
  id: string;
  order_id: string;
  tracking_status: TrackingStatus;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  carrier_name: string | null;
  carrier_tracking_id: string | null;
  delivery_partner_name: string | null;
  delivery_partner_phone: string | null;
  delivery_attempts: number;
  proof_of_delivery_url: string | null;
}

export interface FraudDetectionCase {
  id: string;
  reference_type: 'order' | 'payment' | 'user' | 'merchant';
  reference_id: string;
  user_id: string | null;
  fraud_type: FraudType;
  severity: FraudSeverity;
  fraud_score: number;
  detection_rules: Array<{ rule: string; triggered: boolean }>;
  evidence: Record<string, unknown>;
  status: 'open' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved' | 'escalated';
  assigned_to: string | null;
  action_taken: string | null;
}

// ============================================================
// PAYMENT FUNCTIONS
// ============================================================

export async function getPaymentMethods(): Promise<PaymentMethodConfig[]> {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data || []) as PaymentMethodConfig[];
}

export function generateTransactionId(): string {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '');
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TXN${timestamp.substring(0, 14)}-${random}`;
}

export async function createPaymentTransaction(
  orderId: string,
  userId: string,
  amount: number,
  paymentMethod: PaymentMethod,
  options?: {
    merchantId?: string;
    deviceFingerprint?: string;
    ipAddress?: string;
  }
): Promise<PaymentTransaction> {
  const { data, error } = await supabase
    .from('payment_transactions')
    .insert({
      transaction_id: generateTransactionId(),
      order_id: orderId,
      user_id: userId,
      amount,
      payment_method: paymentMethod,
      merchant_id: options?.merchantId || null,
      device_fingerprint: options?.deviceFingerprint || null,
      ip_address: options?.ipAddress || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PaymentTransaction;
}

export async function getPaymentTransaction(transactionId: string): Promise<PaymentTransaction | null> {
  const { data, error } = await supabase
    .from('payment_transactions')
    .select('*')
    .eq('transaction_id', transactionId)
    .maybeSingle();

  if (error) throw error;
  return data as PaymentTransaction | null;
}

export async function updatePaymentStatus(
  transactionId: string,
  status: PaymentStatus,
  options?: {
    gatewayResponse?: Record<string, unknown>;
    authorizationCode?: string;
    failureCode?: string;
    failureMessage?: string;
  }
): Promise<PaymentTransaction> {
  const updateData: Record<string, unknown> = { payment_status: status };
  if (options?.gatewayResponse) updateData.gateway_response = options.gatewayResponse;
  if (options?.authorizationCode) updateData.authorization_code = options.authorizationCode;
  if (options?.failureCode) updateData.failure_code = options.failureCode;
  if (options?.failureMessage) updateData.failure_message = options.failureMessage;

  const { data, error } = await supabase
    .from('payment_transactions')
    .update(updateData)
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data as PaymentTransaction;
}

// ============================================================
// ORDER FUNCTIONS
// ============================================================

export function isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  const allowedTransitions = ORDER_STATUS_FLOW[currentStatus];
  return allowedTransitions.includes(newStatus);
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  options?: {
    reason?: string;
    changedBy?: string;
    changedByType?: 'customer' | 'merchant' | 'admin' | 'system';
    location?: string;
    notes?: string;
  }
): Promise<void> {
  const { error } = await supabase.rpc('update_order_status', {
    p_order_id: orderId,
    p_new_status: newStatus,
    p_reason: options?.reason || null,
    p_changed_by: options?.changedBy || null,
    p_changed_by_type: options?.changedByType || 'system',
  });

  if (error) throw error;
}

export async function getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
  const { data, error } = await supabase
    .from('order_status_history')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as OrderStatusHistory[];
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;
  return (data || []) as OrderItem[];
}

export async function calculateOrderSmartPoints(orderId: string): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_order_smartpoints', {
    p_order_id: orderId,
  });

  if (error) throw error;
  return data;
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

export async function getAIOrderValidations(orderId: string): Promise<AIOrderValidation[]> {
  const { data, error } = await supabase
    .from('ai_order_validations')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;
  return (data || []) as AIOrderValidation[];
}

export async function createOrderValidation(
  validation: Partial<AIOrderValidation>
): Promise<AIOrderValidation> {
  const { data, error } = await supabase
    .from('ai_order_validations')
    .insert(validation)
    .select()
    .single();

  if (error) throw error;
  return data as AIOrderValidation;
}

export function getValidationArchitecture(): Array<{ type: ValidationType; description: string; rules: string[] }> {
  return [
    {
      type: 'duplicate_detection',
      description: 'Detect duplicate orders from same user',
      rules: ['Same product within 5 minutes', 'Same address within 1 hour', 'Same payment method'],
    },
    {
      type: 'fake_order',
      description: 'Identify potentially fake orders',
      rules: ['Invalid address patterns', 'Unrealistic quantities', 'Suspicious timing'],
    },
    {
      type: 'abnormal_purchase',
      description: 'Detect unusual purchasing behavior',
      rules: ['Order value exceeds history average', 'New account large order', 'Category deviation'],
    },
    {
      type: 'velocity_check',
      description: 'Rate limiting for orders',
      rules: ['Max 10 orders per hour', 'Max 50 orders per day', 'Max value per hour'],
    },
    {
      type: 'device_validation',
      description: 'Validate device fingerprint',
      rules: ['Known device check', 'Emulator detection', 'Proxy detection'],
    },
    {
      type: 'location_validation',
      description: 'Validate location consistency',
      rules: ['GPS vs IP match', 'Delivery address distance', 'Billing address match'],
    },
    {
      type: 'behavior_analysis',
      description: 'Analyze user behavior patterns',
      rules: ['Session duration', 'Navigation patterns', 'Click timing analysis'],
    },
    {
      type: 'fraud_check',
      description: 'Comprehensive fraud detection',
      rules: ['All validation rules combined', 'Risk score calculation', 'ML model scoring'],
    },
  ];
}

// ============================================================
// MERCHANT QUEUE FUNCTIONS
// ============================================================

export async function getMerchantOrders(sellerId: string): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase.rpc('get_merchant_orders', {
    p_seller_id: sellerId,
  });

  if (error) throw error;
  return data || [];
}

export async function updateMerchantQueueStatus(
  queueId: string,
  status: MerchantQueueStatus,
  options?: {
    notes?: string;
    estimatedTime?: number;
  actualTime?: number;
  settlementAmount?: number;
  }
): Promise<MerchantOrderQueue> {
  const updateData: Record<string, unknown> = { queue_status: status };
  if (options?.notes) updateData.processing_notes = options.notes;
  if (options?.estimatedTime) updateData.estimated_packing_time = options.estimatedTime;
  if (options?.actualTime) updateData.actual_packing_time = options.actualTime;
  if (options?.settlementAmount) updateData.settlement_amount = options.settlementAmount;

  const { data, error } = await supabase
    .from('merchant_order_queue')
    .update(updateData)
    .eq('id', queueId)
    .select()
    .single();

  if (error) throw error;
  return data as MerchantOrderQueue;
}

export function getMerchantQueueArchitecture(): Array<{ status: MerchantQueueStatus; action: string; notification: string }> {
  return [
    { status: 'pending', action: 'View new order', notification: 'New order received' },
    { status: 'accepted', action: 'Accept order', notification: 'Order accepted, start packing' },
    { status: 'rejected', action: 'Reject order', notification: 'Order rejected with reason' },
    { status: 'packing', action: 'Start packing', notification: 'Packing in progress' },
    { status: 'ready_dispatch', action: 'Mark ready', notification: 'Ready for pickup' },
    { status: 'handed_over', action: 'Hand to carrier', notification: 'Handed over to logistics' },
    { status: 'completed', action: 'Complete', notification: 'Order completed' },
    { status: 'cancelled', action: 'Cancel order', notification: 'Order cancelled' },
  ];
}

// ============================================================
// NOTIFICATION FUNCTIONS
// ============================================================

export async function createNotification(
  notification: Partial<NotificationQueueItem>
): Promise<NotificationQueueItem> {
  const { data, error } = await supabase
    .from('notification_queue')
    .insert(notification)
    .select()
    .single();

  if (error) throw error;
  return data as NotificationQueueItem;
}

export async function getNotifications(userId: string, limit: number = 20): Promise<NotificationQueueItem[]> {
  const { data, error } = await supabase
    .from('notification_queue')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as NotificationQueueItem[];
}

export function getNotificationArchitecture(): Record<NotificationChannel, { enabled: boolean; provider: string }> {
  return {
    sms: { enabled: true, provider: 'Architecture Only' },
    email: { enabled: true, provider: 'Architecture Only' },
    whatsapp: { enabled: true, provider: 'Architecture Only' },
    push: { enabled: true, provider: 'Architecture Only' },
    in_app: { enabled: true, provider: 'Internal' },
  };
}

// ============================================================
// REFUND FUNCTIONS
// ============================================================

export async function createRefundRequest(
  refund: Partial<RefundQueueItem>
): Promise<RefundQueueItem> {
  const { data, error } = await supabase
    .from('refund_queue')
    .insert(refund)
    .select()
    .single();

  if (error) throw error;
  return data as RefundQueueItem;
}

export async function getRefundQueue(status?: string): Promise<RefundQueueItem[]> {
  let query = supabase.from('refund_queue').select('*');

  if (status) {
    query = query.eq('refund_status', status);
  }

  query = query.order('created_at', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as RefundQueueItem[];
}

export async function processRefund(
  refundId: string,
  approvedAmount: number,
  processedBy: string,
  options?: {
    reject?: boolean;
    reason?: string;
    refundToWallet?: boolean;
  }
): Promise<RefundQueueItem> {
  const updateData: Record<string, unknown> = {
    processed_at: new Date().toISOString(),
    processed_by: processedBy,
  };

  if (options?.reject) {
    updateData.refund_status = 'rejected';
    updateData.rejection_reason = options.reason;
  } else {
    updateData.refund_status = 'completed';
    updateData.approved_amount = approvedAmount;
    updateData.refund_to_wallet = options?.refundToWallet || false;
  }

  const { data, error } = await supabase
    .from('refund_queue')
    .update(updateData)
    .eq('id', refundId)
    .select()
    .single();

  if (error) throw error;
  return data as RefundQueueItem;
}

// ============================================================
// TRACKING FUNCTIONS
// ============================================================

export async function getOrderTracking(orderId: string): Promise<LiveOrderTracking | null> {
  const { data, error } = await supabase
    .from('live_order_tracking')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) throw error;
  return data as LiveOrderTracking | null;
}

export async function updateOrderTracking(
  orderId: string,
  tracking: Partial<LiveOrderTracking>
): Promise<LiveOrderTracking> {
  const { data, error } = await supabase
    .from('live_order_tracking')
    .update(tracking)
    .eq('order_id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data as LiveOrderTracking;
}

export function getTrackingStatusArchitecture(): Array<{ status: TrackingStatus; description: string }> {
  return [
    { status: 'order_placed', description: 'Order successfully placed' },
    { status: 'confirmed', description: 'Order confirmed by merchant' },
    { status: 'processing', description: 'Order being processed' },
    { status: 'packed', description: 'Order packed and ready' },
    { status: 'ready_dispatch', description: 'Ready for carrier pickup' },
    { status: 'picked_up', description: 'Picked up by carrier' },
    { status: 'transit', description: 'In transit to destination' },
    { status: 'out_for_delivery', description: 'Out for delivery today' },
    { status: 'delivered', description: 'Successfully delivered' },
    { status: 'returned', description: 'Return initiated' },
    { status: 'cancelled', description: 'Order cancelled' },
  ];
}

// ============================================================
// FRAUD DETECTION FUNCTIONS
// ============================================================

export async function createFraudCase(
  fraudCase: Partial<FraudDetectionCase>
): Promise<FraudDetectionCase> {
  const { data, error } = await supabase
    .from('fraud_detection_queue')
    .insert(fraudCase)
    .select()
    .single();

  if (error) throw error;
  return data as FraudDetectionCase;
}

export async function getFraudQueue(status?: string): Promise<FraudDetectionCase[]> {
  let query = supabase.from('fraud_detection_queue').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as FraudDetectionCase[];
}

export function getFraudDetectionArchitecture(): Array<{ type: FraudType; severity: FraudSeverity; detection: string }> {
  return [
    { type: 'duplicate_order', severity: 'high', detection: 'Same user, product, time window' },
    { type: 'fake_payment', severity: 'critical', detection: 'Invalid payment credentials' },
    { type: 'velocity_abuse', severity: 'medium', detection: 'Exceeding rate limits' },
    { type: 'location_mismatch', severity: 'medium', detection: 'GPS/IP/Address inconsistency' },
    { type: 'device_mismatch', severity: 'low', detection: 'Unknown device fingerprint' },
    { type: 'suspicious_pattern', severity: 'medium', detection: 'Unusual behavior patterns' },
    { type: 'collusion', severity: 'critical', detection: 'Merchant-customer fraud pattern' },
    { type: 'refund_abuse', severity: 'high', detection: 'Excessive refund requests' },
    { type: 'coupon_abuse', severity: 'medium', detection: 'Coupon misuse patterns' },
  ];
}

// ============================================================
// AUDIT LOG FUNCTIONS
// ============================================================

export async function createAuditLog(log: Partial<TransactionAuditLog>): Promise<TransactionAuditLog> {
  const { data, error } = await supabase
    .from('transaction_audit_log')
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data as TransactionAuditLog;
}

export async function getAuditLogs(
  filters?: {
    referenceType?: ReferenceType;
    referenceId?: string;
    userId?: string;
    transactionType?: TransactionType;
  },
  limit: number = 100
): Promise<TransactionAuditLog[]> {
  let query = supabase.from('transaction_audit_log').select('*');

  if (filters?.referenceType) {
    query = query.eq('reference_type', filters.referenceType);
  }
  if (filters?.referenceId) {
    query = query.eq('reference_id', filters.referenceId);
  }
  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }
  if (filters?.transactionType) {
    query = query.eq('transaction_type', filters.transactionType);
  }

  query = query.order('created_at', { ascending: false }).limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as TransactionAuditLog[];
}

// ============================================================
// DASHBOARD FUNCTIONS
// ============================================================

export async function getPaymentDashboardStats(): Promise<{
  today: { orders: number; amount: number };
  pending_payments: number;
  failed_payments: number;
  pending_refunds: number;
  open_fraud_cases: number;
  payment_methods: Array<{ method: string; count: number; amount: number }>;
}> {
  const { data, error } = await supabase.rpc('get_payment_dashboard_stats');

  if (error) throw error;
  return data;
}

export function getDashboardArchitecture(): Array<{ section: string; metrics: string[] }> {
  return [
    { section: 'Live Orders', metrics: ['Total Active', 'Pending', 'In Transit', 'Delivered Today'] },
    { section: 'Payments', metrics: ['Success Rate', 'Pending', 'Failed', 'Total Volume'] },
    { section: 'Refunds', metrics: ['Pending Requests', 'Processed Today', 'Total Refund Amount'] },
    { section: 'Fraud', metrics: ['Open Cases', 'High Priority', 'False Positive Rate'] },
    { section: 'Revenue', metrics: ['Today', 'This Week', 'This Month', 'Yearly'] },
    { section: 'Merchant Performance', metrics: ['Acceptance Rate', 'Fulfillment Rate', 'Settlement Status'] },
  ];
}
