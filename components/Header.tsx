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

const dropdownData: Record<string, {
  title: string;
  items: { label: string; image: string; path: string }[];
  curated: string[];
  pricePath: string;
  isMoreStyles?: boolean;
  filterTitle?: string;
  filters?: string[];
}> = {
  'Earrings': {
    title: 'Earrings',
    items: [
      { label: 'Jhumkas & Studs', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80', path: '/shop?category=earrings' },
      { label: 'Hoops & Huggies', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=400&q=80', path: '/shop?category=earrings' },
      { label: 'Ear Cuffs', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80', path: '/shop?category=earrings' },
    ],
    curated: ['Everyday Studs', 'Statement Jhumkas', 'Silver Hoops', 'Gold Ear Cuffs', 'Earrings Under 2K'],
    pricePath: '/shop?category=earrings'
  },
  'Necklaces': {
    title: 'Necklaces',
    items: [
      { label: 'Pendant Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', path: '/shop?category=necklaces' },
      { label: 'Chokers & Collar', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80', path: '/shop?category=necklaces' },
      { label: 'Statement Necklace', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80', path: '/shop?category=necklaces' },
    ],
    curated: ['Everyday Necklaces', 'Structured Necklace', 'Gold Plated Necklaces', 'Charm Necklaces', 'Black Bead Necklaces', 'Necklaces Under 2K'],
    pricePath: '/shop?category=necklaces'
  },
  'Bracelets': {
    title: 'Bracelets',
    items: [
      { label: 'Flexi Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80', path: '/shop?category=bracelets' },
      { label: 'Chain Bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=400&q=80', path: '/shop?category=bracelets' },
      { label: 'Hinge Bracelets', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80', path: '/shop?category=bracelets' },
    ],
    curated: ['Everyday Bracelets', 'Statement Bracelets', 'Gold Plated Bracelets', 'Hand Harness Bracelets', 'Palm Cuffs & Cuffs', 'Silver Rakhi'],
    pricePath: '/shop?category=bracelets'
  },
  'Rings': {
    title: 'Rings',
    items: [
      { label: 'Solitaire Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80', path: '/shop?category=rings' },
      { label: 'Band Rings', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80', path: '/shop?category=rings' },
      { label: 'Adjustable Rings', image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=400&q=80', path: '/shop?category=rings' },
    ],
    curated: ['Everyday Rings', 'Statement Rings', 'Silver Bands', 'Gold Plated Rings', 'Adjustable Rings', 'Rings Under 1.5K'],
    pricePath: '/shop?category=rings'
  },
  "Men's": {
    title: "Men's Jewellery",
    items: [
      { label: 'Chains', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', path: '/shop?gender=men&category=necklaces' },
      { label: 'Rings', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80', path: '/shop?gender=men&category=rings' },
      { label: 'Earrings', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80', path: '/shop?gender=men&category=earrings' },
      { label: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80', path: '/shop?gender=men&category=bracelets' },
    ],
    curated: ['Everyday Chains', 'Kada & Bracelets', 'Studs for Men', "Men's Rings"],
    pricePath: '/shop?gender=men',
    isMoreStyles: true
  },
  'More Styles': {
    title: 'More Styles',
    items: [
      { label: 'Toe Rings', image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&w=400&q=80', path: '/shop?category=rings' },
      { label: 'Brooches', image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80', path: '/shop?category=custom' },
      { label: 'Nose Pins & Hair Accessories', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80', path: '/shop?category=custom' },
      { label: 'Anklets', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=400&q=80', path: '/shop?category=anklets' },
    ],
    curated: ['Septum Rings', 'Juda Pins', 'Brooch', 'All Styles'],
    pricePath: '/shop',
    isMoreStyles: true,
    filterTitle: 'Shop By Metal',
    filters: ['Silver', 'Brass']
  }
};

export default function Header() {
  const scrollY = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
      <div 
        className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        onMouseLeave={() => setHoveredLink(null)}
      >
        {/* Announcement Bar */}
        <div className="bg-[#121212] border-b border-white/5 text-[#9DF2D5] h-7.5 flex items-center justify-center text-[10px] font-bold tracking-widest uppercase px-4 text-center">
          Handcrafted in 925 Sterling Silver | Free Shipping Across India
        </div>

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
                onMouseEnter={() => setHoveredLink(link.label)}
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

          {/* ── Dynamic Category Mega Menu Dropdown ── */}
          <AnimatePresence>
            {hoveredLink && dropdownData[hoveredLink] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-[100%] left-0 right-0 bg-[#0A0A0A] border-b border-white/5 px-12 py-8 shadow-2xl z-50 pointer-events-auto text-white"
              >
                <div className="max-w-[1300px] mx-auto">
                  {/* Centered Category Title */}
                  <h3 className="font-cormorant text-xl font-extrabold text-center text-white tracking-[0.1em] mb-8 uppercase">
                    {dropdownData[hoveredLink].title}
                  </h3>

                  <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Visual product items (grid-cols-9) */}
                    <div className="col-span-9 grid grid-cols-4 gap-6">
                      {dropdownData[hoveredLink].items.map((item, idx) => (
                        <Link key={idx} href={item.path} className="group block text-center space-y-3">
                          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#121212] border border-white/5 shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                            <img 
                              src={item.image} 
                              alt={item.label} 
                              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors block uppercase tracking-widest">{item.label}</span>
                        </Link>
                      ))}

                      {/* SEE ALL Card - only render if not More Styles */}
                      {!dropdownData[hoveredLink].isMoreStyles && (
                        <Link href={dropdownData[hoveredLink].pricePath} className="group block text-center space-y-3">
                          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#9DF2D5] flex items-center justify-center border border-[#7FE1CC]">
                            <div className="w-[78%] aspect-square rounded-full bg-black flex items-center justify-center shadow-md group-hover:scale-[1.03] transition-transform duration-300">
                              <span className="text-[#9DF2D5] font-black text-xs tracking-wider">SEE ALL</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-white/60 group-hover:text-white transition-colors block uppercase tracking-widest">Can&apos;t decide?</span>
                        </Link>
                      )}
                    </div>

                    {/* Right side list filters (grid-cols-3) */}
                    <div className="col-span-3 grid grid-cols-2 gap-6 border-l border-white/10 pl-8">
                      {/* Shop by Price / Metal */}
                      <div className="space-y-4">
                        <h5 className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-black mb-3">
                          {dropdownData[hoveredLink].filterTitle || 'Shop By Price'}
                        </h5>
                        <div className="flex flex-col gap-2.5">
                          {dropdownData[hoveredLink].filters ? (
                            dropdownData[hoveredLink].filters.map((f, i) => (
                              <Link key={i} href={dropdownData[hoveredLink].pricePath} className="text-[10px] text-white/70 hover:text-white font-semibold uppercase tracking-wider block">{f}</Link>
                            ))
                          ) : (
                            <>
                              <Link href={`${dropdownData[hoveredLink].pricePath}&maxPrice=1500`} className="text-[10px] text-white/70 hover:text-white font-semibold uppercase tracking-wider">Below Rs. 1500</Link>
                              <Link href={`${dropdownData[hoveredLink].pricePath}&minPrice=1500&maxPrice=3000`} className="text-[10px] text-white/70 hover:text-white font-semibold uppercase tracking-wider">Rs. 1500 - 3000</Link>
                              <Link href={`${dropdownData[hoveredLink].pricePath}&minPrice=3000&maxPrice=5000`} className="text-[10px] text-white/70 hover:text-white font-semibold uppercase tracking-wider">Rs. 3000 - 5000</Link>
                              <Link href={`${dropdownData[hoveredLink].pricePath}&minPrice=5000`} className="text-[10px] text-white/70 hover:text-white font-semibold uppercase tracking-wider">Rs. 5000 Above</Link>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Curated By */}
                      <div className="space-y-4">
                        <h5 className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-black mb-3">Curated By</h5>
                        <div className="flex flex-col gap-2.5">
                          {dropdownData[hoveredLink].curated.map((c, i) => (
                            <Link key={i} href={dropdownData[hoveredLink].pricePath} className="text-[10px] text-white/70 hover:text-white font-semibold uppercase tracking-wider truncate block">{c}</Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
