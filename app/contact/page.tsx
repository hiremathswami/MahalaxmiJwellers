'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContactPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as any },
    },
  };

  const contactChannels = [
    {
      title: 'Email Support',
      description: 'Send us your inquiries, custom orders ideas, or product questions. Our support team typically replies within 24 hours.',
      value: 'support@mahalaxmijewellers.com',
      actionLabel: 'Send an Email',
      actionUrl: 'mailto:support@mahalaxmijewellers.com',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      title: 'WhatsApp Consultation',
      description: 'Connect directly with our showroom executives for instant help, gemstone checks, or order status queries.',
      value: '+91 63602 32451',
      actionLabel: 'Chat on WhatsApp',
      actionUrl: 'https://wa.me/916360232451',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
    },
    {
      title: 'Call Helpline',
      description: 'Speak directly with a jewellery consultant for custom sizing advice or urgent shipment tracking details.',
      value: '+91 63602 32451',
      actionLabel: 'Call Now',
      actionUrl: 'tel:+916360232451',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* Background Texture Overlay */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Breadcrumbs */}
        <nav className="mb-8" id="contact-breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-warm-gray hover:text-charcoal transition-colors">
                Home
              </Link>
            </li>
            <li className="text-silver">›</li>
            <li className="text-charcoal font-medium">Contact Us</li>
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
            Get In Touch
          </span>
          <h1 className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-charcoal font-bold leading-tight">
            Connect With Us
          </h1>
          <p className="text-warm-gray text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose your preferred way to connect. Our team is dedicated to offering prompt virtual assistance for all sterling silver jewellery inquiries.
          </p>
          <div className="w-16 h-[1px] bg-charcoal/20 mx-auto mt-6" />
        </motion.div>

        {/* Direct Contact Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        >
          {contactChannels.map((channel) => (
            <motion.div
              key={channel.title}
              variants={cardVariants}
              className="bg-champagne border border-gray-200 p-8 rounded-2xl flex flex-col justify-between shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-6">
                {/* Channel Icon */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-150 shadow-sm text-charcoal/70">
                  {channel.icon}
                </div>

                <div className="space-y-2">
                  <h3 className="font-cormorant text-2xl text-charcoal font-bold">
                    {channel.title}
                  </h3>
                  <p className="text-warm-gray text-xs sm:text-sm leading-relaxed min-h-[70px]">
                    {channel.description}
                  </p>
                </div>

                {/* Display Value */}
                <div className="pt-2">
                  <span className="text-sm font-medium text-charcoal font-mono">
                    {channel.value}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <a
                  href={channel.actionUrl}
                  target={channel.actionUrl.startsWith('http') ? '_blank' : undefined}
                  rel={channel.actionUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="btn-gold w-full text-center block py-2.5 text-[11px] font-semibold tracking-wider"
                >
                  {channel.actionLabel}
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand Guarantee Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-charcoal text-white rounded-3xl p-10 sm:p-12 text-center space-y-6 mt-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
          <h3 className="font-cormorant text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide">
            Need Private Consultation?
          </h3>
          <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Email or WhatsApp our representatives to request catalog updates, customized pricing matrices, or high-definition pictures of stock products.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
