export type Tier = 'standard' | 'premium' | 'prime';

export type RewardRow = {
  points: number;
  standard: number;
  premium: number;
  prime: number;
};

export const rewardTable: RewardRow[] = [
  { points: 1, standard: 100, premium: 200, prime: 400 },
  { points: 2, standard: 200, premium: 400, prime: 800 },
  { points: 3, standard: 300, premium: 600, prime: 1200 },
  { points: 5, standard: 500, premium: 1000, prime: 2000 },
  { points: 10, standard: 1000, premium: 2000, prime: 4000 },
  { points: 25, standard: 2500, premium: 5000, prime: 10000 },
  { points: 52, standard: 5000, premium: 10000, prime: 20000 },
  { points: 130, standard: 12500, premium: 25000, prime: 50000 },
  { points: 260, standard: 25000, premium: 50000, prime: 100000 },
];

export const categories = [
  { name: 'Groceries', icon: 'ShoppingCart', subcategories: ['Grocery'] },
  { name: 'Drinking Water', icon: 'Droplets', subcategories: ['Water'] },
  { name: 'Household Products', icon: 'Home', subcategories: ['Household', 'Home Essentials'] },
  { name: 'Personal Care', icon: 'Sparkles', subcategories: ['Personal Care', 'Beauty'] },
  { name: 'Health Products', icon: 'HeartPulse', subcategories: ['Health'] },
  { name: 'Electronics', icon: 'Smartphone', subcategories: ['Electronics'] },
  { name: 'Fashion', icon: 'Shirt', subcategories: ['Fashion'] },
  { name: 'Partner Stores', icon: 'Store', subcategories: [] },
  { name: 'Insurance Services', icon: 'ShieldCheck', subcategories: [] },
];

export const wallet1Features = [
  { title: 'Shopping Benefits', desc: 'Use points for product discounts', icon: 'ShoppingBag' },
  { title: 'Mobile Recharge', desc: 'Recharge any prepaid number', icon: 'Smartphone' },
  { title: 'Electricity Bill', desc: 'Pay electricity bills instantly', icon: 'Zap' },
  { title: 'Water Bill', desc: 'Settle water utility bills', icon: 'Droplets' },
  { title: 'Internet Bill', desc: 'Pay broadband & WiFi bills', icon: 'Wifi' },
  { title: 'Future Services', desc: 'More services coming soon', icon: 'Rocket' },
];

export const wallet2Features = [
  { title: 'Accident Support', desc: 'Financial aid for accidents', icon: 'ShieldPlus' },
  { title: 'Disability Support', desc: 'Support for disability needs', icon: 'HeartHandshake' },
  { title: 'Widow Support', desc: 'Assistance for widowed members', icon: 'Users' },
  { title: 'Education Support', desc: 'Funding for children education', icon: 'GraduationCap' },
  { title: 'Cancer Support', desc: 'Treatment support for cancer', icon: 'Ribbon' },
  { title: 'Heart Disease Support', desc: 'Cardiac care financial aid', icon: 'HeartPulse' },
  { title: 'Natural Disaster Support', desc: 'Relief during calamities', icon: 'CloudRain' },
  { title: 'NRI Repatriation Support', desc: 'Support for NRI repatriation', icon: 'Plane' },
];

export const insuranceTypes = [
  { title: 'Health Insurance', desc: 'Comprehensive health coverage for you & family', icon: 'HeartPulse' },
  { title: 'Mediclaim Services', desc: 'Cashless hospitalization coverage', icon: 'FileText' },
  { title: 'Life Insurance', desc: 'Secure your family future', icon: 'ShieldCheck' },
  { title: 'Accident Insurance', desc: 'Personal accident cover', icon: 'ShieldAlert' },
  { title: 'Insurance Consultation', desc: 'Expert guidance on the right insurance plan', icon: 'PhoneCall' },
];

export const futureProjects = [
  { title: 'Affordable Housing', desc: 'Quality homes at accessible prices for VLOOP members', icon: 'Home', color: 'from-vloop-500 to-vloop-700' },
  { title: 'Land Projects', desc: 'Investment-ready land plots in developing areas', icon: 'MapPin', color: 'from-success-500 to-success-700' },
  { title: 'Vehicle Projects', desc: 'Affordable vehicle ownership programs', icon: 'Car', color: 'from-gold-400 to-gold-600' },
  { title: 'EV Projects', desc: 'Electric vehicle initiatives for a greener future', icon: 'Zap', color: 'from-vloop-400 to-vloop-600' },
];

export const catalogCategories = [
  { name: 'Groceries', desc: 'Daily essentials, rice, pulses, oil & more', icon: 'ShoppingCart', color: 'from-vloop-500 to-vloop-700', count: '50+ products' },
  { name: 'Drinking Water', desc: 'Premium water bottles & dispensers', icon: 'Droplets', color: 'from-vloop-400 to-vloop-600', count: '15+ products' },
  { name: 'Household Products', desc: 'Home essentials, cookware & cleaning', icon: 'Home', color: 'from-gold-400 to-gold-600', count: '40+ products' },
  { name: 'Personal Care', desc: 'Skincare, haircare & hygiene products', icon: 'Sparkles', color: 'from-success-500 to-success-700', count: '30+ products' },
  { name: 'Health Products', desc: 'Health monitors, vitamins & wellness', icon: 'HeartPulse', color: 'from-vloop-600 to-vloop-800', count: '30+ products' },
  { name: 'Electronics', desc: 'Gadgets, accessories & appliances', icon: 'Smartphone', color: 'from-vloop-500 to-vloop-700', count: '40+ products' },
  { name: 'Fashion', desc: 'Clothing, footwear & accessories', icon: 'Shirt', color: 'from-gold-500 to-gold-700', count: '50+ products' },
  { name: 'Partner Stores', desc: 'Trusted brands & partner collections', icon: 'Store', color: 'from-gold-400 to-gold-600', count: '100+ products' },
  { name: 'Insurance Services', desc: 'Health, life, motor & accident cover', icon: 'ShieldCheck', color: 'from-vloop-600 to-vloop-800', count: '5 insurance types' },
];

export const memberBenefits = [
  { title: 'Shopping Benefits', desc: 'Earn points on every purchase and redeem for discounts', icon: 'ShoppingBag', color: 'from-vloop-500 to-vloop-700' },
  { title: 'Wallet Benefits', desc: 'Dual wallet system for personal and community support', icon: 'Wallet', color: 'from-gold-400 to-gold-600' },
  { title: 'Bonus Charity Support', desc: 'Financial aid during difficult times through Care Club', icon: 'HeartHandshake', color: 'from-success-500 to-success-700' },
  { title: 'Community Benefits', desc: 'Support network for education, health & disaster relief', icon: 'Users', color: 'from-vloop-400 to-vloop-600' },
  { title: 'Future Opportunities', desc: 'Access to housing, land, vehicle & EV projects', icon: 'Rocket', color: 'from-gold-500 to-gold-700' },
];
