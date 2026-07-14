'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/products';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center" id="wishlist-empty">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <svg className="mx-auto text-silver/40 mb-6" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h1 className="font-cormorant text-4xl text-charcoal mb-3">Nothing Saved Yet</h1>
          <p className="text-warm-gray mb-8">Start adding pieces you love to your wishlist.</p>
          <Link href="/shop" className="btn-gold" id="wishlist-discover">
            Discover Jewellery
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12"
        >
          <h1 className="font-cormorant text-4xl lg:text-5xl text-charcoal">My Wishlist</h1>
          <span className="bg-charcoal text-white text-sm font-medium px-3 py-1">{items.length}</span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              {/* Card Image */}
              <div className="relative overflow-hidden bg-light-gray aspect-square mb-4">
                <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Remove from wishlist */}
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-red-50 transition-all duration-300 rounded-full shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Quick View */}
                <Link
                  href={`/shop/${product.slug}`}
                  className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-all duration-500 flex items-center justify-center"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-charcoal text-xs uppercase tracking-[0.15em] border border-charcoal/30 bg-white/90 px-5 py-2.5 hover:bg-charcoal hover:text-white">
                    View Details
                  </span>
                </Link>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <p className="text-warm-gray text-[10px] uppercase tracking-[0.15em]">
                  {product.metal} · {product.stone}
                </p>
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="font-cormorant text-lg text-charcoal group-hover:text-silver-dark transition-colors duration-300">
                    {product.name}
                  </h3>
                </Link>
                <span className="text-charcoal font-medium block">{formatPrice(product.price)}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="btn-black w-full mt-3 text-[11px] group-hover:bg-charcoal group-hover:text-white group-hover:border-charcoal"
                >
                  Add to Bag
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
