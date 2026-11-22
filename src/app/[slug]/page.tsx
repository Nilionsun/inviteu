'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Loader2 } from 'lucide-react';
import { cn, scrollToSection, formatDate } from '../../lib/utils';
import { Navigation } from '../../components/invitation/Navigation';
import { Hero } from '../../components/invitation/Hero';
import { EventDetails } from '../../components/invitation/EventDetails';
import { Gallery } from '../../components/invitation/Gallery';
import { ActionButtons } from '../../components/invitation/ActionButtons';
import { Footer } from '../../components/invitation/Footer';
import { RSVPForm } from '../../components/invitation/RSVPForm';
import { BlessingsForm } from '../../components/invitation/BlessingsForm';
import { ContributionForm } from '../../components/invitation/ContributionForm';
import { ShareModal } from '../../components/invitation/ShareModal';
import type { GalleryItem } from '@/components/invitation/Gallery';

interface InvitationPageProps {
  params: Promise<{ slug: string }>;
}

// Mock data for the invitation - in production this would come from Supabase
const mockEventData = {
  slug: 'priya-arjun-wedding',
  coupleName1: 'Priya',
  coupleName2: 'Arjun',
  eventTitle: 'Wedding Ceremony',
  heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
  heroImagePosition: 'right' as const,
  date: '2025-02-15',
  time: '16:30',
  venueName: 'The Grand Palace',
  venueAddress: 'MG Road, Bengaluru, Karnataka 560001',
  googleMapsUrl: 'https://maps.google.com/?q=The+Grand+Palace+MG+Road+Bengaluru',
  importantInfo: 'Traditional attire encouraged. Please arrive 30 minutes before the ceremony. Valet parking available.',
  rsvpDeadline: '2025-01-15',
  timezone: 'Asia/Kolkata',
  galleryTitle: 'Our Journey Together',
  gallerySubtitle: 'Memories from our pre-wedding celebrations',
  galleryItems: [
    {
      id: '1',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
      caption: 'Mehendi Ceremony',
      altText: 'Priya\'s mehendi ceremony with intricate henna designs',
    },
    {
      id: '2',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
      caption: 'Mandap Decorations',
      altText: 'Beautifully decorated wedding mandap with flowers',
    },
    {
      id: '3',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1606219592791-211e4529659b?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1606219592791-211e4529659b?w=400&q=80',
      caption: 'Engagement Rings',
      altText: 'Close up of the engagement rings',
    },
    {
      id: '4',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80',
      caption: 'Sangeet Night',
      altText: 'Couple dancing at their sangeet ceremony',
    },
    {
      id: '5',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80',
      caption: 'Floral Decorations',
      altText: 'Stunning floral arrangements at the venue',
    },
    {
      id: '6',
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1537633527864-b21f2b2c1e6e?w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1537633527864-b21f2b2c1e6e?w=400&q=80',
      caption: 'Haldi Ceremony',
      altText: 'Traditional haldi ceremony with family',
    },
  ] as GalleryItem[],
  contactEmail: 'priya.arjun.wedding@example.com',
  contactPhone: '+91 98765 43210',
  socialLinks: {
    instagram: 'https://instagram.com/priyaarjunwedding',
    facebook: 'https://facebook.com/priyaarjunwedding',
    whatsapp: 'https://wa.me/919876543210',
  },
  upiId: 'priya.arjun@upi',
};

export default function InvitationPage({ params }: InvitationPageProps) {
  // Resolve params
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  // Modal states
  const [showRsvp, setShowRsvp] = useState(false);
  const [showBlessings, setShowBlessings] = useState(false);
  const [showContribution, setShowContribution] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionType, setSubmissionType] = useState<'rsvp' | 'blessings' | 'contribution' | null>(null);

  // Handle form submissions
  const handleRsvpSubmit = useCallback(async (data: any) => {
    setIsSubmitting(true);
    setSubmissionType('rsvp');
    try {
      // In production: call API route to save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('RSVP submitted:', data);
    } finally {
      setIsSubmitting(false);
      setSubmissionType(null);
    }
  }, []);

  const handleBlessingsSubmit = useCallback(async (data: any) => {
    setIsSubmitting(true);
    setSubmissionType('blessings');
    try {
      // In production: call API route to save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Blessings submitted:', data);
    } finally {
      setIsSubmitting(false);
      setSubmissionType(null);
    }
  }, []);

  const handleContributionSubmit = useCallback(async (data: any) => {
    setIsSubmitting(true);
    setSubmissionType('contribution');
    try {
      // In production: integrate with Razorpay
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Contribution submitted:', data);
    } finally {
      setIsSubmitting(false);
      setSubmissionType(null);
    }
  }, []);

  // Determine which form is submitting
  const isRsvpSubmitting = isSubmitting && submissionType === 'rsvp';
  const isBlessingsSubmitting = isSubmitting && submissionType === 'blessings';
  const isContributionSubmitting = isSubmitting && submissionType === 'contribution';

  // Handle scroll to event details
  const handleScrollToDetails = useCallback(() => {
    scrollToSection('event-details');
  }, []);

  // Generate invitation URL for sharing
  const invitationUrl = typeof window !== 'undefined'
    ? window.location.origin + window.location.pathname
    : `https://inviteaura.com/${slug}`;

  const eventDateFormatted = formatDate(mockEventData.date);

  return (
    <div className="min-h-screen bg-primary-background">
      {/* Navigation */}
      <Navigation
        coupleName1={mockEventData.coupleName1}
        coupleName2={mockEventData.coupleName2}
        onLoginClick={() => {
          // In production: redirect to admin login
          window.location.href = '/admin/login';
        }}
      />

      {/* Hero Section */}
      <Hero
        coupleName1={mockEventData.coupleName1}
        coupleName2={mockEventData.coupleName2}
        heroImage={mockEventData.heroImage}
        heroImagePosition={mockEventData.heroImagePosition}
        onScrollToDetails={handleScrollToDetails}
      />

      {/* Event Details */}
      <EventDetails
        date={mockEventData.date}
        time={mockEventData.time}
        venueName={mockEventData.venueName}
        venueAddress={mockEventData.venueAddress}
        googleMapsUrl={mockEventData.googleMapsUrl}
        importantInfo={mockEventData.importantInfo}
        rsvpDeadline={mockEventData.rsvpDeadline}
        timezone={mockEventData.timezone}
      />

      {/* Gallery */}
      <Gallery
        title={mockEventData.galleryTitle}
        subtitle={mockEventData.gallerySubtitle}
        items={mockEventData.galleryItems}
      />

      {/* Action Buttons */}
      <ActionButtons
        onRsvpClick={() => setShowRsvp(true)}
        onBlessingsClick={() => setShowBlessings(true)}
        onContributionClick={() => setShowContribution(true)}
        onShareClick={() => setShowShare(true)}
      />

      {/* Footer */}
      <Footer
        coupleNames={`${mockEventData.coupleName1} & ${mockEventData.coupleName2}`}
        eventTitle={mockEventData.eventTitle}
        eventDate={eventDateFormatted}
        venueName={mockEventData.venueName}
        venueAddress={mockEventData.venueAddress}
        contactEmail={mockEventData.contactEmail}
        contactPhone={mockEventData.contactPhone}
        socialLinks={mockEventData.socialLinks}
        rsvpDeadline={formatDate(mockEventData.rsvpDeadline)}
      />

      {/* Modals */}
      <RSVPForm
        isOpen={showRsvp}
        onClose={() => setShowRsvp(false)}
        onSubmit={handleRsvpSubmit}
        eventTitle={mockEventData.eventTitle}
        rsvpDeadline={mockEventData.rsvpDeadline}
        isSubmitting={isRsvpSubmitting}
      />

      <BlessingsForm
        isOpen={showBlessings}
        onClose={() => setShowBlessings(false)}
        onSubmit={handleBlessingsSubmit}
        coupleNames={`${mockEventData.coupleName1} & ${mockEventData.coupleName2}`}
        isSubmitting={isBlessingsSubmitting}
      />

      <ContributionForm
        isOpen={showContribution}
        onClose={() => setShowContribution(false)}
        onSubmit={handleContributionSubmit}
        coupleNames={`${mockEventData.coupleName1} & ${mockEventData.coupleName2}`}
        upiId={mockEventData.upiId}
        isSubmitting={isContributionSubmitting}
      />

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        invitationUrl={invitationUrl}
        coupleNames={`${mockEventData.coupleName1} & ${mockEventData.coupleName2}`}
        eventTitle={mockEventData.eventTitle}
        eventDate={eventDateFormatted}
        heroImage={mockEventData.heroImage}
      />
    </div>
  );
}