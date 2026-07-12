// Phase 17 — VCOS Operations Layer (Mock Data)
// UI architecture only. No backend, no real processing.

export type ActivityType =
  | 'purchase' | 'contribution' | 'receipt' | 'scan'
  | 'manual' | 'reward' | 'challenge';

export type ActivityEvent = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  user: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'pending';
};

export const activityStream: ActivityEvent[] = [
  { id: 'a1', type: 'purchase', title: 'Purchase Completed', description: 'Order #ORD-4821 · ₹2,450', user: 'Rajesh K.', timestamp: '2 min ago', status: 'completed' },
  { id: 'a2', type: 'contribution', title: 'Contribution Received', description: 'Care Club · ₹500', user: 'Priya S.', timestamp: '5 min ago', status: 'completed' },
  { id: 'a3', type: 'receipt', title: 'Receipt Uploaded', description: 'Receipt #R-9034 pending validation', user: 'Amit M.', timestamp: '8 min ago', status: 'processing' },
  { id: 'a4', type: 'scan', title: 'QR Scan', description: 'SmartCode 7-4-1 scanned', user: 'Sneha R.', timestamp: '12 min ago', status: 'completed' },
  { id: 'a5', type: 'manual', title: 'Manual SmartCode Entry', description: 'Code 3-8-2 entered via keypad', user: 'Vikram J.', timestamp: '15 min ago', status: 'completed' },
  { id: 'a6', type: 'reward', title: 'Reward Qualified', description: 'Prime tier eligibility confirmed', user: 'Rajesh K.', timestamp: '22 min ago', status: 'completed' },
  { id: 'a7', type: 'challenge', title: 'Challenge Entry', description: 'Weekly challenge entry #12847', user: 'Priya S.', timestamp: '28 min ago', status: 'pending' },
  { id: 'a8', type: 'purchase', title: 'Purchase Completed', description: 'Order #ORD-4820 · ₹1,200', user: 'Deepak V.', timestamp: '35 min ago', status: 'completed' },
];

// Customer Timeline
export type TimelineStage = {
  id: string;
  label: string;
  icon: string;
  status: 'completed' | 'current' | 'upcoming';
  detail: string;
};

export const customerTimeline: TimelineStage[] = [
  { id: 't1', label: 'Purchase', icon: 'ShoppingBag', status: 'completed', detail: 'Order #ORD-4821 · ₹2,450' },
  { id: 't2', label: 'SmartPoints Generated', icon: 'Sparkles', status: 'completed', detail: '120 SP earned' },
  { id: 't3', label: 'SmartCode Generated', icon: 'Ticket', status: 'completed', detail: 'Code: 7-4-1' },
  { id: 't4', label: 'Challenge Entry', icon: 'Trophy', status: 'current', detail: 'Entry #12847 · Week 27' },
  { id: 't5', label: 'Reward Eligibility', icon: 'Gift', status: 'upcoming', detail: 'Pending verification' },
  { id: 't6', label: 'Weekly Result', icon: 'Award', status: 'upcoming', detail: 'Draw on Sunday' },
  { id: 't7', label: 'Reward Distribution', icon: 'Wallet', status: 'upcoming', detail: 'VCOS verified' },
  { id: 't8', label: 'History', icon: 'History', status: 'upcoming', detail: 'Archived' },
];

// Event Processing Cards
export type EventState = 'waiting' | 'processing' | 'verified' | 'completed' | 'rejected' | 'review';
export type EventCard = {
  id: string;
  title: string;
  state: EventState;
  detail: string;
  timestamp: string;
};

export const eventCards: EventCard[] = [
  { id: 'e1', title: 'Receipt R-9034', state: 'processing', detail: 'OCR validation in progress', timestamp: '2 min ago' },
  { id: 'e2', title: 'SmartCode 7-4-1', state: 'verified', detail: 'VCOS verified · Entry valid', timestamp: '5 min ago' },
  { id: 'e3', title: 'Contribution #C-2103', state: 'completed', detail: '₹500 added to Care Club wallet', timestamp: '8 min ago' },
  { id: 'e4', title: 'SmartCode 0-0-0', state: 'rejected', detail: 'Duplicate entry detected', timestamp: '12 min ago' },
  { id: 'e5', title: 'Receipt R-9035', state: 'waiting', detail: 'Queued for processing', timestamp: '15 min ago' },
  { id: 'e6', title: 'Challenge Entry #12848', state: 'review', detail: 'Pending manual review', timestamp: '18 min ago' },
];

// Pipelines
export const purchasePipeline = [
  { id: 'p1', label: 'Purchase', icon: 'ShoppingBag' },
  { id: 'p2', label: 'Invoice', icon: 'FileText' },
  { id: 'p3', label: 'Verification', icon: 'ShieldCheck' },
  { id: 'p4', label: 'SmartPoints', icon: 'Sparkles' },
  { id: 'p5', label: 'SmartCode Eligibility', icon: 'Ticket' },
  { id: 'p6', label: 'Challenge Entry', icon: 'Trophy' },
  { id: 'p7', label: 'Rewards', icon: 'Gift' },
];

export const smartCodePipeline = [
  { id: 's1', label: 'Receipt', icon: 'FileText' },
  { id: 's2', label: 'Validation', icon: 'ShieldCheck' },
  { id: 's3', label: 'SmartPoints', icon: 'Sparkles' },
  { id: 's4', label: 'SmartCode', icon: 'Ticket' },
  { id: 's5', label: 'Challenge Queue', icon: 'ListChecks' },
  { id: 's6', label: 'Weekly Draw', icon: 'Trophy' },
  { id: 's7', label: 'Winner Verification', icon: 'BadgeCheck' },
  { id: 's8', label: 'Distribution', icon: 'Gift' },
];

export const contributionPipeline = [
  { id: 'c1', label: 'Care Club Contribution', icon: 'HandHeart' },
  { id: 'c2', label: 'Verification', icon: 'ShieldCheck' },
  { id: 'c3', label: 'Contribution Wallet', icon: 'Wallet' },
  { id: 'c4', label: 'Eligibility', icon: 'Award' },
  { id: 'c5', label: 'Community Benefits', icon: 'Users' },
  { id: 'c6', label: 'Emergency Support', icon: 'LifeBuoy' },
  { id: 'c7', label: 'History', icon: 'History' },
];

// Operations Summary
export const opsSummary = {
  todayPurchases: 142,
  todayContributions: 38,
  todaySmartCodes: 87,
  todayValidEntries: 74,
  pendingReviews: 6,
  completedReviews: 23,
  weeklyChallengeStatus: 'Live · 3 days remaining',
};

// Operations Alerts
export type OpsAlert = {
  id: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  title: string;
  description: string;
  timestamp: string;
};

export const opsAlerts: OpsAlert[] = [
  { id: 'al1', type: 'warning', title: 'High SmartCode Activity', description: '47 entries in last hour · 3x normal rate', timestamp: '5 min ago' },
  { id: 'al2', type: 'urgent', title: 'Duplicate Review Required', description: '2 codes flagged for duplicate detection', timestamp: '12 min ago' },
  { id: 'al3', type: 'success', title: 'Large Contribution Received', description: '₹5,000 contribution from verified member', timestamp: '25 min ago' },
  { id: 'al4', type: 'info', title: 'Reward Distribution Ready', description: 'Weekly rewards prepared for distribution', timestamp: '1 hr ago' },
  { id: 'al5', type: 'warning', title: 'Weekly Challenge Closing Soon', description: '3 days remaining · 12,847 entries', timestamp: '2 hr ago' },
];

// System Health
export type SystemService = {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'offline';
  uptime: string;
};

export const systemHealth: SystemService[] = [
  { id: 'h1', name: 'SmartPoints Engine', status: 'healthy', uptime: '99.98%' },
  { id: 'h2', name: 'SmartCode Engine', status: 'healthy', uptime: '99.95%' },
  { id: 'h3', name: 'Challenge Engine', status: 'healthy', uptime: '100.00%' },
  { id: 'h4', name: 'Care Club', status: 'healthy', uptime: '99.97%' },
  { id: 'h5', name: 'Marketplace', status: 'healthy', uptime: '99.99%' },
  { id: 'h6', name: 'Wallet', status: 'healthy', uptime: '99.96%' },
];
