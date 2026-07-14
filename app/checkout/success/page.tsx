'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/data/products';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
          if (error) throw error;
          setOrder(data);
        } catch (err) {
          console.error('Error loading order on success page:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center">
        <p className="text-warm-gray">Loading confirmation details...</p>
      </div>
    );
  }

  const estimatedDelivery = () => {
    if (!order) return '';
    const date = new Date(order.created_at || Date.now());
    const daysToAdd = order.shipping_method === 'express' ? 3 : 7;
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 px-6 sm:px-10 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-champagne border border-gray-100 flex items-center justify-center rounded-full mx-auto shadow-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-silver-dark font-medium">Payment Successful</span>
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-charcoal font-bold leading-tight">
            Thank You for Your Order
          </h1>
          <p className="text-warm-gray max-w-md mx-auto text-sm leading-relaxed">
            Your payment was processed successfully. A confirmation email with tracking details has been sent.
          </p>
        </div>

        {order && (
          <div className="border border-gray-200 bg-champagne p-6 sm:p-8 rounded-2xl text-left space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-200/50 pb-4">
              <div>
                <span className="text-[10px] text-warm-gray uppercase tracking-wider block">Order ID</span>
                <span className="text-xs font-mono text-charcoal font-medium">{order.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-warm-gray uppercase tracking-wider block">Estimated Delivery</span>
                <span className="text-sm text-charcoal font-medium">{estimatedDelivery()}</span>
              </div>
            </div>

            {/* Items Summary list */}
            <div className="space-y-4">
              <h3 className="text-[10px] text-warm-gray uppercase tracking-wider font-semibold">Items Purchased</h3>
              <div className="space-y-3">
                {order.items?.map((item: any) => (
                  <div key={item.product?.id || item.id} className="flex justify-between items-center text-sm">
                    <span className="text-charcoal font-medium truncate max-w-sm">
                      {item.product?.name} <span className="text-xs text-warm-gray font-normal">x {item.quantity}</span>
                    </span>
                    <span className="text-charcoal font-medium">{formatPrice((item.product?.price || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="border-t border-gray-200/50 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-warm-gray">
                <span>Subtotal</span>
                <span>{formatPrice(parseFloat(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-warm-gray">
                <span>Shipping ({order.shipping_method === 'express' ? 'Express' : 'Standard'})</span>
                <span>{parseFloat(order.shipping) === 0 ? 'FREE' : formatPrice(parseFloat(order.shipping))}</span>
              </div>
              <div className="flex justify-between text-warm-gray">
                <span>GST (3%)</span>
                <span>{formatPrice(parseFloat(order.gst))}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-charcoal pt-2 border-t border-gray-200/20">
                <span>Paid Total</span>
                <span>{formatPrice(parseFloat(order.total))}</span>
              </div>
            </div>

            {/* Shipping Address Summary */}
            <div className="border-t border-gray-200/50 pt-4 text-xs text-warm-gray">
              <strong className="text-charcoal block mb-1">Delivering to:</strong>
              <p>
                {order.address?.fullName}<br />
                {order.address?.line1}, {order.address?.line2 ? `${order.address.line2}, ` : ''}
                {order.address?.city}, {order.address?.state} - {order.address?.pincode}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth" className="btn-gold px-8 py-3 text-xs w-full sm:w-auto">
            View Order History
          </Link>
          <Link href="/shop" className="btn-ghost-gold px-8 py-3 text-xs w-full sm:w-auto">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center">
        <p className="text-warm-gray text-sm">Loading order details...</p>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
