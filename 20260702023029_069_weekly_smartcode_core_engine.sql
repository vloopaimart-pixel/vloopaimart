/*
# Phase 49 — Smart Commerce: Purchase Bills Engine

## Summary
Creates the `purchase_bills` table to support the Smart Commerce Foundation.
Members can upload purchase bills/receipts after a successful cart checkout.
The system uses the existing OCR architecture (architecture-ready, no live OCR yet)
to extract structured data from uploaded bill images.

## New Tables

### `purchase_bills`
Stores metadata and extracted data for every bill a member uploads.
- `id` — UUID primary key
- `user_id` — FK to auth.users, the member who uploaded
- `order_id` — nullable FK to orders table (links the bill to a specific order)
- `storage_path` — path in Supabase Storage `bill-uploads` bucket
- `storage_url` — signed/public URL for display (refreshed on read)
- `file_name` — original file name as uploaded
- `file_size_bytes` — file size for audit
- `mime_type` — e.g. image/jpeg, image/png, application/pdf
- `status` — `pending` | `verified` | `rejected`
- `verification_note` — admin or system note explaining rejection/approval
- `ocr_raw_text` — raw text extracted by OCR (null until OCR runs)
- `ocr_confidence` — 0.0–1.0 confidence from OCR engine (null until OCR runs)
- `ocr_provider` — which OCR provider ran (null until configured)
- `store_name` — extracted store/merchant name
- `invoice_number` — extracted invoice/bill number (unique per user for duplicate detection)
- `invoice_date` — extracted invoice date
- `extracted_products` — JSONB array of { name, quantity, unit_price, total }
- `total_amount` — extracted total from bill
- `currency` — currency code, default INR
- `is_duplicate` — true if another bill with same invoice_number+user_id already exists
- `duplicate_of` — if is_duplicate=true, points to the original bill id
- `manually_entered` — true if data was typed in rather than OCR-extracted
- `created_at` — upload timestamp
- `updated_at` — last modification timestamp

## Security
- RLS enabled
- 4 separate policies (SELECT/INSERT/UPDATE/DELETE) scoped to `authenticated`
- Users can only see, insert, and update their own bills
- Users cannot delete bills (admin-managed for audit integrity)
- owner column defaults to `auth.uid()` so client inserts without passing user_id still work

## Indexes
- `purchase_bills_user_id_idx` on user_id for fast per-user queries
- `purchase_bills_status_idx` on status for admin filtering
- `purchase_bills_invoice_number_idx` on (user_id, invoice_number) for duplicate detection
*/

CREATE TABLE IF NOT EXISTS purchase_bills (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id           uuid REFERENCES orders(id) ON DELETE SET NULL,
  storage_path       text,
  storage_url        text,
  file_name          text,
  file_size_bytes    bigint,
  mime_type          text,
  status             text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verification_note  text,
  ocr_raw_text       text,
  ocr_confidence     numeric(4,3),
  ocr_provider       text,
  store_name         text,
  invoice_number     text,
  invoice_date       date,
  extracted_products jsonb DEFAULT '[]'::jsonb,
  total_amount       numeric(12,2),
  currency           text NOT NULL DEFAULT 'INR',
  is_duplicate       boolean NOT NULL DEFAULT false,
  duplicate_of       uuid REFERENCES purchase_bills(id) ON DELETE SET NULL,
  manually_entered   boolean NOT NULL DEFAULT false,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_purchase_bills_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_purchase_bills_updated_at ON purchase_bills;
CREATE TRIGGER trg_purchase_bills_updated_at
  BEFORE UPDATE ON purchase_bills
  FOR EACH ROW EXECUTE FUNCTION update_purchase_bills_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS purchase_bills_user_id_idx ON purchase_bills(user_id);
CREATE INDEX IF NOT EXISTS purchase_bills_status_idx ON purchase_bills(status);
CREATE INDEX IF NOT EXISTS purchase_bills_invoice_number_idx ON purchase_bills(user_id, invoice_number);

-- RLS
ALTER TABLE purchase_bills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bills" ON purchase_bills;
CREATE POLICY "select_own_bills" ON purchase_bills FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bills" ON purchase_bills;
CREATE POLICY "insert_own_bills" ON purchase_bills FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bills" ON purchase_bills;
CREATE POLICY "update_own_bills" ON purchase_bills FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "no_delete_bills" ON purchase_bills;
CREATE POLICY "no_delete_bills" ON purchase_bills FOR DELETE
  TO authenticated USING (false);
