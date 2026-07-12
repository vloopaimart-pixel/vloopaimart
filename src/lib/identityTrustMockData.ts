// VLOOP Phase 25 - Identity, Trust & Compliance Infrastructure Mock Data

// ============================================================
// MODULE 1: UNIVERSAL IDENTITY CENTER
// ============================================================

export interface VerificationItem {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'unverified' | 'rejected';
  icon: string;
  description: string;
  verified_at?: string;
  expires_at?: string;
}

export const IDENTITY_VERIFICATIONS: VerificationItem[] = [
  { id: 'email', name: 'Email Verification', status: 'verified', icon: 'Mail', description: 'Primary email confirmed', verified_at: '2026-01-15' },
  { id: 'mobile', name: 'Mobile Verification', status: 'verified', icon: 'Smartphone', description: 'Phone number verified via OTP', verified_at: '2026-01-15' },
  { id: 'government_id', name: 'Government ID', status: 'pending', icon: 'CreditCard', description: 'Aadhaar/PAN/Passport verification', verified_at: undefined },
  { id: 'address', name: 'Address Verification', status: 'unverified', icon: 'MapPin', description: 'Residential address proof', verified_at: undefined },
  { id: 'business', name: 'Business Verification', status: 'unverified', icon: 'Building2', description: 'Business registration & GST', verified_at: undefined },
  { id: 'global', name: 'Global Verification', status: 'unverified', icon: 'Globe', description: 'International identity verification', verified_at: undefined },
];

export const IDENTITY_PROGRESS = {
  total: 6,
  completed: 2,
  percentage: 33,
};

// ============================================================
// MODULE 2: VTS™ (VLOOP TRUST SYSTEM)
// ============================================================

export type TrustTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface TrustFactor {
  id: string;
  name: string;
  weight: number;
  score: number;
  max_score: number;
}

export const TRUST_FACTORS: TrustFactor[] = [
  { id: 'purchase_history', name: 'Purchase History', weight: 15, score: 85, max_score: 100 },
  { id: 'delivery_success', name: 'Delivery Success', weight: 12, score: 92, max_score: 100 },
  { id: 'refund_ratio', name: 'Refund Ratio', weight: 8, score: 95, max_score: 100 },
  { id: 'customer_reviews', name: 'Customer Reviews', weight: 10, score: 88, max_score: 100 },
  { id: 'identity_verification', name: 'Identity Verification', weight: 20, score: 33, max_score: 100 },
  { id: 'account_age', name: 'Account Age', weight: 10, score: 60, max_score: 100 },
  { id: 'academy_progress', name: 'Academy Progress', weight: 5, score: 45, max_score: 100 },
  { id: 'care_club', name: 'Care Club Participation', weight: 8, score: 72, max_score: 100 },
  { id: 'community', name: 'Community Behaviour', weight: 7, score: 90, max_score: 100 },
  { id: 'security', name: 'Security Behaviour', weight: 5, score: 100, max_score: 100 },
];

export const TRUST_TIER_CONFIG: Record<TrustTier, { min: number; max: number; color: string; benefits: string[] }> = {
  Bronze: { min: 0, max: 40, color: '#CD7F32', benefits: ['Basic marketplace access', 'Standard rewards'] },
  Silver: { min: 41, max: 60, color: '#C0C0C0', benefits: ['Priority support', 'Enhanced rewards', 'Seller eligibility'] },
  Gold: { min: 61, max: 80, color: '#FFD700', benefits: ['Premium support', 'Higher limits', 'Exclusive offers', 'Verified badge'] },
  Platinum: { min: 81, max: 90, color: '#E5E4E2', benefits: ['VIP support', 'Maximum limits', 'Early access', 'Special rates'] },
  Diamond: { min: 91, max: 100, color: '#B9F2FF', benefits: ['Concierge service', 'Unlimited access', 'Partnership opportunities', 'Founder benefits'] },
};

export function calculateTrustTier(factors: TrustFactor[]): TrustTier {
  const weightedSum = factors.reduce((sum, f) => sum + (f.score / f.max_score) * f.weight, 0);
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const normalizedScore = (weightedSum / totalWeight) * 100;

  if (normalizedScore >= 91) return 'Diamond';
  if (normalizedScore >= 81) return 'Platinum';
  if (normalizedScore >= 61) return 'Gold';
  if (normalizedScore >= 41) return 'Silver';
  return 'Bronze';
}

// ============================================================
// MODULE 3: VERIFIED SELLER
// ============================================================

export interface SellerVerification {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'unverified' | 'rejected';
  required: boolean;
}

export const SELLER_VERIFICATIONS: SellerVerification[] = [
  { id: 'identity', name: 'Identity Verification', status: 'pending', required: true },
  { id: 'business_reg', name: 'Business Registration', status: 'unverified', required: true },
  { id: 'gst', name: 'GST / Tax Registration', status: 'unverified', required: true },
  { id: 'bank', name: 'Bank Verification', status: 'unverified', required: true },
  { id: 'store', name: 'Store Verification', status: 'unverified', required: true },
  { id: 'address', name: 'Business Address', status: 'unverified', required: true },
  { id: 'admin', name: 'Admin Approval', status: 'pending', required: true },
];

// ============================================================
// MODULE 4: COMMUNITY SELLER
// ============================================================

export interface CommunitySellerCategory {
  id: string;
  name: string;
  icon: string;
  verified: boolean;
}

export const COMMUNITY_SELLER_CATEGORIES: CommunitySellerCategory[] = [
  { id: 'farmers', name: 'Farmers', icon: 'Leaf', verified: false },
  { id: 'homemakers', name: 'Home Makers', icon: 'Home', verified: false },
  { id: 'village', name: 'Village Products', icon: 'Mountain', verified: false },
  { id: 'handmade', name: 'Handmade Products', icon: 'Palette', verified: false },
  { id: 'local_shops', name: 'Local Shops', icon: 'Store', verified: false },
];

// ============================================================
// MODULE 5: SERVICE PROFESSIONALS
// ============================================================

export interface ServiceProfession {
  id: string;
  name: string;
  icon: string;
  verified_providers: number;
}

export const SERVICE_PROFESSIONS: ServiceProfession[] = [
  { id: 'electrician', name: 'Electrician', icon: 'Zap', verified_providers: 142 },
  { id: 'plumber', name: 'Plumber', icon: 'Wrench', verified_providers: 98 },
  { id: 'mechanic', name: 'Mechanic', icon: 'Car', verified_providers: 76 },
  { id: 'driver', name: 'Driver', icon: 'Truck', verified_providers: 234 },
  { id: 'tutor', name: 'Tutor', icon: 'BookOpen', verified_providers: 312 },
  { id: 'healthcare', name: 'Healthcare', icon: 'Stethoscope', verified_providers: 54 },
  { id: 'beauty', name: 'Beauty', icon: 'Sparkles', verified_providers: 189 },
  { id: 'freelancer', name: 'Freelancer', icon: 'Briefcase', verified_providers: 423 },
];

export const SERVICE_VERIFICATION_STEPS = [
  { id: 'identity', name: 'Identity Verification', status: 'required' },
  { id: 'experience', name: 'Experience Verification', status: 'required' },
  { id: 'certificate', name: 'Skill Certificate', status: 'optional' },
  { id: 'ratings', name: 'Customer Ratings', status: 'ongoing' },
  { id: 'background', name: 'Background Verification', status: 'required' },
];

// ============================================================
// MODULE 6: AI TRUST SHIELD
// ============================================================

export type RiskLevel = 'green' | 'yellow' | 'red';

export interface ThreatDetection {
  id: string;
  name: string;
  icon: string;
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  last_checked: string;
}

export const THREAT_DETECTIONS: ThreatDetection[] = [
  { id: 'fake_accounts', name: 'Fake Accounts', icon: 'UserX', detected: false, severity: 'high', last_checked: '2026-07-09T10:00:00' },
  { id: 'bot_activity', name: 'Bot Activity', icon: 'Bot', detected: false, severity: 'high', last_checked: '2026-07-09T10:00:00' },
  { id: 'multiple_devices', name: 'Multiple Devices', icon: 'Laptop', detected: false, severity: 'medium', last_checked: '2026-07-09T10:00:00' },
  { id: 'referral_abuse', name: 'Referral Abuse', icon: 'Users', detected: false, severity: 'medium', last_checked: '2026-07-09T10:00:00' },
  { id: 'reward_abuse', name: 'Reward Abuse', icon: 'Gift', detected: false, severity: 'high', last_checked: '2026-07-09T10:00:00' },
  { id: 'smartcode_abuse', name: 'SmartCode Abuse', icon: 'Hash', detected: false, severity: 'critical', last_checked: '2026-07-09T10:00:00' },
  { id: 'fake_reviews', name: 'Fake Reviews', icon: 'MessageSquare', detected: false, severity: 'medium', last_checked: '2026-07-09T10:00:00' },
  { id: 'suspicious_orders', name: 'Suspicious Orders', icon: 'ShoppingCart', detected: false, severity: 'high', last_checked: '2026-07-09T10:00:00' },
  { id: 'gps_manipulation', name: 'GPS Manipulation', icon: 'MapPin', detected: false, severity: 'critical', last_checked: '2026-07-09T10:00:00' },
];

export const CURRENT_RISK_LEVEL: RiskLevel = 'green';

// ============================================================
// MODULE 7: GLOBAL COMPLIANCE CENTER
// ============================================================

export interface ComplianceRule {
  id: string;
  name: string;
  configurable: boolean;
  current_value: string;
}

export const COMPLIANCE_RULES = {
  language: { name: 'Language', configurable: true, current_value: 'English' },
  currency: { name: 'Currency', configurable: true, current_value: 'INR' },
  tax_rules: { name: 'Tax Rules', configurable: true, current_value: 'India GST' },
  consumer_rules: { name: 'Consumer Protection', configurable: true, current_value: 'Enabled' },
  insurance_rules: { name: 'Insurance Regulations', configurable: true, current_value: 'IRDA Compliant' },
  payment_rules: { name: 'Payment Gateway Rules', configurable: true, current_value: 'RBI Compliant' },
  privacy_rules: { name: 'Privacy Regulations', configurable: true, current_value: 'DPDP Compliant' },
  shipping_rules: { name: 'Shipping Regulations', configurable: true, current_value: 'Enabled' },
};

// ============================================================
// MODULE 8: PUBLIC TRUST BADGES
// ============================================================

export interface TrustBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

export const TRUST_BADGES: TrustBadge[] = [
  { id: 'verified_identity', name: 'Verified Identity', icon: 'BadgeCheck', description: 'Identity verified by VLOOP', earned: true },
  { id: 'verified_seller', name: 'Verified Seller', icon: 'Store', description: 'Business documentation verified', earned: false },
  { id: 'community_verified', name: 'Community Verified', icon: 'Users', description: 'Community seller badge', earned: false },
  { id: 'fast_delivery', name: 'Fast Delivery', icon: 'Truck', description: 'Consistent fast delivery record', earned: true },
  { id: 'trusted_partner', name: 'Trusted Partner', icon: 'Handshake', description: 'Long-term partnership status', earned: false },
  { id: 'protection_eligible', name: 'Protection Eligible', icon: 'Shield', description: 'Buyer protection active', earned: true },
];

// ============================================================
// MODULE 9: SECURITY CENTER
// ============================================================

export interface SecurityItem {
  id: string;
  name: string;
  status: 'enabled' | 'disabled' | 'pending';
  icon: string;
  last_activity?: string;
}

export const SECURITY_ITEMS: SecurityItem[] = [
  { id: 'login_history', name: 'Login History', status: 'enabled', icon: 'History', last_activity: '2026-07-09T08:30:00' },
  { id: 'devices', name: 'Connected Devices', status: 'enabled', icon: 'Monitor', last_activity: undefined },
  { id: 'trusted_devices', name: 'Trusted Devices', status: 'enabled', icon: 'ShieldCheck', last_activity: undefined },
  { id: 'recent_activity', name: 'Recent Activity', status: 'enabled', icon: 'Activity', last_activity: '2026-07-09T10:00:00' },
  { id: 'password', name: 'Change Password', status: 'enabled', icon: 'Key', last_activity: '2026-06-15T14:00:00' },
  { id: 'biometric', name: 'Biometric Login', status: 'disabled', icon: 'Fingerprint', last_activity: undefined },
  { id: '2fa', name: 'Two-Factor Auth', status: 'enabled', icon: 'Smartphone', last_activity: '2026-01-15T10:00:00' },
];

export const LOGIN_HISTORY = [
  { id: '1', device: 'Chrome on Windows', location: 'Bangalore, India', time: '2026-07-09T08:30:00', status: 'success' },
  { id: '2', device: 'Safari on iPhone', location: 'Bangalore, India', time: '2026-07-08T18:45:00', status: 'success' },
  { id: '3', device: 'Unknown Device', location: 'Mumbai, India', time: '2026-07-05T22:00:00', status: 'blocked' },
];

// ============================================================
// MODULE 10: PRIVACY CENTER
// ============================================================

export interface PrivacyControl {
  id: string;
  name: string;
  status: 'enabled' | 'disabled';
  description: string;
}

export const PRIVACY_CONTROLS: PrivacyControl[] = [
  { id: 'download_data', name: 'Download My Data', status: 'enabled', description: 'Export all your personal data' },
  { id: 'delete_account', name: 'Delete Account', status: 'enabled', description: 'Permanently delete your account' },
  { id: 'notifications', name: 'Notification Preferences', status: 'enabled', description: 'Control notification settings' },
  { id: 'marketing', name: 'Marketing Preferences', status: 'disabled', description: 'Opt out of marketing communications' },
  { id: 'insurance_consent', name: 'Insurance Consent', status: 'enabled', description: 'Consent for insurance services' },
  { id: 'analytics_consent', name: 'Analytics Consent', status: 'enabled', description: 'Allow usage analytics' },
  { id: 'academy_consent', name: 'Academy Consent', status: 'enabled', description: 'Consent for learning services' },
];

// ============================================================
// MODULE 11: ADMIN DASHBOARD
// ============================================================

export const ADMIN_PENDING_ITEMS = {
  identity_verifications: 45,
  seller_applications: 12,
  community_sellers: 8,
  service_providers: 23,
  fraud_alerts: 3,
  manual_reviews: 7,
  rejected_requests: 15,
  compliance_alerts: 2,
};

// ============================================================
// MODULE 12: AUDIT LOG ENGINE
// ============================================================

export interface AuditLog {
  id: string;
  category: string;
  action: string;
  user_id: string;
  timestamp: string;
  details: string;
  immutable: boolean;
}

export const AUDIT_LOGS: AuditLog[] = [
  { id: '1', category: 'Identity', action: 'Email Verified', user_id: 'USR001', timestamp: '2026-01-15T10:00:00', details: 'Email verification completed', immutable: true },
  { id: '2', category: 'Security', action: '2FA Enabled', user_id: 'USR001', timestamp: '2026-01-15T10:05:00', details: 'Two-factor authentication enabled', immutable: true },
  { id: '3', category: 'Wallet', action: 'Wallet Created', user_id: 'USR001', timestamp: '2026-01-15T10:10:00', details: 'Smart wallet initialized', immutable: true },
  { id: '4', category: 'SmartCode', action: 'Code Submitted', user_id: 'USR001', timestamp: '2026-07-01T15:00:00', details: 'SmartCode 456 submitted', immutable: true },
  { id: '5', category: 'Care Club', action: 'Contribution Made', user_id: 'USR001', timestamp: '2026-07-05T12:00:00', details: 'Food support contribution', immutable: true },
];

// ============================================================
// MODULE 13: LEGAL CENTER
// ============================================================

export const LEGAL_LINKS = [
  { id: 'privacy', name: 'Privacy Policy', page: 'privacy' },
  { id: 'terms', name: 'Terms of Service', page: 'terms' },
  { id: 'refund', name: 'Refund Policy', page: 'refund' },
  { id: 'cookies', name: 'Cookie Policy', page: 'disclaimer' },
  { id: 'community', name: 'Community Standards', page: 'about' },
  { id: 'insurance', name: 'Insurance Partners', page: 'insurance' },
  { id: 'accessibility', name: 'Accessibility', page: 'about' },
  { id: 'compliance', name: 'Compliance', page: 'about' },
];

// ============================================================
// MODULE 14: VCOS LEGAL LOCK
// ============================================================

export const VCOS_LEGAL_LOCK = [
  { rule: 'Skill-Based Rewards', icon: 'Award', enforced: true },
  { rule: 'No Lottery', icon: 'Ban', enforced: true },
  { rule: 'No Betting', icon: 'Ban', enforced: true },
  { rule: 'No Gambling', icon: 'Ban', enforced: true },
  { rule: 'SmartPoints No Cash Value', icon: 'CircleDollarSign', enforced: true },
  { rule: 'Licensed Insurance Partners', icon: 'ShieldCheck', enforced: true },
  { rule: 'Licensed Payment Gateways', icon: 'CreditCard', enforced: true },
  { rule: 'Privacy by Design', icon: 'Lock', enforced: true },
  { rule: 'User Consent First', icon: 'UserCheck', enforced: true },
  { rule: 'Transparent Audit Logs', icon: 'FileText', enforced: true },
];

// ============================================================
// DESIGN TOKENS
// ============================================================

export const DESIGN_TOKENS = {
  colors: {
    ink_navy: '#0B0819',
    signal_gold: '#D4AF37',
    sky_blue: '#00F2FE',
    white: '#FFFFFF',
    success_green: '#22c55e',
  },
  statusColors: {
    verified: '#22c55e',
    pending: '#fbbf24',
    unverified: '#6b7280',
    rejected: '#ef4444',
  },
  trustTierColors: {
    Bronze: '#CD7F32',
    Silver: '#C0C0C0',
    Gold: '#FFD700',
    Platinum: '#E5E4E2',
    Diamond: '#B9F2FF',
  },
};
