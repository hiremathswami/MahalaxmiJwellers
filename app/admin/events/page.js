'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getAdminEvents, createEvent, updateEvent, deleteEvent, uploadImage } from '@/lib/panelApi';
import { 
  Plus, 
  Trash2, 
  RotateCw, 
  Upload, 
  X, 
  Save, 
  ShieldAlert, 
  Calendar, 
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Info
} from 'lucide-react';

export default function EventsManagementPage({ setTitle, role = 'admin' }) {
  const { accessToken } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newIsActive, setNewIsActive] = useState(true);

  // Edit State
  const [editingEventId, setEditingEventId] = useState(null);

  useEffect(() => {
    if (setTitle) setTitle('Promotional Events & Banners');
  }, [setTitle]);

  const fetchEventsData = async (showSilent = false) => {
    if (!accessToken) return;
    if (!showSilent) setLoading(true);
    try {
      const res = await getAdminEvents(accessToken);
      if (res.success) {
        setEvents(res.events || []);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please ensure the events table is created in your database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, [accessToken]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const res = await uploadImage(accessToken, file);
      if (res.success) {
        setNewImageUrl(res.url);
      } else {
        setError('Failed to upload image.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError('An error occurred during image upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (eventItem) => {
    try {
      const updatedStatus = !eventItem.is_active;
      
      // Optimistic update
      setEvents(prev => prev.map(ev => ev.id === eventItem.id ? { ...ev, is_active: updatedStatus } : ev));

      const res = await updateEvent(accessToken, eventItem.id, { is_active: updatedStatus });
      if (!res.success) {
        // Rollback on fail
        setEvents(prev => prev.map(ev => ev.id === eventItem.id ? { ...ev, is_active: !updatedStatus } : ev));
        alert(res.error || 'Failed to update event status');
      }
    } catch (err) {
      console.error('Error toggling event status:', err);
      fetchEventsData(true);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this promotional event banner?')) return;
    try {
      // Optimistic delete
      setEvents(prev => prev.filter(ev => ev.id !== id));
      const res = await deleteEvent(accessToken, id);
      if (!res.success) {
        alert(res.error || 'Failed to delete event');
        fetchEventsData(true);
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      fetchEventsData(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newTitle.trim()) {
      setError('Event Title is required.');
      return;
    }
    if (!newImageUrl.trim()) {
      setError('Banner image is required.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        image_url: newImageUrl.trim(),
        link_url: newLinkUrl.trim() || null,
        is_active: newIsActive
      };

      const res = await createEvent(accessToken, payload);
      if (res.success) {
        setShowAddForm(false);
        // Clear fields
        setNewTitle('');
        setNewDescription('');
        setNewImageUrl('');
        setNewLinkUrl('');
        setNewIsActive(true);
        fetchEventsData(true);
      } else {
        setError(res.error || 'Failed to save event details.');
      }
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-inter">
      {/* DB setup warning notification */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-amber-800">
        <Info className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950">Important Database Requirement</h4>
          <p className="text-xs leading-relaxed max-w-2xl text-amber-900">
            For this feature to function, you must ensure the <strong>events</strong> table exists in your Supabase database. Please refer to the <code>implementation_plan.md</code> for the SQL code to run in your Supabase SQL editor.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="text-xs font-semibold text-red-700">{error}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-950 hover:bg-gray-850 active:bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{showAddForm ? 'Close Editor' : 'Add New Event'}</span>
        </button>

        <button
          onClick={() => fetchEventsData()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Add New Event Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <h3 className="font-cormorant text-2xl font-bold text-gray-950 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gray-700" />
            <span>Create Promotional Banner Event</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="EX: Diwali Sparkle Offer"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Description / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="EX: Flat 10% discount on all 925 silver bangles and rings. Use code DIWALI10."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Redirect Link URL (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="EX: /shop?category=rings"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-gray-950 block">Activate Immediately?</span>
                  <span className="text-[10px] text-gray-400 block">Active events are shown live to customers.</span>
                </div>
                <input
                  type="checkbox"
                  checked={newIsActive}
                  onChange={(e) => setNewIsActive(e.target.checked)}
                  className="w-4 h-4 accent-gray-950"
                />
              </div>
            </div>

            {/* Banner Image Uploader */}
            <div className="space-y-3 flex flex-col justify-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Promo Banner Image *
              </label>

              {newImageUrl ? (
                <div className="w-full aspect-[21/9] rounded-2xl border border-gray-200 overflow-hidden relative group bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={newImageUrl} alt="Promo Banner" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewImageUrl('')}
                    className="absolute top-3 right-3 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-6">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Upload Banner</span>
                      <span className="text-[10px] text-gray-400 mt-1">Prefer wide landscape aspect ratios (e.g. 21:9 or 16:9)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-950 hover:bg-gray-850 active:bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Publish Banner'}
            </button>
          </div>
        </form>
      )}

      {/* Events Listing Grid */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center max-w-xl mx-auto">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-cormorant text-2xl font-bold text-gray-950 mb-2">No Promotional Events Yet</h3>
          <p className="text-xs text-warm-gray leading-relaxed max-w-sm mx-auto mb-6">
            Create event banners like "Diwali Offer" or "Wedding Season Offer" to highlight sales campaigns on the homepage and collections pages.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-black text-[11px] py-2 px-5"
          >
            Create Your First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <div 
              key={ev.id} 
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              {/* Event Image */}
              <div className="aspect-[21/9] w-full bg-gray-50 border-b border-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm border ${
                    ev.is_active 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {ev.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h4 className="font-cormorant text-xl font-bold text-gray-950">{ev.title}</h4>
                  {ev.description && (
                    <p className="text-xs text-warm-gray leading-relaxed">{ev.description}</p>
                  )}
                  {ev.link_url && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200/60 px-2 py-0.5 rounded-lg">
                      <LinkIcon className="w-3 h-3 text-gray-400" />
                      <span>{ev.link_url}</span>
                    </div>
                  )}
                </div>

                {/* Operations bar */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleActive(ev)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    {ev.is_active ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-gray-900" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                        <span>Activate</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                    title="Delete event banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
