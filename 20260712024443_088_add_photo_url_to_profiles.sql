-- Phase 17: Product reviews and referral rewards tables

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  review_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_product_reviews" ON public.product_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_own_product_reviews" ON public.product_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_product_reviews" ON public.product_reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON public.product_reviews(product_id);

-- Referral rewards table
CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referrer_points integer DEFAULT 0,
  referred_points integer DEFAULT 0,
  status text DEFAULT 'completed' CHECK (status IN ('completed','pending','rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_referral_rewards" ON public.referral_rewards FOR SELECT TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "insert_referral_rewards" ON public.referral_rewards FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);

-- Add referral_count to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_count integer DEFAULT 0;
