'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#F8F7F5] border-t border-gray-200" id="site-footer">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div>
            <h4 className="font-cormorant text-xl text-charcoal mb-6">About MJ</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Our Story</Link></li>
              <li><Link href="/shop" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Shop Collection</Link></li>
              <li><Link href="/about#craftsmanship" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Craftsmanship</Link></li>
              <li><Link href="/contact" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-cormorant text-xl text-charcoal mb-6">Client Services</h4>
            <ul className="space-y-3">
              <li><Link href="/shipping" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Returns & Exchanges</Link></li>
              <li><Link href="/size-guide" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Ring Size Guide</Link></li>
              <li><Link href="/care-repair" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Care & Repair</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-cormorant text-xl text-charcoal mb-6">Connect</h4>
            <ul className="space-y-3">
              <li><Link href="https://www.instagram.com/themahalaxmijewellery/" target="_blank" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Instagram</Link></li>
              <li><Link href="https://facebook.com" target="_blank" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Facebook</Link></li>
              <li><Link href="https://wa.me/916360232451" target="_blank" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">WhatsApp</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-cormorant text-xl text-charcoal mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Terms of Service</Link></li>
              <li><Link href="/hallmark" className="text-warm-gray text-sm hover:text-charcoal transition-colors duration-300">Hallmark Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-cormorant text-xl text-charcoal mb-6">Newsletter</h4>
            <p className="text-warm-gray text-sm mb-4 leading-relaxed">
              Be the first to know about new collections, exclusive events, and bespoke offerings.
            </p>
            {subscribed ? (
              <p className="text-silver-dark text-sm">Thank you for subscribing ✓</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="input-light text-sm"
                  required
                  id="newsletter-email"
                />
                <button type="submit" className="w-full py-3 bg-charcoal text-white text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-silver-dark transition-all" id="newsletter-submit">
                  Sign Up
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-12" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {['VISA', 'MC', 'UPI'].map((name) => (
              <div key={name} className="w-10 h-7 border border-gray-200 flex items-center justify-center rounded-sm">
                <span className="text-warm-gray text-[9px] font-bold">{name}</span>
              </div>
            ))}
          </div>

          <Link
            href="https://www.instagram.com/themahalaxmijewellery/"
            className="text-warm-gray text-xs uppercase tracking-[0.15em] hover:text-charcoal transition-colors font-semibold"
            target="_blank"
          >
            @themahalaxmijewellery
          </Link>

          <p className="text-warm-gray/60 text-xs">
            © 2025 Mahalaxmi Jewellers. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
