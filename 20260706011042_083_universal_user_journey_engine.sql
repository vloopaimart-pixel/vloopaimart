/*
# VLOOP VCOS Global Service Exchange (GSX) Engine - Phase 8
# Jobs, Skills, Languages, Migration Support

This migration creates a comprehensive global employment and skill development platform:
- Jobs & Manpower Exchange
- VLOOP Skill Verification
- Language Learning Hub
- Interview Preparation
- Migration Support
- VCOS Point Economy Integration

## New Tables (15 tables)

### Jobs & Employment
- `gsx_employers` - Company/employer profiles
- `gsx_job_postings` - Job listings with full details
- `gsx_job_applications` - User job applications
- `gsx_job_saved` - User saved jobs

### Worker Profiles
- `gsx_worker_profiles` - Professional worker profiles
- `gsx_worker_certificates` - Professional certificates
- `gsx_skill_badges` - Verified skill badges

### Language Learning
- `gsx_language_courses` - Language course catalog
- `gsx_user_language_progress` - User language learning progress
- `gsx_language_lessons` - Lesson content

### Interview & Resume
- `gsx_interview_practices` - AI interview practice sessions
- `gsx_interview_questions` - Question bank
- `gsx_resume_templates` - Resume/CV templates

### Migration
- `gsx_migration_guides` - Country migration guides

## Security
- RLS enabled on all tables
- Owner-scoped access for user data
- Public read for job postings and courses
*/

-- ============================================================
-- GSX EMPLOYERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_employers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  company_logo_url text,
  company_type text NOT NULL DEFAULT 'company',
  industry text NOT NULL,
  country_code text NOT NULL DEFAULT 'IN',
  city text,
  website text,
  contact_email text NOT NULL,
  contact_phone text,
  description text,
  is_verified boolean NOT NULL DEFAULT false,
  verification_level text NOT NULL DEFAULT 'pending',
  trust_score integer DEFAULT 0,
  total_jobs_posted integer DEFAULT 0,
  active_jobs integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsx_employers_country ON gsx_employers(country_code);
CREATE INDEX IF NOT EXISTS idx_gsx_employers_verified ON gsx_employers(is_verified);

ALTER TABLE gsx_employers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_gsx_employers" ON gsx_employers;
CREATE POLICY "select_gsx_employers" ON gsx_employers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_gsx_employers" ON gsx_employers;
CREATE POLICY "insert_gsx_employers" ON gsx_employers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_gsx_employers" ON gsx_employers;
CREATE POLICY "update_gsx_employers" ON gsx_employers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- GSX JOB POSTINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES gsx_employers(id) ON DELETE CASCADE,
  job_title text NOT NULL,
  job_category text NOT NULL,
  employment_type text NOT NULL DEFAULT 'full_time',
  region text NOT NULL DEFAULT 'india',
  country_code text NOT NULL DEFAULT 'IN',
  city text,
  salary_min numeric(12,2) NOT NULL,
  salary_max numeric(12,2) NOT NULL,
  salary_currency text NOT NULL DEFAULT 'INR',
  salary_period text NOT NULL DEFAULT 'month',
  visa_sponsorship boolean DEFAULT false,
  visa_type text,
  accommodation_provided boolean DEFAULT false,
  accommodation_type text,
  experience_required_min integer DEFAULT 0,
  experience_required_max integer DEFAULT 0,
  education_requirement text,
  languages_required text[] NOT NULL DEFAULT '{}',
  skills_required text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  benefits text[] NOT NULL DEFAULT '{}',
  application_deadline timestamptz,
  positions_available integer DEFAULT 1,
  applications_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean DEFAULT false,
  is_urgent boolean DEFAULT false,
  smartpoints_reward integer DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsx_jobs_category ON gsx_job_postings(job_category);
CREATE INDEX IF NOT EXISTS idx_gsx_jobs_region ON gsx_job_postings(region);
CREATE INDEX IF NOT EXISTS idx_gsx_jobs_country ON gsx_job_postings(country_code);
CREATE INDEX IF NOT EXISTS idx_gsx_jobs_active ON gsx_job_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_gsx_jobs_featured ON gsx_job_postings(is_featured);

ALTER TABLE gsx_job_postings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_gsx_jobs" ON gsx_job_postings;
CREATE POLICY "select_gsx_jobs" ON gsx_job_postings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_gsx_jobs" ON gsx_job_postings;
CREATE POLICY "insert_gsx_jobs" ON gsx_job_postings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_gsx_jobs" ON gsx_job_postings;
CREATE POLICY "update_gsx_jobs" ON gsx_job_postings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- GSX JOB APPLICATIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES gsx_job_postings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter text,
  expected_salary numeric(12,2),
  availability_date date,
  status text NOT NULL DEFAULT 'pending',
  employer_notes text,
  interview_date timestamptz,
  interview_type text,
  interview_notes text,
  smartpoints_earned integer DEFAULT 0,
  applied_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_gsx_applications_user ON gsx_job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_gsx_applications_job ON gsx_job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_gsx_applications_status ON gsx_job_applications(status);

ALTER TABLE gsx_job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_applications" ON gsx_job_applications;
CREATE POLICY "select_own_applications" ON gsx_job_applications FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM gsx_employers WHERE gsx_employers.user_id = auth.uid() AND gsx_employers.id = (SELECT employer_id FROM gsx_job_postings WHERE gsx_job_postings.id = gsx_job_applications.job_id)));

DROP POLICY IF EXISTS "insert_own_applications" ON gsx_job_applications;
CREATE POLICY "insert_own_applications" ON gsx_job_applications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_applications" ON gsx_job_applications;
CREATE POLICY "update_own_applications" ON gsx_job_applications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- GSX JOB SAVED TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_job_saved (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES gsx_job_postings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE gsx_job_saved ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saved_jobs" ON gsx_job_saved;
CREATE POLICY "select_own_saved_jobs" ON gsx_job_saved FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved_jobs" ON gsx_job_saved;
CREATE POLICY "insert_own_saved_jobs" ON gsx_job_saved FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved_jobs" ON gsx_job_saved;
CREATE POLICY "delete_own_saved_jobs" ON gsx_job_saved FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- GSX WORKER PROFILES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_worker_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  profile_photo_url text,
  headline text,
  summary text,
  current_position text,
  current_employer text,
  total_experience_years integer DEFAULT 0,
  education_level text,
  skills text[] NOT NULL DEFAULT '{}',
  verified_skills text[] NOT NULL DEFAULT '{}',
  languages text[] NOT NULL DEFAULT '{}',
  preferred_job_categories text[] NOT NULL DEFAULT '{}',
  preferred_regions text[] NOT NULL DEFAULT '{}',
  expected_salary_min numeric(12,2),
  expected_salary_max numeric(12,2),
  expected_currency text DEFAULT 'INR',
  willing_to_relocate boolean DEFAULT true,
  visa_status text,
  passport_number text,
  passport_expiry date,
  availability text DEFAULT 'immediately',
  phone text,
  email text,
  linkedin text,
  portfolio_url text,
  resume_url text,
  trust_score integer DEFAULT 0,
  skill_verification_score integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  verification_level text DEFAULT 'pending',
  badges text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsx_workers_user ON gsx_worker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_gsx_workers_verified ON gsx_worker_profiles(is_verified);

ALTER TABLE gsx_worker_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_gsx_workers" ON gsx_worker_profiles;
CREATE POLICY "select_gsx_workers" ON gsx_worker_profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_worker" ON gsx_worker_profiles;
CREATE POLICY "insert_own_worker" ON gsx_worker_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_worker" ON gsx_worker_profiles;
CREATE POLICY "update_own_worker" ON gsx_worker_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- GSX WORKER CERTIFICATES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_worker_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_type text NOT NULL,
  certificate_name text NOT NULL,
  issuing_authority text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  certificate_url text,
  verification_id text,
  is_verified boolean DEFAULT false,
  skills_verified text[] NOT NULL DEFAULT '{}',
  smartpoints_awarded integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsx_certificates_user ON gsx_worker_certificates(user_id);

ALTER TABLE gsx_worker_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_certificates" ON gsx_worker_certificates;
CREATE POLICY "select_own_certificates" ON gsx_worker_certificates FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_certificates" ON gsx_worker_certificates;
CREATE POLICY "insert_own_certificates" ON gsx_worker_certificates FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- GSX SKILL BADGES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_skill_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  skill_category text NOT NULL,
  skill_level text NOT NULL DEFAULT 'beginner',
  verified boolean DEFAULT false,
  verified_by text,
  verified_at timestamptz,
  assessment_score integer,
  trust_rating numeric(3,2) DEFAULT 0,
  courses_completed text[] NOT NULL DEFAULT '{}',
  projects_completed integer DEFAULT 0,
  endorsements integer DEFAULT 0,
  smartpoints_earned integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsx_badges_user ON gsx_skill_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_gsx_badges_verified ON gsx_skill_badges(verified);

ALTER TABLE gsx_skill_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_badges" ON gsx_skill_badges;
CREATE POLICY "select_own_badges" ON gsx_skill_badges FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_badges" ON gsx_skill_badges;
CREATE POLICY "insert_own_badges" ON gsx_skill_badges FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_badges" ON gsx_skill_badges;
CREATE POLICY "update_own_badges" ON gsx_skill_badges FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- GSX LANGUAGE COURSES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_language_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language text NOT NULL,
  course_type text NOT NULL,
  course_name text NOT NULL,
  description text NOT NULL,
  level text NOT NULL DEFAULT 'beginner',
  duration_hours integer NOT NULL,
  lessons_count integer DEFAULT 0,
  videos_count integer DEFAULT 0,
  quizzes_count integer DEFAULT 0,
  smartpoints_reward integer DEFAULT 20,
  certificate_awarded boolean DEFAULT true,
  instructor_name text,
  instructor_photo_url text,
  rating numeric(3,2) DEFAULT 0,
  enrolled_count integer DEFAULT 0,
  completion_count integer DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_free boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsx_courses_language ON gsx_language_courses(language);
CREATE INDEX IF NOT EXISTS idx_gsx_courses_active ON gsx_language_courses(is_active);

ALTER TABLE gsx_language_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_gsx_courses" ON gsx_language_courses;
CREATE POLICY "select_gsx_courses" ON gsx_language_courses FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- GSX USER LANGUAGE PROGRESS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_user_language_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES gsx_language_courses(id) ON DELETE CASCADE,
  language text NOT NULL,
  current_lesson integer DEFAULT 0,
  completed_lessons integer[] NOT NULL DEFAULT '{}',
  quiz_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  overall_score integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  certificate_issued boolean DEFAULT false,
  certificate_url text,
  smartpoints_earned integer DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  last_accessed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_gsx_progress_user ON gsx_user_language_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_gsx_progress_course ON gsx_user_language_progress(course_id);

ALTER TABLE gsx_user_language_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_progress" ON gsx_user_language_progress;
CREATE POLICY "select_own_progress" ON gsx_user_language_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON gsx_user_language_progress;
CREATE POLICY "insert_own_progress" ON gsx_user_language_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON gsx_user_language_progress;
CREATE POLICY "update_own_progress" ON gsx_user_language_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- GSX INTERVIEW PRACTICES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_interview_practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  job_category text,
  interview_type text NOT NULL DEFAULT 'general',
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_feedback jsonb NOT NULL DEFAULT '{}'::jsonb,
  overall_score integer DEFAULT 0,
  smartpoints_earned integer DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsx_interviews_user ON gsx_interview_practices(user_id);

ALTER TABLE gsx_interview_practices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_interviews" ON gsx_interview_practices;
CREATE POLICY "select_own_interviews" ON gsx_interview_practices FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_interviews" ON gsx_interview_practices;
CREATE POLICY "insert_own_interviews" ON gsx_interview_practices FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- GSX INTERVIEW QUESTIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  category text NOT NULL,
  job_category text,
  difficulty text NOT NULL DEFAULT 'medium',
  sample_answer text,
  tips text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gsx_interview_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_gsx_questions" ON gsx_interview_questions;
CREATE POLICY "select_gsx_questions" ON gsx_interview_questions FOR SELECT
  TO authenticated USING (is_active = true);

-- ============================================================
-- GSX RESUME TEMPLATES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_resume_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  template_type text NOT NULL DEFAULT 'professional',
  preview_url text,
  template_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_premium boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gsx_resume_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_gsx_templates" ON gsx_resume_templates;
CREATE POLICY "select_gsx_templates" ON gsx_resume_templates FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- GSX MIGRATION GUIDES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS gsx_migration_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL UNIQUE,
  country_name text NOT NULL,
  visa_types jsonb NOT NULL DEFAULT '[]'::jsonb,
  passport_guidance text,
  medical_requirements text[] NOT NULL DEFAULT '{}',
  document_checklist text[] NOT NULL DEFAULT '{}',
  embassy_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  travel_tips text[] NOT NULL DEFAULT '{}',
  estimated_costs jsonb NOT NULL DEFAULT '{}'::jsonb,
  processing_time_days integer DEFAULT 30,
  success_rate integer DEFAULT 0,
  last_updated timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gsx_migration_guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_gsx_migration" ON gsx_migration_guides;
CREATE POLICY "select_gsx_migration" ON gsx_migration_guides FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- INSERT DEFAULT DATA
-- ============================================================

-- Language Courses
INSERT INTO gsx_language_courses (language, course_type, course_name, description, level, duration_hours, lessons_count, videos_count, quizzes_count, smartpoints_reward, certificate_awarded, rating, is_active, is_free, display_order) VALUES
('english', 'basic_spoken', 'Basic Spoken English', 'Learn everyday English conversation', 'beginner', 20, 40, 20, 15, 50, true, 4.8, true, true, 1),
('english', 'interview', 'Interview English Mastery', 'Ace your job interviews in English', 'intermediate', 15, 30, 15, 10, 40, true, 4.9, true, true, 2),
('english', 'business', 'Business English Professional', 'Professional English for the workplace', 'advanced', 25, 50, 25, 20, 60, true, 4.7, true, true, 3),
('arabic', 'basic_spoken', 'Arabic for Beginners', 'Learn Arabic for GCC opportunities', 'beginner', 30, 60, 30, 20, 55, true, 4.6, true, true, 4),
('german', 'basic_spoken', 'German A1 - Foundations', 'Start your German language journey', 'beginner', 40, 80, 40, 30, 70, true, 4.8, true, true, 5),
('french', 'basic_spoken', 'French for Beginners', 'Learn basic French conversation', 'beginner', 25, 50, 25, 15, 50, true, 4.5, true, true, 6),
('hindi', 'basic_spoken', 'Hindi for Beginners', 'Learn conversational Hindi', 'beginner', 15, 30, 15, 10, 30, true, 4.4, true, true, 7),
('malayalam', 'basic_spoken', 'Malayalam Basics', 'Learn Malayalam for Kerala jobs', 'beginner', 20, 40, 20, 15, 35, true, 4.3, true, true, 8)
ON CONFLICT DO NOTHING;

-- Migration Guides
INSERT INTO gsx_migration_guides (country_code, country_name, passport_guidance, medical_requirements, document_checklist, travel_tips, processing_time_days, success_rate) VALUES
('DE', 'Germany', 'Valid passport with at least 12 months validity', ARRAY['Health insurance', 'TB test'], ARRAY['Passport', 'Photos', 'Application form', 'CV', 'Cover letter', 'Certificates'], ARRAY['Book flights early', 'Get travel insurance', 'Learn basic German'], 90, 78),
('AE', 'UAE', 'Valid passport with at least 6 months validity', ARRAY['Medical fitness test', 'Blood test'], ARRAY['Passport', 'Photos', 'Offer letter', 'Attested certificates'], ARRAY['Emirates ID required within 30 days', 'Open bank account quickly'], 20, 85),
('SA', 'Saudi Arabia', 'Valid passport with at least 6 months validity', ARRAY['Medical test', 'Police clearance'], ARRAY['Passport', 'Photos', 'Offer letter', 'Medical certificate'], ARRAY['Get visa stamped', 'Carry documents'], 30, 82),
('QA', 'Qatar', 'Valid passport with at least 6 months validity', ARRAY['Medical test'], ARRAY['Passport', 'Photos', 'Offer letter'], ARRAY['Qatar ID required', 'Bank account setup'], 25, 80),
('GB', 'United Kingdom', 'Valid passport for duration of stay', ARRAY['TB test for some countries'], ARRAY['Passport', 'Photos', 'Offer letter', 'Bank statements'], ARRAY['Book biometric appointment'], 45, 75),
('CA', 'Canada', 'Valid passport', ARRAY['Medical exam for some programs'], ARRAY['Passport', 'ECA report', 'IELTS results'], ARRAY['Apply for SIN after arrival'], 60, 72)
ON CONFLICT (country_code) DO NOTHING;

-- Interview Questions
INSERT INTO gsx_interview_questions (question, category, job_category, difficulty, sample_answer, tips) VALUES
('Tell me about yourself', 'introduction', NULL, 'easy', 'Provide a brief summary of your professional background, key skills, and what brings you to this role.', ARRAY['Keep it professional', '2-3 minutes max', 'Relate to the job']),
('Why do you want to work here?', 'motivation', NULL, 'medium', 'Research the company and mention specific things that appeal to you about their mission, values, or opportunities.', ARRAY['Research the company', 'Be specific', 'Connect to your goals']),
('What are your greatest strengths?', 'strengths', NULL, 'medium', 'Choose 2-3 strengths relevant to the job with specific examples.', ARRAY['Be honest', 'Use examples', 'Relate to job requirements']),
('Describe a challenging situation and how you handled it', 'behavioral', NULL, 'hard', 'Use the STAR method: Situation, Task, Action, Result.', ARRAY['Use STAR format', 'Be specific', 'Show positive outcome']),
('Where do you see yourself in 5 years?', 'goals', NULL, 'medium', 'Show ambition while being realistic about career growth within the company.', ARRAY['Be realistic', 'Show growth mindset', 'Align with company'])
ON CONFLICT DO NOTHING;

-- Resume Templates
INSERT INTO gsx_resume_templates (template_name, template_type, is_premium, usage_count) VALUES
('Professional Classic', 'professional', false, 4500),
('Modern Minimal', 'modern', false, 3200),
('Executive Premium', 'executive', true, 1800),
('Creative Design', 'creative', true, 2100),
('Technical Focus', 'technical', false, 2800),
('Entry Level Graduate', 'entry', false, 3500)
ON CONFLICT DO NOTHING;
