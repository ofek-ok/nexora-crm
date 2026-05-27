import { createClient } from '@supabase/supabase-js';

const cleanEnvVar = (val: string | undefined): string => {
  if (!val) return '';
  let clean = val.trim();
  // Strip wrapping single or double quotes if present (common copy-paste error)
  if (
    (clean.startsWith('"') && clean.endsWith('"')) || 
    (clean.startsWith("'") && clean.endsWith("'"))
  ) {
    clean = clean.slice(1, -1).trim();
  }
  return clean;
};

const supabaseUrl = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

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
 * Log Supabase initialization status in development/production browser console for debugging.
 */
if (typeof window !== 'undefined') {
  if (isSupabaseConfigured) {
    const maskedKey = supabaseAnonKey.length > 8 
      ? `${supabaseAnonKey.substring(0, 6)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 4)}`
      : 'invalid-length';
    console.log('Nexora CRM: Supabase database is configured.');
    console.log('Nexora CRM Debug - URL:', supabaseUrl);
    console.log('Nexora CRM Debug - Anon Key:', maskedKey, `(Length: ${supabaseAnonKey.length})`);
  } else {
    console.warn('Nexora CRM: Running in local mock mode (data saved in LocalStorage).');
    console.warn('Nexora CRM Debug - Raw URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.warn('Nexora CRM Debug - Raw Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing/Empty');
  }
}

