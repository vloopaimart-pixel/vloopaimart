// ============================================
// VLOOP VCOS™ AI Super Platform Mock Data
// Phase 29 - Production Architecture
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
  pink: '#ec4899',
};

// ============================================
// MODULE 1: Shopping AI
// ============================================
export const SHOPPING_AI = {
  recommendations: [
    { id: 'sr1', type: 'product', name: 'Wireless Earbuds Pro', reason: 'Based on your recent searches', price: 2999, rating: 4.8, discount: '15% OFF' },
    { id: 'sr2', type: 'product', name: 'Smart Watch Series 5', reason: 'Popular in your area', price: 14999, rating: 4.9, discount: '10% OFF' },
    { id: 'sr3', type: 'offer', name: 'TechZone Electronics', reason: 'Nearby partner - 0.5km', offer: 'Up to 25% OFF', category: 'Electronics' },
    { id: 'sr4', type: 'product', name: 'Laptop Stand Adjustable', reason: 'Complete your workspace', price: 1299, rating: 4.6, discount: null },
  ],
  nearbyOffers: [
    { store: 'TechZone', distance: '0.5 km', offer: '25% OFF Electronics', expires: '2 days' },
    { store: 'Fashion Hub', distance: '1.2 km', offer: 'Buy 2 Get 1 Free', expires: '5 days' },
    { store: 'HomeStyle', distance: '2.0 km', offer: 'Flat 20% OFF', expires: '3 days' },
  ],
  recentlyViewed: [
    { name: 'Phone Case Premium', viewedAt: '2 hours ago', price: 599 },
    { name: 'Bluetooth Speaker', viewedAt: '5 hours ago', price: 2499 },
    { name: 'USB-C Charging Cable', viewedAt: '1 day ago', price: 299 },
  ],
  wishlistSuggestions: [
    { name: 'Wireless Charging Pad', currentPrice: 899, previousPrice: 1299, discount: '30% OFF' },
    { name: 'Gaming Mouse Pro', currentPrice: 1599, previousPrice: 1999, discount: '20% OFF' },
  ],
};

// ============================================
// MODULE 2: Smart Shopping Guide
// ============================================
export const SMART_SHOPPING_GUIDE = {
  features: [
    { id: 'ssg1', name: 'Find Best Offer', description: 'Compare prices across partners', icon: 'Search' },
    { id: 'ssg2', name: 'Compare Quality', description: 'Product ratings and reviews analysis', icon: 'BarChart3' },
    { id: 'ssg3', name: 'Choose Right Product', description: 'Personalized recommendations', icon: 'Target' },
    { id: 'ssg4', name: 'Estimate Delivery', description: 'Delivery time predictions', icon: 'Truck' },
    { id: 'ssg5', name: 'Find Nearby Store', description: 'Geo-located store finder', icon: 'MapPin' },
  ],
  lastAssist: {
    query: 'Budget wireless earbuds under 2000',
    result: 'Found 5 matching products',
    topPick: 'SoundMax Buds - Rs 1,499',
    savings: 'Saved Rs 500 compared to retail',
  },
};

// ============================================
// MODULE 3: Wallet AI
// ============================================
export const WALLET_AI = {
  insights: {
    availableBenefits: 2500,
    pendingReleases: 1200,
    protectionActive: 4,
    insuranceExpiring: 1,
  },
  upcomingBenefits: [
    { name: 'Campaign Benefit', amount: 750, releaseDate: '2026-07-15', source: 'Festival Rewards' },
    { name: 'Corporate Sponsored', amount: 300, releaseDate: '2026-07-20', source: 'Referral Program' },
  ],
  walletStatus: {
    customerBalance: 12580,
    sponsoredAvailable: 2500,
    totalAvailable: 15080,
    lastTransaction: '2 hours ago',
  },
  protectionStatus: {
    active: 4,
    expiringSoon: 1,
    expired: 0,
  },
  insuranceExpiry: [
    { policy: 'Accident Cover', expiresOn: '2026-08-31', partner: 'Star Health' },
  ],
  rewardHistory: [
    { date: '2026-07-07', type: 'Weekly Reward', amount: 180 },
    { date: '2026-07-01', type: 'Sponsored Benefit', amount: 500 },
    { date: '2026-06-15', type: 'Skill Bonus', amount: 250 },
  ],
};

// ============================================
// MODULE 4: Business AI
// ============================================
export const BUSINESS_AI = {
  partnerInsights: [
    { partner: 'TechGear Store', type: 'Partner Store', growth: '+22%', aiSuggestion: 'Increase smartphone accessories inventory' },
    { partner: 'HomeStyle Crafts', type: 'Community Seller', growth: '+15%', aiSuggestion: 'Consider festive packaging options' },
    { partner: 'QuickFix Services', type: 'Local Service', growth: '+18%', aiSuggestion: 'Expand to nearby localities' },
  ],
  salesGrowth: {
    trend: 'upward',
    percentage: '+18%',
    prediction: 'Expected 22% growth next month',
    topCategory: 'Electronics',
  },
  popularItems: [
    { name: 'Wireless Earbuds Pro', weeklyOrders: 245, trend: 'up' },
    { name: 'Phone Case Premium', weeklyOrders: 412, trend: 'stable' },
    { name: 'Smart Watch Series 5', weeklyOrders: 189, trend: 'up' },
  ],
  inventoryAlerts: [
    { product: 'Laptop Stand Adjustable', issue: 'Out of Stock', severity: 'high', action: 'Restock immediately' },
    { product: 'Smart Watch Series 5', issue: 'Low Stock', severity: 'medium', action: 'Order within 3 days' },
  ],
  campaignSuggestions: [
    { type: 'seasonal', name: 'Monsoon Electronics Sale', expectedROI: '+35%', targetAudience: 'Electronics buyers' },
    { type: 'clearance', name: 'Fashion Clearance', expectedROI: '+25%', targetAudience: 'Fashion enthusiasts' },
  ],
};

// ============================================
// MODULE 5: Care AI
// ============================================
export const CARE_AI = {
  programs: {
    food: { name: 'Food Programs', impact: 8500, description: 'Meals served to community' },
    medical: { name: 'Medical Assistance', impact: 85, description: 'Medical aid recipients' },
    education: { name: 'Education Support', impact: 120, description: 'Students supported' },
    community: { name: 'Community Projects', impact: 12, description: 'Active projects' },
  },
  eligibility: {
    user: 'Eligible for',
    programs: ['Food Support', 'Educational Assistance'],
    requirements: 'Verification required for enrollment',
  },
  impactSummary: {
    totalContributed: 5000,
    livesImpacted: 1250,
    thisMonth: 850,
    participantSince: 'January 2026',
  },
  nearbyPrograms: [
    { name: 'Weekly Food Distribution', location: 'Community Center - 1.2km', date: 'Every Sunday' },
    { name: 'Medical Camp', location: 'Health Center - 2.5km', date: 'July 15, 2026' },
  ],
};

// ============================================
// MODULE 6: Learning AI
// ============================================
export const LEARNING_AI = {
  academyProgress: {
    coursesEnrolled: 3,
    coursesCompleted: 2,
    certificationsEarned: 1,
    currentStreak: 7,
  },
  recommendedCourses: [
    { name: 'Digital Marketing Essentials', reason: 'Based on your business profile', duration: '4 weeks', level: 'Beginner' },
    { name: 'Financial Literacy', reason: 'Personal finance improvement', duration: '2 weeks', level: 'Beginner' },
    { name: 'E-commerce Operations', reason: 'Seller skills enhancement', duration: '6 weeks', level: 'Intermediate' },
  ],
  skillDevelopment: {
    currentSkills: ['Customer Service', 'Product Management'],
    suggestedSkills: ['Digital Marketing', 'Inventory Management', 'Analytics'],
    progress: '65%',
  },
  careerGuidance: [
    { path: 'Seller Growth', requirements: 'Complete E-commerce course', estimatedTime: '3 months' },
    { path: 'Partner Upgrade', requirements: 'Achieve 1000 orders', estimatedTime: '6 months' },
  ],
};

// ============================================
// MODULE 7: Insurance AI
// ============================================
export const INSURANCE_AI = {
  activePolicies: [
    { name: 'Health Guard Basic', coverage: '2,00,000', partner: 'HDFC Life', status: 'active', expiry: '2026-12-31' },
    { name: 'Daily Hospital Cash', coverage: '5,000/day', partner: 'ICICI Lombard', status: 'active', expiry: '2027-03-31' },
    { name: 'Travel Shield', coverage: '5,00,000', partner: 'Bajaj Allianz', status: 'active', expiry: '2027-06-14' },
  ],
  complimentaryCovers: [
    { name: 'Accident Cover', provider: 'VLOOP Partner Benefit', coverage: '1,00,000', source: 'Gold Membership' },
    { name: 'Purchase Protection', provider: 'VLOOP Shield', coverage: 'Order Value', source: 'All Orders' },
  ],
  renewalReminders: [
    { policy: 'Accident Cover', expiresOn: '2026-08-31', daysLeft: 53, partner: 'Star Health' },
  ],
  claimGuidance: {
    currentClaim: 'Claim #CLM-2341',
    status: 'Under Review',
    estimatedResolution: '5-7 business days',
    nextSteps: 'Awaiting document verification',
  },
  disclaimer: 'AI provides guidance only. Policy approval and claims remain with licensed insurance partners.',
};

// ============================================
// MODULE 8: Marketplace AI
// ============================================
export const MARKETPLACE_AI = {
  localSellers: [
    { name: 'TechGear Store', type: 'Partner Store', rating: 4.8, verified: true, distance: '0.5 km' },
    { name: 'Amma\'s Kitchen', type: 'Community Seller', rating: 4.9, verified: true, distance: '1.2 km' },
    { name: 'HandCraft Studio', type: 'Community Seller', rating: 4.7, verified: true, distance: '2.0 km' },
  ],
  trustedSellers: {
    total: 8500,
    verified: 7850,
    topRated: 1250,
    featured: 150,
  },
  trendingProducts: [
    { name: 'Wireless Earbuds Pro', weeklyOrders: 1250, trend: 'hot' },
    { name: 'Smart Watch Series 5', weeklyOrders: 850, trend: 'rising' },
    { name: 'Phone Case Premium', weeklyOrders: 2100, trend: 'stable' },
  ],
  safeTransactions: {
    escrowEnabled: true,
    buyerProtection: true,
    verifiedSellersOnly: false,
  },
};

// ============================================
// MODULE 9: Local Services AI
// ============================================
export const LOCAL_SERVICES_AI = {
  nearbyProviders: [
    { name: 'QuickFix Electrician', category: 'Electrician', distance: '0.8 km', rating: 4.9, available: true },
    { name: 'PlumbPro Services', category: 'Plumber', distance: '1.5 km', rating: 4.7, available: false },
    { name: 'EduMaster Tutors', category: 'Tutor', distance: '2.5 km', rating: 4.6, available: true },
    { name: 'Speedy Drivers', category: 'Driver', distance: '1.0 km', rating: 4.5, available: true },
    { name: 'AutoCare Center', category: 'Mechanic', distance: '3.0 km', rating: 4.4, available: true },
    { name: 'HealthFirst Clinic', category: 'Healthcare', distance: '1.8 km', rating: 4.8, available: true },
  ],
  voiceSearchSupport: {
    enabled: true,
    languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
    offlineCapable: true,
  },
  geoRecommendation: {
    maxDistance: '10 km',
    autoMatch: true,
    preferClosest: false,
    considerRating: true,
  },
  serviceCategories: ['Electrician', 'Plumber', 'Tutor', 'Driver', 'Mechanic', 'Healthcare', 'Beauty', 'Freelancer'],
};

// ============================================
// MODULE 10: Financial Guide AI
// ============================================
export const FINANCIAL_GUIDE_AI = {
  walletExplanation: {
    customerBalance: 'Your personal funds for purchases and withdrawals',
    sponsoredBenefits: 'Rewards from partner programs, subject to program rules',
    protection: 'Active protection plans for devices and purchases',
    insurance: 'Policies provided by licensed insurance partners',
  },
  benefitsSummary: {
    available: 2500,
    pending: 1200,
    locked: 800,
    released: 3200,
  },
  programRules: {
    smartpoints: 'SmartPoints have no cash value until converted per program rules',
    benefits: 'Benefits are subject to program rules and verification',
    holdingPeriod: 'Sponsored benefits have holding periods before release',
  },
  purchaseSummary: {
    thisMonth: 12580,
    lastMonth: 9850,
    topCategory: 'Electronics',
    savedByDeals: 1850,
  },
  disclaimer: 'AI provides guidance only. Never provides investment advice. Never promises returns.',
};

// ============================================
// MODULE 11: Admin AI
// ============================================
export const ADMIN_AI = {
  fraudTrends: [
    { type: 'fake_reviews', count: 15, trend: 'increasing', action: 'Auto-detection enabled' },
    { type: 'price_manipulation', count: 8, trend: 'stable', action: 'Monitoring active' },
    { type: 'suspicious_activity', count: 3, trend: 'decreasing', action: 'Under investigation' },
  ],
  salesTrends: {
    overall: '+18%',
    byCategory: [
      { category: 'Electronics', growth: '+25%' },
      { category: 'Fashion', growth: '+15%' },
      { category: 'Home & Kitchen', growth: '+12%' },
    ],
    prediction: 'Continued growth expected',
  },
  popularRegions: [
    { region: 'South Bangalore', orders: 12500, growth: '+28%' },
    { region: 'North Bangalore', orders: 8500, growth: '+15%' },
    { region: 'Whitefield', orders: 6500, growth: '+22%' },
  ],
  smartCodeAnalytics: {
    weeklyParticipation: 45000,
    averageTokens: 6.2,
    conversionRate: '12.5%',
  },
  operationalSuggestions: [
    { area: 'Inventory', suggestion: 'Stock up electronics for festival season', priority: 'high' },
    { area: 'Logistics', suggestion: 'Add delivery partners in North region', priority: 'medium' },
    { area: 'Marketing', suggestion: 'Target Monsoon campaign to electronics buyers', priority: 'high' },
  ],
};

// ============================================
// MODULE 12: Hyper Local Engine
// ============================================
export const HYPER_LOCAL_ENGINE = {
  recommendations: [
    { type: 'partner', name: 'TechZone Electronics', distance: '0.5 km', offer: '25% OFF' },
    { type: 'service', name: 'QuickFix Electrician', distance: '0.8 km', available: true },
    { type: 'offer', name: 'Flash Sale - Electronics', distance: '0.5 km', endsIn: '2 hours' },
    { type: 'event', name: 'Tech Workshop', distance: '1.2 km', date: 'July 15' },
    { type: 'care', name: 'Food Distribution', distance: '1.5 km', date: 'Every Sunday' },
    { type: 'seller', name: 'Amma\'s Kitchen', distance: '1.2 km', category: 'Home Food' },
  ],
  engineSettings: {
    maxDistance: 10,
    trackingEnabled: true,
    realTimeUpdates: true,
    personalizationLevel: 'high',
  },
};

// ============================================
// MODULE 13: Voice AI
// ============================================
export const VOICE_AI = {
  features: {
    voiceSearch: true,
    voiceCommands: true,
    multilingual: true,
    accessibility: true,
    handsFreeNavigation: true,
  },
  supportedLanguages: [
    { code: 'en', name: 'English', accuracy: '98%' },
    { code: 'hi', name: 'Hindi', accuracy: '95%' },
    { code: 'kn', name: 'Kannada', accuracy: '92%' },
    { code: 'ta', name: 'Tamil', accuracy: '90%' },
  ],
  sampleCommands: [
    { command: 'Find nearby electrician', action: 'Opens local services with electrician category' },
    { command: 'Show my wallet balance', action: 'Reads out wallet summary' },
    { command: 'Track my order', action: 'Provides latest order status' },
    { command: 'What offers are near me', action: 'Lists nearby deals and discounts' },
  ],
};

// ============================================
// MODULE 14: AI Privacy
// ============================================
export const AI_PRIVACY = {
  principles: [
    { id: 'ap1', principle: 'User Consent', description: 'AI only processes data with explicit user consent', status: 'enforced' },
    { id: 'ap2', principle: 'Data Privacy', description: 'Personal data is encrypted and protected', status: 'enforced' },
    { id: 'ap3', principle: 'Minimal Data Collection', description: 'Only collect data necessary for AI functions', status: 'enforced' },
    { id: 'ap4', principle: 'Encrypted Processing', description: 'All AI processing uses encrypted data', status: 'enforced' },
    { id: 'ap5', principle: 'Role-based Access', description: 'AI respects user roles and permissions', status: 'enforced' },
  ],
  dataRetention: '30 days default, user configurable',
  userControls: [
    'Disable AI personalization',
    'Clear AI history',
    'Export AI data',
    'Delete all AI data',
  ],
};

// ============================================
// MODULE 15: AI Legal Rules
// ============================================
export const AI_LEGAL_RULES = {
  mustNever: [
    { id: 'alr1', rule: 'Guarantee Rewards', reason: 'Rewards depend on program participation' },
    { id: 'alr2', rule: 'Guarantee Benefits', reason: 'Benefits are subject to verification' },
    { id: 'alr3', rule: 'Guarantee Insurance', reason: 'Insurance requires licensed partner approval' },
    { id: 'alr4', rule: 'Guarantee Loan', reason: 'VLOOP is not a financial institution' },
    { id: 'alr5', rule: 'Guarantee Income', reason: 'Income depends on individual performance' },
    { id: 'alr6', rule: 'Guarantee Approval', reason: 'Approvals are subject to verification' },
    { id: 'alr7', rule: 'Guarantee Employment', reason: 'VLOOP does not guarantee employment' },
  ],
  mustAlways: [
    { id: 'ala1', action: 'Explain', description: 'Provide clear explanations' },
    { id: 'ala2', action: 'Guide', description: 'Help users navigate the platform' },
    { id: 'ala3', action: 'Recommend', description: 'Suggest relevant options' },
    { id: 'ala4', action: 'Educate', description: 'Inform users about features and rules' },
    { id: 'ala5', action: 'Assist', description: 'Help accomplish user goals' },
  ],
  disclaimerText: 'AI is an assistant. AI never overrides compliance rules, financial decisions, or legal workflows.',
};

// ============================================
// AI Core Summary
// ============================================
export const AI_CORE_SUMMARY = {
  modules: [
    { name: 'Shopping AI', status: 'active', users: 125000 },
    { name: 'Wallet AI', status: 'active', users: 85000 },
    { name: 'Business AI', status: 'active', users: 12500 },
    { name: 'Care AI', status: 'active', users: 45000 },
    { name: 'Learning AI', status: 'active', users: 25000 },
    { name: 'Insurance AI', status: 'active', users: 28000 },
    { name: 'Marketplace AI', status: 'active', users: 95000 },
    { name: 'Services AI', status: 'active', users: 14000 },
    { name: 'Admin AI', status: 'active', users: 250 },
    { name: 'Hyper Local', status: 'active', users: 110000 },
    { name: 'Voice AI', status: 'beta', users: 8500 },
  ],
  totalQueries: 2500000,
  avgResponseTime: '0.8s',
  satisfactionRate: '94%',
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

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: '#22c55e',
    available: '#22c55e',
    completed: '#22c55e',
    enabled: '#22c55e',
    enforced: '#22c55e',
    beta: '#eab308',
    pending: '#eab308',
    hot: '#ef4444',
    rising: '#f97316',
    stable: '#8b5cf6',
    increasing: '#22c55e',
    decreasing: '#ef4444',
    high: '#ef4444',
    medium: '#eab308',
    low: '#22c55e',
  };
  return colors[status] || '#94a3b8';
}
