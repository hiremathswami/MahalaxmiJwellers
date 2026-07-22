'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/PromoBanner';
import { products, formatPrice } from '@/data/products';

/* ── Fade-in-on-scroll wrapper ── */
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const heroVideos = [
  {
    url: '/video/sparkle.mp4',
    tagline: 'Since 1987 · Premium Curated Selection',
    title: 'Discover Your Sparkle',
    desc: 'Exquisite jewellery curated with passion — where timeless selection meets contemporary elegance in every piece.',
  },
  {
    url: '/video/chain.mp4',
    tagline: 'Premium 925 Sterling Silver',
    title: 'The Silver Chain Atelier',
    desc: 'Bold, modern chains designed to make a statement. Hand-finished with precision craftsmanship.',
  },
  {
    url: '/video/necklace.mp4',
    tagline: 'The Bridal Heritage Collection',
    title: 'Exquisite Masterpieces',
    desc: 'Magnificent necklaces and sets featuring emeralds, rubies, and certified diamonds for your special day.',
  },
  {
    url: '/video/earrings.mp4',
    tagline: 'Curated Classics for Everyday',
    title: 'Modern Fine Jewelry',
    desc: 'Graceful oval hoops, classic studs, and fine pendants designed for understated luxury.',
  },
];

const slideVariants = {
  enter: (direction: 'left' | 'right') => ({
    x: direction === 'right' ? '100%' : '-100%',
    opacity: 0.3,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'left' | 'right') => ({
    x: direction === 'right' ? '-100%' : '100%',
    opacity: 0.3,
  }),
};

export default function HomePage() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products?limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          const mappedDb = data.products.map((p: any) => ({
            ...p,
            slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            isBestSeller: !!p.is_bestseller
          }));
          // Merge: DB products take priority, add static ones that aren't in DB
          const dbIds = new Set(mappedDb.map((p: any) => p.id));
          const dbSlugs = new Set(mappedDb.map((p: any) => p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')));
          const merged = [
            ...mappedDb,
            ...products.filter((p: any) => !dbIds.has(p.id) && !dbSlugs.has(p.slug))
          ];
          setDbProducts(merged);
        } else {
          setDbProducts(products);
        }
      })
      .catch(() => {
        setDbProducts(products);
      });
  }, []);

  /* ── Featured Products (bestsellers first) ── */
  const featured = useMemo(() => {
    return [...dbProducts].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)).slice(0, 8);
  }, [dbProducts]);

  /* ── Video Slider State ── */
  const [videoIdx, setVideoIdx] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const goToVideo = (index: number) => {
    setSlideDirection(index > videoIdx ? 'right' : 'left');
    setVideoIdx(index);
  };

  const handleVideoEnded = () => {
    const nextIdx = (videoIdx + 1) % heroVideos.length;
    goToVideo(nextIdx);
  };

  /* ── Collection slider state ── */
  const [colIdx, setColIdx] = useState(0);
  const itemsPerPage = typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : 4;

  const [perPage, setPerPage] = useState(4);
  useEffect(() => {
    const update = () => {
      setPerPage(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIdx = Math.max(0, featured.length - perPage);
  const handlePrev = () => setColIdx((p) => (p <= 0 ? maxIdx : p - 1));
  const handleNext = () => setColIdx((p) => (p >= maxIdx ? 0 : p + 1));
  const visible = featured.slice(colIdx, colIdx + perPage);

  /* ── Category highlights ── */
  const categories = [
    { label: 'Rings', count: dbProducts.filter((p) => p.category?.toLowerCase() === 'rings').length, href: '/shop?category=rings', image: '/images/products/ring-2.jpg' },
    { label: 'Necklaces', count: dbProducts.filter((p) => p.category?.toLowerCase() === 'necklaces').length, href: '/shop?category=necklaces', image: '/images/products/necklace-1.jpg' },
    { label: 'Earrings', count: dbProducts.filter((p) => p.category?.toLowerCase() === 'earrings').length, href: '/shop?category=earrings', image: '/images/products/earring-1.jpg' },
    { label: 'Bangles', count: dbProducts.filter((p) => p.category?.toLowerCase() === 'bangles' || p.category?.toLowerCase() === 'bracelets').length, href: '/shop?category=bangles', image: '/images/products/bangle-1.jpg' },
    { label: 'Pendants', count: dbProducts.filter((p) => p.category?.toLowerCase() === 'pendants').length, href: '/shop?category=pendants', image: '/images/products/pendant-1.jpg' },
  ];

  /* ── Stats ── */
  const stats = [
    { value: '1987', label: 'Established' },
    { value: '10K+', label: 'Happy Clients' },
    { value: '925', label: 'Hallmarked Silver' },
    { value: '100%', label: 'Certified Gems' },
  ];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ═══════════════════════════════════════════════
          HERO — Full viewport immersive sliding video
      ═══════════════════════════════════════════════ */}
      <section className="relative h-screen w-full bg-black flex items-end justify-start overflow-hidden pb-32 sm:pb-36 lg:pb-40 px-6 sm:px-12 lg:px-20" id="hero">
        {/* Background Video Slider */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence initial={false} custom={slideDirection}>
            <motion.div
              key={videoIdx}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 26 },
                opacity: { duration: 0.6 }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <video
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="w-full h-full object-cover"
                style={{ opacity: 0.75 }}
                key={heroVideos[videoIdx].url}
              >
                <source src={heroVideos[videoIdx].url} type="video/mp4" />
              </video>
            </motion.div>
          </AnimatePresence>
          {/* Cinematic overlay — lighter for better video visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 z-[1]" />
          {/* Side vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent z-[1]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-left max-w-3xl mb-4 sm:mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={videoIdx}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Circular Emblem Frame */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-white/10 bg-black flex items-center justify-center mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/brand-logo.jpeg" 
                  alt="Mahalaxmi Jewellers Logo" 
                  className="w-[102%] h-[102%] object-cover scale-[1.02]" 
                />
              </div>

              <span className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/80 font-medium mb-4 sm:mb-6">
                {heroVideos[videoIdx].tagline}
              </span>

              <h1 className="font-cormorant text-5xl sm:text-7xl md:text-8xl lg:text-[96px] text-white font-bold leading-[1.05] mb-5 sm:mb-6 tracking-wide drop-shadow-lg">
                {heroVideos[videoIdx].title.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                  {heroVideos[videoIdx].title.split(' ').slice(-1)[0]}
                </span>
              </h1>

              <p className="text-white/80 text-sm sm:text-base max-w-xl mb-8 sm:mb-10 leading-relaxed font-light drop-shadow">
                {heroVideos[videoIdx].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-row flex-wrap items-center justify-start gap-4"
          >
            <Link
              href="/shop"
              className="px-10 py-4 bg-white text-charcoal rounded-full text-xs sm:text-[13px] font-semibold uppercase tracking-[0.15em] hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center cursor-pointer"
            >
              Shop Collection
            </Link>
            <Link
              href="/shop"
              className="px-10 py-4 border border-white/40 text-white rounded-full text-xs sm:text-[13px] font-semibold uppercase tracking-[0.15em] hover:bg-white/10 hover:border-white/60 transition-all duration-300 text-center cursor-pointer"
            >
              Explore More
            </Link>
          </motion.div>
        </div>

        {/* Slide Navigation Controls */}
        <div className="absolute bottom-8 left-6 sm:left-12 lg:left-20 z-20 flex items-center gap-6">
          {heroVideos.map((video, idx) => (
            <button
              key={idx}
              onClick={() => goToVideo(idx)}
              className="group flex items-center gap-3 text-left focus:outline-none cursor-pointer"
            >
              <div className="relative py-2">
                <span className={`font-mono text-[10px] sm:text-xs transition-colors duration-300 ${idx === videoIdx ? 'text-white font-bold' : 'text-white/40 group-hover:text-white/80'}`}>
                  0{idx + 1}
                </span>
                <div className={`h-[2px] mt-1 transition-all duration-500 ${idx === videoIdx ? 'w-12 bg-white' : 'w-4 bg-white/20 group-hover:w-8 group-hover:bg-white/50'}`} />
              </div>
              <span className={`hidden lg:inline text-[10px] uppercase tracking-wider transition-all duration-300 ${idx === videoIdx ? 'opacity-100 translate-x-0 text-white' : 'opacity-0 -translate-x-2 group-hover:opacity-65 group-hover:translate-x-0 text-white/60'}`}>
                {video.title.split(' ').slice(-1)[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 right-12 z-10 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/35 flex justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-white/70 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <span className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold text-white block mb-1">
                    {stat.value}
                  </span>
                  <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-[0.2em]">
                    {stat.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BROWSE BY CATEGORY — Immersive Visual Cards
      ═══════════════════════════════════════════════ */}
      <section className="bg-white py-20 sm:py-28 lg:py-32" id="categories">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-14 sm:mb-20">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-warm-gray font-medium block mb-4">
                Curated for You
              </span>
              <h2 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-charcoal font-bold leading-tight">
                Browse by Category
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl bg-light-gray shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-gray-100"
                >
                  {/* Category Image Background */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                  />
                  {/* Luxury dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5 group-hover:from-black/95 transition-all duration-500 z-10" />
                  
                  {/* Content Overlaid at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 flex flex-col items-center text-center">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1 block">
                      Collection
                    </span>
                    <h3 className="font-cormorant text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                      {cat.label}
                    </h3>
                    
                    {/* Glassmorphic Shop Badge / Item Count */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-semibold text-white/90 uppercase tracking-wider transition-all duration-300 group-hover:bg-white group-hover:text-charcoal group-hover:border-white">
                      <span>Shop Now</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-0.5">
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PROMO BANNER SECTION
      ═══════════════════════════════════════════════ */}
      <section className="bg-white py-4" id="promo-banners">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <PromoBanner />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SIGNATURE COLLECTION — Product Carousel
      ═══════════════════════════════════════════════ */}
      <section className="bg-champagne py-20 sm:py-28 lg:py-32" id="signature-collection">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Section header with arrows */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
            <Reveal>
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-warm-gray font-medium block mb-4">
                  Handpicked Pieces
                </span>
                <h2 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-charcoal font-bold leading-tight">
                  Signature Collection
                </h2>
              </div>
            </Reveal>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-11 h-11 sm:w-12 sm:h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-300"
                aria-label="Previous"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 sm:w-12 sm:h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-300"
                aria-label="Next"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {visible.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-10 sm:mt-14">
            {Array.from({ length: maxIdx + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setColIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === colIdx ? 'w-8 bg-charcoal' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BRAND STORY / CTA — Immersive split
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0A0A0A] relative overflow-hidden" id="brand-story">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] lg:min-h-[80vh]">
            {/* Left — image */}
            <div className="relative h-[50vh] sm:h-[60vh] lg:h-auto overflow-hidden">
              <img
                src="/uploads/1784046219328-Gold_deity_necklace_on_stand_202607142150.jpeg"
                alt="Lakshmi Nakshi Necklace"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]/60 hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent lg:hidden" />
            </div>

            {/* Right — content */}
            <div className="flex items-center px-6 sm:px-10 lg:px-16 xl:px-20 py-16 sm:py-20 lg:py-0">
              <Reveal>
                <div className="max-w-lg">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/40 font-medium block mb-6">
                    The Art of Adornment
                  </span>
                  <h2 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-[1.1] mb-6 sm:mb-8">
                    Lakshmi Nakshi
                    <br />
                    Necklace
                  </h2>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 max-w-md">
                    Gold Plated 925 Sterling Silver Lakshmi Nakshi Necklace handcrafted with semi-precious pink & emerald CZ cab cut stones, freshwater pearls, and divine nakshi craftsmanship.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/shop/gold-plated-925-silver-lakshmi-nakshi-necklace"
                      className="px-8 py-3.5 bg-white text-charcoal text-xs sm:text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-gray-200 transition-all duration-300 text-center rounded-full shadow-md"
                    >
                      View Lakshmi Necklace
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BESTSELLERS — Dark section grid
      ═══════════════════════════════════════════════ */}
      <section className="bg-jewel-black py-20 sm:py-28 lg:py-32 text-white" id="bestsellers">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-14 sm:mb-20">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/40 font-medium block mb-4">
                Most Loved
              </span>
              <h2 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
                Bestsellers
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(dbProducts.filter((p) => p.isBestSeller || p.is_bestseller).length > 0
              ? dbProducts.filter((p) => p.isBestSeller || p.is_bestseller)
              : dbProducts
            )
              .slice(0, 3)
              .map((product, i) => (
                <Reveal key={product.id} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg text-charcoal">
                    <ProductCard product={product} index={i} />
                  </div>
                </Reveal>
              ))}
          </div>

          <Reveal delay={0.3}>
            <div className="text-center mt-12 sm:mt-16">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-8 py-3.5 border border-white/20 text-white text-xs sm:text-[13px] font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-white hover:text-charcoal transition-all duration-300"
              >
                View All Products
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEWSLETTER — Elegant CTA
      ═══════════════════════════════════════════════ */}
      <section className="bg-champagne py-20 sm:py-28" id="newsletter-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-warm-gray font-medium block mb-4">
                Stay Connected
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl text-charcoal font-bold leading-tight mb-4 sm:mb-6">
                Be the First to Know
              </h2>
              <p className="text-warm-gray text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed max-w-lg mx-auto">
                Subscribe for exclusive access to new collections, special offers,
                and bespoke jewellery insights from our master craftsmen.
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-5 py-3.5 bg-white border border-gray-200 text-charcoal text-sm rounded-full focus:border-charcoal focus:outline-none transition-colors"
                  id="homepage-newsletter-email"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-charcoal text-white text-xs font-semibold uppercase tracking-[0.15em] rounded-full hover:bg-silver-dark transition-all duration-300 whitespace-nowrap"
                  id="homepage-newsletter-submit"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
