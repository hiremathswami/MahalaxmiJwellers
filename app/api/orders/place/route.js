import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { orderData } = body;

    if (!orderData) {
      return Response.json({ success: false, error: 'Missing order data' }, { status: 400 });
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
      notes,
      user_id
    } = orderData;

    if (!customer_name || !customer_email || !customer_phone || !items || total_amount === undefined || total_amount === null) {
      return Response.json({ success: false, error: 'Missing required order details' }, { status: 400 });
    }

    // Create pending order record in Database for COD
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user_id || null,
        customer_name,
        customer_email,
        customer_phone,
        items,
        total_amount: Number(total_amount),
        address_line1: address_line1 || null,
        address_city: address_city || null,
        address_state: address_state || null,
        address_pincode: address_pincode || null,
        status: 'pending', // Pending for COD until delivered
        notes: notes || null
      })
      .select()
      .single();

    if (orderError) {
      console.error('[orders/place error]:', orderError.message);
      return Response.json({ success: false, error: 'Failed to record the order' }, { status: 500 });
    }

    // Decrement Stock for each purchased item
    try {
      if (Array.isArray(items)) {
        for (const item of items) {
          const productId = item.product_id || item.id;
          const quantity = parseInt(item.quantity || 1, 10);

          if (productId) {
            // Retrieve current stock
            const { data: product, error: fetchErr } = await supabaseAdmin
              .from('products')
              .select('stock')
              .eq('id', productId)
              .maybeSingle();

            if (!fetchErr && product) {
              const currentStock = product.stock || 0;
              const newStock = Math.max(0, currentStock - quantity);

              // Update stock
              await supabaseAdmin
                .from('products')
                .update({ stock: newStock })
                .eq('id', productId);
            }
          }
        }
      }
    } catch (stockError) {
      console.error('[orders/place stock update failed]:', stockError.message);
    }

    return Response.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('[orders/place unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while placing the order' }, { status: 500 });
  }
}
