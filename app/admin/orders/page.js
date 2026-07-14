'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getOrders } from '@/lib/panelApi';
import OrderTable from '@/components/panels/OrderTable';
import { useRouter } from 'next/navigation';
import { Search, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminOrdersPage({ setTitle }) {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const tabs = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    if (setTitle) setTitle('Orders Management');
  }, [setTitle]);

  const fetchOrdersData = async (showSilent = false) => {
    if (!accessToken) return;
    if (!showSilent) setLoading(true);
    try {
      const res = await getOrders(accessToken);
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [accessToken]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(() => {
      fetchOrdersData(true); // silent update in background
    }, 30000);

    return () => clearInterval(interval);
  }, [accessToken]);

  const handleViewOrder = (orderId) => {
    router.push(`/admin/orders/${orderId}`);
  };

  // Filter and Search logic
  const filteredOrders = orders.filter((order) => {
    // 1. Status Filter
    if (activeTab !== 'All') {
      if ((order.status || '').toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }
    }

    // 2. Search Filter (customer name, phone, or order ID)
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      const matchName = (order.customer_name || '').toLowerCase().includes(query);
      const matchPhone = (order.customer_phone || '').toLowerCase().includes(query);
      const matchId = (order.id || '').toLowerCase().includes(query);
      return matchName || matchPhone || matchId;
    }

    return true;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  return (
    <div className="space-y-6 font-inter">
      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by ID, name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 placeholder-gray-400 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          />
        </div>

        {/* Refresh button */}
        <button
          onClick={() => fetchOrdersData()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer self-start sm:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto flex scrollbar-none">
        <div className="flex space-x-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === 'All' 
              ? orders.length 
              : orders.filter(o => (o.status || '').toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-gray-950' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span>{tab}</span>
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  isActive ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-950 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table view */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600">
          {error}
        </div>
      ) : (
        <>
          <OrderTable 
            orders={currentOrders} 
            role="admin" 
            onViewClick={handleViewOrder} 
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <span className="text-[11px] font-semibold text-gray-400">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === pg
                        ? 'bg-gray-950 text-white'
                        : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
