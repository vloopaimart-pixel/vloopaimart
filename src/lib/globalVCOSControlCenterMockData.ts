// ============================================
// VLOOP Global VCOS™ Control Center Mock Data
// Phase 30 - Executive Operations Platform
// ============================================

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
// MODULE 1: Executive Dashboard
// ============================================
export const EXECUTIVE_DASHBOARD = {
  globalRevenue: {
    total: 4850000000,
    thisMonth: 425000000,
    growth: '+18%',
    currency: 'INR',
  },
  partnerGrowth: {
    total: 12500,
    newThisMonth: 850,
    growth: '+12%',
  },
  customerGrowth: {
    total: 2500000,
    newThisMonth: 125000,
    growth: '+15%',
    active: 1850000,
  },
  communityGrowth: {
    sellers: 2450,
    services: 1400,
    careParticipants: 45000,
  },
  careImpact: {
    totalContributed: 15600000,
    livesImpacted: 12500,
    mealsServed: 85000,
    studentsSupported: 1250,
  },
  insuranceStats: {
    activePolicies: 85000,
    claimsThisMonth: 1250,
    pendingClaims: 125,
    payoutThisMonth: 25000000,
  },
  marketplaceActivity: {
    weeklyOrders: 450000,
    weeklyGMV: 125000000,
    topCategory: 'Electronics',
  },
  weeklyParticipation: {
    participants: 125000,
    smartCodesSubmitted: 850000,
    averageTokens: 6.8,
  },
};

// ============================================
// MODULE 2: Country Operations
// ============================================
export const COUNTRY_OPERATIONS = {
  countries: [
    { id: 'in', name: 'India', code: 'IN', status: 'active', revenue: 4500000000, partners: 11850, currency: 'INR', languages: ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu'] },
    { id: 'uae', name: 'UAE', code: 'AE', status: 'active', revenue: 250000000, partners: 450, currency: 'AED', languages: ['English', 'Arabic'] },
    { id: 'sg', name: 'Singapore', code: 'SG', status: 'active', revenue: 100000000, partners: 200, currency: 'SGD', languages: ['English'] },
    { id: 'us', name: 'USA', code: 'US', status: 'planned', revenue: 0, partners: 0, currency: 'USD', languages: ['English', 'Spanish'] },
    { id: 'uk', name: 'United Kingdom', code: 'GB', status: 'planned', revenue: 0, partners: 0, currency: 'GBP', languages: ['English'] },
  ],
  expansionProgress: {
    activeCountries: 3,
    plannedCountries: 2,
    nextLaunch: 'Q4 2026 - USA',
  },
};

// ============================================
// MODULE 3: State & Region Operations
// ============================================
export const REGION_OPERATIONS = {
  regions: [
    { name: 'South India', states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh'], managers: 5, partners: 4500, customers: 850000 },
    { name: 'North India', states: ['Delhi', 'Uttar Pradesh', 'Punjab', 'Haryana'], managers: 4, partners: 3200, customers: 650000 },
    { name: 'West India', states: ['Maharashtra', 'Gujarat', 'Rajasthan'], managers: 3, partners: 2800, customers: 550000 },
    { name: 'East India', states: ['West Bengal', 'Odisha', 'Bihar'], managers: 2, partners: 1350, customers: 300000 },
  ],
  topCities: [
    { name: 'Bangalore', partners: 1250, customers: 425000, orders: 850000 },
    { name: 'Mumbai', partners: 980, customers: 320000, orders: 650000 },
    { name: 'Delhi', partners: 850, customers: 280000, orders: 520000 },
    { name: 'Chennai', partners: 720, customers: 195000, orders: 385000 },
    { name: 'Hyderabad', partners: 650, customers: 175000, orders: 340000 },
  ],
};

// ============================================
// MODULE 4: Live Ecosystem Health
// ============================================
export const ECOSYSTEM_HEALTH = {
  platform: { status: 'healthy', uptime: '99.98%', lastIncident: '15 days ago' },
  api: { status: 'healthy', requests: '2.5M/day', latency: '120ms avg' },
  wallet: { status: 'healthy', uptime: '99.99%', transactions: '125K/day' },
  payments: { status: 'healthy', uptime: '99.95%', processed: '850K/day' },
  insurance: { status: 'healthy', uptime: '99.90%', partners: 3, policies: '85K active' },
  marketplace: { status: 'healthy', uptime: '99.97%', orders: '65K/day' },
  community: { status: 'healthy', uptime: '99.95%', listings: '15K active' },
  ai: { status: 'healthy', uptime: '99.99%', queries: '2.5M/day' },
};

// ============================================
// MODULE 5: SmartCode Analytics
// ============================================
export const SMARTCODE_ANALYTICS = {
  participationTrends: [
    { week: 'Week 28', participants: 125000, submissions: 850000 },
    { week: 'Week 27', participants: 118000, submissions: 780000 },
    { week: 'Week 26', participants: 112000, submissions: 720000 },
    { week: 'Week 25', participants: 105000, submissions: 650000 },
  ],
  topRegions: [
    { region: 'Bangalore', submissions: 185000, avgTokens: 7.2 },
    { region: 'Mumbai', submissions: 145000, avgTokens: 6.8 },
    { region: 'Delhi', submissions: 125000, avgTokens: 6.5 },
  ],
  skillVerification: {
    successRate: '94%',
    averageTime: '48 hours',
    pendingReviews: 1250,
  },
  weeklyDistribution: {
    eligiblePool: 'Standard',
    totalRewards: 2500000,
    participantsRewarded: 95000,
  },
  disclaimer: 'Analytics only — not predictive of winners.',
};

// ============================================
// MODULE 6: Business Intelligence
// ============================================
export const BUSINESS_INTELLIGENCE = {
  revenueTrends: {
    trend: 'upward',
    percentage: '+18%',
    comparedTo: 'last quarter',
    prediction: 'Continued growth expected',
  },
  salesCategories: [
    { category: 'Electronics', revenue: 1250000000, growth: '+25%' },
    { category: 'Fashion', revenue: 850000000, growth: '+15%' },
    { category: 'Home & Kitchen', revenue: 480000000, growth: '+12%' },
    { category: 'Beauty', revenue: 320000000, growth: '+18%' },
    { category: 'Grocery', revenue: 500000000, growth: '+20%' },
  ],
  topProducts: [
    { name: 'Wireless Earbuds Pro', category: 'Electronics', weeklySales: 12500, revenue: 37500000 },
    { name: 'Smart Watch Series 5', category: 'Electronics', weeklySales: 8500, revenue: 127500000 },
    { name: 'Phone Case Premium', category: 'Electronics', weeklySales: 42000, revenue: 25200000 },
  ],
  topServices: [
    { name: 'Electrician', bookings: 8500, revenue: 12750000 },
    { name: 'Plumber', bookings: 6500, revenue: 9750000 },
    { name: 'Tutor', bookings: 12000, revenue: 14400000 },
  ],
  partnerPerformance: [
    { tier: 'Platinum', count: 150, avgRevenue: 85000000 },
    { tier: 'Gold', count: 450, avgRevenue: 45000000 },
    { tier: 'Silver', count: 1250, avgRevenue: 22500000 },
    { tier: 'Bronze', count: 10650, avgRevenue: 8500000 },
  ],
};

// ============================================
// MODULE 7: Customer Intelligence
// ============================================
export const CUSTOMER_INTELLIGENCE = {
  activeUsers: {
    daily: 450000,
    weekly: 1250000,
    monthly: 1850000,
    growth: '+15%',
  },
  retention: {
    day1: '68%',
    day7: '52%',
    day30: '38%',
    day90: '28%',
  },
  repeatPurchases: {
    once: 1250000,
    twice: 650000,
    threePlus: 350000,
  },
  walletUsage: {
    balance: 18500000000,
    transactions: 125000,
    avgBalance: 7500,
  },
  benefitAdoption: {
    active: 450000,
    pendingRelease: 125000,
    claimed: 850000,
  },
  protectionActivation: {
    active: 285000,
    expiringSoon: 25000,
    expired: 15000,
  },
  communityParticipation: {
    careClub: 45000,
    seller: 2450,
    services: 1400,
  },
};

// ============================================
// MODULE 8: AI Monitoring Center
// ============================================
export const AI_MONITORING = {
  aiRequests: {
    total: 2500000,
    daily: 85000,
    successRate: '99.5%',
    avgResponseTime: '0.8s',
  },
  responseQuality: {
    excellent: '85%',
    good: '12%',
    needsWork: '3%',
  },
  privacyAlerts: {
    total: 0,
    blocked: 0,
    reviewed: 25,
  },
  safetyFilters: {
    triggered: 125,
    blocked: 8,
    warnings: 45,
  },
  recommendationAccuracy: {
    clicked: '42%',
    purchased: '18%',
    saved: '25%',
  },
  voiceUsage: {
    queries: 12500,
    languages: 4,
    avgAccuracy: '95%',
  },
  llmHealth: {
    status: 'healthy',
    lastUpdate: '2026-07-08',
    modelVersion: 'v2.5.1',
  },
};

// ============================================
// MODULE 9: Compliance Center
// ============================================
export const COMPLIANCE_CENTER = {
  privacyCompliance: {
    score: '98%',
    gdpr: 'compliant',
    dpdp: 'compliant',
    lastAudit: '2026-07-01',
  },
  auditLogs: {
    total: 2500000,
    immutable: true,
    retentionDays: 2555,
    encrypted: true,
  },
  insuranceIntegrations: {
    active: 3,
    licensed: true,
    lastVerification: '2026-06-01',
  },
  paymentCompliance: {
    pciDss: 'compliant',
    licensedGateways: 5,
    lastAudit: '2026-06-15',
  },
  consentRecords: {
    total: 2500000,
    withConsent: 2485000,
    pending: 15000,
  },
  riskDashboard: {
    overallRisk: 'low',
    flaggedAccounts: 125,
    underReview: 45,
    resolved: 850,
  },
};

// ============================================
// MODULE 10: Fraud & Security Center
// ============================================
export const FRAUD_SECURITY_CENTER = {
  suspiciousActivity: [
    { type: 'fake_reviews', detected: 15, blocked: 12, severity: 'medium' },
    { type: 'price_manipulation', detected: 8, blocked: 6, severity: 'low' },
    { type: 'account_abuse', detected: 5, blocked: 5, severity: 'high' },
  ],
  sybilShield: {
    alerts: 125,
    blocked: 85,
    underReview: 40,
    accuracy: '97%',
  },
  deviceVerification: {
    total: 2500000,
    verified: 2450000,
    pending: 50000,
  },
  geoRisk: {
    highRisk: 125,
    mediumRisk: 450,
    lowRisk: 2499425,
  },
  escrowMonitoring: {
    active: 12500,
    pending: 2500,
    released: 85000,
    held: 450000000,
  },
  incidentReports: [
    { id: 'INC-001', type: 'Suspicious Login', status: 'resolved', date: '2026-07-07' },
    { id: 'INC-002', type: 'Price Alert', status: 'investigating', date: '2026-07-08' },
  ],
};

// ============================================
// MODULE 11: System Audit
// ============================================
export const SYSTEM_AUDIT = {
  immutableLogs: {
    enabled: true,
    total: 2500000,
    lastEntry: '2026-07-08 14:30:25',
  },
  systemChanges: [
    { type: 'config_update', by: 'admin_001', timestamp: '2026-07-08 12:15', description: 'Updated payment gateway timeout' },
    { type: 'feature_toggle', by: 'admin_002', timestamp: '2026-07-08 11:30', description: 'Enabled new AI module' },
    { type: 'policy_update', by: 'admin_001', timestamp: '2026-07-07 16:45', description: 'Updated RLS policy for wallets' },
  ],
  adminActions: {
    today: 125,
    thisWeek: 850,
    thisMonth: 3200,
  },
  roleChanges: [
    { user: 'user_2847', oldRole: 'customer', newRole: 'partner', by: 'admin_001', date: '2026-07-06' },
  ],
  complianceReports: {
    generated: 45,
    pending: 3,
    nextDue: '2026-10-01',
  },
};

// ============================================
// MODULE 12: Global Notification Hub
// ============================================
export const NOTIFICATION_HUB = {
  emergencyNotices: [
    { id: 'en1', message: 'Payment gateway maintenance scheduled', status: 'scheduled', audience: 'all', date: '2026-07-10' },
  ],
  regionalAnnouncements: [
    { id: 'ra1', region: 'Bangalore', message: 'New partner store launch event', status: 'sent', date: '2026-07-08' },
  ],
  maintenanceAlerts: [
    { id: 'ma1', service: 'Wallet', message: 'Scheduled maintenance window', status: 'upcoming', date: '2026-07-12', duration: '2 hours' },
  ],
  campaignLaunches: [
    { id: 'cl1', name: 'Monsoon Fest 2026', status: 'live', reach: 1850000, launched: '2026-07-01' },
  ],
  partnerUpdates: [
    { id: 'pu1', message: 'New SDK v3.0 available', status: 'sent', partners: 12500, date: '2026-07-05' },
  ],
  customerBroadcasts: {
    sent: 12500,
    opened: 8500,
    avgOpenRate: '68%',
  },
};

// ============================================
// MODULE 13: Disaster Recovery
// ============================================
export const DISASTER_RECOVERY = {
  backupStatus: {
    primary: 'healthy',
    lastBackup: '2026-07-08 14:00',
    size: '2.5 TB',
    frequency: 'Every 15 minutes',
  },
  recoveryPoints: {
    total: 96,
    earliest: '2026-07-05',
    latest: '2026-07-08',
  },
  databaseHealth: {
    status: 'healthy',
    size: '1.8 TB',
    connections: 850,
    replication: 'synchronized',
  },
  cloudStatus: {
    primary: 'healthy',
    secondary: 'healthy',
    cdn: 'healthy',
  },
  failoverReadiness: {
    status: 'ready',
    lastTest: '2026-07-01',
    rto: '15 minutes',
    rpo: '5 minutes',
  },
  recoveryTesting: {
    lastTest: '2026-07-01',
    result: 'passed',
    nextScheduled: '2026-08-01',
  },
};

// ============================================
// MODULE 14: Executive Reports
// ============================================
export const EXECUTIVE_REPORTS = {
  available: [
    { type: 'Daily', status: 'auto-generated', lastGenerated: '2026-07-08' },
    { type: 'Weekly', status: 'auto-generated', lastGenerated: '2026-07-07' },
    { type: 'Monthly', status: 'auto-generated', lastGenerated: '2026-07-01' },
    { type: 'Quarterly', status: 'auto-generated', lastGenerated: '2026-07-01' },
    { type: 'Annual', status: 'manual', lastGenerated: '2026-01-01' },
  ],
  exports: {
    pdf: true,
    excel: true,
    csv: true,
  },
  scheduled: [
    { name: 'Board Report', frequency: 'Quarterly', recipients: 5, nextRun: '2026-10-01' },
    { name: 'Operations Summary', frequency: 'Weekly', recipients: 12, nextRun: '2026-07-15' },
  ],
};

// ============================================
// MODULE 15: Legal Green Zone
// ============================================
export const LEGAL_GREEN_ZONE = {
  rules: [
    { id: 'lgz1', rule: 'Privacy by Design', status: 'enforced', audits: 250 },
    { id: 'lgz2', rule: 'Audit by Default', status: 'enforced', audits: 250 },
    { id: 'lgz3', rule: 'Consent Tracking', status: 'enforced', audits: 250 },
    { id: 'lgz4', rule: 'Licensed Financial Integrations', status: 'enforced', audits: 24 },
    { id: 'lgz5', rule: 'Licensed Insurance Integrations', status: 'enforced', audits: 24 },
    { id: 'lgz6', rule: 'Immutable Logs', status: 'enforced', audits: 250 },
    { id: 'lgz7', rule: 'Role-Based Access', status: 'enforced', audits: 250 },
    { id: 'lgz8', rule: 'Zero Direct Financial Promises', status: 'enforced', audits: 250 },
  ],
  complianceScore: '99%',
  lastAudit: '2026-07-01',
};

// ============================================
// Global Control Center Summary
// ============================================
export const CONTROL_CENTER_SUMMARY = {
  status: 'operational',
  lastUpdated: '2026-07-08 14:30',
  activeModules: 17,
  alerts: {
    critical: 0,
    warning: 3,
    info: 12,
  },
  healthScore: '99.8%',
};

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

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    healthy: '#22c55e',
    active: '#22c55e',
    operational: '#22c55e',
    compliant: '#22c55e',
    passed: '#22c55e',
    ready: '#22c55e',
    planned: '#8b5cf6',
    scheduled: '#eab308',
    upcoming: '#eab308',
    investigating: '#eab308',
    pending: '#eab308',
    critical: '#ef4444',
    high: '#ef4444',
    auto_generated: '#22c55e',
    manual: '#eab308',
    live: '#22c55e',
    sent: '#22c55e',
    resolved: '#22c55e',
  };
  return colors[status] || '#94a3b8';
}

export function getHealthBadge(status: string): { color: string; bg: string } {
  const configs: Record<string, { color: string; bg: string }> = {
    healthy: { color: '#22c55e', bg: 'rgba(34,197,94,0.2)' },
    warning: { color: '#eab308', bg: 'rgba(234,179,8,0.2)' },
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.2)' },
    maintenance: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.2)' },
  };
  return configs[status] || configs.healthy;
}
