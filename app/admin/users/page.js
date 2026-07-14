'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getUsers } from '@/lib/panelApi';
import OrderStatusBadge from '@/components/panels/OrderStatusBadge';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  Calendar, 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Eye,
  UserCheck
} from 'lucide-react';

export default function AdminUsersPage({ setTitle }) {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Accordion State
  const [search, setSearch] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if (setTitle) setTitle('Users & Customer Profiles');
  }, [setTitle]);

  const fetchUsersData = async (showSilent = false) => {
    if (!accessToken) return;
    if (!showSilent) setLoading(true);
    try {
      const res = await getUsers(accessToken);
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load registered users. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [accessToken]);

  // Toggle Accordion row
  const toggleExpandUser = (userId) => {
    setExpandedUserId(prev => prev === userId ? null : userId);
  };

  // Filter and Search logic
  const filteredUsers = users.filter((u) => {
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      const matchName = (u.name || '').toLowerCase().includes(query);
      const matchEmail = (u.email || '').toLowerCase().includes(query);
      const matchPhone = (u.phone || '').toLowerCase().includes(query);
      return matchName || matchEmail || matchPhone;
    }
    return true;
  });

  // Stats calculation
  const totalUsers = users.length;
  const activeShoppers = users.filter(u => u.orders && u.orders.length > 0).length;
  const totalRevenueGenerated = users.reduce((sum, u) => {
    const userOrders = u.orders || [];
    const userSpend = userOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((s, o) => s + Number(o.total || o.total_amount || 0), 0);
    return sum + userSpend;
  }, 0);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="space-y-8 font-inter">
      
      {/* Premium Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
            <Users className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Users</span>
            <span className="text-2xl font-bold font-cormorant text-gray-950 block mt-0.5">{totalUsers}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
            <UserCheck className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Customers</span>
            <span className="text-2xl font-bold font-cormorant text-gray-950 block mt-0.5">{activeShoppers}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
            <IndianRupee className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer LTV</span>
            <span className="text-2xl font-bold font-cormorant text-gray-950 block mt-0.5">₹{totalRevenueGenerated.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 placeholder-gray-400 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          />
        </div>

        {/* Refresh button */}
        <button
          onClick={() => fetchUsersData()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer self-start sm:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Users table */}
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
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Contact Info</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6">Last Login</th>
                    <th className="py-4 px-6 text-center">Orders</th>
                    <th className="py-4 px-6 text-right">Total Spent</th>
                    <th className="py-4 px-6 text-center">History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {currentUsers.map((u) => {
                    const isExpanded = expandedUserId === u.id;
                    const userOrders = u.orders || [];
                    const totalSpend = userOrders
                      .filter(o => o.status !== 'cancelled')
                      .reduce((sum, o) => sum + Number(o.total || o.total_amount || 0), 0);

                    return (
                      <React.Fragment key={u.id}>
                        {/* Primary Row */}
                        <tr 
                          onClick={() => toggleExpandUser(u.id)}
                          className={`hover:bg-gray-50/40 transition-colors cursor-pointer ${isExpanded ? 'bg-gray-50/20' : ''}`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200/50 flex items-center justify-center font-bold text-gray-800 text-xs uppercase">
                                {u.name ? u.name.substring(0, 2) : u.email.substring(0, 2)}
                              </div>
                              <div>
                                <span className="font-bold text-gray-950 block text-[13px]">{u.name || 'Anonymous User'}</span>
                                <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{u.id.substring(0, 8)}...</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <span>{u.email}</span>
                            </div>
                            {u.phone && (
                              <div className="flex items-center gap-1.5 text-gray-500">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <span>{u.phone}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6 font-medium text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span>
                                {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-medium text-gray-500">
                            {u.last_sign_in_at ? (
                              new Date(u.last_sign_in_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                            ) : (
                              <span className="text-gray-300 italic text-[11px]">Never logged in</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-gray-900">
                            {userOrders.length}
                          </td>
                          <td className="py-4 px-6 text-right font-extrabold text-gray-950">
                            ₹{totalSpend.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button 
                              className="inline-flex p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandUser(u.id);
                              }}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Collapsible Order History Row */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={7} className="bg-gray-50/30 px-8 py-6 border-t border-b border-gray-100">
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* LEFT COLUMN: Customer Metadata & Saved Addresses */}
                                <div className="lg:col-span-4 space-y-6">
                                  {/* Contact Card */}
                                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
                                    <h4 className="font-cormorant text-base font-bold text-gray-950 uppercase tracking-wider">
                                      Customer Details
                                    </h4>
                                    <div className="text-[11px] space-y-2.5 text-gray-600">
                                      <div>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Full Name</span>
                                        <span className="font-semibold text-gray-900 block mt-0.5">{u.name || 'Anonymous User'}</span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Email Address</span>
                                        <span className="font-semibold text-gray-900 block mt-0.5">{u.email}</span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Phone Number</span>
                                        <span className="font-semibold text-gray-900 block mt-0.5">{u.phone || 'N/A'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Address Card */}
                                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
                                    <h4 className="font-cormorant text-base font-bold text-gray-950 uppercase tracking-wider">
                                      Saved Addresses
                                    </h4>
                                    {(!u.addresses || u.addresses.length === 0) ? (
                                      <p className="text-xs text-gray-400 italic">No saved addresses found.</p>
                                    ) : (
                                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                                        {u.addresses.map((addr, idx) => (
                                          <div key={addr.id || idx} className={`p-3 rounded-lg border text-xs ${addr.isDefault ? 'border-amber-200 bg-amber-50/15' : 'border-gray-100 bg-gray-50/50'}`}>
                                            <div className="flex items-center justify-between mb-1.5">
                                              <strong className="text-gray-900 font-semibold">{addr.fullName}</strong>
                                              {addr.isDefault && (
                                                <span className="text-[8px] bg-amber-100 text-amber-800 font-bold uppercase px-1.5 py-0.5 rounded">Default</span>
                                              )}
                                            </div>
                                            <p className="text-gray-500 leading-relaxed">
                                              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state}, {addr.pincode}, India
                                            </p>
                                            <span className="text-gray-400 block mt-1.5">{addr.phone}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* RIGHT COLUMN: Purchase History */}
                                <div className="lg:col-span-8 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-cormorant text-base font-bold text-gray-950 uppercase tracking-wider flex items-center gap-2">
                                      <ShoppingBag className="w-4 h-4 text-gray-600" />
                                      <span>Purchase History &amp; Orders</span>
                                    </h4>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2.5 py-0.5 rounded-full">
                                      {userOrders.length} Orders total
                                    </span>
                                  </div>

                                  {(userOrders.length === 0) ? (
                                    <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center">
                                      <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                      <p className="text-xs text-gray-400 font-medium">This customer has not placed any orders yet.</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                                      {userOrders.map((o) => {
                                        // Extract item details — support both flat {name, image, quantity} and nested {product: {name, images}}
                                        let itemsList = [];
                                        try {
                                          const rawItems = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
                                          itemsList = rawItems.map((item) => ({
                                            name: item.name || item.product?.name || 'Jewellery Piece',
                                            image: item.image || item.product?.images?.[0] || null,
                                            quantity: item.quantity || 1,
                                          }));
                                        } catch (e) {
                                          console.error('Error parsing items', e);
                                        }

                                        return (
                                          <div 
                                            key={o.id}
                                            className="bg-white border border-gray-100 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-gray-200 transition-colors"
                                          >
                                            {/* Left side: details */}
                                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                              {/* Order details */}
                                              <div>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Order ID</span>
                                                <span className="text-xs font-mono font-bold text-gray-950 block mt-0.5 truncate">{o.id}</span>
                                                <span className="text-[10px] text-gray-400 block mt-1">
                                                  Placed: {new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                              </div>

                                              {/* Items count & preview */}
                                              <div className="sm:col-span-2">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Items Purchased</span>
                                                <div className="mt-1 flex flex-wrap gap-1.5">
                                                  {itemsList.map((item, idx) => (
                                                    <span 
                                                      key={idx}
                                                      className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200/60 text-[11px] font-medium text-gray-800 px-2 py-0.5 rounded-lg"
                                                    >
                                                      {item.image && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img 
                                                          src={item.image} 
                                                          alt={item.name} 
                                                          className="w-3.5 h-3.5 object-cover rounded-sm"
                                                        />
                                                      )}
                                                      <span>{item.name} <strong className="text-gray-950">x{item.quantity}</strong></span>
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Right side: total, status, view */}
                                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-gray-50">
                                              <div className="text-right">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Amount</span>
                                                <span className="text-xs font-extrabold text-gray-950 block mt-0.5">₹{Number(o.total || o.total_amount || 0).toLocaleString('en-IN')}</span>
                                              </div>

                                              <div className="flex items-center gap-3">
                                                <OrderStatusBadge status={o.status} />
                                                <button
                                                  onClick={() => router.push(`/admin/orders/${o.id}`)}
                                                  className="inline-flex items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-lg text-gray-700 transition-colors"
                                                  title="View full order details"
                                                >
                                                  <Eye className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <span className="text-[11px] font-semibold text-gray-400">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
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
