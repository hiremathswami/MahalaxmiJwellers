'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { getCustomRequest, updateCustomRequest } from '@/lib/panelApi';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Palette, 
  IndianRupee, 
  Calendar, 
  FileText, 
  ImageIcon, 
  Save, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCustomRequestDetailPage({ setTitle }) {
  const { accessToken } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Status & Notes
  const [status, setStatus] = useState('new');
  const [notes, setNotes] = useState('');
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (setTitle) setTitle('Request Details');
  }, [setTitle]);

  const fetchRequestDetail = async () => {
    if (!accessToken || !id) return;
    setLoading(true);
    try {
      const res = await getCustomRequest(accessToken, id);
      if (res.success && res.request) {
        setRequest(res.request);
        setStatus(res.request.status || 'new');
        setNotes(res.request.notes || '');
      } else {
        setError('Custom request not found');
      }
    } catch (err) {
      console.error('Error fetching custom request:', err);
      setError('Failed to fetch custom request details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetail();
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
      const res = await updateCustomRequest(accessToken, id, {
        status,
        notes: notes.trim()
      });
      
      if (res.success && res.request) {
        setRequest(res.request);
        setStatus(res.request.status || 'new');
        setNotes(res.request.notes || '');
        showToast('Request status and notes updated successfully!');
      } else {
        showToast('Failed to update details.', 'error');
      }
    } catch (err) {
      console.error('Error updating custom request:', err);
      showToast(err.message || 'Error occurred while saving.', 'error');
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

  if (error || !request) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center max-w-lg mx-auto mt-12">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <h4 className="font-cormorant text-xl font-bold text-red-800">Request Error</h4>
        <p className="text-xs text-red-600 mt-1">{error || 'Inquiry could not be retrieved.'}</p>
        <button onClick={() => router.push('/admin/custom-requests')} className="mt-4 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Custom Requests
        </button>
      </div>
    );
  }

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
          href="/admin/custom-requests" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Custom Requests
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Submitted Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Customer Profile Details Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Inquiry Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-700">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Customer Name</span>
                  <span className="font-bold text-gray-950 text-sm">{request.name}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone Number
                  </span>
                  <span className="font-semibold text-gray-950">{request.phone}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email Address
                  </span>
                  <span className="font-semibold text-gray-950 block">{request.email || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                    <Palette className="w-3 h-3" /> Jewellery Type
                  </span>
                  <span className="font-semibold text-gray-950 text-sm capitalize">{request.jewellery_type || 'Custom Piece'}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                    <IndianRupee className="w-3 h-3" /> Expected Budget
                  </span>
                  <span className="font-bold text-gray-950 text-sm">
                    {request.budget ? `₹${Number(request.budget).toLocaleString('en-IN')}` : 'Flexible'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Submitted Date
                  </span>
                  <span className="font-semibold text-gray-950">
                    {new Date(request.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Description & Images */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Design Concept & Details
            </h3>

            <div className="space-y-6 text-xs text-gray-700">
              <div className="space-y-1.5">
                <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block">Customer Notes / Description</span>
                <p className="font-semibold text-gray-900 bg-gray-50 border border-gray-100 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                  {request.description || 'No detailed instructions provided.'}
                </p>
              </div>

              {request.reference_image && (
                <div className="space-y-2.5">
                  <span className="text-gray-400 font-semibold uppercase text-[9px] tracking-wider block flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" /> Customer Reference Sketch / Image
                  </span>
                  
                  <div className="max-w-md bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={request.reference_image} 
                      alt="Reference design" 
                      className="w-full h-auto max-h-96 object-contain"
                    />
                    <a
                      href={request.reference_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 bg-gray-950/80 hover:bg-gray-950 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Open in New Tab
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions (Status Update & Internal Notes) */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-lg font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
              <Save className="w-4 h-4 text-gray-400" />
              Administrative Actions
            </h3>

            <form onSubmit={handleSaveChanges} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Inquiry Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all capitalize"
                >
                  <option value="new">New</option>
                  <option value="in_discussion">In Discussion</option>
                  <option value="quoted">Quoted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Internal Notes (Private)
                </label>
                <textarea
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record call logs, price quotations discussed, metal requirements, or design revisions..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 placeholder-gray-400 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all resize-none"
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
                    Saving Notes...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Notes & Status
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
