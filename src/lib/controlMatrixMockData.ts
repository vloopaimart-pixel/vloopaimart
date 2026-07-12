// Phase 20 — Control Matrix Enterprise Admin Intelligence (Mock Data)
// Admin UI only. No backend, no real calculations.

// ============================================================
// SECTION 1 — Executive Overview
// ============================================================
export const executiveOverview = {
  totalRevenue: '₹4,82,47,500',
  todayOrders: 142,
  activeSmartPoints: 12847,
  activeSmartCodes: 8421,
  weeklyChallengeEntries: 3200,
  primeParticipants: 847,
  premiumParticipants: 1620,
  standardParticipants: 733,
  partnerStores: 248,
  marketplaceListings: 1247,
  localServiceProviders: 273,
  careClubContributors: 892,
  systemHealth: 'All Systems Operational',
};

// ============================================================
// SECTION 2 — Business Layer Filter
// ============================================================
export type BusinessLayer = 'partner-commerce' | 'community-marketplace' | 'local-services' | 'care-club' | 'smartcode-challenge';
export const businessLayers: { id: BusinessLayer; label: string; icon: string }[] = [
  { id: 'partner-commerce', label: 'Partner Commerce', icon: 'ShoppingBag' },
  { id: 'community-marketplace', label: 'Community Marketplace', icon: 'Store' },
  { id: 'local-services', label: 'Local Services', icon: 'Wrench' },
  { id: 'care-club', label: 'Care Club', icon: 'HandHeart' },
  { id: 'smartcode-challenge', label: 'SmartCode Challenge', icon: 'Ticket' },
];

// ============================================================
// SECTION 3 — Geographic Intelligence
// ============================================================
export const geoFilters = {
  countries: ['India', 'United States', 'United Kingdom', 'UAE', 'Singapore'],
  states: ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi', 'Telangana'],
  districts: ['Bengaluru Urban', 'Chennai', 'Mumbai Suburban', 'New Delhi', 'Hyderabad'],
  cities: ['Bengaluru', 'Chennai', 'Mumbai', 'Delhi', 'Hyderabad'],
  villages: ['Whitefield', 'Electronic City', 'Indiranagar', 'Koramangala', 'HSR Layout'],
};

// ============================================================
// SECTION 4 — SmartCode Intelligence (000-999)
// ============================================================
export const smartCodeIntelligence = {
  mostSubmitted: [
    { code: '7 4 1', count: 487, change: '+12%' },
    { code: '5 5 5', count: 412, change: '+8%' },
    { code: '3 1 4', count: 389, change: '+5%' },
    { code: '1 2 3', count: 356, change: '+3%' },
    { code: '9 9 9', count: 334, change: '+1%' },
  ],
  leastSubmitted: [
    { code: '0 0 0', count: 12, change: '-2%' },
    { code: '0 0 1', count: 18, change: '-1%' },
    { code: '0 1 0', count: 22, change: '0%' },
    { code: '1 0 0', count: 28, change: '-1%' },
    { code: '0 0 2', count: 31, change: '0%' },
  ],
  fastestGrowing: [
    { code: '5 5 5', growth: '+42%' },
    { code: '7 7 7', growth: '+35%' },
    { code: '8 8 8', growth: '+28%' },
    { code: '4 2 0', growth: '+22%' },
    { code: '3 1 4', growth: '+18%' },
  ],
  mostActive: [
    { code: '7 4 1', entries: 487, valid: 412 },
    { code: '5 5 5', entries: 412, valid: 389 },
    { code: '3 1 4', entries: 389, valid: 351 },
  ],
  weeklyDistribution: [
    { day: 'Mon', value: 1820 },
    { day: 'Tue', value: 2104 },
    { day: 'Wed', value: 1950 },
    { day: 'Thu', value: 2230 },
    { day: 'Fri', value: 2680 },
    { day: 'Sat', value: 1843 },
    { day: 'Sun', value: 220 },
  ],
  heatRanking: [
    { range: '700-799', intensity: 'extreme', value: 487 },
    { range: '500-599', intensity: 'extreme', value: 412 },
    { range: '300-399', intensity: 'high', value: 389 },
    { range: '100-199', intensity: 'high', value: 356 },
    { range: '900-999', intensity: 'medium', value: 334 },
    { range: '000-099', intensity: 'low', value: 12 },
  ],
};

// ============================================================
// SECTION 5 — Weekly SmartCode Challenge Analytics
// ============================================================
export const challengeAnalytics = [
  {
    tier: 'Prime',
    medal: '🥇',
    color: '#D4AF37',
    poolStatus: 'Active',
    weeklyEntries: 847,
    eligibleParticipants: 620,
    distributionProgress: 75,
    countdown: '3 days 14 hrs',
    previousWeek: '₹2,40,000 distributed · 612 winners',
  },
  {
    tier: 'Premium',
    medal: '🥈',
    color: '#818cf8',
    poolStatus: 'Active',
    weeklyEntries: 1620,
    eligibleParticipants: 1247,
    distributionProgress: 60,
    countdown: '3 days 14 hrs',
    previousWeek: '₹1,80,000 distributed · 1,100 winners',
  },
  {
    tier: 'Standard',
    medal: '🥉',
    color: '#22c55e',
    poolStatus: 'Active',
    weeklyEntries: 733,
    eligibleParticipants: 580,
    distributionProgress: 90,
    countdown: '3 days 14 hrs',
    previousWeek: '₹95,000 distributed · 520 winners',
  },
];

// ============================================================
// SECTION 6 — SmartPoints Intelligence
// ============================================================
export const smartPointsIntelligence = {
  totalGenerated: 12847000,
  todayGenerated: 84200,
  purchaseGenerated: 6420000,
  careClubGenerated: 1840000,
  serviceGenerated: 2120000,
  marketplaceGenerated: 2467000,
};

// ============================================================
// SECTION 7 — Partner Commerce Analytics
// ============================================================
export const partnerCommerceAnalytics = {
  orders: 1247,
  revenue: '₹2,84,50,000',
  topStores: [
    { name: 'VLOOP Super Mart', orders: 342, revenue: '₹8,20,000' },
    { name: 'City Electronics', orders: 218, revenue: '₹6,40,000' },
    { name: 'Fresh Grocers', orders: 189, revenue: '₹3,80,000' },
    { name: 'Fashion Hub', orders: 156, revenue: '₹4,20,000' },
  ],
  bestCategories: [
    { name: 'Electronics', share: '28%' },
    { name: 'Groceries', share: '22%' },
    { name: 'Fashion', share: '18%' },
    { name: 'Home & Kitchen', share: '14%' },
  ],
  regionalPerformance: [
    { region: 'Bengaluru', revenue: '₹82,00,000', orders: 420 },
    { region: 'Chennai', revenue: '₹64,00,000', orders: 318 },
    { region: 'Mumbai', revenue: '₹78,00,000', orders: 289 },
    { region: 'Delhi', revenue: '₹60,50,000', orders: 220 },
  ],
};

// ============================================================
// SECTION 8 — Community Marketplace Analytics
// ============================================================
export const marketplaceAnalytics = {
  homemadeProducts: 342,
  handmadeProducts: 218,
  usedProducts: 156,
  agriculture: 89,
  localSellers: 473,
  activeListings: 1247,
  topCategories: [
    { name: 'Homemade Food', listings: 342, trend: '+15%' },
    { name: 'Handmade Crafts', listings: 218, trend: '+8%' },
    { name: 'Used Items', listings: 156, trend: '+3%' },
    { name: 'Agriculture', listings: 89, trend: '+12%' },
  ],
};

// ============================================================
// SECTION 9 — Local Services Analytics
// ============================================================
export const localServicesAnalytics = [
  { service: 'Electrician', activeRequests: 12, completedJobs: 127, rating: 4.8, growth: '+8%' },
  { service: 'Driver', activeRequests: 8, completedJobs: 89, rating: 4.7, growth: '+5%' },
  { service: 'Tutor', activeRequests: 15, completedJobs: 214, rating: 5.0, growth: '+12%' },
  { service: 'Home Nurse', activeRequests: 5, completedJobs: 72, rating: 4.9, growth: '+3%' },
  { service: 'Carpenter', activeRequests: 7, completedJobs: 95, rating: 4.6, growth: '+6%' },
  { service: 'Cleaning', activeRequests: 18, completedJobs: 156, rating: 4.8, growth: '+10%' },
  { service: 'Mechanic', activeRequests: 6, completedJobs: 68, rating: 4.5, growth: '+2%' },
  { service: 'Computer Service', activeRequests: 9, completedJobs: 112, rating: 4.7, growth: '+7%' },
];

// ============================================================
// SECTION 10 — Care Club Intelligence
// ============================================================
export const careClubIntelligence = {
  contributions: 892,
  emergencyRequests: 47,
  food: 28,
  medicine: 12,
  blood: 5,
  education: 2,
  pendingReviews: 6,
  approvedAssistance: 41,
};

// ============================================================
// SECTION 11 — Sybil Shield (Fraud Monitoring)
// ============================================================
export const sybilShield = {
  status: 'Monitoring Active',
  duplicateDevices: { count: 3, status: 'Flagged' },
  multipleAccounts: { count: 7, status: 'Under Review' },
  repeatedSmartCodes: { count: 12, status: 'Detected' },
  suspiciousActivity: { count: 2, status: 'Investigating' },
  deviceTrust: { score: 94, status: 'High' },
  behaviourMonitoring: { anomalies: 5, status: 'Normal' },
  recentAlerts: [
    { id: 's1', type: 'urgent', title: 'Duplicate Device Detected', desc: '3 accounts on same device', time: '5 min ago' },
    { id: 's2', type: 'warning', title: 'Multiple Accounts Flagged', desc: '7 accounts under review', time: '12 min ago' },
    { id: 's3', type: 'warning', title: 'Repeated SmartCodes', desc: '12 codes show repeat pattern', time: '25 min ago' },
    { id: 's4', type: 'info', title: 'Behaviour Anomaly', desc: '5 minor anomalies logged', time: '1 hr ago' },
  ],
};

// ============================================================
// SECTION 12 — AI Business Intelligence
// ============================================================
export const aiBusinessIntelligence = [
  { id: 'ai1', icon: 'TrendingUp', title: 'Fastest Growing Region', insight: 'Bengaluru shows 42% growth in SmartCode entries this week', trend: '+42%', color: '#D4AF37' },
  { id: 'ai2', icon: 'Users', title: 'Community Growth', insight: '273 new members joined Local Services this month', trend: '+18%', color: '#22c55e' },
  { id: 'ai3', icon: 'Wrench', title: 'Service Demand', insight: 'Cleaning and Tutor services see highest demand', trend: '+10%', color: '#00F2FE' },
  { id: 'ai4', icon: 'Ticket', title: 'SmartCode Trend', insight: 'Code range 700-799 dominates weekly submissions', trend: '+12%', color: '#D4AF37' },
  { id: 'ai5', icon: 'Store', title: 'Marketplace Trend', insight: 'Homemade food listings up 15% month-over-month', trend: '+15%', color: '#818cf8' },
  { id: 'ai6', icon: 'ShoppingBag', title: 'Revenue Trend', insight: 'Partner commerce revenue exceeds last week by 8%', trend: '+8%', color: '#22c55e' },
  { id: 'ai7', icon: 'HandHeart', title: 'Care Club Trend', insight: 'Contributions increased 22% in Care Club this week', trend: '+22%', color: '#ef4444' },
];

// ============================================================
// SECTION 13 — Enterprise System Health
// ============================================================
export const enterpriseSystemHealth = [
  { id: 'sys1', name: 'Frontend', status: 'healthy', uptime: '99.99%' },
  { id: 'sys2', name: 'Commerce', status: 'healthy', uptime: '99.97%' },
  { id: 'sys3', name: 'SmartPoints Engine', status: 'healthy', uptime: '99.98%' },
  { id: 'sys4', name: 'SmartCode Engine', status: 'healthy', uptime: '99.95%' },
  { id: 'sys5', name: 'Weekly Challenge', status: 'healthy', uptime: '100.00%' },
  { id: 'sys6', name: 'Marketplace', status: 'healthy', uptime: '99.99%' },
  { id: 'sys7', name: 'Local Services', status: 'healthy', uptime: '99.96%' },
  { id: 'sys8', name: 'Care Club', status: 'healthy', uptime: '99.97%' },
  { id: 'sys9', name: 'VCOS Core', status: 'healthy', uptime: '99.98%' },
];
