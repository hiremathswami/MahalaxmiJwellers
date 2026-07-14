import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import { ShoppingBag, Eye } from 'lucide-react';

export default function OrderTable({ orders, role, onViewClick }) {
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getItemsCount = (items) => {
    if (!items) return 0;
    if (Array.isArray(items)) {
      return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
    }
    return 0;
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h4 className="font-cormorant text-xl font-bold text-gray-950 mb-1">No Orders Found</h4>
        <p className="text-xs text-gray-500 max-w-sm">No transactions or orders matched the specified filters or search queries.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Order ID</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Date Ordered</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Items</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                {/* ID (8 chars) */}
                <td className="px-6 py-4 font-mono font-bold text-gray-900">
                  {order.id ? order.id.substring(0, 8) : 'N/A'}
                </td>
                
                {/* Customer name and phone */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-950">{order.customer_name || 'N/A'}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{order.customer_phone || 'N/A'}</div>
                </td>
                
                {/* Date */}
                <td className="px-6 py-4 font-medium">
                  {formatDate(order.created_at)}
                </td>
                
                {/* Items Count */}
                <td className="px-6 py-4 font-semibold text-gray-600">
                  {getItemsCount(order.items)} {getItemsCount(order.items) === 1 ? 'item' : 'items'}
                </td>
                
                {/* Price (₹) */}
                <td className="px-6 py-4 font-bold text-gray-950">
                  ₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                </td>
                
                {/* Status Badge */}
                <td className="px-6 py-4 text-center">
                  <OrderStatusBadge status={order.status} />
                </td>
                
                {/* Action Button */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onViewClick(order.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-lg font-bold text-gray-700 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
