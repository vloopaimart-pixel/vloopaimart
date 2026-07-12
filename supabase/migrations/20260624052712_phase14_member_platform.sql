-- Phase 14: Add member fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS whatsapp_number text,
  ADD COLUMN IF NOT EXISTS referral_code text,
  ADD COLUMN IF NOT EXISTS referred_by text,
  ADD COLUMN IF NOT EXISTS member_id text UNIQUE;

-- Auto-generate member_id on insert
CREATE OR REPLACE FUNCTION public.generate_member_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.member_id IS NULL THEN
    NEW.member_id := 'VLM' || lpad(nextval('member_id_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS member_id_seq START 1;

DROP TRIGGER IF EXISTS set_member_id ON public.profiles;
CREATE TRIGGER set_member_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_member_id();

-- Point history table
CREATE TABLE IF NOT EXISTS public.point_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity text NOT NULL,
  points_earned integer DEFAULT 0,
  status text DEFAULT 'completed' CHECK (status IN ('completed','pending','rejected')),
  created_at timestamptz DEFAULT now()
);

-- Participation table
CREATE TABLE IF NOT EXISTS public.participation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  participation_type text NOT NULL,
  quiz_type text,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Support requests table
CREATE TABLE IF NOT EXISTS public.support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_type text NOT NULL,
  message text,
  status text DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.point_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Point history policies
CREATE POLICY "select_own_point_history" ON public.point_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_point_history" ON public.point_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Participation policies
CREATE POLICY "select_own_participation" ON public.participation FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_participation" ON public.participation FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Support requests policies
CREATE POLICY "select_own_support" ON public.support_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_support" ON public.support_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_point_history_user ON public.point_history(user_id);
CREATE INDEX IF NOT EXISTS idx_participation_user ON public.participation(user_id);
CREATE INDEX IF NOT EXISTS idx_support_user ON public.support_requests(user_id);

-- Seed sample point history for existing data structure
INSERT INTO public.point_history (user_id, activity, points_earned, status)
SELECT id, 'Registration Bonus', 1, 'completed' FROM public.profiles
WHERE NOT EXISTS (SELECT 1 FROM public.point_history WHERE user_id = profiles.id)
ON CONFLICT DO NOTHING;
