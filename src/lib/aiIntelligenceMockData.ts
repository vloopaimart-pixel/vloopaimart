// Phase 21 — AI Recommendation & Hyper-Local Intelligence (Mock Data)
// AI is an assistant only. No backend, no real calculations.

// ============================================================
// SECTION 2 — Personalized Suggestions
// ============================================================
export const personalizedSuggestions = [
  { id: 's1', icon: 'Ticket', title: 'Complete 2 more SmartCodes', desc: 'You are 2 entries away from your weekly goal.', color: '#D4AF37' },
  { id: 's2', icon: 'ShoppingBag', title: 'Purchase a grocery combo', desc: 'Earn additional SmartPoints with grocery bundles.', color: '#22c55e' },
  { id: 's3', icon: 'Store', title: 'Explore nearby Marketplace sellers', desc: '3 new sellers joined near you this week.', color: '#818cf8' },
  { id: 's4', icon: 'Wrench', title: 'Check local service opportunities', desc: 'Tutor and Cleaning services are in high demand.', color: '#00F2FE' },
];

// ============================================================
// SECTION 3 — Hyper-Local Opportunities
// ============================================================
export const hyperLocalOpportunities = [
  { id: 'o1', icon: 'Store', title: 'Partner Store Offers', desc: '20% off on electronics at VLOOP Super Mart', distance: '1.2 km', color: '#D4AF37' },
  { id: 'o2', icon: 'Utensils', title: 'Community Marketplace Products', desc: 'Fresh homemade pickles by Lakshmi Devi', distance: '0.8 km', color: '#f97316' },
  { id: 'o3', icon: 'Wrench', title: 'Local Services', desc: 'Electrician available now near you', distance: '1.5 km', color: '#00F2FE' },
  { id: 'o4', icon: 'HandHeart', title: 'Care Club Activities', desc: 'Community food drive this weekend', distance: '2.0 km', color: '#ef4444' },
];

// ============================================================
// SECTION 4 — SmartCode Progress Assistant
// ============================================================
export const smartCodeProgress = {
  currentSmartCodes: 5,
  suggestedNextGoal: 7,
  estimatedWeeklyProgress: 71,
  rewardTierGuidance: 'You are on track for Premium Reward tier. Complete 2 more SmartCodes to maximize eligibility.',
};

// ============================================================
// SECTION 5 — SmartPoints Guide
// ============================================================
export const smartPointsGuide = [
  { id: 'g1', label: 'Purchase', icon: 'ShoppingBag' },
  { id: 'g2', label: 'Earn SmartPoints', icon: 'Sparkles' },
  { id: 'g3', label: 'Generate SmartCodes', icon: 'Ticket' },
  { id: 'g4', label: 'Join Weekly Challenge', icon: 'Trophy' },
];

// ============================================================
// SECTION 6 — Care Club Guidance
// ============================================================
export const careClubGuidance = {
  contributionReminder: 'You have not contributed to Care Club this month. Consider a small contribution.',
  communitySupportInfo: 'Care Club supports families with food, medicine, blood, and education assistance.',
  emergencyAssistanceNotice: 'Emergency support is available. Eligibility is always reviewed by VLOOP.',
};

// ============================================================
// SECTION 7 — Business Growth Suggestions
// ============================================================
export const businessGrowthSuggestions = [
  { id: 'b1', icon: 'Scissors', title: 'Handmade products are trending', desc: 'Handmade crafts saw 15% growth this month.', color: '#818cf8', category: 'Community Marketplace' },
  { id: 'b2', icon: 'Utensils', title: 'Local food demand is increasing', desc: 'Homemade food listings up 12% in your area.', color: '#f97316', category: 'Local Services' },
  { id: 'b3', icon: 'Monitor', title: 'Electronics category performing well', desc: 'Electronics sales grew 8% across partner stores.', color: '#00F2FE', category: 'Partner Stores' },
  { id: 'b4', icon: 'Wheat', title: 'Agriculture products rising', desc: 'Fresh produce listings increased 10% this week.', color: '#22c55e', category: 'Community Marketplace' },
];

// ============================================================
// SECTION 8 — Hyper-Local Business Discovery
// ============================================================
export const businessDiscovery = [
  { id: 'd1', icon: 'Utensils', title: 'Home Food', desc: 'Lakshmi\'s Kitchen', location: 'Whitefield, 0.8 km', color: '#f97316' },
  { id: 'd2', icon: 'Scissors', title: 'Handmade', desc: 'Crafts by Priya', location: 'Indiranagar, 1.5 km', color: '#818cf8' },
  { id: 'd3', icon: 'Wheat', title: 'Agriculture', desc: 'Fresh Farm Produce', location: 'Electronic City, 2.3 km', color: '#22c55e' },
  { id: 'd4', icon: 'Store', title: 'Local Shops', desc: 'VLOOP Super Mart', location: 'HSR Layout, 1.2 km', color: '#D4AF37' },
  { id: 'd5', icon: 'Wrench', title: 'Service Providers', desc: 'Rajesh Electrician', location: 'Koramangala, 1.8 km', color: '#00F2FE' },
];

// ============================================================
// SECTION 9 — Weekly Challenge Assistant
// ============================================================
export const weeklyChallengeAssistant = {
  currentTier: 'Standard',
  nextTier: 'Premium',
  remainingSmartPoints: 240,
  currentSmartCodes: 5,
  suggestedActions: [
    'Complete 2 more purchases to earn 120 SmartPoints',
    'Participate in Community Marketplace for bonus points',
    'Try a local service to earn additional SmartPoints',
  ],
};

// ============================================================
// SECTION 10 — AI Insight Timeline
// ============================================================
export const aiInsightTimeline = [
  { id: 't1', period: 'Yesterday', label: 'Purchased Grocery', icon: 'ShoppingBag', detail: 'Order #ORD-4818 · ₹1,450', status: 'completed' },
  { id: 't2', period: 'Today', label: 'Earned SmartPoints', icon: 'Sparkles', detail: '72 SP earned from purchase', status: 'completed' },
  { id: 't3', period: 'Today', label: 'Generated SmartCode', icon: 'Ticket', detail: 'Code: 7-4-1 generated', status: 'completed' },
  { id: 't4', period: 'Current Week', label: 'Eligible for Weekly Challenge', icon: 'Trophy', detail: '5 entries · Standard tier', status: 'current' },
];
