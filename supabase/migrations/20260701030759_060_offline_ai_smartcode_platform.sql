-- ============================================================================
-- VLOOP OFFLINE AI SMARTCODE PLATFORM — Phase 32
-- ============================================================================
--
-- This migration upgrades the offline_smartcode_entries table to support
-- the enterprise Offline AI SmartCode Platform with three entry methods:
--   A. Digital Entry (in-app)
--   B. Manual Entry (unlimited 3-digit codes)
--   C. Offline AI Entry (paper photo + OCR)
--
-- Changes:
--   1. Add `entry_method` column — tracks which of the 3 methods was used
--   2. Add `week_period` column — links to the weekly cycle
--   3. Add `image_hash` column — for duplicate upload detection (SHA-256)
--   4. Add `ocr_confidence` column — OCR confidence score (when OCR is used)
--   5. Add `ocr_provider` column — which OCR provider was used
--   6. Add `customer_name` column — from White Paper Standard format
--   7. Add `purchase_amount` column — from White Paper Standard format
--   8. Add `care_club_contribution` column — from White Paper Standard format
--   9. Add `signature` column — from White Paper Standard format
--  10. Add index on (user_id, week_period) for duplicate detection queries
--  11. Add index on (user_id, entry_method, week_period) for analytics
--  12. Replace the FOR ALL policy with 4 separate CRUD policies (best practice)
--
-- Security:
--   - RLS already enabled (migration 055)
--   - Replacing the single FOR ALL policy with 4 separate policies
--   - All policies scoped to authenticated users owning their rows
--
-- Notes:
--   - No data is lost — all changes are additive
--   - The existing `source` column is preserved (backward compatibility)
--   - The `entry_method` column is the new canonical field
-- ============================================================================

-- ============================================================================
-- 1. ADD entry_method COLUMN
-- ============================================================================
ALTER TABLE offline_smartcode_entries
  ADD COLUMN IF NOT EXISTS entry_method text DEFAULT 'manual'
  CHECK (entry_method IN ('digital', 'manual', 'offline_ai'));

-- ============================================================================
-- 2. ADD week_period COLUMN
-- ============================================================================
ALTER TABLE offline_smartcode_entries
  ADD COLUMN IF NOT EXISTS week_period text;

-- ============================================================================
-- 3. ADD image_hash COLUMN (for duplicate upload detection)
-- ============================================================================
ALTER TABLE offline_smartcode_entries
  ADD COLUMN IF NOT EXISTS image_hash text;

-- ============================================================================
-- 4. ADD ocr_confidence COLUMN
-- ============================================================================
ALTER TABLE offline_smartcode_entries
  ADD COLUMN IF NOT EXISTS ocr_confidence numeric;

-- ============================================================================
-- 5. ADD ocr_provider COLUMN
-- ============================================================================
ALTER TABLE offline_smartcode_entries
  ADD COLUMN IF NOT EXISTS ocr_provider text;

-- ============================================================================
-- 6. ADD White Paper Standard fields
-- ============================================================================
ALTER TABLE offline_smartcode_entries
  ADD COLUMN IF NOT EXISTS customer_name text;

ALTER TABLE offline_smartcode_entries
  ADD COLUMN IF NOT EXISTS purchase_amount numeric;

ALTER TABLE offline_smartcode_entries
  ADD COLUMN IF NOT EXISTS care_club_contribution numeric;

ALTER TABLE offline_smartcode_entries
  ADD COLUMN IF NOT EXISTS signature text;

-- ============================================================================
-- 7. ADD INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_offline_entries_user_week
  ON offline_smartcode_entries(user_id, week_period);

CREATE INDEX IF NOT EXISTS idx_offline_entries_method
  ON offline_smartcode_entries(user_id, entry_method, week_period);

CREATE INDEX IF NOT EXISTS idx_offline_entries_status
  ON offline_smartcode_entries(status, week_period);

-- ============================================================================
-- 8. REPLACE FOR ALL POLICY WITH 4 SEPARATE CRUD POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "user_offline_entries_all" ON offline_smartcode_entries;

DROP POLICY IF EXISTS "user_offline_select" ON offline_smartcode_entries;
CREATE POLICY "user_offline_select" ON offline_smartcode_entries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_offline_insert" ON offline_smartcode_entries;
CREATE POLICY "user_offline_insert" ON offline_smartcode_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_offline_update" ON offline_smartcode_entries;
CREATE POLICY "user_offline_update" ON offline_smartcode_entries
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_offline_delete" ON offline_smartcode_entries;
CREATE POLICY "user_offline_delete" ON offline_smartcode_entries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
