'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/panels/Sidebar';
import TopBar from '@/components/panels/TopBar';
import { useAdminGuard } from '@/lib/roleGuard';

export default function AdminLayout({ children }) {
  const { authorized, loading } = useAdminGuard();
  const [title, setTitle] = useState('Admin Panel');

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-inter">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-2 border-gray-950 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-cormorant text-2xl font-bold tracking-wide text-gray-950 uppercase">MJ LAXMI</h3>
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">Verifying Administrator Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-inter">
      {/* Admin Navigation Sidebar */}
      <Sidebar />
      
      {/* Content Workspace */}
      <div className="pl-60 flex-1 flex flex-col min-h-screen">
        <TopBar title={title} />
        
        <main className="p-6 sm:p-8 flex-1 max-w-[1600px] w-full mx-auto">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { setTitle });
            }
            return child;
          })}
        </main>
      </div>
    </div>
  );
}
