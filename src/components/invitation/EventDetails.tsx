'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, Info, Download, Copy, Check } from 'lucide-react';
import { cn, formatDate, formatTime, generateICS } from '../../lib/utils';
import { Button } from '../ui';

interface EventDetail {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

interface EventDetailsProps {
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl?: string;
  importantInfo: string;
  rsvpDeadline: string;
  timezone?: string;
}

export function EventDetails({
  date,
  time,
  venueName,
  venueAddress,
  googleMapsUrl,
  importantInfo,
  rsvpDeadline,
  timezone = 'Asia/Kolkata',
}: EventDetailsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [icsCopied, setIcsCopied] = useState(false);

  const details: EventDetail[] = [
    {
      icon: <Calendar className="w-7 h-7" />,
      title: 'Date & Time',
      description: `${formatDate(date)} at ${formatTime(time)} ${timezone !== 'Asia/Kolkata' ? `(${timezone})` : ''}`,
      action: {
        label: 'Add to Calendar',
        onClick: handleAddToCalendar,
        icon: <Download className="w-4 h-4" />,
      },
    },
    {
      icon: <MapPin className="w-7 h-7" />,
      title: 'Venue',
      description: `${venueName}, ${venueAddress}`,
      action: googleMapsUrl
        ? {
            label: 'Open in Maps',
            onClick: () => window.open(googleMapsUrl, '_blank'),
            icon: <MapPin className="w-4 h-4" />,
          }
        : undefined,
    },
    {
      icon: <Info className="w-7 h-7" />,
      title: 'Important Info',
      description: importantInfo,
    },
  ];

  function handleAddToCalendar() {
    const startDateTime = `${date}T${time}:00`;
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 4); // 4 hours

    const icsContent = generateICS({
      title: 'Wedding Ceremony',
      description: `Wedding of the couple at ${venueName}, ${venueAddress}`,
      location: `${venueName}, ${venueAddress}`,
      startDate: startDateTime,
      endDate: endDateTime.toISOString(),
      timezone,
    });

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'wedding-invitation.ics';
    link.click();
    URL.revokeObjectURL(link.href);
    setIcsCopied(true);
    setTimeout(() => setIcsCopied(false), 2000);
  }

  return (
    <section
      id="event-details"
      ref={ref}
      className="relative -mt-16 lg:-mt-24 z-30 px-4 sm:px-6 lg:px-8 pb-16"
      aria-labelledby="event-details-title"
    >
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Event Details Card */}
        <div className="invitation-card relative p-8 lg:p-12">
          {/* Floral corners */}
          <div className="floral-corner floral-corner-tl" aria-hidden="true" />
          <div className="floral-corner floral-corner-tr" aria-hidden="true" />
          <div className="floral-corner floral-corner-bl" aria-hidden="true" />
          <div className="floral-corner floral-corner-br" aria-hidden="true" />

          {/* Heading */}
          <div className="text-center mb-10 lg:mb-12 relative z-10">
            <h2 id="event-details-title" className="font-serif font-medium text-section-title text-text-primary mb-3">
              Event Details
            </h2>
            <div className="gold-divider" aria-hidden="true" />
          </div>

          {/* Three Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {details.map((detail, index) => (
              <motion.div
                key={detail.title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1), ease: 'easeOut' }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-blush to-primary-cream border border-border-gold/50 mb-5 text-primary-gold">
                  {detail.icon}
                </div>
                <h3 className="font-serif font-medium text-xl text-text-primary mb-3">
                  {detail.title}
                </h3>
                <p className="font-sans text-body text-text-secondary leading-relaxed mb-5">
                  {detail.description}
                </p>
                {detail.action && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={detail.action.onClick}
                    className="w-full sm:w-auto"
                  >
                    {detail.action.icon}
                    {detail.action.label}
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {/* RSVP Deadline Note */}
          <motion.div
            className="mt-10 pt-8 border-t border-border-gold/30 relative z-10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center gap-2 text-text-muted text-body-sm">
              <Calendar className="w-4 h-4" />
              <span>Kindly RSVP by {formatDate(rsvpDeadline)}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}