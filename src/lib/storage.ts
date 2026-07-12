import { supabase } from './supabase';

export type StorageBucket = 'profile-photos' | 'bill-uploads' | 'product-images' | 'receipts';

function getExt(file: File): string {
  const parts = file.name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
}

export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  userId?: string
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  try {
    const ext = getExt(file);
    const prefix = userId ? `${userId}/` : '';
    const filePath = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) return { url: null, path: null, error: uploadError.message };

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    if (bucket === 'profile-photos' || bucket === 'product-images') {
      return { url: data.publicUrl, path: filePath, error: null };
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600);

    if (signedError) return { url: null, path: filePath, error: signedError.message };

    return { url: signedData.signedUrl, path: filePath, error: null };
  } catch (err: any) {
    return { url: null, path: null, error: err.message || 'Upload failed' };
  }
}

export async function removeFile(bucket: StorageBucket, path: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Delete failed' };
  }
}
