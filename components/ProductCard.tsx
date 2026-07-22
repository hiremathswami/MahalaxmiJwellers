'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Product, formatPrice } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-light-gray aspect-square mb-4">
        {/* Product Image */}
        <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              product.images && product.images[0] && product.images[0].length > 0
                ? product.images[0]
                : '/images/products/ring-2.jpg'
            }
            alt={product.name}
            onError={(e) => {
              // Fallback on image load error
              (e.currentTarget as HTMLImageElement).src = '/images/products/ring-2.jpg';
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleItem(product);
          }}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white transition-all duration-300 rounded-full shadow-sm"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          id={`wishlist-toggle-${product.id}`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={wishlisted ? '#6B7280' : 'none'}
            stroke={wishlisted ? '#6B7280' : '#9CA3AF'}
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-charcoal text-white text-[10px] font-medium uppercase tracking-[0.15em] px-3 py-1">
            New
          </span>
        )}
        {product.isBestSeller && !product.isNew && (
          <span className="absolute top-4 left-4 bg-silver text-white text-[10px] font-medium uppercase tracking-[0.15em] px-3 py-1">
            Bestseller
          </span>
        )}

        {/* Quick view on hover */}
        <Link
          href={`/shop/${product.slug}`}
          className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/10 transition-all duration-500 flex items-center justify-center"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-charcoal text-xs uppercase tracking-[0.15em] border border-charcoal/30 bg-white/90 px-5 py-2.5 hover:bg-charcoal hover:text-white">
            Quick View
          </span>
        </Link>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <p className="text-warm-gray text-[10px] uppercase tracking-[0.15em]">
          {product.metal} · {product.stone}
        </p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-cormorant text-lg text-charcoal group-hover:text-silver-dark transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-charcoal font-medium">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-warm-gray text-sm line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          onClick={() => addToCart(product)}
          className="btn-black w-full mt-3 text-[11px] group-hover:bg-charcoal group-hover:text-white group-hover:border-charcoal"
          id={`add-to-bag-${product.id}`}
        >
          Add to Bag
        </button>
      </div>
    </motion.div>
  );
}
