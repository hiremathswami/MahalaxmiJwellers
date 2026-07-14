'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { getOrder, updateOrder } from '@/lib/panelApi';
import OrderStatusBadge from '@/components/panels/OrderStatusBadge';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Package, 
  Phone, 
  Truck, 
  PackageCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function OwnerOrderDetailPage({ setTitle }) {
  const { accessToken } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  // Tracking form field
  const [trackingNumber, setTrackingNumber] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (setTitle) setTitle('Order Packing Slip');
  }, [setTitle]);

  const fetchOrderDetail = async () => {
    if (!accessToken || !id) return;
    setLoading(true);
    try {
      const res = await getOrder(accessToken, id);
      if (res.success && res.order) {
        setOrder(res.order);
        setTrackingNumber(res.order.tracking_number || '');
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [accessToken, id]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleStatusChange = async (nextStatus) => {
    if (!accessToken || !id) return;

    const payload = { status: nextStatus };
    if (nextStatus === 'shipped') {
      const tracking = trackingNumber.trim();
      if (!tracking) {
        showToast('Please enter a tracking number to mark as shipped.', 'error');
        return;
      }
      payload.tracking_number = tracking;
    }

    setUpdating(true);
    try {
      const res = await updateOrder(accessToken, id, payload);
      if (res.success && res.order) {
        setOrder(res.order);
        setTrackingNumber(res.order.tracking_number || '');
        showToast(`Order status updated to ${nextStatus.toUpperCase()}!`);
      } else {
        showToast('Failed to update order status.', 'error');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast(err.message || 'Error occurred.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (!accessToken || !id) return;
    
    setUpdating(true);
    try {
      const res = await updateOrder(accessToken, id, {
        tracking_number: trackingNumber.trim()
      });
      if (res.success && res.order) {
        setOrder(res.order);
        showToast('Tracking number saved!');
      } else {
        showToast('Failed to save tracking number.', 'error');
      }
    } catch (err) {
      console.error('Error saving tracking number:', err);
      showToast(err.message || 'Error occurred.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <h4 className="font-cormorant text-xl font-bold text-red-800">Order Error</h4>
        <p className="text-xs text-red-600 mt-1">{error || 'Order detail could not be retrieved.'}</p>
        <button onClick={() => router.push('/owner/orders')} className="mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </button>
      </div>
    );
  }

  const billingAddress = order.address || {
    line1: order.address_line1 || 'N/A',
    city: order.address_city || 'N/A',
    state: order.address_state || 'N/A',
    pincode: order.address_pincode || 'N/A',
    fullName: order.customer_name || 'N/A'
  };

  return (
    <div className="space-y-8 font-inter relative">
      
      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border transition-all animate-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Back Link */}
      <div>
        <Link 
          href="/owner/orders" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </Link>
      </div>

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order ID (first 8 characters)</span>
          <h1 className="font-mono text-lg font-bold text-gray-900 truncate">
            {order.id.substring(0, 8)}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Items (No Pricing details as requested) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <Package className="w-4.5 h-4.5 text-gray-400" />
              Items to Pack
            </h3>

            <div className="divide-y divide-gray-50">
              {order.items?.map((item) => {
                const name = item.product?.name || item.name || 'Jewellery Piece';
                const images = item.product?.images || item.images || [];
                const firstImage = images.length > 0 ? images[0] : null;

                return (
                  <div key={item.product_id || item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      {firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstImage} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">MJ</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-gray-950 text-xs block">{name}</span>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                        Quantity: {item.quantity} {item.selectedSize ? `· Size: ${item.selectedSize}` : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Customer address & operational buttons */}
        <div className="space-y-6">
          
          {/* Customer profile */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-gray-400" />
              Customer Contact & Address
            </h3>

            <div className="space-y-4 text-xs text-gray-700">
              <div>
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Full Name</span>
                <span className="font-bold text-gray-950">{order.customer_name}</span>
              </div>

              <div>
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Phone Number</span>
                <span className="font-semibold text-gray-950 block">{order.customer_phone}</span>
                <a 
                  href={`tel:${order.customer_phone}`} 
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl font-bold transition-all text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  <Phone className="w-3 h-3" /> Call Customer
                </a>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address
                </span>
                <p className="font-semibold text-gray-900 leading-relaxed">
                  {billingAddress.fullName || order.customer_name}<br />
                  {billingAddress.line1 || order.address_line1}<br />
                  {billingAddress.line2 ? `${billingAddress.line2}, ` : ''}
                  {billingAddress.city || order.address_city}, {billingAddress.state || order.address_state} - {billingAddress.pincode || order.address_pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Operational actions */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3">
              Fulfillment Actions
            </h3>

            <div className="space-y-5">
              {/* Step 1: Pack order */}
              {order.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusChange('packed')}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <PackageCheck className="w-4 h-4" />
                  Mark as Packed
                </button>
              )}

              {/* Step 2: Ship order with tracking number */}
              {order.status === 'packed' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Fulfillment Tracking Number
                    </label>
                    <input
                      type="text"
                      placeholder="EX: BLUEDART12345"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 placeholder-gray-400 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    onClick={() => handleStatusChange('shipped')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Truck className="w-4 h-4" />
                    Mark as Shipped
                  </button>
                </div>
              )}

              {/* Step 3: Mark Delivered */}
              {order.status === 'shipped' && (
                <div className="space-y-4">
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl text-[11px] text-orange-800 font-medium">
                    Tracking ID: <span className="font-bold font-mono">{order.tracking_number}</span>
                  </div>
                  <button
                    onClick={() => handleStatusChange('delivered')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Delivered
                  </button>
                </div>
              )}

              {/* Delivered confirmation */}
              {order.status === 'delivered' && (
                <div className="bg-green-50 border border-green-150 p-4 rounded-xl flex items-center gap-2 text-green-700 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Order successfully packed, shipped, and delivered!
                </div>
              )}

              {/* Save tracking inline if already shipped */}
              {order.status === 'shipped' && (
                <form onSubmit={handleSaveTracking} className="border-t border-gray-100 pt-4 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Update Tracking Number
                    </label>
                    <input
                      type="text"
                      placeholder="EX: BLUEDART12345"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 placeholder-gray-400 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-1.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Save Tracking ID
                  </button>
                </form>
              )}

              {/* Cancelled view */}
              {order.status === 'cancelled' && (
                <div className="bg-red-50 border border-red-150 p-4 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  This order has been cancelled by the admin.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
