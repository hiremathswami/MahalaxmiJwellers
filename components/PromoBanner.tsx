'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoEvent {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
}

export default function PromoBanner() {
  const [events, setEvents] = useState<PromoEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.events) {
          setEvents(data.events);
        }
      })
      .catch((err) => console.warn('Could not fetch promo events:', err))
      .finally(() => setLoading(false));
  }, []);

  // Autoplay slider
  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [events]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  if (loading || events.length === 0) return null;

  const currentEvent = events[currentIndex];

  return (
    <div className="w-full py-8">
      <div className="relative w-full aspect-[21/9] md:aspect-[3/1] max-h-[360px] rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-gray-150/80 bg-champagne">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEvent.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Banner Background Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={currentEvent.image_url} 
              alt={currentEvent.title} 
              className="w-full h-full object-cover select-none" 
            />
            {/* Dark glassmorphic overlay for copy legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[1]" />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-[1]" />

            {/* Content Container */}
            <div className="absolute inset-y-0 left-0 w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center items-start text-left z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-bold text-white uppercase tracking-widest">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Special Event</span>
              </div>

              <h2 className="font-cormorant text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-md">
                {currentEvent.title}
              </h2>

              {currentEvent.description && (
                <p className="text-white/80 text-xs sm:text-sm max-w-md leading-relaxed line-clamp-2 font-light">
                  {currentEvent.description}
                </p>
              )}

              {currentEvent.link_url && (
                <Link 
                  href={currentEvent.link_url}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-charcoal rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span>Explore Offer</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Slide Indicators */}
        {events.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
              aria-label="Previous Offer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
              aria-label="Next Offer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-4 right-8 z-20 flex gap-2">
              {events.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
