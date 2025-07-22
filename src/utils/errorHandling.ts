// utils/errorHandling.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error);
  throw new Error(error.message || 'Storage operation failed');
};

export const validateImageFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum 5MB allowed.');
  }
};