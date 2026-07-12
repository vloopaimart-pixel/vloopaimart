-- Create storage buckets for profile photos, bill uploads, product images, and receipts
-- These are public-read buckets (images need to be publicly viewable)

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('profile-photos', 'profile-photos', true),
  ('bill-uploads', 'bill-uploads', false),
  ('product-images', 'product-images', true),
  ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage.objects
-- profile-photos: users can CRUD their own files
CREATE POLICY "profile_photos_read" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'profile-photos');
CREATE POLICY "profile_photos_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'profile-photos');
CREATE POLICY "profile_photos_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'profile-photos' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'profile-photos' AND owner = auth.uid());
CREATE POLICY "profile_photos_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'profile-photos' AND owner = auth.uid());

-- bill-uploads: users can CRUD their own files, admins can read all
CREATE POLICY "bill_uploads_read_own" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'bill-uploads' AND owner = auth.uid());
CREATE POLICY "bill_uploads_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'bill-uploads');
CREATE POLICY "bill_uploads_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'bill-uploads' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'bill-uploads' AND owner = auth.uid());
CREATE POLICY "bill_uploads_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'bill-uploads' AND owner = auth.uid());

-- product-images: anyone can read, admins can write
CREATE POLICY "product_images_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');
CREATE POLICY "product_images_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "product_images_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "product_images_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'product-images');

-- receipts: users can CRUD their own files
CREATE POLICY "receipts_read_own" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'receipts' AND owner = auth.uid());
CREATE POLICY "receipts_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'receipts');
CREATE POLICY "receipts_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'receipts' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'receipts' AND owner = auth.uid());
CREATE POLICY "receipts_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'receipts' AND owner = auth.uid());
