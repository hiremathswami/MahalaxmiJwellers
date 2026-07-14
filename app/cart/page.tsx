'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/products';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getShipping, getGST, getTotal } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center" id="cart-empty">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <svg className="mx-auto text-silver/40 mb-6" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v2m0 4v6" /><path d="M8 10a4 4 0 0 1 8 0" />
          </svg>
          <h1 className="font-cormorant text-4xl text-charcoal mb-3">Your Bag is Empty</h1>
          <p className="text-warm-gray mb-8">Discover our exquisite collections and find something you love.</p>
          <Link href="/shop" className="btn-gold" id="cart-shop-now">Shop Now</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-cormorant text-4xl lg:text-5xl text-charcoal mb-12">Your Bag</motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-0 divide-y divide-gray-100">
            {items.map((item, i) => (
              <motion.div key={item.product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} className="flex gap-6 py-8 first:pt-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-light-gray flex-shrink-0 relative overflow-hidden rounded-2xl border border-gray-100 flex items-center justify-center">
                  {item.product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="text-silver/20" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/shop/${item.product.slug}`} className="font-cormorant text-xl text-charcoal hover:text-silver-dark transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="text-warm-gray text-sm mt-1">{item.product.metal}{item.selectedSize ? ` · Size ${item.selectedSize}` : ''}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-charcoal hover:text-silver-dark transition-colors text-sm">−</button>
                      <span className="w-9 h-9 flex items-center justify-center text-charcoal text-sm border-x border-gray-200">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-charcoal hover:text-silver-dark transition-colors text-sm">+</button>
                    </div>
                    <span className="text-charcoal font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.product.id)} className="text-silver hover:text-charcoal transition-colors self-start mt-1" aria-label="Remove item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <div className="border border-gray-200 bg-champagne p-8 lg:sticky lg:top-28">
              <h2 className="font-cormorant text-2xl text-charcoal mb-8">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm"><span className="text-warm-gray">Subtotal</span><span className="text-charcoal">{formatPrice(getSubtotal())}</span></div>
                <div className="flex justify-between text-sm"><span className="text-warm-gray">Shipping</span>
                  <span className="text-charcoal">{getShipping() === 0 ? <span className="text-silver-dark font-medium">FREE</span> : formatPrice(getShipping())}</span>
                </div>
                <div className="flex justify-between text-sm"><span className="text-warm-gray">GST (3%)</span><span className="text-charcoal">{formatPrice(getGST())}</span></div>
                <div className="divider-gold" />
                <div className="flex justify-between pt-2">
                  <span className="text-charcoal font-medium">Total</span>
                  <span className="text-charcoal text-xl font-cormorant font-bold">{formatPrice(getTotal())}</span>
                </div>
              </div>
              <div className="flex gap-2 mb-8">
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code"
                  className="input-light flex-1 text-sm py-3" id="promo-input" />
                <button onClick={() => { if (promoCode) setPromoApplied(true); }} className="btn-ghost-gold text-[11px] px-5 py-3" id="promo-apply">Apply</button>
              </div>
              {promoApplied && <p className="text-silver-dark text-xs mb-4">Promo code applied ✓</p>}
              <Link href="/checkout" className="btn-gold w-full text-center block" id="proceed-checkout">Proceed to Checkout</Link>
              <Link href="/shop" className="block text-center text-warm-gray text-sm mt-4 hover:text-charcoal transition-colors">Continue Shopping</Link>
              {getShipping() > 0 && <p className="text-warm-gray/60 text-xs text-center mt-6">Free shipping on orders above ₹50,000</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
