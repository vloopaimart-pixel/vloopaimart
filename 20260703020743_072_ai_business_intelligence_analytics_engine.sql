-- ============================================================================
-- VLOOP SMARTCODE DISTRIBUTION ENGINE — Phase 30
-- ============================================================================
--
-- Enterprise Hybrid AI + Manual Distribution Architecture
--
-- This migration enables:
--   1. Duplicate SmartCodes as separate entries (same code, different points)
--   2. My SmartCodes permanent storage with full CRUD
--   3. Future-ready architecture for OCR, Voice, WhatsApp, Offline sources
--
-- Key change: Drop the unique constraint that prevented duplicate SmartCodes
-- from appearing as separate rows. Per business rules, duplicates ARE allowed:
--   "The same SmartCode may appear multiple times with different point values."
-- ============================================================================

-- ============================================================================
-- 1. DROP UNIQUE CONSTRAINT — Allow duplicate SmartCodes as separate rows
-- ============================================================================

-- The unique constraint idx_smartcode_allocations_unique on
-- (user_id, smartcode, week_period, source) prevented the same code
-- from appearing twice in the same week. Per Phase 30 requirements,
-- duplicates must be allowed as separate entries with different point values.

DROP INDEX IF EXISTS idx_smartcode_allocations_unique;

-- Replace with a non-unique index for query performance
CREATE INDEX IF NOT EXISTS idx_smartcode_alloc_lookup
  ON smartcode_allocations(user_id, smartcode, week_period, source)
  WHERE is_active = true;

-- ============================================================================
-- 2. ADD source CHECK constraint for future entry sources
-- ============================================================================

-- Add 'ocr', 'voice', 'whatsapp', 'offline' as valid sources for future-ready architecture
ALTER TABLE smartcode_allocations
  DROP CONSTRAINT IF EXISTS smartcode_allocations_source_check;

ALTER TABLE smartcode_allocations
  ADD CONSTRAINT smartcode_allocations_source_check
  CHECK (source IN ('purchase', 'care_club', 'bonus', 'ocr', 'voice', 'whatsapp', 'offline', 'manual'));

-- ============================================================================
-- 3. ADD entry_source column for tracking future input methods
-- ============================================================================

-- Track how the SmartCode entry was created (text, ocr, voice, whatsapp, offline, manual)
ALTER TABLE smartcode_allocations
  ADD COLUMN IF NOT EXISTS entry_source text DEFAULT 'manual'
  CHECK (entry_source IN ('text', 'ocr', 'voice', 'whatsapp', 'offline', 'manual', 'ai_auto'));

-- ============================================================================
-- 4. ADD label column for My SmartCodes (optional user-defined label)
-- ============================================================================

ALTER TABLE smartcode_allocations
  ADD COLUMN IF NOT EXISTS label text;

-- ============================================================================
-- 5. INDEX for My SmartCodes page queries
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_my_smartcodes
  ON smartcode_allocations(user_id, is_active, created_at DESC);

-- ============================================================================
-- 6. VERIFY RLS is enabled
-- ============================================================================

-- RLS was already enabled in migration 052. Verify it's still on.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'smartcode_allocations' AND rowsecurity = true
  ) THEN
    ALTER TABLE smartcode_allocations ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================================================
-- 7. VERIFY RLS POLICIES exist
-- ============================================================================

-- The policy "user_allocations_all" was created in migration 052.
-- Verify it exists; if not, recreate it.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'smartcode_allocations' AND policyname = 'user_allocations_all'
  ) THEN
    CREATE POLICY "user_allocations_all" ON smartcode_allocations
      FOR ALL TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================================
-- 8. ADD updated_at trigger (if not already present)
-- ============================================================================

-- Ensure updated_at is always set on modifications
CREATE OR REPLACE FUNCTION update_smartcode_allocations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_smartcode_allocations_updated_at ON smartcode_allocations;
CREATE TRIGGER trigger_smartcode_allocations_updated_at
  BEFORE UPDATE ON smartcode_allocations
  FOR EACH ROW EXECUTE FUNCTION update_smartcode_allocations_updated_at();
