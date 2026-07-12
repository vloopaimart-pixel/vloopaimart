// ============================================
// VLOOP Universal Wallet Ecosystem Mock Data
// Phase 27 - VCOS™ Production
// ============================================

import { CircleDollarSign } from 'lucide-react';

// ============================================
// Design Tokens
// ============================================
export const DESIGN_TOKENS = {
  background: '#0B0819',
  backgroundAlt: '#1a1530',
  gold: '#D4AF37',
  goldDark: '#B8941F',
  cyan: '#00F2FE',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  purple: '#8b5cf6',
};

// ============================================
// WALLET 1 - Customer Balance
// ============================================
export const WALLET_1_CUSTOMER = {
  id: 'wallet-1-customer',
  name: 'Customer Balance',
  description: 'Your personal funds for purchases',
  balance: 12580.00,
  currency: 'INR',
  type: 'customer_funds',
  disclaimer: 'Customer funds are held securely and can be withdrawn where permitted.',
  features: ['Deposit', 'Purchase', 'Refund', 'Payment', 'Withdrawal'],
  transactionHistory: [
    { id: 't1', type: 'deposit', amount: 5000, date: '2026-07-05', description: 'Added via UPI', status: 'completed' },
    { id: 't2', type: 'purchase', amount: -1250, date: '2026-07-06', description: 'Order #ORD-78234', status: 'completed' },
    { id: 't3', type: 'refund', amount: 450, date: '2026-07-07', description: 'Refund for Order #ORD-78100', status: 'completed' },
    { id: 't4', type: 'withdrawal', amount: -2000, date: '2026-07-08', description: 'Bank Transfer', status: 'pending' },
  ],
};

// ============================================
// WALLET 2 - Sponsored Loyalty Benefits
// ============================================
export const WALLET_2_SPONSORED = {
  id: 'wallet-2-sponsored',
  name: 'Sponsored Loyalty Benefits',
  description: 'Rewards from partner programs and campaigns',
  type: 'sponsored_benefits',
  disclaimer: 'Benefits are subject to program rules and verification. Not guaranteed returns.',
  benefits: {
    available: 2500,
    pending: 1200,
    locked: 800,
    released: 3200,
  },
  holdingPeriod: 'Benefits become available after applicable program rules and verification.',
  benefitItems: [
    { id: 'b1', name: 'Eligible Purchase Benefit', amount: 500, status: 'available', source: 'Partner Campaign', date: '2026-07-01' },
    { id: 'b2', name: 'Campaign Benefit', amount: 750, status: 'pending', source: 'Festival Rewards', date: '2026-07-05', releaseDate: '2026-07-15' },
    { id: 'b3', name: 'Corporate Sponsored', amount: 300, status: 'locked', source: 'Referral Program', date: '2026-06-20', releaseDate: '2026-07-20' },
    { id: 'b4', name: 'Reward Credits', amount: 1200, status: 'available', source: 'Loyalty Tier', date: '2026-07-02' },
    { id: 'b5', name: 'Premium Campaign', amount: 800, status: 'pending', source: 'Brand Partnership', date: '2026-07-06', releaseDate: '2026-07-16' },
  ],
};

// ============================================
// WALLET 3 - Protection Wallet
// ============================================
export const WALLET_3_PROTECTION = {
  id: 'wallet-3-protection',
  name: 'Protection Wallet',
  description: 'Active protection plans for devices and purchases',
  type: 'protection',
  disclaimer: 'Protection benefits provided through licensed partners.',
  protections: [
    { id: 'p1', type: 'Device Protection', name: 'Smartphone Shield', device: 'iPhone 15 Pro', activationDate: '2026-01-15', expiryDate: '2027-01-14', status: 'active', policyLink: '#' },
    { id: 'p2', type: 'Purchase Protection', name: 'Order Guard', order: '#ORD-75632', activationDate: '2026-06-20', expiryDate: '2026-09-20', status: 'active', policyLink: '#' },
    { id: 'p3', type: 'Personal Accident', name: 'Personal Shield Plus', activationDate: '2026-03-01', expiryDate: '2027-02-28', status: 'active', policyLink: '#' },
    { id: 'p4', type: 'Device Protection', name: 'Laptop Cover', device: 'MacBook Pro 14"', activationDate: '2025-11-10', expiryDate: '2026-11-09', status: 'expiring_soon', policyLink: '#' },
  ],
};

// ============================================
// WALLET 4 - Insurance Wallet
// ============================================
export const WALLET_4_INSURANCE = {
  id: 'wallet-4-insurance',
  name: 'Insurance Wallet',
  description: 'Policies and coverage from licensed partners',
  type: 'insurance',
  disclaimer: 'All insurance policies are provided by licensed partner companies.',
  policies: [
    { id: 'i1', type: 'Complimentary Insurance', name: 'Health Guard Basic', partner: 'HDFC Life', policyNumber: 'HL-2847291', activationDate: '2026-01-01', expiryDate: '2026-12-31', coverage: '2,00,000', status: 'active', claimStatus: null, renewalReminder: '2026-10-15', pdfLink: '#' },
    { id: 'i2', type: 'Micro Insurance', name: 'Daily Hospital Cash', partner: 'ICICI Lombard', policyNumber: 'IL-9284712', activationDate: '2026-04-01', expiryDate: '2027-03-31', coverage: '5,000/day', status: 'active', claimStatus: 'Claim #CLM-2341 - Under Review', renewalReminder: '2027-01-15', pdfLink: '#' },
    { id: 'i3', type: 'Partner Policy', name: 'Travel Shield', partner: 'Bajaj Allianz', policyNumber: 'BA-1847293', activationDate: '2026-06-15', expiryDate: '2027-06-14', coverage: '5,00,000', status: 'active', claimStatus: null, renewalReminder: '2027-04-15', pdfLink: '#' },
    { id: 'i4', type: 'Complimentary Insurance', name: 'Accident Cover', partner: 'Star Health', policyNumber: 'SH-3847294', activationDate: '2025-09-01', expiryDate: '2026-08-31', coverage: '1,00,000', status: 'expiring_soon', claimStatus: null, renewalReminder: '2026-07-25', pdfLink: '#' },
  ],
};

// ============================================
// WALLET 5 - Care Club Wallet
// ============================================
export const WALLET_5_CARE_CLUB = {
  id: 'wallet-5-care-club',
  name: 'Care Club Wallet',
  description: 'Community contributions and impact',
  type: 'care_club',
  disclaimer: 'Care contributions are transparently tracked with full audit trail.',
  stats: {
    totalContributions: 156000,
    foodPrograms: 45000,
    medicalSupport: 38500,
    educationSupport: 42500,
    communityProjects: 30000,
  },
  impact: {
    livesImpacted: 1250,
    mealsServed: 8500,
    studentsSupported: 120,
    medicalAid: 85,
  },
  recentActivities: [
    { id: 'c1', program: 'Food Programs', amount: 5000, date: '2026-07-08', beneficiaries: 125, description: 'Weekly food distribution' },
    { id: 'c2', program: 'Medical Support', amount: 3800, date: '2026-07-05', beneficiaries: 12, description: 'Medical camp support' },
    { id: 'c3', program: 'Education', amount: 2500, date: '2026-07-01', beneficiaries: 25, description: 'School supplies distribution' },
  ],
  ledger: [
    { date: '2026-07-08', type: 'contribution', amount: 1500, source: 'Member Contributions', runningTotal: 156000 },
    { date: '2026-07-06', type: 'disbursement', amount: -5000, source: 'Food Program', runningTotal: 154500 },
    { date: '2026-07-04', type: 'contribution', amount: 2200, source: 'Partner Donation', runningTotal: 159500 },
  ],
};

// ============================================
// WALLET 6 - Business Wallet
// ============================================
export const WALLET_6_BUSINESS = {
  id: 'wallet-6-business',
  name: 'Business Wallet',
  description: 'Partner and seller settlements',
  type: 'business',
  disclaimer: 'Business settlements are processed per partner agreements.',
  stats: {
    totalSales: 458750,
    pendingSettlement: 28500,
    escrowBalance: 15000,
    thisMonthPayout: 125000,
  },
  businesses: [
    { id: 'bus1', name: 'TechGear Store', type: 'Partner Store', sales: 125000, pending: 8500, status: 'active' },
    { id: 'bus2', name: 'HomeStyle Crafts', type: 'Community Seller', sales: 45800, pending: 3200, status: 'active' },
    { id: 'bus3', name: 'QuickFix Services', type: 'Local Service', sales: 28500, pending: 2100, status: 'active' },
  ],
  invoices: [
    { id: 'inv1', business: 'TechGear Store', period: 'July 2026', amount: 42500, status: 'paid', paidDate: '2026-07-05' },
    { id: 'inv2', business: 'HomeStyle Crafts', period: 'July 2026', amount: 15800, status: 'pending', dueDate: '2026-07-15' },
    { id: 'inv3', business: 'QuickFix Services', period: 'June 2026', amount: 9200, status: 'processing', dueDate: '2026-07-10' },
  ],
  payoutStatus: {
    nextPayout: '2026-07-15',
    estimatedAmount: 32000,
    bankAccount: 'XXXX XXXX 4521',
  },
};

// ============================================
// WALLET 7 - Reward Center
// ============================================
export const WALLET_7_REWARD_CENTER = {
  id: 'wallet-7-rewards',
  name: 'Reward Center',
  description: 'Weekly participation and sponsored rewards',
  type: 'rewards',
  disclaimer: 'SmartPoints have no cash value until converted per program rules.',
  weeklyParticipation: {
    currentParticipation: 5,
    smartCodesEntered: 8,
    eligiblePool: 'Standard',
    estimatedBenefit: 250,
  },
  sponsorRewards: {
    prime: { name: 'Prime Sponsored Reward', amount: 5000, status: 'active', description: 'Top tier weekly reward for VLOOP Prime members' },
    premium: { name: 'Premium Sponsored Reward', amount: 2500, status: 'active', description: 'Mid-tier sponsored reward' },
    standard: { name: 'Standard Sponsored Reward', amount: 1000, status: 'active', description: 'Base tier reward for all participants' },
  },
  skillVerification: {
    status: 'verified',
    level: 'Gold',
    badges: 12,
    verifiedDate: '2026-06-15',
  },
  participationHistory: [
    { week: 'Week 28', participation: 8, reward: 180, status: 'completed' },
    { week: 'Week 27', participation: 6, reward: 150, status: 'completed' },
    { week: 'Week 26', participation: 9, reward: 220, status: 'completed' },
    { week: 'Week 25', participation: 7, reward: 175, status: 'completed' },
  ],
  rewardHistory: [
    { id: 'r1', type: 'Weekly Reward', amount: 180, date: '2026-07-07', source: 'Week 28 Participation' },
    { id: 'r2', type: 'Sponsored Benefit', amount: 500, date: '2026-07-01', source: 'Prime Campaign' },
    { id: 'r3', type: 'Skill Bonus', amount: 250, date: '2026-06-15', source: 'Verification Badge' },
  ],
};

// ============================================
// AI Wallet Assistant
// ============================================
export const AI_WALLET_ASSISTANT = {
  suggestions: [
    { id: 's1', type: 'benefit_release', title: 'Benefit Release', description: 'Campaign Benefit of 750 will be released on July 15', action: 'View Details', priority: 'high' },
    { id: 's2', type: 'expiry_alert', title: 'Protection Expiry', description: 'Laptop Cover expires on Nov 9, 2026', action: 'Renew Now', priority: 'medium' },
    { id: 's3', type: 'insurance_renewal', title: 'Insurance Renewal', description: 'Accident Cover renewal reminder - Aug 31', action: 'Renew', priority: 'medium' },
    { id: 's4', type: 'nearby_offer', title: 'Nearby Partner Offer', description: '20% off at TechGear Store - within 2km', action: 'View Offer', priority: 'low' },
  ],
  insights: {
    totalAvailableBenefits: 2500,
    upcomingReleases: 1200,
    expiringThisMonth: 2,
    suggestedActions: 4,
  },
  personalizedGuidance: [
    'Complete 3 more SmartCodes to qualify for Premium tier',
    'Your purchase history qualifies you for Loyalty Gold',
    'Consider renewing your Laptop Cover before expiry',
  ],
};

// ============================================
// Security Features
// ============================================
export const WALLET_SECURITY = {
  features: [
    { id: 'sec1', name: 'Biometric Lock', status: 'enabled', lastUsed: '2026-07-08' },
    { id: 'sec2', name: 'PIN Protection', status: 'enabled', lastUpdated: '2026-05-15' },
    { id: 'sec3', name: 'Face ID', status: 'enabled', device: 'iPhone 15 Pro' },
    { id: 'sec4', name: 'OTP Verification', status: 'enabled', phone: '+91 XXXXX 67890' },
    { id: 'sec5', name: 'Device Verification', status: 'enabled', devices: 2 },
    { id: 'sec6', name: 'Fraud Detection', status: 'active', alertsBlocked: 5 },
  ],
  deviceList: [
    { id: 'd1', name: 'iPhone 15 Pro', type: 'mobile', lastActive: '2026-07-08 14:30', verified: true },
    { id: 'd2', name: 'MacBook Pro', type: 'laptop', lastActive: '2026-07-08 12:15', verified: true },
  ],
};

// ============================================
// Admin Wallet Dashboard
// ============================================
export const ADMIN_WALLET_DASHBOARD = {
  stats: {
    totalWallets: 125000,
    totalCustomerFunds: 125000000,
    totalSponsoredBenefits: 45000000,
    totalInsurancePolicies: 28000,
    careClubContributions: 15600000,
    escrowBalance: 8500000,
  },
  pending: {
    benefitReleases: 1250,
    settlements: 85,
    insuranceClaims: 42,
    verifications: 125,
  },
  alerts: {
    fraudAlerts: 8,
    expiringPolicies: 150,
    pendingApproval: 25,
  },
  recentActivity: [
    { time: '14:25', action: 'Benefit Release', user: 'user_12847', amount: 500 },
    { time: '14:10', action: 'Settlement Processed', user: 'partner_2847', amount: 15000 },
    { time: '13:55', action: 'Insurance Claim', user: 'user_38471', status: 'Under Review' },
    { time: '13:30', action: 'Fraud Alert', user: 'user_84712', status: 'Blocked' },
  ],
};

// ============================================
// Legal Green Zone
// ============================================
export const LEGAL_GREEN_ZONE = {
  rules: [
    { id: 'lgz1', rule: 'Wallet 1 holds only Customer Funds', status: 'enforced', category: 'compliance' },
    { id: 'lgz2', rule: 'Wallet 2 contains Sponsored Benefits only', status: 'enforced', category: 'compliance' },
    { id: 'lgz3', rule: 'SmartPoints have no cash value', status: 'enforced', category: 'disclosure' },
    { id: 'lgz4', rule: 'Benefits subject to program rules', status: 'enforced', category: 'disclosure' },
    { id: 'lgz5', rule: 'Insurance via licensed partners only', status: 'enforced', category: 'licensing' },
    { id: 'lgz6', rule: 'Complete audit trail maintained', status: 'enforced', category: 'audit' },
    { id: 'lgz7', rule: 'User consent required', status: 'enforced', category: 'privacy' },
    { id: 'lgz8', rule: 'Privacy by design', status: 'enforced', category: 'privacy' },
  ],
  auditTrail: {
    enabled: true,
    retentionDays: 2555, // 7 years
    immutable: true,
    encrypted: true,
  },
};

// ============================================
// Wallet Activity Timeline
// ============================================
export const WALLET_TIMELINE = [
  { id: 'wta1', type: 'purchase', wallet: 'Customer Balance', description: 'Order #ORD-78234', amount: -1250, date: '2026-07-08 14:30' },
  { id: 'wta2', type: 'benefit_earned', wallet: 'Sponsored Benefits', description: 'Campaign Benefit earned', amount: 750, date: '2026-07-08 12:15' },
  { id: 'wta3', type: 'benefit_released', wallet: 'Sponsored Benefits', description: 'Loyalty Benefit released', amount: 500, date: '2026-07-07 10:00' },
  { id: 'wta4', type: 'insurance_activated', wallet: 'Insurance', description: 'Travel Shield activated', date: '2026-07-06 16:45' },
  { id: 'wta5', type: 'reward_sponsored', wallet: 'Reward Center', description: 'Weekly reward credited', amount: 180, date: '2026-07-07 08:00' },
  { id: 'wta6', type: 'refund', wallet: 'Customer Balance', description: 'Order refund', amount: 450, date: '2026-07-07 14:20' },
  { id: 'wta7', type: 'settlement', wallet: 'Business', description: 'Partner payout processed', amount: 42500, date: '2026-07-05 11:30' },
  { id: 'wta8', type: 'claim_update', wallet: 'Insurance', description: 'Claim #CLM-2341 - Under Review', date: '2026-07-05 09:15' },
];

// ============================================
// Helper Functions
// ============================================
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getWalletIcon(walletType: string): string {
  const icons: Record<string, string> = {
    customer_funds: 'Wallet',
    sponsored_benefits: 'Gift',
    protection: 'Shield',
    insurance: 'FileText',
    care_club: 'Heart',
    business: 'Building2',
    rewards: 'Award',
  };
  return icons[walletType] || 'Wallet';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: '#22c55e',
    available: '#22c55e',
    pending: '#eab308',
    locked: '#8b5cf6',
    released: '#00F2FE',
    completed: '#22c55e',
    expiring_soon: '#f97316',
    expired: '#ef4444',
    processing: '#eab308',
    paid: '#22c55e',
  };
  return colors[status] || '#94a3b8';
}
