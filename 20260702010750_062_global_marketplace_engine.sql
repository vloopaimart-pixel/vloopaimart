-- Phase 16: Add amount to point_history, wallet tracking fields to profiles
ALTER TABLE public.point_history
  ADD COLUMN IF NOT EXISTS amount numeric DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS wallet1_total_earned numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wallet1_total_used numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wallet2_activation_date timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS wallet2_support_status text DEFAULT 'active' CHECK (wallet2_support_status IN ('active','suspended','pending')),
  ADD COLUMN IF NOT EXISTS wallet2_eligibility_status text DEFAULT 'eligible' CHECK (wallet2_eligibility_status IN ('eligible','under_review','not_eligible')),
  ADD COLUMN IF NOT EXISTS membership_status text DEFAULT 'active' CHECK (membership_status IN ('active','suspended','pending','expired'));
