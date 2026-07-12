-- ============================================================
-- Migration 070: Global Payment, Order & Transaction Engine
-- Phase 42 — Enterprise Payment & Order Management Layer
-- ============================================================

-- 1. Payment Methods Configuration
CREATE TABLE payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  method_code text NOT NULL UNIQUE CHECK (method_code IN ('upi', 'debit_card', 'credit_card', 'net_banking', 'wallet', 'international', 'cod')),
  method_name text NOT NULL,
  is_active boolean DEFAULT true,
  requires_verification boolean DEFAULT true,
  processing_fee_percentage numeric DEFAULT 0,
  processing_fee_fixed numeric DEFAULT 0,
  min_amount numeric DEFAULT 0,
  max_amount numeric,
  settlement_delay_hours integer DEFAULT 24,
  supported_countries text[] DEFAULT ARRAY['IN'],
  gateway_provider text,
  gateway_config jsonb DEFAULT '{}'::jsonb,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_methods_auth" ON payment_methods;
CREATE POLICY "select_methods_auth" ON payment_methods FOR SELECT
  TO authenticated USING (is_active = true);

DROP POLICY IF EXISTS "crud_methods_admin" ON payment_methods;
CREATE POLICY "crud_methods_admin" ON payment_methods FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- Insert payment methods
INSERT INTO payment_methods (method_code, method_name, is_active, processing_fee_percentage, display_order) VALUES
('upi', 'UPI Payment', true, 0, 1),
('debit_card', 'Debit Card', true, 0, 2),
('credit_card', 'Credit Card', true, 1.5, 3),
('net_banking', 'Net Banking', true, 0, 4),
('wallet', 'VLOOP Wallet', true, 0, 5),
('international', 'International Payment', false, 3, 6),
('cod', 'Cash on Delivery', false, 0, 7);

-- 2. Payment Transactions
CREATE TABLE payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text NOT NULL UNIQUE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  merchant_id uuid REFERENCES sellers(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  currency text DEFAULT 'INR',
  payment_method text NOT NULL REFERENCES payment_methods(method_code),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'authorized', 'paid', 'failed', 'cancelled', 'refund_pending', 'refund_completed', 'disputed')),
  gateway_transaction_id text,
  gateway_response jsonb DEFAULT '{}'::jsonb,
  gateway_status text,
  authorization_code text,
  capture_code text,
  refund_code text,
  refund_amount numeric DEFAULT 0,
  refund_reason text,
  refunded_at timestamptz,
  refund_processed_by uuid REFERENCES profiles(id),
  failure_code text,
  failure_message text,
  retry_count integer DEFAULT 0,
  last_retry_at timestamptz,
  ip_address text,
  device_fingerprint text,
  risk_score numeric DEFAULT 0,
  risk_flags jsonb DEFAULT '[]'::jsonb,
  is_verified boolean DEFAULT false,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_trans_own" ON payment_transactions;
CREATE POLICY "select_trans_own" ON payment_transactions FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_trans_admin" ON payment_transactions;
CREATE POLICY "crud_trans_admin" ON payment_transactions FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "select_trans_merchant" ON payment_transactions;
CREATE POLICY "select_trans_merchant" ON payment_transactions FOR SELECT
  TO authenticated USING (merchant_id IN (SELECT id FROM sellers WHERE user_id = auth.uid()));

-- 3. Order Status Tracking
CREATE TABLE order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status text,
  new_status text NOT NULL CHECK (new_status IN ('draft', 'confirmed', 'packed', 'dispatched', 'transit', 'delivered', 'returned', 'cancelled', 'rejected', 'completed')),
  status_reason text,
  changed_by uuid REFERENCES profiles(id),
  changed_by_type text CHECK (changed_by_type IN ('customer', 'merchant', 'admin', 'system')),
  location text,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_status_own" ON order_status_history;
CREATE POLICY "select_status_own" ON order_status_history FOR SELECT
  TO authenticated USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "crud_status_admin" ON order_status_history;
CREATE POLICY "crud_status_admin" ON order_status_history FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 4. Order Items Extended
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  seller_id uuid REFERENCES sellers(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_sku text,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  discount_per_item numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  item_status text DEFAULT 'confirmed' CHECK (item_status IN ('confirmed', 'packed', 'dispatched', 'delivered', 'cancelled', 'returned')),
  seller_confirmed boolean DEFAULT false,
  seller_confirmed_at timestamptz,
  seller_rejected_reason text,
  smartpoints_earned integer DEFAULT 0,
  careclub_contribution numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_items_own" ON order_items;
CREATE POLICY "select_items_own" ON order_items FOR SELECT
  TO authenticated USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "crud_items_admin" ON order_items;
CREATE POLICY "crud_items_admin" ON order_items FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

DROP POLICY IF EXISTS "select_items_seller" ON order_items;
CREATE POLICY "select_items_seller" ON order_items FOR SELECT
  TO authenticated USING (seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid()));

-- 5. AI Order Validation
CREATE TABLE ai_order_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  validation_type text NOT NULL CHECK (validation_type IN ('duplicate_detection', 'fake_order', 'abnormal_purchase', 'velocity_check', 'device_validation', 'location_validation', 'behavior_analysis', 'fraud_check')),
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'passed', 'failed', 'reviewing')),
  validation_score numeric DEFAULT 0,
  threshold_score numeric DEFAULT 50,
  is_passed boolean DEFAULT false,
  flags jsonb DEFAULT '[]'::jsonb,
  details jsonb DEFAULT '{}'::jsonb,
  recommendation text,
  requires_manual_review boolean DEFAULT false,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  review_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_order_validations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_validation_admin" ON ai_order_validations;
CREATE POLICY "crud_validation_admin" ON ai_order_validations FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 6. Merchant Order Queue
CREATE TABLE merchant_order_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id uuid REFERENCES order_items(id),
  seller_id uuid NOT NULL REFERENCES sellers(id),
  queue_status text DEFAULT 'pending' CHECK (queue_status IN ('pending', 'accepted', 'rejected', 'packing', 'ready_dispatch', 'handed_over', 'completed', 'cancelled')),
  priority integer DEFAULT 0,
  estimated_packing_time integer,
  actual_packing_time integer,
  packing_started_at timestamptz,
  packing_completed_at timestamptz,
  ready_for_dispatch_at timestamptz,
  handed_over_at timestamptz,
  processing_notes text,
  is_rush_order boolean DEFAULT false,
  settlement_status text DEFAULT 'pending' CHECK (settlement_status IN ('pending', 'processing', 'completed', 'on_hold')),
  settlement_amount numeric,
  settlement_processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE merchant_order_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_queue_seller" ON merchant_order_queue;
CREATE POLICY "select_queue_seller" ON merchant_order_queue FOR SELECT
  TO authenticated USING (seller_id IN (SELECT id FROM sellers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "crud_queue_admin" ON merchant_order_queue;
CREATE POLICY "crud_queue_admin" ON merchant_order_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 7. Immutable Transaction Audit Log
CREATE TABLE transaction_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type text NOT NULL CHECK (transaction_type IN ('order_created', 'order_updated', 'order_cancelled', 'payment_initiated', 'payment_completed', 'payment_failed', 'payment_refunded', 'wallet_credit', 'wallet_debit', 'smartcode_generated', 'points_earned', 'points_redeemed', 'careclub_contribution', 'reward_paid', 'settlement_processed', 'refund_processed', 'flag_raised', 'review_completed')),
  reference_type text NOT NULL CHECK (reference_type IN ('order', 'payment', 'wallet', 'smartcode', 'points', 'careclub', 'reward', 'settlement', 'refund')),
  reference_id uuid,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  merchant_id uuid REFERENCES sellers(id) ON DELETE SET NULL,
  admin_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  old_value jsonb,
  new_value jsonb,
  changes jsonb DEFAULT '{}'::jsonb,
  amount numeric,
  currency text DEFAULT 'INR',
  ip_address text,
  user_agent text,
  device_fingerprint text,
  location jsonb,
  is_reversible boolean DEFAULT false,
  reversal_id uuid REFERENCES transaction_audit_log(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transaction_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_audit_own" ON transaction_audit_log;
CREATE POLICY "select_audit_own" ON transaction_audit_log FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_audit_admin" ON transaction_audit_log;
CREATE POLICY "crud_audit_admin" ON transaction_audit_log FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 8. Notification Queue
CREATE TABLE notification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('order_confirmed', 'order_shipped', 'order_delivered', 'payment_success', 'payment_failed', 'refund_processed', 'smartcode_winner', 'reward_credited', 'wallet_credit', 'wallet_debit', 'promotion', 'alert')),
  channel text NOT NULL CHECK (channel IN ('sms', 'email', 'whatsapp', 'push', 'in_app')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  priority integer DEFAULT 5,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'delivered', 'failed', 'cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  delivered_at timestamptz,
  failure_reason text,
  retry_count integer DEFAULT 0,
  external_message_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_notif_own" ON notification_queue;
CREATE POLICY "select_notif_own" ON notification_queue FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_notif_admin" ON notification_queue;
CREATE POLICY "crud_notif_admin" ON notification_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 9. Refund Queue
CREATE TABLE refund_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_transaction_id uuid REFERENCES payment_transactions(id),
  user_id uuid NOT NULL REFERENCES profiles(id),
  refund_type text NOT NULL CHECK (refund_type IN ('full', 'partial', 'item', 'shipping')),
  refund_reason text NOT NULL,
  requested_amount numeric NOT NULL,
  approved_amount numeric,
  refund_status text DEFAULT 'pending' CHECK (refund_status IN ('pending', 'processing', 'approved', 'rejected', 'completed', 'cancelled')),
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  processed_by uuid REFERENCES profiles(id),
  rejection_reason text,
  processing_notes text,
  gateway_refund_id text,
  refund_to_wallet boolean DEFAULT false,
  wallet_credited_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE refund_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_refund_own" ON refund_queue;
CREATE POLICY "select_refund_own" ON refund_queue FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "crud_refund_admin" ON refund_queue;
CREATE POLICY "crud_refund_admin" ON refund_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 10. Admin Payment Dashboard Stats
CREATE TABLE admin_payment_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date NOT NULL,
  total_orders integer DEFAULT 0,
  total_amount numeric DEFAULT 0,
  successful_payments integer DEFAULT 0,
  successful_amount numeric DEFAULT 0,
  failed_payments integer DEFAULT 0,
  failed_amount numeric DEFAULT 0,
  pending_payments integer DEFAULT 0,
  pending_amount numeric DEFAULT 0,
  refunds_processed integer DEFAULT 0,
  refund_amount numeric DEFAULT 0,
  cod_orders integer DEFAULT 0,
  cod_amount numeric DEFAULT 0,
  wallet_payments integer DEFAULT 0,
  wallet_amount numeric DEFAULT 0,
  upi_payments integer DEFAULT 0,
  upi_amount numeric DEFAULT 0,
  card_payments integer DEFAULT 0,
  card_amount numeric DEFAULT 0,
  fraud_detected integer DEFAULT 0,
  fraud_amount numeric DEFAULT 0,
  avg_order_value numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(stat_date)
);

ALTER TABLE admin_payment_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_stats_admin" ON admin_payment_stats;
CREATE POLICY "crud_stats_admin" ON admin_payment_stats FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 11. Live Order Tracking
CREATE TABLE live_order_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tracking_status text NOT NULL CHECK (tracking_status IN ('order_placed', 'confirmed', 'processing', 'packed', 'ready_dispatch', 'picked_up', 'transit', 'out_for_delivery', 'delivered', 'returned', 'cancelled')),
  location text,
  latitude numeric,
  longitude numeric,
  estimated_delivery timestamptz,
  actual_delivery timestamptz,
  carrier_name text,
  carrier_tracking_id text,
  carrier_phone text,
  delivery_partner_name text,
  delivery_partner_phone text,
  delivery_attempts integer DEFAULT 0,
  last_attempt_at timestamptz,
  delivery_notes text,
  customer_notified boolean DEFAULT false,
  proof_of_delivery_url text,
  signature_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE live_order_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_tracking_own" ON live_order_tracking;
CREATE POLICY "select_tracking_own" ON live_order_tracking FOR SELECT
  TO authenticated USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "crud_tracking_admin" ON live_order_tracking;
CREATE POLICY "crud_tracking_admin" ON live_order_tracking FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 12. Fraud Detection Queue
CREATE TABLE fraud_detection_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_type text NOT NULL CHECK (reference_type IN ('order', 'payment', 'user', 'merchant')),
  reference_id uuid NOT NULL,
  user_id uuid REFERENCES profiles(id),
  fraud_type text NOT NULL CHECK (fraud_type IN ('duplicate_order', 'fake_payment', 'velocity_abuse', 'location_mismatch', 'device_mismatch', 'suspicious_pattern', 'collusion', 'refund_abuse', 'coupon_abuse')),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  fraud_score numeric DEFAULT 0,
  detection_rules jsonb DEFAULT '[]'::jsonb,
  evidence jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'confirmed', 'false_positive', 'resolved', 'escalated')),
  assigned_to uuid REFERENCES profiles(id),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id),
  resolution_notes text,
  action_taken text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE fraud_detection_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_fraud_admin" ON fraud_detection_queue;
CREATE POLICY "crud_fraud_admin" ON fraud_detection_queue FOR ALL
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND is_active = true
  ));

-- 13. Indexes
CREATE INDEX IF NOT EXISTS idx_paymenttrans_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_paymenttrans_order ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_paymenttrans_status ON payment_transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_paymenttrans_ref ON payment_transactions(gateway_transaction_id);

CREATE INDEX IF NOT EXISTS idx_orderstatus_order ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_orderstatus_created ON order_status_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orderitems_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orderitems_seller ON order_items(seller_id);

CREATE INDEX IF NOT EXISTS idx_aivalidation_order ON ai_order_validations(order_id);
CREATE INDEX IF NOT EXISTS idx_aivalidation_status ON ai_order_validations(validation_status);

CREATE INDEX IF NOT EXISTS idx_merchantqueue_seller ON merchant_order_queue(seller_id);
CREATE INDEX IF NOT EXISTS idx_merchantqueue_status ON merchant_order_queue(queue_status);

CREATE INDEX IF NOT EXISTS idx_auditlog_ref ON transaction_audit_log(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_auditlog_user ON transaction_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auditlog_created ON transaction_audit_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifqueue_user ON notification_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_notifqueue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notifqueue_scheduled ON notification_queue(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_refundqueue_user ON refund_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_refundqueue_status ON refund_queue(refund_status);

CREATE INDEX IF NOT EXISTS idx_livetracking_order ON live_order_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_livetracking_status ON live_order_tracking(tracking_status);

CREATE INDEX IF NOT EXISTS idx_fraudqueue_status ON fraud_detection_queue(status);
CREATE INDEX IF NOT EXISTS idx_fraudqueue_severity ON fraud_detection_queue(severity);

-- 14. Triggers
DROP TRIGGER IF EXISTS trg_paymenttrans_updated ON payment_transactions;
CREATE TRIGGER trg_paymenttrans_updated BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_orderitems_updated ON order_items;
CREATE TRIGGER trg_orderitems_updated BEFORE UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_merchantqueue_updated ON merchant_order_queue;
CREATE TRIGGER trg_merchantqueue_updated BEFORE UPDATE ON merchant_order_queue
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_refundqueue_updated ON refund_queue;
CREATE TRIGGER trg_refundqueue_updated BEFORE UPDATE ON refund_queue
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_livetracking_updated ON live_order_tracking;
CREATE TRIGGER trg_livetracking_updated BEFORE UPDATE ON live_order_tracking
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_fraudqueue_updated ON fraud_detection_queue;
CREATE TRIGGER trg_fraudqueue_updated BEFORE UPDATE ON fraud_detection_queue
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_paymentmethods_updated ON payment_methods;
CREATE TRIGGER trg_paymentmethods_updated BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 15. Functions
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_order_number text;
BEGIN
  SELECT 'VL' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('order_number_seq')::text, 6, '0') INTO v_order_number;
  RETURN v_order_number;
END;
$function$;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_transaction_id()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
  v_trans_id text;
BEGIN
  SELECT 'TXN' || to_char(now(), 'YYYYMMDDHH24MISS') || '-' || substr(md5(random()::text), 1, 8) INTO v_trans_id;
  RETURN UPPER(v_trans_id);
END;
$function$;

CREATE OR REPLACE FUNCTION calculate_order_smartpoints(p_order_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  v_total_amount numeric;
  v_smartpoints integer;
BEGIN
  SELECT COALESCE(SUM(total_price), 0) INTO v_total_amount
  FROM order_items WHERE order_id = p_order_id;

  v_smartpoints := FLOOR(v_total_amount / 40)::integer;

  UPDATE orders SET points_earned = v_smartpoints WHERE id = p_order_id;

  RETURN v_smartpoints;
END;
$function$;

CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id uuid,
  p_new_status text,
  p_reason text DEFAULT NULL,
  p_changed_by uuid DEFAULT NULL,
  p_changed_by_type text DEFAULT 'system'
)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO order_status_history (
    order_id, old_status, new_status, status_reason, changed_by, changed_by_type
  )
  SELECT p_order_id, status, p_new_status, p_reason, p_changed_by, p_changed_by_type
  FROM orders WHERE id = p_order_id;

  UPDATE orders SET status = p_new_status WHERE id = p_order_id;
END;
$function$;

CREATE OR REPLACE FUNCTION get_payment_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'today', (SELECT jsonb_build_object(
      'orders', COUNT(*),
      'amount', COALESCE(SUM(total_amount), 0)
    ) FROM orders WHERE created_at::date = current_date),
    'pending_payments', (SELECT COUNT(*) FROM payment_transactions WHERE payment_status = 'pending'),
    'failed_payments', (SELECT COUNT(*) FROM payment_transactions WHERE payment_status = 'failed'),
    'pending_refunds', (SELECT COUNT(*) FROM refund_queue WHERE refund_status = 'pending'),
    'open_fraud_cases', (SELECT COUNT(*) FROM fraud_detection_queue WHERE status = 'open'),
    'payment_methods', (SELECT jsonb_agg(jsonb_build_object(
      'method', method_code,
      'count', c.method_count,
      'amount', c.method_amount
    )) FROM (
      SELECT payment_method as method, COUNT(*) as method_count, SUM(amount) as method_amount
      FROM payment_transactions
      WHERE payment_status = 'paid' AND created_at > current_date - interval '7 days'
      GROUP BY payment_method
    ) c)
  ) INTO v_stats;

  RETURN v_stats;
END;
$function$;

CREATE OR REPLACE FUNCTION get_merchant_orders(p_seller_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_orders jsonb;
BEGIN
  SELECT jsonb_agg(jsonb_build_object(
    'order_id', o.id,
    'order_number', o.order_number,
    'status', o.status,
    'amount', o.total_amount,
    'created_at', o.created_at,
    'customer_name', p.full_name,
    'items', (SELECT jsonb_agg(jsonb_build_object(
      'product_name', oi.product_name,
      'quantity', oi.quantity,
      'price', oi.total_price
    )) FROM order_items oi WHERE oi.order_id = o.id AND oi.seller_id = p_seller_id)
  )) INTO v_orders
  FROM orders o
  JOIN profiles p ON o.user_id = p.id
  WHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.order_id = o.id AND oi.seller_id = p_seller_id)
  ORDER BY o.created_at DESC
  LIMIT 50;

  RETURN v_orders;
END;
$function$;
