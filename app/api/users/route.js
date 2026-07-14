import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

export async function GET(request) {
  try {
    // Admin check
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    // Fetch Auth users
    const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) {
      console.error('[users GET auth error]:', authError.message);
      return Response.json({ success: false, error: 'Failed to fetch registered users' }, { status: 500 });
    }

    // Fetch Profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*');
    
    if (profileError) {
      console.error('[users GET profiles error]:', profileError.message);
    }

    // Fetch Orders
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*');

    if (ordersError) {
      console.error('[users GET orders error]:', ordersError.message);
    }

    // Create a map of profiles by user ID
    const profilesMap = (profiles || []).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});

    // Filter out users who have a role of 'admin' or 'owner' in their metadata
    const customerUsers = (authUsers || []).filter(u => {
      const role = u.user_metadata?.role;
      return role !== 'admin' && role !== 'owner';
    });

    // Merge authentication details, profiles, and order histories
    const mergedUsers = customerUsers.map(u => {
      const profile = profilesMap[u.id] || {};
      
      // Match orders by user_id OR customer_email matching user's email
      const userOrders = (orders || []).filter(o => 
        o.user_id === u.id || 
        (o.customer_email && o.customer_email.toLowerCase() === u.email.toLowerCase())
      );

      // Sort user orders newest first
      userOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        name: profile.name || u.user_metadata?.name || null,
        phone: profile.phone || u.phone || u.user_metadata?.phone || null,
        addresses: u.user_metadata?.addresses || [],
        orders: userOrders
      };
    });

    return Response.json({
      success: true,
      users: mergedUsers
    });
  } catch (error) {
    console.error('[users GET unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while fetching users' }, { status: 500 });
  }
}
