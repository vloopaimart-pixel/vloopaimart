-- VLOOP Enterprise Admin Control Center - Phase 26
-- Admin roles, audit, and monitoring tables

-- ============================================================================
-- ADMIN ROLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('super_admin', 'admin', 'read_only')),
  permissions jsonb DEFAULT '{}',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);
CREATE INDEX idx_admin_roles_user ON admin_roles(user_id);
CREATE INDEX idx_admin_roles_active ON admin_roles(is_active);

-- ============================================================================
-- SMARTCODE ENTRY FLAGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartcode_entry_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_id uuid REFERENCES smartcode_allocations(id) NOT NULL,
  flagged_by uuid REFERENCES profiles(id),
  flag_reason text NOT NULL,
  flag_type text NOT NULL CHECK (flag_type IN ('high_value', 'suspicious', 'duplicate', 'manual', 'system')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_entry_flags_allocation ON smartcode_entry_flags(allocation_id);
CREATE INDEX idx_entry_flags_status ON smartcode_entry_flags(status);
CREATE INDEX idx_entry_flags_flagged_by ON smartcode_entry_flags(flagged_by);

-- ============================================================================
-- WEEKLY REWARD POOL SNAPSHOTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS weekly_reward_pool_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL,
  pool_type text NOT NULL CHECK (pool_type IN ('prime', 'premium', 'standard')),
  total_entries integer DEFAULT 0,
  total_points integer DEFAULT 0,
  unique_users integer DEFAULT 0,
  unique_codes integer DEFAULT 0,
  avg_points_per_entry numeric DEFAULT 0,
  snapshot_type text DEFAULT 'pre_draw' CHECK (snapshot_type IN ('pre_draw', 'post_draw', 'hourly', 'daily')),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_pool_snapshots_week ON weekly_reward_pool_snapshots(week_period);
CREATE INDEX idx_pool_snapshots_type ON weekly_reward_pool_snapshots(pool_type);

-- ============================================================================
-- ADMIN DASHBOARD STATS CACHE
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_dashboard_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL,
  total_active_smartcodes integer DEFAULT 0,
  total_weekly_entries integer DEFAULT 0,
  total_points_registered integer DEFAULT 0,
  purchase_points integer DEFAULT 0,
  care_club_points integer DEFAULT 0,
  ai_entries integer DEFAULT 0,
  manual_entries integer DEFAULT 0,
  unique_participants integer DEFAULT 0,
  flagged_entries integer DEFAULT 0,
  duplicate_codes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX idx_dashboard_stats_week ON admin_dashboard_stats(week_period);

-- ============================================================================
-- ADMIN ACTION LOG (Extended Audit)
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_action_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES profiles(id) NOT NULL,
  action_type text NOT NULL CHECK (action_type IN (
    'login', 'logout', 
    'view_customer', 'search_customer',
    'approve_entry', 'reject_entry', 'flag_entry',
    'view_audit_log', 'export_data',
    'settings_change', 'role_change'
  )),
  target_type text CHECK (target_type IN ('user', 'entry', 'smartcode', 'pool', 'settings')),
  target_id uuid,
  details jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_admin_action_admin ON admin_action_log(admin_id);
CREATE INDEX idx_admin_action_type ON admin_action_log(action_type);
CREATE INDEX idx_admin_action_created ON admin_action_log(created_at);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartcode_entry_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reward_pool_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_action_log ENABLE ROW LEVEL SECURITY;

-- Admin roles - only admins can read
CREATE POLICY "admin_roles_read" ON admin_roles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

-- Entry flags - admins can manage
CREATE POLICY "entry_flags_admin" ON smartcode_entry_flags FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

-- Pool snapshots - public read for admins
CREATE POLICY "pool_snapshots_read" ON weekly_reward_pool_snapshots FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

-- Dashboard stats - public read for admins
CREATE POLICY "dashboard_stats_read" ON admin_dashboard_stats FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

-- Admin action log - admins read only
CREATE POLICY "admin_action_read" ON admin_action_log FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid() AND ar.is_active = true
    )
  );

CREATE POLICY "admin_action_insert" ON admin_action_log FOR INSERT TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = p_user_id 
    AND is_active = true 
    AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has read access
CREATE OR REPLACE FUNCTION has_admin_read(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = p_user_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user admin role
CREATE OR REPLACE FUNCTION get_admin_role(p_user_id uuid DEFAULT auth.uid())
RETURNS text AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role FROM admin_roles 
  WHERE user_id = p_user_id AND is_active = true;
  
  RETURN COALESCE(v_role, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refresh dashboard stats
CREATE OR REPLACE FUNCTION refresh_admin_dashboard_stats(p_week_period text)
RETURNS void AS $$
DECLARE
  v_total_active integer;
  v_total_entries integer;
  v_total_points integer;
  v_purchase_points integer;
  v_care_club_points integer;
  v_ai_entries integer;
  v_manual_entries integer;
  v_unique_users integer;
BEGIN
  SELECT 
    COUNT(*),
    SUM(points_allocated)
  INTO v_total_entries, v_total_points
  FROM smartcode_allocations
  WHERE week_period = p_week_period AND is_active = true;

  SELECT COUNT(DISTINCT smartcode) INTO v_total_active
  FROM smartcode_allocations
  WHERE week_period = p_week_period AND is_active = true;

  SELECT COALESCE(SUM(points_allocated), 0) INTO v_purchase_points
  FROM smartcode_allocations
  WHERE week_period = p_week_period AND is_active = true AND source = 'purchase';

  SELECT COALESCE(SUM(points_allocated), 0) INTO v_care_club_points
  FROM smartcode_allocations
  WHERE week_period = p_week_period AND is_active = true AND source = 'care_club';

  SELECT COUNT(*) INTO v_ai_entries
  FROM smartcode_allocations
  WHERE week_period = p_week_period AND is_active = true AND mode = 'ai_auto';

  SELECT COUNT(*) INTO v_manual_entries
  FROM smartcode_allocations
  WHERE week_period = p_week_period AND is_active = true AND mode = 'manual';

  SELECT COUNT(DISTINCT user_id) INTO v_unique_users
  FROM smartcode_allocations
  WHERE week_period = p_week_period AND is_active = true;

  INSERT INTO admin_dashboard_stats (
    week_period,
    total_active_smartcodes,
    total_weekly_entries,
    total_points_registered,
    purchase_points,
    care_club_points,
    ai_entries,
    manual_entries,
    unique_participants,
    flagged_entries,
    duplicate_codes_count
  ) VALUES (
    p_week_period,
    v_total_active,
    v_total_entries,
    v_total_points,
    v_purchase_points,
    v_care_club_points,
    v_ai_entries,
    v_manual_entries,
    v_unique_users,
    0,
    0
  )
  ON CONFLICT (week_period) DO UPDATE SET
    total_active_smartcodes = v_total_active,
    total_weekly_entries = v_total_entries,
    total_points_registered = v_total_points,
    purchase_points = v_purchase_points,
    care_club_points = v_care_club_points,
    ai_entries = v_ai_entries,
    manual_entries = v_manual_entries,
    unique_participants = v_unique_users,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL ADMIN SETUP
-- ============================================================================

-- Add an initial super_admin (first user who signed up)
-- This should be replaced with actual user ID in production
DO $$
DECLARE
  v_first_user uuid;
BEGIN
  SELECT id INTO v_first_user FROM profiles ORDER BY created_at LIMIT 1;
  
  IF v_first_user IS NOT NULL THEN
    INSERT INTO admin_roles (user_id, role, permissions)
    VALUES (v_first_user, 'super_admin', '{"all": true}'::jsonb)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END $$;