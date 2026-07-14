import React from 'react';
import { useAuth } from '@/lib/useAuth';
import { LogOut, ShieldAlert } from 'lucide-react';

export default function TopBar({ title }) {
  const { user, role, signOut } = useAuth();
  
  // Format current date in Belagavi timezone / local format
  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
      {/* Title / Section */}
      <div>
        <h2 className="font-cormorant text-xl sm:text-2xl font-bold text-gray-900 tracking-wide uppercase">
          {title}
        </h2>
      </div>

      {/* Right side info */}
      <div className="flex items-center gap-4 sm:gap-6">
        <span className="hidden md:inline text-xs font-semibold text-gray-400">
          {dateStr}
        </span>
        
        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-gray-200" />

        {/* User Role Badge */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <span className="text-xs font-semibold text-gray-900 block">
              {role === 'admin' ? 'Administrator' : 'Jewellery Maker (Dad)'}
            </span>
            <span className="text-[10px] text-gray-400 font-medium block">
              {user?.email || 'user@example.com'}
            </span>
          </div>
          
          <div className={`p-1.5 rounded-lg border ${
            role === 'admin' 
              ? 'bg-zinc-50 border-zinc-200 text-zinc-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>

        {/* Small screen logout button */}
        <button
          onClick={signOut}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg md:hidden transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
