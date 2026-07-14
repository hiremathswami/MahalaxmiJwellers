'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CareRepairPage() {
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
            <li className="text-charcoal font-medium">Care & Repair</li>
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
            Preserve Your Sparkle
          </span>
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-charcoal font-bold leading-tight">
            Care & Repair
          </h1>
          <p className="text-warm-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Silver is a precious metal that matures beautifully with care. Read our maintenance guide to protect your jewellery's radiance.
          </p>
          <div className="w-16 h-[1px] bg-charcoal/20 mx-auto mt-6" />
        </motion.div>

        {/* Care Tips Grid */}
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
            <h3 className="font-cormorant text-2xl text-charcoal font-bold">1. Daily Wear & Storage</h3>
            <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
              Store your jewellery flat in the provided anti-tarnish velvet boxes. Avoid exposure to perfumes, hair sprays, lotions, and chlorinated pool water, as chemicals accelerate oxidization.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="border border-gray-200 bg-champagne p-8 rounded-2xl space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-all"
          >
            <h3 className="font-cormorant text-2xl text-charcoal font-bold">2. Cleaning Guide</h3>
            <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
              Clean regularly with warm soapy water and a soft-bristled baby toothbrush. Dry immediately with a lint-free micro-fiber polishing cloth. Avoid ultrasonic cleaners for emeralds or organic gems.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="border border-gray-200 bg-champagne p-8 rounded-2xl space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-all"
          >
            <h3 className="font-cormorant text-2xl text-charcoal font-bold">3. Re-Plating & Repair</h3>
            <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
              Rhodium and platinum plating naturally wears off over time. We offer complimentary inspection and professional re-polishing and re-plating services to bring back the original high-gloss finish.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
