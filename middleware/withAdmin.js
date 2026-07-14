import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Hardcoded admin emails as fallback when metadata role is not set
const ADMIN_EMAILS = [
  'rohanhiremathswami99@gmail.com',
  'rohanhiremathswami73@gmail.com',
];

export async function withAdmin(request) {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return Response.json({ success: false, error: 'Unauthorised: Missing or invalid token format' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return Response.json({ success: false, error: 'Unauthorised: Invalid session' }, { status: 401 });
    }

    // Check if user has an admin or owner role in their metadata/email
    const metaRole = user.user_metadata?.role;
    const userEmail = (user.email || '').trim().toLowerCase();
    const hasAccess =
      metaRole === 'admin' ||
      metaRole === 'owner' ||
      ADMIN_EMAILS.includes(userEmail) ||
      userEmail === 'mjlaxmijw@gmail.com';

    if (!hasAccess) {
      return Response.json({ success: false, error: 'Forbidden: Admin or Owner access required' }, { status: 403 });
    }

    return null; // Allow through
  } catch (error) {
    console.error('[withAdmin middleware error]:', error.message);
    return Response.json({ success: false, error: 'Internal server error in authorization' }, { status: 500 });
  }
}
