-- Add photo_url column to profiles for profile photo storage
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url text;
