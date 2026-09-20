import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Dedicated Anubama Supabase credentials should strictly be loaded from environment variables.
// If not provided, the application safely operates in isolated LOCAL FALLBACK MODE.
const supabaseUrl =
  import.meta.env?.VITE_ANUBAMA_SUPABASE_URL ||
  import.meta.env?.VITE_SUPABASE_URL ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const supabaseKey =
  import.meta.env?.VITE_ANUBAMA_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env?.VITE_ANUBAMA_SUPABASE_ANON_KEY ||
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseKey) return false;
  try {
    const url = new URL(supabaseUrl);
    return Boolean(url.hostname && supabaseKey.length > 20);
  } catch {
    return false;
  }
};

export const getDataMode = (): 'LOCAL FALLBACK' | 'ANUBAMA SUPABASE' => {
  return isSupabaseConfigured() ? 'ANUBAMA SUPABASE' : 'LOCAL FALLBACK';
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (!clientInstance) {
    try {
      clientInstance = createClient(supabaseUrl, supabaseKey);
    } catch (err) {
      console.warn('Failed to initialize dedicated Anubama Supabase client:', err);
      return null;
    }
  }
  return clientInstance;
};

export const supabase = getSupabaseClient();
