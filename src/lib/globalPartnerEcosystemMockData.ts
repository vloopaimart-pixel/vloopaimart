// ============================================
// VLOOP Global Partner Ecosystem Mock Data
// Phase 28 - VCOS™ Production
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
// MODULE 1: Partner Onboarding
// ============================================
export const PARTNER_ONBOARDING = {
  steps: [
    { id: 1, name: 'Business Details', status: 'completed', description: 'Business name, type, registration' },
    { id: 2, name: 'Owner Verification', status: 'completed', description: 'KYC, identity verification' },
    { id: 3, name: 'Business License', status: 'completed', description: 'Trade license, permits' },
    { id: 4, name: 'Tax Details', status: 'in_progress', description: 'GST/Tax registration' },
    { id: 5, name: 'Bank Verification', status: 'pending', description: 'Bank account linking' },
    { id: 6, name: 'Location Setup', status: 'pending', description: 'Store location, hours' },
    { id: 7, name: 'Agreement', status: 'pending', description: 'Terms & partnership agreement' },
    { id: 8, name: 'Approval', status: 'pending', description: 'VLOOP team review' },
  ],
  businessTypes: [
    'Retail Store', 'Restaurant', 'Electronics', 'Fashion', 'Grocery',
    'Home & Garden', 'Health & Beauty', 'Automotive', 'Services', 'Community Business'
  ],
  requirements: [
    { doc: 'PAN Card', required: true, uploaded: true },
    { doc: 'Aadhaar Card', required: true, uploaded: true },
    { doc: 'Business Registration', required: true, uploaded: true },
    { doc: 'GST Certificate', required: true, uploaded: false },
    { doc: 'Bank Statement', required: true, uploaded: false },
    { doc: 'Store Photos', required: true, uploaded: false },
  ],
};

// ============================================
// MODULE 2: Business Dashboard
// ============================================
export const BUSINESS_DASHBOARD = {
  stats: {
    totalSales: 4525000,
    totalOrders: 12847,
    totalCustomers: 5823,
    rewardsSponsored: 285000,
    pendingSettlement: 45000,
    totalProducts: 1250,
  },
  recentOrders: [
    { id: 'ORD-78451', customer: 'Rahul Kumar', amount: 2580, status: 'delivered', date: '2026-07-08' },
    { id: 'ORD-78450', customer: 'Priya Sharma', amount: 1250, status: 'shipped', date: '2026-07-08' },
    { id: 'ORD-78449', customer: 'Amit Singh', amount: 3890, status: 'processing', date: '2026-07-07' },
    { id: 'ORD-78448', customer: 'Neha Gupta', amount: 890, status: 'pending', date: '2026-07-07' },
  ],
  invoices: [
    { id: 'INV-JUL-001', period: 'July Week 1', amount: 125000, status: 'paid' },
    { id: 'INV-JUN-004', period: 'June Week 4', amount: 98500, status: 'paid' },
    { id: 'INV-JUN-003', period: 'June Week 3', amount: 112000, status: 'processing' },
  ],
  topProducts: [
    { name: 'Wireless Earbuds Pro', sales: 245, revenue: 245000 },
    { name: 'Smart Watch Series 5', sales: 189, revenue: 378000 },
    { name: 'Phone Case Premium', sales: 412, revenue: 82400 },
  ],
};

// ============================================
// MODULE 3: Product Management
// ============================================
export const PRODUCT_MANAGEMENT = {
  categories: [
    { id: 'cat1', name: 'Electronics', products: 85, active: 78 },
    { id: 'cat2', name: 'Fashion', products: 120, active: 112 },
    { id: 'cat3', name: 'Home & Kitchen', products: 65, active: 60 },
    { id: 'cat4', name: 'Beauty', products: 45, active: 42 },
  ],
  products: [
    { id: 'p1', name: 'Wireless Earbuds Pro', sku: 'WEP-001', price: 2999, stock: 150, category: 'Electronics', status: 'active', variants: 3 },
    { id: 'p2', name: 'Smart Watch Series 5', sku: 'SWS-005', price: 14999, stock: 45, category: 'Electronics', status: 'active', variants: 2 },
    { id: 'p3', name: 'Phone Case Premium', sku: 'PCP-012', price: 599, stock: 320, category: 'Electronics', status: 'active', variants: 5 },
    { id: 'p4', name: 'Laptop Stand Adjustable', sku: 'LSA-003', price: 1299, stock: 0, category: 'Electronics', status: 'out_of_stock', variants: 1 },
  ],
  inventoryAlerts: [
    { product: 'Laptop Stand Adjustable', issue: 'Out of Stock', severity: 'high' },
    { product: 'Smart Watch Series 5', issue: 'Low Stock (45 units)', severity: 'medium' },
    { product: 'USB Cable Type-C', issue: 'Expiring Soon', severity: 'low' },
  ],
};

// ============================================
// MODULE 4: Local Discovery Engine
// ============================================
export const LOCAL_DISCOVERY = {
  nearbyStores: [
    { id: 'store1', name: 'TechZone Electronics', type: 'Electronics', distance: '0.5 km', rating: 4.8, verified: true, openNow: true, address: 'MG Road, Bangalore' },
    { id: 'store2', name: 'Fashion Hub', type: 'Fashion', distance: '1.2 km', rating: 4.5, verified: true, openNow: true, address: 'Brigade Road, Bangalore' },
    { id: 'store3', name: 'Home Essentials', type: 'Home & Kitchen', distance: '2.0 km', rating: 4.2, verified: true, openNow: false, address: 'Indiranagar, Bangalore' },
  ],
  nearbyServices: [
    { id: 'svc1', name: 'QuickFix Electrician', category: 'Electrician', distance: '0.8 km', rating: 4.9, verified: true, status: 'available' },
    { id: 'svc2', name: 'PlumbPro Services', category: 'Plumber', distance: '1.5 km', rating: 4.7, verified: true, status: 'busy' },
    { id: 'svc3', name: 'EduMaster Tutors', category: 'Tutor', distance: '2.5 km', rating: 4.6, verified: true, status: 'available' },
  ],
  filters: ['All', 'Open Now', 'Top Rated', 'Community Verified', 'Partner Verified', 'Nearby'],
};

// ============================================
// MODULE 5: SmartPoint Eligibility
// ============================================
export const SMARTPOINT_ELIGIBILITY = {
  eligibleCategories: [
    { category: 'Electronics', rate: '2%', cap: 1000, active: true },
    { category: 'Fashion', rate: '3%', cap: 500, active: true },
    { category: 'Home & Kitchen', rate: '2.5%', cap: 750, active: true },
    { category: 'Beauty', rate: '4%', cap: 400, active: true },
  ],
  campaigns: [
    { id: 'camp1', name: 'Monsoon Festival', bonus: '2x Points', startDate: '2026-07-01', endDate: '2026-07-15', status: 'active' },
    { id: 'camp2', name: 'Back to School', bonus: '1.5x Points', startDate: '2026-08-01', endDate: '2026-08-31', status: 'upcoming' },
    { id: 'camp3', name: 'Diwali Special', bonus: '3x Points', startDate: '2026-10-15', endDate: '2026-11-05', status: 'upcoming' },
  ],
  corporateCampaigns: [
    { company: 'TechCorp Inc', discount: '15%', points: '5x', validUntil: '2026-12-31' },
    { company: 'Global Retail Co', discount: '10%', points: '3x', validUntil: '2026-09-30' },
  ],
};

// ============================================
// MODULE 6: Customer Engagement
// ============================================
export const CUSTOMER_ENGAGEMENT = {
  activeCoupons: [
    { code: 'FLAT20', discount: '20% OFF', usage: 1250, limit: 5000, expiresOn: '2026-07-31' },
    { code: 'NEWUSER', discount: 'Rs 500 OFF', usage: 3450, limit: 10000, expiresOn: '2026-08-15' },
    { code: 'FESTIVE10', discount: '10% OFF', usage: 850, limit: 2000, expiresOn: '2026-07-20' },
  ],
  announcements: [
    { title: 'Monsoon Sale Live!', date: '2026-07-01', views: 12500 },
    { title: 'New Category: Organic Products', date: '2026-07-05', views: 8500 },
  ],
  events: [
    { name: 'Tech Workshop', date: '2026-07-15', registrations: 125, maxAttendees: 200 },
    { name: 'Fashion Showroom', date: '2026-07-20', registrations: 85, maxAttendees: 150 },
  ],
  notifications: {
    scheduled: 12,
    sent: 2850,
    opened: 1820,
    pending: 3,
  },
};

// ============================================
// MODULE 7: Community Business
// ============================================
export const COMMUNITY_BUSINESS = {
  categories: [
    { name: 'Home Food', sellers: 245, products: 850, icon: 'UtensilsCrossed' },
    { name: 'Handmade Products', sellers: 180, products: 620, icon: 'Hand' },
    { name: 'Farm Products', sellers: 95, products: 380, icon: 'Leaf' },
    { name: 'Second-Hand Goods', sellers: 320, products: 1250, icon: 'RefreshCw' },
    { name: 'Local Businesses', sellers: 125, products: 450, icon: 'Building2' },
  ],
  featuredSellers: [
    { id: 'cs1', name: 'Amma\'s Kitchen', category: 'Home Food', rating: 4.9, orders: 1250, verified: true },
    { id: 'cs2', name: 'HandCraft Studio', category: 'Handmade Products', rating: 4.7, orders: 850, verified: true },
    { id: 'cs3', name: 'Green Farm Fresh', category: 'Farm Products', rating: 4.8, orders: 620, verified: true },
  ],
  verificationBadge: 'Community Verified',
};

// ============================================
// MODULE 8: Local Services
// ============================================
export const LOCAL_SERVICES = {
  categories: [
    { name: 'Electrician', providers: 45, avgRating: 4.7, hourlyRate: 'Rs 300-500' },
    { name: 'Plumber', providers: 38, avgRating: 4.5, hourlyRate: 'Rs 350-600' },
    { name: 'Tutor', providers: 125, avgRating: 4.8, hourlyRate: 'Rs 200-500/hr' },
    { name: 'Driver', providers: 65, avgRating: 4.6, hourlyRate: 'Rs 500-800/day' },
    { name: 'Mechanic', providers: 42, avgRating: 4.4, hourlyRate: 'Rs 400-700' },
    { name: 'Healthcare', providers: 85, avgRating: 4.9, hourlyRate: 'Varies' },
    { name: 'Beauty', providers: 78, avgRating: 4.7, hourlyRate: 'Rs 500-1500' },
    { name: 'Freelancer', providers: 250, avgRating: 4.5, hourlyRate: 'Varies' },
  ],
  bookingRequests: [
    { id: 'b1', service: 'Electrician', provider: 'QuickFix', customer: 'Rahul Kumar', date: '2026-07-09', time: '10:00 AM', status: 'confirmed', amount: 500 },
    { id: 'b2', service: 'Tutor', provider: 'EduMaster', customer: 'Priya Sharma', date: '2026-07-09', time: '4:00 PM', status: 'pending', amount: 400 },
    { id: 'b3', service: 'Beauty', provider: 'StyleStudio', customer: 'Neha Gupta', date: '2026-07-10', time: '11:00 AM', status: 'confirmed', amount: 1500 },
  ],
  geoMatching: {
    enabled: true,
    maxDistance: '10 km',
    autoAssign: true,
  },
};

// ============================================
// MODULE 9: Franchise Management
// ============================================
export const FRANCHISE_MANAGEMENT = {
  regions: [
    { id: 'r1', name: 'North Region', manager: 'Rajesh Kumar', franchisees: 45, revenue: 12500000, growth: '+15%' },
    { id: 'r2', name: 'South Region', manager: 'Suresh Nair', franchisees: 52, revenue: 15800000, growth: '+22%' },
    { id: 'r3', name: 'East Region', manager: 'Amit Das', franchisees: 38, revenue: 9500000, growth: '+18%' },
    { id: 'r4', name: 'West Region', manager: 'Mukesh Shah', franchisees: 48, revenue: 11200000, growth: '+12%' },
  ],
  topFranchisees: [
    { name: 'VLOOP Mumbai Central', location: 'Mumbai', revenue: 2500000, customers: 12500 },
    { name: 'VLOOP Bangalore Tech Park', location: 'Bangalore', revenue: 2200000, customers: 10800 },
    { name: 'VLOOP Delhi Connaught', location: 'Delhi', revenue: 1950000, customers: 9500 },
  ],
  expansionRequests: [
    { location: 'Pune - Koregaon Park', status: 'under_review', investment: 5000000 },
    { location: 'Hyderabad - HiTech City', status: 'approved', investment: 4500000 },
    { location: 'Chennai - OMR Road', status: 'pending', investment: 4000000 },
  ],
  trainings: [
    { name: 'Franchise Onboarding', date: '2026-07-15', enrolled: 25, capacity: 30 },
    { name: 'Advanced Operations', date: '2026-07-22', enrolled: 18, capacity: 25 },
  ],
};

// ============================================
// MODULE 10: Enterprise Portal
// ============================================
export const ENTERPRISE_PORTAL = {
  brands: [
    { id: 'eb1', name: 'TechGlobal Corp', type: 'Electronics', branches: 125, revenue: 85000000, tier: 'platinum' },
    { id: 'eb2', name: 'Fashion Forward Ltd', type: 'Fashion', branches: 85, revenue: 42000000, tier: 'gold' },
    { id: 'eb3', name: 'HomeStyle India', type: 'Home & Kitchen', branches: 65, revenue: 28000000, tier: 'silver' },
  ],
  multibranchManagement: {
    totalBranches: 275,
    activeBranches: 268,
    pendingApproval: 7,
  },
  corporateReports: [
    { report: 'Q2 2026 Sales', generatedOn: '2026-07-05', downloadable: true },
    { report: 'Customer Insights Q2', generatedOn: '2026-07-03', downloadable: true },
    { report: 'Branch Performance', generatedOn: '2026-07-01', downloadable: true },
  ],
  bulkCampaigns: {
    active: 3,
    scheduled: 5,
    completed: 12,
  },
  apiIntegration: {
    enabled: true,
    endpoints: 25,
    lastSync: '2026-07-08 14:30',
    status: 'connected',
  },
};

// ============================================
// MODULE 11: AI Business Insights
// ============================================
export const AI_BUSINESS_INSIGHTS = {
  salesTrends: {
    trend: 'upward',
    percentage: '+18%',
    comparedTo: 'last month',
    prediction: 'Expected growth of 22% next month',
  },
  demandForecast: [
    { product: 'Wireless Earbuds', currentDemand: 'High', forecastDemand: 'Very High', recommendation: 'Increase stock by 20%' },
    { product: 'Phone Cases', currentDemand: 'Medium', forecastDemand: 'High', recommendation: 'Stock up before festival season' },
    { product: 'Laptop Accessories', currentDemand: 'Low', forecastDemand: 'Medium', recommendation: 'Maintain current levels' },
  ],
  customerBehavior: {
    peakHours: ['2PM - 4PM', '7PM - 9PM'],
    peakDays: ['Saturday', 'Sunday'],
    avgOrderValue: 1850,
    repeatCustomerRate: '45%',
  },
  popularProducts: [
    { rank: 1, name: 'Wireless Earbuds Pro', trend: 'up', weeklyOrders: 245 },
    { rank: 2, name: 'Smart Watch Series 5', trend: 'up', weeklyOrders: 189 },
    { rank: 3, name: 'Phone Case Premium', trend: 'stable', weeklyOrders: 412 },
  ],
  recommendations: [
    { type: 'campaign', suggestion: 'Launch "Back to School" campaign for electronics category' },
    { type: 'inventory', suggestion: 'Restock Smart Watch - 45 units remaining' },
    { type: 'pricing', suggestion: 'Bundle Phone Cases with Earbuds for 15% discount' },
    { type: 'expansion', suggestion: 'Add "Home Decor" category based on search trends' },
  ],
};

// ============================================
// MODULE 12: Admin Control
// ============================================
export const ADMIN_CONTROL = {
  pendingApprovals: [
    { id: 'pa1', business: 'TechGadgets Store', type: 'Retail Store', appliedOn: '2026-07-05', status: 'documents_pending' },
    { id: 'pa2', business: 'Fresh Farm Foods', type: 'Community Business', appliedOn: '2026-07-06', status: 'verification_in_progress' },
    { id: 'pa3', business: 'StyleStudio Beauty', type: 'Local Service', appliedOn: '2026-07-07', status: 'pending_approval' },
  ],
  verificationQueue: [
    { business: 'QuickFix Services', type: 'Verification Update', waiting: '2 days' },
    { business: 'Green Earth Organics', type: 'Location Verification', waiting: '1 day' },
  ],
  suspensionActions: [
    { business: 'FakeElectronics Hub', reason: 'Fraudulent activities', status: 'suspended', date: '2026-07-06' },
    { business: 'ExpiredLicense Store', reason: 'License expired', status: 'warning_sent', date: '2026-07-05' },
  ],
  fraudAlerts: [
    { type: 'suspicious_activity', business: 'TechDeals', severity: 'high', action: 'Under Investigation' },
    { type: 'fake_reviews', business: 'BudgetStore', severity: 'medium', action: 'Review Removed' },
    { type: 'price_manipulation', business: 'SaleCity', severity: 'low', action: 'Warning Issued' },
  ],
  analytics: {
    totalPartners: 12500,
    activePartners: 11850,
    pendingApplications: 350,
    suspendedPartners: 45,
  },
};

// ============================================
// MODULE 13: Global Expansion
// ============================================
export const GLOBAL_EXPANSION = {
  countries: [
    { name: 'India', states: 28, partners: 12500, status: 'active', currency: 'INR', language: ['English', 'Hindi'] },
    { name: 'UAE', states: 7, partners: 450, status: 'active', currency: 'AED', language: ['English', 'Arabic'] },
    { name: 'Singapore', states: 1, partners: 125, status: 'active', currency: 'SGD', language: ['English'] },
    { name: 'USA', states: 50, partners: 0, status: 'planned', currency: 'USD', language: ['English'] },
    { name: 'UK', states: 4, partners: 0, status: 'planned', currency: 'GBP', language: ['English'] },
  ],
  regions: {
    asia: { countries: 3, partners: 13075, revenue: 450000000 },
    europe: { countries: 0, partners: 0, revenue: 0 },
    americas: { countries: 0, partners: 0, revenue: 0 },
    middleEast: { countries: 1, partners: 450, revenue: 25000000 },
  },
  multiCurrency: {
    supported: ['INR', 'AED', 'SGD', 'USD', 'EUR', 'GBP'],
    autoConversion: true,
    taxCompliance: 'country_specific',
  },
  countryRules: {
    india: { gst: true, fssai: true, dataLocalization: true, language: 'Regional' },
    uae: { vat: true, licensedPayments: true, language: 'English/Arabic' },
    singapore: { gst: true, language: 'English' },
  },
};

// ============================================
// MODULE 14: Legal Compliance
// ============================================
export const LEGAL_COMPLIANCE = {
  rules: [
    { id: 'lc1', rule: 'All businesses must be verified', category: 'business', status: 'enforced', auditCount: 12500 },
    { id: 'lc2', rule: 'Consumer protection policy required', category: 'consumer', status: 'enforced', auditCount: 11850 },
    { id: 'lc3', rule: 'Privacy compliance (GDPR/DPDP)', category: 'privacy', status: 'enforced', auditCount: 12500 },
    { id: 'lc4', rule: 'Tax compliance per jurisdiction', category: 'tax', status: 'enforced', auditCount: 12500 },
    { id: 'lc5', rule: 'Payments via licensed partners only', category: 'payments', status: 'enforced', auditCount: 12500 },
    { id: 'lc6', rule: 'Insurance via licensed partners only', category: 'insurance', status: 'enforced', auditCount: 8500 },
    { id: 'lc7', rule: 'Complete audit logs maintained', category: 'audit', status: 'enforced', auditCount: 12500 },
    { id: 'lc8', rule: 'Data retention as per law', category: 'data', status: 'enforced', auditCount: 12500 },
  ],
  auditStatus: {
    lastAudit: '2026-07-01',
    nextAudit: '2026-10-01',
    complianceScore: '98%',
    issuesFound: 3,
    issuesResolved: 3,
  },
};

// ============================================
// Partner Statistics
// ============================================
export const PARTNER_NETWORK_STATS = {
  totalPartners: 12500,
  enterprisePartners: 150,
  registeredStores: 8500,
  communityBusinesses: 2450,
  localServices: 1400,
  franchisees: 500,
  activeToday: 9250,
  pendingApproval: 350,
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
    paid: '#22c55e',
    verified: '#22c55e',
    approved: '#22c55e',
    pending: '#eab308',
    in_progress: '#eab308',
    processing: '#eab308',
    under_review: '#eab308',
    upcoming: '#8b5cf6',
    planned: '#8b5cf6',
    suspended: '#ef4444',
    out_of_stock: '#ef4444',
    warning_sent: '#f97316',
    connected: '#22c55e',
    disconnected: '#ef4444',
  };
  return colors[status] || '#94a3b8';
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    platinum: '#E5E4E2',
    gold: '#D4AF37',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  };
  return colors[tier] || '#94a3b8';
}
