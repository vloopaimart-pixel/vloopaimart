-- ============================================================
-- Migration 071: Global AI Communication & Engagement Engine
-- Phase 43 — Enterprise AI Communication Layer
-- ============================================================

-- 1. Notification Categories
CREATE TABLE notification_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code text NOT NULL UNIQUE,
  category_name text NOT NULL,
  description text,
  default_priority integer DEFAULT 5,
  default_channels text[] DEFAULT ARRAY['in_app', 'push'],
  is_active boolean DEFAULT true,
  requires_action boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notification_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_cat_auth" ON notification_categories;
CREATE POLICY "select_cat_auth" ON notification_categories FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_cat_admin" ON notification_categories;
CREATE POLICY "crud_cat_admin" ON notification_categories FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert notification categories
INSERT INTO notification_categories (category_code, category_name, default_priority, default_channels, requires_action) VALUES
-- Account
('account_created', 'Account Created', 10, ARRAY['in_app', 'email'], false),
('account_verified', 'Account Verified', 8, ARRAY['in_app'], false),
('profile_updated', 'Profile Updated', 5, ARRAY['in_app'], false),
-- Purchase
('purchase_success', 'Purchase Successful', 8, ARRAY['in_app', 'sms', 'email'], false),
('smartpoints_added', 'SmartPoints Added', 7, ARRAY['in_app', 'push'], false),
-- Care Club
('careclub_contribution', 'Care Club Contribution Received', 8, ARRAY['in_app', 'sms'], false),
-- Wallet
('wallet_credit', 'Wallet Credits Updated', 7, ARRAY['in_app', 'push'], false),
('wallet_debit', 'Wallet Debit', 7, ARRAY['in_app', 'push'], false),
-- SmartCode
('smartcode_registered', 'Weekly SmartCode Registered', 6, ARRAY['in_app'], false),
('weekly_draw_started', 'Weekly Draw Started', 8, ARRAY['in_app', 'push', 'sms'], false),
('weekly_draw_completed', 'Weekly Draw Completed', 9, ARRAY['in_app', 'push', 'sms'], false),
('reward_won', 'Reward Won', 10, ARRAY['in_app', 'push', 'sms', 'email'], true),
-- Claim
('reward_claim_approved', 'Reward Claim Approved', 9, ARRAY['in_app', 'sms'], false),
('reward_claim_rejected', 'Reward Claim Rejected', 8, ARRAY['in_app', 'sms'], false),
-- Order
('order_confirmed', 'Order Confirmed', 8, ARRAY['in_app', 'sms'], false),
('order_shipped', 'Order Shipped', 8, ARRAY['in_app', 'sms', 'push'], false),
('order_delivered', 'Order Delivered', 7, ARRAY['in_app', 'sms', 'push'], false),
('refund_processed', 'Refund Processed', 8, ARRAY['in_app', 'sms'], false),
-- Partner
('partner_approved', 'Partner Approved', 9, ARRAY['in_app', 'sms', 'email'], true),
-- Future
('future_project_update', 'Future Project Updates', 5, ARRAY['in_app', 'email'], false),
-- Reminders
('reminder_payment', 'Pending Payment Reminder', 7, ARRAY['in_app', 'push', 'sms'], true),
('reminder_purchase', 'Incomplete Purchase Reminder', 6, ARRAY['in_app', 'push'], true),
('reminder_careclub', 'Care Club Contribution Reminder', 6, ARRAY['in_app', 'push'], true),
('reminder_smartcode', 'Weekly SmartCode Registration Reminder', 7, ARRAY['in_app', 'push', 'sms'], true),
('reminder_wallet_activation', 'Wallet Activation Reminder', 6, ARRAY['in_app', 'email'], true),
('reminder_claim_deadline', 'Reward Claim Deadline Reminder', 8, ARRAY['in_app', 'push', 'sms'], true),
-- Admin
('admin_customer_alert', 'Customer Alert', 9, ARRAY['in_app', 'push'], false),
('admin_merchant_alert', 'Merchant Alert', 9, ARRAY['in_app', 'push'], false),
('admin_partner_alert', 'Partner Alert', 9, ARRAY['in_app', 'push'], false),
('admin_system_alert', 'System Alert', 10, ARRAY['in_app', 'push', 'sms'], false),
('admin_fraud_alert', 'Fraud Alert', 10, ARRAY['in_app', 'push', 'sms'], false),
('admin_security_alert', 'Security Alert', 10, ARRAY['in_app', 'push', 'sms'], false);

-- 2. Customer Notification Timeline
CREATE TABLE customer_notification_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_id uuid REFERENCES notification_queue(id) ON DELETE SET NULL,
  category_code text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  module_reference text,
  reference_id uuid,
  reference_type text CHECK (reference_type IN ('order', 'payment', 'wallet', 'smartcode', 'careclub', 'reward', 'partner', 'product', 'future_project')),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  is_actionable boolean DEFAULT false,
  action_taken boolean DEFAULT false,
  action_taken_at timestamptz,
  action_type text,
  priority integer DEFAULT 5,
  archived boolean DEFAULT false,
  archived_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customer_notification_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_timeline_own" ON customer_notification_timeline;
CREATE POLICY "select_timeline_own" ON customer_notification_timeline FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_timeline_own" ON customer_notification_timeline;
CREATE POLICY "insert_timeline_own" ON customer_notification_timeline FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_timeline_admin" ON customer_notification_timeline;
CREATE POLICY "crud_timeline_admin" ON customer_notification_timeline FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 3. AI Reminder Engine
CREATE TABLE ai_reminder_engine (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reminder_type text NOT NULL CHECK (reminder_type IN (
    'pending_payment', 'incomplete_purchase', 'incomplete_careclub',
    'smartcode_registration', 'wallet_activation_30d', 'insurance_activation',
    'reward_claim_deadline', 'future_project_registration', 'kyc_pending',
    'profile_incomplete', 'inactive_user', 'wallet_transfer_pending'
  )),
  reference_entity text,
  reference_id uuid,
  trigger_condition jsonb NOT NULL,
  reminder_schedule jsonb NOT NULL,
  max_reminders integer DEFAULT 3,
  reminder_count integer DEFAULT 0,
  last_reminder_at timestamptz,
  next_reminder_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  response_action text,
  response_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_reminder_engine ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_reminder_own" ON ai_reminder_engine;
CREATE POLICY "select_reminder_own" ON ai_reminder_engine FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_reminder_admin" ON ai_reminder_engine;
CREATE POLICY "crud_reminder_admin" ON ai_reminder_engine FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Multi-Language Messages
CREATE TABLE message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code text NOT NULL UNIQUE,
  template_name text NOT NULL,
  category_code text REFERENCES notification_categories(category_code),
  variables text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_templates_auth" ON message_templates;
CREATE POLICY "select_templates_auth" ON message_templates FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_templates_admin" ON message_templates;
CREATE POLICY "crud_templates_admin" ON message_templates FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Message template translations
CREATE TABLE message_template_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES message_templates(id) ON DELETE CASCADE,
  language_code text NOT NULL CHECK (language_code IN ('en', 'ml', 'hi', 'ar', 'ta', 'te', 'kn', 'bn', 'mr', 'gu', 'future')),
  title text NOT NULL,
  message text NOT NULL,
  subtitle text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(template_id, language_code)
);

ALTER TABLE message_template_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_translations_auth" ON message_template_translations;
CREATE POLICY "select_translations_auth" ON message_template_translations FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "crud_translations_admin" ON message_template_translations;
CREATE POLICY "crud_translations_admin" ON message_template_translations FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Supported languages
CREATE TABLE supported_languages (
  code text PRIMARY KEY CHECK (code IN ('en', 'ml', 'hi', 'ar', 'ta', 'te', 'kn', 'bn', 'mr', 'gu', 'future')),
  name text NOT NULL,
  native_name text NOT NULL,
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  voice_support boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE supported_languages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_lang_auth" ON supported_languages;
CREATE POLICY "select_lang_auth" ON supported_languages FOR SELECT
  TO authenticated USING (is_active = true);

INSERT INTO supported_languages (code, name, native_name, is_default, voice_support) VALUES
('en', 'English', 'English', true, true),
('ml', 'Malayalam', 'മലയാളം', false, false),
('hi', 'Hindi', 'हिंदी', false, false),
('ar', 'Arabic', 'العربية', false, false),
('ta', 'Tamil', 'தமிழ்', false, false),
('te', 'Telugu', 'తెలుగు', false, false),
('kn', 'Kannada', 'ಕನ್ನಡ', false, false),
('bn', 'Bengali', 'বাংলা', false, false),
('mr', 'Marathi', 'मराठी', false, false),
('gu', 'Gujarati', 'ગુજરાતી', false, false);

-- 5. AI Customer Assistant Architecture
CREATE TABLE ai_assistant_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_type text NOT NULL CHECK (session_type IN ('voice', 'chat', 'faq', 'help', 'guided')),
  language_code text DEFAULT 'en' REFERENCES supported_languages(code),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'transferred')),
  start_context jsonb DEFAULT '{}'::jsonb,
  conversation_history jsonb DEFAULT '[]'::jsonb,
  intent_detected text,
  entities_extracted jsonb DEFAULT '{}'::jsonb,
  resolution_status text CHECK (resolution_status IN ('resolved', 'unresolved', 'escalated', 'pending')),
  resolution_notes text,
  satisfaction_rating integer CHECK (satisfaction_rating BETWEEN 1 AND 5),
  feedback text,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_assistant_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_assist_own" ON ai_assistant_sessions;
CREATE POLICY "select_assist_own" ON ai_assistant_sessions FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_assist_admin" ON ai_assistant_sessions;
CREATE POLICY "crud_assist_admin" ON ai_assistant_sessions FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- AI Assistant intents
CREATE TABLE ai_assistant_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_code text NOT NULL UNIQUE,
  intent_name text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'smartcode_help', 'marketplace_help', 'careclub_help',
    'wallet_help', 'insurance_help', 'partner_help',
    'order_tracking', 'refund_help', 'account_help', 'future_project_guide'
  )),
  keywords jsonb DEFAULT '[]'::jsonb,
  training_phrases jsonb DEFAULT '[]'::jsonb,
  response_templates jsonb DEFAULT '{}'::jsonb,
  required_entities text[] DEFAULT ARRAY[]::text[],
  followup_intents text[] DEFAULT ARRAY[]::text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_assistant_intents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_intents_auth" ON ai_assistant_intents;
CREATE POLICY "select_intents_auth" ON ai_assistant_intents FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_intents_admin" ON ai_assistant_intents;
CREATE POLICY "crud_intents_admin" ON ai_assistant_intents FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert assistant intents
INSERT INTO ai_assistant_intents (intent_code, intent_name, category, keywords) VALUES
('smartcode_what', 'What is SmartCode', 'smartcode_help', '["smartcode", "what", "how works"]'::jsonb),
('smartcode_enter', 'How to Enter SmartCode', 'smartcode_help', '["enter", "register", "create smartcode"]'::jsonb),
('smartcode_points', 'How Points Work', 'smartcode_help', '["points", "earn", "conversion"]'::jsonb),
('smartcode_winners', 'Winner Selection', 'smartcode_help', '["winner", "draw", "reward"]'::jsonb),
('marketplace_browse', 'Browse Products', 'marketplace_help', '["products", "browse", "search"]'::jsonb),
('marketplace_order', 'Place Order', 'marketplace_help', '["order", "buy", "purchase"]'::jsonb),
('careclub_join', 'Join Care Club', 'careclub_help', '["join", "care club", "contribute"]'::jsonb),
('careclub_points', 'Care Club Points', 'careclub_help', '["care club", "points", "earn more"]'::jsonb),
('wallet_balance', 'Check Wallet Balance', 'wallet_help', '["wallet", "balance", "money"]'::jsonb),
('wallet_transfer', 'Wallet Transfer', 'wallet_help', '["transfer", "wallet 1", "wallet 2"]'::jsonb),
('insurance_info', 'Insurance Information', 'insurance_help', '["insurance", "protection", "coverage"]'::jsonb),
('partner_apply', 'Partner Application', 'partner_help', '["partner", "apply", "merchant"]'::jsonb),
('order_track', 'Track Order', 'order_tracking', '["track", "order", "delivery"]'::jsonb),
('refund_request', 'Request Refund', 'refund_help', '["refund", "return", "money back"]'::jsonb),
('account_update', 'Update Profile', 'account_help', '["profile", "update", "edit"]'::jsonb),
('future_projects', 'Future Projects', 'future_project_guide', '["future", "housing", "ev", "healthcare"]'::jsonb);

-- 6. Voice AI Architecture
CREATE TABLE voice_ai_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  language_code text DEFAULT 'en' REFERENCES supported_languages(code),
  session_type text NOT NULL CHECK (session_type IN (
    'smartcode_entry', 'marketplace_search', 'order_tracking',
    'careclub_registration', 'wallet_operation', 'general_query'
  )),
  audio_url text,
  transcript_raw text,
  transcript_normalized text,
  intent_detected text,
  confidence_score numeric,
  entities jsonb DEFAULT '{}'::jsonb,
  action_performed text,
  action_result jsonb DEFAULT '{}'::jsonb,
  processing_status text DEFAULT 'completed' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  response_text text,
  response_audio_url text,
  duration_seconds integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voice_ai_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_voice_own" ON voice_ai_sessions;
CREATE POLICY "select_voice_own" ON voice_ai_sessions FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_voice_admin" ON voice_ai_sessions;
CREATE POLICY "crud_voice_admin" ON voice_ai_sessions FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. OCR Communication
CREATE TABLE ocr_communication_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  smartcode_entry_id uuid,
  ocr_status text NOT NULL CHECK (ocr_status IN ('uploaded', 'processing', 'verified', 'failed', 'manual_review')),
  receipt_url text,
  receipt_uploaded_at timestamptz,
  ocr_started_at timestamptz,
  ocr_completed_at timestamptz,
  extracted_data jsonb DEFAULT '{}'::jsonb,
  detected_smartcode text,
  detected_points integer,
  confidence_score numeric,
  verification_status text CHECK (verification_status IN ('verified', 'failed', 'requires_review', 'fraud_detected')),
  fraud_flags jsonb DEFAULT '[]'::jsonb,
  requires_manual_review boolean DEFAULT false,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  review_notes text,
  notification_sent boolean DEFAULT false,
  notification_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ocr_communication_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_ocr_own" ON ocr_communication_log;
CREATE POLICY "select_ocr_own" ON ocr_communication_log FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_ocr_admin" ON ocr_communication_log;
CREATE POLICY "crud_ocr_admin" ON ocr_communication_log FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Admin Communication Center
CREATE TABLE admin_communication_center (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL CHECK (alert_type IN ('customer', 'merchant', 'partner', 'system', 'fraud', 'security', 'weekly_report')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  message text NOT NULL,
  reference_entity text,
  reference_id uuid,
  affected_users integer DEFAULT 0,
  broadcast_channels text[] DEFAULT ARRAY['in_app']::text[],
  is_active boolean DEFAULT true,
  scheduled_at timestamptz,
  sent_at timestamptz,
  expires_at timestamptz,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_communication_center ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_admin_alerts_admin" ON admin_communication_center;
CREATE POLICY "select_admin_alerts_admin" ON admin_communication_center FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "crud_admin_alerts_admin" ON admin_communication_center;
CREATE POLICY "crud_admin_alerts_admin" ON admin_communication_center FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Weekly AI Communication Reports
CREATE TABLE weekly_communication_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_period text NOT NULL,
  total_notifications_sent integer DEFAULT 0,
  total_reminders_sent integer DEFAULT 0,
  total_voice_sessions integer DEFAULT 0,
  total_ocr_processed integer DEFAULT 0,
  total_assistant_sessions integer DEFAULT 0,
  notifications_by_channel jsonb DEFAULT '{}'::jsonb,
  notifications_by_category jsonb DEFAULT '{}'::jsonb,
  reminder_completion_rate numeric DEFAULT 0,
  assistant_satisfaction_avg numeric,
  voice_success_rate numeric DEFAULT 0,
  ocr_success_rate numeric DEFAULT 0,
  peak_usage_hours jsonb DEFAULT '[]'::jsonb,
  language_distribution jsonb DEFAULT '{}'::jsonb,
  generated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(week_period)
);

ALTER TABLE weekly_communication_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_weekly_admin" ON weekly_communication_reports;
CREATE POLICY "crud_weekly_admin" ON weekly_communication_reports FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Notification Preferences
CREATE TABLE user_notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_code text NOT NULL REFERENCES notification_categories(category_code),
  in_app_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT true,
  whatsapp_enabled boolean DEFAULT false,
  quiet_hours_start time DEFAULT '22:00'::time,
  quiet_hours_end time DEFAULT '08:00'::time,
  language_code text DEFAULT 'en' REFERENCES supported_languages(code),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_code)
);

ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_pref_own" ON user_notification_preferences;
CREATE POLICY "select_pref_own" ON user_notification_preferences FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "update_pref_own" ON user_notification_preferences;
CREATE POLICY "update_pref_own" ON user_notification_preferences FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_pref_own" ON user_notification_preferences;
CREATE POLICY "insert_pref_own" ON user_notification_preferences FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- 11. Indexes
CREATE INDEX IF NOT EXISTS idx_timeline_user ON customer_notification_timeline(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_created ON customer_notification_timeline(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_unread ON customer_notification_timeline(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_timeline_category ON customer_notification_timeline(category_code);

CREATE INDEX IF NOT EXISTS idx_reminder_user ON ai_reminder_engine(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_next ON ai_reminder_engine(next_reminder_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_reminder_type ON ai_reminder_engine(reminder_type);

CREATE INDEX IF NOT EXISTS idx_notifqueue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notifqueue_user ON notification_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_notifqueue_scheduled ON notification_queue(scheduled_at) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_assistant_user ON ai_assistant_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assistant_status ON ai_assistant_sessions(status);
CREATE INDEX IF NOT EXISTS idx_assistant_type ON ai_assistant_sessions(session_type);

CREATE INDEX IF NOT EXISTS idx_voice_user ON voice_ai_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_type ON voice_ai_sessions(session_type);

CREATE INDEX IF NOT EXISTS idx_ocr_user ON ocr_communication_log(user_id);
CREATE INDEX IF NOT EXISTS idx_ocr_status ON ocr_communication_log(ocr_status);

CREATE INDEX IF NOT EXISTS idx_admincomm_type ON admin_communication_center(alert_type);
CREATE INDEX IF NOT EXISTS idx_admincomm_active ON admin_communication_center(is_active) WHERE is_active = true;

-- 12. Triggers
DROP TRIGGER IF EXISTS trg_reminder_updated ON ai_reminder_engine;
CREATE TRIGGER trg_reminder_updated BEFORE UPDATE ON ai_reminder_engine
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_timeline_updated ON customer_notification_timeline;
CREATE TRIGGER trg_timeline_updated BEFORE UPDATE ON customer_notification_timeline
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_templates_updated ON message_templates;
CREATE TRIGGER trg_templates_updated BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_translations_updated ON message_template_translations;
CREATE TRIGGER trg_translations_updated BEFORE UPDATE ON message_template_translations
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_ocr_updated ON ocr_communication_log;
CREATE TRIGGER trg_ocr_updated BEFORE UPDATE ON ocr_communication_log
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_pref_updated ON user_notification_preferences;
CREATE TRIGGER trg_pref_updated BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 13. Functions
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM customer_notification_timeline
  WHERE user_id = p_user_id AND is_read = false AND archived = false;

  RETURN v_count;
END;
$function$;

CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_category_code text,
  p_title text,
  p_message text,
  p_module_reference text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL,
  p_reference_type text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  v_notification_id uuid;
  v_category_priority integer;
  v_is_actionable boolean;
BEGIN
  SELECT default_priority, requires_action INTO v_category_priority, v_is_actionable
  FROM notification_categories WHERE category_code = p_category_code;

  INSERT INTO customer_notification_timeline (
    user_id, category_code, title, message,
    module_reference, reference_id, reference_type,
    priority, is_actionable, metadata
  )
  VALUES (
    p_user_id, p_category_code, p_title, p_message,
    p_module_reference, p_reference_id, p_reference_type,
    COALESCE(v_category_priority, 5), COALESCE(v_is_actionable, false), p_metadata
  ) RETURNING id INTO v_notification_id;

  INSERT INTO notification_queue (user_id, notification_type, channel, title, message, data, priority)
  VALUES (p_user_id, p_category_code, 'in_app', p_title, p_message, p_metadata, COALESCE(v_category_priority, 5));

  RETURN v_notification_id;
END;
$function$;

CREATE OR REPLACE FUNCTION mark_notifications_read(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE customer_notification_timeline
  SET is_read = true, read_at = now()
  WHERE user_id = p_user_id AND is_read = false;
END;
$function$;

CREATE OR REPLACE FUNCTION archive_old_notifications()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE customer_notification_timeline
  SET archived = true, archived_at = now()
  WHERE created_at < now() - interval '30 days' AND is_read = true AND archived = false;
END;
$function$;

CREATE OR REPLACE FUNCTION create_reminder(
  p_user_id uuid,
  p_reminder_type text,
  p_reference_entity text,
  p_reference_id uuid,
  p_schedule jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $function$
DECLARE
  v_reminder_id uuid;
BEGIN
  INSERT INTO ai_reminder_engine (
    user_id, reminder_type, reference_entity, reference_id,
    trigger_condition, reminder_schedule, next_reminder_at
  )
  VALUES (
    p_user_id, p_reminder_type, p_reference_entity, p_reference_id,
    jsonb_build_object('created', now()), p_schedule,
    (p_schedule->>'first_reminder')::timestamptz
  ) RETURNING id INTO v_reminder_id;

  RETURN v_reminder_id;
END;
$function$;

CREATE OR REPLACE FUNCTION get_communication_stats()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'notifications_today', (SELECT COUNT(*) FROM customer_notification_timeline WHERE created_at::date = current_date),
    'notifications_unread', (SELECT COUNT(*) FROM customer_notification_timeline WHERE is_read = false),
    'reminders_active', (SELECT COUNT(*) FROM ai_reminder_engine WHERE status = 'active'),
    'assistant_sessions_today', (SELECT COUNT(*) FROM ai_assistant_sessions WHERE started_at::date = current_date),
    'voice_sessions_today', (SELECT COUNT(*) FROM voice_ai_sessions WHERE created_at::date = current_date),
    'ocr_pending', (SELECT COUNT(*) FROM ocr_communication_log WHERE ocr_status = 'processing'),
    'language_distribution', (SELECT jsonb_object_agg(language_code, cnt) FROM (
      SELECT language_code, COUNT(*) as cnt FROM ai_assistant_sessions GROUP BY language_code
    ) l)
  ) INTO v_stats;

  RETURN v_stats;
END;
$function$;
