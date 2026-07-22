import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.mahalaxmi_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.mahalaxmi_SUPABASE_SERVICE_ROLE_KEY || process.env.mahalaxmi_SUPABASE_SECRET_KEY || 'placeholder-key';

if ((!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.mahalaxmi_SUPABASE_URL) || 
    (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.mahalaxmi_SUPABASE_SERVICE_ROLE_KEY && !process.env.mahalaxmi_SUPABASE_SECRET_KEY)) {
  console.warn('Supabase Admin Client: URL or Service Key is missing. Using placeholders.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
