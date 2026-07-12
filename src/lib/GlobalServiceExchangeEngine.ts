/**
 * VLOOP VCOS Global Service Exchange (GSX) Engine
 * Phase 8 — Jobs, Skills, Languages, Migration Support
 *
 * A comprehensive global employment and skill development platform
 * integrated with VCOS Point Economy and Trust Score.
 */

import { supabase } from './supabase';

export const GSX_ENGINE_VERSION = '8.0.0' as const;

// ============================================================
// JOB TYPES
// ============================================================

export const JOB_REGIONS = {
  KERALA: 'kerala',
  INDIA: 'india',
  GCC: 'gcc',
  EUROPE: 'europe',
  REMOTE: 'remote',
  GLOBAL: 'global',
} as const;

export type JobRegion = typeof JOB_REGIONS[keyof typeof JOB_REGIONS];

export const JOB_REGION_LABELS: Record<JobRegion, string> = {
  kerala: 'Kerala Jobs',
  india: 'India Jobs',
  gcc: 'GCC Jobs',
  europe: 'Europe Jobs',
  remote: 'Remote Work',
  global: 'Global Opportunities',
};

export const JOB_CATEGORIES = {
  HOSPITALITY: 'hospitality',
  HEALTHCARE: 'healthcare',
  IT: 'it',
  AI: 'ai',
  CYBER_SECURITY: 'cyber_security',
  DIGITAL_MARKETING: 'digital_marketing',
  SALES: 'sales',
  CUSTOMER_SUPPORT: 'customer_support',
  DRIVER: 'driver',
  TECHNICIAN: 'technician',
  ELECTRICIAN: 'electrician',
  PLUMBING: 'plumbing',
  CARPENTER: 'carpenter',
  MASON: 'mason',
  HOUSEKEEPING: 'housekeeping',
  SECURITY: 'security',
  SKILLED_WORKER: 'skilled_worker',
  FREELANCE: 'freelance',
  INTERNSHIP: 'internship',
  STUDENT: 'student',
  WOMEN: 'women',
  SENIOR: 'senior',
} as const;

export type JobCategory = typeof JOB_CATEGORIES[keyof typeof JOB_CATEGORIES];

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  hospitality: 'Hospitality',
  healthcare: 'Healthcare',
  it: 'IT & Software',
  ai: 'AI & Machine Learning',
  cyber_security: 'Cyber Security',
  digital_marketing: 'Digital Marketing',
  sales: 'Sales',
  customer_support: 'Customer Support',
  driver: 'Driver Jobs',
  technician: 'Technician',
  electrician: 'Electrician',
  plumbing: 'Plumbing',
  carpenter: 'Carpenter',
  mason: 'Mason',
  housekeeping: 'Housekeeping',
  security: 'Security',
  skilled_worker: 'Skilled Worker',
  freelance: 'Freelance',
  internship: 'Internship',
  student: 'Student Opportunities',
  women: 'Women Employment',
  senior: 'Senior Citizen Jobs',
};

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
  INTERNSHIP: 'internship',
  TEMPORARY: 'temporary',
} as const;

export type EmploymentType = typeof EMPLOYMENT_TYPES[keyof typeof EMPLOYMENT_TYPES];

// ============================================================
// SKILL TYPES
// ============================================================

export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
  VERIFIED: 'verified',
} as const;

export type SkillLevel = typeof SKILL_LEVELS[keyof typeof SKILL_LEVELS];

export const CERTIFICATE_TYPES = {
  COURSE_COMPLETION: 'course_completion',
  SKILL_VERIFICATION: 'skill_verification',
  INTERVIEW_CERTIFIED: 'interview_certified',
  LANGUAGE_PROFICIENCY: 'language_proficiency',
  PROFESSIONAL: 'professional',
} as const;

// ============================================================
// LANGUAGE TYPES
// ============================================================

export const LANGUAGES = {
  ENGLISH: 'english',
  ARABIC: 'arabic',
  GERMAN: 'german',
  FRENCH: 'french',
  HINDI: 'hindi',
  MALAYALAM: 'malayalam',
  TAMIL: 'tamil',
  KANNADA: 'kannada',
} as const;

export type LanguageType = typeof LANGUAGES[keyof typeof LANGUAGES];

export const LANGUAGE_LABELS: Record<LanguageType, string> = {
  english: 'English',
  arabic: 'Arabic',
  german: 'German',
  french: 'French',
  hindi: 'Hindi',
  malayalam: 'Malayalam',
  tamil: 'Tamil',
  kannada: 'Kannada',
};

export const LANGUAGE_COURSE_TYPES = {
  BASIC_SPOKEN: 'basic_spoken',
  INTERVIEW: 'interview',
  BUSINESS: 'business',
  ADVANCED: 'advanced',
} as const;

// ============================================================
// INTERFACES
// ============================================================

export interface Employer {
  id: string;
  company_name: string;
  company_logo_url: string | null;
  company_type: string;
  industry: string;
  country_code: string;
  city: string | null;
  website: string | null;
  contact_email: string;
  contact_phone: string | null;
  description: string | null;
  is_verified: boolean;
  verification_level: string;
  total_jobs_posted: number;
  active_jobs: number;
  trust_score: number;
  created_at: string;
}

export interface JobPosting {
  id: string;
  employer_id: string;
  employer?: Employer;
  job_title: string;
  job_category: JobCategory;
  employment_type: EmploymentType;
  region: JobRegion;
  country_code: string;
  city: string | null;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  salary_period: string;
  visa_sponsorship: boolean;
  visa_type: string | null;
  accommodation_provided: boolean;
  accommodation_type: string | null;
  experience_required_min: number;
  experience_required_max: number;
  education_requirement: string | null;
  languages_required: string[];
  skills_required: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  application_deadline: string | null;
  positions_available: number;
  applications_count: number;
  views_count: number;
  is_active: boolean;
  is_featured: boolean;
  is_urgent: boolean;
  smartpoints_reward: number;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  cover_letter: string | null;
  expected_salary: number | null;
  availability_date: string | null;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'offered' | 'rejected' | 'withdrawn';
  employer_notes: string | null;
  interview_date: string | null;
  interview_type: string | null;
  interview_notes: string | null;
  applied_at: string;
  updated_at: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  full_name: string;
  profile_photo_url: string | null;
  headline: string | null;
  summary: string | null;
  current_position: string | null;
  current_employer: string | null;
  total_experience_years: number;
  education_level: string | null;
  skills: string[];
  verified_skills: string[];
  languages: string[];
  preferred_job_categories: JobCategory[];
  preferred_regions: JobRegion[];
  expected_salary_min: number | null;
  expected_salary_max: number | null;
  expected_currency: string;
  willing_to_relocate: boolean;
  visa_status: string | null;
  passport_number: string | null;
  passport_expiry: string | null;
  availability: string;
  phone: string | null;
  email: string | null;
  linkedin: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  trust_score: number;
  skill_verification_score: number;
  is_verified: boolean;
  verification_level: string;
  badges: string[];
  certificates: WorkerCertificate[];
  created_at: string;
  updated_at: string;
}

export interface WorkerCertificate {
  id: string;
  user_id: string;
  certificate_type: string;
  certificate_name: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string | null;
  certificate_url: string | null;
  verification_id: string | null;
  is_verified: boolean;
  skills_verified: string[];
  smartpoints_awarded: number;
}

export interface SkillBadge {
  id: string;
  user_id: string;
  skill_name: string;
  skill_category: string;
  skill_level: SkillLevel;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  assessment_score: number | null;
  trust_rating: number;
  courses_completed: string[];
  projects_completed: number;
  endorsements: number;
  created_at: string;
}

export interface LanguageCourse {
  id: string;
  language: LanguageType;
  course_type: string;
  course_name: string;
  description: string;
  level: string;
  duration_hours: number;
  lessons_count: number;
  videos_count: number;
  quizzes_count: number;
  smartpoints_reward: number;
  certificate_awarded: boolean;
  instructor_name: string | null;
  instructor_photo_url: string | null;
  rating: number;
  enrolled_count: number;
  completion_count: number;
  is_active: boolean;
  is_free: boolean;
  display_order: number;
  created_at: string;
}

export interface UserLanguageProgress {
  id: string;
  user_id: string;
  course_id: string;
  language: LanguageType;
  current_lesson: number;
  completed_lessons: number[];
  quiz_scores: Record<string, number>;
  overall_score: number;
  time_spent_minutes: number;
  is_completed: boolean;
  certificate_issued: boolean;
  certificate_url: string | null;
  smartpoints_earned: number;
  started_at: string;
  completed_at: string | null;
  last_accessed_at: string;
}

export interface InterviewPractice {
  id: string;
  user_id: string;
  job_category: JobCategory | null;
  interview_type: string;
  questions: InterviewQuestion[];
  answers: Record<string, string>;
  ai_feedback: Record<string, string>;
  overall_score: number;
  smartpoints_earned: number;
  completed_at: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  sample_answer: string | null;
  tips: string[];
}

export interface MigrationGuide {
  id: string;
  country_code: string;
  country_name: string;
  visa_types: MigrationVisaType[];
  passport_guidance: string;
  medical_requirements: string[];
  document_checklist: string[];
  embassy_links: Record<string, string>;
  travel_tips: string[];
  estimated_costs: Record<string, number>;
  processing_time_days: number;
  success_rate: number;
  last_updated: string;
}

export interface MigrationVisaType {
  visa_type: string;
  visa_name: string;
  description: string;
  requirements: string[];
  documents: string[];
  fees: number;
  currency: string;
  processing_days: number;
  validity_months: number;
}

export interface ResumeTemplate {
  id: string;
  template_name: string;
  template_type: string;
  preview_url: string | null;
  template_data: Record<string, unknown>;
  is_premium: boolean;
  usage_count: number;
  created_at: string;
}

// ============================================================
// DATABASE FUNCTIONS
// ============================================================

export async function getJobPostings(filters?: {
  region?: JobRegion;
  category?: JobCategory;
  country?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ jobs: JobPosting[]; total: number }> {
  let query = supabase
    .from('gsx_job_postings')
    .select('*, gsx_employers(*)', { count: 'exact' })
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.region) {
    query = query.eq('region', filters.region);
  }
  if (filters?.category) {
    query = query.eq('job_category', filters.category);
  }
  if (filters?.country) {
    query = query.eq('country_code', filters.country);
  }
  if (filters?.search) {
    query = query.or(`job_title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const offset = (page - 1) * limit;

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    jobs: (data || []) as JobPosting[],
    total: count || 0,
  };
}

export async function getJobById(jobId: string): Promise<JobPosting | null> {
  const { data, error } = await supabase
    .from('gsx_job_postings')
    .select('*, gsx_employers(*)')
    .eq('id', jobId)
    .maybeSingle();
  if (error) throw error;
  return data as JobPosting | null;
}

export async function applyForJob(
  jobId: string,
  userId: string,
  coverLetter?: string,
  expectedSalary?: number
): Promise<JobApplication> {
  const { data, error } = await supabase
    .from('gsx_job_applications')
    .insert({
      job_id: jobId,
      user_id: userId,
      cover_letter: coverLetter || null,
      expected_salary: expectedSalary || null,
      status: 'pending',
    })
    .select()
    .single();
  if (error) throw error;
  return data as JobApplication;
}

export async function getUserApplications(userId: string): Promise<JobApplication[]> {
  const { data, error } = await supabase
    .from('gsx_job_applications')
    .select('*, gsx_job_postings(*, gsx_employers(*))')
    .eq('user_id', userId)
    .order('applied_at', { ascending: false });
  if (error) throw error;
  return (data || []) as JobApplication[];
}

export async function getWorkerProfile(userId: string): Promise<WorkerProfile | null> {
  const { data, error } = await supabase
    .from('gsx_worker_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as WorkerProfile | null;
}

export async function updateWorkerProfile(
  userId: string,
  updates: Partial<WorkerProfile>
): Promise<void> {
  const { error } = await supabase
    .from('gsx_worker_profiles')
    .upsert({
      user_id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function getSkillBadges(userId: string): Promise<SkillBadge[]> {
  const { data, error } = await supabase
    .from('gsx_skill_badges')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as SkillBadge[];
}

export async function getCertificates(userId: string): Promise<WorkerCertificate[]> {
  const { data, error } = await supabase
    .from('gsx_worker_certificates')
    .select('*')
    .eq('user_id', userId)
    .order('issue_date', { ascending: false });
  if (error) throw error;
  return (data || []) as WorkerCertificate[];
}

export async function getLanguageCourses(language?: LanguageType): Promise<LanguageCourse[]> {
  let query = supabase
    .from('gsx_language_courses')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (language) {
    query = query.eq('language', language);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as LanguageCourse[];
}

export async function getUserLanguageProgress(userId: string): Promise<UserLanguageProgress[]> {
  const { data, error } = await supabase
    .from('gsx_user_language_progress')
    .select('*, gsx_language_courses(*)')
    .eq('user_id', userId)
    .order('last_accessed_at', { ascending: false });
  if (error) throw error;
  return (data || []) as UserLanguageProgress[];
}

export async function getMigrationGuides(): Promise<MigrationGuide[]> {
  const { data, error } = await supabase
    .from('gsx_migration_guides')
    .select('*')
    .order('country_name');
  if (error) throw error;
  return (data || []) as MigrationGuide[];
}

export async function getResumeTemplates(): Promise<ResumeTemplate[]> {
  const { data, error } = await supabase
    .from('gsx_resume_templates')
    .select('*')
    .order('usage_count', { ascending: false });
  if (error) throw error;
  return (data || []) as ResumeTemplate[];
}

export async function createInterviewPractice(
  userId: string,
  jobCategory?: JobCategory,
  interviewType: string = 'general'
): Promise<InterviewPractice> {
  const { data, error } = await supabase
    .from('gsx_interview_practices')
    .insert({
      user_id: userId,
      job_category: jobCategory || null,
      interview_type: interviewType,
      questions: [],
      answers: {},
      ai_feedback: {},
      overall_score: 0,
      smartpoints_earned: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data as InterviewPractice;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getJobCategoryColor(category: JobCategory): string {
  const colors: Record<string, string> = {
    hospitality: 'from-blue-500 to-indigo-600',
    healthcare: 'from-emerald-500 to-teal-600',
    it: 'from-violet-500 to-purple-600',
    ai: 'from-pink-500 to-rose-600',
    cyber_security: 'from-cyan-500 to-blue-600',
    digital_marketing: 'from-amber-500 to-orange-600',
    sales: 'from-green-500 to-emerald-600',
    customer_support: 'from-blue-400 to-cyan-500',
    driver: 'from-slate-500 to-gray-600',
    technician: 'from-orange-500 to-red-500',
    electrician: 'from-yellow-500 to-amber-600',
    plumbing: 'from-blue-600 to-indigo-700',
    carpenter: 'from-amber-600 to-orange-700',
    mason: 'from-gray-500 to-slate-600',
    housekeeping: 'from-pink-400 to-rose-500',
    security: 'from-slate-600 to-gray-700',
    skilled_worker: 'from-blue-500 to-blue-600',
    freelance: 'from-purple-500 to-pink-600',
    internship: 'from-green-400 to-emerald-500',
    student: 'from-cyan-400 to-blue-500',
    women: 'from-rose-400 to-pink-500',
    senior: 'from-amber-400 to-yellow-500',
  };
  return colors[category] || 'from-slate-500 to-gray-600';
}

export function getRegionColor(region: JobRegion): string {
  const colors: Record<string, string> = {
    kerala: 'from-emerald-500 to-green-600',
    india: 'from-orange-500 to-amber-600',
    gcc: 'from-blue-500 to-indigo-600',
    europe: 'from-blue-600 to-cyan-600',
    remote: 'from-purple-500 to-violet-600',
    global: 'from-slate-600 to-gray-700',
  };
  return colors[region] || 'from-slate-500 to-gray-600';
}

export function getSkillLevelColor(level: SkillLevel): string {
  const colors: Record<string, string> = {
    beginner: 'text-slate-400',
    intermediate: 'text-blue-500',
    advanced: 'text-emerald-500',
    expert: 'text-amber-500',
    verified: 'text-violet-500',
  };
  return colors[level] || 'text-gray-400';
}

export function getApplicationStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    reviewed: 'bg-blue-100 text-blue-700',
    shortlisted: 'bg-emerald-100 text-emerald-700',
    interview: 'bg-violet-100 text-violet-700',
    offered: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}

export function formatSalary(min: number, max: number, currency: string, period: string): string {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'د.إ',
    SAR: 'ر.س',
    QAR: 'ر.ق',
  };
  const symbol = symbols[currency] || currency;
  const periodLabel = period === 'month' ? '/mo' : period === 'year' ? '/yr' : '';
  return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}${periodLabel}`;
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockJobs(): JobPosting[] {
  return [
    {
      id: 'job1',
      employer_id: 'emp1',
      employer: {
        id: 'emp1',
        company_name: 'Tech Solutions Dubai',
        company_logo_url: null,
        company_type: 'tech',
        industry: 'Information Technology',
        country_code: 'AE',
        city: 'Dubai',
        website: 'https://techsolutions.ae',
        contact_email: 'hr@techsolutions.ae',
        contact_phone: '+971-4-1234567',
        description: 'Leading IT solutions provider in GCC',
        is_verified: true,
        verification_level: 'premium',
        total_jobs_posted: 45,
        active_jobs: 12,
        trust_score: 85,
        created_at: new Date().toISOString(),
      },
      job_title: 'Senior Software Engineer',
      job_category: 'it',
      employment_type: 'full_time',
      region: 'gcc',
      country_code: 'AE',
      city: 'Dubai',
      salary_min: 25000,
      salary_max: 35000,
      salary_currency: 'AED',
      salary_period: 'month',
      visa_sponsorship: true,
      visa_type: 'Employment Visa',
      accommodation_provided: true,
      accommodation_type: 'Company Accommodation',
      experience_required_min: 5,
      experience_required_max: 10,
      education_requirement: "Bachelor's in Computer Science",
      languages_required: ['english'],
      skills_required: ['React', 'Node.js', 'TypeScript', 'AWS'],
      description: 'We are looking for an experienced software engineer...',
      requirements: ['5+ years experience', 'Strong problem-solving skills'],
      benefits: ['Health Insurance', 'Annual Flight Ticket', 'Gratuity'],
      application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      positions_available: 3,
      applications_count: 45,
      views_count: 1250,
      is_active: true,
      is_featured: true,
      is_urgent: false,
      smartpoints_reward: 25,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'job2',
      employer_id: 'emp2',
      employer: {
        id: 'emp2',
        company_name: 'Kochi Hospitality Group',
        company_logo_url: null,
        company_type: 'hospitality',
        industry: 'Hotels & Resorts',
        country_code: 'IN',
        city: 'Kochi',
        website: null,
        contact_email: 'jobs@kochihg.com',
        contact_phone: '+91-484-1234567',
        description: 'Premium hospitality chain in Kerala',
        is_verified: true,
        verification_level: 'standard',
        total_jobs_posted: 28,
        active_jobs: 8,
        trust_score: 72,
        created_at: new Date().toISOString(),
      },
      job_title: 'Hotel Manager',
      job_category: 'hospitality',
      employment_type: 'full_time',
      region: 'kerala',
      country_code: 'IN',
      city: 'Kochi',
      salary_min: 50000,
      salary_max: 75000,
      salary_currency: 'INR',
      salary_period: 'month',
      visa_sponsorship: false,
      visa_type: null,
      accommodation_provided: false,
      accommodation_type: null,
      experience_required_min: 8,
      experience_required_max: 15,
      education_requirement: "MBA in Hospitality",
      languages_required: ['english', 'malayalam'],
      skills_required: ['Team Leadership', 'Guest Relations', 'PMS Systems'],
      description: 'Experienced hotel manager for 5-star property...',
      requirements: ['8+ years in hospitality', 'Excellent communication'],
      benefits: ['PF', 'Health Insurance', 'Performance Bonus'],
      application_deadline: null,
      positions_available: 1,
      applications_count: 23,
      views_count: 450,
      is_active: true,
      is_featured: false,
      is_urgent: true,
      smartpoints_reward: 20,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'job3',
      employer_id: 'emp3',
      employer: {
        id: 'emp3',
        company_name: 'Global Health Services GmbH',
        company_logo_url: null,
        company_type: 'healthcare',
        industry: 'Healthcare',
        country_code: 'DE',
        city: 'Berlin',
        website: 'https://globalhealth.de',
        contact_email: 'careers@globalhealth.de',
        contact_phone: null,
        description: 'Healthcare provider across Europe',
        is_verified: true,
        verification_level: 'premium',
        total_jobs_posted: 65,
        active_jobs: 18,
        trust_score: 92,
        created_at: new Date().toISOString(),
      },
      job_title: 'Registered Nurse',
      job_category: 'healthcare',
      employment_type: 'full_time',
      region: 'europe',
      country_code: 'DE',
      city: 'Berlin',
      salary_min: 3500,
      salary_max: 4500,
      salary_currency: 'EUR',
      salary_period: 'month',
      visa_sponsorship: true,
      visa_type: 'Blue Card EU',
      accommodation_provided: true,
      accommodation_type: 'Assisted Housing',
      experience_required_min: 2,
      experience_required_max: 5,
      education_requirement: 'BSc Nursing',
      languages_required: ['english', 'german'],
      skills_required: ['Patient Care', 'ICU Experience', 'German B1'],
      description: 'Nurses for premium healthcare facility...',
      requirements: ['Valid nursing license', 'German B1 certification'],
      benefits: ['Blue Card sponsorship', 'Relocation support', 'Language training'],
      application_deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      positions_available: 10,
      applications_count: 156,
      views_count: 3200,
      is_active: true,
      is_featured: true,
      is_urgent: false,
      smartpoints_reward: 30,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

export function getMockLanguageCourses(): LanguageCourse[] {
  return [
    { id: 'lc1', language: 'english', course_type: 'basic_spoken', course_name: 'Basic Spoken English', description: 'Learn everyday English conversation', level: 'beginner', duration_hours: 20, lessons_count: 40, videos_count: 20, quizzes_count: 15, smartpoints_reward: 50, certificate_awarded: true, instructor_name: 'Prof. Sarah Johnson', instructor_photo_url: null, rating: 4.8, enrolled_count: 12500, completion_count: 8500, is_active: true, is_free: true, display_order: 1, created_at: new Date().toISOString() },
    { id: 'lc2', language: 'english', course_type: 'interview', course_name: 'Interview English Mastery', description: 'Ace your job interviews in English', level: 'intermediate', duration_hours: 15, lessons_count: 30, videos_count: 15, quizzes_count: 10, smartpoints_reward: 40, certificate_awarded: true, instructor_name: 'James Miller', instructor_photo_url: null, rating: 4.9, enrolled_count: 8200, completion_count: 5600, is_active: true, is_free: true, display_order: 2, created_at: new Date().toISOString() },
    { id: 'lc3', language: 'english', course_type: 'business', course_name: 'Business English Professional', description: 'Professional English for the workplace', level: 'advanced', duration_hours: 25, lessons_count: 50, videos_count: 25, quizzes_count: 20, smartpoints_reward: 60, certificate_awarded: true, instructor_name: 'Dr. Emily Carter', instructor_photo_url: null, rating: 4.7, enrolled_count: 4500, completion_count: 2800, is_active: true, is_free: true, display_order: 3, created_at: new Date().toISOString() },
    { id: 'lc4', language: 'arabic', course_type: 'basic_spoken', course_name: 'Arabic for Beginners', description: 'Learn Arabic for GCC opportunities', level: 'beginner', duration_hours: 30, lessons_count: 60, videos_count: 30, quizzes_count: 20, smartpoints_reward: 55, certificate_awarded: true, instructor_name: 'Ahmed Hassan', instructor_photo_url: null, rating: 4.6, enrolled_count: 6800, completion_count: 4200, is_active: true, is_free: true, display_order: 4, created_at: new Date().toISOString() },
    { id: 'lc5', language: 'german', course_type: 'basic_spoken', course_name: 'German A1 - Foundations', description: 'Start your German language journey', level: 'beginner', duration_hours: 40, lessons_count: 80, videos_count: 40, quizzes_count: 30, smartpoints_reward: 70, certificate_awarded: true, instructor_name: 'Klaus Weber', instructor_photo_url: null, rating: 4.8, enrolled_count: 5200, completion_count: 3100, is_active: true, is_free: true, display_order: 5, created_at: new Date().toISOString() },
  ];
}

export function getMockSkillBadges(): SkillBadge[] {
  return [
    { id: 'sb1', user_id: 'user-1', skill_name: 'React Development', skill_category: 'it', skill_level: 'verified', verified: true, verified_by: 'VLOOP Academy', verified_at: new Date().toISOString(), assessment_score: 92, trust_rating: 4.8, courses_completed: ['React Basics', 'Advanced React'], projects_completed: 5, endorsements: 12, created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'sb2', user_id: 'user-1', skill_name: 'Customer Service', skill_category: 'customer_support', skill_level: 'expert', verified: true, verified_by: 'VLOOP Academy', verified_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), assessment_score: 88, trust_rating: 4.5, courses_completed: ['Customer Excellence'], projects_completed: 3, endorsements: 8, created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() },
  ];
}

export function getMockMigrationGuides(): MigrationGuide[] {
  return [
    {
      id: 'mg1',
      country_code: 'DE',
      country_name: 'Germany',
      visa_types: [
        { visa_type: 'blue_card', visa_name: 'EU Blue Card', description: 'For highly skilled workers', requirements: ['University degree', 'Job offer with minimum salary'], documents: ['Passport', 'Degree certificate', 'Job contract'], fees: 140, currency: 'EUR', processing_days: 90, validity_months: 48 },
        { visa_type: 'job_seeker', visa_name: 'Job Seeker Visa', description: '6 months to find employment', requirements: ['University degree', 'Proof of funds'], documents: ['Passport', 'Degree', 'Bank statements'], fees: 75, currency: 'EUR', processing_days: 45, validity_months: 6 },
      ],
      passport_guidance: 'Valid passport with at least 12 months validity',
      medical_requirements: ['Health insurance', 'TB test'],
      document_checklist: ['Passport', 'Photos', 'Application form', 'CV', 'Cover letter', 'Certificates'],
      embassy_links: { official: 'https://india.diplo.de', vfs: 'https://www.vfsglobal.com/one-pager/germany/india/' },
      travel_tips: ['Book flights early', 'Get travel insurance', 'Learn basic German'],
      estimated_costs: { visa: 140, flight: 45000, initial_stay: 150000 },
      processing_time_days: 90,
      success_rate: 78,
      last_updated: new Date().toISOString(),
    },
    {
      id: 'mg2',
      country_code: 'AE',
      country_name: 'UAE',
      visa_types: [
        { visa_type: 'employment', visa_name: 'Employment Visa', description: 'For employees sponsored by company', requirements: ['Job offer', 'Medical fitness'], documents: ['Passport', 'Offer letter', 'Medical certificate'], fees: 3000, currency: 'AED', processing_days: 20, validity_months: 36 },
      ],
      passport_guidance: 'Valid passport with at least 6 months validity',
      medical_requirements: ['Medical fitness test', 'Blood test'],
      document_checklist: ['Passport', 'Photos', 'Offer letter', 'Attested certificates'],
      embassy_links: { official: 'https://www.mofa.gov.ae' },
      travel_tips: ['Emirates ID required within 30 days', 'Open bank account quickly'],
      estimated_costs: { visa: 3000, flight: 25000, initial_stay: 50000 },
      processing_time_days: 20,
      success_rate: 85,
      last_updated: new Date().toISOString(),
    },
  ];
}
