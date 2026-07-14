'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getCustomRequests } from '@/lib/panelApi';
import { Palette, Phone, RotateCw, Image as ImageIcon } from 'lucide-react';

export default function OwnerCustomRequestsPage({ setTitle }) {
  const { accessToken } = useAuth();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (setTitle) setTitle('Custom Requests Inbox');
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

  const getStatusBadge = (status) => {
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

  return (
    <div className="space-y-6 font-inter">
      {/* Header action bar */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => fetchRequests()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600">
          {error}
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4">
            <Palette className="w-6 h-6" />
          </div>
          <h4 className="font-cormorant text-xl font-bold text-gray-950 mb-1">No Custom Requests</h4>
          <p className="text-xs text-gray-500 max-w-sm">No custom design orders are registered in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between gap-4">
              
              {/* Request Header */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-950 text-sm">{req.name}</h4>
                  <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                    Received: {new Date(req.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadge(req.status)}`}>
                  {req.status?.replace('_', ' ') || 'new'}
                </span>
              </div>

              {/* Request Details */}
              <div className="space-y-3 text-xs text-gray-700 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Jewellery Type</span>
                    <span className="font-bold text-gray-900 capitalize">{req.jewellery_type || 'Custom Piece'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Budget</span>
                    <span className="font-bold text-gray-900">
                      {req.budget ? `₹${Number(req.budget).toLocaleString('en-IN')}` : 'Flexible'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Requirements</span>
                  <p className="font-semibold text-gray-900 bg-gray-50 border border-gray-100 p-3 rounded-xl leading-relaxed whitespace-pre-wrap">
                    {req.description || 'No detailed instructions provided.'}
                  </p>
                </div>

                {req.reference_image && (
                  <div className="flex items-center gap-2 pt-1">
                    <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                    <a
                      href={req.reference_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-gray-500 hover:text-gray-950 font-bold hover:underline"
                    >
                      View Customer Reference Attachment
                    </a>
                  </div>
                )}
              </div>

              {/* Call Action Bar */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <a
                  href={`tel:${req.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-800 rounded-xl font-bold transition-all text-xs cursor-pointer w-full"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Customer ({req.phone})</span>
                </a>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
