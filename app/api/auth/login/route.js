import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('[auth/login error]:', error.message);
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    return Response.json({
      success: true,
      session: {
        access_token: data.session?.access_token,
        user: data.user
      }
    });
  } catch (error) {
    console.error('[auth/login unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected authentication error occurred' }, { status: 500 });
  }
}
