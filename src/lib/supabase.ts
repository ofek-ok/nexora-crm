import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = 
  Boolean(supabaseUrl) && 
  Boolean(supabaseAnonKey) && 
  supabaseUrl !== 'placeholder-url' && 
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseUrl !== 'undefined' &&
  supabaseAnonKey !== 'undefined' &&
  supabaseUrl !== 'null' &&
  supabaseAnonKey !== 'null';

// Initialize the Supabase client safely
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Log Supabase initialization status in development.
 */
if (typeof window !== 'undefined') {
  if (isSupabaseConfigured) {
    console.log('Nexora CRM: Supabase database is connected.');
  } else {
    console.log('Nexora CRM: Running in local mock mode (data saved in LocalStorage). To use Supabase, configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.');
  }
}
