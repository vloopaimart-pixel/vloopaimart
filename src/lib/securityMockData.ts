/**
 * VLOOP Phase 14 — AI Security & Trust Center
 * Mock/demo data only. No backend, no API, no auth changes.
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type FraudStatus = 'active' | 'monitoring' | 'resolved' | 'blocked';

export type SecurityMetric = {
  id: string;
  label: string;
  value: string;
  sub: string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color: string;
};

export const securityMetrics: SecurityMetric[] = [
  { id: 'score', label: 'Overall Security Score', value: '92', sub: 'Excellent', icon: 'Shield', trend: 'up', trendValue: '+3', color: 'vloop' },
  { id: 'trust', label: 'AI Trust Score', value: '87', sub: 'Gold Tier', icon: 'Award', trend: 'up', trendValue: '+5', color: 'gold' },
  { id: 'devices', label: 'Active Devices', value: '4', sub: '2 registered', icon: 'Smartphone', trend: 'stable', color: 'vloop' },
  { id: 'sessions', label: 'Login Sessions', value: '3', sub: '1 current', icon: 'Monitor', trend: 'stable', color: 'vloop' },
  { id: 'transactions', label: 'Protected Transactions', value: '1,284', sub: 'Last 30 days', icon: 'ShieldCheck', trend: 'up', trendValue: '+128', color: 'success' },
  { id: 'fraud', label: 'Fraud Alerts', value: '2', sub: '1 active', icon: 'AlertTriangle', trend: 'down', trendValue: '-1', color: 'error' },
  { id: 'health', label: 'Security Health', value: 'Good', sub: 'All systems checked', icon: 'HeartPulse', trend: 'up', color: 'success' },
  { id: 'status', label: 'System Status', value: 'Operational', sub: 'All services running', icon: 'Activity', trend: 'stable', color: 'success' },
];

export type TrustLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type TrustHistoryPoint = {
  month: string;
  score: number;
};

export const trustHistory: TrustHistoryPoint[] = [
  { month: 'Jan', score: 62 },
  { month: 'Feb', score: 65 },
  { month: 'Mar', score: 68 },
  { month: 'Apr', score: 72 },
  { month: 'May', score: 75 },
  { month: 'Jun', score: 80 },
  { month: 'Jul', score: 87 },
];

export const trustTips = [
  { id: 't1', tip: 'Enable two-factor authentication on all devices', impact: '+5 pts', icon: 'Lock' },
  { id: 't2', tip: 'Complete profile verification (KYC)', impact: '+8 pts', icon: 'UserCheck' },
  { id: 't3', tip: 'Maintain consistent purchase activity', impact: '+3 pts', icon: 'ShoppingBag' },
  { id: 't4', tip: 'Avoid multiple failed login attempts', impact: '+4 pts', icon: 'KeyRound' },
  { id: 't5', tip: 'Use VLOOP Wallet for secure transactions', impact: '+2 pts', icon: 'Wallet' },
];

export const trustBenefits = [
  { id: 'b1', label: 'Priority customer support', unlocked: true, icon: 'Headphones' },
  { id: 'b2', label: 'Higher wallet transaction limits', unlocked: true, icon: 'Wallet' },
  { id: 'b3', label: 'Exclusive SmartCode bonus entries', unlocked: true, icon: 'Zap' },
  { id: 'b4', label: 'Reduced fraud hold times', unlocked: true, icon: 'Clock' },
  { id: 'b5', label: 'Premium merchant partnerships', unlocked: false, icon: 'Store' },
  { id: 'b6', label: 'Platinum-only future project access', unlocked: false, icon: 'Rocket' },
];

export type Device = {
  id: string;
  name: string;
  browser: string;
  os: string;
  loginTime: string;
  location: string;
  isCurrent: boolean;
  icon: string;
};

export const devices: Device[] = [
  { id: 'd1', name: 'Chrome — Windows PC', browser: 'Chrome 126', os: 'Windows 11', loginTime: 'Jul 7, 2026 · 10:24 AM', location: 'Bengaluru, IN', isCurrent: true, icon: 'Monitor' },
  { id: 'd2', name: 'Safari — iPhone 15', browser: 'Safari 17', os: 'iOS 17.5', loginTime: 'Jul 6, 2026 · 8:15 PM', location: 'Bengaluru, IN', isCurrent: false, icon: 'Smartphone' },
  { id: 'd3', name: 'Chrome — Android Phone', browser: 'Chrome 126', os: 'Android 14', loginTime: 'Jul 5, 2026 · 2:48 PM', location: 'Mysuru, IN', isCurrent: false, icon: 'Smartphone' },
  { id: 'd4', name: 'Firefox — MacBook Pro', browser: 'Firefox 127', os: 'macOS 14', loginTime: 'Jul 3, 2026 · 11:02 AM', location: 'Bengaluru, IN', isCurrent: false, icon: 'Laptop' },
];

export type FraudAlert = {
  id: string;
  title: string;
  riskLevel: RiskLevel;
  status: FraudStatus;
  time: string;
  recommendation: string;
  icon: string;
};

export const fraudAlerts: FraudAlert[] = [
  {
    id: 'f1',
    title: 'Duplicate SmartCode Submission',
    riskLevel: 'high',
    status: 'active',
    time: '2 hours ago',
    recommendation: 'Review and reject duplicate entries. Notify user of policy violation.',
    icon: 'Copy',
  },
  {
    id: 'f2',
    title: 'Suspicious Wallet Activity',
    riskLevel: 'medium',
    status: 'monitoring',
    time: '5 hours ago',
    recommendation: 'Monitor wallet transfers for next 24 hours. Flag if pattern continues.',
    icon: 'Wallet',
  },
  {
    id: 'f3',
    title: 'High Risk Login Attempt',
    riskLevel: 'critical',
    status: 'blocked',
    time: '1 day ago',
    recommendation: 'Login from unrecognized location blocked. Verify identity via OTP.',
    icon: 'LogIn',
  },
  {
    id: 'f4',
    title: 'Merchant Risk Flag',
    riskLevel: 'medium',
    status: 'monitoring',
    time: '1 day ago',
    recommendation: 'Merchant "FastDeals" has elevated refund rate. Review merchant agreement.',
    icon: 'Store',
  },
  {
    id: 'f5',
    title: 'Multiple Failed Login Attempts',
    riskLevel: 'low',
    status: 'resolved',
    time: '2 days ago',
    recommendation: '5 failed attempts from known device. Password reset completed.',
    icon: 'KeyRound',
  },
  {
    id: 'f6',
    title: 'Fake QR Code Detection',
    riskLevel: 'high',
    status: 'blocked',
    time: '3 days ago',
    recommendation: 'Malicious QR blocked at scan. User notified. Device scan recommended.',
    icon: 'QrCode',
  },
];

export type TimelineEvent = {
  id: string;
  type: 'login' | 'password' | 'wallet' | 'smartcode' | 'merchant' | 'admin' | 'alert';
  title: string;
  desc: string;
  time: string;
  icon: string;
};

export const timelineEvents: TimelineEvent[] = [
  { id: 'e1', type: 'login', title: 'Successful Login', desc: 'Chrome on Windows 11 · Bengaluru, IN', time: '10:24 AM today', icon: 'LogIn' },
  { id: 'e2', type: 'wallet', title: 'Wallet Transaction', desc: '₹2,450 sent to VLOOP Wallet 2', time: '9:15 AM today', icon: 'Wallet' },
  { id: 'e3', type: 'smartcode', title: 'SmartCode Submitted', desc: 'Code 742 submitted for weekly draw', time: '8:30 AM today', icon: 'Zap' },
  { id: 'e4', type: 'alert', title: 'Security Alert Resolved', desc: 'Failed login attempts cleared after password reset', time: 'Yesterday 6:40 PM', icon: 'ShieldAlert' },
  { id: 'e5', type: 'password', title: 'Password Changed', desc: 'Password updated successfully', time: 'Yesterday 5:12 PM', icon: 'KeyRound' },
  { id: 'e6', type: 'merchant', title: 'Merchant Approved', desc: 'Glow Essentials verified as partner merchant', time: 'Jul 5, 4:20 PM', icon: 'Store' },
  { id: 'e7', type: 'admin', title: 'Admin Action', desc: 'Admin reviewed and closed fraud ticket #4821', time: 'Jul 4, 11:00 AM', icon: 'Settings' },
  { id: 'e8', type: 'login', title: 'New Device Login', desc: 'Safari on iPhone 15 · Bengaluru, IN', time: 'Jul 3, 8:15 PM', icon: 'Smartphone' },
];

export type AISuggestion = {
  id: string;
  category: 'shopping' | 'security' | 'trust' | 'reminder';
  title: string;
  desc: string;
  icon: string;
};

export const aiSuggestions: AISuggestion[] = [
  { id: 'a1', category: 'shopping', title: 'Combo Deal Available', desc: 'Buy Basmati Rice + Sunflower Oil together to save 8% and earn 22 extra SmartPoints.', icon: 'ShoppingBag' },
  { id: 'a2', category: 'security', title: 'Enable 2FA on iPhone', desc: 'Your iPhone 15 session lacks two-factor authentication. Enable it for +5 trust score.', icon: 'Lock' },
  { id: 'a3', category: 'trust', title: 'Complete KYC Verification', desc: 'Full KYC verification unlocks Platinum tier and premium merchant benefits.', icon: 'UserCheck' },
  { id: 'a4', category: 'reminder', title: 'SmartCode Draw Tomorrow', desc: 'Weekly SmartCode draw closes tomorrow at 6 PM. Submit your codes now!', icon: 'Clock' },
  { id: 'a5', category: 'security', title: 'Review Device Sessions', desc: 'You have 3 active sessions. Consider logging out from unused devices.', icon: 'Monitor' },
  { id: 'a6', category: 'trust', title: 'Consistent Shopping Streak', desc: 'You have a 12-day shopping streak. Maintain it for +3 trust points.', icon: 'TrendingUp' },
];

export type NotificationItem = {
  id: string;
  category: 'security' | 'wallet' | 'merchant' | 'system' | 'ai';
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: string;
};

export const notifications: NotificationItem[] = [
  { id: 'n1', category: 'security', title: 'High Risk Login Blocked', desc: 'Login attempt from unrecognized location was automatically blocked.', time: '1 hour ago', read: false, icon: 'ShieldAlert' },
  { id: 'n2', category: 'wallet', title: 'Wallet 2 Credited', desc: '₹49 credited to Wallet 2 from your last purchase.', time: '3 hours ago', read: false, icon: 'Wallet' },
  { id: 'n3', category: 'ai', title: 'AI Security Tip', desc: 'Enable biometric login for faster and more secure access.', time: '5 hours ago', read: false, icon: 'Sparkles' },
  { id: 'n4', category: 'merchant', title: 'Merchant Verified', desc: 'Glow Essentials has passed security verification.', time: '1 day ago', read: true, icon: 'Store' },
  { id: 'n5', category: 'system', title: 'System Maintenance Complete', desc: 'Security patches applied. All services operational.', time: '1 day ago', read: true, icon: 'Server' },
  { id: 'n6', category: 'security', title: 'Password Changed', desc: 'Your account password was updated successfully.', time: '2 days ago', read: true, icon: 'KeyRound' },
  { id: 'n7', category: 'wallet', title: 'Large Transaction Alert', desc: 'Transaction of ₹1,899 flagged for review. No action needed.', time: '2 days ago', read: true, icon: 'AlertCircle' },
  { id: 'n8', category: 'system', title: 'New Feature Available', desc: 'AI Fraud Monitor is now active on your account.', time: '3 days ago', read: true, icon: 'Bell' },
];

export function getTrustLevel(score: number): TrustLevel {
  if (score >= 90) return 'Platinum';
  if (score >= 75) return 'Gold';
  if (score >= 60) return 'Silver';
  return 'Bronze';
}

export function getTrustColor(level: TrustLevel): string {
  switch (level) {
    case 'Platinum': return 'from-gray-400 to-gray-600';
    case 'Gold': return 'from-gold-400 to-gold-600';
    case 'Silver': return 'from-gray-300 to-gray-500';
    case 'Bronze': return 'from-amber-600 to-amber-800';
  }
}

export function getRiskColor(level: RiskLevel): { bg: string; text: string; border: string; label: string } {
  switch (level) {
    case 'critical': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Critical' };
    case 'high': return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', label: 'High' };
    case 'medium': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'Medium' };
    case 'low': return { bg: 'bg-success-50', text: 'text-success-600', border: 'border-success-200', label: 'Low' };
  }
}

export function getFraudStatusColor(status: FraudStatus): { bg: string; text: string; label: string } {
  switch (status) {
    case 'active': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Active' };
    case 'monitoring': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Monitoring' };
    case 'resolved': return { bg: 'bg-success-100', text: 'text-success-700', label: 'Resolved' };
    case 'blocked': return { bg: 'bg-vloop-100', text: 'text-vloop-700', label: 'Blocked' };
  }
}
