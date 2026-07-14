'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20 overflow-hidden">
      {/* Background Texture Overlay */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-xs">
            <li>
              <Link href="/" className="text-warm-gray hover:text-charcoal transition-colors">
                Home
              </Link>
            </li>
            <li className="text-silver">›</li>
            <li className="text-charcoal font-medium">Terms of Service</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-silver-dark font-semibold">
            Store Rules
          </span>
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-charcoal font-bold leading-tight">
            Terms of Service
          </h1>
          <p className="text-warm-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Welcome to Mahalaxmi Jewellers. Please review the rules, terms, and guidelines governing our online portal, customized orders, and checkouts.
          </p>
          <div className="w-16 h-[1px] bg-charcoal/20 mx-auto mt-6" />
        </motion.div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto space-y-12 text-sm sm:text-base text-warm-gray leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-cormorant text-2xl sm:text-3xl text-charcoal font-semibold">
              1. Purity Guarantee
            </h2>
            <p>
              Every silver product displayed is guaranteed to meet the 92.5% sterling silver standard. Diamond elements are certified by official, accredited testing agencies like the IGI or GIA.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-cormorant text-2xl sm:text-3xl text-charcoal font-semibold">
              2. Custom Design Terms
            </h2>
            <p>
              By commissioning a customized design or engraving, you agree that designs belong to Mahalaxmi Jewellers. Bespoke orders require upfront deposits, are final sale, and are non-refundable once crafting commences.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-cormorant text-2xl sm:text-3xl text-charcoal font-semibold">
              3. Pricing & Taxes
            </h2>
            <p>
              All prices shown on our store are inclusive of all taxes. In the event of a listing error or incorrect pricing, we reserve the right to cancel affected orders and issue full refunds.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
