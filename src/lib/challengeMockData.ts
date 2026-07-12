/**
 * VLOOP Phase 16 — Challenge Center™
 * Core identity engagement module. Mock/demo data only.
 */

export type RewardTier = {
  id: string;
  name: string;
  rank: string;
  icon: string;
  eligibilityStatus: 'eligible' | 'almost' | 'locked';
  eligibilityLabel: string;
  poolStatus: string;
  color: string;
  glow: string;
};

export const rewardTiers: RewardTier[] = [
  {
    id: 'prime',
    name: 'Prime Reward',
    rank: '1st',
    icon: 'Crown',
    eligibilityStatus: 'almost',
    eligibilityLabel: '2 more SmartCodes needed',
    poolStatus: 'Pool growing — 1,240 entries this week',
    color: 'from-gold-400 to-gold-600',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
  },
  {
    id: 'premium',
    name: 'Premium Reward',
    rank: '2nd',
    icon: 'Gem',
    eligibilityStatus: 'eligible',
    eligibilityLabel: 'You are eligible!',
    poolStatus: 'Pool active — 860 entries this week',
    color: 'from-vloop-400 to-vloop-600',
    glow: 'shadow-[0_0_25px_rgba(99,102,241,0.25)]',
  },
  {
    id: 'standard',
    name: 'Standard Reward',
    rank: '3rd',
    icon: 'Medal',
    eligibilityStatus: 'eligible',
    eligibilityLabel: 'You are eligible!',
    poolStatus: 'Pool active — 2,100 entries this week',
    color: 'from-success-400 to-success-600',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]',
  },
];

export type JourneyStat = {
  id: string;
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
};

export const journeyStats: JourneyStat[] = [
  { id: 'points', label: 'Current SmartPoints', value: '1,840', sub: '+120 this week', icon: 'Sparkles', color: 'from-gold-400 to-gold-600' },
  { id: 'entries', label: 'Eligible SmartCode Entries', value: '3', sub: '2 more for Prime', icon: 'Ticket', color: 'from-vloop-400 to-vloop-600' },
  { id: 'tier', label: 'Current Tier', value: 'Gold', sub: 'Next: Platinum', icon: 'Award', color: 'from-amber-400 to-amber-600' },
  { id: 'milestone', label: 'Next Milestone', value: '2,000 SP', sub: '160 SP to go', icon: 'Target', color: 'from-success-400 to-success-600' },
];

export const journeyProgress = 84;

export type ParticipateStep = {
  id: string;
  label: string;
  icon: string;
};

export const participateSteps: ParticipateStep[] = [
  { id: 's1', label: 'Purchase', icon: 'ShoppingBag' },
  { id: 's2', label: 'Earn SmartPoints', icon: 'Sparkles' },
  { id: 's3', label: 'Unlock SmartCode', icon: 'Ticket' },
  { id: 's4', label: 'Join Weekly Challenge', icon: 'Trophy' },
  { id: 's5', label: 'Become Eligible', icon: 'CheckCircle2' },
  { id: 's6', label: 'Win Rewards', icon: 'Gift' },
];

export type VerifiedWinner = {
  id: string;
  name: string;
  week: string;
  tier: string;
  region: string;
};

export const verifiedWinners: VerifiedWinner[] = [
  { id: 'w1', name: 'R**** K***', week: 'Week 27', tier: 'Prime', region: 'Bengaluru' },
  { id: 'w2', name: 'S**** P***', week: 'Week 27', tier: 'Premium', region: 'Mysuru' },
  { id: 'w3', name: 'A**** V***', week: 'Week 26', tier: 'Prime', region: 'Bengaluru' },
  { id: 'w4', name: 'M**** R***', week: 'Week 26', tier: 'Standard', region: 'Mandya' },
];

export type ChallengeHistoryItem = {
  id: string;
  week: string;
  participants: number;
  winners: number;
  status: 'completed' | 'live' | 'upcoming';
};

export const challengeHistory: ChallengeHistoryItem[] = [
  { id: 'h1', week: 'Week 28 (Live)', participants: 3200, winners: 0, status: 'live' },
  { id: 'h2', week: 'Week 27', participants: 2840, winners: 12, status: 'completed' },
  { id: 'h3', week: 'Week 26', participants: 2650, winners: 10, status: 'completed' },
  { id: 'h4', week: 'Week 25', participants: 2410, winners: 8, status: 'completed' },
];

export type TransparencyItem = {
  id: string;
  label: string;
  value: string;
  icon: string;
};

export const transparencyItems: TransparencyItem[] = [
  { id: 't1', label: 'Distribution Status', value: '100% Transparent', icon: 'BarChart3' },
  { id: 't2', label: 'Rules', value: 'View Challenge Rules', icon: 'FileText' },
  { id: 't3', label: 'Privacy Notice', value: 'Your data is protected', icon: 'ShieldCheck' },
];

export type AISuggestion = {
  id: string;
  category: string;
  title: string;
  desc: string;
  icon: string;
};

export const aiSuggestions: AISuggestion[] = [
  { id: 'a1', category: 'Current Eligibility', title: 'Eligible for Premium & Standard', desc: 'You have 3 valid SmartCode entries. Submit 2 more to unlock Prime tier.', icon: 'CheckCircle2' },
  { id: 'a2', category: 'Estimated Progress', title: '84% to next milestone', desc: 'Earn 160 more SmartPoints to reach 2,000 SP and unlock Platinum tier.', icon: 'TrendingUp' },
  { id: 'a3', category: 'Smart Suggestion', title: 'Shop grocery combos this week', desc: 'Basmati + Oil combo earns 22 bonus SP. Limited time offer.', icon: 'Lightbulb' },
  { id: 'a4', category: 'Next Goal', title: 'Submit SmartCode #4', desc: 'Scan your next receipt to earn a SmartCode and increase your winning chances.', icon: 'Target' },
];

export const challengeHero = {
  title: 'Weekly SmartCode Challenge™',
  isLive: true,
  region: 'Karnataka · India',
  week: 'Week 28',
  countdown: { days: 3, hours: 14, minutes: 22, seconds: 45 },
};

// Phase 16.2 — Generated Codes & Pending Queue
export type GeneratedCode = {
  id: string;
  code: string;
  week: string;
  validatedAt: string;
};

export const generatedCodes: GeneratedCode[] = [
  { id: 'gc1', code: '542', week: 'Week 28', validatedAt: '2 hrs ago' },
  { id: 'gc2', code: '817', week: 'Week 28', validatedAt: '5 hrs ago' },
  { id: 'gc3', code: '304', week: 'Week 28', validatedAt: '1 day ago' },
  { id: 'gc4', code: '961', week: 'Week 27', validatedAt: '3 days ago' },
  { id: 'gc5', code: '228', week: 'Week 27', validatedAt: '5 days ago' },
];

export type PendingCode = {
  id: string;
  code: string;
  estimatedValue: string;
  status: 'processing' | 'queued' | 'verifying';
};

export const pendingCodes: PendingCode[] = [
  { id: 'pc1', code: '542', estimatedValue: 'Premium Tier', status: 'verifying' },
  { id: 'pc2', code: '817', estimatedValue: 'Standard Tier', status: 'queued' },
];

export type WeeklyWinner = {
  id: string;
  tier: string;
  smartCode: string;
  vcosVerified: boolean;
};

export const weeklyWinners: WeeklyWinner[] = [
  { id: 'ww1', tier: 'Prime', smartCode: '7 4 1', vcosVerified: true },
  { id: 'ww2', tier: 'Premium', smartCode: '3 8 2', vcosVerified: true },
  { id: 'ww3', tier: 'Standard', smartCode: '6 0 9', vcosVerified: true },
];

// Phase 16.3 — Live Status & Summary Data
export const queueStatus = {
  pending: 2,
  validated: 5,
  processing: 1,
  eligible: 3,
};

export const smartPointsSummary = {
  today: 120,
  weekly: 840,
  totalEligibleCodes: 3,
  currentTier: 'Gold',
};

export const rewardJourney = [
  { id: 'j1', label: 'Purchase', icon: 'ShoppingBag', status: 'completed' as const },
  { id: 'j2', label: 'SmartPoints', icon: 'Sparkles', status: 'completed' as const },
  { id: 'j3', label: 'SmartCode', icon: 'Ticket', status: 'current' as const },
  { id: 'j4', label: 'Challenge', icon: 'Trophy', status: 'upcoming' as const },
  { id: 'j5', label: 'Rewards', icon: 'Gift', status: 'upcoming' as const },
];
