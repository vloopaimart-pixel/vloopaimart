// VLOOP Phase 24 - Universal Wallet Experience Mock Data

export interface WalletOverview {
  wallet_balance: number;
  pending_balance: number;
  escrow_balance: number;
  total_earned: number;
  total_spent: number;
  currency: string;
  currency_symbol: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  status: 'coming_soon' | 'future';
  category: 'upi' | 'cards' | 'banking' | 'wallets' | 'international';
}

export interface EscrowStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  category: string;
  amount: number;
  smartpoints: number;
  description: string;
  status: 'completed' | 'pending' | 'processing';
  created_at: string;
  reference?: string;
}

export interface SecurityStatus {
  id: string;
  name: string;
  status: 'active' | 'enabled' | 'verified';
  icon: string;
  description: string;
}

export interface FutureBanking {
  id: string;
  name: string;
  status: 'coming_soon';
  icon: string;
  description: string;
}

export interface WalletInsight {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

// Mock Data
export const MOCK_WALLET_OVERVIEW: WalletOverview = {
  wallet_balance: 24500,
  pending_balance: 3500,
  escrow_balance: 8000,
  total_earned: 125000,
  total_spent: 98000,
  currency: 'INR',
  currency_symbol: '₹',
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  // UPI
  { id: 'upi', name: 'UPI', icon: 'Smartphone', status: 'coming_soon', category: 'upi' },
  { id: 'gpay', name: 'Google Pay', icon: 'CreditCard', status: 'future', category: 'upi' },
  { id: 'phonepe', name: 'PhonePe', icon: 'CreditCard', status: 'future', category: 'upi' },
  { id: 'paytm', name: 'Paytm', icon: 'CreditCard', status: 'future', category: 'upi' },
  // Cards
  { id: 'debit', name: 'Debit Card', icon: 'CreditCard', status: 'coming_soon', category: 'cards' },
  { id: 'credit', name: 'Credit Card', icon: 'CreditCard', status: 'coming_soon', category: 'cards' },
  // Banking
  { id: 'netbanking', name: 'Net Banking', icon: 'Building2', status: 'coming_soon', category: 'banking' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: 'Building2', status: 'coming_soon', category: 'banking' },
  // Payment Gateways
  { id: 'razorpay', name: 'Razorpay', icon: 'Zap', status: 'future', category: 'wallets' },
  { id: 'cashfree', name: 'Cashfree', icon: 'Zap', status: 'future', category: 'wallets' },
  { id: 'stripe', name: 'Stripe', icon: 'CreditCard', status: 'future', category: 'international' },
  // International
  { id: 'paypal', name: 'PayPal', icon: 'Wallet', status: 'future', category: 'international' },
  { id: 'applepay', name: 'Apple Pay', icon: 'Smartphone', status: 'future', category: 'international' },
  { id: 'googlepay', name: 'Google Pay', icon: 'Smartphone', status: 'future', category: 'international' },
];

export const ESCROW_STEPS: EscrowStep[] = [
  { id: 1, title: 'Buyer Payment', description: 'Payment received from buyer', icon: 'ArrowDownRight' },
  { id: 2, title: 'Escrow Hold', description: 'Funds held securely', icon: 'Lock' },
  { id: 3, title: 'Delivery Verification', description: 'Confirm product received', icon: 'CheckCircle' },
  { id: 4, title: 'Seller Receives', description: 'Funds released to seller', icon: 'ArrowUpRight' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN001',
    type: 'debit',
    category: 'Purchase',
    amount: 2500,
    smartpoints: 25,
    description: 'Premium Bluetooth Headphones',
    status: 'completed',
    created_at: '2026-07-08T10:30:00',
    reference: 'ORD-2026-001',
  },
  {
    id: 'TXN002',
    type: 'credit',
    category: 'Contribution',
    amount: 500,
    smartpoints: 50,
    description: 'Care Club Food Support Contribution',
    status: 'completed',
    created_at: '2026-07-07T15:45:00',
  },
  {
    id: 'TXN003',
    type: 'credit',
    category: 'Marketplace Sale',
    amount: 4500,
    smartpoints: 45,
    description: 'Handmade Crafts Sale',
    status: 'completed',
    created_at: '2026-07-06T09:20:00',
    reference: 'SAL-2026-089',
  },
  {
    id: 'TXN004',
    type: 'debit',
    category: 'Local Service Payment',
    amount: 800,
    smartpoints: 8,
    description: 'Home Cleaning Service',
    status: 'completed',
    created_at: '2026-07-05T14:00:00',
  },
  {
    id: 'TXN005',
    type: 'credit',
    category: 'Reward Credit',
    amount: 0,
    smartpoints: 150,
    description: 'Weekly SmartCode Challenge Reward',
    status: 'completed',
    created_at: '2026-07-04T20:00:00',
  },
  {
    id: 'TXN006',
    type: 'debit',
    category: 'Wallet Transfer',
    amount: 2000,
    smartpoints: 0,
    description: 'Transfer to FOE Wallet',
    status: 'completed',
    created_at: '2026-07-03T11:30:00',
  },
  {
    id: 'TXN007',
    type: 'credit',
    category: 'Marketplace Sale',
    amount: 1200,
    smartpoints: 12,
    description: 'Organic Produce Bundle Sale',
    status: 'pending',
    created_at: '2026-07-02T16:45:00',
    reference: 'SAL-2026-092',
  },
  {
    id: 'TXN008',
    type: 'debit',
    category: 'Purchase',
    amount: 3500,
    smartpoints: 35,
    description: 'Smart Home Devices Bundle',
    status: 'processing',
    created_at: '2026-07-01T10:15:00',
    reference: 'ORD-2026-156',
  },
];

export const SECURITY_STATUSES: SecurityStatus[] = [
  { id: 'wallet', name: 'Wallet Protected', status: 'active', icon: 'Shield', description: 'End-to-end encryption enabled' },
  { id: 'device', name: 'Device Verified', status: 'verified', icon: 'Smartphone', description: 'Primary device authenticated' },
  { id: 'login', name: 'Login Security', status: 'active', icon: 'Lock', description: 'Two-factor authentication enabled' },
  { id: 'encryption', name: 'Encryption Enabled', status: 'enabled', icon: 'Key', description: 'AES-256 encryption active' },
];

export const FUTURE_BANKING_FEATURES: FutureBanking[] = [
  { id: 'linked_banks', name: 'Linked Banks', status: 'coming_soon', icon: 'Building2', description: 'Connect bank accounts' },
  { id: 'upi_ids', name: 'UPI IDs', status: 'coming_soon', icon: 'Smartphone', description: 'Multiple UPI identifiers' },
  { id: 'international', name: 'International Banking', status: 'coming_soon', icon: 'Globe', description: 'Cross-border payments' },
  { id: 'cards', name: 'Virtual & Physical Cards', status: 'coming_soon', icon: 'CreditCard', description: 'Debit and credit cards' },
  { id: 'regional_wallets', name: 'Regional Wallets', status: 'coming_soon', icon: 'Wallet', description: 'Country-specific wallets' },
];

export const WALLET_INSIGHTS: WalletInsight[] = [
  { id: '1', label: 'Monthly Spending', value: 12500, change: -8, trend: 'down', category: 'spending' },
  { id: '2', label: 'Monthly Earnings', value: 8500, change: 12, trend: 'up', category: 'earnings' },
  { id: '3', label: 'Marketplace Income', value: 5200, change: 25, trend: 'up', category: 'income' },
  { id: '4', label: 'Service Income', value: 1800, change: 5, trend: 'up', category: 'income' },
  { id: '5', label: 'Care Club Contributions', value: 1500, change: 10, trend: 'up', category: 'contribution' },
  { id: '6', label: 'SmartPoint Activity', value: 450, change: 0, trend: 'stable', category: 'rewards' },
];

export const COMPLIANCE_NOTICE = {
  title: 'Important Notice',
  message: 'Wallet features shown here are interface previews. Real financial services will become available only after future regulatory approvals, regional rollout, payment integration, identity verification, and compliance implementation.',
};

export const WALLET_ACTIONS = [
  { id: 'add', label: 'Add Money', icon: 'Plus', description: 'Add funds to wallet' },
  { id: 'withdraw', label: 'Withdraw', icon: 'ArrowUpRight', description: 'Withdraw to bank account' },
  { id: 'transfer', label: 'Transfer', icon: 'ArrowRightLeft', description: 'Transfer to other wallet' },
  { id: 'history', label: 'Transaction History', icon: 'History', description: 'View all transactions' },
  { id: 'escrow', label: 'Escrow Activity', icon: 'Lock', description: 'Manage escrow funds' },
];

export function formatCurrency(amount: number, symbol: string = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

export function getTransactionIcon(category: string): string {
  const icons: Record<string, string> = {
    Purchase: 'ShoppingBag',
    Contribution: 'Heart',
    'Marketplace Sale': 'Store',
    'Local Service Payment': 'Wrench',
    'Reward Credit': 'Gift',
    'Wallet Transfer': 'ArrowRightLeft',
  };
  return icons[category] || 'Circle';
}

export function getTransactionColor(category: string): string {
  const colors: Record<string, string> = {
    Purchase: 'text-red-400',
    Contribution: 'text-emerald-400',
    'Marketplace Sale': 'text-blue-400',
    'Local Service Payment': 'text-amber-400',
    'Reward Credit': 'text-violet-400',
    'Wallet Transfer': 'text-cyan-400',
  };
  return colors[category] || 'text-gray-400';
}
