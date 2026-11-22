'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail, Users, Calendar, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button, Input, Textarea } from '../ui';
import { Modal } from '../ui';

const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().refine((val) => !val || /^[\d\s\-\+\(\)]{10,}$/.test(val), 'Invalid phone number'),
  email: z.string().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Invalid email address'),
  attendance: z.enum(['accepted', 'declined']),
  numberOfGuests: z.number().min(1, 'At least 1 guest').max(10, 'Maximum 10 guests'),
  guestNames: z.string().optional(),
  dietaryPreferences: z.string().optional(),
  message: z.string().optional(),
});

type RSVPFormData = z.infer<typeof rsvpSchema>;

interface RSVPFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RSVPFormData) => Promise<void>;
  eventTitle?: string;
  rsvpDeadline?: string;
  maxGuests?: number;
  isSubmitting?: boolean;
}

export function RSVPForm({
  isOpen,
  onClose,
  onSubmit,
  eventTitle = 'Our Wedding Celebration',
  rsvpDeadline,
  maxGuests = 10,
  isSubmitting: externalSubmitting = false,
}: RSVPFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting: internalSubmitting },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attendance: 'accepted',
      numberOfGuests: 1,
    },
  });

  const attendance = watch('attendance');
  const numberOfGuests = watch('numberOfGuests');
  const isSubmitting = externalSubmitting || internalSubmitting;

  const handleFormSubmit = async (data: RSVPFormData) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      await onSubmit(data);
      setSubmitStatus('success');
      // Reset form after successful submission
      setTimeout(() => {
        reset({
          attendance: 'accepted',
          numberOfGuests: 1,
        });
        setSubmitStatus('idle');
        onClose();
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const formatDeadline = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitStatus === 'success' ? () => {} : onClose}
      title="Will You Join Our Celebration?"
      description={rsvpDeadline ? `Please confirm your attendance by ${formatDeadline(rsvpDeadline)}.` : undefined}
      size="lg"
      showCloseButton={submitStatus !== 'success'}
      closeOnOverlayClick={submitStatus !== 'success'}
      closeOnEscape={submitStatus !== 'success'}
    >
      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>
            <h3 className="font-serif font-medium text-2xl text-text-primary mb-3">
              We Can&apos;t Wait to Celebrate with You!
            </h3>
            <p className="text-body text-text-secondary mb-6">
              Your RSVP has been confirmed. We&apos;ll send you a confirmation shortly.
            </p>
            <motion.div className="flex items-center justify-center gap-4 text-text-muted text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {rsvpDeadline && `RSVP Deadline: ${formatDeadline(rsvpDeadline)}`}
              </span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
                role="alert"
              >
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-body-sm">{errorMessage}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="name" className="form-label">
                  Full Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  error={errors.name?.message}
                  {...register('name')}
                  autoComplete="name"
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    type="tel"
                    error={errors.phone?.message}
                    {...register('phone')}
                    autoComplete="tel"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    placeholder="you@example.com"
                    type="email"
                    error={errors.email?.message}
                    {...register('email')}
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Attendance */}
              <fieldset>
                <legend className="form-label">
                  Will you attend? <span className="text-red-500" aria-hidden="true">*</span>
                </legend>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Attendance options">
                  {[
                    { value: 'accepted', label: 'Joyfully Accept', icon: Heart, description: 'We\'ll be there!' },
                    { value: 'declined', label: 'Regretfully Decline', icon: XCircle, description: 'Can\'t make it' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        'relative cursor-pointer',
                        attendance === option.value ? 'ring-2 ring-primary-gold' : ''
                      )}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register('attendance')}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all duration-300',
                          attendance === option.value
                            ? 'border-primary-gold bg-primary-gold/5'
                            : 'border-border-gold/50 hover:border-primary-gold/50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <option.icon className={cn('w-6 h-6', attendance === option.value ? 'text-primary-gold' : 'text-text-muted')} />
                          <div>
                            <p className="font-medium text-text-primary">{option.label}</p>
                            <p className="text-body-sm text-text-muted">{option.description}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.attendance && (
                  <p className="mt-2 text-sm text-red-600" role="alert">{errors.attendance.message}</p>
                )}
              </fieldset>

              {/* Number of Guests */}
              {attendance === 'accepted' && (
                <div>
                  <label className="form-label">
                    Number of Guests <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 border border-border-gold/50 rounded-xl p-2 bg-surface-cream">
                      <button
                        type="button"
                        onClick={() => setValue('numberOfGuests', Math.max(1, numberOfGuests - 1))}
                        disabled={numberOfGuests <= 1 || isSubmitting}
                        className="p-2 rounded-lg text-text-primary hover:bg-primary-blush/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease guests"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">−</span>
                      </button>
                      <span className="w-12 text-center font-serif text-xl text-text-primary">
                        {numberOfGuests}
                      </span>
                      <button
                        type="button"
                        onClick={() => setValue('numberOfGuests', Math.min(maxGuests, numberOfGuests + 1))}
                        disabled={numberOfGuests >= maxGuests || isSubmitting}
                        className="p-2 rounded-lg text-text-primary hover:bg-primary-blush/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase guests"
                      >
                        <span className="w-5 h-5 flex items-center justify-center">+</span>
                      </button>
                    </div>
                    <span className="text-body-sm text-text-muted">(Max {maxGuests} guests)</span>
                  </div>
                </div>
              )}

              {/* Guest Names */}
              {attendance === 'accepted' && numberOfGuests > 1 && (
                <div>
                  <label htmlFor="guestNames" className="form-label">
                    Guest Names
                  </label>
                  <Textarea
                    id="guestNames"
                    placeholder="Names of additional guests (one per line)"
                    rows={3}
                    {...register('guestNames')}
                    disabled={isSubmitting}
                  />
                  <p className="mt-1 text-body-sm text-text-muted">
                    Please list the names of all guests attending with you.
                  </p>
                </div>
              )}

              {/* Dietary Preferences */}
              {attendance === 'accepted' && (
                <div>
                  <label htmlFor="dietaryPreferences" className="form-label">
                    Dietary Preferences
                  </label>
                  <Textarea
                    id="dietaryPreferences"
                    placeholder="Any allergies or dietary restrictions (vegetarian, vegan, gluten-free, etc.)"
                    rows={2}
                    {...register('dietaryPreferences')}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="message" className="form-label">
                  Message for the Couple
                </label>
                <Textarea
                  id="message"
                  placeholder="Your wishes for the couple..."
                  rows={3}
                  {...register('message')}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="w-full"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm RSVP'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}