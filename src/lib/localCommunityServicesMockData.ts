// Phase 19 — Local Community Services & Gig Economy (Mock Data)
// UI/UX only. No backend, no real calculations.

export type ServiceCategory = {
  id: string;
  label: string;
  icon: string;
  color: string;
  providerCount: number;
};

export const serviceCategories: ServiceCategory[] = [
  { id: 'electrician', label: 'Electrician', icon: 'Zap', color: '#fbbf24', providerCount: 24 },
  { id: 'plumber', label: 'Plumber', icon: 'Wrench', color: '#00F2FE', providerCount: 18 },
  { id: 'driver', label: 'Driver', icon: 'Car', color: '#D4AF37', providerCount: 31 },
  { id: 'carpenter', label: 'Carpenter', icon: 'Hammer', color: '#f97316', providerCount: 15 },
  { id: 'cleaning', label: 'Cleaning', icon: 'Sparkles', color: '#22c55e', providerCount: 42 },
  { id: 'home-nurse', label: 'Home Nurse', icon: 'HeartPulse', color: '#ef4444', providerCount: 12 },
  { id: 'tutor', label: 'Tutor', icon: 'GraduationCap', color: '#818cf8', providerCount: 28 },
  { id: 'computer', label: 'Computer Service', icon: 'Monitor', color: '#00F2FE', providerCount: 19 },
  { id: 'delivery', label: 'Delivery', icon: 'Package', color: '#D4AF37', providerCount: 37 },
  { id: 'agriculture', label: 'Agriculture', icon: 'Wheat', color: '#22c55e', providerCount: 8 },
  { id: 'home-food', label: 'Home Food', icon: 'Utensils', color: '#f97316', providerCount: 25 },
  { id: 'handmade', label: 'Handmade', icon: 'Scissors', color: '#818cf8', providerCount: 14 },
];

export type ServiceProvider = {
  id: string;
  name: string;
  photo: string;
  category: string;
  rating: number;
  trustScore: number;
  distance: string;
  arrivalTime: string;
  availableNow: boolean;
  smartPointsEligible: boolean;
  completedJobs: number;
  communityRating: number;
  verifiedIdentity: boolean;
};

export const serviceProviders: ServiceProvider[] = [
  { id: 'p1', name: 'Rajesh Kumar', photo: '', category: 'Electrician', rating: 4.8, trustScore: 94, distance: '1.2 km', arrivalTime: '~15 min', availableNow: true, smartPointsEligible: true, completedJobs: 127, communityRating: 4.9, verifiedIdentity: true },
  { id: 'p2', name: 'Lakshmi Devi', photo: '', category: 'Home Food', rating: 4.9, trustScore: 97, distance: '0.8 km', arrivalTime: '~25 min', availableNow: true, smartPointsEligible: true, completedJobs: 203, communityRating: 5.0, verifiedIdentity: true },
  { id: 'p3', name: 'Suresh Patel', photo: '', category: 'Driver', rating: 4.7, trustScore: 91, distance: '2.5 km', arrivalTime: '~10 min', availableNow: true, smartPointsEligible: true, completedJobs: 89, communityRating: 4.6, verifiedIdentity: true },
  { id: 'p4', name: 'Priya Sharma', photo: '', category: 'Cleaning', rating: 4.8, trustScore: 95, distance: '1.5 km', arrivalTime: '~20 min', availableNow: false, smartPointsEligible: true, completedJobs: 156, communityRating: 4.8, verifiedIdentity: true },
  { id: 'p5', name: 'Mohammed Irfan', photo: '', category: 'Plumber', rating: 4.6, trustScore: 89, distance: '3.1 km', arrivalTime: '~30 min', availableNow: true, smartPointsEligible: true, completedJobs: 72, communityRating: 4.5, verifiedIdentity: true },
  { id: 'p6', name: 'Anitha Rao', photo: '', category: 'Tutor', rating: 5.0, trustScore: 98, distance: '0.5 km', arrivalTime: '~10 min', availableNow: true, smartPointsEligible: true, completedJobs: 214, communityRating: 5.0, verifiedIdentity: true },
];

export const trustProfile = {
  trustScore: 94,
  completedJobs: 127,
  communityRating: 4.8,
  verifiedIdentity: true,
};

export const smartEconomyFlow = [
  { id: 'f1', label: 'Completed Service', icon: 'CheckCircle2' },
  { id: 'f2', label: 'SmartPoints', icon: 'Sparkles' },
  { id: 'f3', label: 'SmartCode Eligibility', icon: 'Ticket' },
  { id: 'f4', label: 'Weekly SmartCode Challenge', icon: 'Trophy' },
];

export const careClubReminders = [
  { id: 'c1', label: 'Emergency Food', icon: 'Utensils', color: '#f97316' },
  { id: 'c2', label: 'Medicine', icon: 'Pill', color: '#ef4444' },
  { id: 'c3', label: 'Blood Support', icon: 'Droplet', color: '#ef4444' },
  { id: 'c4', label: 'Community Assistance', icon: 'HandHeart', color: '#D4AF37' },
];

export const vcosProtection = [
  { id: 'v1', label: 'Verified Identity', icon: 'BadgeCheck', color: '#22c55e' },
  { id: 'v2', label: 'Secure Requests', icon: 'Lock', color: '#00F2FE' },
  { id: 'v3', label: 'Community Monitoring', icon: 'Eye', color: '#D4AF37' },
  { id: 'v4', label: 'Privacy Protected', icon: 'ShieldCheck', color: '#818cf8' },
];
