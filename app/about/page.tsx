'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as any },
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
        <nav className="mb-8" id="about-breadcrumb">
          <ol className="flex items-center gap-2 text-xs">
            <li>
              <Link href="/" className="text-warm-gray hover:text-charcoal transition-colors">
                Home
              </Link>
            </li>
            <li className="text-silver">›</li>
            <li className="text-charcoal font-medium">About Us</li>
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
            Our Story & Heritage
          </span>
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-charcoal font-bold leading-tight">
            Mahalaxmi Jewellers
          </h1>
          <p className="text-warm-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Curating premium 925 sterling silver jewellery that connects exquisite designs with modern luxury.
          </p>
          <div className="w-16 h-[1px] bg-charcoal/20 mx-auto mt-6" />
        </motion.div>

        {/* Brand Narrative Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-28"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="font-cormorant text-3xl sm:text-4xl text-charcoal font-semibold">
              The Art of Curating Fine Silver
            </h2>
            <p className="text-warm-gray text-sm sm:text-base leading-relaxed">
              At Mahalaxmi Jewellers, we believe that jewellery is not merely an accessory; it is a canvas of memories, self-expression, and refined elegance. Each piece of our 925 sterling silver collection is carefully handpicked from top global designers and manufacturers who have mastered their craft over generations.
            </p>
            <p className="text-warm-gray text-sm sm:text-base leading-relaxed">
              From our strict quality inspections to choosing intricate stone settings and final micro-polishing, our collections represent an absolute devotion to curation. We ensure that our selected silver features the highest quality plating (including platinum, rhodium, and oxidized finishes) to maintain everlasting luster.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            {/* Visual Glassmorphic Frame */}
            <div className="absolute -inset-4 bg-black border border-gray-800/30 -z-10 rounded-2xl scale-[1.02] shadow-lg" />
            <div className="aspect-[4/3] w-full bg-black rounded-xl overflow-hidden border border-gray-800/20 shadow-xl relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand-logo.jpeg"
                alt="Mahalaxmi Jewellers — Bespoke Workshop"
                className="w-3/5 h-auto object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Pillars / Core Commitments */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12 mb-28"
        >
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-cormorant text-3xl text-charcoal font-semibold">Our Three Pillars</h3>
            <p className="text-warm-gray text-xs sm:text-sm">
              The promises that define every creation bearing the MJ signature.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={itemVariants}
              className="border border-gray-200 bg-champagne p-8 rounded-2xl text-center space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto border border-gray-100 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h4 className="font-cormorant text-xl text-charcoal font-bold">925 Purity Guarantee</h4>
              <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
                All jewellery is certified 925 sterling silver, ensuring hypoallergenic wear and structural integrity designed to last lifetimes.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="border border-gray-200 bg-champagne p-8 rounded-2xl text-center space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto border border-gray-100 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="font-cormorant text-xl text-charcoal font-bold">Curated Design Excellence</h4>
              <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
                We select premium, globally sourced designs, offering you modern aesthetics, secure fittings, and timeless collection variety.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="border border-gray-200 bg-champagne p-8 rounded-2xl text-center space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto border border-gray-100 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h4 className="font-cormorant text-xl text-charcoal font-bold">Modern Luxury Collections</h4>
              <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
                We bring together the finest trends. From minimal daily wear to premium party statements, we curate style profiles that shine.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-charcoal text-white rounded-3xl p-12 text-center space-y-6 relative overflow-hidden"
        >
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
          
          <h3 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide">
            Explore Curated Brilliance
          </h3>
          <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
            Find the perfect sterling silver rings, necklaces, or bracelets to complete your accessory catalog.
          </p>
          <div className="pt-4">
            <Link href="/shop" className="btn-white inline-block px-8 py-3.5 text-xs tracking-wider">
              Browse Collections
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
