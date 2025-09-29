import { createClient } from '@supabase/supabase-js';

/**
 * Public client — NEVER put service/secrets in client code.
 * Values come from Vite env with VITE_ prefix.
 */
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
