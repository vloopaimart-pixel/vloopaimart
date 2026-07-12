-- ============================================================
-- Migration 061: Enterprise Admin AI Control Center
-- Phase 33 — Permanent Backbone of the VLOOP Ecosystem
-- ============================================================

-- 1. Add admin_role column to profiles (RBAC quick-reference)
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS admin_role text DEFAULT 'none';

-- 2. Add action_category to admin_action_log for enhanced audit
ALTER TABLE admin_action_log 
  ADD COLUMN IF NOT EXISTS action_category text DEFAULT 'general';

-- 3. Weekly Cycle Control table
CREATE TABLE IF NOT EXISTS weekly_cycle_control (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'closed', 'frozen', 'archived')),
  opened_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  frozen_at timestamptz,
  archived_at timestamptz,
  opened_by uuid,
  closed_by uuid,
  frozen_by uuid,
  archived_by uuid,
  total_participants integer DEFAULT 0,
  total_smartcodes integer DEFAULT 0,
  total_points integer DEFAULT 0,
  reward_pool_amount numeric DEFAULT 0,
  winners_generated boolean DEFAULT false,
  results_published boolean DEFAULT false,
  ai_evaluation_complete boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_cycle_control ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_weekly_cycle_admin" ON weekly_cycle_control FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid() 
    AND admin_roles.is_active = true
  ));

CREATE POLICY "insert_weekly_cycle_admin" ON weekly_cycle_control FOR INSERT
  TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid() 
    AND admin_roles.is_active = true
    AND admin_roles.role IN ('super_admin', 'admin')
  ));

CREATE POLICY "update_weekly_cycle_admin" ON weekly_cycle_control FOR UPDATE
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid() 
    AND admin_roles.is_active = true
    AND admin_roles.role IN ('super_admin', 'admin')
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid() 
    AND admin_roles.is_active = true
    AND admin_roles.role IN ('super_admin', 'admin')
  ));

CREATE POLICY "delete_weekly_cycle_super_admin" ON weekly_cycle_control FOR DELETE
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid() 
    AND admin_roles.is_active = true
    AND admin_roles.role = 'super_admin'
  ));

-- 4. Enhanced Admin Audit Log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action_category text NOT NULL DEFAULT 'general',
  action_type text NOT NULL,
  target_type text,
  target_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  severity text DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_audit_log_admin" ON admin_audit_log FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid() 
    AND admin_roles.is_active = true
  ));

CREATE POLICY "insert_audit_log_admin" ON admin_audit_log FOR INSERT
  TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = auth.uid() 
    AND admin_roles.is_active = true
  ));

-- 5. Add RLS policies for admin_roles management (super_admin only)
CREATE POLICY "select_admin_roles_admin" ON admin_roles FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.is_active = true
    AND ar.role = 'super_admin'
  ));

CREATE POLICY "insert_admin_roles_super" ON admin_roles FOR INSERT
  TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.is_active = true
    AND ar.role = 'super_admin'
  ));

CREATE POLICY "update_admin_roles_super" ON admin_roles FOR UPDATE
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.is_active = true
    AND ar.role = 'super_admin'
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.is_active = true
    AND ar.role = 'super_admin'
  ));

CREATE POLICY "delete_admin_roles_super" ON admin_roles FOR DELETE
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles ar 
    WHERE ar.user_id = auth.uid() 
    AND ar.is_active = true
    AND ar.role = 'super_admin'
  ));

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_weekly_cycle_status ON weekly_cycle_control(status);
CREATE INDEX IF NOT EXISTS idx_weekly_cycle_period ON weekly_cycle_control(week_period);
CREATE INDEX IF NOT EXISTS idx_admin_audit_category ON admin_audit_log(action_category);
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin_id ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_severity ON admin_audit_log(severity);
CREATE INDEX IF NOT EXISTS idx_profiles_admin_role ON profiles(admin_role);

-- 7. Drop existing functions before re-creating
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS is_super_admin(uuid);
DROP FUNCTION IF EXISTS get_or_create_weekly_cycle(text);
DROP FUNCTION IF EXISTS log_admin_action(uuid, text, text, text, uuid, jsonb, text, text);

-- 8. is_admin function (recreated without default param)
CREATE OR REPLACE FUNCTION is_admin(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = p_user_id
    AND is_active = true
    AND role IN ('super_admin', 'admin')
  );
END;
$function$;

-- 9. is_super_admin function
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = p_user_id
    AND is_active = true
    AND role = 'super_admin'
  );
END;
$function$;

-- 10. get_or_create_weekly_cycle function
CREATE OR REPLACE FUNCTION get_or_create_weekly_cycle(p_week_period text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_cycle_id uuid;
BEGIN
  SELECT id INTO v_cycle_id
  FROM weekly_cycle_control
  WHERE week_period = p_week_period;
  
  IF v_cycle_id IS NULL THEN
    INSERT INTO weekly_cycle_control (week_period, status)
    VALUES (p_week_period, 'open')
    RETURNING id INTO v_cycle_id;
  END IF;
  
  RETURN v_cycle_id;
END;
$function$;

-- 11. log_admin_action function
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id uuid,
  p_action_category text,
  p_action_type text,
  p_target_type text DEFAULT NULL,
  p_target_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO admin_audit_log (
    admin_id, action_category, action_type, target_type, target_id,
    details, ip_address, user_agent
  )
  VALUES (
    p_admin_id, p_action_category, p_action_type, p_target_type, p_target_id,
    p_details, p_ip_address, p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$function$;

-- 12. Trigger to update updated_at on weekly_cycle_control
CREATE OR REPLACE FUNCTION update_weekly_cycle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_weekly_cycle_updated ON weekly_cycle_control;
CREATE TRIGGER trg_weekly_cycle_updated
  BEFORE UPDATE ON weekly_cycle_control
  FOR EACH ROW
  EXECUTE FUNCTION update_weekly_cycle_updated_at();
