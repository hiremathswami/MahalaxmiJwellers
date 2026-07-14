'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCollectionBySlug } from '@/data/collections';
import { getProductsByCollection } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function CollectionPage() {
  const params = useParams();
  const slug = params.name as string;
  const collection = getCollectionBySlug(slug);
  const collectionProducts = getProductsByCollection(slug);

  const [sortBy, setSortBy] = useState('Latest');

  const sortedProducts = useMemo(() => {
    const result = [...collectionProducts];
    switch (sortBy) {
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
    }
    return result;
  }, [collectionProducts, sortBy]);

  if (!collection) {
    return (
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-cormorant text-4xl text-charcoal mb-4">Collection Not Found</h1>
          <Link href="/shop" className="btn-gold">Browse All</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[#F8F7F5]">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(156,163,175,0.2) 0%, transparent 60%),
                              radial-gradient(circle at 70% 60%, rgba(156,163,175,0.15) 0%, transparent 50%)`
          }} />
        </div>
        <div className="absolute inset-0 bg-white/10 z-[1]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-[2] text-center px-6"
        >
          <p className="text-silver-dark text-[11px] tracking-[0.25em] uppercase mb-4 font-medium">{collection.tagline}</p>
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-charcoal font-bold">
            {collection.name}
          </h1>
        </motion.div>
      </section>

      {/* Description */}
      <div className="max-w-2xl mx-auto text-center px-6 py-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-warm-gray leading-relaxed text-lg"
        >
          {collection.description}
        </motion.p>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-10">
          <p className="text-warm-gray text-sm">{sortedProducts.length} pieces</p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 text-charcoal text-sm p-2.5 outline-none focus:border-charcoal transition-colors"
            id="collection-sort"
          >
            <option>Latest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {sortedProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-warm-gray text-lg">No products in this collection yet.</p>
            <Link href="/shop" className="btn-gold mt-6 inline-block">Browse All</Link>
          </div>
        )}
      </div>
    </div>
  );
}
