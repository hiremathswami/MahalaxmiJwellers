'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/PromoBanner';
import { products } from '@/data/products';

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bangles', 'Pendants'] as const;
const metals = ['All', '925 Sterling Silver', 'Oxidized Sterling Silver', 'Platinum-Plated Silver', 'Rhodium-Plated Silver', 'Platinum'] as const;
const stones = ['All', 'Diamond', 'Ruby', 'Emerald', 'Sapphire'] as const;

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMetal, setSelectedMetal] = useState<string>('All');
  const [selectedStone, setSelectedStone] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [sortBy] = useState<string>('Latest');
  const [priceRange] = useState<[number, number]>([0, 400000]);
  const [allProducts, setAllProducts] = useState<any[]>(products);

  // Load products from Supabase API on page load
  useEffect(() => {
    fetch('/api/products?limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          const mapped = data.products.map((p: any) => ({
            ...p,
            originalPrice: p.original_price,
            inStock: p.stock > 0,
            isBestSeller: !!p.is_bestseller,
            slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            details: p.details || {
              productDetails: p.description || '',
              hallmark: '925 Hallmarked Sterling Silver.',
              delivery: 'Complimentary insured shipping within India.',
              care: 'Avoid contact with perfumes and chemicals.'
            }
          }));
          setAllProducts(mapped);
        }
      })
      .catch((err) => console.warn('Could not load DB products, using fallback:', err));
  }, []);

  // Parse query parameters on load
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      const matched = categories.find((c) => c.toLowerCase() === category.toLowerCase());
      if (matched) setSelectedCategory(matched);
    } else {
      setSelectedCategory('All');
    }
    const metal = searchParams.get('metal');
    if (metal) {
      const matched = metals.find((m) => m.toLowerCase() === metal.toLowerCase());
      if (matched) setSelectedMetal(matched);
    } else {
      setSelectedMetal('All');
    }
    const stone = searchParams.get('stone');
    if (stone) {
      const matched = stones.find((s) => s.toLowerCase() === stone.toLowerCase());
      if (matched) setSelectedStone(matched);
    } else {
      setSelectedStone('All');
    }
    const gender = searchParams.get('gender');
    if (gender) {
      setSelectedGender(gender.toLowerCase());
    } else {
      setSelectedGender('All');
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (selectedCategory !== 'All') result = result.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    if (selectedMetal !== 'All') result = result.filter((p) => p.metal?.toLowerCase() === selectedMetal.toLowerCase());
    if (selectedStone !== 'All') result = result.filter((p) => p.stone?.toLowerCase() === selectedStone.toLowerCase());
    if (selectedGender !== 'All') {
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes("men") || p.name.toLowerCase().includes("kada") || p.name.toLowerCase().includes("curb");
        const descMatch = p.description && p.description.toLowerCase().includes("men");
        const genderMatch = p.gender === 'men';
        return nameMatch || descMatch || genderMatch;
      });
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'Price: Low to High': result.sort((a, b) => a.price - b.price); break;
      case 'Price: High to Low': result.sort((a, b) => b.price - a.price); break;
      default: result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return result;
  }, [allProducts, selectedCategory, selectedMetal, selectedStone, selectedGender, sortBy, priceRange]);

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="mb-8" id="shop-breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-warm-gray hover:text-charcoal transition-colors">Home</Link></li>
            <li className="text-silver">›</li>
            <li className="text-charcoal">Shop</li>
          </ol>
        </nav>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-cormorant text-4xl lg:text-5xl text-charcoal mb-4">
          Shop All Jewellery
        </motion.h1>

        {/* Promo Banner Container */}
        <div className="mb-8">
          <PromoBanner />
        </div>

        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <p className="text-warm-gray text-sm">Showing {filteredProducts.length} of {allProducts.length} pieces</p>
            {(selectedCategory !== 'All' || selectedMetal !== 'All' || selectedStone !== 'All' || selectedGender !== 'All') && (
              <Link 
                href="/shop" 
                className="text-xs font-bold text-charcoal hover:underline tracking-wider uppercase"
              >
                Clear Filters
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-warm-gray text-lg">No products found in this category.</p>
              <Link href="/shop" className="btn-gold mt-6 text-[11px]">View All Collection</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center">
        <p className="text-warm-gray text-sm">Loading jewellery collection...</p>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  );
}
