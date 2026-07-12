-- Phase 19: Add smartcode column to participation table
ALTER TABLE public.participation ADD COLUMN IF NOT EXISTS smartcode text;
ALTER TABLE public.participation ADD COLUMN IF NOT EXISTS points_used integer DEFAULT 0;
ALTER TABLE public.participation ADD COLUMN IF NOT EXISTS category text DEFAULT 'standard';
ALTER TABLE public.participation ADD COLUMN IF NOT EXISTS entry_count integer DEFAULT 1;
