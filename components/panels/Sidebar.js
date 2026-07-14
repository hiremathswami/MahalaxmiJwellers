import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Gem, 
  Layers, 
  LogOut,
  User,
  Users,
  Calendar
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Gem },
    { name: 'Inventory', href: '/admin/inventory', icon: Layers },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-60 bg-[#0f1117] text-[#e8e8e8] flex flex-col h-screen fixed left-0 top-0 border-r border-gray-800 z-30">
      {/* Header / Brand */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand-logo.jpeg" alt="Mahalaxmi Jewellers" className="h-14 w-auto object-contain brightness-110" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-gray-400 font-semibold block">Silver Jewellery</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] border-l-4 border-[#C0C0C0]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#C0C0C0]' : 'text-gray-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-800 bg-gray-950/40 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/5">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase block">Admin Access</span>
            <span className="text-[11px] font-medium text-white truncate block" title={user?.email}>
              {user?.email || 'rohanhiremathswami99@gmail.com'}
            </span>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-950/30 text-red-400 hover:bg-red-900/20 active:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
