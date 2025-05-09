import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

/**
 * Supabase URL from environment variables
 * In development, this should be set in .env.local
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

/**
 * Supabase anon key from environment variables
 * In development, this should be set in .env.local
 */
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Check if Supabase is configured
 */
export const IS_SUPABASE_CONFIGURED = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

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
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-application-name': 'viewzenix',
      },
    },
  }
);

/**
 * Check if Supabase is available by making a test query
 * @returns Promise resolving to boolean indicating if Supabase is available
 */
export async function isSupabaseAvailable(): Promise<boolean> {
  if (!IS_SUPABASE_CONFIGURED) {
    return false;
  }
  
  try {
    const { error } = await supabase.from('webhooks').select('count');
    return !error;
  } catch (err) {
    console.warn('Error checking Supabase availability:', err);
    return false;
  }
} 