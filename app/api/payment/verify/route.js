import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = body;

    // 1. Validation of Razorpay details
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ success: false, error: 'Missing Razorpay parameters' }, { status: 400 });
    }

    if (!orderData) {
      return Response.json({ success: false, error: 'Missing order data to verify' }, { status: 400 });
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

    // 2. Verify Razorpay Payment Signature
    const secret = process.env.RAZORPAY_SECRET || '';
    const signPayload = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signPayload)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('[payment/verify]: Signature verification failed');
      return Response.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
    }

    // 3. Create confirmed order record in Database
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
        status: 'confirmed', // Mark confirmed since payment is verified
        payment_id: razorpay_payment_id,
        razorpay_order_id,
        notes: notes || null
      })
      .select()
      .single();

    if (orderError) {
      console.error('[payment/verify order save error]:', orderError.message);
      return Response.json({ success: false, error: 'Failed to record the completed order' }, { status: 500 });
    }

    // 4. Decrement Stock for each purchased item
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
      // Log stock decrement issues but don't fail the order success response since payment was already taken
      console.error('[payment/verify stock update failed]:', stockError.message);
    }

    return Response.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('[payment/verify unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred during payment verification' }, { status: 500 });
  }
}
