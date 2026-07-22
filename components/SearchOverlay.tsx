'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { products as staticProducts } from '@/data/products';

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  metal: string;
  stone: string;
  price: number;
  images?: string[];
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch database products on open
  useEffect(() => {
    let isMounted = true;
    if (isOpen && allProducts.length === 0) {
      const loadProducts = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/products?limit=200');
          const data = await res.json();
          if (!isMounted) return;
          if (data.success && data.products) {
            const dbProducts: SearchProduct[] = data.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              category: p.category || '',
              metal: p.metal || '',
              stone: p.stone || '',
              price: Number(p.price) || 0,
              images: p.images || [],
            }));

            const dbIds = new Set(dbProducts.map(p => p.id));
            const dbSlugs = new Set(dbProducts.map(p => p.slug));
            const merged = [
              ...dbProducts,
              ...staticProducts.filter(p => !dbIds.has(p.id) && !dbSlugs.has(p.slug)).map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                category: p.category,
                metal: p.metal,
                stone: p.stone,
                price: p.price,
                images: p.images || [],
              })),
            ];
            setAllProducts(merged);
          } else {
            setAllProducts(staticProducts.map(p => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              category: p.category,
              metal: p.metal,
              stone: p.stone,
              price: p.price,
              images: p.images || [],
            })));
          }
        } catch {
          if (isMounted) {
            setAllProducts(staticProducts.map(p => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              category: p.category,
              metal: p.metal,
              stone: p.stone,
              price: p.price,
              images: p.images || [],
            })));
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      loadProducts();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, allProducts.length]);

  const filteredProducts = query.length > 1
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.stone.toLowerCase().includes(query.toLowerCase()) ||
          p.metal.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const trending = ['Diamond Rings', 'Silver Necklace', 'Earrings', 'Bracelets'];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] bg-white/98 flex flex-col items-center justify-start pt-32"
          id="search-overlay"
        >
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 text-charcoal/60 hover:text-charcoal transition-colors"
            aria-label="Close search"
            id="search-close-btn"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="w-full max-w-2xl px-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jewellery..."
                className="w-full bg-transparent border-b border-charcoal/20 text-charcoal text-2xl sm:text-3xl font-cormorant py-4 pr-12 outline-none placeholder:text-warm-gray focus:border-charcoal transition-colors duration-300"
                id="search-input"
              />
              <svg
                className="absolute right-0 top-1/2 -translate-y-1/2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Loading state */}
            {loading && query.length > 1 && (
              <p className="mt-8 text-warm-gray text-center text-sm">
                Searching catalog...
              </p>
            )}

            {/* Results */}
            {filteredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4 max-h-[50vh] overflow-y-auto pr-2"
              >
                {filteredProducts.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-3 border-b border-gray-100 hover:border-charcoal/10 transition-colors group"
                  >
                    <div className="w-14 h-14 bg-light-gray flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg">
                      {product.images && product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="text-silver/20" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-charcoal group-hover:text-silver-dark transition-colors font-medium">
                        {product.name}
                      </p>
                      <p className="text-warm-gray text-sm">
                        {product.category} · {product.metal}
                      </p>
                    </div>
                    <span className="ml-auto text-charcoal font-medium">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}

            {/* Trending — shown when no query */}
            {query.length === 0 && (
              <div className="mt-12">
                <p className="text-warm-gray text-xs uppercase tracking-[0.15em] mb-4">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-3">
                  {trending.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-4 py-2 border border-gray-200 text-charcoal/70 text-sm hover:border-charcoal hover:text-charcoal transition-colors duration-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {query.length > 1 && !loading && filteredProducts.length === 0 && (
              <div className="mt-8 text-center space-y-3">
                <p className="text-warm-gray">
                  No results found for &ldquo;{query}&rdquo;
                </p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="text-charcoal text-sm underline underline-offset-4 hover:text-silver-dark transition-colors"
                >
                  Browse all collections →
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
