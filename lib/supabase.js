import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.mahalaxmi_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_mahalaxmi_SUPABASE_PUBLISHABLE_KEY || process.env.mahalaxmi_SUPABASE_ANON_KEY || 'placeholder-key';

if ((!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.mahalaxmi_SUPABASE_URL) || 
    (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_mahalaxmi_SUPABASE_PUBLISHABLE_KEY && !process.env.mahalaxmi_SUPABASE_ANON_KEY)) {
  console.warn('Supabase Client: URL or Anon Key is missing. Using placeholders.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

