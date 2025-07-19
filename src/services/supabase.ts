import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://hphbddrjfwidtmdlmufz.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaGJkZHJqZndpZHRtZGxtdWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODIwODIsImV4cCI6MjA2ODM1ODA4Mn0.KJq4lyXIw9-1aezELhsm-GJo3RPsqjP35BBymSeo12Y';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Storage functions
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;
  return data;
};

export const getFileUrl = (bucket: string, path: string) => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  return publicUrl;
};

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};