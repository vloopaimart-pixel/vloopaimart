/**
 * VLOOP FUTURE OPPORTUNITIES EXPERIENCE CENTER
 * Enterprise Customer Experience Module
 *
 * This module provides:
 * - Future Projects Catalog
 * - Participation Units Preview
 * - AI Recommendations
 * - Project Progress Tracking
 * - User Dashboard
 */

import { supabase } from './supabase';

export const FUTURE_ENGINE_VERSION = '1.0.0' as const;

// ============================================================
// PROJECT CATEGORY CONSTANTS
// ============================================================

export const PROJECT_CATEGORIES = {
  AFFORDABLE_HOUSING: 'affordable_housing',
  LAND_PROJECTS: 'land_projects',
  VILLA_PROJECTS: 'villa_projects',
  APARTMENT_PROJECTS: 'apartment_projects',
  EV_PROGRAMS: 'ev_programs',
  VEHICLE_PROGRAMS: 'vehicle_programs',
  GOLD_PROGRAMS: 'gold_programs',
  EDUCATION_SUPPORT: 'education_support',
  HEALTHCARE_SUPPORT: 'healthcare_support',
  COMMUNITY_DEVELOPMENT: 'community_development',
  FUTURE: 'future',
} as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[keyof typeof PROJECT_CATEGORIES];

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  affordable_housing: 'Affordable Housing',
  land_projects: 'Land Projects',
  villa_projects: 'Villa Projects',
  apartment_projects: 'Apartment Projects',
  ev_programs: 'EV Programs',
  vehicle_programs: 'Vehicle Programs',
  gold_programs: 'Gold Programs',
  education_support: 'Education Support',
  healthcare_support: 'Healthcare Support',
  community_development: 'Community Development',
  future: 'Future Projects',
};

export const PROJECT_CATEGORY_ICONS: Record<ProjectCategory, string> = {
  affordable_housing: 'home',
  land_projects: 'map',
  villa_projects: 'building-2',
  apartment_projects: 'building',
  ev_programs: 'zap',
  vehicle_programs: 'car',
  gold_programs: 'coins',
  education_support: 'graduation-cap',
  healthcare_support: 'heart-pulse',
  community_development: 'users',
  future: 'rocket',
};

// ============================================================
// PROJECT STATUS CONSTANTS
// ============================================================

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  COMING_SOON: 'coming_soon',
  OPEN: 'open',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  SUSPENDED: 'suspended',
} as const;

export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'Draft',
  coming_soon: 'Coming Soon',
  open: 'Open for Participation',
  active: 'Active',
  completed: 'Completed',
  suspended: 'Suspended',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  draft: 'gray',
  coming_soon: 'amber',
  open: 'emerald',
  active: 'blue',
  completed: 'purple',
  suspended: 'red',
};

// ============================================================
// PARTICIPATION UNIT CONSTANTS
// ============================================================

export const UNIT_TIERS = {
  STANDARD: 'standard',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;

export type UnitTier = typeof UNIT_TIERS[keyof typeof UNIT_TIERS];

export const UNIT_TIER_COLORS: Record<UnitTier, string> = {
  standard: 'from-slate-500 to-slate-700',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-amber-500 to-amber-700',
  platinum: 'from-cyan-400 to-cyan-600',
};

// ============================================================
// INTERFACES
// ============================================================

export interface FutureProject {
  id: string;
  project_code: string;
  project_name: string;
  project_category: ProjectCategory;
  short_description: string;
  full_description?: string;
  vision?: string;
  objectives: string[];
  eligibility: Record<string, unknown>;
  participation_rules: Record<string, unknown>;
  hero_image_url?: string;
  status: ProjectStatus;
  expected_launch?: string;
  estimated_duration_months?: number;
  min_participation_units: number;
  max_participation_units: number;
  unit_value_smartpoints: number;
  total_available_units: number;
  ai_transparency: Record<string, unknown>;
  legal_info: Record<string, unknown>;
  faq: Array<{ question: string; answer: string }>;
  is_featured: boolean;
  created_at: string;
}

export interface ProjectProgress {
  id: string;
  project_id: string;
  progress_date: string;
  overall_progress: number;
  milestone?: string;
  milestone_description?: string;
  participants_count: number;
  participation_units_allocated: number;
  remaining_units: number;
  ai_verification_status: 'pending' | 'verified' | 'flagged';
  transparency_score: number;
}

export interface ParticipationUnit {
  id: string;
  unit_code: string;
  unit_name: string;
  smartpoints_required: number;
  tier: UnitTier;
  description?: string;
  image_url?: string;
  color_theme: string;
  benefits: string[];
  display_order: number;
}

export interface UserProjectPreference {
  id: string;
  user_id: string;
  project_id: string;
  is_interested: boolean;
  notification_enabled: boolean;
  notes?: string;
  created_at: string;
}

export interface UserFutureDashboard {
  id: string;
  user_id: string;
  total_smartpoints_balance: number;
  purchase_smartpoints: number;
  careclub_smartpoints: number;
  available_projects_count: number;
  interested_projects_count: number;
  joined_projects_count: number;
  pending_projects_count: number;
  coming_soon_projects_count: number;
}

export interface AIProjectRecommendation {
  id: string;
  user_id: string;
  project_id: string;
  recommendation_score: number;
  recommendation_reason?: string;
  factors: Record<string, unknown>;
}

export interface ProjectFAQ {
  id: string;
  project_id?: string;
  question: string;
  answer: string;
  category: 'general' | 'eligibility' | 'participation' | 'smartpoints' | 'timeline' | 'legal';
  display_order: number;
}

// ============================================================
// PROJECT FUNCTIONS
// ============================================================

export async function getFutureProjects(
  options?: {
    status?: ProjectStatus[];
    category?: ProjectCategory;
    featuredOnly?: boolean;
  }
): Promise<FutureProject[]> {
  let query = supabase
    .from('future_projects_catalog')
    .select('*');

  if (options?.status && options.status.length > 0) {
    query = query.in('status', options.status);
  } else {
    query = query.in('status', ['coming_soon', 'open', 'active']);
  }

  if (options?.category) {
    query = query.eq('project_category', options.category);
  }

  if (options?.featuredOnly) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query.order('priority', { ascending: true });
  if (error) throw error;
  return (data || []) as FutureProject[];
}

export async function getFutureProjectById(projectId: string): Promise<FutureProject | null> {
  const { data, error } = await supabase
    .from('future_projects_catalog')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();

  if (error) throw error;
  return data as FutureProject | null;
}

export async function getFutureProjectByCode(projectCode: string): Promise<FutureProject | null> {
  const { data, error } = await supabase
    .from('future_projects_catalog')
    .select('*')
    .eq('project_code', projectCode)
    .maybeSingle();

  if (error) throw error;
  return data as FutureProject | null;
}

// ============================================================
// PROJECT PROGRESS FUNCTIONS
// ============================================================

export async function getProjectProgress(projectId: string): Promise<ProjectProgress | null> {
  const { data, error } = await supabase
    .from('future_project_progress')
    .select('*')
    .eq('project_id', projectId)
    .order('progress_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as ProjectProgress | null;
}

// ============================================================
// PARTICIPATION UNITS FUNCTIONS
// ============================================================

export async function getParticipationUnits(): Promise<ParticipationUnit[]> {
  const { data, error } = await supabase
    .from('participation_units_config')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data || []) as ParticipationUnit[];
}

export const getDefaultParticipationUnits = (): Array<{ smartpoints: number; tier: UnitTier; name: string }> => [
  { smartpoints: 100, tier: 'standard', name: '100 SmartPoints Unit' },
  { smartpoints: 250, tier: 'silver', name: '250 SmartPoints Unit' },
  { smartpoints: 500, tier: 'gold', name: '500 SmartPoints Unit' },
  { smartpoints: 1000, tier: 'platinum', name: '1000 SmartPoints Unit' },
];

// ============================================================
// USER PREFERENCE FUNCTIONS
// ============================================================

export async function getUserProjectPreferences(userId: string): Promise<UserProjectPreference[]> {
  const { data, error } = await supabase
    .from('user_project_preferences')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []) as UserProjectPreference[];
}

export async function toggleProjectInterest(
  userId: string,
  projectId: string,
  interested: boolean
): Promise<void> {
  const { error } = await supabase
    .from('user_project_preferences')
    .upsert({
      user_id: userId,
      project_id: projectId,
      is_interested: interested,
      notification_enabled: interested,
    }, {
      onConflict: 'user_id,project_id',
    });

  if (error) throw error;
}

// ============================================================
// USER DASHBOARD FUNCTIONS
// ============================================================

export async function getUserFutureDashboard(userId: string): Promise<UserFutureDashboard | null> {
  const { data, error } = await supabase
    .from('user_future_dashboard')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as UserFutureDashboard | null;
}

export async function getFutureOpportunitiesSummary(userId: string): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc('get_future_opportunities_summary', {
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}

// ============================================================
// AI RECOMMENDATION FUNCTIONS
// ============================================================

export async function getAIRecommendations(userId: string): Promise<AIProjectRecommendation[]> {
  const { data, error } = await supabase
    .from('ai_project_recommendations')
    .select('*, project:future_projects_catalog(*)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('recommendation_score', { ascending: false });

  if (error) throw error;
  return (data || []) as AIProjectRecommendation[];
}

export const getDefaultRecommendationMessage = (): string => {
  return 'Based on your SmartPoints, activity level and VCOS Trust Score, these Future Opportunity Projects may be suitable for you.';
};

// ============================================================
// FAQ FUNCTIONS
// ============================================================

export async function getProjectFAQs(projectId?: string): Promise<ProjectFAQ[]> {
  let query = supabase
    .from('future_project_faq')
    .select('*')
    .eq('is_active', true);

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data, error } = await query.order('display_order', { ascending: true });
  if (error) throw error;
  return (data || []) as ProjectFAQ[];
}

// ============================================================
// LOCALIZATION HELPERS
// ============================================================

export const LOCALIZATION_KEYS = {
  // Page titles
  PAGE_TITLE: 'future_opportunities.title',
  PAGE_SUBTITLE: 'future_opportunities.subtitle',

  // Project card labels
  PROJECT_STATUS: 'project.status',
  PROJECT_LAUNCH: 'project.expected_launch',
  PROJECT_DURATION: 'project.estimated_duration',
  PROJECT_MIN_UNITS: 'project.min_participation_units',
  PROJECT_VIEW_DETAILS: 'project.view_details',

  // SmartPoints section
  SMARTPOINTS_PURCHASE: 'smartpoints.purchase',
  SMARTPOINTS_CARECLUB: 'smartpoints.careclub',
  SMARTPOINTS_TOTAL: 'smartpoints.total',
  SMARTPOINTS_INFO: 'smartpoints.info',

  // Participation units
  PARTICIPATION_UNIT: 'participation.unit',
  PARTICIPATION_TIER: 'participation.tier',
  PARTICIPATION_PREVIEW: 'participation.preview',

  // AI panel
  AI_RECOMMENDATION_TITLE: 'ai.recommendation.title',
  AI_RECOMMENDATION_MESSAGE: 'ai.recommendation.message',

  // Transparency
  TRANSPARENCY_PROGRESS: 'transparency.progress',
  TRANSPARENCY_PARTICIPANTS: 'transparency.participants',
  TRANSPARENCY_UNITS: 'transparency.units',
  TRANSPARENCY_REMAINING: 'transparency.remaining',
  TRANSPARENCY_AI_VERIFICATION: 'transparency.ai_verification',
  TRANSPARENCY_SCORE: 'transparency.score',

  // Dashboard
  DASHBOARD_AVAILABLE: 'dashboard.available_projects',
  DASHBOARD_JOINED: 'dashboard.joined_projects',
  DASHBOARD_PENDING: 'dashboard.pending_projects',
  DASHBOARD_COMING_SOON: 'dashboard.coming_soon',

  // Buttons
  BUTTON_JOIN_PROJECT: 'button.join_project',
  BUTTON_EXPRESS_INTEREST: 'button.express_interest',
  BUTTON_VIEW_PROGRESS: 'button.view_progress',

  // FAQ
  FAQ_TITLE: 'faq.title',
  FAQ_QUESTION: 'faq.question',
  FAQ_ANSWER: 'faq.answer',

  // Legal
  LEGAL_TERMS: 'legal.terms',
  LEGAL_PRIVACY: 'legal.privacy',
  LEGAL_DISCLAIMER: 'legal.disclaimer',
} as const;

// Default English labels (for development)
export const DEFAULT_LABELS: Record<string, string> = {
  'future_opportunities.title': 'VLOOP Future Opportunities',
  'future_opportunities.subtitle': 'Turn your SmartPoints into Future Opportunities.',
  'project.status': 'Status',
  'project.expected_launch': 'Expected Launch',
  'project.estimated_duration': 'Estimated Duration',
  'project.min_participation_units': 'Minimum Participation Unit',
  'project.view_details': 'View Details',
  'smartpoints.purchase': 'Purchase SmartPoints',
  'smartpoints.careclub': 'Care Club SmartPoints',
  'smartpoints.total': 'Total SmartPoints',
  'smartpoints.info': 'SmartPoints earned through Purchases and Care Club Contributions may be allocated to eligible Future Opportunity Projects according to VCOS Rules.',
  'participation.unit': 'Participation Unit',
  'participation.tier': 'Tier',
  'participation.preview': 'Participation Units Preview',
  'ai.recommendation.title': 'AI Recommendations',
  'ai.recommendation.message': 'Based on your SmartPoints, activity level and VCOS Trust Score, these Future Opportunity Projects may be suitable for you.',
  'transparency.progress': 'Project Progress',
  'transparency.participants': 'Participants',
  'transparency.units': 'Participation Units',
  'transparency.remaining': 'Remaining Units',
  'transparency.ai_verification': 'AI Verification',
  'transparency.score': 'Transparency Score',
  'dashboard.available_projects': 'Available Projects',
  'dashboard.joined_projects': 'Joined Projects',
  'dashboard.pending_projects': 'Pending Projects',
  'dashboard.coming_soon': 'Coming Soon Projects',
  'button.join_project': 'Join Project',
  'button.express_interest': 'Express Interest',
  'button.view_progress': 'View Progress',
  'faq.title': 'Frequently Asked Questions',
  'faq.question': 'Question',
  'faq.answer': 'Answer',
  'legal.terms': 'Terms & Conditions',
  'legal.privacy': 'Privacy Policy',
  'legal.disclaimer': 'Disclaimer',
};

// Helper function for localization (placeholder)
export function t(key: string, params?: Record<string, string | number>): string {
  let text = DEFAULT_LABELS[key] || key;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
    });
  }

  return text;
}

// ============================================================
// UI HELPER FUNCTIONS
// ============================================================

export function getStatusBadgeColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    draft: 'bg-gray-500',
    coming_soon: 'bg-amber-500',
    open: 'bg-emerald-500',
    active: 'bg-blue-500',
    completed: 'bg-purple-500',
    suspended: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function getTierGradient(tier: UnitTier): string {
  const gradients: Record<UnitTier, string> = {
    standard: 'bg-gradient-to-br from-slate-500 to-slate-700',
    silver: 'bg-gradient-to-br from-gray-400 to-gray-600',
    gold: 'bg-gradient-to-br from-amber-500 to-amber-700',
    platinum: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
  };
  return gradients[tier] || 'bg-gradient-to-br from-gray-500 to-gray-700';
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'TBA';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDuration(months: number | undefined): string {
  if (!months) return 'TBA';
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
}
