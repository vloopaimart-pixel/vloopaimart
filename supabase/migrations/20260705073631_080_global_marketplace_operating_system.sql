-- ============================================================
-- Migration 080: VLOOP Global Marketplace & Commerce Operating System
-- Phase 51 — Enterprise AI Commerce Platform
-- Adding additional tables (categories already exist)
-- ============================================================

-- 1. Seller Stores
CREATE TABLE IF NOT EXISTS seller_stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_name text NOT NULL,
  store_slug text NOT NULL UNIQUE,
  store_description text,
  store_logo_url text,
  store_banner_url text,
  store_address text,
  store_city text,
  store_state text,
  store_pincode text,
  store_phone text,
  store_email text,
  business_hours jsonb DEFAULT '{"monday": {"open": "09:00", "close": "21:00"}}'::jsonb,
  
  -- Verification
  is_verified boolean DEFAULT false,
  verification_badge text DEFAULT 'pending',
  gst_number text,
  pan_number text,
  
  -- Ratings
  rating_avg numeric DEFAULT 0 CHECK (rating_avg BETWEEN 0 AND 5),
  rating_count integer DEFAULT 0,
  review_count integer DEFAULT 0,
  
  -- Stats
  total_products integer DEFAULT 0,
  total_sales integer DEFAULT 0,
  total_orders integer DEFAULT 0,
  
  -- Features
  is_home_seller boolean DEFAULT false,
  is_women_entrepreneur boolean DEFAULT false,
  is_village_store boolean DEFAULT false,
  is_micro_warehouse boolean DEFAULT false,
  is_community_delivery boolean DEFAULT false,
  
  -- AI
  ai_recommendation_score numeric DEFAULT 50,
  ai_category text,
  
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE seller_stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_stores_all" ON seller_stores;
CREATE POLICY "select_stores_all" ON seller_stores FOR SELECT
  TO authenticated, anon USING (is_active = true);

DROP POLICY IF EXISTS "select_own_store" ON seller_stores;
CREATE POLICY "select_own_store" ON seller_stores FOR SELECT
  TO authenticated USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_store" ON seller_stores;
CREATE POLICY "insert_own_store" ON seller_stores FOR INSERT
  TO authenticated WITH CHECK (seller_id = auth.uid());

DROP POLICY IF EXISTS "update_own_store" ON seller_stores;
CREATE POLICY "update_own_store" ON seller_stores FOR UPDATE
  TO authenticated USING (seller_id = auth.uid());

-- 2. AI Search History
CREATE TABLE IF NOT EXISTS marketplace_search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  search_query text NOT NULL,
  search_type text DEFAULT 'text' CHECK (search_type IN ('text', 'voice', 'image')),
  results_count integer DEFAULT 0,
  clicked_products jsonb DEFAULT '[]'::jsonb,
  filters jsonb DEFAULT '{}'::jsonb,
  session_id text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_search_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_history" ON marketplace_search_history;
CREATE POLICY "select_own_history" ON marketplace_search_history FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_history" ON marketplace_search_history;
CREATE POLICY "insert_own_history" ON marketplace_search_history FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

-- 3. Product Recommendations
CREATE TABLE IF NOT EXISTS marketplace_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  
  recommendation_type text NOT NULL CHECK (recommendation_type IN (
    'purchase_history', 'browsing_history', 'location', 'category_interest',
    'season', 'community_trends', 'trending', 'nearby', 'ai_suggested'
  )),
  
  relevance_score numeric DEFAULT 0 CHECK (relevance_score BETWEEN 0 AND 100),
  click_probability numeric DEFAULT 0,
  purchase_probability numeric DEFAULT 0,
  
  context_data jsonb DEFAULT '{}'::jsonb,
  
  was_shown boolean DEFAULT false,
  was_clicked boolean DEFAULT false,
  was_purchased boolean DEFAULT false,
  
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, product_id, recommendation_type)
);

ALTER TABLE marketplace_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_recommendations" ON marketplace_recommendations;
CREATE POLICY "select_own_recommendations" ON marketplace_recommendations FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- 4. Wishlist
CREATE TABLE IF NOT EXISTS marketplace_wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  notes text,
  priority integer DEFAULT 0,
  UNIQUE(user_id, product_id)
);

ALTER TABLE marketplace_wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_own_wishlist" ON marketplace_wishlist;
CREATE POLICY "crud_own_wishlist" ON marketplace_wishlist FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- 5. Product Comparison
CREATE TABLE IF NOT EXISTS marketplace_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  category_id uuid,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

ALTER TABLE marketplace_comparisons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_own_comparison" ON marketplace_comparisons;
CREATE POLICY "crud_own_comparison" ON marketplace_comparisons FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- 6. Recently Viewed
CREATE TABLE IF NOT EXISTS marketplace_recently_viewed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  view_count integer DEFAULT 1,
  last_viewed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE marketplace_recently_viewed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crud_own_recent" ON marketplace_recently_viewed;
CREATE POLICY "crud_own_recent" ON marketplace_recently_viewed FOR ALL
  TO authenticated USING (user_id = auth.uid());

-- 7. Product Questions
CREATE TABLE IF NOT EXISTS marketplace_product_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id),
  question_text text NOT NULL,
  is_anonymous boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  
  answer_text text,
  answered_by uuid REFERENCES profiles(id),
  answered_at timestamptz,
  is_verified_answer boolean DEFAULT false,
  
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_product_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_questions_all" ON marketplace_product_questions;
CREATE POLICY "select_questions_all" ON marketplace_product_questions FOR SELECT
  TO authenticated, anon USING (is_active = true);

DROP POLICY IF EXISTS "insert_question_auth" ON marketplace_product_questions;
CREATE POLICY "insert_question_auth" ON marketplace_product_questions FOR INSERT
  TO authenticated WITH CHECK (true);

-- 8. Seller Reviews
CREATE TABLE IF NOT EXISTS marketplace_seller_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES profiles(id),
  order_id uuid REFERENCES orders(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_title text,
  review_text text,
  images jsonb DEFAULT '[]'::jsonb,
  
  is_verified_purchase boolean DEFAULT false,
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(customer_id, order_id)
);

ALTER TABLE marketplace_seller_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_reviews_all" ON marketplace_seller_reviews;
CREATE POLICY "select_reviews_all" ON marketplace_seller_reviews FOR SELECT
  TO authenticated, anon USING (is_active = true);

DROP POLICY IF EXISTS "insert_review_auth" ON marketplace_seller_reviews;
CREATE POLICY "insert_review_auth" ON marketplace_seller_reviews FOR INSERT
  TO authenticated WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "update_own_review" ON marketplace_seller_reviews;
CREATE POLICY "update_own_review" ON marketplace_seller_reviews FOR UPDATE
  TO authenticated USING (customer_id = auth.uid());

-- 9. Future Trading (B2B/Wholesale/Export/Import)
CREATE TABLE IF NOT EXISTS marketplace_future_trading (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id),
  
  trading_type text NOT NULL CHECK (trading_type IN (
    'private_label', 'import', 'export', 'wholesale', 'b2b', 'global_sourcing'
  )),
  
  product_name text NOT NULL,
  description text,
  
  min_order_quantity integer,
  max_order_quantity integer,
  unit_price numeric,
  currency text DEFAULT 'INR',
  
  origin_country text,
  destination_countries jsonb DEFAULT '[]'::jsonb,
  
  specifications jsonb DEFAULT '{}'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'closed')),
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_future_trading ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_trading_all" ON marketplace_future_trading;
CREATE POLICY "select_trading_all" ON marketplace_future_trading FOR SELECT
  TO authenticated USING (is_active = true AND status = 'active');

DROP POLICY IF EXISTS "crud_trading_seller" ON marketplace_future_trading;
CREATE POLICY "crud_trading_seller" ON marketplace_future_trading FOR ALL
  TO authenticated USING (seller_id = auth.uid());

-- 10. Affiliate Commerce
CREATE TABLE IF NOT EXISTS marketplace_affiliate_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  
  affiliate_partner text NOT NULL CHECK (affiliate_partner IN ('amazon', 'flipkart', 'other')),
  external_product_id text,
  external_url text,
  
  commission_rate numeric DEFAULT 0,
  smartpoint_reward integer DEFAULT 0,
  
  last_synced_at timestamptz,
  sync_status text DEFAULT 'pending',
  
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_affiliate_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_affiliate_all" ON marketplace_affiliate_products;
CREATE POLICY "select_affiliate_all" ON marketplace_affiliate_products FOR SELECT
  TO authenticated, anon USING (is_active = true);

-- 11. Affiliate Click Tracking
CREATE TABLE IF NOT EXISTS marketplace_affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_product_id uuid REFERENCES marketplace_affiliate_products(id),
  user_id uuid REFERENCES profiles(id),
  click_type text DEFAULT 'view' CHECK (click_type IN ('view', 'click', 'purchase')),
  session_id text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_affiliate_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_click_auth" ON marketplace_affiliate_clicks;
CREATE POLICY "insert_click_auth" ON marketplace_affiliate_clicks FOR INSERT
  TO authenticated, anon WITH CHECK (true);

-- 12. Customer Notifications
CREATE TABLE IF NOT EXISTS marketplace_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN (
    'order_update', 'price_drop', 'back_in_stock', 'wishlist_sale',
    'recommendation', 'offer', 'delivery', 'review_request', 'seller_update'
  )),
  title text NOT NULL,
  message text,
  data jsonb DEFAULT '{}'::jsonb,
  image_url text,
  action_url text,
  
  is_read boolean DEFAULT false,
  read_at timestamptz,
  
  created_at timestamptz DEFAULT now()
);

ALTER TABLE marketplace_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON marketplace_notifications;
CREATE POLICY "select_own_notifications" ON marketplace_notifications FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_notifications" ON marketplace_notifications;
CREATE POLICY "insert_own_notifications" ON marketplace_notifications FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "update_own_notifications" ON marketplace_notifications;
CREATE POLICY "update_own_notifications" ON marketplace_notifications FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

-- 13. Indexes
CREATE INDEX IF NOT EXISTS idx_stores_seller ON seller_stores(seller_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON marketplace_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_product ON marketplace_recommendations(product_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON marketplace_search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON marketplace_wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_recent_viewed_user ON marketplace_recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON marketplace_notifications(user_id);

-- 14. Triggers
DROP TRIGGER IF EXISTS trg_stores_updated ON seller_stores;
CREATE TRIGGER trg_stores_updated BEFORE UPDATE ON seller_stores
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- 15. Functions

-- Get AI Recommendations
CREATE OR REPLACE FUNCTION marketplace_get_recommendations(p_user_id uuid, p_limit integer DEFAULT 20)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
  v_recommendations jsonb;
BEGIN
  SELECT jsonb_agg(jsonb_build_object(
    'product_id', mr.product_id,
    'type', mr.recommendation_type,
    'score', mr.relevance_score
  )) INTO v_recommendations
  FROM marketplace_recommendations mr
  WHERE mr.user_id = p_user_id
    AND mr.expires_at > now()
  ORDER BY mr.relevance_score DESC
  LIMIT p_limit;
  
  RETURN COALESCE(v_recommendations, '[]'::jsonb);
END;
$function$;

-- Track Product View
CREATE OR REPLACE FUNCTION marketplace_track_view(p_user_id uuid, p_product_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO marketplace_recently_viewed (user_id, product_id, view_count, last_viewed_at)
  VALUES (p_user_id, p_product_id, 1, now())
  ON CONFLICT (user_id, product_id) DO UPDATE SET
    view_count = marketplace_recently_viewed.view_count + 1,
    last_viewed_at = now();
END;
$function$;

-- Update Seller Rating
CREATE OR REPLACE FUNCTION marketplace_update_seller_rating(p_seller_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE seller_stores SET
    rating_avg = (
      SELECT COALESCE(AVG(rating), 0) FROM marketplace_seller_reviews 
      WHERE seller_id = p_seller_id AND is_active = true
    ),
    rating_count = (
      SELECT COUNT(*) FROM marketplace_seller_reviews 
      WHERE seller_id = p_seller_id AND is_active = true
    ),
    review_count = (
      SELECT COUNT(*) FROM marketplace_seller_reviews 
      WHERE seller_id = p_seller_id AND is_active = true AND review_text IS NOT NULL
    )
  WHERE seller_id = p_seller_id;
END;
$function$;
