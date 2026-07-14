'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ShippingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

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
            <li className="text-charcoal font-medium">Shipping & Delivery</li>
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
            Secure Transit
          </span>
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-charcoal font-bold leading-tight">
            Shipping & Delivery
          </h1>
          <p className="text-warm-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every piece is shipped in fully-insured tamper-proof packaging to guarantee it arrives at your doorstep in pristine condition.
          </p>
          <div className="w-16 h-[1px] bg-charcoal/20 mx-auto mt-6" />
        </motion.div>

        {/* Policies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="border border-gray-200 bg-champagne p-8 rounded-2xl space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-all"
          >
            <h3 className="font-cormorant text-2xl text-charcoal font-bold">1. Shipping Cost</h3>
            <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
              We offer complimentary insured domestic shipping across India on all orders. There are no minimum purchase requirements or hidden logistics charges.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="border border-gray-200 bg-champagne p-8 rounded-2xl space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-all"
          >
            <h3 className="font-cormorant text-2xl text-charcoal font-bold">2. Dispatch Timeline</h3>
            <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
              In-stock items are packaged and dispatched within 24 to 48 hours. Custom orders, sizing modifications, or made-to-order pieces require 7 to 10 business days of crafting time prior to dispatch.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="border border-gray-200 bg-champagne p-8 rounded-2xl space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-all"
          >
            <h3 className="font-cormorant text-2xl text-charcoal font-bold">3. Courier & Safety</h3>
            <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
              We partner exclusively with premium secure networks like BlueDart and Sequel Logistics. Every delivery is tracked in real-time, fully insured, and requires a direct OTP verification at delivery.
            </p>
          </motion.div>
        </motion.div>

        {/* Timeline Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-champagne border border-gray-200 rounded-3xl p-8 sm:p-12 mb-20"
        >
          <h2 className="font-cormorant text-2xl sm:text-3xl text-charcoal font-semibold mb-8">
            Delivery Estimates By Region
          </h2>
          <div className="divide-y divide-gray-200 text-xs sm:text-sm text-charcoal">
            <div className="py-4 flex justify-between">
              <span className="font-medium">Metros & Tier 1 Cities</span>
              <span className="text-warm-gray">2 - 4 Business Days</span>
            </div>
            <div className="py-4 flex justify-between">
              <span className="font-medium">Tier 2 & Tier 3 Cities</span>
              <span className="text-warm-gray">4 - 6 Business Days</span>
            </div>
            <div className="py-4 flex justify-between">
              <span className="font-medium">Northeast & J&K Regions</span>
              <span className="text-warm-gray">5 - 8 Business Days</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
