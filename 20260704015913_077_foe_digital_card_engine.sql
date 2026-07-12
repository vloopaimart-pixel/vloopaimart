-- ============================================================
-- Migration 078: VLOOP FOE Project Administration Center
-- Phase 49 — Enterprise Project Management System
-- ============================================================

-- 1. FOE Project Templates
CREATE TABLE foe_project_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code text NOT NULL UNIQUE,
  template_name text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'affordable_housing', 'land_projects', 'villa_projects', 'apartment_projects',
    'vehicle_programs', 'ev_programs', 'gold_programs', 'healthcare_programs',
    'education_programs', 'community_development', 'future_enterprise'
  )),
  description text,
  banner_image_url text,
  default_duration_days integer DEFAULT 365,
  default_target_value numeric,
  default_min_participation integer DEFAULT 1,
  default_max_participation integer DEFAULT 1000,
  allowed_unit_types jsonb DEFAULT '["SP-100", "SP-250", "SP-500", "SP-1000"]'::jsonb,
  default_visibility text DEFAULT 'public' CHECK (default_visibility IN ('public', 'private', 'restricted')),
  default_countries jsonb DEFAULT '["IN"]'::jsonb,
  default_languages jsonb DEFAULT '["en"]'::jsonb,
  settings_template jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foe_project_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_templates_all" ON foe_project_templates;
CREATE POLICY "select_templates_all" ON foe_project_templates FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_templates_admin" ON foe_project_templates;
CREATE POLICY "crud_templates_admin" ON foe_project_templates FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 2. Admin Roles Configuration
CREATE TABLE foe_admin_roles_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_code text NOT NULL UNIQUE,
  role_name text NOT NULL,
  description text,
  hierarchy_level integer DEFAULT 0,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  can_create_projects boolean DEFAULT false,
  can_edit_projects boolean DEFAULT false,
  can_pause_projects boolean DEFAULT false,
  can_archive_projects boolean DEFAULT false,
  can_manage_templates boolean DEFAULT false,
  can_view_audit boolean DEFAULT false,
  can_export_reports boolean DEFAULT false,
  can_manage_admins boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_admin_roles_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_roles_admin" ON foe_admin_roles_config;
CREATE POLICY "select_roles_admin" ON foe_admin_roles_config FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "crud_roles_superadmin" ON foe_admin_roles_config;
CREATE POLICY "crud_roles_superadmin" ON foe_admin_roles_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles ar
    JOIN foe_admin_roles_config fc ON fc.role_code = ar.role
    WHERE ar.user_id = auth.uid() AND ar.is_active = true AND fc.hierarchy_level <= 1
  ));

-- Insert default admin roles
INSERT INTO foe_admin_roles_config (role_code, role_name, description, hierarchy_level, permissions, can_create_projects, can_edit_projects, can_pause_projects, can_archive_projects, can_manage_templates, can_view_audit, can_export_reports, can_manage_admins) VALUES
('super_admin', 'Super Admin', 'Full system access with all permissions', 1, '{"all": true}'::jsonb, true, true, true, true, true, true, true, true),
('enterprise_admin', 'Enterprise Admin', 'Enterprise-level project management', 2, '{"projects": "full", "reports": "full"}'::jsonb, true, true, true, true, true, true, true, false),
('regional_admin', 'Regional Admin', 'Regional project oversight', 3, '{"projects": "regional", "reports": "read"}'::jsonb, true, true, true, false, false, true, true, false),
('project_manager', 'Project Manager', 'Manage assigned projects', 4, '{"projects": "assigned", "reports": "assigned"}'::jsonb, true, true, true, false, false, true, true, false),
('audit_officer', 'Audit Officer', 'View and audit all activities', 5, '{"audit": "full", "reports": "full"}'::jsonb, false, false, false, false, false, true, true, false),
('support_team', 'Support Team', 'View and support operations', 6, '{"projects": "read", "support": "full"}'::jsonb, false, false, false, false, false, true, true, false),
('read_only_auditor', 'Read-only Auditor', 'View-only access for compliance', 7, '{"all": "read"}'::jsonb, false, false, false, false, false, true, true, false);

-- 3. Project Administration Log
CREATE TABLE foe_project_admin_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE SET NULL,
  admin_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN (
    'created', 'updated', 'published', 'unpublished',
    'paused', 'resumed', 'closed', 'archived', 'restored',
    'deleted', 'duplicated', 'settings_changed', 'status_changed',
    'visibility_changed', 'target_changed', 'dates_changed'
  )),
  previous_state jsonb DEFAULT '{}'::jsonb,
  new_state jsonb DEFAULT '{}'::jsonb,
  changes jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  audit_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_project_admin_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_log_admin" ON foe_project_admin_log;
CREATE POLICY "select_log_admin" ON foe_project_admin_log FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "insert_log_auth" ON foe_project_admin_log;
CREATE POLICY "insert_log_auth" ON foe_project_admin_log FOR INSERT
  TO authenticated WITH CHECK (true);

-- 4. AI Monitoring Data
CREATE TABLE foe_ai_monitoring (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  monitoring_date date NOT NULL DEFAULT current_date,
  
  -- Participation Metrics
  participation_count integer DEFAULT 0,
  participation_delta integer DEFAULT 0,
  participation_trend text CHECK (participation_trend IN ('increasing', 'stable', 'decreasing')),
  
  -- Growth Prediction
  predicted_participation integer,
  predicted_completion_date date,
  growth_rate numeric DEFAULT 0,
  growth_prediction_confidence numeric DEFAULT 0,
  
  -- Risk Assessment
  risk_score integer DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  risk_alerts jsonb DEFAULT '[]'::jsonb,
  fraud_risk_score integer DEFAULT 0 CHECK (fraud_risk_score BETWEEN 0 AND 100),
  fraud_alerts jsonb DEFAULT '[]'::jsonb,
  
  -- Health Metrics
  project_health_score integer DEFAULT 100 CHECK (project_health_score BETWEEN 0 AND 100),
  trust_score_avg numeric DEFAULT 0,
  trust_score_distribution jsonb DEFAULT '{}'::jsonb,
  
  -- AI Recommendations
  ai_recommendations jsonb DEFAULT '[]'::jsonb,
  ai_priority_level text DEFAULT 'normal' CHECK (ai_priority_level IN ('low', 'normal', 'high', 'critical')),
  
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, monitoring_date)
);

ALTER TABLE foe_ai_monitoring ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_monitor_admin" ON foe_ai_monitoring;
CREATE POLICY "select_monitor_admin" ON foe_ai_monitoring FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_monitor_admin_full" ON foe_ai_monitoring;
CREATE POLICY "crud_monitor_admin_full" ON foe_ai_monitoring FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 5. Project Status History
CREATE TABLE foe_project_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  reason text,
  changed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  changed_at timestamptz DEFAULT now(),
  notes text
);

ALTER TABLE foe_project_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_history_admin" ON foe_project_status_history;
CREATE POLICY "select_history_admin" ON foe_project_status_history FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "insert_history_auth" ON foe_project_status_history;
CREATE POLICY "insert_history_auth" ON foe_project_status_history FOR INSERT
  TO authenticated WITH CHECK (true);

-- 6. Admin Dashboard Stats Cache
CREATE TABLE foe_admin_dashboard_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_date date NOT NULL DEFAULT current_date UNIQUE,
  
  -- Project Counts
  total_projects integer DEFAULT 0,
  active_projects integer DEFAULT 0,
  completed_projects integer DEFAULT 0,
  paused_projects integer DEFAULT 0,
  archived_projects integer DEFAULT 0,
  draft_projects integer DEFAULT 0,
  
  -- Participant Stats
  total_participants integer DEFAULT 0,
  new_participants_today integer DEFAULT 0,
  active_participants_week integer DEFAULT 0,
  
  -- Unit Stats
  total_participation_units integer DEFAULT 0,
  total_smartpoints_allocated integer DEFAULT 0,
  
  -- Project Types Distribution
  project_type_distribution jsonb DEFAULT '{}'::jsonb,
  
  -- Progress Stats
  avg_project_progress numeric DEFAULT 0,
  projects_near_completion integer DEFAULT 0,
  
  -- Transparency Stats
  avg_transparency_score numeric DEFAULT 0,
  flagged_projects integer DEFAULT 0,
  
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE foe_admin_dashboard_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_cache_admin" ON foe_admin_dashboard_cache;
CREATE POLICY "select_cache_admin" ON foe_admin_dashboard_cache FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_cache_admin_full" ON foe_admin_dashboard_cache;
CREATE POLICY "crud_cache_admin_full" ON foe_admin_dashboard_cache FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. Reports Configuration
CREATE TABLE foe_reports_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_code text NOT NULL UNIQUE,
  report_name text NOT NULL,
  report_type text NOT NULL CHECK (report_type IN (
    'project_summary', 'participation_summary', 'growth_analytics',
    'transparency_report', 'audit_report', 'admin_activity'
  )),
  description text,
  columns jsonb DEFAULT '[]'::jsonb,
  filters jsonb DEFAULT '{}'::jsonb,
  sort_options jsonb DEFAULT '{}'::jsonb,
  export_formats jsonb DEFAULT '["csv", "xlsx", "pdf"]'::jsonb,
  schedule_enabled boolean DEFAULT false,
  schedule_cron text,
  recipients jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foe_reports_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_reports_admin" ON foe_reports_config;
CREATE POLICY "select_reports_admin" ON foe_reports_config FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_reports_admin" ON foe_reports_config;
CREATE POLICY "crud_reports_admin" ON foe_reports_config FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert default reports
INSERT INTO foe_reports_config (report_code, report_name, report_type, description) VALUES
('RPT-001', 'Project Summary Report', 'project_summary', 'Overview of all projects with status, progress, and participation metrics'),
('RPT-002', 'Participation Summary Report', 'participation_summary', 'Detailed breakdown of participation units across all projects'),
('RPT-003', 'Growth Analytics Report', 'growth_analytics', 'Participation trends, growth rates, and AI predictions'),
('RPT-004', 'Transparency Report', 'transparency_report', 'Project transparency scores and validation status'),
('RPT-005', 'Audit Trail Report', 'audit_report', 'Complete audit log of all administrative actions'),
('RPT-006', 'Admin Activity Report', 'admin_activity', 'Summary of admin actions and permissions usage');

-- 8. Project Assignments
CREATE TABLE foe_project_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES future_projects_catalog(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'project_manager',
  assigned_by uuid REFERENCES profiles(id),
  assigned_at timestamptz DEFAULT now(),
  is_primary boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, admin_id)
);

ALTER TABLE foe_project_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_assign_admin" ON foe_project_assignments;
CREATE POLICY "select_assign_admin" ON foe_project_assignments FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_assign_admin" ON foe_project_assignments;
CREATE POLICY "crud_assign_admin" ON foe_project_assignments FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Indexes
CREATE INDEX IF NOT EXISTS idx_templates_category ON foe_project_templates(category);
CREATE INDEX IF NOT EXISTS idx_admin_log_project ON foe_project_admin_log(project_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_admin ON foe_project_admin_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_date ON foe_project_admin_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_monitor_project ON foe_ai_monitoring(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_monitor_date ON foe_ai_monitoring(monitoring_date DESC);
CREATE INDEX IF NOT EXISTS idx_project_status_project ON foe_project_status_history(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_admin ON foe_project_assignments(admin_id);

-- 10. Triggers
DROP TRIGGER IF EXISTS trg_templates_updated ON foe_project_templates;
CREATE TRIGGER trg_templates_updated BEFORE UPDATE ON foe_project_templates
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_reports_updated ON foe_reports_config;
CREATE TRIGGER trg_reports_updated BEFORE UPDATE ON foe_reports_config
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 11. Functions

-- Get Admin Dashboard Stats
CREATE OR REPLACE FUNCTION foe_get_admin_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'projects', jsonb_build_object(
      'total', (SELECT COUNT(*) FROM future_projects_catalog),
      'active', (SELECT COUNT(*) FROM future_projects_catalog WHERE status = 'active'),
      'coming_soon', (SELECT COUNT(*) FROM future_projects_catalog WHERE status = 'coming_soon'),
      'completed', (SELECT COUNT(*) FROM future_projects_catalog WHERE status = 'completed'),
      'closed', (SELECT COUNT(*) FROM future_projects_catalog WHERE status = 'closed')
    ),
    'participation', jsonb_build_object(
      'total_participants', (SELECT COUNT(DISTINCT user_id) FROM foe_project_participation),
      'total_units', (SELECT COUNT(*) FROM foe_digital_cards),
      'total_smartpoints', (SELECT COALESCE(SUM(smartpoints_value), 0) FROM foe_digital_cards)
    ),
    'progress', jsonb_build_object(
      'avg_progress', (SELECT COALESCE(AVG(progress_percent), 0) FROM foe_project_progress),
      'high_progress_count', (SELECT COUNT(*) FROM foe_project_progress WHERE progress_percent >= 80)
    ),
    'transparency', jsonb_build_object(
      'avg_score', (SELECT COALESCE(AVG(transparency_score), 0) FROM foe_project_progress),
      'flagged_count', (SELECT COUNT(*) FROM foe_digital_cards WHERE vcos_status = 'flagged')
    )
  ) INTO v_stats;
  
  RETURN v_stats;
END;
$function$;

-- Log Project Action
CREATE OR REPLACE FUNCTION foe_log_project_action(
  p_project_id uuid,
  p_admin_id uuid,
  p_action text,
  p_previous_state jsonb DEFAULT '{}'::jsonb,
  p_new_state jsonb DEFAULT '{}'::jsonb,
  p_changes jsonb DEFAULT '{}'::jsonb,
  p_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO foe_project_admin_log (
    project_id, admin_id, action, previous_state, new_state, changes, audit_notes
  ) VALUES (
    p_project_id, p_admin_id, p_action, p_previous_state, p_new_state, p_changes, p_notes
  );
END;
$function$;

-- Get Project Admin Log
CREATE OR REPLACE FUNCTION foe_get_project_audit_log(p_project_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  project_name text,
  admin_name text,
  action text,
  changes jsonb,
  audit_notes text,
  created_at timestamptz
)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    pal.id,
    fp.project_name,
    pr.name as admin_name,
    pal.action,
    pal.changes,
    pal.audit_notes,
    pal.created_at
  FROM foe_project_admin_log pal
  LEFT JOIN future_projects_catalog fp ON fp.id = pal.project_id
  LEFT JOIN profiles pr ON pr.id = pal.admin_id
  WHERE p_project_id IS NULL OR pal.project_id = p_project_id
  ORDER BY pal.created_at DESC;
END;
$function$;

-- Update Project Status with Audit
CREATE OR REPLACE FUNCTION foe_update_project_status(
  p_project_id uuid,
  p_new_status text,
  p_admin_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
DECLARE
  v_old_status text;
BEGIN
  SELECT status INTO v_old_status FROM future_projects_catalog WHERE id = p_project_id;
  
  IF v_old_status IS NULL THEN
    RETURN false;
  END IF;
  
  UPDATE future_projects_catalog SET status = p_new_status WHERE id = p_project_id;
  
  INSERT INTO foe_project_status_history (project_id, from_status, to_status, reason, changed_by)
  VALUES (p_project_id, v_old_status, p_new_status, p_reason, p_admin_id);
  
  PERFORM foe_log_project_action(p_project_id, p_admin_id, 'status_changed',
    jsonb_build_object('status', v_old_status),
    jsonb_build_object('status', p_new_status),
    jsonb_build_object('reason', p_reason));
  
  RETURN true;
END;
$function$;

-- Get AI Monitoring Summary
CREATE OR REPLACE FUNCTION foe_get_ai_monitoring_summary(p_project_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_summary jsonb;
BEGIN
  SELECT jsonb_build_object(
    'alerts', jsonb_build_object(
      'total_risk_alerts', (SELECT COALESCE(SUM(jsonb_array_length(risk_alerts)), 0) FROM foe_ai_monitoring WHERE p_project_id IS NULL OR project_id = p_project_id),
      'total_fraud_alerts', (SELECT COALESCE(SUM(jsonb_array_length(fraud_alerts)), 0) FROM foe_ai_monitoring WHERE p_project_id IS NULL OR project_id = p_project_id),
      'high_risk_count', (SELECT COUNT(*) FROM foe_ai_monitoring WHERE risk_score > 70 AND (p_project_id IS NULL OR project_id = p_project_id)),
      'critical_count', (SELECT COUNT(*) FROM foe_ai_monitoring WHERE ai_priority_level = 'critical' AND (p_project_id IS NULL OR project_id = p_project_id))
    ),
    'health', jsonb_build_object(
      'avg_health_score', (SELECT COALESCE(AVG(project_health_score), 100) FROM foe_ai_monitoring WHERE p_project_id IS NULL OR project_id = p_project_id),
      'avg_trust_score', (SELECT COALESCE(AVG(trust_score_avg), 0) FROM foe_ai_monitoring WHERE p_project_id IS NULL OR project_id = p_project_id)
    ),
    'trends', jsonb_build_object(
      'increasing', (SELECT COUNT(*) FROM foe_ai_monitoring WHERE participation_trend = 'increasing' AND (p_project_id IS NULL OR project_id = p_project_id)),
      'stable', (SELECT COUNT(*) FROM foe_ai_monitoring WHERE participation_trend = 'stable' AND (p_project_id IS NULL OR project_id = p_project_id)),
      'decreasing', (SELECT COUNT(*) FROM foe_ai_monitoring WHERE participation_trend = 'decreasing' AND (p_project_id IS NULL OR project_id = p_project_id))
    )
  ) INTO v_summary;
  
  RETURN v_summary;
END;
$function$;
