'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '@/components/invitation/Hero';
import { Navigation } from '@/components/invitation/Navigation';
import { EventDetails } from '@/components/invitation/EventDetails';
import { Gallery } from '@/components/invitation/Gallery';
import { RSVPForm } from '@/components/invitation/RSVPForm';
import { BlessingsForm } from '@/components/invitation/BlessingsForm';
import { ContributionForm } from '@/components/invitation/ContributionForm';
import { Footer } from '@/components/invitation/Footer';
import { ShareModal } from '@/components/invitation/ShareModal';

interface EventData {
  event: {
    id: string;
    slug: string;
    hostId: string;
    title: string;
    description: string;
    coupleName1: string;
    coupleName2: string;
    eventType: string;
    date: string;
    time: string;
    timezone: string;
    venueName: string;
    venueAddress: string;
    venueCoordinates: { lat: number; lng: number } | null;
    googleMapsUrl: string | null;
    importantInfo: string;
    rsvpDeadline: string;
    maxGuestsPerRsvp: number;
    heroImage: string;
    coverImage: string | null;
    heroImagePosition: 'left' | 'center' | 'right';
    theme: Record<string, unknown>;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
  };
  functions: Array<{
    id: string;
    eventId: string;
    title: string;
    description: string;
    date: string;
    time: string;
    venueName: string;
    venueAddress: string;
    isMainEvent: boolean;
    order: number;
  }>;
  gallery: Array<{
    id: string;
    eventId: string;
    type: 'image' | 'video';
    url: string;
    thumbnailUrl: string | null;
    caption: string | null;
    altText: string | null;
    order: number;
    width: number | null;
    height: number | null;
    duration: number | null;
    createdAt: string;
  }>;
  settings: {
    id: string;
    eventId: string;
    upiId: string | null;
    upiQrCode: string | null;
    razorpayKeyId: string | null;
    razorpayKeySecret: string | null;
    isContributionsEnabled: boolean;
    isRsvpEnabled: boolean;
    isBlessingsEnabled: boolean;
    isGalleryEnabled: boolean;
    contributionAmounts: number[];
    allowCustomAmount: boolean;
    customDomain: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    ogImage: string | null;
    socialLinks: Record<string, string>;
    footerText: string;
    footerDateLocation: string;
  } | null;
  host: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface InvitationClientProps {
  data: EventData;
}

export default function InvitationClient({ data }: InvitationClientProps) {
  const { event, functions, gallery, settings, host } = data;

  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isBlessingsOpen, setIsBlessingsOpen] = useState(false);
  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleLoginClick = () => {
    // Redirect to admin login with redirect back to this event
    window.location.href = `/admin/login?redirect=/${event.slug}`;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRsvpSubmit = async (formData: {
    name: string;
    phone?: string;
    email?: string;
    attendance: 'accepted' | 'declined';
    numberOfGuests: number;
    guestNames?: string;
    dietaryPreferences?: string;
    message?: string;
  }) => {
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event.id,
        ...formData,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit RSVP');
    }
  };

  const handleBlessingsSubmit = async (formData: {
    senderName?: string;
    senderPhone?: string;
    senderEmail?: string;
    message: string;
    isAnonymous: boolean;
    allowPublic: boolean;
    blessingType: 'text' | 'image' | 'video';
    mediaUrl?: string;
  }) => {
    const response = await fetch('/api/blessings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event.id,
        ...formData,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit blessing');
    }
  };

  const handleContributionSubmit = async (formData: {
    contributorName: string;
    contributorPhone: string;
    contributorEmail?: string;
    amount: number;
    message?: string;
    isAnonymous: boolean;
    paymentMethod: 'upi' | 'card' | 'netbanking';
    upiId?: string;
  }) => {
    const response = await fetch('/api/contributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event.id,
        ...formData,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process contribution');
    }

    // Handle UPI payment redirect
    const result = await response.json();
    if (result.paymentUrl) {
      window.location.href = result.paymentUrl;
    }
  };

  const coupleNames = `${event.coupleName1} & ${event.coupleName2}`;

  return (
    <div className="min-h-screen bg-primary-background">
      {/* Navigation */}
      <Navigation
        coupleName1={event.coupleName1}
        coupleName2={event.coupleName2}
        onLoginClick={handleLoginClick}
      />

      {/* Hero Section */}
      <Hero
        coupleName1={event.coupleName1}
        coupleName2={event.coupleName2}
        heroImage={event.heroImage}
        heroImagePosition={event.heroImagePosition}
        onScrollToDetails={() => scrollToSection('event-details')}
      />

      {/* Event Details */}
      <EventDetails
        date={event.date}
        time={event.time}
        venueName={event.venueName}
        venueAddress={event.venueAddress}
        googleMapsUrl={event.googleMapsUrl || undefined}
        importantInfo={event.importantInfo}
        rsvpDeadline={event.rsvpDeadline}
        timezone={event.timezone}
      />

      {/* Gallery */}
      {settings?.isGalleryEnabled && gallery.length > 0 && (
        <Gallery
          title="Photo Gallery"
          subtitle="Memories from our journey together"
          items={gallery.map((g) => ({
            id: g.id,
            type: g.type,
            url: g.url,
            thumbnailUrl: g.thumbnailUrl || undefined,
            caption: g.caption || '',
            altText: g.altText || g.caption || `${coupleNames} - ${g.caption || 'Photo'}`,
            width: g.width || undefined,
            height: g.height || undefined,
          }))}
        />
      )}

      {/* Action Buttons - RSVP, Blessings, Contribution */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {settings?.isRsvpEnabled && (
              <motion.button
                onClick={() => setIsRsvpOpen(true)}
                className="btn-primary h-16 lg:h-20 text-lg lg:text-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                RSVP Now
              </motion.button>
            )}

            {settings?.isBlessingsEnabled && (
              <motion.button
                onClick={() => setIsBlessingsOpen(true)}
                className="btn-secondary h-16 lg:h-20 text-lg lg:text-xl border-primary-gold text-primary-gold hover:bg-primary-gold/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Blessings
              </motion.button>
            )}

            {settings?.isContributionsEnabled && (
              <motion.button
                onClick={() => setIsContributionOpen(true)}
                className="btn-gold h-16 lg:h-20 text-lg lg:text-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contribute
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        coupleNames={coupleNames}
        eventTitle={event.title}
        eventDate={event.date}
        venueName={event.venueName}
        venueAddress={event.venueAddress}
        footerText={settings?.footerText || ''}
        footerDateLocation={settings?.footerDateLocation || ''}
        socialLinks={settings?.socialLinks || {}}
        rsvpDeadline={event.rsvpDeadline}
      />

      {/* Modals */}
      {settings?.isRsvpEnabled && (
        <RSVPForm
          isOpen={isRsvpOpen}
          onClose={() => setIsRsvpOpen(false)}
          onSubmit={handleRsvpSubmit}
          eventTitle={event.title}
          rsvpDeadline={event.rsvpDeadline}
          maxGuests={event.maxGuestsPerRsvp}
        />
      )}

      {settings?.isBlessingsEnabled && (
        <BlessingsForm
          isOpen={isBlessingsOpen}
          onClose={() => setIsBlessingsOpen(false)}
          onSubmit={handleBlessingsSubmit}
          coupleNames={coupleNames}
        />
      )}

      {settings?.isContributionsEnabled && (
        <ContributionForm
          isOpen={isContributionOpen}
          onClose={() => setIsContributionOpen(false)}
          onSubmit={handleContributionSubmit}
          coupleNames={coupleNames}
          upiId={settings.upiId || undefined}
        />
      )}

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        invitationUrl={`${window.location.origin}/${event.slug}`}
        coupleNames={coupleNames}
        eventTitle={event.title}
        eventDate={event.date}
        heroImage={event.heroImage}
      />
    </div>
  );
}