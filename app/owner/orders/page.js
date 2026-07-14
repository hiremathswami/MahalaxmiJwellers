'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getOrders, updateOrder } from '@/lib/panelApi';
import OrderStatusBadge from '@/components/panels/OrderStatusBadge';
import { 
  ShoppingBag, 
  RotateCw, 
  Phone, 
  PackageCheck, 
  Truck, 
  CheckCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OwnerOrdersPage({ setTitle }) {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Tab states: 'ActionNeeded' (Confirmed+Packed), 'Confirmed', 'Packed', 'Shipped', 'All'
  const [activeTab, setActiveTab] = useState('ActionNeeded');
  const [updatingId, setUpdatingId] = useState(null);
  
  // Tracking inputs local state (key: orderId, value: trackingNumber)
  const [trackingInputs, setTrackingInputs] = useState({});

  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (setTitle) setTitle('Jewellery Orders to Pack & Ship');
  }, [setTitle]);

  const fetchOrders = async (showSilent = false) => {
    if (!accessToken) return;
    if (!showSilent) setLoading(true);
    try {
      const res = await getOrders(accessToken);
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Error fetching owner orders:', err);
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [accessToken]);

  // Auto-refresh every 20 seconds for dad's real-time list
  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    if (!accessToken) return;

    let nextStatus = '';
    const payload = {};

    if (currentStatus === 'confirmed') {
      nextStatus = 'packed';
    } else if (currentStatus === 'packed') {
      const tracking = trackingInputs[orderId]?.trim();
      if (!tracking) {
        showToast('Please enter a tracking number before shipping.', 'error');
        return;
      }
      nextStatus = 'shipped';
      payload.tracking_number = tracking;
    } else if (currentStatus === 'shipped') {
      nextStatus = 'delivered';
    } else {
      return;
    }

    payload.status = nextStatus;
    setUpdatingId(orderId);

    try {
      const res = await updateOrder(accessToken, orderId, payload);
      if (res.success && res.order) {
        showToast(`Order status updated to ${nextStatus.toUpperCase()}!`);
        // Update local list
        setOrders(prev => prev.map(o => o.id === orderId ? res.order : o));
      } else {
        showToast('Failed to update status.', 'error');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      showToast(err.message || 'Error occurred.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTrackingInputChange = (orderId, val) => {
    setTrackingInputs(prev => ({ ...prev, [orderId]: val }));
  };

  // Status Summary Counts
  const countPending = orders.filter(o => o.status === 'pending').length;
  const countConfirmed = orders.filter(o => o.status === 'confirmed').length;
  const countPacked = orders.filter(o => o.status === 'packed').length;
  const countShipped = orders.filter(o => o.status === 'shipped').length;
  const countDelivered = orders.filter(o => o.status === 'delivered').length;

  // Filter Logic
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ActionNeeded') {
      return o.status === 'confirmed' || o.status === 'packed';
    }
    if (activeTab === 'All') {
      return true;
    }
    return (o.status || '').toLowerCase() === activeTab.toLowerCase();
  });

  const getProductNames = (items) => {
    if (!items || !Array.isArray(items)) return 'N/A';
    return items.map(item => `${item.product?.name || item.name} (x${item.quantity})`).join(', ');
  };

  return (
    <div className="space-y-6 font-inter relative">
      
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

      {/* Top Counts Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-xs text-center">
        <div className="py-2 border-r border-gray-100 last:border-0">
          <span className="text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full font-bold">
            🔴 {countPending} Pending
          </span>
        </div>
        <div className="py-2 border-r border-gray-100 last:border-0">
          <span className="text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-bold">
            🟡 {countConfirmed} Confirmed
          </span>
        </div>
        <div className="py-2 border-r border-gray-100 last:border-0">
          <span className="text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full font-bold">
            🟣 {countPacked} Packed
          </span>
        </div>
        <div className="py-2 border-r border-gray-100 last:border-0">
          <span className="text-orange-700 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full font-bold">
            🟠 {countShipped} Shipped
          </span>
        </div>
        <div className="py-2">
          <span className="text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full font-bold">
            🟢 {countDelivered} Delivered
          </span>
        </div>
      </div>

      {/* Actions and Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto flex scrollbar-none pb-0.5">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('ActionNeeded')}
              className={`pb-4 px-1 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'ActionNeeded' ? 'text-gray-950' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Needs Packing / Shipping
              {activeTab === 'ActionNeeded' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-950 rounded-full" />
              )}
            </button>
            
            {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
                  activeTab === tab ? 'text-gray-950' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-950 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => fetchOrders()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer self-start sm:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Orders List for Dad */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600">
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h4 className="font-cormorant text-xl font-bold text-gray-950 mb-1">No Orders Found</h4>
          <p className="text-xs text-gray-500 max-w-sm">No orders currently require this action in the queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Card list view for mobile friendly design */}
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map((order) => {
              const dateOrdered = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
              }) : 'N/A';
              
              const isUpdating = updatingId === order.id;

              return (
                <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all flex flex-col justify-between gap-4">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Order ID</span>
                      <span className="font-mono font-bold text-gray-900 text-sm">{order.id.substring(0, 8)}</span>
                      <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Ordered: {dateOrdered}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <OrderStatusBadge status={order.status} />
                      <span className="text-xs font-bold text-gray-950 mt-1">₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-3 text-xs text-gray-700">
                    <div>
                      <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Customer</span>
                      <span className="font-bold text-gray-950">{order.customer_name}</span>
                      
                      {/* Call Customer Direct Link */}
                      <a 
                        href={`tel:${order.customer_phone}`} 
                        className="inline-flex items-center gap-1 text-[11px] text-blue-700 hover:underline font-bold ml-3"
                      >
                        <Phone className="w-3 h-3" /> Call {order.customer_phone}
                      </a>
                    </div>

                    <div>
                      <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Items list</span>
                      <p className="font-semibold text-gray-900 line-clamp-2">{getProductNames(order.items)}</p>
                    </div>
                  </div>

                  {/* Actions / Buttons area */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    
                    {/* View Details Link */}
                    <button
                      onClick={() => router.push(`/owner/orders/${order.id}`)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl font-bold text-gray-700 transition-colors text-xs cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Details</span>
                    </button>

                    {/* Operational Buttons */}
                    <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>Mark Packed</span>
                        </button>
                      )}

                      {order.status === 'packed' && (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                          <input
                            type="text"
                            placeholder="Enter Tracking ID..."
                            disabled={isUpdating}
                            value={trackingInputs[order.id] || ''}
                            onChange={(e) => handleTrackingInputChange(order.id, e.target.value)}
                            className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-hidden"
                          />
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'packed')}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Mark Shipped</span>
                          </button>
                        </div>
                      )}

                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'shipped')}
                          disabled={isUpdating}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Delivered</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
