// VLOOP Phase 26 - Global Payments & Financial Infrastructure Mock Data

// ============================================================
// MODULE 1: PAYMENT ORCHESTRATION LAYER
// ============================================================

export type PaymentMethodType =
  | 'upi'
  | 'credit_card'
  | 'debit_card'
  | 'net_banking'
  | 'wallet'
  | 'international_card'
  | 'apple_pay'
  | 'google_pay'
  | 'bank_transfer'
  | 'country_specific';

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  icon: string;
  countries: string[];
  status: 'active' | 'coming_soon' | 'disabled';
  priority: number;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'upi', name: 'UPI', type: 'upi', icon: 'Smartphone', countries: ['IN'], status: 'active', priority: 1 },
  { id: 'credit_card', name: 'Credit Card', type: 'credit_card', icon: 'CreditCard', countries: ['ALL'], status: 'active', priority: 2 },
  { id: 'debit_card', name: 'Debit Card', type: 'debit_card', icon: 'CreditCard', countries: ['ALL'], status: 'active', priority: 3 },
  { id: 'net_banking', name: 'Net Banking', type: 'net_banking', icon: 'Building2', countries: ['IN'], status: 'active', priority: 4 },
  { id: 'wallet', name: 'Wallet Payments', type: 'wallet', icon: 'Wallet', countries: ['IN', 'AE', 'SG'], status: 'active', priority: 5 },
  { id: 'international', name: 'International Cards', type: 'international_card', icon: 'Globe', countries: ['ALL'], status: 'active', priority: 6 },
  { id: 'apple_pay', name: 'Apple Pay', type: 'apple_pay', icon: 'Smartphone', countries: ['US', 'GB', 'AE', 'SG'], status: 'active', priority: 7 },
  { id: 'google_pay', name: 'Google Pay', type: 'google_pay', icon: 'Smartphone', countries: ['US', 'GB', 'IN', 'AE', 'SG'], status: 'active', priority: 8 },
  { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank_transfer', icon: 'Building2', countries: ['ALL'], status: 'active', priority: 9 },
  { id: 'country_specific', name: 'Regional Methods', type: 'country_specific', icon: 'MapPin', countries: ['IN', 'AE', 'SA', 'SG'], status: 'coming_soon', priority: 10 },
];

// ============================================================
// MODULE 2: PAYMENT GATEWAY MANAGER
// ============================================================

export interface PaymentGateway {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'maintenance' | 'disabled';
  priority: number;
  countries: string[];
  success_rate: number;
  avg_latency_ms: number;
  last_check: string;
}

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  { id: 'razorpay', name: 'Razorpay', icon: 'Zap', status: 'active', priority: 1, countries: ['IN'], success_rate: 99.7, avg_latency_ms: 245, last_check: '2026-07-09T10:00:00' },
  { id: 'cashfree', name: 'Cashfree', icon: 'DollarSign', status: 'active', priority: 2, countries: ['IN'], success_rate: 99.5, avg_latency_ms: 312, last_check: '2026-07-09T10:00:00' },
  { id: 'phonepe_pg', name: 'PhonePe PG', icon: 'Smartphone', status: 'active', priority: 3, countries: ['IN'], success_rate: 99.8, avg_latency_ms: 198, last_check: '2026-07-09T10:00:00' },
  { id: 'payu', name: 'PayU', icon: 'CreditCard', status: 'active', priority: 4, countries: ['IN'], success_rate: 99.2, avg_latency_ms: 287, last_check: '2026-07-09T10:00:00' },
  { id: 'stripe', name: 'Stripe', icon: 'CreditCard', status: 'active', priority: 5, countries: ['US', 'GB', 'AE', 'SG', 'AU', 'CA'], success_rate: 99.9, avg_latency_ms: 156, last_check: '2026-07-09T10:00:00' },
  { id: 'adyen', name: 'Adyen', icon: 'Globe', status: 'active', priority: 6, countries: ['ALL'], success_rate: 99.85, avg_latency_ms: 178, last_check: '2026-07-09T10:00:00' },
  { id: 'paypal', name: 'PayPal', icon: 'Wallet', status: 'active', priority: 7, countries: ['ALL'], success_rate: 99.6, avg_latency_ms: 425, last_check: '2026-07-09T10:00:00' },
  { id: 'authorize_net', name: 'Authorize.net', icon: 'Lock', status: 'maintenance', priority: 8, countries: ['US', 'CA'], success_rate: 99.4, avg_latency_ms: 298, last_check: '2026-07-09T10:00:00' },
  { id: 'worldpay', name: 'Worldpay', icon: 'Globe', status: 'active', priority: 9, countries: ['GB', 'EU', 'AU'], success_rate: 99.5, avg_latency_ms: 334, last_check: '2026-07-09T10:00:00' },
];

export const GATEWAY_CONFIG = {
  failover_enabled: true,
  auto_retry: true,
  max_retries: 3,
  health_check_interval_seconds: 60,
};

// ============================================================
// MODULE 3: BANK ACCOUNT MANAGEMENT
// ============================================================

export interface BankAccount {
  id: string;
  account_type: 'partner_store' | 'community_seller' | 'service_provider';
  beneficiary_name: string;
  bank_name: string;
  account_number_masked: string;
  ifsc_code?: string;
  swift_code?: string;
  iban?: string;
  routing_number?: string;
  country: string;
  verification_status: 'verified' | 'pending' | 'rejected';
  created_at: string;
}

export const BANK_ACCOUNTS: BankAccount[] = [
  { id: 'BA001', account_type: 'partner_store', beneficiary_name: 'TechStore India Pvt Ltd', bank_name: 'HDFC Bank', account_number_masked: 'XXXX4567', ifsc_code: 'HDFC0001234', country: 'IN', verification_status: 'verified', created_at: '2026-01-15' },
  { id: 'BA002', account_type: 'community_seller', beneficiary_name: 'Green Valley Farm', bank_name: 'SBI', account_number_masked: 'XXXX8901', ifsc_code: 'SBIN0002345', country: 'IN', verification_status: 'verified', created_at: '2026-02-20' },
  { id: 'BA003', account_type: 'service_provider', beneficiary_name: 'QuickFix Services', bank_name: 'ICICI Bank', account_number_masked: 'XXXX2345', ifsc_code: 'ICIC0003456', country: 'IN', verification_status: 'pending', created_at: '2026-06-10' },
];

// ============================================================
// MODULE 4: MULTI-CURRENCY ENGINE
// ============================================================

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  supported: boolean;
  settlement_currency: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimal_places: 2, supported: true, settlement_currency: 'INR' },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimal_places: 2, supported: true, settlement_currency: 'USD' },
  { code: 'EUR', name: 'Euro', symbol: '€', decimal_places: 2, supported: true, settlement_currency: 'EUR' },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimal_places: 2, supported: true, settlement_currency: 'GBP' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', decimal_places: 2, supported: true, settlement_currency: 'AED' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', decimal_places: 2, supported: true, settlement_currency: 'SAR' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimal_places: 2, supported: true, settlement_currency: 'SGD' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimal_places: 2, supported: true, settlement_currency: 'AUD' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimal_places: 2, supported: true, settlement_currency: 'CAD' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimal_places: 0, supported: true, settlement_currency: 'JPY' },
];

export const MOCK_EXCHANGE_RATES: Record<string, number> = {
  'INR_USD': 0.012,
  'USD_INR': 83.50,
  'EUR_USD': 1.08,
  'GBP_USD': 1.27,
  'AED_USD': 0.27,
  'SAR_USD': 0.27,
  'SGD_USD': 0.74,
};

// ============================================================
// MODULE 5: SETTLEMENT ENGINE
// ============================================================

export interface SettlementBreakdown {
  merchant_amount: number;
  gateway_charges: number;
  platform_fee: number;
  taxes: number;
  sponsored_benefits: number;
  insurance_sponsorship: number;
  escrow_amount: number;
  net_settlement: number;
}

export interface Settlement {
  id: string;
  merchant_id: string;
  merchant_name: string;
  gross_amount: number;
  breakdown: SettlementBreakdown;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  currency: string;
  scheduled_date: string;
  completed_date?: string;
  gateway: string;
}

export const SETTLEMENTS: Settlement[] = [
  {
    id: 'SET001',
    merchant_id: 'M001',
    merchant_name: 'TechStore India',
    gross_amount: 125000,
    breakdown: {
      merchant_amount: 118750,
      gateway_charges: 1875,
      platform_fee: 2500,
      taxes: 562,
      sponsored_benefits: 750,
      insurance_sponsorship: 313,
      escrow_amount: 0,
      net_settlement: 118750,
    },
    status: 'completed',
    currency: 'INR',
    scheduled_date: '2026-07-05',
    completed_date: '2026-07-06',
    gateway: 'razorpay',
  },
  {
    id: 'SET002',
    merchant_id: 'M002',
    merchant_name: 'Organic Farm Co.',
    gross_amount: 45000,
    breakdown: {
      merchant_amount: 42930,
      gateway_charges: 675,
      platform_fee: 900,
      taxes: 202,
      sponsored_benefits: 225,
      insurance_sponsorship: 68,
      escrow_amount: 0,
      net_settlement: 42930,
    },
    status: 'processing',
    currency: 'INR',
    scheduled_date: '2026-07-08',
    gateway: 'cashfree',
  },
  {
    id: 'SET003',
    merchant_id: 'M003',
    merchant_name: 'QuickFix Services',
    gross_amount: 8500,
    breakdown: {
      merchant_amount: 8075,
      gateway_charges: 127,
      platform_fee: 170,
      taxes: 38,
      sponsored_benefits: 42,
      insurance_sponsorship: 48,
      escrow_amount: 0,
      net_settlement: 8075,
    },
    status: 'pending',
    currency: 'INR',
    scheduled_date: '2026-07-12',
    gateway: 'razorpay',
  },
];

// ============================================================
// MODULE 6: ESCROW PAYMENT LAYER
// ============================================================

export type EscrowStatus = 'payment_held' | 'delivery_confirmed' | 'seller_paid' | 'disputed' | 'refunded' | 'closed';

export interface EscrowTransaction {
  id: string;
  order_id: string;
  customer_id: string;
  seller_id: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  current_step: number;
  created_at: string;
  held_at?: string;
  released_at?: string;
  dispute_reason?: string;
}

export const ESCROW_TRANSACTIONS: EscrowTransaction[] = [
  { id: 'ESC001', order_id: 'ORD-2026-1234', customer_id: 'C001', seller_id: 'S001', amount: 4500, currency: 'INR', status: 'delivery_confirmed', current_step: 2, created_at: '2026-07-05', held_at: '2026-07-05' },
  { id: 'ESC002', order_id: 'ORD-2026-1235', customer_id: 'C002', seller_id: 'S002', amount: 2500, currency: 'INR', status: 'payment_held', current_step: 1, created_at: '2026-07-08', held_at: '2026-07-08' },
  { id: 'ESC003', order_id: 'ORD-2026-1230', customer_id: 'C003', seller_id: 'S001', amount: 6800, currency: 'INR', status: 'seller_paid', current_step: 4, created_at: '2026-07-01', held_at: '2026-07-01', released_at: '2026-07-05' },
  { id: 'ESC004', order_id: 'ORD-2026-1240', customer_id: 'C004', seller_id: 'S003', amount: 3200, currency: 'INR', status: 'disputed', current_step: 2, created_at: '2026-07-03', held_at: '2026-07-03', dispute_reason: 'Item not as described' },
];

export const ESCROW_FLOW_STEPS = [
  { step: 1, title: 'Customer Pays', description: 'Payment received from customer', icon: 'CreditCard' },
  { step: 2, title: 'Payment Held', description: 'Funds held in secure escrow', icon: 'Lock' },
  { step: 3, title: 'Delivery Confirmed', description: 'Customer confirms receipt', icon: 'Package' },
  { step: 4, title: 'Seller Paid', description: 'Funds released to seller', icon: 'Wallet' },
];

// ============================================================
// MODULE 7: REFUND ENGINE
// ============================================================

export type RefundType = 'full' | 'partial' | 'cancelled_order' | 'dispute';
export type RefundStatus = 'initiated' | 'processing' | 'completed' | 'failed';

export interface Refund {
  id: string;
  order_id: string;
  type: RefundType;
  amount: number;
  currency: string;
  status: RefundStatus;
  reason: string;
  initiated_at: string;
  completed_at?: string;
  gateway: string;
  transaction_id?: string;
}

export const REFUNDS: Refund[] = [
  { id: 'REF001', order_id: 'ORD-2026-1220', type: 'full', amount: 3500, currency: 'INR', status: 'completed', reason: 'Product defective', initiated_at: '2026-07-02', completed_at: '2026-07-04', gateway: 'razorpay', transaction_id: 'RFN-RZP-001' },
  { id: 'REF002', order_id: 'ORD-2026-1225', type: 'partial', amount: 500, currency: 'INR', status: 'completed', reason: 'Missing accessory', initiated_at: '2026-07-05', completed_at: '2026-07-07', gateway: 'cashfree', transaction_id: 'RFN-CF-002' },
  { id: 'REF003', order_id: 'ORD-2026-1245', type: 'cancelled_order', amount: 2800, currency: 'INR', status: 'processing', reason: 'Order cancelled by customer', initiated_at: '2026-07-08', gateway: 'razorpay' },
  { id: 'REF004', order_id: 'ORD-2026-1215', type: 'dispute', amount: 15000, currency: 'INR', status: 'initiated', reason: 'Fraudulent transaction claim', initiated_at: '2026-07-09', gateway: 'payu' },
];

// ============================================================
// MODULE 8: PAYOUT ENGINE
// ============================================================

export type PayoutSchedule = 'instant' | 'daily' | 'weekly' | 'manual';
export type PayoutStatus = 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Payout {
  id: string;
  merchant_id: string;
  merchant_name: string;
  amount: number;
  currency: string;
  schedule: PayoutSchedule;
  status: PayoutStatus;
  scheduled_date: string;
  completed_date?: string;
  bank_account_id: string;
  utr_number?: string;
}

export const PAYOUTS: Payout[] = [
  { id: 'PO001', merchant_id: 'M001', merchant_name: 'TechStore India', amount: 118750, currency: 'INR', schedule: 'weekly', status: 'completed', scheduled_date: '2026-07-06', completed_date: '2026-07-06', bank_account_id: 'BA001', utr_number: 'UTR123456789' },
  { id: 'PO002', merchant_id: 'M002', merchant_name: 'Organic Farm Co.', amount: 42930, currency: 'INR', schedule: 'weekly', status: 'processing', scheduled_date: '2026-07-09', bank_account_id: 'BA002' },
  { id: 'PO003', merchant_id: 'M003', merchant_name: 'QuickFix Services', amount: 8075, currency: 'INR', schedule: 'daily', status: 'scheduled', scheduled_date: '2026-07-12', bank_account_id: 'BA003' },
  { id: 'PO004', merchant_id: 'M001', merchant_name: 'TechStore India', amount: 95000, currency: 'INR', schedule: 'weekly', status: 'scheduled', scheduled_date: '2026-07-13', bank_account_id: 'BA001' },
];

// ============================================================
// MODULE 9: TAX ENGINE
// ============================================================

export interface TaxConfig {
  country: string;
  tax_type: string;
  rate: number;
  gst?: { sgst: number; cgst: number; igst: number };
  vat?: number;
  sales_tax?: number;
}

export const TAX_CONFIGS: TaxConfig[] = [
  { country: 'IN', tax_type: 'GST', rate: 18, gst: { sgst: 9, cgst: 9, igst: 18 } },
  { country: 'AE', tax_type: 'VAT', rate: 5, vat: 5 },
  { country: 'SA', tax_type: 'VAT', rate: 15, vat: 15 },
  { country: 'SG', tax_type: 'GST', rate: 8 },
  { country: 'US', tax_type: 'Sales Tax', rate: 0, sales_tax: 8.5 },
  { country: 'GB', tax_type: 'VAT', rate: 20, vat: 20 },
  { country: 'AU', tax_type: 'GST', rate: 10 },
  { country: 'CA', tax_type: 'GST/HST', rate: 5 },
  { country: 'EU', tax_type: 'VAT', rate: 21, vat: 21 },
  { country: 'JP', tax_type: 'Consumption Tax', rate: 10 },
];

export interface TaxInvoice {
  id: string;
  invoice_number: string;
  order_id: string;
  customer_id: string;
  amount_before_tax: number;
  tax_amount: number;
  tax_breakdown: { name: string; rate: number; amount: number }[];
  total_amount: number;
  currency: string;
  generated_at: string;
}

export const TAX_INVOICES: TaxInvoice[] = [
  {
    id: 'TI001',
    invoice_number: 'INV-2026-GST-001234',
    order_id: 'ORD-2026-1234',
    customer_id: 'C001',
    amount_before_tax: 10000,
    tax_amount: 1800,
    tax_breakdown: [
      { name: 'SGST', rate: 9, amount: 900 },
      { name: 'CGST', rate: 9, amount: 900 },
    ],
    total_amount: 11800,
    currency: 'INR',
    generated_at: '2026-07-05',
  },
];

// ============================================================
// MODULE 10: INVOICE CENTER
// ============================================================

export type InvoiceType = 'invoice' | 'receipt' | 'credit_note' | 'refund_receipt' | 'insurance_receipt' | 'care_club_receipt';

export interface Invoice {
  id: string;
  type: InvoiceType;
  number: string;
  customer_name: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  created_at: string;
  paid_at?: string;
  download_url?: string;
}

export const INVOICES: Invoice[] = [
  { id: 'INV001', type: 'invoice', number: 'INV-2026-001234', customer_name: 'Rahul Kumar', amount: 15000, currency: 'INR', status: 'paid', created_at: '2026-07-01', paid_at: '2026-07-02' },
  { id: 'INV002', type: 'receipt', number: 'RCP-2026-005678', customer_name: 'Priya Sharma', amount: 8500, currency: 'INR', status: 'paid', created_at: '2026-07-03', paid_at: '2026-07-03' },
  { id: 'INV003', type: 'credit_note', number: 'CN-2026-000123', customer_name: 'Amit Patel', amount: 2500, currency: 'INR', status: 'sent', created_at: '2026-07-05' },
  { id: 'INV004', type: 'refund_receipt', number: 'RR-2026-000456', customer_name: 'Rahul Kumar', amount: 3500, currency: 'INR', status: 'paid', created_at: '2026-07-04', paid_at: '2026-07-04' },
  { id: 'INV005', type: 'insurance_receipt', number: 'IR-2026-000789', customer_name: 'Priya Sharma', amount: 500, currency: 'INR', status: 'paid', created_at: '2026-07-06', paid_at: '2026-07-06' },
  { id: 'INV006', type: 'care_club_receipt', number: 'CCR-2026-000234', customer_name: 'Amit Patel', amount: 1000, currency: 'INR', status: 'paid', created_at: '2026-07-07', paid_at: '2026-07-07' },
];

// ============================================================
// MODULE 11: PAYMENT SECURITY
// ============================================================

export interface SecurityFeature {
  id: string;
  name: string;
  status: 'enabled' | 'disabled';
  description: string;
}

export const SECURITY_FEATURES: SecurityFeature[] = [
  { id: 'pci_dss', name: 'PCI-DSS Compliance', status: 'enabled', description: 'Payment Card Industry Data Security Standard' },
  { id: 'tokenization', name: 'Tokenization', status: 'enabled', description: 'Replace sensitive data with tokens' },
  { id: 'encryption', name: 'End-to-End Encryption', status: 'enabled', description: 'AES-256 encryption for all data' },
  { id: 'webhook_verification', name: 'Webhook Verification', status: 'enabled', description: 'Signature verification for webhooks' },
  { id: 'fraud_detection', name: 'Fraud Detection', status: 'enabled', description: 'ML-based fraud detection' },
  { id: 'device_fingerprint', name: 'Device Fingerprinting', status: 'enabled', description: 'Unique device identification' },
  { id: 'velocity_checks', name: 'Velocity Checks', status: 'enabled', description: 'Rate limiting and velocity rules' },
  { id: 'risk_monitoring', name: 'Risk Monitoring', status: 'enabled', description: 'Real-time risk scoring' },
];

// ============================================================
// MODULE 12: FINANCIAL AUDIT
// ============================================================

export type AuditLogCategory = 'payment' | 'settlement' | 'refund' | 'payout' | 'gateway' | 'webhook';
export type AuditLogAction = 'create' | 'update' | 'complete' | 'fail' | 'cancel';

export interface FinancialAuditLog {
  id: string;
  category: AuditLogCategory;
  action: AuditLogAction;
  reference_id: string;
  amount?: number;
  currency?: string;
  actor: string;
  timestamp: string;
  metadata: Record<string, unknown>;
  immutable: boolean;
}

export const FINANCIAL_AUDIT_LOGS: FinancialAuditLog[] = [
  { id: 'AL001', category: 'payment', action: 'create', reference_id: 'PAY-2026-123456', amount: 15000, currency: 'INR', actor: 'SYSTEM', timestamp: '2026-07-09T10:00:00', metadata: { gateway: 'razorpay', method: 'upi' }, immutable: true },
  { id: 'AL002', category: 'settlement', action: 'complete', reference_id: 'SET001', amount: 118750, currency: 'INR', actor: 'SYSTEM', timestamp: '2026-07-06T18:00:00', metadata: { merchant: 'M001', utr: 'UTR123456789' }, immutable: true },
  { id: 'AL003', category: 'refund', action: 'create', reference_id: 'REF001', amount: 3500, currency: 'INR', actor: 'ADMIN', timestamp: '2026-07-02T14:30:00', metadata: { reason: 'Product defective' }, immutable: true },
  { id: 'AL004', category: 'payout', action: 'complete', reference_id: 'PO001', amount: 118750, currency: 'INR', actor: 'SYSTEM', timestamp: '2026-07-06T08:00:00', metadata: { bank_account: 'BA001' }, immutable: true },
  { id: 'AL005', category: 'gateway', action: 'update', reference_id: 'GW-RZP', actor: 'SYSTEM', timestamp: '2026-07-09T01:00:00', metadata: { status: 'active', latency_ms: 245 }, immutable: true },
  { id: 'AL006', category: 'webhook', action: 'create', reference_id: 'WH-2026-789012', actor: 'RAZORPAY', timestamp: '2026-07-09T10:05:00', metadata: { event: 'payment.captured', verified: true }, immutable: true },
];

// ============================================================
// MODULE 13: ADMIN FINANCIAL DASHBOARD
// ============================================================

export const FINANCIAL_DASHBOARD = {
  total_revenue: { amount: 12500000, currency: 'INR', change_percent: 12.5 },
  pending_settlement: { amount: 850000, currency: 'INR', count: 15 },
  completed_settlement: { amount: 10500000, currency: 'INR', count: 142 },
  gateway_health: { active: 8, maintenance: 1, disabled: 0 },
  refund_analytics: { total_amount: 125000, currency: 'INR', count: 45, refund_rate: 1.2 },
  payout_queue: { pending: 8, processing: 3, amount: 450000, currency: 'INR' },
  escrow_balance: { total_held: 125000, currency: 'INR', active_transactions: 12 },
  country_revenue: [
    { country: 'India', code: 'IN', amount: 10000000, percentage: 80 },
    { country: 'UAE', code: 'AE', amount: 1500000, percentage: 12 },
    { country: 'Singapore', code: 'SG', amount: 750000, percentage: 6 },
    { country: 'Others', code: 'OTHER', amount: 250000, percentage: 2 },
  ],
};

// ============================================================
// MODULE 14: GLOBAL COMPLIANCE
// ============================================================

export interface ComplianceStandard {
  id: string;
  name: string;
  status: 'compliant' | 'partial' | 'pending';
  region: string;
  description: string;
}

export const COMPLIANCE_STANDARDS: ComplianceStandard[] = [
  { id: 'rbi', name: 'RBI Guidelines', status: 'compliant', region: 'India', description: 'Reserve Bank of India payment regulations' },
  { id: 'pci_dss', name: 'PCI-DSS', status: 'compliant', region: 'Global', description: 'Payment Card Industry Data Security Standard' },
  { id: 'aml', name: 'AML Compliance', status: 'compliant', region: 'Global', description: 'Anti-Money Laundering regulations' },
  { id: 'kyc', name: 'KYC Requirements', status: 'compliant', region: 'Global', description: 'Know Your Customer verification' },
  { id: 'gdpr', name: 'GDPR', status: 'compliant', region: 'EU', description: 'General Data Protection Regulation' },
  { id: 'uae_reg', name: 'UAE Payment Regulations', status: 'partial', region: 'UAE', description: 'Central Bank of UAE guidelines' },
  { id: 'sg_mas', name: 'MAS Guidelines', status: 'partial', region: 'Singapore', description: 'Monetary Authority of Singapore' },
];

// ============================================================
// MODULE 15: VCOS FINANCIAL LOCK
// ============================================================

export const VCOS_FINANCIAL_LOCK = [
  { rule: 'No Direct Banking', icon: 'Ban', enforced: true, description: 'All transactions through licensed partners only' },
  { rule: 'No Stored Card Data', icon: 'Shield', enforced: true, description: 'Tokenization mandatory, no raw card data stored' },
  { rule: 'Licensed Partners Only', icon: 'BadgeCheck', enforced: true, description: 'Only RBI/regulated gateways integrated' },
  { rule: 'Encrypted Transactions', icon: 'Lock', enforced: true, description: 'E2E encryption for all payment data' },
  { rule: 'Secure Settlement', icon: 'ShieldCheck', enforced: true, description: 'Automated reconciliation with audit trail' },
  { rule: 'Transparent Audit', icon: 'FileText', enforced: true, description: 'Immutable financial logs' },
  { rule: 'Country Compliance', icon: 'Globe', enforced: true, description: 'Region-specific payment regulations' },
  { rule: 'Privacy by Design', icon: 'Eye', enforced: true, description: 'User consent and data protection' },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED',
    SAR: 'SAR',
    SGD: 'S$',
    AUD: 'A$',
    CAD: 'C$',
    JPY: '¥',
  };
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

export function getGatewayStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: '#22c55e',
    maintenance: '#fbbf24',
    disabled: '#ef4444',
  };
  return colors[status] || '#6b7280';
}

export function getSettlementStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: '#fbbf24',
    processing: '#00F2FE',
    completed: '#22c55e',
    failed: '#ef4444',
  };
  return colors[status] || '#6b7280';
}
