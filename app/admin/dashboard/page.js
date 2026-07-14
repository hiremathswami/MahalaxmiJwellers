'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getOrders, getProducts } from '@/lib/panelApi';
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
  ResponsiveContainer 
} from 'recharts';
import { 
  ShoppingBag, 
  IndianRupee, 
  Clock, 
  AlertTriangle, 
  Eye, 
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard({ setTitle }) {
  const { accessToken } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (setTitle) setTitle('Dashboard Overview');
  }, [setTitle]);

  const fetchData = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        getOrders(accessToken),
        getProducts(accessToken, { limit: 100 }) // fetch enough to count low stock
      ]);

      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (productsRes.success) setProducts(productsRes.products || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  // Compute stats
  const todayStr = new Date().toDateString();
  const ordersToday = orders.filter(o => new Date(o.created_at).toDateString() === todayStr).length;

  const now = new Date();
  const revenueThisMonth = orders
    .filter(o => {
      const oDate = new Date(o.created_at);
      return oDate.getMonth() === now.getMonth() && oDate.getFullYear() === now.getFullYear() && o.status !== 'cancelled';
    })
    .reduce((sum, o) => sum + Number(o.total || o.total_amount || 0), 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockCount = products.filter(p => p.stock <= 3 && p.is_active).length;

  // Chart data for last 7 days revenue
  const get7DayChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      chartData.push({
        name: days[d.getDay()],
        dateStr: d.toDateString(),
        revenue: 0,
      });
    }

    orders.forEach(order => {
      if (order.status !== 'cancelled') {
        const orderDate = new Date(order.created_at).toDateString();
        const match = chartData.find(item => item.dateStr === orderDate);
        if (match) {
          match.revenue += Number(order.total || order.total_amount || 0);
        }
      }
    });

    return chartData;
  };

  const chartData = get7DayChartData();

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
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={ShoppingBag} 
          label="Orders Today" 
          value={ordersToday} 
        />
        <StatCard 
          icon={IndianRupee} 
          label="Revenue This Month" 
          value={`₹${revenueThisMonth.toLocaleString('en-IN')}`} 
        />
        <StatCard 
          icon={Clock} 
          label="Pending Orders" 
          value={pendingOrders} 
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Low Stock Alert" 
          value={lowStockCount} 
        />
      </div>

      {/* Main Grid: Recent Orders (Full Width) */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-cormorant text-xl font-bold text-gray-950 uppercase tracking-wide">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs font-bold text-gray-500 hover:text-gray-950 flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
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
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        <td className="py-3 pr-4 font-mono font-bold text-gray-900">{o.id.substring(0, 8)}</td>
                        <td className="py-3 px-4 font-semibold text-gray-950">{o.customer_name}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">₹{Number(o.total || o.total_amount || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-center">
                          <OrderStatusBadge status={o.status} />
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <Link href={`/admin/orders/${o.id}`} className="inline-flex p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 transition-colors">
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
      </div>

      {/* Revenue Graph Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <h3 className="font-cormorant text-xl font-bold text-gray-950 uppercase tracking-wide mb-6">Last 7 Days Revenue</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                tickFormatter={(value) => `₹${value}`} 
              />
              <Tooltip 
                cursor={{ fill: '#F9FAFB' }}
                contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                labelStyle={{ fontWeight: 'bold', color: '#111827', fontSize: '11px' }}
                itemStyle={{ color: '#374151', fontSize: '11px' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#C0C0C0" radius={[6, 6, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
