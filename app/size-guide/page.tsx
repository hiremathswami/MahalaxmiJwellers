'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SizeGuidePage() {
  const sizes = [
    { us: 5, mm: 15.7, circumference: 49.3 },
    { us: 6, mm: 16.5, circumference: 51.8 },
    { us: 7, mm: 17.3, circumference: 54.4 },
    { us: 8, mm: 18.2, circumference: 56.9 },
    { us: 9, mm: 18.9, circumference: 59.5 },
    { us: 10, mm: 19.8, circumference: 62.1 },
    { us: 11, mm: 20.6, circumference: 64.6 },
    { us: 12, mm: 21.3, circumference: 67.2 },
  ];

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
            <li className="text-charcoal font-medium">Ring Size Guide</li>
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
            Perfect Fit Guide
          </span>
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-charcoal font-bold leading-tight">
            Ring Size Guide
          </h1>
          <p className="text-warm-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Ensure your ring fits beautifully. Use our size measurement guide and chart below to find your perfect fit.
          </p>
          <div className="w-16 h-[1px] bg-charcoal/20 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          {/* Method section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="font-cormorant text-3xl text-charcoal font-semibold">
              How to Measure at Home
            </h2>
            
            <div className="space-y-6 text-sm text-warm-gray">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h4 className="font-bold text-charcoal mb-1">Wrap a String or Paper</h4>
                  <p className="leading-relaxed">Wrap a piece of non-stretching string or a strip of paper around the base of your finger. Ensure it is snug but comfortable.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h4 className="font-bold text-charcoal mb-1">Mark the Intersection</h4>
                  <p className="leading-relaxed">Use a pen to mark the exact point where the string or paper overlaps and meets to form a complete circle.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h4 className="font-bold text-charcoal mb-1">Measure the Length</h4>
                  <p className="leading-relaxed">Lay the string or paper flat on a ruler and measure the length in millimeters (mm). This represents the inner circumference.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Size Chart table */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-champagne border border-gray-200 rounded-3xl p-8"
          >
            <h3 className="font-cormorant text-2xl text-charcoal font-semibold mb-6 text-center">
              Size Conversion Chart
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-charcoal">
                <thead>
                  <tr className="border-b border-gray-300 font-bold text-warm-gray uppercase tracking-wider">
                    <th className="pb-3">US Size</th>
                    <th className="pb-3">Inner Diameter (mm)</th>
                    <th className="pb-3">Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sizes.map((s) => (
                    <tr key={s.us}>
                      <td className="py-2.5 font-bold">Size {s.us}</td>
                      <td className="py-2.5 text-warm-gray">{s.mm} mm</td>
                      <td className="py-2.5 text-warm-gray">{s.circumference} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
