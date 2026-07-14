'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductBySlug, getRelatedProducts, formatPrice } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import ProductCard from '@/components/ProductCard';

const discoverCategories = [
  { label: 'Silver Rakhi', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=150', isAction: false },
  { label: 'New Arrivals', isAction: true, text: 'New Arrivals' },
  { label: 'Earrings', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=150', isAction: false, path: '/shop?category=earrings' },
  { label: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150', isAction: false, path: '/shop?category=necklaces' },
  { label: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150', isAction: false, path: '/shop?category=bracelets' },
  { label: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150', isAction: false, path: '/shop?category=rings' },
  { label: 'Accessories', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150', isAction: false },
  { label: 'Men\'s Jewellery', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=150', isAction: false },
  { label: 'Gifts', image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=150', isAction: false },
  { label: 'Collections', isAction: true, text: 'Shop by Collection' },
  { label: 'Diamonds', image: 'https://images.unsplash.com/photo-1615655096345-61a54750068d?w=150', isAction: false },
  { label: 'Our Stores', isAction: true, text: 'Find a Store' }
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const scrollY = useScrollPosition();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');
  const addToCart = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();

  useEffect(() => {
    fetch('/api/products?limit=100')
      .then((res) => res.json())
      .then((data) => {
        let foundProduct = null;
        if (data.success && data.products) {
          const match = data.products.find((p: any) => {
            const prodSlug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return prodSlug === slug;
          });

          if (match) {
            foundProduct = {
              ...match,
              originalPrice: match.original_price,
              inStock: match.stock > 0,
              isBestSeller: !!match.is_bestseller,
              slug: match.slug || match.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              details: match.details || {
                productDetails: match.description || 'Crafted with premium care and precision.',
                hallmark: '925 Hallmarked Sterling Silver.',
                delivery: 'Complimentary insured shipping within India.',
                care: 'Clean with a soft brush and mild soap solution.'
              }
            };
          }
        }

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          const localProduct = getProductBySlug(slug);
          if (localProduct) {
            setProduct(localProduct);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product details, using local fallback:', err);
        const localProduct = getProductBySlug(slug);
        if (localProduct) {
          setProduct(localProduct);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-cormorant text-4xl text-charcoal mb-4">Product Not Found</h1>
          <Link href="/shop" className="btn-gold">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = product ? getRelatedProducts(product.id) : [];
  const wishlisted = product ? isInWishlist(product.id) : false;
  const handleAddToCart = () => {
    if (product) addToCart(product, quantity, selectedSize);
  };

  const accordionItems = [
    { key: 'details', title: 'Product Details', content: product.details.productDetails },
    { 
      key: 'specifications', 
      title: 'Specifications', 
      content: (
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs text-charcoal pt-2">
          <div className="border-b border-gray-100 pb-2.5">
            <span className="text-[9px] text-warm-gray uppercase tracking-wider block font-bold mb-0.5">Metal Type</span>
            <span className="font-semibold text-charcoal">{product.metal || '925 Sterling Silver'}</span>
          </div>
          <div className="border-b border-gray-100 pb-2.5">
            <span className="text-[9px] text-warm-gray uppercase tracking-wider block font-bold mb-0.5">Gemstone</span>
            <span className="font-semibold text-charcoal">{product.stone || 'None'}</span>
          </div>
          <div className="border-b border-gray-100 pb-2.5">
            <span className="text-[9px] text-warm-gray uppercase tracking-wider block font-bold mb-0.5">Estimated Weight</span>
            <span className="font-semibold text-charcoal">{product.weight || (product.weight_grams ? `${product.weight_grams} g` : 'N/A')}</span>
          </div>
          <div className="border-b border-gray-100 pb-2.5">
            <span className="text-[9px] text-warm-gray uppercase tracking-wider block font-bold mb-0.5">Standard Purity</span>
            <span className="font-semibold text-charcoal">{product.purity || '92.5% Pure Silver'}</span>
          </div>
          <div className="border-b border-gray-100 pb-2.5">
            <span className="text-[9px] text-warm-gray uppercase tracking-wider block font-bold mb-0.5">Category</span>
            <span className="font-semibold text-charcoal capitalize">{product.category}</span>
          </div>
          <div className="border-b border-gray-100 pb-2.5">
            <span className="text-[9px] text-warm-gray uppercase tracking-wider block font-bold mb-0.5">Fulfillment</span>
            <span className="font-semibold text-charcoal">{product.stock > 0 || product.inStock ? 'Ready to Ship' : 'Made to Order'}</span>
          </div>
        </div>
      )
    },
    { key: 'hallmark', title: 'Hallmark & Purity', content: product.details.hallmark },
    { key: 'delivery', title: 'Delivery & Returns', content: product.details.delivery },
    { key: 'care', title: 'Care Instructions', content: product.details.care },
  ];

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24"
        fill={i < Math.floor(rating) ? '#9CA3AF' : 'none'} stroke="#9CA3AF" strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ));

  const showStickyBar = scrollY > 500;

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* Sticky Top Purchase Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[110px] left-0 right-0 z-40 bg-[#F9F7F2] border-b border-gray-100/60 px-6 sm:px-12 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-between"
          >
            <div className="flex flex-col text-left">
              <h4 className="font-bold text-xs text-gray-800 max-w-[200px] sm:max-w-md truncate">{product.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-black text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xs text-warm-gray line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleAddToCart}
                className="bg-black hover:bg-gray-900 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider px-6 sm:px-8 py-3 rounded-full cursor-pointer transition-colors shadow-sm"
              >
                Add To Bag
              </button>
              <button 
                onClick={() => toggleItem(product)}
                className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 font-bold text-[10px] sm:text-xs uppercase tracking-wider px-6 sm:px-8 py-3 rounded-full cursor-pointer transition-colors shadow-sm"
              >
                {wishlisted ? '♥ Wishlisted' : 'Wishlist'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li><Link href="/" className="text-warm-gray hover:text-charcoal transition-colors">Home</Link></li>
            <li className="text-silver">›</li>
            <li><Link href="/shop" className="text-warm-gray hover:text-charcoal transition-colors">Shop</Link></li>
            <li className="text-silver">›</li>
            <li className="text-charcoal">{product.category}</li>
          </ol>
        </nav>
 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-square bg-light-gray mb-4 flex items-center justify-center overflow-hidden relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((imgUrl: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`aspect-square bg-light-gray flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                      selectedImage === i ? 'ring-2 ring-charcoal' : 'ring-1 ring-gray-200 hover:ring-silver'}`}
                    id={`thumb-${i}`}>
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
 
          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }} className="lg:sticky lg:top-28 lg:self-start">
            <h1 className="font-cormorant text-3xl sm:text-[40px] text-charcoal leading-tight mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-charcoal text-2xl font-medium">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-warm-gray line-through">{formatPrice(product.originalPrice)}</span>}
            </div>
            <p className="text-warm-gray text-sm mb-6">Inclusive of all taxes</p>
 
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-0.5">{renderStars(product.rating)}</div>
              <span className="text-charcoal text-sm">{product.rating}</span>
              <span className="text-warm-gray text-sm">({product.reviewCount} reviews)</span>
            </div>
 
            <div className="flex flex-wrap gap-3 mb-8">
              {[{ icon: '◆', label: product.metal }, { icon: '◇', label: product.stone }, { icon: '⚖', label: product.weight || (product.weight_grams ? `${product.weight_grams}g` : null) }]
                .filter(pill => !!pill.label)
                .map((pill, index) => (
                  <span key={index} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-charcoal text-sm">
                    <span className="text-silver text-xs">{pill.icon}</span>{pill.label}
                  </span>
                ))}
            </div>
 
            {product.sizes && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-charcoal text-xs uppercase tracking-[0.15em] font-medium">Ring Size (US)</h4>
                  <button className="text-silver-dark text-xs underline hover:text-charcoal transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: number) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 flex items-center justify-center text-sm transition-all duration-300 ${
                        selectedSize === size ? 'bg-charcoal text-white' : 'border border-gray-200 text-charcoal hover:border-charcoal'}`}
                      id={`size-${size}`}>{size}</button>
                  ))}
                </div>
              </div>
            )}
 
            <div className="mb-8">
              <h4 className="text-charcoal text-xs uppercase tracking-[0.15em] font-medium mb-3">Quantity</h4>
              <div className="flex items-center border border-gray-200 w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-charcoal hover:text-silver-dark transition-colors" id="qty-decrease">−</button>
                <span className="w-11 h-11 flex items-center justify-center text-charcoal border-x border-gray-200">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-charcoal hover:text-silver-dark transition-colors" id="qty-increase">+</button>
              </div>
            </div>
 
            <div className="space-y-3 mb-10">
              <button onClick={handleAddToCart} className="btn-gold w-full text-sm py-4" id="pdp-add-to-bag">Add to Bag</button>
              <button onClick={() => toggleItem(product)} className="btn-ghost-gold w-full text-sm py-4" id="pdp-add-to-wishlist">
                {wishlisted ? '♥ Added to Wishlist' : '♡ Add to Wishlist'}
              </button>
            </div>
 
            <p className="text-warm-gray leading-relaxed mb-10 text-sm">{product.description}</p>
 
            <div className="divide-y divide-gray-200">
              {accordionItems.map((item) => (
                <div key={item.key}>
                  <button onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                    className="w-full flex items-center justify-between py-5 text-left" id={`accordion-${item.key}`}>
                    <span className="text-charcoal text-sm font-medium">{item.title}</span>
                    <svg className={`text-silver transition-transform duration-300 ${openAccordion === item.key ? 'rotate-180' : ''}`}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openAccordion === item.key && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.3 }} className="pb-5">
                      {typeof item.content === 'string' ? (
                        <p className="text-warm-gray text-sm leading-relaxed">{item.content}</p>
                      ) : (
                        item.content
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-gray-100">
            <h2 className="font-cormorant text-4xl text-charcoal text-center mb-12">
              More like this <span className="italic font-normal text-gray-500">handpicked</span> for you
            </h2>
            <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 snap-x snap-mandatory">
              {relatedProducts.slice(0, 4).map((p, i) => (
                <div key={p.id} className="min-w-[280px] lg:min-w-0 snap-center">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link 
                href={`/shop?category=${product.category}`} 
                className="border border-gray-300 hover:border-black text-charcoal hover:bg-gray-50 font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full transition-all cursor-pointer"
              >
                View More
              </Link>
            </div>
          </section>
        )}

        {/* Discover More Categories Section */}
        <section className="mt-24 pt-16 border-t border-gray-100">
          <h2 className="font-cormorant text-3xl font-extrabold text-charcoal text-center mb-12">
            Discover More With Mahalaxmi Jewellers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[1200px] mx-auto">
            {discoverCategories.map((item, idx) => (
              <Link 
                key={idx}
                href={item.path || '/shop'}
                className="flex items-center gap-3 p-3 bg-[#FBFBFA] border border-gray-100 rounded-full hover:shadow-md hover:bg-white transition-all cursor-pointer"
              >
                {item.isAction ? (
                  <div className="w-12 h-12 rounded-full bg-black text-white text-[9px] font-black uppercase text-center flex flex-col items-center justify-center p-1 shrink-0">
                    <span className="leading-tight">{(item.text || '').split(' ')[0]}</span>
                    {item.text && item.text.split(' ')[1] && <span className="text-[#9DF2D5] leading-tight">{item.text.split(' ').slice(1).join(' ')}</span>}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200/50">
                    <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                  </div>
                )}
                <span className="text-[11px] font-extrabold text-gray-800 uppercase tracking-wider">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Pincode Store Locator Section */}
        <section className="mt-24 pt-16 border-t border-gray-100 flex flex-col items-center text-center">
          <h2 className="font-cormorant text-3xl font-extrabold text-charcoal mb-2">
            Find in Store near you!
          </h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-8">
            Buy online & Pickup from the store on the same day
          </p>
          <div className="w-full max-w-md">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const pin = (e.currentTarget.elements.namedItem('pincode') as HTMLInputElement).value;
                if (/^\d{6}$/.test(pin)) {
                  alert(`Mahalaxmi Jewellers is available near you! Immediate pickup available at Kolhapur Main Branch.`);
                } else {
                  alert(`Please enter a valid 6-digit Pincode.`);
                }
              }}
              className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm p-1.5 focus-within:border-black transition-colors"
            >
              <input 
                name="pincode"
                type="text" 
                placeholder="Enter Pincode or City" 
                className="flex-1 px-5 py-2.5 text-sm font-semibold text-gray-700 outline-none placeholder-gray-400"
              />
              <button 
                type="submit"
                className="bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full cursor-pointer transition-colors"
              >
                Locate Me
              </button>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}
