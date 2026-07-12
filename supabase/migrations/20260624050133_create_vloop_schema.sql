-- VLOOP AI MART schema
-- Users (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  mobile text NOT NULL,
  location text,
  email text,
  vloop_code text UNIQUE,
  code_type text DEFAULT 'auto' CHECK (code_type IN ('auto','self')),
  points integer DEFAULT 0,
  wallet1_balance numeric(12,2) DEFAULT 0,
  wallet2_balance numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  subcategory text,
  brand text,
  image_url text,
  rating numeric(2,1) DEFAULT 4.5,
  review_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_vloop_own boolean DEFAULT false,
  is_partner boolean DEFAULT false,
  stock integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer DEFAULT 1,
  total_amount numeric(10,2) NOT NULL,
  points_earned integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Care Club contributions
CREATE TABLE IF NOT EXISTS public.care_club (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Benefits history
CREATE TABLE IF NOT EXISTS public.benefits_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  benefit_type text NOT NULL,
  tier text CHECK (tier IN ('standard','premium','prime')),
  points_used integer NOT NULL,
  amount numeric(12,2) NOT NULL,
  wallet text DEFAULT 'wallet1' CHECK (wallet IN ('wallet1','wallet2')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_club ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benefits_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "select_own_profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "insert_own_profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Products: public read
CREATE POLICY "read_products" ON public.products FOR SELECT TO anon, authenticated USING (true);

-- Orders policies
CREATE POLICY "select_own_orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_orders" ON public.orders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Care Club policies
CREATE POLICY "select_own_care" ON public.care_club FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_care" ON public.care_club FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Benefits history policies
CREATE POLICY "select_own_benefits" ON public.benefits_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_benefits" ON public.benefits_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_care_user ON public.care_club(user_id);
CREATE INDEX IF NOT EXISTS idx_benefits_user ON public.benefits_history(user_id);
