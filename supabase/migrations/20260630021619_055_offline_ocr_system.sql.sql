-- VLOOP Offline SmartCode OCR System - Phase 27
-- OCR Audit and Fraud Detection Tables

-- ============================================================================
-- OCR UPLOAD AUDIT
-- ============================================================================

CREATE TABLE IF NOT EXISTS ocr_upload_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  image_hash text NOT NULL,
  image_size_bytes integer NOT NULL,
  processing_time_ms integer NOT NULL,
  ocr_provider text DEFAULT 'simulated',
  raw_text_extracted text,
  confidence_score numeric DEFAULT 0,
  entries_detected integer DEFAULT 0,
  valid_entries integer DEFAULT 0,
  status text NOT NULL DEFAULT 'processed' CHECK (status IN ('processed', 'rejected', 'duplicate', 'fraud')),
  rejection_reasons jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_ocr_audit_user ON ocr_upload_audit(user_id);
CREATE INDEX idx_ocr_audit_status ON ocr_upload_audit(status);
CREATE INDEX idx_ocr_audit_hash ON ocr_upload_audit(image_hash);
CREATE INDEX idx_ocr_audit_created ON ocr_upload_audit(created_at);

-- ============================================================================
-- FRAUD DETECTION LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartcode_fraud_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  detection_type text NOT NULL CHECK (detection_type IN ('duplicate_upload', 'suspicious_pattern', 'manipulated_image', 'sequential_codes', 'same_code_spam')),
  confidence_score numeric NOT NULL DEFAULT 0,
  details jsonb DEFAULT '{}',
  action_taken text CHECK (action_taken IN ('flagged', 'rejected', 'approved_with_warning', 'manual_review')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_fraud_log_user ON smartcode_fraud_log(user_id);
CREATE INDEX idx_fraud_log_type ON smartcode_fraud_log(detection_type);
CREATE INDEX idx_fraud_log_created ON smartcode_fraud_log(created_at);

-- ============================================================================
-- OCR PROCESSED IMAGES (for duplicate detection)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ocr_processed_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  image_hash text NOT NULL,
  week_period text NOT NULL,
  processed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, image_hash, week_period)
);
CREATE INDEX idx_processed_images_hash ON ocr_processed_images(image_hash);
CREATE INDEX idx_processed_images_week ON ocr_processed_images(week_period);

-- ============================================================================
-- SMARTCODE ENTRY METHOD TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS smartcode_entry_method_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  week_period text NOT NULL,
  entry_method text NOT NULL CHECK (entry_method IN ('digital_ai', 'digital_manual', 'manual_text', 'offline_ocr')),
  total_entries integer NOT NULL DEFAULT 0,
  total_points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_entry_method_user ON smartcode_entry_method_log(user_id);
CREATE INDEX idx_entry_method_week ON smartcode_entry_method_log(week_period);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE ocr_upload_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartcode_fraud_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocr_processed_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE smartcode_entry_method_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_ocr_audit_all" ON ocr_upload_audit FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_fraud_log_read" ON smartcode_fraud_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "fraud_log_insert" ON smartcode_fraud_log FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "user_processed_images_all" ON ocr_processed_images FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_entry_method_all" ON smartcode_entry_method_log FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check for duplicate uploads
CREATE OR REPLACE FUNCTION check_duplicate_ocr_upload(
  p_user_id uuid,
  p_image_hash text,
  p_week_period text
)
RETURNS boolean AS $$
DECLARE
  v_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM ocr_processed_images
    WHERE user_id = p_user_id
    AND image_hash = p_image_hash
    AND week_period = p_week_period
  ) INTO v_exists;
  
  RETURN v_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log OCR processing
CREATE OR REPLACE FUNCTION log_ocr_processing(
  p_user_id uuid,
  p_image_hash text,
  p_image_size integer,
  p_processing_time integer,
  p_raw_text text,
  p_confidence numeric,
  p_entries_detected integer,
  p_valid_entries integer,
  p_status text,
  p_rejection_reasons jsonb
)
RETURNS uuid AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO ocr_upload_audit (
    user_id,
    image_hash,
    image_size_bytes,
    processing_time_ms,
    raw_text_extracted,
    confidence_score,
    entries_detected,
    valid_entries,
    status,
    rejection_reasons
  ) VALUES (
    p_user_id,
    p_image_hash,
    p_image_size,
    p_processing_time,
    p_raw_text,
    p_confidence,
    p_entries_detected,
    p_valid_entries,
    p_status,
    p_rejection_reasons
  ) RETURNING id INTO v_id;
  
  -- Mark image as processed
  INSERT INTO ocr_processed_images (user_id, image_hash, week_period)
  VALUES (p_user_id, p_image_hash, getCurrentWeekPeriod())
  ON CONFLICT DO NOTHING;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function for current week
CREATE OR REPLACE FUNCTION getCurrentWeekPeriod()
RETURNS text AS $$
DECLARE
  v_week text;
BEGIN
  SELECT to_char(CURRENT_DATE, 'IYYY-IW') INTO v_week;
  RETURN v_week;
END;
$$ LANGUAGE plpgsql;

-- Function to log entry method
CREATE OR REPLACE FUNCTION log_entry_method(
  p_user_id uuid,
  p_method text,
  p_entries integer,
  p_points integer
)
RETURNS void AS $$
BEGIN
  INSERT INTO smartcode_entry_method_log (
    user_id,
    week_period,
    entry_method,
    total_entries,
    total_points
  ) VALUES (
    p_user_id,
    getCurrentWeekPeriod(),
    p_method,
    p_entries,
    p_points
  )
  ON CONFLICT (user_id, week_period) 
  WHERE entry_method IS NOT NULL
  DO UPDATE SET
    total_entries = p_entries,
    total_points = p_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
