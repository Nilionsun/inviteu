'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Gift, CreditCard, Smartphone, IndianRupee, Lock, ArrowRight, Heart } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { Button, Input } from '../ui';
import { Modal } from '../ui';

const contributionSchema = z.object({
  contributorName: z.string().min(2, 'Name must be at least 2 characters'),
  contributorPhone: z.string().min(10, 'Valid phone number required for UPI'),
  contributorEmail: z.string().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Invalid email address'),
  amount: z.number().min(100, 'Minimum contribution is ₹100').max(100000, 'Maximum contribution is ₹1,00,000'),
  message: z.string().max(500, 'Maximum 500 characters').optional(),
  isAnonymous: z.boolean().default(false),
  paymentMethod: z.enum(['upi', 'card', 'netbanking']).transform((val) => val as 'upi' | 'card' | 'netbanking'),
  upiId: z.string().optional(),
});

type ContributionFormData = z.infer<typeof contributionSchema>;

const PRESET_AMOUNTS = [501, 1001, 2100, 5001, 11001, 21001];

interface ContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContributionFormData) => Promise<void>;
  coupleNames?: string;
  upiId?: string;
  isSubmitting?: boolean;
}

export function ContributionForm({
  isOpen,
  onClose,
  onSubmit,
  coupleNames = 'the happy couple',
  upiId: defaultUpiId,
  isSubmitting: externalSubmitting = false,
}: ContributionFormProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'payment'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting: internalSubmitting },
  } = useForm({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: 1001,
      isAnonymous: false,
      paymentMethod: 'upi',
      upiId: defaultUpiId,
    },
  });

  const paymentMethod = watch('paymentMethod');
  const amount = watch('amount');
  const isSubmitting = externalSubmitting || internalSubmitting;

  const handleFormSubmit = async (data: ContributionFormData) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      // For UPI, we'll handle payment initiation differently
      if (data.paymentMethod === 'upi') {
        setSubmitStatus('payment');
        setPaymentInitiated(true);
        // The onSubmit will handle the actual payment initiation
        await onSubmit(data);
        setSubmitStatus('success');
      } else {
        await onSubmit(data);
        setSubmitStatus('success');
      }
      setTimeout(() => {
        reset({
          amount: 1001,
          isAnonymous: false,
          paymentMethod: 'upi',
          upiId: defaultUpiId,
        });
        setPaymentInitiated(false);
        setSubmitStatus('idle');
        onClose();
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setPaymentInitiated(false);
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const handleAmountSelect = (value: number) => {
    setValue('amount', value, { shouldValidate: true });
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setValue('amount', value, { shouldValidate: true });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitStatus === 'success' ? () => {} : onClose}
      title="Contribute to Our New Beginning"
      description={`Your generous gift helps ${coupleNames} start their journey together`}
      size="lg"
      showCloseButton={submitStatus !== 'success' && submitStatus !== 'payment'}
      closeOnOverlayClick={submitStatus !== 'success' && submitStatus !== 'payment'}
      closeOnEscape={submitStatus !== 'success' && submitStatus !== 'payment'}
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
              Thank You for Your Generosity!
            </h3>
            <p className="text-body text-text-secondary mb-6">
              Your contribution of <span className="font-semibold text-primary-gold">{formatCurrency(amount)}</span> has been received.
            </p>
            <motion.div className="flex items-center justify-center gap-2 text-primary-gold">
              <Heart className="w-5 h-5 animate-pulse" />
              <span className="text-body-sm">Blessings for the couple</span>
            </motion.div>
          </motion.div>
        ) : submitStatus === 'payment' ? (
          <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-gold/20 text-primary-gold mb-6"
            >
              <motion.div
                className="w-10 h-10 border-4 border-primary-gold/20 border-t-primary-gold rounded-full animate-spin"
                aria-label="Processing payment"
              />
            </motion.div>
            <h3 className="font-serif font-medium text-2xl text-text-primary mb-3">
              Initiating Payment
            </h3>
            <p className="text-body text-text-secondary mb-6">
              Redirecting to your UPI app to complete the payment of <span className="font-semibold text-primary-gold">{formatCurrency(amount)}</span>.
            </p>
            <div className="flex items-center justify-center gap-4 text-text-muted text-sm">
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Secure
              </span>
              <span className="flex items-center gap-1">
                <Smartphone className="w-4 h-4" />
                UPI Enabled
              </span>
            </div>
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
              {/* Amount Selection */}
              <fieldset>
                <legend className="form-label">
                  Contribution Amount <span className="text-red-500" aria-hidden="true">*</span>
                </legend>

                {/* Preset Amounts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountSelect(preset)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all duration-300 text-center',
                        amount === preset
                          ? 'border-primary-gold bg-primary-gold/5'
                          : 'border-border-gold/50 hover:border-primary-gold/50'
                      )}
                      disabled={isSubmitting}
                    >
                      <p className="font-serif font-medium text-xl text-text-primary">{formatCurrency(preset)}</p>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label htmlFor="customAmount" className="form-label">
                    Or enter custom amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold font-semibold text-xl">
                      ₹
                    </span>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={handleCustomAmount}
                      error={errors.amount?.message}
                      className="pl-10"
                      disabled={isSubmitting}
                      min={100}
                      max={100000}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-2 text-sm text-red-600" role="alert">{errors.amount.message}</p>
                  )}
                  <p className="mt-1 text-body-sm text-text-muted">
                    Minimum ₹100 • Maximum ₹1,00,000
                  </p>
                </div>
              </fieldset>

              {/* Payment Method */}
              <fieldset>
                <legend className="form-label">
                  Payment Method <span className="text-red-500" aria-hidden="true">*</span>
                </legend>
                <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Payment method">
                  {[
                    { value: 'upi', label: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, Paytm', recommended: true },
                    { value: 'card', label: 'Card', icon: CreditCard, description: 'Debit/Credit Card' },
                    { value: 'netbanking', label: 'Net Banking', icon: Lock, description: 'Bank Transfer' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        'relative cursor-pointer',
                        paymentMethod === option.value ? 'ring-2 ring-primary-gold' : ''
                      )}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register('paymentMethod')}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all duration-300 text-center',
                          paymentMethod === option.value
                            ? 'border-primary-gold bg-primary-gold/5'
                            : 'border-border-gold/50 hover:border-primary-gold/50'
                        )}
                      >
                        <option.icon className={cn('w-8 h-8 mx-auto mb-2', paymentMethod === option.value ? 'text-primary-gold' : 'text-text-muted')} />
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <p className="font-medium text-text-primary">{option.label}</p>
                          {option.recommended && (
                            <span className="px-2 py-0.5 text-xs bg-primary-gold/10 text-primary-gold rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-body-sm text-text-muted">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="mt-2 text-sm text-red-600" role="alert">{errors.paymentMethod.message}</p>
                )}
              </fieldset>

              {/* UPI ID Input */}
              {paymentMethod === 'upi' && (
                <div>
                  <label htmlFor="upiId" className="form-label">
                    UPI ID
                    <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="upiId"
                    placeholder="yourname@upi"
                    {...register('upiId')}
                    autoComplete="off"
                    disabled={isSubmitting}
                    error={errors.upiId?.message}
                  />
                  <p className="mt-1 text-body-sm text-text-muted">
                    Your UPI ID (e.g., name@bank, phone@ybl). This is where we'll send the payment request.
                  </p>
                </div>
              )}

              {/* Contributor Details */}
              <div className="border-t border-border-gold/30 pt-5">
                <h4 className="font-medium text-text-primary mb-4">Your Details</h4>
                <div>
                  <label htmlFor="contributorName" className="form-label">
                    Your Name <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="contributorName"
                    placeholder="Your full name"
                    {...register('contributorName')}
                    autoComplete="name"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contributorPhone" className="form-label">
                      Phone Number <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="contributorPhone"
                      placeholder="+91 98765 43210"
                      type="tel"
                      {...register('contributorPhone')}
                      autoComplete="tel"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="contributorEmail" className="form-label">
                      Email Address
                    </label>
                    <Input
                      id="contributorEmail"
                      placeholder="you@example.com"
                      type="email"
                      error={errors.contributorEmail?.message}
                      {...register('contributorEmail')}
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="form-label">
                  Message (Optional)
                </label>
                <Input
                  id="message"
                  placeholder="A note for the couple..."
                  {...register('message')}
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-body-sm text-text-muted">
                  {watch('message')?.length || 0} / 500 characters
                </p>
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
                  <span className="text-body text-text-secondary">Contribute anonymously (name hidden from couple)</span>
                </label>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-text-muted text-sm p-4 bg-primary-cream/50 rounded-xl">
                <Lock className="w-5 h-5 text-primary-gold" />
                <span>Secured by Razorpay • 128-bit SSL Encryption • PCI DSS Compliant</span>
                <ArrowRight className="w-4 h-4 text-primary-gold" />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="w-full"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Contribute ${formatCurrency(amount)}`}
                <IndianRupee className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-center text-body-sm text-text-muted">
                By contributing, you agree to our <a href="#" className="underline hover:text-primary-gold">Terms</a> and <a href="#" className="underline hover:text-primary-gold">Privacy Policy</a>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}