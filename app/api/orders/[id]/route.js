import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

const VALID_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[orders/[id] GET query error]:', error.message);
      return Response.json({ success: false, error: 'Failed to retrieve order details' }, { status: 500 });
    }

    if (!order) {
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('[orders/[id] GET unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while fetching order' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // 1. Authorize Admin
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    const { id } = await params;

    // 2. Parse Body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { status, tracking_number } = body;

    // 3. Validate status if provided
    if (status && !VALID_STATUSES.includes(status.toLowerCase())) {
      return Response.json({ success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }

    // 4. Verify order exists
    const { data: existingOrder, error: findError } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (findError) {
      console.error('[orders/[id] PUT find error]:', findError.message);
      return Response.json({ success: false, error: 'Error checking order existence' }, { status: 500 });
    }

    if (!existingOrder) {
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // 5. Build updates
    const updates = {};
    if (status !== undefined) updates.status = status.toLowerCase();
    if (tracking_number !== undefined) updates.tracking_number = tracking_number || null;

    // 6. Perform Update
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[orders/[id] PUT update error]:', updateError.message);
      return Response.json({ success: false, error: 'Failed to update order details' }, { status: 500 });
    }

    return Response.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error('[orders/[id] PUT unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while updating order' }, { status: 500 });
  }
}
