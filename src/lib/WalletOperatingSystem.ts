/**
 * VLOOP WALLET, CARE CLUB & ESSENTIAL SERVICES OPERATING SYSTEM
 * Phase 4 — Dual Wallet + Essential Services + Emergency Care
 */

import { supabase } from './supabase';

export const WALLET_OS_VERSION = '4.0.0' as const;

// ============================================================
// WALLET TYPES
// ============================================================

export const WALLET_A_CATEGORIES = {
  SMARTPOINTS: 'smartpoints',
  ACTIVITY_REWARDS: 'activity_rewards',
  LEARNING_REWARDS: 'learning_rewards',
  QUIZ_REWARDS: 'quiz_rewards',
  VOLUNTEER_REWARDS: 'volunteer_rewards',
} as const;

export const TRANSACTION_CATEGORIES = {
  MARKETPLACE_PURCHASE: 'marketplace_purchase',
  ESSENTIAL_SERVICE: 'essential_service',
  EDUCATIONAL: 'educational',
  QUIZ: 'quiz',
  VOLUNTEER: 'volunteer',
  CARE_CLUB: 'care_club',
  COMMUNITY_CAMPAIGN: 'community_campaign',
  REDEEM: 'redeem',
} as const;

export const ESSENTIAL_SERVICE_CATEGORIES = {
  ELECTRICITY: 'electricity',
  WATER: 'water',
  MOBILE: 'mobile',
  BROADBAND: 'broadband',
  GAS: 'gas',
  INSURANCE: 'insurance',
  FASTAG: 'fastag',
  TRANSPORT: 'transport',
  GOVERNMENT: 'government',
  HEALTHCARE: 'healthcare',
} as const;

export const EMERGENCY_TYPES = {
  FOOD_SUPPORT: 'food_support',
  MEDICINE_SUPPORT: 'medicine_support',
  BLOOD_REQUEST: 'blood_request',
  SHELTER_ASSISTANCE: 'shelter_assistance',
  MENTAL_WELLNESS: 'mental_wellness',
  SENIOR_SUPPORT: 'senior_support',
  WOMEN_SUPPORT: 'women_support',
  CHILD_SUPPORT: 'child_support',
  DISASTER_RELIEF: 'disaster_relief',
} as const;

export const CARE_LEVELS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
} as const;

// ============================================================
// INTERFACES
// ============================================================

export interface WalletASmart {
  id: string;
  user_id: string;
  smartpoints_balance: number;
  activity_rewards_balance: number;
  learning_rewards_balance: number;
  quiz_rewards_balance: number;
  volunteer_rewards_balance: number;
  total_earned: number;
  total_redeemed: number;
  is_active: boolean;
  locked_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface WalletATransaction {
  id: string;
  wallet_id: string;
  transaction_type: 'credit' | 'debit' | 'transfer' | 'redeem';
  category: string;
  amount: number;
  balance_after: number;
  source_type: string | null;
  source_id: string | null;
  description: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface WalletBFOE {
  id: string;
  user_id: string;
  foe_units_balance: number;
  total_foe_units_earned: number;
  active_projects: number;
  completed_projects: number;
  total_benefits_earned: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalletBTransaction {
  id: string;
  wallet_id: string;
  transaction_type: 'credit' | 'debit' | 'project_allocation' | 'benefit_release';
  project_code: string | null;
  amount: number;
  balance_after: number;
  description: string | null;
  created_at: string;
}

export interface EssentialService {
  id: string;
  service_code: string;
  service_name: string;
  service_category: string;
  provider_name: string | null;
  provider_logo_url: string | null;
  country_code: string;
  is_global: boolean;
  supported_countries: string[];
  convenience_fee: number;
  smartpoints_reward: number;
  is_active: boolean;
  display_order: number;
}

export interface EssentialServiceTransaction {
  id: string;
  user_id: string;
  service_code: string;
  transaction_reference: string;
  consumer_reference: string | null;
  amount: number;
  convenience_fee: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  smartpoints_earned: number;
  smartpoints_credited: boolean;
  acknowledgement_number: string | null;
  processed_at: string | null;
  created_at: string;
  country_code: string;
}

export interface CareClubContribution {
  id: string;
  user_id: string;
  contribution_type: 'food' | 'medicine' | 'education' | 'clothing' | 'shelter' | 'general';
  amount: number;
  beneficiaries_estimate: number;
  smartpoints_earned: number;
  status: string;
  is_anonymous: boolean;
  notes: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface CareClubProfile {
  id: string;
  user_id: string;
  care_level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  care_score: number;
  total_contributions: number;
  total_amount_contributed: number;
  total_beneficiaries: number;
  badges: string[];
  preferred_causes: string[];
  is_active_contributor: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmergencyCareRequest {
  id: string;
  user_id: string;
  request_type: string;
  urgency_level: 'normal' | 'urgent' | 'critical';
  description: string | null;
  location: string | null;
  contact_number: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assigned_partner: string | null;
  assigned_partner_id: string | null;
  response_notes: string | null;
  resolved_at: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface CarePartner {
  id: string;
  partner_type: string;
  partner_name: string;
  partner_code: string;
  description: string | null;
  logo_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  service_areas: string[];
  operating_hours: string | null;
  is_verified: boolean;
  verification_level: string;
  is_active: boolean;
}

export interface CommunityImpactStats {
  id: string;
  stat_date: string;
  total_contributions_day: number;
  total_amount_contributed_day: number;
  beneficiaries_helped_day: number;
  active_volunteers_day: number;
  volunteer_hours_day: number;
  emergency_requests_day: number;
  emergencies_resolved_day: number;
  quiz_completions_day: number;
  educational_video_views_day: number;
  new_members_day: number;
  smartpoints_earned_day: number;
}

export interface ServiceRegion {
  id: string;
  country_code: string;
  country_name: string;
  currency_code: string;
  currency_symbol: string;
  time_zone: string;
  enabled_services: string[];
  is_active: boolean;
}

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function getWalletSummary(userId: string): Promise<{
  wallet_a: Partial<WalletASmart>;
  wallet_b: Partial<WalletBFOE>;
}> {
  const { data, error } = await supabase.rpc('get_user_wallet_summary', {
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
}

export async function getWalletA(userId: string): Promise<WalletASmart | null> {
  const { data, error } = await supabase
    .from('wallet_a_smart')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as WalletASmart | null;
}

export async function getWalletB(userId: string): Promise<WalletBFOE | null> {
  const { data, error } = await supabase
    .from('wallet_b_foe')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as WalletBFOE | null;
}

export async function getWalletATransactions(userId: string, limit: number = 20): Promise<WalletATransaction[]> {
  const { data, error } = await supabase
    .from('wallet_a_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as WalletATransaction[];
}

export async function creditSmartPoints(
  userId: string,
  amount: number,
  category: string,
  sourceType?: string,
  sourceId?: string,
  description?: string
): Promise<{ success: boolean; new_balance: number }> {
  const { data, error } = await supabase.rpc('credit_smartpoints', {
    p_user_id: userId,
    p_amount: amount,
    p_category: category,
    p_source_type: sourceType || null,
    p_source_id: sourceId || null,
    p_description: description || null,
  });
  if (error) throw error;
  return data;
}

export async function getEssentialServices(): Promise<EssentialService[]> {
  const { data, error } = await supabase
    .from('essential_services')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) throw error;
  return (data || []) as EssentialService[];
}

export async function getServiceTransactions(userId: string): Promise<EssentialServiceTransaction[]> {
  const { data, error } = await supabase
    .from('essential_service_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data || []) as EssentialServiceTransaction[];
}

export async function getCareClubProfile(userId: string): Promise<CareClubProfile | null> {
  const { data, error } = await supabase
    .from('care_club_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as CareClubProfile | null;
}

export async function getCareContributions(userId: string): Promise<CareClubContribution[]> {
  const { data, error } = await supabase
    .from('care_club_contributions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data || []) as CareClubContribution[];
}

export async function submitCareContribution(
  userId: string,
  contributionType: string,
  amount: number,
  isAnonymous: boolean = false,
  notes?: string
): Promise<void> {
  const smartpointsEarned = Math.floor(amount / 10) * 5; // 5 SP per ₹10

  const { error } = await supabase
    .from('care_club_contributions')
    .insert({
      user_id: userId,
      contribution_type: contributionType,
      amount,
      smartpoints_earned: smartpointsEarned,
      is_anonymous: isAnonymous,
      notes,
    });
  if (error) throw error;

  // Credit SmartPoints
  if (smartpointsEarned > 0) {
    await creditSmartPoints(userId, smartpointsEarned, 'care_club', 'contribution');
  }
}

export async function getEmergencyRequests(userId: string): Promise<EmergencyCareRequest[]> {
  const { data, error } = await supabase
    .from('emergency_care_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return (data || []) as EmergencyCareRequest[];
}

export async function submitEmergencyRequest(
  userId: string,
  requestType: string,
  urgencyLevel: 'normal' | 'urgent' | 'critical',
  description?: string,
  location?: string,
  contactNumber?: string
): Promise<void> {
  const { error } = await supabase
    .from('emergency_care_requests')
    .insert({
      user_id: userId,
      request_type: requestType,
      urgency_level: urgencyLevel,
      description,
      location,
      contact_number: contactNumber,
    });
  if (error) throw error;
}

export async function getCarePartners(): Promise<CarePartner[]> {
  const { data, error } = await supabase
    .from('care_partners')
    .select('*')
    .eq('is_active', true)
    .order('partner_name');
  if (error) throw error;
  return (data || []) as CarePartner[];
}

export async function getCommunityImpact(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('get_community_impact');
  if (error) throw error;
  return data;
}

export async function getServiceRegions(): Promise<ServiceRegion[]> {
  const { data, error } = await supabase
    .from('service_regions')
    .select('*')
    .eq('is_active', true)
    .order('country_name');
  if (error) throw error;
  return (data || []) as ServiceRegion[];
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSmartPoints(points: number): string {
  if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M SP`;
  if (points >= 1000) return `${(points / 1000).toFixed(1)}K SP`;
  return `${points} SP`;
}

export function getCareLevelColor(level: string): string {
  switch (level) {
    case 'diamond': return 'from-cyan-400 to-blue-500';
    case 'platinum': return 'from-slate-300 to-slate-500';
    case 'gold': return 'from-amber-400 to-amber-600';
    case 'silver': return 'from-gray-300 to-gray-500';
    default: return 'from-amber-600 to-amber-800';
  }
}

export function getCareLevelBadge(level: string): string {
  switch (level) {
    case 'diamond': return 'bg-cyan-100 text-cyan-700';
    case 'platinum': return 'bg-slate-100 text-slate-700';
    case 'gold': return 'bg-amber-100 text-amber-700';
    case 'silver': return 'bg-gray-100 text-gray-700';
    default: return 'bg-amber-50 text-amber-800';
  }
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'critical': return 'bg-red-100 text-red-600 border-red-300';
    case 'urgent': return 'bg-amber-100 text-amber-600 border-amber-300';
    default: return 'bg-blue-100 text-blue-600 border-blue-300';
  }
}

export function getServiceCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    electricity: 'Zap',
    water: 'Droplets',
    mobile: 'Smartphone',
    broadband: 'Wifi',
    gas: 'Flame',
    insurance: 'ShieldCheck',
    fastag: 'Car',
    transport: 'Train',
    government: 'Building2',
    healthcare: 'Stethoscope',
  };
  return icons[category] || 'CreditCard';
}

export function getEmergencyLabel(type: string): string {
  const labels: Record<string, string> = {
    food_support: 'Food Support',
    medicine_support: 'Medicine Support',
    blood_request: 'Blood Request',
    shelter_assistance: 'Shelter Assistance',
    mental_wellness: 'Mental Wellness',
    senior_support: 'Senior Support',
    women_support: 'Women Support',
    child_support: 'Child Support',
    disaster_relief: 'Disaster Relief',
  };
  return labels[type] || type;
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockWalletA(): WalletASmart {
  return {
    id: 'wallet-a-1',
    user_id: 'user-1',
    smartpoints_balance: 2450,
    activity_rewards_balance: 120,
    learning_rewards_balance: 80,
    quiz_rewards_balance: 45,
    volunteer_rewards_balance: 25,
    total_earned: 3200,
    total_redeemed: 750,
    is_active: true,
    locked_reason: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function getMockWalletB(): WalletBFOE {
  return {
    id: 'wallet-b-1',
    user_id: 'user-1',
    foe_units_balance: 150,
    total_foe_units_earned: 250,
    active_projects: 2,
    completed_projects: 1,
    total_benefits_earned: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function getMockWalletATransactions(): WalletATransaction[] {
  return [
    { id: 'tx1', wallet_id: 'wallet-a-1', transaction_type: 'credit', category: 'care_club', amount: 25, balance_after: 2450, source_type: 'contribution', source_id: 'c1', description: 'Care Club Contribution', is_verified: true, created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 'tx2', wallet_id: 'wallet-a-1', transaction_type: 'credit', category: 'quiz', amount: 20, balance_after: 2425, source_type: 'challenge', source_id: 'ch1', description: 'Quiz Completion', is_verified: true, created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 'tx3', wallet_id: 'wallet-a-1', transaction_type: 'credit', category: 'marketplace_purchase', amount: 10, balance_after: 2405, source_type: 'order', source_id: 'o1', description: 'Order Purchase', is_verified: true, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'tx4', wallet_id: 'wallet-a-1', transaction_type: 'debit', category: 'redeem', amount: 50, balance_after: 2415, source_type: null, source_id: null, description: 'Benefit Redemption', is_verified: true, created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockEssentialServices(): EssentialService[] {
  return [
    { id: 's1', service_code: 'electricity', service_name: 'Electricity Bill Payment', service_category: 'electricity', provider_name: null, provider_logo_url: null, country_code: 'IN', is_global: false, supported_countries: ['IN'], convenience_fee: 0, smartpoints_reward: 5, is_active: true, display_order: 1 },
    { id: 's2', service_code: 'water', service_name: 'Water Bill Payment', service_category: 'water', provider_name: null, provider_logo_url: null, country_code: 'IN', is_global: false, supported_countries: ['IN'], convenience_fee: 0, smartpoints_reward: 5, is_active: true, display_order: 2 },
    { id: 's3', service_code: 'mobile-prepaid', service_name: 'Mobile Prepaid Recharge', service_category: 'mobile', provider_name: null, provider_logo_url: null, country_code: 'IN', is_global: false, supported_countries: ['IN'], convenience_fee: 0, smartpoints_reward: 3, is_active: true, display_order: 3 },
    { id: 's4', service_code: 'broadband', service_name: 'Broadband / Internet Bill', service_category: 'broadband', provider_name: null, provider_logo_url: null, country_code: 'IN', is_global: false, supported_countries: ['IN'], convenience_fee: 0, smartpoints_reward: 5, is_active: true, display_order: 5 },
    { id: 's5', service_code: 'lpg-gas', service_name: 'LPG Gas Cylinder Booking', service_category: 'gas', provider_name: null, provider_logo_url: null, country_code: 'IN', is_global: false, supported_countries: ['IN'], convenience_fee: 0, smartpoints_reward: 5, is_active: true, display_order: 6 },
    { id: 's6', service_code: 'insurance', service_name: 'Insurance Premium Payment', service_category: 'insurance', provider_name: null, provider_logo_url: null, country_code: 'IN', is_global: false, supported_countries: ['IN'], convenience_fee: 0, smartpoints_reward: 10, is_active: true, display_order: 7 },
    { id: 's7', service_code: 'fastag', service_name: 'FASTag Recharge', service_category: 'fastag', provider_name: null, provider_logo_url: null, country_code: 'IN', is_global: false, supported_countries: ['IN'], convenience_fee: 0, smartpoints_reward: 3, is_active: true, display_order: 10 },
    { id: 's8', service_code: 'metro', service_name: 'Metro Card Recharge', service_category: 'transport', provider_name: null, provider_logo_url: null, country_code: 'IN', is_global: false, supported_countries: ['IN'], convenience_fee: 0, smartpoints_reward: 3, is_active: true, display_order: 11 },
  ];
}

export function getMockCareClubProfile(): CareClubProfile {
  return {
    id: 'care-1',
    user_id: 'user-1',
    care_level: 'silver',
    care_score: 7500,
    total_contributions: 12,
    total_amount_contributed: 7500,
    total_beneficiaries: 45,
    badges: ['Food Hero', 'Education Champion', 'Monthly Donor'],
    preferred_causes: ['food', 'education'],
    is_active_contributor: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function getMockCareContributions(): CareClubContribution[] {
  return [
    { id: 'cc1', user_id: 'user-1', contribution_type: 'food', amount: 500, beneficiaries_estimate: 5, smartpoints_earned: 25, status: 'completed', is_anonymous: false, notes: 'Monthly food donation', is_verified: true, created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'cc2', user_id: 'user-1', contribution_type: 'education', amount: 1000, beneficiaries_estimate: 2, smartpoints_earned: 50, status: 'completed', is_anonymous: false, notes: 'Education fund', is_verified: true, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockCommunityImpact(): CommunityImpactStats {
  return {
    id: 'impact-1',
    stat_date: new Date().toISOString().split('T')[0],
    total_contributions_day: 245,
    total_amount_contributed_day: 125000,
    beneficiaries_helped_day: 850,
    active_volunteers_day: 120,
    volunteer_hours_day: 480,
    emergency_requests_day: 12,
    emergencies_resolved_day: 10,
    quiz_completions_day: 1250,
    educational_video_views_day: 3500,
    new_members_day: 85,
    smartpoints_earned_day: 45000,
  };
}

export function getMockEmergencyRequests(): EmergencyCareRequest[] {
  return [
    { id: 'e1', user_id: 'user-1', request_type: 'food_support', urgency_level: 'urgent', description: 'Need food assistance for family', location: 'Mumbai', contact_number: '+91-9876543210', status: 'in_progress', assigned_partner: 'Local Food Bank', assigned_partner_id: null, response_notes: 'Volunteer assigned', resolved_at: null, is_verified: true, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockCarePartners(): CarePartner[] {
  return [
    { id: 'p1', partner_type: 'ngo', partner_name: 'Food Bank India', partner_code: 'FBI001', description: 'National food distribution network', logo_url: null, address: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91-22-12345678', email: 'info@foodbank.org', website: 'https://foodbank.org', service_areas: ['Maharashtra', 'Gujarat'], operating_hours: '24/7', is_verified: true, verification_level: 'premium', is_active: true },
    { id: 'p2', partner_type: 'hospital', partner_name: 'City Medical Center', partner_code: 'CMC001', description: 'Multi-specialty hospital', logo_url: null, address: '456 Health Ave', city: 'Mumbai', state: 'Maharashtra', pincode: '400002', phone: '+91-22-23456789', email: 'emergency@citymedical.org', website: 'https://citymedical.org', service_areas: ['Maharashtra'], operating_hours: '24/7', is_verified: true, verification_level: 'standard', is_active: true },
  ];
}
