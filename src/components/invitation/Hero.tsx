'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn, scrollToSection } from '../../lib/utils';

interface HeroProps {
  coupleName1: string;
  coupleName2: string;
  heroImage: string;
  heroImagePosition?: 'left' | 'center' | 'right';
  onScrollToDetails: () => void;
}

export function Hero({
  coupleName1,
  coupleName2,
  heroImage,
  heroImagePosition = 'right',
  onScrollToDetails,
}: HeroProps) {
  const { scrollY } = useScroll();
// scrollY is a MotionValue<number>, useTransform accepts it directly
const yTransform = useTransform(scrollY, [0, 500] as const, [0, 150] as const);
const opacityTransform = useTransform(scrollY, [0, 300] as const, [1, 0] as const);
const scaleTransform = useTransform(scrollY, [0, 500] as const, [1, 1.05] as const);

  const positionClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ transform: scaleTransform }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg,
                rgba(52, 27, 22, 0.6) 0%,
                rgba(52, 27, 22, 0.3) 40%,
                rgba(52, 27, 22, 0.1) 60%,
                transparent 100%
              ),
              linear-gradient(
                to ${heroImagePosition === 'left' ? 'left' : heroImagePosition === 'center' ? 'top' : 'right'},
                rgba(52, 27, 22, 0.5) 0%,
                transparent 50%
              )
            `,
          }}
          aria-hidden="true"
        />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 -200px 200px -100px rgba(52, 27, 22, 0.8), inset 0 0 200px rgba(52, 27, 22, 0.3)',
          }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-24 h-24 opacity-10" style={{ transform: yTransform.toString() }}>
          <div className="floral-corner floral-corner-tl" />
        </div>
        <div className="absolute top-20 right-10 w-24 h-24 opacity-10" style={{ transform: yTransform.toString() }}>
          <div className="floral-corner floral-corner-tr" />
        </div>
        <div className="absolute bottom-20 left-10 w-24 h-24 opacity-10" style={{ transform: yTransform.toString() }}>
          <div className="floral-corner floral-corner-bl" />
        </div>
        <div className="absolute bottom-20 right-10 w-24 h-24 opacity-10" style={{ transform: yTransform.toString() }}>
          <div className="floral-corner floral-corner-br" />
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          'relative z-20 w-full px-4 sm:px-6 lg:px-8 py-20 lg:py-32',
          positionClasses[heroImagePosition]
        )}
        style={{ opacity: opacityTransform as any as number, transform: `translateY(${yTransform}px)` }}
      >
        <div className="max-w-3xl">
          {/* Opening line */}
          <motion.p
            className="font-serif italic text-body-lg text-text-white/90 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            Together with our families,
          </motion.p>

          <motion.p
            className="font-serif italic text-body-lg text-text-white/90 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            we cordially invite you to the
          </motion.p>

          {/* Wedding Ceremony */}
          <motion.h1
            id="hero-title"
            className="font-serif font-medium text-hero-title text-text-white tracking-tight mb-6 gradient-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            WEDDING CEREMONY
          </motion.h1>

          {/* Couple Names */}
          <motion.p
            className="font-script text-hero-subtitle text-text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            {coupleName1} & {coupleName2}
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="font-serif italic text-body-lg text-text-white/80 max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            Two hearts. One journey. A lifetime of love.
          </motion.p>

          {/* Decorative Divider */}
          <motion.div
            className="gold-divider my-10"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            aria-hidden="true"
          />

          {/* View Invitation Button */}
          <motion.button
            onClick={onScrollToDetails}
            className="btn-primary lg:xl group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="View invitation details"
          >
            View Invitation
            <motion.div
              className="relative overflow-hidden"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-white/60"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1],
          y: [0, 10, 0],
          transition: { duration: 1, delay: 1.2, ease: 'easeOut' }
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <span className="text-caption tracking-widest uppercase">Scroll to explore</span>
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </motion.div>
    </section>
  );
}