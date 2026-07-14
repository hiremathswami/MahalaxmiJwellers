'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { getOrder, updateOrder } from '@/lib/panelApi';
import OrderStatusBadge from '@/components/panels/OrderStatusBadge';
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  User, 
  MapPin, 
  Package, 
  Truck, 
  Save, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOrderDetailPage({ setTitle }) {
  const { accessToken } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Edit Form Fields
  const [status, setStatus] = useState('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  
  // Toast notifications state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (setTitle) setTitle('Order Details');
  }, [setTitle]);

  const fetchOrderDetail = async () => {
    if (!accessToken || !id) return;
    setLoading(true);
    try {
      const res = await getOrder(accessToken, id);
      if (res.success && res.order) {
        setOrder(res.order);
        setStatus(res.order.status || 'pending');
        setTrackingNumber(res.order.tracking_number || '');
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Error fetching order detail:', err);
      setError('Failed to fetch order details. Please try again.');
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

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!accessToken || !id) return;
    
    setSaving(true);
    try {
      const res = await updateOrder(accessToken, id, {
        status,
        tracking_number: trackingNumber
      });
      
      if (res.success && res.order) {
        setOrder(res.order);
        setStatus(res.order.status || 'pending');
        setTrackingNumber(res.order.tracking_number || '');
        showToast('Order details updated successfully!');
      } else {
        showToast('Failed to save changes. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Error saving order changes:', err);
      showToast(err.message || 'Error occurred while updating order', 'error');
    } finally {
      setSaving(false);
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
        <button onClick={() => router.push('/admin/orders')} className="mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders List
        </button>
      </div>
    );
  }

  const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'N/A';

  // Parse address JSON if it exists, otherwise use address_line1 etc.
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

      {/* Back Header Link */}
      <div>
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders list
        </Link>
      </div>

      {/* Summary Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order ID</span>
          <h1 className="font-mono text-lg font-bold text-gray-900 truncate">
            {order.id}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {order.payment_id ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
              <CheckCircle className="w-3.5 h-3.5" /> Paid
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-100">
              Unpaid
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Order Info & Items */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Order Details Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              Order Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-700">
              <div className="space-y-1.5">
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date Placed
                </span>
                <span className="font-semibold text-gray-950">{orderDate}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Payment details
                </span>
                <span className="font-semibold text-gray-950 block">ID: {order.payment_id || 'N/A'}</span>
                <span className="font-semibold text-gray-900 block">Method: {order.payment_method?.toUpperCase() || 'Razorpay / UPI'}</span>
              </div>
            </div>
          </div>

          {/* Items Ordered Table */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3">
              Items Ordered
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="py-3 pr-4">Image</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 pl-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700">
                  {order.items?.map((item) => {
                    const price = item.product?.price || item.price || 0;
                    const name = item.product?.name || item.name || 'Jewellery Piece';
                    const images = item.product?.images || item.images || [];
                    const firstImage = images.length > 0 ? images[0] : null;

                    return (
                      <tr key={item.product_id || item.id} className="align-middle">
                        <td className="py-3 pr-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                            {firstImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={firstImage}
                                alt={name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-gray-400">MJ</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-950">{name}</div>
                          {item.selectedSize && (
                            <div className="text-[10px] text-gray-400 mt-0.5">Size: {item.selectedSize}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">₹{Number(price).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-600">{item.quantity}</td>
                        <td className="py-3 pl-4 text-right font-bold text-gray-950">₹{Number(price * item.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-gray-100 pt-4 flex flex-col items-end space-y-2 text-xs text-gray-500">
              <div className="flex justify-between w-64">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">₹{Number(order.subtotal || order.total_amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between w-64">
                <span>Shipping</span>
                <span className="font-semibold text-gray-800">{Number(order.shipping || 0) === 0 ? 'FREE' : `₹${Number(order.shipping).toLocaleString('en-IN')}`}</span>
              </div>
              {order.gst && (
                <div className="flex justify-between w-64">
                  <span>GST (3%)</span>
                  <span className="font-semibold text-gray-800">₹{Number(order.gst).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between w-64 border-t border-gray-150 pt-2 text-sm font-bold text-gray-950">
                <span>Total Amount</span>
                <span>₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Customer Details & Admin Actions */}
        <div className="space-y-8">
          
          {/* Customer & Address Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Customer
            </h3>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Full Name</span>
                <span className="font-semibold text-gray-950">{order.customer_name || 'N/A'}</span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Email Address</span>
                <span className="font-semibold text-gray-950 block">{order.customer_email || 'N/A'}</span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Phone Number</span>
                <span className="font-semibold text-gray-950 block">{order.customer_phone || 'N/A'}</span>
              </div>

              <div className="space-y-1 border-t border-gray-100 pt-4">
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1 mb-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Delivery Address
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

          {/* Admin Actions Status Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-400" />
              Order Status & Fulfillment
            </h3>

            <form onSubmit={handleSaveChanges} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Fulfillment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="EX: TRACKING12345"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 placeholder-gray-400 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-950 hover:bg-gray-850 active:bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
