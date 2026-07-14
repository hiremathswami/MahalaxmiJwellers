'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isPanelRoute = pathname.startsWith('/admin') || pathname.startsWith('/owner');

  if (isPanelRoute) {
    return <div className="min-h-screen bg-gray-50 flex flex-col">{children}</div>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
