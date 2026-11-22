'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Heart, Send, Image, FileText, Smile } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button, Input, Textarea } from '../ui';
import { Modal } from '../ui';

const blessingsSchema = z.object({
  senderName: z.string().min(2, 'Name must be at least 2 characters'),
  senderPhone: z.string().optional().refine((val) => !val || /^[\d\s\-\+\(\)]{10,}$/.test(val), 'Invalid phone number'),
  senderEmail: z.string().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Invalid email address'),
  message: z.string().min(10, 'Blessing must be at least 10 characters').max(1000, 'Maximum 1000 characters'),
  isAnonymous: z.boolean().default(false),
  allowPublic: z.boolean().default(true),
  blessingType: z.enum(['text', 'image', 'video']).transform((val) => val as 'text' | 'image' | 'video'),
  mediaUrl: z.string().optional(),
});

type BlessingsFormData = z.infer<typeof blessingsSchema>;

interface BlessingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BlessingsFormData) => Promise<void>;
  coupleNames?: string;
  isSubmitting?: boolean;
}

export function BlessingsForm({
  isOpen,
  onClose,
  onSubmit,
  coupleNames = 'the happy couple',
  isSubmitting: externalSubmitting = false,
}: BlessingsFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting: internalSubmitting },
  } = useForm({
    resolver: zodResolver(blessingsSchema),
    defaultValues: {
      blessingType: 'text',
      isAnonymous: false,
      allowPublic: true,
    },
  });

  const blessingType = watch('blessingType');
  const isSubmitting = externalSubmitting || internalSubmitting;

  const handleFormSubmit = async (data: BlessingsFormData) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      await onSubmit(data);
      setSubmitStatus('success');
      setTimeout(() => {
        reset({
          blessingType: 'text',
          isAnonymous: false,
          allowPublic: true,
        });
        setMediaPreview(null);
        setSubmitStatus('idle');
        onClose();
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const handleMediaUrlChange = (url: string) => {
    setValue('mediaUrl', url);
    if (url && (url.match(/\.(jpeg|jpg|png|gif|webp)$/i) || url.includes('youtube.com') || url.includes('youtu.be'))) {
      setMediaPreview(url);
    } else {
      setMediaPreview(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitStatus === 'success' ? () => {} : onClose}
      title="Send Your Blessings"
      description={`Share your heartfelt wishes for ${coupleNames}`}
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
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-gold/20 text-primary-gold mb-6"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>
            <h3 className="font-serif font-medium text-2xl text-text-primary mb-3">
              Blessings Sent!
            </h3>
            <p className="text-body text-text-secondary mb-6">
              Your heartfelt wishes have been delivered to {coupleNames}.
            </p>
            <motion.div className="flex items-center justify-center gap-2 text-primary-gold">
              <Heart className="w-5 h-5 animate-pulse" />
              <span className="text-body-sm">Made with love</span>
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
              {/* Blessing Type Selector */}
              <fieldset>
                <legend className="form-label">
                  Blessing Type <span className="text-red-500" aria-hidden="true">*</span>
                </legend>
                <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Blessing type">
                  {[
                    { value: 'text', label: 'Text Message', icon: FileText, description: 'Written blessing' },
                    { value: 'image', label: 'Photo/Image', icon: Image, description: 'Image blessing' },
                    { value: 'video', label: 'Video Message', icon: Smile, description: 'Record a video' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        'relative cursor-pointer',
                        blessingType === option.value ? 'ring-2 ring-primary-gold' : ''
                      )}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register('blessingType')}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all duration-300 text-center',
                          blessingType === option.value
                            ? 'border-primary-gold bg-primary-gold/5'
                            : 'border-border-gold/50 hover:border-primary-gold/50'
                        )}
                      >
                        <option.icon className={cn('w-8 h-8 mx-auto mb-2', blessingType === option.value ? 'text-primary-gold' : 'text-text-muted')} />
                        <p className="font-medium text-text-primary">{option.label}</p>
                        <p className="text-body-sm text-text-muted">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.blessingType && (
                  <p className="mt-2 text-sm text-red-600" role="alert">{errors.blessingType.message}</p>
                )}
              </fieldset>

              {/* Media URL Input for Image/Video */}
              {(blessingType === 'image' || blessingType === 'video') && (
                <div>
                  <label htmlFor="mediaUrl" className="form-label">
                    {blessingType === 'image' ? 'Image URL' : 'Video URL (YouTube)'}
                    <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="mediaUrl"
                    placeholder={blessingType === 'image' ? 'https://example.com/photo.jpg' : 'https://youtube.com/watch?v=...'}
                    type="url"
                    error={errors.mediaUrl?.message}
                    value={watch('mediaUrl')}
                    onChange={(e) => handleMediaUrlChange(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {mediaPreview && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-border-gold/50">
                      {blessingType === 'image' ? (
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="aspect-video bg-black/50 flex items-center justify-center relative">
                          <iframe
                            src={getYoutubeEmbedUrl(mediaPreview) || mediaPreview}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <p className="mt-1 text-body-sm text-text-muted">
                    {blessingType === 'image'
                      ? 'Supported formats: JPG, PNG, GIF, WebP (max 10MB)'
                      : 'Enter a YouTube video URL'}
                  </p>
                </div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="message" className="form-label">
                  Your Blessing <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <Textarea
                  id="message"
                  placeholder="Write your heartfelt wishes for the couple..."
                  rows={5}
                  {...register('message')}
                  error={errors.message?.message}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-body-sm text-text-muted">
                    {watch('message')?.length || 0} / 1000 characters
                  </p>
                  <p className="text-body-sm text-text-muted">
                    Minimum 10 characters
                  </p>
                </div>
              </div>

              {/* Sender Details */}
              <div className="border-t border-border-gold/30 pt-5">
                <h4 className="font-medium text-text-primary mb-4">Your Details (Optional)</h4>
                <div>
                  <label htmlFor="senderName" className="form-label">
                    Your Name
                  </label>
                  <Input
                    id="senderName"
                    placeholder="Your name"
                    {...register('senderName')}
                    autoComplete="name"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="senderPhone" className="form-label">
                      Phone Number
                    </label>
                    <Input
                      id="senderPhone"
                      placeholder="+91 98765 43210"
                      type="tel"
                      error={errors.senderPhone?.message}
                      {...register('senderPhone')}
                      autoComplete="tel"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="senderEmail" className="form-label">
                      Email Address
                    </label>
                    <Input
                      id="senderEmail"
                      placeholder="you@example.com"
                      type="email"
                      error={errors.senderEmail?.message}
                      {...register('senderEmail')}
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 border-t border-border-gold/30 pt-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isAnonymous')}
                    className="w-4 h-4 rounded border-border-gold/50 text-primary-gold focus:ring-primary-gold"
                    disabled={isSubmitting}
                  />
                  <span className="text-body text-text-secondary">Send anonymously (name hidden from couple)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('allowPublic')}
                    className="w-4 h-4 rounded border-border-gold/50 text-primary-gold focus:ring-primary-gold"
                    disabled={isSubmitting}
                  />
                  <span className="text-body text-text-secondary">Allow this blessing to be displayed publicly</span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="secondary"
                size="xl"
                className="w-full"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Blessing'}
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

// Helper function for YouTube embed URL
function getYoutubeEmbedUrl(url: string): string {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
}