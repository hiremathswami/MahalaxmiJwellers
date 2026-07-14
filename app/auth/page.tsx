'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/data/products';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { 
  ShieldAlert,
  User,
  ShoppingBag,
  Heart,
  CreditCard,
  MapPin,
  Sparkles,
  Edit3,
  Gift,
  ChevronDown
} from 'lucide-react';

type Tab = 'signin' | 'register';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [activeTab, setActiveTab] = useState<Tab>('signin');
  const { user, profile, loading, signIn, signUp, signOut, error, clearError, initialize } = useAuthStore();
  const { role } = useAuth();

  // Initialize authStore session on first load
  useEffect(() => {
    initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAcceptTerms, setRegAcceptTerms] = useState(false);

  // Dashboard state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Register OTP verification states
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSessionId, setOtpSessionId] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpAlertMessage, setOtpAlertMessage] = useState<string | null>(null);

  // Address manager states
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddressToEdit, setCurrentAddressToEdit] = useState<any | null>(null);

  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');

  // Load addresses from user metadata or fallback to localStorage
  useEffect(() => {
    if (user) {
      const metadataAddresses = user.user_metadata?.addresses;
      if (metadataAddresses && Array.isArray(metadataAddresses) && metadataAddresses.length > 0) {
        setAddresses(metadataAddresses);
      } else {
        const saved = typeof window !== 'undefined' ? localStorage.getItem(`mj_addresses_${user.id}`) : null;
        if (saved) {
          const parsed = JSON.parse(saved);
          setAddresses(parsed);
          supabase.auth.updateUser({ data: { addresses: parsed } });
        } else {
          setAddresses([]);
        }
      }
    }
  }, [user, profile]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let updated: any[];
    if (currentAddressToEdit) {
      updated = addresses.map((addr) =>
        addr.id === currentAddressToEdit.id
          ? {
              ...addr,
              fullName: addrName,
              phone: addrPhone,
              line1: addrLine1,
              line2: addrLine2,
              city: addrCity,
              state: addrState,
              pincode: addrPincode,
            }
          : addr
      );
    } else {
      const newAddr = {
        id: Date.now().toString(),
        fullName: addrName,
        phone: addrPhone,
        line1: addrLine1,
        line2: addrLine2,
        city: addrCity,
        state: addrState,
        pincode: addrPincode,
        isDefault: addresses.length === 0,
      };
      updated = [...addresses, newAddr];
    }

    setAddresses(updated);
    if (typeof window !== 'undefined') localStorage.setItem(`mj_addresses_${user.id}`, JSON.stringify(updated));
    await supabase.auth.updateUser({ data: { addresses: updated } });
    setIsEditingAddress(false);
    setCurrentAddressToEdit(null);
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    const updated = addresses.filter((addr) => addr.id !== id);
    if (updated.length > 0 && !updated.some((addr) => addr.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    if (typeof window !== 'undefined') localStorage.setItem(`mj_addresses_${user.id}`, JSON.stringify(updated));
    await supabase.auth.updateUser({ data: { addresses: updated } });
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!user) return;
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddresses(updated);
    if (typeof window !== 'undefined') localStorage.setItem(`mj_addresses_${user.id}`, JSON.stringify(updated));
    await supabase.auth.updateUser({ data: { addresses: updated } });
  };


  const startEditAddress = (addr: any) => {
    setCurrentAddressToEdit(addr);
    setAddrName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrLine1(addr.line1);
    setAddrLine2(addr.line2 || '');
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPincode(addr.pincode);
    setIsEditingAddress(true);
  };

  const startAddAddress = () => {
    setCurrentAddressToEdit(null);
    setAddrName('');
    setAddrPhone(profile?.phone || '');
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('');
    setAddrState('');
    setAddrPincode('');
    setIsEditingAddress(true);
  };

  // Dashboard Tab state
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>('profile');

  // Listen to hash changes for routing tabs
  useEffect(() => {
    const handleHashChange = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#orders') setActiveDashboardTab('orders');
        else if (hash === '#wishlist') setActiveDashboardTab('wishlist');
        else if (hash === '#payments') setActiveDashboardTab('payments');
        else if (hash === '#address') setActiveDashboardTab('address');
        else if (hash === '#neucoins') setActiveDashboardTab('neucoins');
        else setActiveDashboardTab('profile');
      }
    };
    handleHashChange(); // Run once on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const { updateProfile } = useAuthStore();

  useEffect(() => {
    clearError();
  }, [activeTab, clearError]);

  // Handle redirect if logged in
  useEffect(() => {
    if (user) {
      const email = user.email?.toLowerCase().trim();
      if (email === 'rohanhiremathswami99@gmail.com' || email === 'rohanhiremathswami73@gmail.com' || role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (email === 'mjlaxmijw@gmail.com' || role === 'owner') {
        router.replace('/owner/dashboard');
      } else if (redirectParam) {
        if (redirectParam === '/checkout') {
          router.push('/checkout');
        } else if (redirectParam !== '/auth') {
          router.push(redirectParam);
        }
      }
    }
  }, [user, role, redirectParam, router]);

  // Fetch orders when user is authenticated
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          // Fetch orders matched by user_id OR by customer_email (for Razorpay orders)
          const { data, error: ordersErr } = await supabase
            .from('orders')
            .select('*')
            .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
            .order('created_at', { ascending: false });
          if (ordersErr) throw ordersErr;
          // Deduplicate in case a record matches both conditions
          const seen = new Set<string>();
          const unique = (data || []).filter(o => {
            if (seen.has(o.id)) return false;
            seen.add(o.id);
            return true;
          });
          setOrders(unique);
        } catch (err: any) {
          console.warn('Error fetching orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
      setEditName(profile?.name || '');
      setEditPhone(profile?.phone || '');
    }
  }, [user, profile]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(signInEmail, signInPassword);
    } catch (err) {
      // Handled by authStore error
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth',
        },
      });
      if (error) throw error;
    } catch (err: any) {
      alert(err.message || 'Google Sign-In failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!regAcceptTerms) {
      alert("Please accept the Terms & Conditions");
      return;
    }
    
    setOtpError(null);
    setOtpAlertMessage(null);
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: regPhone }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSessionId(data.sessionId);
      setIsVerifyingOtp(true);
      
      if (data.isMock) {
        setOtpAlertMessage(`OTP sent successfully! (For testing, enter code: 123456)`);
      } else {
        setOtpAlertMessage(`OTP sent successfully to your mobile number!`);
      }
    } catch (err: any) {
      alert(err.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: otpSessionId, otp: enteredOtp.trim() }),
      });
      const data = await res.json();
      
      if (!res.ok || !data.verified) {
        throw new Error(data.error || 'Incorrect OTP code');
      }

      // Complete real Supabase signup
      await signUp(regName, regEmail, regPhone, regPassword);
      setIsVerifyingOtp(false);
      setOtpAlertMessage(null);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to verify OTP or complete registration.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccess(false);
    try {
      await updateProfile(editName, editPhone);
      // Sync to user_metadata
      await supabase.auth.updateUser({
        data: {
          name: editName,
          phone: editPhone
        }
      });
      setEditSuccess(true);
      setTimeout(() => setIsEditingProfile(false), 1500);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update profile.');
    }
  };

  // ── RENDER PROFILE DASHBOARD ──
  if (user) {
    const menuItems = [
      { id: 'profile', name: 'My Profile', icon: User, href: '#MyProfile' },
      { id: 'orders', name: 'Orders', icon: ShoppingBag, href: '#Orders' },
      { id: 'wishlist', name: 'Wishlist', icon: Heart, href: '#Wishlist' },
      { id: 'payments', name: 'Saved Payments Method', icon: CreditCard, href: '#Payments' },
      { id: 'address', name: 'Saved Address', icon: MapPin, href: '#Address' },
      { id: 'neucoins', name: 'NeuCoins', icon: ({ className }: any) => (
        <span className={`font-extrabold font-serif text-[11px] leading-none ${className}`}>N</span>
      ), href: '#NeuCoins' },
    ];

    return (
      <div className="bg-[#f8f9fa] min-h-screen pt-32 pb-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1300px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Sidebar Navigation */}
            <div className="lg:col-span-4 space-y-6">
              {/* Hello Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#2D3035] via-[#1E2024] to-[#121315] text-white rounded-[2rem] p-8 min-h-[170px] flex flex-col justify-end shadow-md border border-white/5">
                {/* Sparkles SVG floating in the background */}
                <div className="absolute top-6 right-6 text-white/50 flex gap-1.5">
                  <svg className="w-6 h-6 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
                  </svg>
                  <svg className="w-4.5 h-4.5 text-white/30 mt-3 -ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
                  </svg>
                </div>
                
                <span className="text-white/80 text-sm font-medium tracking-wide">Hello</span>
                <h2 className="font-cormorant text-3xl sm:text-4xl font-bold mt-1.5 tracking-wide leading-tight">
                  {profile?.name || 'Customer'}
                </h2>
              </div>

              {/* Navigation Menu */}
              <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeDashboardTab === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setActiveDashboardTab(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        isActive
                          ? 'text-charcoal bg-gray-50/50'
                          : 'text-[#4a4a4a] hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-charcoal text-white border border-charcoal'
                          : 'bg-gray-50 text-gray-400 border border-gray-100'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1 text-left">{item.name}</span>
                    </a>
                  );
                })}

                {/* Logout Button */}
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider text-[#4a4a4a] hover:bg-gray-50 transition-colors mt-2"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 border border-gray-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="flex-1 text-left">Log Out</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Tab Content Areas */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* TAB 1: Profile View */}
              {activeDashboardTab === 'profile' && (
                <>
                  <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                      <h2 className="font-cormorant text-2xl font-bold text-[#1a1a1a]">My Profile</h2>
                      {!isEditingProfile ? (
                        <button
                          onClick={() => {
                            setEditName(profile?.name || '');
                            setEditPhone(profile?.phone || '');
                            setIsEditingProfile(true);
                            setEditSuccess(false);
                            setEditError(null);
                          }}
                          className="bg-[#f5f5f7] hover:bg-gray-200 text-charcoal font-semibold text-xs py-2 px-5 rounded-full flex items-center gap-1.5 transition-all border border-gray-200 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="bg-charcoal hover:bg-black text-white font-semibold text-xs py-2 px-5 rounded-full transition-all cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            {loading ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => setIsEditingProfile(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2 px-5 rounded-full transition-all cursor-pointer border border-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {editError && <p className="text-red-500 text-xs mb-4">{editError}</p>}
                    {editSuccess && <p className="text-green-600 text-xs mb-4">Profile updated successfully!</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Name input */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Full Name*</label>
                        <input
                          type="text"
                          value={isEditingProfile ? editName : (profile?.name || '')}
                          disabled={!isEditingProfile}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all disabled:opacity-75"
                        />
                      </div>

                      {/* Phone input */}
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Phone Number*</label>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1.5 px-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 select-none">
                            <span className="text-base leading-none">🇮🇳</span>
                            <span className="text-gray-500">(+91)</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            value={isEditingProfile ? editPhone : (profile?.phone || '')}
                            disabled={!isEditingProfile}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="Phone Number"
                            className="flex-1 px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all disabled:opacity-75"
                          />
                        </div>
                      </div>

                      {/* Email input */}
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Email ID*</label>
                        <input
                          type="email"
                          value={user.email || ''}
                          disabled
                          className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-400 cursor-not-allowed select-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Anniversaries Card */}
                  <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center py-12">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="40" cy="55" r="3" fill="#eab308" className="animate-pulse" />
                        <circle cx="160" cy="70" r="4" fill="#eab308" className="animate-pulse" />
                        <circle cx="150" cy="150" r="2" fill="#eab308" className="animate-pulse" />
                        <path d="M75,60 C65,40 95,30 100,60 C105,30 135,40 125,60 Z" fill="#C5A880" stroke="#D4AF37" strokeWidth="2.5" />
                        <path d="M85,60 C75,45 95,38 100,60 C105,38 125,45 115,60 Z" fill="#E2C99D" />
                        <ellipse cx="100" cy="165" rx="55" ry="12" fill="rgba(0,0,0,0.05)" />
                        <rect x="55" y="85" width="90" height="70" rx="10" fill="#1A1A1A" />
                        <rect x="47" y="60" width="106" height="25" rx="6" fill="#2D3035" />
                        <rect x="92" y="60" width="16" height="95" fill="#C5A880" rx="2" />
                        <rect x="47" y="68" width="106" height="8" fill="#C5A880" />
                      </svg>
                    </div>

                    <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#1a1a1a] mt-4">For your Anniversaries</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
                      Share your special dates, and we&apos;ll create personalized experiences just for you.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-8 max-w-2xl text-left">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Your Birthday</label>
                        <input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Your Anniversary</label>
                        <input
                          type="text"
                          placeholder="DD/MM/YYYY"
                          className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: Orders View */}
              {activeDashboardTab === 'orders' && (
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
                  <h2 className="font-cormorant text-3xl font-bold text-charcoal">Order History</h2>

                  {loadingOrders ? (
                    <div className="py-20 text-center text-warm-gray">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="border border-dashed border-gray-200 p-12 text-center rounded-2xl bg-white">
                      <p className="text-warm-gray text-base mb-6">You haven&apos;t placed any orders yet.</p>
                      <Link href="/shop" className="btn-gold text-xs py-3 px-6">
                        Explore Collections
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const isExpanded = expandedOrder === order.id;
                        const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        });

                        return (
                          <div
                            key={order.id}
                            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                          >
                            <button
                              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                              className="w-full p-5 flex flex-wrap items-center justify-between text-left gap-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="space-y-1">
                                <span className="text-[10px] text-warm-gray uppercase tracking-wider block">Order ID</span>
                                <span className="text-xs font-mono font-medium text-charcoal truncate block max-w-[120px] sm:max-w-none">
                                  {order.id}
                                </span>
                              </div>

                              <div>
                                <span className="text-[10px] text-warm-gray uppercase tracking-wider block">Placed On</span>
                                <span className="text-sm font-medium text-charcoal">{orderDate}</span>
                              </div>

                              <div>
                                <span className="text-[10px] text-warm-gray uppercase tracking-wider block">Total Amount</span>
                                <span className="text-sm font-medium text-charcoal">{formatPrice(parseFloat(order.total || order.total_amount || 0))}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-champagne text-[10px] font-semibold text-charcoal uppercase tracking-wider border border-gray-100">
                                  {order.status}
                                </span>
                                <svg
                                  className={`w-4 h-4 text-warm-gray transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                >
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              </div>
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-gray-100 p-5 bg-champagne/30"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-4">
                                      <h3 className="text-xs uppercase tracking-wider text-warm-gray font-semibold border-b border-gray-200/50 pb-2">
                                        Items Ordered
                                      </h3>
                                      {order.items?.map((item: any) => {
                                        const itemName = item.name || item.product?.name || 'Jewellery Piece';
                                        const itemImage = item.image || item.product?.images?.[0] || null;
                                        const itemPrice = item.price || item.product?.price || 0;
                                        const itemQty = item.quantity || 1;
                                        const itemSlug = item.product?.slug;
                                        return (
                                          <div key={item.product_id || item.product?.id || item.id} className="flex items-center gap-4 py-1">
                                            <div className="w-14 h-14 bg-light-gray flex-shrink-0 relative overflow-hidden rounded-md border border-gray-100">
                                              {itemImage ? (
                                                <img
                                                  src={itemImage}
                                                  alt={itemName}
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-warm-gray">MJ</div>
                                              )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              {itemSlug ? (
                                                <Link
                                                  href={`/shop/${itemSlug}`}
                                                  className="text-sm font-medium text-charcoal hover:underline truncate block"
                                                >
                                                  {itemName}
                                                </Link>
                                              ) : (
                                                <span className="text-sm font-medium text-charcoal truncate block">{itemName}</span>
                                              )}
                                              <span className="text-xs text-warm-gray">
                                                Qty: {itemQty} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                                              </span>
                                            </div>
                                            <span className="text-sm font-medium text-charcoal">
                                              {formatPrice(itemPrice * itemQty)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    <div className="space-y-4">
                                      <h3 className="text-xs uppercase tracking-wider text-warm-gray font-semibold border-b border-gray-200/50 pb-2">
                                        Shipment & Summary
                                      </h3>
                                      <div className="text-xs space-y-2 text-charcoal">
                                        <p>
                                          <strong className="text-warm-gray">Address:</strong><br />
                                          {order.address?.fullName}<br />
                                          {order.address?.line1}, {order.address?.line2 ? `${order.address.line2}, ` : ''}
                                          {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                                        </p>
                                        <p>
                                          <strong className="text-warm-gray">Shipping:</strong> {order.shipping_method === 'express' ? 'Express' : 'Standard'}
                                        </p>
                                        <p>
                                          <strong className="text-warm-gray">Payment:</strong> {(order.payment_method || 'N/A').toUpperCase()}
                                        </p>

                                        <div className="pt-2 border-t border-gray-200/50 space-y-1 text-sm">
                                          <div className="flex justify-between text-xs text-warm-gray">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(parseFloat(order.subtotal))}</span>
                                          </div>
                                          <div className="flex justify-between text-xs text-warm-gray">
                                            <span>Shipping</span>
                                            <span>{parseFloat(order.shipping) === 0 ? 'FREE' : formatPrice(parseFloat(order.shipping))}</span>
                                          </div>
                                          <div className="flex justify-between text-xs text-warm-gray">
                                            <span>GST (3%)</span>
                                            <span>{formatPrice(parseFloat(order.gst))}</span>
                                          </div>
                                          <div className="flex justify-between font-medium pt-1 text-charcoal">
                                            <span>Total</span>
                                            <span>{formatPrice(parseFloat(order.total || order.total_amount || 0))}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Wishlist View */}
              {activeDashboardTab === 'wishlist' && (
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center py-20">
                  <Heart className="w-16 h-16 text-charcoal/10 mx-auto mb-4" />
                  <h2 className="font-cormorant text-3xl font-bold text-gray-800 mb-2">My Wishlist</h2>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
                    Keep track of items you love! Your wishlist is currently empty.
                  </p>
                  <Link href="/shop" className="bg-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3 px-8 rounded-xl transition-all">
                    Start Shopping
                  </Link>
                </div>
              )}

              {/* TAB 4: Saved Payments View */}
              {activeDashboardTab === 'payments' && (
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center py-20">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="font-cormorant text-3xl font-bold text-gray-800 mb-2">Saved Payment Methods</h2>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    You don&apos;t have any saved payment methods. Save your cards at checkout for faster payments.
                  </p>
                </div>
              )}

              {/* TAB 5: Saved Address View */}
              {activeDashboardTab === 'address' && (
                <div className="space-y-6">
                  {isEditingAddress ? (
                    /* Add / Edit Address Form */
                    <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] animate-fadeIn">
                      <div className="border-b border-gray-100 pb-5 mb-6">
                        <h2 className="font-cormorant text-2xl font-bold text-[#1a1a1a]">
                          {currentAddressToEdit ? 'Edit Address' : 'Add New Address'}
                        </h2>
                      </div>

                      <form onSubmit={handleSaveAddress} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Full Name*</label>
                            <input
                              type="text"
                              value={addrName}
                              onChange={(e) => setAddrName(e.target.value)}
                              className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Phone Number*</label>
                            <input
                              type="tel"
                              value={addrPhone}
                              onChange={(e) => setAddrPhone(e.target.value)}
                              placeholder="+91 XXXXX XXXXX"
                              className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Pincode*</label>
                            <input
                              type="text"
                              value={addrPincode}
                              onChange={(e) => setAddrPincode(e.target.value)}
                              className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Address Line 1*</label>
                            <input
                              type="text"
                              value={addrLine1}
                              onChange={(e) => setAddrLine1(e.target.value)}
                              className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Address Line 2 (Optional)</label>
                            <input
                              type="text"
                              value={addrLine2}
                              onChange={(e) => setAddrLine2(e.target.value)}
                              className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">City*</label>
                            <input
                              type="text"
                              value={addrCity}
                              onChange={(e) => setAddrCity(e.target.value)}
                              className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">State*</label>
                            <input
                              type="text"
                              value={addrState}
                              onChange={(e) => setAddrState(e.target.value)}
                              className="w-full px-4 py-3 bg-[#f8f9fa] border border-gray-100 rounded-xl text-sm font-semibold text-gray-800 focus:outline-hidden focus:border-charcoal/30 focus:bg-white transition-all"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                          <button
                            type="submit"
                            className="bg-charcoal hover:bg-black text-white font-semibold text-xs py-2.5 px-6 rounded-full transition-all cursor-pointer shadow-sm"
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingAddress(false);
                              setCurrentAddressToEdit(null);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 px-6 rounded-full transition-all cursor-pointer border border-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Address List View */
                    <>
                      {/* Default Address Section */}
                      <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                        <h2 className="font-cormorant text-3xl font-bold text-[#1a1a1a] mb-6">Saved Address</h2>
                        
                        <h4 className="text-xs font-bold text-[#1a1a1a] tracking-wider uppercase mb-3">Default Address</h4>
                        
                        {addresses.filter((addr) => addr.isDefault).map((defaultAddr) => (
                          <div key={defaultAddr.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 rounded-2xl border border-gray-100 bg-[#fbfcfd]">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-gray-100 text-charcoal border border-gray-200 flex items-center justify-center font-bold text-sm shrink-0">
                                {defaultAddr.fullName.charAt(0).toUpperCase()}
                              </div>
                              <div className="text-xs space-y-1.5 text-gray-700">
                                <strong className="text-sm font-semibold text-[#1a1a1a] block">{defaultAddr.fullName}</strong>
                                <p className="text-gray-500 leading-relaxed max-w-md">
                                  {defaultAddr.line1}{defaultAddr.line2 ? `, ${defaultAddr.line2}` : ''}, {defaultAddr.city}, {defaultAddr.state}, {defaultAddr.pincode}, India
                                </p>
                                <span className="text-gray-500 block mt-1">{defaultAddr.phone}</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => startEditAddress(defaultAddr)}
                              className="self-start sm:self-auto border border-charcoal/40 text-charcoal hover:bg-charcoal/5 text-xs font-semibold px-5 py-1.5 rounded-full transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        ))}

                        {addresses.filter((addr) => addr.isDefault).length === 0 && (
                          <p className="text-gray-500 text-sm text-center py-6">No default address set. Please add or choose an address.</p>
                        )}
                      </div>

                      {/* Other Addresses Section */}
                      <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xs font-bold text-[#1a1a1a] tracking-wider uppercase">Other Addresses</h4>
                          <button
                            onClick={startAddAddress}
                            className="text-charcoal hover:underline font-bold text-xs cursor-pointer"
                          >
                            Add address
                          </button>
                        </div>

                        <div className="space-y-4">
                          {addresses.filter((addr) => !addr.isDefault).map((addr) => (
                            <div key={addr.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 rounded-2xl border border-gray-100 bg-[#fbfcfd]">
                              <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 border border-gray-200 flex items-center justify-center font-bold text-sm shrink-0">
                                  {addr.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-xs space-y-1.5 text-gray-700">
                                  <strong className="text-sm font-semibold text-[#1a1a1a] block">{addr.fullName}</strong>
                                  <p className="text-gray-500 leading-relaxed max-w-md">
                                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state}, {addr.pincode}, India
                                  </p>
                                  <span className="text-gray-500 block mt-1">{addr.phone}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <button
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-gray-500 hover:text-gray-800 text-xs font-semibold px-3 py-1.5 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                                >
                                  Make Default
                                </button>
                                <button
                                  onClick={() => startEditAddress(addr)}
                                  className="text-charcoal hover:text-black text-xs font-semibold px-3 py-1.5 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-1.5 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}

                          {addresses.filter((addr) => !addr.isDefault).length === 0 && (
                            <p className="text-gray-400 text-xs text-center py-4">No other addresses saved.</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 6: NeuCoins View */}
              {activeDashboardTab === 'neucoins' && (
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl p-8 text-white mb-8 shadow-sm">
                    <span className="text-xs uppercase tracking-widest font-bold text-white/80">Available Balance</span>
                    <h3 className="text-4xl font-extrabold mt-2 flex items-center gap-2">
                      0 <span className="text-lg font-medium text-white/90">NeuCoins</span>
                    </h3>
                  </div>
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Earn NeuCoins on every purchase and redeem them on your next order! 1 NeuCoin = ₹1.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER SIGN-IN / REGISTER FORM ──
  // ── RENDER SIGN-IN / REGISTER FORM ──
  return (
    <div className="bg-[#070707] min-h-screen flex items-center justify-center p-4 pt-36 pb-24 relative font-inter overflow-hidden">
      {/* Background Subtle Radial Glow & Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-[#1C1C1E]/60 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 overflow-hidden backdrop-blur-md">
          {/* MJ Logo */}
          <div className="text-center mb-10 flex flex-col items-center">
            {/* Logo medallion */}
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-black flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/brand-logo.jpeg" 
                alt="Mahalaxmi Jewellers Logo" 
                className="w-[102%] h-[102%] object-cover scale-[1.02]" 
              />
            </div>
            <h1 className="font-cormorant text-3xl font-bold text-white tracking-wide">
              Mahalaxmi Jewellers
            </h1>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-bold mt-1">
              925 Sterling Silver Jewellery
            </p>
          </div>

          {/* Tabs */}
          <div className="flex relative mb-10 border-b border-white/10">
            {(['signin', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-4 font-cormorant text-lg uppercase tracking-[0.1em] transition-colors duration-300 ${
                  activeTab === tab ? 'text-white font-bold' : 'text-white/40 hover:text-white/70'
                }`}
                id={`auth-tab-${tab}`}
              >
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
            {/* Animated underline */}
            <motion.div
              layoutId="auth-tab-underline"
              className="absolute bottom-0 h-[2px] bg-white"
              style={{ width: '50%' }}
              animate={{ x: activeTab === 'signin' ? '0%' : '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Global error message */}
          {error && (
            <div className="mb-6 bg-red-950/30 border border-red-900/50 p-4 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-red-300">{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <motion.form
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSignIn}
              className="space-y-5"
            >
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Email</label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-white placeholder-white/20 focus:outline-hidden focus:border-white/30 focus:bg-white/10 transition-all"
                  required
                  id="signin-email"
                  placeholder="name@example.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Password</label>
                <input
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-white placeholder-white/20 focus:outline-hidden focus:border-white/30 focus:bg-white/10 transition-all"
                  required
                  id="signin-password"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-gray-100 active:bg-gray-200 text-charcoal rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                id="signin-submit"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">or</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </motion.form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={isVerifyingOtp ? handleVerifyOtp : handleRegister}
              className="space-y-5"
            >
              {otpAlertMessage && (
                <div className="mb-4 bg-amber-950/40 border border-amber-900/50 p-4 rounded-2xl text-xs font-semibold text-amber-300">
                  {otpAlertMessage}
                </div>
              )}
              {otpError && (
                <div className="mb-4 bg-red-950/40 border border-red-900/50 p-4 rounded-2xl text-xs font-semibold text-red-300">
                  {otpError}
                </div>
              )}

              {isVerifyingOtp ? (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Enter Verification Code (OTP)*</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-white placeholder-white/20 focus:outline-hidden focus:border-white/30 focus:bg-white/10 transition-all text-center tracking-widest text-lg"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-gray-100 active:bg-gray-200 text-charcoal rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Completing Sign Up...' : 'Confirm OTP & Sign Up'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsVerifyingOtp(false);
                      setOtpAlertMessage(null);
                    }}
                    className="w-full flex items-center justify-center gap-2.5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Go Back
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-white placeholder-white/20 focus:outline-hidden focus:border-white/30 focus:bg-white/10 transition-all"
                      required
                      id="reg-name"
                      placeholder="Full Name"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Email</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-white placeholder-white/20 focus:outline-hidden focus:border-white/30 focus:bg-white/10 transition-all"
                      required
                      id="reg-email"
                      placeholder="name@example.com"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Phone</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-white placeholder-white/20 focus:outline-hidden focus:border-white/30 focus:bg-white/10 transition-all"
                      required
                      id="reg-phone"
                      placeholder="+91 99999 99999"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-white placeholder-white/20 focus:outline-hidden focus:border-white/30 focus:bg-white/10 transition-all"
                      required
                      id="reg-password"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-medium text-white placeholder-white/20 focus:outline-hidden focus:border-white/30 focus:bg-white/10 transition-all"
                      required
                      id="reg-confirm-password"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regAcceptTerms}
                      onChange={(e) => setRegAcceptTerms(e.target.checked)}
                      className="w-4 h-4 accent-white mt-0.5"
                      id="reg-terms"
                      disabled={loading}
                    />
                    <span className="text-white/60 text-sm">
                      I agree to the{' '}
                      <span className="text-white hover:underline transition-colors decoration-solid">
                        Terms & Conditions
                      </span>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-gray-100 active:bg-gray-200 text-charcoal rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    id="reg-submit"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP & Create Account'}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">or</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </>
              )}

            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center text-warm-gray">
        Loading...
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
