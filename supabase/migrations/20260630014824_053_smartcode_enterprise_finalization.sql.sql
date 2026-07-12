-- VLOOP Enterprise SmartCode Engine - Phase 25 Finalization
-- Offline Entry Support & Batch Processing Tables

-- ============================================================================
-- OFFLINE ENTRIES (Paper-based entries pending processing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS offline_smartcode_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_text text NOT NULL,
  user_id uuid REFERENCES profiles(id),
  source text NOT NULL DEFAULT 'paper' CHECK (source IN ('paper', 'sms', 'whatsapp', 'web_form')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'rejected')),
  parsed_entries jsonb DEFAULT '[]',
  processed_entries_count integer DEFAULT 0,
  rejected_entries jsonb DEFAULT '[]',
  total_points integer DEFAULT 0,
  notes text,
  admin_notes text,
  processed_by uuid REFERENCES profiles(id),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_offline_entries_user ON offline_smartcode_entries(user_id);
CREATE INDEX idx_offline_entries_status ON offline_smartcode_entries(status);
CREATE INDEX idx_offline_entries_created ON offline_smartcode_entries(created_at);

-- ============================================================================
-- BATCH PROCESSING LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartcode_batch_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  batch_type text NOT NULL CHECK (batch_type IN ('ai_auto', 'manual', 'offline', 'bulk_import')),
  total_entries integer NOT NULL,
  processed_entries integer DEFAULT 0,
  failed_entries integer DEFAULT 0,
  total_points integer NOT NULL,
  duration_ms integer,
  status text NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed', 'failed', 'partial')),
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX idx_batch_log_user ON smartcode_batch_log(user_id);
CREATE INDEX idx_batch_log_status ON smartcode_batch_log(status);
CREATE INDEX idx_batch_log_created ON smartcode_batch_log(created_at);

-- ============================================================================
-- WEEKLY SMARTCODE SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS weekly_smartcode_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draw_complete')),
  draw_datetime timestamptz,
  max_entries_per_user integer DEFAULT 5000,
  ai_optimization_enabled boolean DEFAULT true,
  allow_manual_mode boolean DEFAULT true,
  allow_offline_entry boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_weekly_settings_week ON weekly_smartcode_settings(week_period);

-- ============================================================================
-- SMARTCODE AUDIT LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartcode_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL CHECK (action IN ('allocate', 'remove', 'update', 'batch_import', 'ai_distribute')),
  smartcode text,
  points_before integer,
  points_after integer,
  source text,
  week_period text,
  metadata jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_audit_user ON smartcode_audit_log(user_id);
CREATE INDEX idx_audit_action ON smartcode_audit_log(action);
CREATE INDEX idx_audit_created ON smartcode_audit_log(created_at);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE offline_smartcode_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartcode_batch_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_smartcode_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartcode_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_offline_entries_all" ON offline_smartcode_entries FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_batch_log_all" ON smartcode_batch_log FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_audit_read" ON smartcode_audit_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "audit_insert" ON smartcode_audit_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "settings_read" ON weekly_smartcode_settings FOR SELECT TO authenticated USING (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to get weekly settings with defaults
CREATE OR REPLACE FUNCTION get_weekly_settings(p_week_period text)
RETURNS jsonb AS $$
DECLARE
  v_settings jsonb;
BEGIN
  SELECT row_to_json(s.*)::jsonb INTO v_settings
  FROM weekly_smartcode_settings s
  WHERE s.week_period = p_week_period;
  
  IF v_settings IS NULL THEN
    -- Return defaults
    v_settings = jsonb_build_object(
      'week_period', p_week_period,
      'status', 'open',
      'max_entries_per_user', 5000,
      'ai_optimization_enabled', true,
      'allow_manual_mode', true,
      'allow_offline_entry', true
    );
  END IF;
  
  RETURN v_settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit entries
CREATE OR REPLACE FUNCTION log_smartcode_action(
  p_user_id uuid,
  p_action text,
  p_smartcode text DEFAULT NULL,
  p_points_before integer DEFAULT NULL,
  p_points_after integer DEFAULT NULL,
  p_source text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO smartcode_audit_log (
    user_id, action, smartcode, points_before, points_after, source, week_period, metadata
  ) VALUES (
    p_user_id, p_action, p_smartcode, p_points_before, p_points_after, p_source,
    to_char(CURRENT_DATE, 'IYYY-IW'), p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
