/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';

//const supabaseUrl = process.env.SUPABASE_URL || 'https://hphbddrjfwidtmdlmufz.supabase.co';
//const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGJkZHJqZndpZHRtZGxtdWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODIwODIsImV4cCI6MjA2ODM1ODA4Mn0.KJq4lyXIw9-1aezELhsm-GJo3RPsqjP35BBymSeo12Y';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Storage Service
export const storageService = {
  BUCKETS: {
    PRODUCT_IMAGES: 'product-images',
    DOCUMENTS: 'documents'
  },

  /**
   * Uploads a file to storage
   * @param bucket - The storage bucket name
   * @param path - The path including filename (e.g., 'products/123-image.jpg')
   * @param file - The File object to upload
   * @param options - Upload options
   */
  upload: async (
    bucket: string, 
    path: string, 
    file: File, 
    options?: {
      cacheControl?: string;
      upsert?: boolean;
    }
  ) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'File upload failed');
    }
    return data;
  },

  /**
   * Gets public URL for a stored file
   * @param bucket - The storage bucket name
   * @param path - The file path
   */
  getPublicUrl: (bucket: string, path: string) => {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return publicUrl;
  },

  /**
   * Downloads a file from storage
   * @param bucket - The storage bucket name
   * @param path - The file path
   */
  download: async (bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      console.error('Download error:', error);
      throw new Error(error.message || 'File download failed');
    }
    return data;
  },

  /**
   * Deletes files from storage
   * @param bucket - The storage bucket name
   * @param paths - Array of file paths to delete
   */
  remove: async (bucket: string, paths: string[]) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(paths);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(error.message || 'File deletion failed');
    }
    return data;
  },

  /**
   * Lists files in a bucket
   * @param bucket - The storage bucket name
   * @param path - Optional folder path
   */
  list: async (bucket: string, path?: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);

    if (error) {
      console.error('List error:', error);
      throw new Error(error.message || 'Failed to list files');
    }
    return data;
  }
};

// Auth Service
export const authService = {
  /**
   * Signs in a user with email and password
   * @param credentials - Email and password
   */
  signIn: async (credentials: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Authentication failed');
    }
    return data;
  },

  /**
   * Signs out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Sign out failed');
    }
  },

  /**
   * Gets the current authenticated user
   */
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get user error:', error);
      throw new Error(error.message || 'Failed to get user');
    }
    return user;
  },

  /**
   * Updates user information
   * @param attributes - User attributes to update
   */
  updateUser: async (attributes: { email?: string; password?: string; data?: any }) => {
    const { data, error } = await supabase.auth.updateUser(attributes);
    
    if (error) {
      console.error('Update user error:', error);
      throw new Error(error.message || 'Failed to update user');
    }
    return data;
  },

  /**
   * Sends a password reset email
   * @param email - User's email address
   */
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to send reset email');
    }
    return data;
  }
};

// Database Service
export const databaseService = {
  /**
   * Fetches data from a table
   * @param table - Table name
   * @param columns - Columns to select
   */
  fetch: async <T>(table: string, columns: string = '*') => {
    const { data, error } = await supabase
      .from(table)
      .select(columns);

    if (error) {
      console.error('Fetch error:', error);
      throw new Error(error.message || 'Failed to fetch data');
    }
    return data as T[];
  },

  /**
   * Inserts data into a table
   * @param table - Table name
   * @param values - Data to insert
   */
  insert: async <T>(table: string, values: Partial<T> | Partial<T>[]) => {
    const { data, error } = await supabase
      .from(table)
      .insert(values)
      .select();

    if (error) {
      console.error('Insert error:', error);
      throw new Error(error.message || 'Failed to insert data');
    }
    return data as T[];
  },

  /**
   * Updates data in a table
   * @param table - Table name
   * @param values - Data to update
   * @param match - Matching criteria
   */
  update: async <T>(table: string, values: Partial<T>, match: Record<string, any>) => {
    const { data, error } = await supabase
      .from(table)
      .update(values)
      .match(match)
      .select();

    if (error) {
      console.error('Update error:', error);
      throw new Error(error.message || 'Failed to update data');
    }
    return data as T[];
  },

  /**
   * Deletes data from a table
   * @param table - Table name
   * @param match - Matching criteria
   */
  delete: async (table: string, match: Record<string, any>) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match(match);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(error.message || 'Failed to delete data');
    }
    return data;
  }
};

// Helper function for product image uploads
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

    try {
      await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (publicUrl) {
        uploadedUrls.push(publicUrl);
      }

      if (onProgress) {
        const progress = Math.floor(((i + 1) / filesArray.length) * 100);
        onProgress(progress);
      }
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      throw new Error(`Failed to upload ${file.name}`);
    }
  }

  return uploadedUrls;
};
export const deleteProductImage = async (imageUrl: string) => {
  try {
    const bucket = storageService.BUCKETS.PRODUCT_IMAGES;

    // Get base public URL for product images bucket
    const baseUrl = supabase.storage
      .from(bucket)
      .getPublicUrl('')
      .data.publicUrl;

    if (!baseUrl) throw new Error('Could not determine storage base URL');

    // Remove the baseUrl part from the full URL to get the relative file path
    const filePath = imageUrl.replace(`${baseUrl}/`, '');

    // Call remove with an array of paths
    const result = await storageService.remove(bucket, [filePath]);

    return result;
  } catch (error) {
    console.error('Error deleting product image:', error);
    throw error;
  }
};
