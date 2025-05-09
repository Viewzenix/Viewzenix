import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const IS_SUPABASE_CONFIGURED = supabaseUrl !== '' && supabaseKey !== '';

// Warn if Supabase is not configured
if (typeof window !== 'undefined' && !IS_SUPABASE_CONFIGURED) {
  console.warn(
    'Supabase URL or Anonymous Key missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables. ' +
    'Falling back to localStorage only.'
  );
}

/**
 * Create a single Supabase client for the entire app
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Check if Supabase is available
 */
export const isSupabaseAvailable = async (): Promise<boolean> => {
  if (!IS_SUPABASE_CONFIGURED) {
    return false;
  }
  
  try {
    // Simple query to check if we can connect
    const { error } = await supabase.from('webhooks').select('count');
    return !error;
  } catch (e) {
    console.error('Supabase connection error:', e);
    return false;
  }
}; 