'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from './SearchOverlay';
import { products as staticProducts } from '@/data/products';

const navLinks = [
  { href: '/shop?category=earrings', label: 'Earrings' },
  { href: '/shop?category=necklaces', label: 'Necklaces' },
  { href: '/shop?category=bracelets', label: 'Bracelets' },
  { href: '/shop?category=rings', label: 'Rings' },
  { href: '/shop?gender=men', label: "Men's" },
  { href: '/shop', label: 'More Styles' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Header() {
  const scrollY = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const { user, initialize } = useAuthStore();

  const [availableStones, setAvailableStones] = useState<string[]>([]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    fetch('/api/products?limit=200')
      .then((res) => res.json())
      .then((data) => {
        const stonesSet = new Set<string>();
        staticProducts.forEach((p: any) => {
          if (p.stone) stonesSet.add(p.stone.toLowerCase().trim());
        });
        if (data.success && data.products) {
          data.products.forEach((p: any) => {
            if (p.stone) stonesSet.add(p.stone.toLowerCase().trim());
          });
        }
        setAvailableStones(Array.from(stonesSet));
      })
      .catch(() => {
        const stonesSet = new Set<string>();
        staticProducts.forEach((p: any) => {
          if (p.stone) stonesSet.add(p.stone.toLowerCase().trim());
        });
        setAvailableStones(Array.from(stonesSet));
      });
  }, []);

  return (
    <>
      {/* Top sticky nav container */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        {/* Main Navigation Bar */}
        <header className="bg-[#0A0A0A] border-b border-white/5 px-6 sm:px-12 py-4 flex items-center justify-between relative transition-all duration-300">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-white/80 hover:text-white"
              aria-label="Open menu"
              id="mobile-menu-btn"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center" id="header-logo">
              <span className="font-cormorant text-2xl font-black tracking-[0.25em] text-white uppercase">
                MJ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10" id="main-nav">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.18em] font-bold text-white/70 hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions & Shopping Cart */}
          <div className="flex items-center gap-5 sm:gap-6">
            
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              id="search-btn"
              className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Account Icon */}
            <Link 
              href="/auth" 
              aria-label="Account" 
              id="account-link" 
              className="text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Wishlist Link */}
            <Link 
              href="/wishlist" 
              aria-label="Wishlist" 
              id="wishlist-link" 
              className="relative text-white/70 hover:text-white transition-colors duration-200 hidden sm:block"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link 
              href="/cart" 
              aria-label="Cart"
              id="cart-link" 
              className="relative text-white/70 hover:text-white transition-colors duration-200"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </header>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-[60] bg-[#0A0A0A] text-white"
            id="mobile-menu"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-12">
                <span className="font-cormorant text-2xl font-black tracking-[0.2em] text-white uppercase">MJ</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  id="mobile-menu-close"
                  className="text-white/85 hover:text-white"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-cormorant text-2xl font-bold text-white/90 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto flex gap-6 pt-8 border-t border-white/5">
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="text-white/50 text-xs uppercase tracking-[0.18em] hover:text-white font-bold">
                  Account
                </Link>
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-white/50 text-xs uppercase tracking-[0.18em] hover:text-black font-bold">
                  Wishlist
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
