// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

//const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hphbddrjfwidtmdlmufz.supabase.co';
//const supabaseKey = process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGJkZHJqZndpZHRtZGxtdWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODIwODIsImV4cCI6MjA2ODM1ODA4Mn0.KJq4lyXIw9-1aezELhsm-GJo3RPsqjP35BBymSeo12Y';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be defined in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads multiple product images to Supabase Storage
 * @param files - FileList containing the images to upload
 * @param productId - ID of the product these images belong to
 * @param onProgress - Optional progress callback
 * @returns Array of public URLs for the uploaded images
 */
export const uploadProductImages = async (
  files: FileList, 
  productId: string,
  onProgress?: (progress: number) => void
) => {
  const filesArray = Array.from(files);
  const uploadedUrls: string[] = [];

  for (let i = 0; i < filesArray.length; i++) {
    const file = filesArray[i];
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}-${i}.${fileExt}`;
    const filePath = `${productId}/${fileName}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    uploadedUrls.push(publicUrl);

    // Update progress
    if (onProgress) {
      const progress = Math.floor(((i + 1) / filesArray.length) * 100);
      onProgress(progress);
    }
  }

  return uploadedUrls;
};

/**
 * Deletes a product image from Supabase Storage
 * @param imageUrl - The full public URL of the image to delete
 */
export const deleteProductImage = async (imageUrl: string) => {
  try {
    // Extract the file path from the full URL
    const url = new URL(imageUrl);
    const filePath = url.pathname.split('/storage/v1/object/public/product-images/')[1];
    
    if (!filePath) {
      throw new Error('Could not extract file path from URL');
    }

    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting product image:', error);
    throw error;
  }
};