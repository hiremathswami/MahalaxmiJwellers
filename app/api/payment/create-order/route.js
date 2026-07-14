import { razorpay } from '@/lib/razorpay';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { amount } = body;

    if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
      return Response.json({ success: false, error: 'Valid amount in paise is required' }, { status: 400 });
    }

    const receipt = `rcpt_${Date.now()}`;

    // Create a Razorpay Order
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(Number(amount)), // Amount must be integer paise
        currency: 'INR',
        receipt: receipt
      });
    } catch (razorpayError) {
      console.error('[payment/create-order Razorpay SDK error]:', razorpayError);
      return Response.json({ success: false, error: `Razorpay order creation failed: ${razorpayError.description || razorpayError.message}` }, { status: 500 });
    }

    return Response.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    });
  } catch (error) {
    console.error('[payment/create-order unexpected error]:', error.message);
    return Response.json({ success: false, error: 'An unexpected error occurred while generating payment order' }, { status: 500 });
  }
}
