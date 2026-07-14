'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getOrders, getProducts, getCustomRequests } from '@/lib/panelApi';
import StatCard from '@/components/panels/StatCard';
import OrderStatusBadge from '@/components/panels/OrderStatusBadge';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ShoppingBag, 
  IndianRupee, 
  TrendingUp, 
  AlertTriangle, 
  Eye, 
  ArrowRight,
  Truck,
  Package,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function OwnerDashboard({ setTitle }) {
  const { accessToken } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (setTitle) setTitle('Owner Business Overview');
  }, [setTitle]);

  const fetchData = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const [ordersRes, productsRes, customRes] = await Promise.all([
        getOrders(accessToken),
        getProducts(accessToken, { limit: 100 }),
        getCustomRequests(accessToken)
      ]);

      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (productsRes.success) setProducts(productsRes.products || []);
      if (customRes.success) setCustomRequests(customRes.requests || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  // Compute stats
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.total || o.total_amount || 0), 0);

  // Profit Margin of 45% typical of silver jewellery
  const estimatedProfit = totalRevenue * 0.45;

  const now = new Date();
  const monthlyRevenue = orders
    .filter(o => {
      const oDate = new Date(o.created_at);
      return oDate.getMonth() === now.getMonth() && oDate.getFullYear() === now.getFullYear() && o.status === 'delivered';
    })
    .reduce((sum, o) => sum + Number(o.total || o.total_amount || 0), 0);

  const pendingDeliveries = orders.filter(o => o.status === 'confirmed' || o.status === 'packed' || o.status === 'shipped').length;
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock <= 4).length;

  const deliveryRate = orders.length > 0 
    ? Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100) 
    : 0;

  // Pie chart data for Order Statuses
  const getStatusData = () => {
    const statuses = {
      pending: 0,
      confirmed: 0,
      packed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    orders.forEach(o => {
      if (statuses[o.status] !== undefined) {
        statuses[o.status]++;
      }
    });
    return [
      { name: 'Pending', value: statuses.pending, color: '#EF4444' },
      { name: 'Confirmed', value: statuses.confirmed, color: '#3B82F6' },
      { name: 'Packed', value: statuses.packed, color: '#8B5CF6' },
      { name: 'Shipped', value: statuses.shipped, color: '#F59E0B' },
      { name: 'Delivered', value: statuses.delivered, color: '#10B981' }
    ].filter(item => item.value > 0);
  };

  const statusData = getStatusData();

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center max-w-lg mx-auto mt-12">
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <h4 className="font-cormorant text-xl font-bold text-red-800">Data Fetch Error</h4>
        <p className="text-xs text-red-600 mt-1">{error}</p>
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-inter">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={IndianRupee} 
          label="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString('en-IN')}`} 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Est. Net Profit (45%)" 
          value={`₹${estimatedProfit.toLocaleString('en-IN')}`} 
        />
        <StatCard 
          icon={Clock} 
          label="Pending Deliveries" 
          value={pendingDeliveries} 
        />
        <StatCard 
          icon={Package} 
          label="Total Products" 
          value={totalProducts} 
        />
      </div>

      {/* Secondary Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-4 py-2 border-r border-gray-100 last:border-0">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Low Stock Alert</span>
            <span className="text-lg font-bold text-gray-950 block">{lowStockCount} items</span>
          </div>
        </div>

        <div className="flex items-center gap-4 py-2 border-r border-gray-100 last:border-0">
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Delivery Fulfillment</span>
            <span className="text-lg font-bold text-gray-950 block">{deliveryRate}% completed</span>
          </div>
        </div>

        <div className="flex items-center gap-4 py-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Monthly Earnings</span>
            <span className="text-lg font-bold text-gray-950 block">₹{monthlyRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (Left 2/3) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-cormorant text-xl font-bold text-gray-950 uppercase tracking-wide">Recent Orders</h3>
              <Link href="/owner/orders" className="text-xs font-bold text-gray-500 hover:text-gray-950 flex items-center gap-1">
                View All Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No orders available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="py-3 pr-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 pl-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {orders.slice(0, 6).map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        <td className="py-3 pr-4 font-mono font-bold text-gray-900">{o.id.substring(0, 8)}</td>
                        <td className="py-3 px-4 font-semibold text-gray-950">{o.customer_name}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">₹{Number(o.total || o.total_amount || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-center">
                          <OrderStatusBadge status={o.status} />
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <Link href={`/owner/orders/${o.id}`} className="inline-flex p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 transition-colors">
                            <Eye className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Breakdown (Right 1/3) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <h3 className="font-cormorant text-xl font-bold text-gray-950 uppercase tracking-wide mb-6">Delivery Queue</h3>
            
            {statusData.length === 0 ? (
              <p className="text-xs text-gray-400 py-12 text-center">No delivery statistics available.</p>
            ) : (
              <div className="space-y-4">
                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '11px', color: '#111827' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-gray-50">
                  {statusData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="font-semibold text-gray-600 truncate">{entry.name}:</span>
                      <span className="font-bold text-gray-900 ml-auto">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
