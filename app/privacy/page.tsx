'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
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
            <li className="text-charcoal font-medium">Privacy Policy</li>
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
            Confidentiality
          </span>
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-charcoal font-bold leading-tight">
            Privacy Policy
          </h1>
          <p className="text-warm-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Your trust is our most valued asset. Learn about the measures we take to protect your personal details and secure your shopping experience.
          </p>
          <div className="w-16 h-[1px] bg-charcoal/20 mx-auto mt-6" />
        </motion.div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto space-y-12 text-sm sm:text-base text-warm-gray leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-cormorant text-2xl sm:text-3xl text-charcoal font-semibold">
              Information We Collect
            </h2>
            <p>
              We gather information necessary to complete your purchase and delivery of jewellery items, including your name, shipping address, billing details, phone number, email address, and payment preferences.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-cormorant text-2xl sm:text-3xl text-charcoal font-semibold">
              How We Protect Your Transactions
            </h2>
            <p>
              Mahalaxmi Jewellers utilizes 256-bit SSL encryption to handle checkout processing. We do not store or witness raw credit card numbers or banking passwords. Transactions are processed through verified gateways.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-cormorant text-2xl sm:text-3xl text-charcoal font-semibold">
              No Data Sharing
            </h2>
            <p>
              We respect your inbox and confidentiality. Your personal information is never sold, traded, or shared with third-party advertising companies. Data is shared exclusively with shipping partners to execute deliveries.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
