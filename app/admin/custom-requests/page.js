'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getCustomRequests } from '@/lib/panelApi';
import { useRouter } from 'next/navigation';
import { Palette, Eye, RotateCw, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminCustomRequestsPage({ setTitle }) {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'new', 'in_discussion', 'quoted', 'confirmed', 'rejected'];

  useEffect(() => {
    if (setTitle) setTitle('Custom Requests');
  }, [setTitle]);

  const fetchRequests = async (showSilent = false) => {
    if (!accessToken) return;
    if (!showSilent) setLoading(true);
    try {
      const res = await getCustomRequests(accessToken);
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      console.error('Error fetching custom requests:', err);
      setError('Failed to fetch custom requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [accessToken]);

  // Filter & Search Logic
  const filteredRequests = requests.filter((req) => {
    // 1. Status Filter
    if (activeTab !== 'All') {
      if ((req.status || '').toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }
    }

    // 2. Search Filter (name or phone)
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      const matchName = (req.name || '').toLowerCase().includes(query);
      const matchPhone = (req.phone || '').toLowerCase().includes(query);
      return matchName || matchPhone;
    }

    return true;
  });

  const getStatusStyle = (status) => {
    const normalized = (status || 'new').toLowerCase();
    const styles = {
      new: 'bg-blue-50 text-blue-700 border-blue-200',
      in_discussion: 'bg-amber-50 text-amber-700 border-amber-200',
      quoted: 'bg-purple-50 text-purple-700 border-purple-200',
      confirmed: 'bg-green-50 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[normalized] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getTabLabel = (tab) => {
    if (tab === 'All') return 'All';
    return tab.replace('_', ' ');
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 placeholder-gray-400 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          />
        </div>

        {/* Refresh */}
        <button
          onClick={() => fetchRequests()}
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
              ? requests.length
              : requests.filter(r => (r.status || '').toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-gray-950' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="capitalize">{getTabLabel(tab)}</span>
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

      {/* Custom Requests List Table */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600">
          {error}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4">
            <Palette className="w-6 h-6" />
          </div>
          <h4 className="font-cormorant text-xl font-bold text-gray-950 mb-1">No Custom Requests</h4>
          <p className="text-xs text-gray-500 max-w-sm">No custom design orders fit this category filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Budget</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Date Received</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-950">{req.name}</td>
                    <td className="px-6 py-4">
                      <div>{req.phone}</div>
                      {req.email && <div className="text-[10px] text-gray-400">{req.email}</div>}
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-gray-600">
                      {req.jewellery_type || 'Custom Piece'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-950">
                      {req.budget ? `₹${Number(req.budget).toLocaleString('en-IN')}` : 'Flexible'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {new Date(req.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${getStatusStyle(req.status)}`}>
                        {req.status?.replace('_', ' ') || 'new'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/custom-requests/${req.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-lg font-bold text-gray-700 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
