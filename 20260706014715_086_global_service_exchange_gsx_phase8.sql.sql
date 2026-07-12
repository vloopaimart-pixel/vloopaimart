-- ============================================================
-- Migration 075: VLOOP Future Opportunities Experience Center
-- Phase 46.5 — Enterprise Customer Experience Module
-- ============================================================

-- 1. Future Projects Catalog
CREATE TABLE future_projects_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code text NOT NULL UNIQUE,
  project_name text NOT NULL,
  project_category text NOT NULL CHECK (project_category IN (
    'affordable_housing', 'land_projects', 'villa_projects', 'apartment_projects',
    'ev_programs', 'vehicle_programs', 'gold_programs',
    'education_support', 'healthcare_support', 'community_development', 'future'
  )),
  short_description text NOT NULL,
  full_description text,
  vision text,
  objectives jsonb DEFAULT '[]'::jsonb,
  eligibility jsonb DEFAULT '{}'::jsonb,
  participation_rules jsonb DEFAULT '{}'::jsonb,
  hero_image_url text,
  status text DEFAULT 'coming_soon' CHECK (status IN ('draft', 'coming_soon', 'open', 'active', 'completed', 'suspended')),
  expected_launch date,
  estimated_duration_months integer,
  min_participation_units integer DEFAULT 100,
  max_participation_units integer DEFAULT 10000,
  unit_value_smartpoints integer DEFAULT 100,
  total_available_units integer DEFAULT 1000,
  ai_transparency jsonb DEFAULT '{}'::jsonb,
  legal_info jsonb DEFAULT '{}'::jsonb,
  faq jsonb DEFAULT '[]'::jsonb,
  priority integer DEFAULT 5,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE future_projects_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_projects_all" ON future_projects_catalog;
CREATE POLICY "select_projects_all" ON future_projects_catalog FOR SELECT
  TO authenticated USING (status IN ('coming_soon', 'open', 'active', 'completed'));

DROP POLICY IF EXISTS "crud_projects_admin" ON future_projects_catalog;
CREATE POLICY "crud_projects_admin" ON future_projects_catalog FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert sample future projects
INSERT INTO future_projects_catalog (project_code, project_name, project_category, short_description, status, expected_launch, estimated_duration_months, min_participation_units, unit_value_smartpoints, total_available_units, is_featured) VALUES
('HOUSING-2027-001', 'VLOOP Affordable Housing Initiative', 'affordable_housing', 'Premium affordable housing units for VLOOP members with smart city integration and sustainable design.', 'coming_soon', '2027-03-01', 24, 100, 100, 5000, true),
('LAND-2027-001', 'VLOOP Land Development Project', 'land_projects', 'Premium residential land plots in growing metropolitan areas with complete infrastructure development.', 'coming_soon', '2027-06-01', 36, 250, 250, 2000, true),
('VILLA-2027-001', 'VLOOP Villa Community', 'villa_projects', 'Luxury villa community with modern amenities, smart home features, and resort-style living.', 'coming_soon', '2027-09-01', 30, 500, 500, 500, true),
('APARTMENT-2027-001', 'VLOOP Premium Apartments', 'apartment_projects', 'Modern apartment complexes with premium finishes, sustainable design, and smart technology.', 'coming_soon', '2027-12-01', 24, 100, 100, 3000, true),
('EV-2027-001', 'VLOOP EV Program', 'ev_programs', 'Electric vehicle ownership program with charging infrastructure and sustainable mobility solutions.', 'coming_soon', '2027-04-01', 12, 250, 250, 10000, true),
('VEHICLE-2027-001', 'VLOOP Vehicle Program', 'vehicle_programs', 'Premium vehicle ownership program with flexible participation units and exclusive tie-ups.', 'coming_soon', '2027-07-01', 18, 250, 250, 5000, true),
('GOLD-2027-001', 'VLOOP Gold Savings Program', 'gold_programs', 'Secure gold accumulation program with digital tracking, competitive rates, and flexible options.', 'coming_soon', '2027-02-01', 12, 100, 100, 50000, true),
('EDU-2027-001', 'VLOOP Education Support', 'education_support', 'Educational support program for members children with scholarships and skill development.', 'coming_soon', '2027-05-01', 60, 100, 100, 20000, true),
('HEALTH-2027-001', 'VLOOP Healthcare Support', 'healthcare_support', 'Comprehensive healthcare assistance program with preventive care and hospitalization benefits.', 'coming_soon', '2027-08-01', 48, 100, 100, 15000, true),
('COMMUNITY-2027-001', 'VLOOP Community Development', 'community_development', 'Sustainable community development initiatives with local impact and global standards.', 'coming_soon', '2027-10-01', 36, 100, 100, 10000, true);

-- 2. Project Progress Tracking
CREATE TABLE future_project_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  progress_date date NOT NULL DEFAULT current_date,
  overall_progress integer DEFAULT 0 CHECK (overall_progress BETWEEN 0 AND 100),
  milestone text,
  milestone_description text,
  milestones_completed jsonb DEFAULT '[]'::jsonb,
  participants_count integer DEFAULT 0,
  participation_units_allocated integer DEFAULT 0,
  remaining_units integer DEFAULT 0,
  ai_verification_status text DEFAULT 'pending' CHECK (ai_verification_status IN ('pending', 'verified', 'flagged')),
  transparency_score integer DEFAULT 0 CHECK (transparency_score BETWEEN 0 AND 100),
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, progress_date)
);

ALTER TABLE future_project_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_progress_all" ON future_project_progress;
CREATE POLICY "select_progress_all" ON future_project_progress FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "crud_progress_admin" ON future_project_progress;
CREATE POLICY "crud_progress_admin" ON future_project_progress FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. Participation Units Configuration
CREATE TABLE participation_units_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code text NOT NULL UNIQUE,
  unit_name text NOT NULL,
  smartpoints_required integer NOT NULL,
  tier text NOT NULL CHECK (tier IN ('standard', 'silver', 'gold', 'platinum')),
  description text,
  image_url text,
  color_theme text DEFAULT 'blue',
  benefits jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE participation_units_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_units_all" ON participation_units_config;
CREATE POLICY "select_units_all" ON participation_units_config FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_units_admin" ON participation_units_config;
CREATE POLICY "crud_units_admin" ON participation_units_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

INSERT INTO participation_units_config (unit_code, unit_name, smartpoints_required, tier, description, display_order) VALUES
('UNIT-100', '100 SmartPoints Unit', 100, 'standard', 'Standard participation unit for Future Opportunity projects.', 1),
('UNIT-250', '250 SmartPoints Unit', 250, 'silver', 'Silver tier participation unit with enhanced benefits.', 2),
('UNIT-500', '500 SmartPoints Unit', 500, 'gold', 'Gold tier participation unit with premium benefits.', 3),
('UNIT-1000', '1000 SmartPoints Unit', 1000, 'platinum', 'Platinum tier participation unit with maximum benefits.', 4);

-- 4. User Project Preferences
CREATE TABLE user_project_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  is_interested boolean DEFAULT true,
  notification_enabled boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

ALTER TABLE user_project_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_prefs_own" ON user_project_preferences;
CREATE POLICY "select_prefs_own" ON user_project_preferences FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_prefs_own" ON user_project_preferences;
CREATE POLICY "crud_prefs_own" ON user_project_preferences FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- 5. User Project Dashboard
CREATE TABLE user_future_dashboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_smartpoints_balance integer DEFAULT 0,
  purchase_smartpoints integer DEFAULT 0,
  careclub_smartpoints integer DEFAULT 0,
  available_projects_count integer DEFAULT 0,
  interested_projects_count integer DEFAULT 0,
  joined_projects_count integer DEFAULT 0,
  pending_projects_count integer DEFAULT 0,
  coming_soon_projects_count integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_future_dashboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_dashboard_own" ON user_future_dashboard;
CREATE POLICY "select_dashboard_own" ON user_future_dashboard FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_dashboard_own" ON user_future_dashboard;
CREATE POLICY "crud_dashboard_own" ON user_future_dashboard FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- 6. AI Project Recommendations
CREATE TABLE ai_project_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  recommendation_score integer DEFAULT 0 CHECK (recommendation_score BETWEEN 0 AND 100),
  recommendation_reason text,
  factors jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, project_id)
);

ALTER TABLE ai_project_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_rec_own" ON ai_project_recommendations;
CREATE POLICY "select_rec_own" ON ai_project_recommendations FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_rec_admin" ON ai_project_recommendations;
CREATE POLICY "crud_rec_admin" ON ai_project_recommendations FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. Project FAQ
CREATE TABLE future_project_faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general' CHECK (category IN ('general', 'eligibility', 'participation', 'smartpoints', 'timeline', 'legal')),
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE future_project_faq ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_faq_all" ON future_project_faq;
CREATE POLICY "select_faq_all" ON future_project_faq FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_faq_admin" ON future_project_faq;
CREATE POLICY "crud_faq_admin" ON future_project_faq FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert default FAQs
INSERT INTO future_project_faq (question, answer, category, display_order) VALUES
('What are Future Opportunity Projects?', 'Future Opportunity Projects are VLOOP ecosystem initiatives where members can allocate their SmartPoints earned through purchases and Care Club contributions to participate in premium projects.', 'general', 1),
('How do I earn SmartPoints?', 'SmartPoints are automatically earned when you make purchases through VLOOP partner stores or contribute to the Care Club. Each purchase and contribution generates SmartPoints based on VCOS rules.', 'smartpoints', 2),
('What is a Participation Unit?', 'A Participation Unit is a digital allocation of SmartPoints toward a Future Opportunity Project. Units are available in denominations of 100, 250, 500, and 1000 SmartPoints.', 'participation', 3),
('When can I join a project?', 'Projects become available for participation when they move from Coming Soon to Open status. You can express interest and receive notifications for upcoming projects.', 'timeline', 4),
('Are SmartPoints refundable?', 'SmartPoints allocation to Future Opportunity Projects follows VCOS rules. Please review the specific terms and conditions for each project before participating.', 'legal', 5),
('How is AI used in project selection?', 'VLOOP AI analyzes your SmartPoints balance, activity patterns, Trust Score, and preferences to recommend suitable Future Opportunity Projects.', 'general', 6);

-- 8. Indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON future_projects_catalog(project_category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON future_projects_catalog(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON future_projects_catalog(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_project_progress_date ON future_project_progress(progress_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_prefs_user ON user_project_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_dashboard_user ON user_future_dashboard(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_rec_user ON ai_project_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_faq_project ON future_project_faq(project_id);

-- 9. Triggers
DROP TRIGGER IF EXISTS trg_projects_updated ON future_projects_catalog;
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON future_projects_catalog
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_user_prefs_updated ON user_project_preferences;
CREATE TRIGGER trg_user_prefs_updated BEFORE UPDATE ON user_project_preferences
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 10. Functions
CREATE OR REPLACE FUNCTION get_future_opportunities_summary(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_summary jsonb;
BEGIN
  SELECT jsonb_build_object(
    'projects', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM future_projects_catalog WHERE status IN ('coming_soon', 'open', 'active')),
      'coming_soon', (SELECT COUNT(*) FROM future_projects_catalog WHERE status = 'coming_soon'),
      'open', (SELECT COUNT(*) FROM future_projects_catalog WHERE status = 'open'),
      'active', (SELECT COUNT(*) FROM future_projects_catalog WHERE status = 'active'),
      'featured', (SELECT COUNT(*) FROM future_projects_catalog WHERE is_featured = true AND status IN ('coming_soon', 'open', 'active'))
    ),
    'units', jsonb_build_object(
      'options', (SELECT jsonb_agg(jsonb_build_object('code', unit_code, 'name', unit_name, 'points', smartpoints_required, 'tier', tier)) FROM participation_units_config WHERE is_active = true ORDER BY display_order)
    ),
    'user_preferences', jsonb_build_object(
      'interested', (SELECT COUNT(*) FROM user_project_preferences WHERE user_id = p_user_id AND is_interested = true)
    )
  ) INTO v_summary;

  RETURN v_summary;
END;
$function$;
