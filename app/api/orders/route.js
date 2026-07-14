import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdmin } from '@/middleware/withAdmin';

export async function GET(request) {
  try {
    // Admin only check
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('orders')
      .select('*');

    if (status) {
      query = query.eq('status', status.toLowerCase());
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('[orders GET query error]:', error.message);
      return Response.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }

    return Response.json({
      success: true,
      orders: orders || []
    });
  } catch (error) {
    console.error('[orders GET unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while fetching orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Admin only check for direct order creation via API
    const adminError = await withAdmin(request);
    if (adminError) return adminError;

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const {
      customer_name,
      customer_email,
      customer_phone,
      items,
      total_amount,
      address_line1,
      address_city,
      address_state,
      address_pincode,
      status,
      payment_id,
      razorpay_order_id,
      notes
    } = body;

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !items || total_amount === undefined || total_amount === null) {
      return Response.json({ success: false, error: 'Missing required order fields (customer details, items, or total_amount)' }, { status: 400 });
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        items,
        total_amount: Number(total_amount),
        address_line1: address_line1 || null,
        address_city: address_city || null,
        address_state: address_state || null,
        address_pincode: address_pincode || null,
        status: status || 'pending',
        payment_id: payment_id || null,
        razorpay_order_id: razorpay_order_id || null,
        notes: notes || null
      })
      .select()
      .single();

    if (error) {
      console.error('[orders POST error]:', error.message);
      return Response.json({ success: false, error: 'Failed to create order record' }, { status: 500 });
    }

    return Response.json({
      success: true,
      order
    }, { status: 201 });
  } catch (error) {
    console.error('[orders POST unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while creating order' }, { status: 500 });
  }
}
