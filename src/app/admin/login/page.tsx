'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true,
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);
    try {
      // In production: call API route to authenticate with Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful login - in production, verify credentials
      if (data.email === 'admin@inviteaura.com' && data.password === 'inviteaura2025') {
        setToast({ type: 'success', message: 'Welcome back! Redirecting to dashboard...' });
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh();
        }, 1500);
      } else {
        setError('Invalid email or password. Use admin@inviteaura.com / inviteaura2025 for demo.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setToast({ type: 'error', message: 'Password reset not implemented in demo.' });
  };

  return (
    <div className="min-h-screen bg-primary-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 12 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-gold/10 mb-6"
          >
            <Lock className="w-10 h-10 text-primary-gold" />
          </motion.div>
          <h1 className="font-display font-medium text-3xl text-text-primary mb-2">
            InviteAura Admin
          </h1>
          <p className="text-body text-text-secondary">
            Sign in to manage your wedding invitations
          </p>
        </div>

        {/* Toast */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              'mb-6 p-4 rounded-xl flex items-center gap-3 animate-slide-down',
              toast.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            )}
            role="alert"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-body-sm font-medium">{toast.message}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-surface-cream rounded-2xl border border-border-gold/50 p-8 shadow-xl"
        >
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@inviteaura.com"
                {...register('email')}
                autoComplete="email"
                disabled={isLoading}
                error={errors.email?.message}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600" role="alert">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  autoComplete="current-password"
                  disabled={isLoading}
                  error={errors.password?.message}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600" role="alert">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 rounded border-border-gold/50 text-primary-gold focus:ring-primary-gold"
                  disabled={isLoading}
                />
                <span className="text-body-sm text-text-secondary">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-body-sm text-primary-gold hover:underline transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-body-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-border-gold/30">
            <p className="text-center text-body-sm text-text-muted mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2 text-body-sm text-text-secondary">
              <div className="flex justify-between">
                <span>Email:</span>
                <code className="bg-primary-gold/10 px-2 py-0.5 rounded font-mono">admin@inviteaura.com</code>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <code className="bg-primary-gold/10 px-2 py-0.5 rounded font-mono">inviteaura2025</code>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-body-sm text-text-muted mt-8">
          © 2025 InviteAura. Premium Digital Wedding Invitations.
        </p>
      </motion.div>

      <style jsx global>{`
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}