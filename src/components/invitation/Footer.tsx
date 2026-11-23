'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Music, Sparkles, Calendar, MapPin, Mail, Phone, MessageCircle, Copyright, Leaf, Globe, Send } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FooterProps {
  coupleNames: string;
  eventTitle?: string;
  eventDate?: string;
  venueName?: string;
  venueAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    whatsapp?: string;
  };
  rsvpDeadline?: string;
  footerText?: string;
  footerDateLocation?: string;
}

export function Footer({
  coupleNames,
  eventTitle = 'Wedding Celebration',
  eventDate,
  venueName,
  venueAddress,
  contactEmail,
  contactPhone,
  socialLinks = {},
  rsvpDeadline,
}: FooterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      ref={ref}
      className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-20 bg-primary-background"
      aria-labelledby="footer-title"
    >
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-gold/50 to-transparent" aria-hidden="true" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-gold to-transparent" aria-hidden="true" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-3" aria-hidden="true">
        <div style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath d=\'M50 10 C30 10 15 25 15 45 C15 65 30 80 50 80 C70 80 85 65 85 45 C85 25 70 10 50 10 Z M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C75 95 95 75 95 50 C95 25 75 5 50 5 Z\' fill=\'none\' stroke=\'%23B77A38\' stroke-width=\'0.3\'/%3E%3C/svg%3E")',
          backgroundSize: '100px',
          backgroundRepeat: 'repeat',
        }} className="absolute inset-0" />
      </div>

      {/* Floating floral corners */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-8 left-8 w-16 h-16 opacity-10">
          <div className="floral-corner floral-corner-tl" />
        </div>
        <div className="absolute top-8 right-8 w-16 h-16 opacity-10">
          <div className="floral-corner floral-corner-tr" />
        </div>
        <div className="absolute bottom-8 left-8 w-16 h-16 opacity-10">
          <div className="floral-corner floral-corner-bl" />
        </div>
        <div className="absolute bottom-8 right-8 w-16 h-16 opacity-10">
          <div className="floral-corner floral-corner-br" />
        </div>
      </div>

      <motion.div
        className="relative mx-auto max-w-6xl z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Couple Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-blush to-primary-cream border border-border-gold/50">
                <Heart className="w-6 h-6 text-primary-gold" />
              </div>
              <div>
                <p className="font-script text-xl text-text-primary">{coupleNames}</p>
                <p className="text-caption text-text-muted uppercase tracking-wider">{eventTitle}</p>
              </div>
            </div>

            <div className="space-y-3 text-text-secondary text-body-sm">
              {eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-gold flex-shrink-0" />
                  <span>{eventDate}</span>
                </div>
              )}
              {venueName && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary-gold flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{venueName}{venueAddress ? `, ${venueAddress}` : ''}</span>
                </div>
              )}
              {rsvpDeadline && (
                <div className="flex items-center gap-2 text-primary-gold font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>RSVP by {rsvpDeadline}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-medium text-text-primary mb-4">Contact Us</h4>
            <div className="space-y-3 text-text-secondary text-body-sm">
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-2 hover:text-primary-gold transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary-gold flex-shrink-0" />
                  <span>{contactEmail}</span>
                </a>
              )}
              {contactPhone && (
                <a
                  href={`tel:${contactPhone}`}
                  className="flex items-center gap-2 hover:text-primary-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary-gold flex-shrink-0" />
                  <span>{contactPhone}</span>
                </a>
              )}
              {!contactEmail && !contactPhone && (
                <p className="text-text-muted">Contact details to be added</p>
              )}
            </div>
          </motion.div>

          {/* Quick Links / Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-medium text-text-primary mb-4">Quick Links</h4>
            <nav className="space-y-2" aria-label="Footer navigation">
              <a
                href="#hero"
                className="flex items-center gap-2 text-text-secondary text-body-sm hover:text-primary-gold transition-colors"
              >
                <Leaf className="w-4 h-4 text-primary-gold" />
                <span>Our Story</span>
              </a>
              <a
                href="#event-details"
                className="flex items-center gap-2 text-text-secondary text-body-sm hover:text-primary-gold transition-colors"
              >
                <Calendar className="w-4 h-4 text-primary-gold" />
                <span>Event Details</span>
              </a>
              <a
                href="#gallery"
                className="flex items-center gap-2 text-text-secondary text-body-sm hover:text-primary-gold transition-colors"
              >
                <Sparkles className="w-4 h-4 text-primary-gold" />
                <span>Photo Gallery</span>
              </a>
              <a
                href="#actions"
                className="flex items-center gap-2 text-text-secondary text-body-sm hover:text-primary-gold transition-colors"
              >
                <Heart className="w-4 h-4 text-primary-gold" />
                <span>RSVP & Blessings</span>
              </a>
            </nav>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-medium text-text-primary mb-4">Follow Our Journey</h4>
            <div className="flex gap-3 mb-6">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'p-3 rounded-xl bg-primary-cream/50 border border-border-gold/50',
                    'text-text-secondary hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50',
                    'transition-all duration-300'
                  )}
                  aria-label="Follow us on Instagram"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'p-3 rounded-xl bg-primary-cream/50 border border-border-gold/50',
                    'text-text-secondary hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50',
                    'transition-all duration-300'
                  )}
                  aria-label="Follow us on Facebook"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'p-3 rounded-xl bg-primary-cream/50 border border-border-gold/50',
                    'text-text-secondary hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50',
                    'transition-all duration-300'
                  )}
                  aria-label="Follow us on Twitter"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {socialLinks.whatsapp && (
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'p-3 rounded-xl bg-primary-cream/50 border border-border-gold/50',
                    'text-text-secondary hover:text-green-600 hover:border-green-300 hover:bg-green-50',
                    'transition-all duration-300'
                  )}
                  aria-label="Contact us on WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {!socialLinks.instagram && !socialLinks.facebook && !socialLinks.twitter && !socialLinks.whatsapp && (
                <div className="flex gap-3">
                  <button className="p-3 rounded-xl bg-primary-cream/50 border border-border-gold/50 text-text-muted cursor-not-allowed" disabled>
                    <Globe className="w-5 h-5" />
                  </button>
                  <button className="p-3 rounded-xl bg-primary-cream/50 border border-border-gold/50 text-text-muted cursor-not-allowed" disabled>
                    <Globe className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Share invitation prompt */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary-blush/30 to-primary-cream/30 border border-border-gold/30">
              <p className="text-body-sm text-text-secondary text-center">
                <Sparkles className="w-4 h-4 inline-block mr-1 text-primary-gold" />
                Share this invitation with loved ones
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="gold-divider mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          aria-hidden="true"
        />

        {/* Bottom Bar */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Copyright */}
          <div className="flex items-center gap-2 text-text-muted text-body-sm">
            <Copyright className="w-4 h-4" />
            <span>{currentYear} {coupleNames}. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Made with love for our special day</span>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-2 text-text-muted text-body-sm">
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Created with InviteAura</span>
          </div>

          {/* Music toggle placeholder */}
          <div className="flex items-center gap-2 text-text-muted text-body-sm">
            <button
              className="flex items-center gap-1 p-2 rounded-lg hover:bg-primary-gold/10 transition-colors"
              aria-label="Toggle background music"
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Music</span>
            </button>
          </div>
        </motion.div>

        {/* Decorative hearts */}
        <motion.div
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          aria-hidden="true"
        >
          <Heart className="w-5 h-5 text-primary-gold/30 animate-pulse" style={{ animationDelay: '0ms' }} />
          <Heart className="w-5 h-5 text-primary-gold/30 animate-pulse" style={{ animationDelay: '200ms' }} />
          <Heart className="w-5 h-5 text-primary-gold/30 animate-pulse" style={{ animationDelay: '400ms' }} />
        </motion.div>
      </motion.div>
    </footer>
  );
}