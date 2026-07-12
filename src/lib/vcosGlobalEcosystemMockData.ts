// Phase 31 — VCOS™ Global Ecosystem Platform Mock Data
// Universal Identity + Open Partner Platform

// ================================================
// MODULE 1: VCOS UNIVERSAL DIGITAL ID
// ================================================
export const UNIVERSAL_DIGITAL_ID = {
  identityTypes: [
    { type: 'Customer', count: 2847563, color: '#3b82f6', icon: 'User' },
    { type: 'Merchant', count: 45892, color: '#22c55e', icon: 'Store' },
    { type: 'Service Provider', count: 12847, color: '#f59e0b', icon: 'Wrench' },
    { type: 'NGO', count: 3421, color: '#ec4899', icon: 'Heart' },
    { type: 'Volunteer', count: 89234, color: '#8b5cf6', icon: 'HandHeart' },
    { type: 'Institution', count: 2156, color: '#06b6d4', icon: 'Building' },
    { type: 'Enterprise', count: 4521, color: '#D4AF37', icon: 'Building2' },
  ],
  features: [
    { name: 'Universal VLOOP ID', status: 'Active', description: 'Unique identifier across ecosystem' },
    { name: 'QR Identity', status: 'Active', description: 'Scanable identity verification' },
    { name: 'Secure Profile', status: 'Active', description: 'Encrypted personal data vault' },
    { name: 'Multi-device Login', status: 'Active', description: 'Seamless cross-device access' },
    { name: 'Country-aware Identity', status: 'Active', description: 'Localized identity per region' },
    { name: 'Privacy-first Identity', status: 'Active', description: 'GDPR & privacy compliant' },
  ],
  stats: {
    totalIdentities: 3046434,
    verifiedIdentities: 2891245,
    pendingVerifications: 155189,
    monthlyNewIdentities: 127450,
  },
};

// ================================================
// MODULE 2: OPEN PARTNER PLATFORM
// ================================================
export const OPEN_PARTNER_PLATFORM = {
  partnerCategories: [
    { category: 'Retail', partners: 4521, status: 'Active', color: '#3b82f6' },
    { category: 'Education', partners: 892, status: 'Active', color: '#22c55e' },
    { category: 'Healthcare', partners: 1247, status: 'Active', color: '#ef4444' },
    { category: 'Insurance', partners: 456, status: 'Active', color: '#f59e0b' },
    { category: 'Agriculture', partners: 789, status: 'Active', color: '#84cc16' },
    { category: 'Travel', partners: 567, status: 'Active', color: '#06b6d4' },
    { category: 'Hospitality', partners: 923, status: 'Active', color: '#a855f7' },
    { category: 'Government Services', partners: 234, status: 'Active', color: '#64748b' },
    { category: 'NGOs', partners: 1247, status: 'Active', color: '#ec4899' },
    { category: 'Financial Institutions', partners: 456, status: 'Active', color: '#D4AF37' },
    { category: 'Logistics', partners: 678, status: 'Active', color: '#f97316' },
    { category: 'Community Organizations', partners: 1567, status: 'Active', color: '#14b8a6' },
  ],
  stats: {
    totalPartners: 12567,
    activeIntegrations: 11234,
    pendingApplications: 892,
    rejectedApplications: 127,
  },
};

// ================================================
// MODULE 3: VCOS API GATEWAY
// ================================================
export const API_GATEWAY = {
  endpoints: [
    { name: 'Authentication', method: 'POST', endpoint: '/api/v2/auth', calls: '12.5M/day', status: 'Active' },
    { name: 'Identity Verify', method: 'GET', endpoint: '/api/v2/identity/verify', calls: '8.2M/day', status: 'Active' },
    { name: 'Wallet Balance', method: 'GET', endpoint: '/api/v2/wallet/balance', calls: '15.8M/day', status: 'Active' },
    { name: 'Transaction', method: 'POST', endpoint: '/api/v2/transaction', calls: '6.4M/day', status: 'Active' },
    { name: 'SmartCode Validate', method: 'POST', endpoint: '/api/v2/smartcode/validate', calls: '4.2M/day', status: 'Active' },
    { name: 'Partner Sync', method: 'POST', endpoint: '/api/v2/partner/sync', calls: '2.1M/day', status: 'Active' },
    { name: 'Care Club', method: 'GET', endpoint: '/api/v2/care/status', calls: '1.8M/day', status: 'Active' },
    { name: 'Insurance Claim', method: 'POST', endpoint: '/api/v2/insurance/claim', calls: '245K/day', status: 'Active' },
  ],
  security: {
    authentication: ['OAuth 2.0', 'JWT', 'API Keys'],
    rateLimit: { default: '1000 req/min', premium: '10000 req/min' },
    encryption: 'AES-256',
    webhookSupport: true,
    versionControl: 'v2 (v1 deprecated)',
  },
  stats: {
    totalCalls: '51.2M/day',
    avgResponseTime: '45ms',
    uptime: '99.97%',
    errorRate: '0.02%',
  },
};

// ================================================
// MODULE 4: DEVELOPER PORTAL
// ================================================
export const DEVELOPER_PORTAL = {
  features: [
    { name: 'Developer Dashboard', status: 'Active', description: 'Manage apps and API keys' },
    { name: 'Create API Keys', status: 'Active', description: 'Sandbox & production keys' },
    { name: 'Sandbox Mode', status: 'Active', description: 'Test without production impact' },
    { name: 'Production Mode', status: 'Active', description: 'Live API access' },
    { name: 'Usage Analytics', status: 'Active', description: 'Monitor API consumption' },
    { name: 'Webhook Testing', status: 'Active', description: 'Debug webhook endpoints' },
    { name: 'API Explorer', status: 'Active', description: 'Interactive API documentation' },
    { name: 'SDK Downloads', status: 'Active', description: 'Official SDKs for major languages' },
  ],
  sdks: [
    { language: 'JavaScript', version: '2.4.1', downloads: '125K' },
    { language: 'Python', version: '2.3.8', downloads: '89K' },
    { language: 'Java', version: '2.2.5', downloads: '67K' },
    { language: 'PHP', version: '2.1.3', downloads: '45K' },
    { language: 'Go', version: '1.8.2', downloads: '34K' },
    { language: 'Ruby', version: '1.5.4', downloads: '23K' },
  ],
  stats: {
    totalDevelopers: 4521,
    activeApps: 3247,
    sandboxApps: 1892,
    productionApps: 1355,
  },
};

// ================================================
// MODULE 5: UNIVERSAL QR SYSTEM
// ================================================
export const UNIVERSAL_QR_SYSTEM = {
  capabilities: [
    { name: 'Customer ID', description: 'VLOOP identity verification', scans: '25.4M/month' },
    { name: 'Wallet Access', description: 'Quick wallet operations', scans: '18.2M/month' },
    { name: 'Partner Verification', description: 'Business legitimacy check', scans: '8.9M/month' },
    { name: 'Offer Redemption', description: 'Instant discount application', scans: '12.1M/month' },
    { name: 'Care Club', description: 'Community support access', scans: '3.4M/month' },
    { name: 'Insurance Benefits', description: 'Policy verification', scans: '2.1M/month' },
    { name: 'Identity Verification', description: 'KYC/AML verification', scans: '5.6M/month' },
  ],
  stats: {
    totalScans: '75.7M/month',
    uniqueQRCodes: '8.2M',
    scanSuccessRate: '99.8%',
    avgScanTime: '1.2s',
  },
};

// ================================================
// MODULE 6: MULTI-COUNTRY ENGINE
// ================================================
export const MULTI_COUNTRY_ENGINE = {
  countries: [
    { country: 'India', code: 'IN', currency: 'INR', language: 'hi,en', status: 'Active', users: '2.1M' },
    { country: 'UAE', code: 'AE', currency: 'AED', language: 'ar,en', status: 'Active', users: '245K' },
    { country: 'Saudi Arabia', code: 'SA', currency: 'SAR', language: 'ar,en', status: 'Active', users: '189K' },
    { country: 'Qatar', code: 'QA', currency: 'QAR', language: 'ar,en', status: 'Active', users: '98K' },
    { country: 'Oman', code: 'OM', currency: 'OMR', language: 'ar,en', status: 'Active', users: '67K' },
    { country: 'Kuwait', code: 'KW', currency: 'KWD', language: 'ar,en', status: 'Active', users: '112K' },
    { country: 'Singapore', code: 'SG', currency: 'SGD', language: 'en,zh,ms,ta', status: 'Active', users: '156K' },
    { country: 'Malaysia', code: 'MY', currency: 'MYR', language: 'ms,en,zh', status: 'Pending', users: '45K' },
  ],
  localization: {
    languages: 12,
    currencies: 8,
    dateFormats: 8,
    numberFormats: 8,
    taxProfiles: 8,
  },
  stats: {
    totalCountries: 8,
    activeCountries: 7,
    pendingCountries: 1,
    totalUsers: '3.01M',
  },
};

// ================================================
// MODULE 7: ENTERPRISE CONNECTORS
// ================================================
export const ENTERPRISE_CONNECTORS = {
  connectors: [
    { name: 'ERP Integration', type: 'Enterprise', integrations: 234, status: 'Active' },
    { name: 'CRM Sync', type: 'Customer', integrations: 456, status: 'Active' },
    { name: 'HRMS Connect', type: 'HR', integrations: 189, status: 'Active' },
    { name: 'POS Terminal', type: 'Retail', integrations: 1245, status: 'Active' },
    { name: 'Inventory Sync', type: 'Logistics', integrations: 567, status: 'Active' },
    { name: 'Accounting Bridge', type: 'Finance', integrations: 312, status: 'Active' },
    { name: 'E-commerce Platform', type: 'Commerce', integrations: 789, status: 'Active' },
    { name: 'Payment Providers', type: 'Finance', integrations: 45, status: 'Active' },
    { name: 'Insurance Middleware', type: 'Insurance', integrations: 67, status: 'Active' },
    { name: 'Government APIs', type: 'G2C', integrations: 23, status: 'Active' },
  ],
  stats: {
    totalConnectors: 10,
    totalIntegrations: 3927,
    activeConnections: 3845,
    dataSynced: '4.2TB/day',
  },
};

// ================================================
// MODULE 8: SMART INTEGRATION LAYER
// ================================================
export const SMART_INTEGRATION_LAYER = {
  integrations: [
    { name: 'AI Providers', providers: 5, status: 'Active', description: 'OpenAI, Anthropic, Google, etc.' },
    { name: 'Voice AI', providers: 3, status: 'Active', description: 'Amazon Alexa, Google Assistant, Siri' },
    { name: 'Document AI', providers: 2, status: 'Active', description: 'DocuSign, Adobe Sign' },
    { name: 'OCR Services', providers: 3, status: 'Active', description: 'Google Vision, AWS Textract, Azure OCR' },
    { name: 'SMS Gateway', providers: 4, status: 'Active', description: 'Twilio, msg91, TextLocal' },
    { name: 'WhatsApp Business', providers: 1, status: 'Active', description: 'Official WhatsApp Business API' },
    { name: 'Email Services', providers: 3, status: 'Active', description: 'SendGrid, AWS SES, Mailgun' },
    { name: 'Push Notifications', providers: 2, status: 'Active', description: 'Firebase, OneSignal' },
    { name: 'Cloud Storage', providers: 3, status: 'Active', description: 'AWS S3, GCP Storage, Azure Blob' },
  ],
  stats: {
    totalIntegrations: 9,
    totalProviders: 26,
    messagesProcessed: '145M/month',
    aiCalls: '12.4M/month',
  },
};

// ================================================
// MODULE 9: PARTNER TRUST SYSTEM
// ================================================
export const PARTNER_TRUST_SYSTEM = {
  trustMetrics: [
    { metric: 'Partner Verification', score: 98.5, status: 'Excellent' },
    { metric: 'Compliance Status', score: 97.2, status: 'Excellent' },
    { metric: 'Trust Badge', score: 94.8, status: 'Excellent' },
    { metric: 'Performance Rating', score: 92.1, status: 'Good' },
    { metric: 'Response Time', score: 96.7, status: 'Excellent' },
    { metric: 'Customer Feedback', score: 89.3, status: 'Good' },
    { metric: 'Quality Monitoring', score: 95.4, status: 'Excellent' },
  ],
  partnerBadges: [
    { badge: 'Platinum', count: 567, requirements: '99%+ trust score, 2+ years active' },
    { badge: 'Gold', count: 1245, requirements: '95%+ trust score, 1+ year active' },
    { badge: 'Silver', count: 2345, requirements: '90%+ trust score, 6+ months active' },
    { badge: 'Bronze', count: 4567, requirements: '80%+ trust score, verified' },
    { badge: 'Verified', count: 3843, requirements: 'Basic verification complete' },
  ],
  stats: {
    avgTrustScore: 94.2,
    totalVerifiedPartners: 12567,
    suspendedPartners: 89,
    underReview: 234,
  },
};

// ================================================
// MODULE 10: GLOBAL ECOSYSTEM DASHBOARD
// ================================================
export const GLOBAL_ECOSYSTEM_DASHBOARD = {
  metrics: [
    { name: 'Countries Connected', value: 8, trend: '+1 Q3 2026', color: '#3b82f6' },
    { name: 'Partners Connected', value: 12567, trend: '+892 this month', color: '#22c55e' },
    { name: 'APIs Active', value: 45, trend: '+3 this month', color: '#f59e0b' },
    { name: 'Transactions', value: '₹4.85B', trend: '+12.4% MoM', color: '#D4AF37' },
    { name: 'Insurance Activations', value: '2.4M', trend: '+156K this month', color: '#ef4444' },
    { name: 'Wallet Activity', value: '18.2M', trend: 'Active wallets', color: '#8b5cf6' },
    { name: 'Community Impact', value: '₹892M', trend: 'Contributions', color: '#ec4899' },
    { name: 'System Health', value: '99.97%', trend: 'Uptime', color: '#22c55e' },
  ],
  regionalBreakdown: [
    { region: 'India', users: '69.8%', transactions: '72.1%', revenue: '68.4%' },
    { region: 'Middle East', users: '28.2%', transactions: '24.5%', revenue: '27.8%' },
    { region: 'Southeast Asia', users: '2.0%', transactions: '3.4%', revenue: '3.8%' },
  ],
};

// ================================================
// MODULE 11: LEGAL & SECURITY
// ================================================
export const LEGAL_SECURITY = {
  principles: [
    { principle: 'Privacy by Design', status: 'Compliant', description: 'Built-in privacy from ground up' },
    { principle: 'Consent Management', status: 'Compliant', description: 'Explicit user consent tracking' },
    { principle: 'Role Based Access', status: 'Compliant', description: 'Granular permission control' },
    { principle: 'API Security', status: 'Compliant', description: 'OAuth 2.0 + JWT + API Keys' },
    { principle: 'Audit Logs', status: 'Compliant', description: 'Complete activity trail' },
    { principle: 'Encryption', status: 'Compliant', description: 'AES-256 at rest, TLS 1.3 in transit' },
    { principle: 'Data Residency', status: 'Compliant', description: 'Country-specific data storage' },
    { principle: 'Country Compliance', status: 'Compliant', description: 'Local law adherence' },
  ],
  certifications: [
    { name: 'ISO 27001', status: 'Certified', year: '2025' },
    { name: 'SOC 2 Type II', status: 'Certified', year: '2025' },
    { name: 'GDPR', status: 'Compliant', year: '2024' },
    { name: 'PCI DSS', status: 'Level 1', year: '2025' },
  ],
  stats: {
    securityScore: 98.5,
    complianceScore: 99.2,
    incidentsResolved: '100%',
    lastAuditDate: '2026-06-15',
  },
};

// ================================================
// SUMMARY
// ================================================
export const ECOSYSTEM_SUMMARY = {
  title: 'VCOS™ Global Ecosystem Platform',
  tagline: 'Universal Identity + Open Partner Platform',
  modules: [
    'VCOS Universal Digital ID',
    'Open Partner Platform',
    'VCOS API Gateway',
    'Developer Portal',
    'Universal QR System',
    'Multi-Country Engine',
    'Enterprise Connectors',
    'Smart Integration Layer',
    'Partner Trust System',
    'Global Ecosystem Dashboard',
    'Legal & Security',
  ],
  stats: {
    totalIdentities: '3.05M',
    totalPartners: '12,567',
    countriesActive: 7,
    apiCallsPerDay: '51.2M',
    uptime: '99.97%',
    trustScore: 94.2,
  },
};

// Helper functions
export const formatCurrency = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[₹,]/g, '')) : value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  return new Intl.NumberFormat('en-IN').format(num);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Active': '#22c55e',
    'Pending': '#f59e0b',
    'Compliant': '#22c55e',
    'Certified': '#22c55e',
    'Excellent': '#22c55e',
    'Good': '#3b82f6',
    'Suspended': '#ef4444',
  };
  return colors[status] || '#64748b';
};

export const getTrustBadgeColor = (badge: string): string => {
  const colors: Record<string, string> = {
    'Platinum': '#94a3b8',
    'Gold': '#fbbf24',
    'Silver': '#9ca3af',
    'Bronze': '#d97706',
    'Verified': '#22c55e',
  };
  return colors[badge] || '#64748b';
};
