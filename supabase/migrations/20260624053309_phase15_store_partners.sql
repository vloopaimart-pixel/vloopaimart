-- Phase 15: Store partners table
CREATE TABLE IF NOT EXISTS public.store_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL,
  location text NOT NULL,
  mobile_number text NOT NULL,
  business_category text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.store_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_store_partners" ON public.store_partners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "select_own_store_partners" ON public.store_partners FOR SELECT TO authenticated USING (true);
