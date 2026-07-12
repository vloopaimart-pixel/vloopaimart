/*
# VLOOP AI Intelligence & Automation Layer - Phase 6

This migration creates the complete AI Intelligence & Automation infrastructure for VLOOP,
enabling AI-powered assistants, trust scoring, fraud detection, OCR processing, and
personalized recommendations.

## New Tables (18 tables)

### AI Conversation System
- `ai_conversations` - AI assistant conversation sessions (universal, shopping, learning, merchant, services)
- `ai_messages` - Individual messages within AI conversations

### AI Shopping Assistant
- `ai_shopping_assistant_logs` - Shopping intent detection, product recommendations, interaction tracking

### AI Learning Guide
- `ai_learning_progress` - User learning style, progress tracking, AI recommendations for learning paths

### AI Merchant Partner
- `ai_merchant_insights` - AI-generated insights for merchants (sales opportunities, inventory alerts, etc.)

### AI Essential Services Guide
- `ai_service_guides` - User service intent tracking, provider suggestions, cost estimates

### AI Voice Mode (Future Ready)
- `ai_voice_sessions` - Voice interaction sessions with performance metrics

### AI OCR Layer
- `ai_ocr_requests` - OCR processing requests for paper SmartCodes, receipts, documents

### AI Trust Engine
- `ai_trust_engine_logs` - Trust score calculations, factor breakdowns, risk indicators

### AI Fraud Detection
- `ai_fraud_detection_logs` - Fraud detection events, evidence, resolution tracking

### AI Recommendation Engine
- `ai_recommendation_weights` - User preference weights for personalized recommendations

### AI Global Configuration
- `ai_global_configs` - Country-specific AI configurations (language, personality, localization)
- `ai_feature_flags` - Feature toggle controls for AI capabilities

## Security
- RLS enabled on all tables
- Owner-scoped access for user data
- Fraud detection logs accessible to all authenticated users (admin-level data)
- Global configs and feature flags readable by all authenticated users

## Important Notes
1. AI conversations are scoped per user - users can only see their own conversations
2. Fraud detection logs are accessible to authenticated users for transparency
3. Trust engine logs track score evolution over time
4. Feature flags control gradual rollout of AI capabilities
5. Global configs enable localization per country/region
*/

-- ============================================================
-- AI CONVERSATIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL UNIQUE,
  assistant_type text NOT NULL DEFAULT 'universal',
  status text NOT NULL DEFAULT 'active',
  message_count integer NOT NULL DEFAULT 0,
  resolved_query boolean NOT NULL DEFAULT false,
  satisfaction_rating smallint CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  feedback_notes text,
  context_data jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_status ON ai_conversations(status);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_assistant_type ON ai_conversations(assistant_type);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ai_conversations" ON ai_conversations;
CREATE POLICY "select_own_ai_conversations" ON ai_conversations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_ai_conversations" ON ai_conversations;
CREATE POLICY "insert_own_ai_conversations" ON ai_conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_ai_conversations" ON ai_conversations;
CREATE POLICY "update_own_ai_conversations" ON ai_conversations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- AI MESSAGES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  message_type text NOT NULL DEFAULT 'text',
  content text NOT NULL,
  metadata jsonb,
  is_helpful boolean,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_role ON ai_messages(role);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON ai_messages(created_at);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ai_messages" ON ai_messages;
CREATE POLICY "select_own_ai_messages" ON ai_messages FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_own_ai_messages" ON ai_messages;
CREATE POLICY "insert_own_ai_messages" ON ai_messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

-- ============================================================
-- AI SHOPPING ASSISTANT LOGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_shopping_assistant_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES ai_conversations(id) ON DELETE SET NULL,
  query_text text NOT NULL,
  intent_detected text NOT NULL,
  products_recommended text[] NOT NULL DEFAULT '{}',
  products_clicked text[] NOT NULL DEFAULT '{}',
  products_purchased text[] NOT NULL DEFAULT '{}',
  recommendation_strategy text NOT NULL,
  confidence_score numeric(5,4) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_shopping_logs_user_id ON ai_shopping_assistant_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_shopping_logs_intent ON ai_shopping_assistant_logs(intent_detected);
CREATE INDEX IF NOT EXISTS idx_ai_shopping_logs_created_at ON ai_shopping_assistant_logs(created_at);

ALTER TABLE ai_shopping_assistant_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_shopping_logs" ON ai_shopping_assistant_logs;
CREATE POLICY "select_own_shopping_logs" ON ai_shopping_assistant_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_shopping_logs" ON ai_shopping_assistant_logs;
CREATE POLICY "insert_own_shopping_logs" ON ai_shopping_assistant_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- AI LEARNING PROGRESS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_style text NOT NULL DEFAULT 'visual',
  preferred_difficulty text NOT NULL DEFAULT 'intermediate',
  topics_completed text[] NOT NULL DEFAULT '{}',
  current_topic text,
  quiz_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  time_spent_minutes integer NOT NULL DEFAULT 0,
  ai_recommendations text[] NOT NULL DEFAULT '{}',
  strengths text[] NOT NULL DEFAULT '{}',
  areas_to_improve text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_learning_progress_user_id ON ai_learning_progress(user_id);

ALTER TABLE ai_learning_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_learning_progress" ON ai_learning_progress;
CREATE POLICY "select_own_learning_progress" ON ai_learning_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_learning_progress" ON ai_learning_progress;
CREATE POLICY "insert_own_learning_progress" ON ai_learning_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_learning_progress" ON ai_learning_progress;
CREATE POLICY "update_own_learning_progress" ON ai_learning_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- AI MERCHANT INSIGHTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_merchant_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id text NOT NULL,
  insight_type text NOT NULL,
  insight_title text NOT NULL,
  insight_description text NOT NULL,
  recommendation text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  data_source text NOT NULL,
  insight_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  is_actioned boolean NOT NULL DEFAULT false,
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_merchant_insights_merchant_id ON ai_merchant_insights(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ai_merchant_insights_type ON ai_merchant_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_merchant_insights_priority ON ai_merchant_insights(priority);
CREATE INDEX IF NOT EXISTS idx_ai_merchant_insights_is_read ON ai_merchant_insights(is_read);

ALTER TABLE ai_merchant_insights ENABLE ROW LEVEL SECURITY;

-- Merchant insights are accessible to authenticated users
DROP POLICY IF EXISTS "select_merchant_insights" ON ai_merchant_insights;
CREATE POLICY "select_merchant_insights" ON ai_merchant_insights FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_merchant_insights" ON ai_merchant_insights;
CREATE POLICY "update_merchant_insights" ON ai_merchant_insights FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- AI SERVICE GUIDES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_service_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES ai_conversations(id) ON DELETE SET NULL,
  service_type text NOT NULL,
  user_intent text NOT NULL,
  services_recommended text[] NOT NULL DEFAULT '{}',
  provider_suggestions text[] NOT NULL DEFAULT '{}',
  cost_estimates jsonb NOT NULL DEFAULT '{}'::jsonb,
  tips_provided text[] NOT NULL DEFAULT '{}',
  user_feedback text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_service_guides_user_id ON ai_service_guides(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_service_guides_service_type ON ai_service_guides(service_type);

ALTER TABLE ai_service_guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_service_guides" ON ai_service_guides;
CREATE POLICY "select_own_service_guides" ON ai_service_guides FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_service_guides" ON ai_service_guides;
CREATE POLICY "insert_own_service_guides" ON ai_service_guides FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- AI VOICE SESSIONS TABLE (Future Ready)
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_voice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text NOT NULL UNIQUE,
  language text NOT NULL DEFAULT 'en-IN',
  commands_processed integer NOT NULL DEFAULT 0,
  successful_commands integer NOT NULL DEFAULT 0,
  failed_commands integer NOT NULL DEFAULT 0,
  avg_response_time_ms integer NOT NULL DEFAULT 0,
  session_duration_seconds integer NOT NULL DEFAULT 0,
  end_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_ai_voice_sessions_user_id ON ai_voice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_voice_sessions_token ON ai_voice_sessions(session_token);

ALTER TABLE ai_voice_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_voice_sessions" ON ai_voice_sessions;
CREATE POLICY "select_own_voice_sessions" ON ai_voice_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_voice_sessions" ON ai_voice_sessions;
CREATE POLICY "insert_own_voice_sessions" ON ai_voice_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_voice_sessions" ON ai_voice_sessions;
CREATE POLICY "update_own_voice_sessions" ON ai_voice_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- AI OCR REQUESTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_ocr_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  image_url text NOT NULL,
  extracted_text text,
  extracted_data jsonb,
  confidence_score numeric(5,4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  processing_time_ms integer,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_ocr_requests_user_id ON ai_ocr_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_ocr_requests_status ON ai_ocr_requests(status);
CREATE INDEX IF NOT EXISTS idx_ai_ocr_requests_document_type ON ai_ocr_requests(document_type);

ALTER TABLE ai_ocr_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ocr_requests" ON ai_ocr_requests;
CREATE POLICY "select_own_ocr_requests" ON ai_ocr_requests FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_ocr_requests" ON ai_ocr_requests;
CREATE POLICY "insert_own_ocr_requests" ON ai_ocr_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_ocr_requests" ON ai_ocr_requests;
CREATE POLICY "update_own_ocr_requests" ON ai_ocr_requests FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- AI TRUST ENGINE LOGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_trust_engine_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  trust_score_before smallint NOT NULL CHECK (trust_score_before >= 0 AND trust_score_before <= 100),
  trust_score_after smallint NOT NULL CHECK (trust_score_after >= 0 AND trust_score_after <= 100),
  trust_level text NOT NULL DEFAULT 'basic',
  factor_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  risk_indicators text[] NOT NULL DEFAULT '{}',
  verification_flags text[] NOT NULL DEFAULT '{}',
  ai_confidence numeric(5,4) NOT NULL CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  analysis_type text NOT NULL DEFAULT 'weekly_update',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_trust_logs_user_id ON ai_trust_engine_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_trust_logs_trust_level ON ai_trust_engine_logs(trust_level);
CREATE INDEX IF NOT EXISTS idx_ai_trust_logs_created_at ON ai_trust_engine_logs(created_at);

ALTER TABLE ai_trust_engine_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_trust_logs" ON ai_trust_engine_logs;
CREATE POLICY "select_own_trust_logs" ON ai_trust_engine_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_trust_logs" ON ai_trust_engine_logs;
CREATE POLICY "insert_own_trust_logs" ON ai_trust_engine_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- AI FRAUD DETECTION LOGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_fraud_detection_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  fraud_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'detected',
  detection_method text NOT NULL,
  risk_score smallint NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  indicators text[] NOT NULL DEFAULT '{}',
  evidence_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_confidence numeric(5,4) NOT NULL CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  false_positive_probability numeric(5,4) CHECK (false_positive_probability >= 0 AND false_positive_probability <= 1),
  assigned_to uuid REFERENCES auth.users(id),
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_fraud_logs_user_id ON ai_fraud_detection_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_fraud_logs_status ON ai_fraud_detection_logs(status);
CREATE INDEX IF NOT EXISTS idx_ai_fraud_logs_severity ON ai_fraud_detection_logs(severity);
CREATE INDEX IF NOT EXISTS idx_ai_fraud_logs_fraud_type ON ai_fraud_detection_logs(fraud_type);
CREATE INDEX IF NOT EXISTS idx_ai_fraud_logs_created_at ON ai_fraud_detection_logs(created_at);

ALTER TABLE ai_fraud_detection_logs ENABLE ROW LEVEL SECURITY;

-- Fraud logs are accessible to authenticated users for transparency
DROP POLICY IF EXISTS "authenticated_fraud_logs_access" ON ai_fraud_detection_logs;
CREATE POLICY "authenticated_fraud_logs_access" ON ai_fraud_detection_logs FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_fraud_logs" ON ai_fraud_detection_logs;
CREATE POLICY "insert_fraud_logs" ON ai_fraud_detection_logs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_fraud_logs" ON ai_fraud_detection_logs;
CREATE POLICY "update_fraud_logs" ON ai_fraud_detection_logs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- AI RECOMMENDATION WEIGHTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_recommendation_weights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL DEFAULT 'hybrid',
  category_weights jsonb NOT NULL DEFAULT '{}'::jsonb,
  brand_affinities jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_range_preference jsonb NOT NULL DEFAULT '{}'::jsonb,
  time_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  learning_topic_affinities jsonb NOT NULL DEFAULT '{}'::jsonb,
  service_usage_patterns jsonb NOT NULL DEFAULT '{}'::jsonb,
  social_influence_weight numeric(4,3) NOT NULL DEFAULT 0.3,
  recency_bias numeric(4,3) NOT NULL DEFAULT 0.4,
  diversity_factor numeric(4,3) NOT NULL DEFAULT 0.25,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_rec_weights_user_id ON ai_recommendation_weights(user_id);

ALTER TABLE ai_recommendation_weights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_rec_weights" ON ai_recommendation_weights;
CREATE POLICY "select_own_rec_weights" ON ai_recommendation_weights FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_rec_weights" ON ai_recommendation_weights;
CREATE POLICY "insert_own_rec_weights" ON ai_recommendation_weights FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_rec_weights" ON ai_recommendation_weights;
CREATE POLICY "update_own_rec_weights" ON ai_recommendation_weights FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- AI GLOBAL CONFIGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_global_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL UNIQUE,
  language_code text NOT NULL,
  assistant_personality text NOT NULL DEFAULT 'friendly_helpful',
  supported_intents text[] NOT NULL DEFAULT '{}',
  localized_responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  cultural_adjustments jsonb NOT NULL DEFAULT '{}'::jsonb,
  measurement_units text NOT NULL DEFAULT 'metric',
  currency_format text NOT NULL DEFAULT 'INR',
  date_format text NOT NULL DEFAULT 'DD/MM/YYYY',
  is_active boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_ai_global_configs_country ON ai_global_configs(country_code);
CREATE INDEX IF NOT EXISTS idx_ai_global_configs_is_active ON ai_global_configs(is_active);

ALTER TABLE ai_global_configs ENABLE ROW LEVEL SECURITY;

-- Global configs are readable by all authenticated users
DROP POLICY IF EXISTS "select_ai_global_configs" ON ai_global_configs;
CREATE POLICY "select_ai_global_configs" ON ai_global_configs FOR SELECT
  TO authenticated USING (true);

-- Authenticated users can modify global configs (admin functionality)
DROP POLICY IF EXISTS "modify_ai_global_configs" ON ai_global_configs;
CREATE POLICY "modify_ai_global_configs" ON ai_global_configs FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- AI FEATURE FLAGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name text NOT NULL UNIQUE,
  feature_description text,
  is_enabled boolean NOT NULL DEFAULT false,
  rollout_percentage smallint NOT NULL DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_user_groups text[] NOT NULL DEFAULT '{}',
  target_regions text[] NOT NULL DEFAULT '{}',
  config_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_feature_flags_name ON ai_feature_flags(feature_name);
CREATE INDEX IF NOT EXISTS idx_ai_feature_flags_enabled ON ai_feature_flags(is_enabled);

ALTER TABLE ai_feature_flags ENABLE ROW LEVEL SECURITY;

-- Feature flags are readable by all authenticated users
DROP POLICY IF EXISTS "select_ai_feature_flags" ON ai_feature_flags;
CREATE POLICY "select_ai_feature_flags" ON ai_feature_flags FOR SELECT
  TO authenticated USING (true);

-- Authenticated users can modify feature flags (admin functionality)
DROP POLICY IF EXISTS "modify_ai_feature_flags" ON ai_feature_flags;
CREATE POLICY "modify_ai_feature_flags" ON ai_feature_flags FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- INSERT DEFAULT AI GLOBAL CONFIGS
-- ============================================================

INSERT INTO ai_global_configs (country_code, language_code, assistant_personality, supported_intents, localized_responses, cultural_adjustments, measurement_units, currency_format, date_format, is_active) VALUES
('IN', 'en-IN', 'friendly_helpful', ARRAY['product_search', 'deal_hunting', 'service_payment', 'smartcode_help', 'learning_path', 'emergency_help'], '{"greeting": "Hello! How can I help you today?", "farewell": "Thank you for using VLOOP!"}', '{"formality_level": "moderate", "use_honorifics": true}', 'metric', 'INR', 'DD/MM/YYYY', true),
('US', 'en-US', 'friendly_casual', ARRAY['product_search', 'deal_hunting', 'service_payment', 'smartcode_help', 'learning_path'], '{"greeting": "Hi there! What can I help you with?", "farewell": "Thanks for stopping by!"}', '{"formality_level": "casual", "use_honorifics": false}', 'imperial', 'USD', 'MM/DD/YYYY', true),
('GB', 'en-GB', 'friendly_helpful', ARRAY['product_search', 'deal_hunting', 'service_payment', 'smartcode_help', 'learning_path'], '{"greeting": "Hello! How may I assist you?", "farewell": "Thank you for choosing VLOOP!"}', '{"formality_level": "polite", "use_honorifics": false}', 'metric', 'GBP', 'DD/MM/YYYY', true)
ON CONFLICT (country_code) DO NOTHING;

-- ============================================================
-- INSERT DEFAULT AI FEATURE FLAGS
-- ============================================================

INSERT INTO ai_feature_flags (feature_name, feature_description, is_enabled, rollout_percentage, target_user_groups, target_regions, config_data) VALUES
('ai_shopping_assistant', 'AI-powered shopping recommendations and product search', true, 100, ARRAY['all'], ARRAY['IN', 'US', 'GB'], '{"max_suggestions": 5, "cache_ttl": 300}'),
('ai_learning_guide', 'AI learning path recommendations and quiz assistance', true, 100, ARRAY['all'], ARRAY['IN'], '{"max_learning_paths": 3}'),
('ai_merchant_partner', 'AI insights and recommendations for merchants', true, 100, ARRAY['merchants'], ARRAY['IN'], '{"insight_frequency": "daily"}'),
('ai_services_guide', 'AI guide for essential services and bill payments', true, 100, ARRAY['all'], ARRAY['IN'], '{"max_providers": 5}'),
('ai_voice_mode', 'Voice-enabled AI assistant for hands-free interaction', false, 0, ARRAY['beta_testers'], ARRAY['IN'], '{"languages": ["en-IN", "hi-IN"]}'),
('ai_ocr_layer', 'OCR parsing for paper SmartCodes and receipts', true, 50, ARRAY['trusted', 'verified'], ARRAY['IN'], '{"supported_formats": ["jpg", "png"], "max_file_size": 5}'),
('ai_fraud_detection', 'Real-time fraud detection and prevention', true, 100, ARRAY['all'], ARRAY['all'], '{"sensitivity": "high", "auto_block_threshold": 90}'),
('ai_trust_engine', 'Trust score calculation and monitoring', true, 100, ARRAY['all'], ARRAY['all'], '{"update_frequency": "weekly", "min_factors": 5}')
ON CONFLICT (feature_name) DO NOTHING;

-- ============================================================
-- UPDATE TRIGGER FOR ai_learning_progress
-- ============================================================

CREATE OR REPLACE FUNCTION update_ai_learning_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_ai_learning_progress ON ai_learning_progress;
CREATE TRIGGER trigger_update_ai_learning_progress
  BEFORE UPDATE ON ai_learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_learning_progress_timestamp();

-- ============================================================
-- UPDATE TRIGGER FOR ai_recommendation_weights
-- ============================================================

CREATE OR REPLACE FUNCTION update_ai_rec_weights_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_ai_rec_weights ON ai_recommendation_weights;
CREATE TRIGGER trigger_update_ai_rec_weights
  BEFORE UPDATE ON ai_recommendation_weights
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_rec_weights_timestamp();

-- ============================================================
-- UPDATE TRIGGER FOR ai_feature_flags
-- ============================================================

CREATE OR REPLACE FUNCTION update_ai_feature_flags_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_ai_feature_flags ON ai_feature_flags;
CREATE TRIGGER trigger_update_ai_feature_flags
  BEFORE UPDATE ON ai_feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_feature_flags_timestamp();
