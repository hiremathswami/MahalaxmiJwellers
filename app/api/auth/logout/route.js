import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[auth/logout error]:', error.message);
      return Response.json({ success: false, error: 'Sign out failed' }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'Logged out'
    });
  } catch (error) {
    console.error('[auth/logout unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected logout error occurred' }, { status: 500 });
  }
}
