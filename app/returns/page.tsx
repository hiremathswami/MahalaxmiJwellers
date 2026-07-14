'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ReturnsPage() {
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

  const steps = [
    {
      num: '01',
      title: 'Initiate Request',
      desc: 'Send an email to support@mahalaxmijewellers.com or message us on WhatsApp with your Order ID and photos of the item within 15 days of delivery.',
    },
    {
      num: '02',
      title: 'Reverse Pickup',
      desc: 'We will arrange a complimentary, fully-insured reverse pickup from your address. Ensure the jewellery is packed securely in its original packaging.',
    },
    {
      num: '03',
      title: 'Quality Verification',
      desc: 'Upon receiving the item, our quality assurance team inspects the piece to verify the 925 purity hallmark and ensure the gemstones are intact and unworn.',
    },
    {
      num: '04',
      title: 'Instant Resolution',
      desc: 'Once approved, we will process your exchange or initiate a full refund to your original payment method within 3 to 5 business days.',
    },
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
            <li className="text-charcoal font-medium">Returns & Exchanges</li>
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
            Hassle-Free Policy
          </span>
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-charcoal font-bold leading-tight">
            Returns & Exchanges
          </h1>
          <p className="text-warm-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every purchase is backed by our 15-day return and exchange policy. Your satisfaction and trust in our craftsmanship are our highest priorities.
          </p>
          <div className="w-16 h-[1px] bg-charcoal/20 mx-auto mt-6" />
        </motion.div>

        {/* Step-by-Step Procedure */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-24"
        >
          <h2 className="font-cormorant text-3xl sm:text-4xl text-charcoal font-semibold text-center mb-16">
            The Return Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="border border-gray-200 bg-champagne p-8 rounded-2xl relative space-y-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow"
              >
                <div className="absolute top-4 right-6 font-cormorant text-4xl text-charcoal/10 font-bold select-none">
                  {step.num}
                </div>
                <h3 className="font-cormorant text-xl text-charcoal font-bold pt-2">
                  {step.title}
                </h3>
                <p className="text-warm-gray text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-champagne border border-gray-200 rounded-3xl p-8 sm:p-12 mb-20 space-y-8"
        >
          <h2 className="font-cormorant text-2xl sm:text-3xl text-charcoal font-semibold">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-2">
              <h4 className="font-bold text-charcoal">Are personalized/custom jewellery eligible?</h4>
              <p className="text-warm-gray leading-relaxed">
                Bespoke items, custom sizes, and custom-engraved pieces are prepared exclusively to your requirements and are not eligible for standard returns unless there is a structural defect.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-charcoal">What if I receive a damaged item?</h4>
              <p className="text-warm-gray leading-relaxed">
                If an item arrives damaged or incorrect, please alert us immediately within 48 hours of delivery. We will prioritize an expedited replacement at no additional cost.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-charcoal">Can I exchange for a different size?</h4>
              <p className="text-warm-gray leading-relaxed">
                Yes! We facilitate free size exchanges within the 15-day window, provided the requested size is in stock. If it is made-to-order, additional crafting time may apply.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-charcoal">Are there any restocking fees?</h4>
              <p className="text-warm-gray leading-relaxed">
                We believe in complete transparency. There are zero restocking fees, reverse shipping charges, or hidden deductions for standard eligible returns.
              </p>
            </div>
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
          
          <h3 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide">
            Need Help With a Return?
          </h3>
          <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
            Our support representatives are standing by to guide you through your return or exchange process.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link href="/contact" className="btn-white inline-block px-8 py-3.5 text-xs tracking-wider">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
