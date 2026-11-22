'use client';

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Mail,
  Heart,
  Gift,
  Share2,
  Users,
  MessageSquare,
  CreditCard,
  Link2,
  QrCode
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui';
import { Modal } from '../ui';
import { RSVPForm } from './RSVPForm';
import { BlessingsForm } from './BlessingsForm';
import { ContributionForm } from './ContributionForm';
import { ShareModal } from './ShareModal';

interface ActionButton {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  borderColor: string;
  hoverBg: string;
  onClick: () => void;
}

interface ActionButtonsProps {
  onRsvpClick: () => void;
  onBlessingsClick: () => void;
  onContributionClick: () => void;
  onShareClick: () => void;
}

export function ActionButtons({
  onRsvpClick,
  onBlessingsClick,
  onContributionClick,
  onShareClick,
}: ActionButtonsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const buttons: ActionButton[] = [
    {
      id: 'rsvp',
      icon: <Users className="w-7 h-7" />,
      title: 'RSVP',
      subtitle: 'Confirm Attendance',
      gradient: 'from-primary-gold to-primary-gold-dark',
      borderColor: 'border-primary-gold/20',
      hoverBg: 'hover:from-primary-gold-dark hover:to-primary-gold',
      onClick: onRsvpClick,
    },
    {
      id: 'blessings',
      icon: <Heart className="w-7 h-7" />,
      title: 'Send Blessings',
      subtitle: 'via Envelope',
      gradient: 'from-primary-cream to-primary-blush',
      borderColor: 'border-border-gold/50',
      hoverBg: 'hover:bg-primary-blush/50',
      onClick: onBlessingsClick,
    },
    {
      id: 'contribution',
      icon: <Gift className="w-7 h-7" />,
      title: 'Contribute',
      subtitle: 'via UPI/Card',
      gradient: 'from-primary-cream to-primary-blush',
      borderColor: 'border-border-gold/50',
      hoverBg: 'hover:bg-primary-blush/50',
      onClick: onContributionClick,
    },
    {
      id: 'share',
      icon: <Share2 className="w-7 h-7" />,
      title: 'Share Invite',
      subtitle: '',
      gradient: 'from-primary-cream to-primary-blush',
      borderColor: 'border-border-gold/50',
      hoverBg: 'hover:bg-primary-blush/50',
      onClick: onShareClick,
    },
  ];

  return (
    <section
      id="actions"
      ref={ref}
      className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      aria-labelledby="actions-title"
    >
      {/* Background decorative element */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary-blush/30 via-transparent to-primary-cream/30"
        aria-hidden="true"
      />
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Cpath d=\'M100 20 C60 20 30 50 30 90 C30 130 60 160 100 160 C140 160 170 130 170 90 C170 50 140 20 100 20 Z M100 10 C55 10 20 45 20 90 C20 135 55 170 100 170 C145 170 180 135 180 90 C180 45 145 10 100 10 Z\' fill=\'none\' stroke=\'%23B77A38\' stroke-width=\'0.5\'/%3E%3C/svg%3E")',
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
        }} className="absolute inset-0" />
      </div>

      <motion.div
        className="relative mx-auto max-w-6xl z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 id="actions-title" className="font-serif font-medium text-section-title text-text-primary mb-3">
            Let&apos;s Stay Connected
          </h2>
          <p className="font-sans text-section-subtitle text-text-secondary max-w-2xl mx-auto">
            RSVP, Send a Blessing or Make a Contribution
          </p>
          <div className="gold-divider mt-6" aria-hidden="true" />
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {buttons.map((button, index) => (
            <motion.button
              key={button.id}
              onClick={button.onClick}
              className={cn(
                'relative group p-6 lg:p-8 rounded-2xl border-2 transition-all duration-500 ease-out',
                'flex flex-col items-center text-center',
                button.gradient.replace('from-', 'bg-gradient-to-br from-').replace('to-', ' to-'),
                button.borderColor,
                button.hoverBg,
                button.id === 'rsvp'
                  ? 'text-text-white shadow-[0_8px_32px_rgba(183,122,56,0.3)] hover:shadow-[0_12px_40px_rgba(183,122,56,0.4)]'
                  : 'text-text-primary shadow-card hover:shadow-card-hover',
                'focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-offset-2 focus:ring-offset-primary-background'
              )}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1), ease: 'easeOut' }}
              aria-label={`${button.title}: ${button.subtitle}`}
            >
              {/* Decorative shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl animate-shimmer" aria-hidden="true" />

              <div className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300',
                  button.id === 'rsvp'
                    ? 'bg-text-white/20 group-hover:bg-text-white/30'
                    : 'bg-surface-cream/80 group-hover:bg-surface-cream'
                )}>
                  {button.icon}
                </div>
                <h3 className="font-serif font-medium text-xl lg:text-2xl mb-1">
                  {button.title}
                </h3>
                {button.subtitle && (
                  <p className="font-sans text-body-sm opacity-80">
                    {button.subtitle}
                  </p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}