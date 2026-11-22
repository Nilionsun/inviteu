'use client';

import { useState, useEffect } from 'react';
import { Globe, LogIn, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavigationProps {
  coupleName1: string;
  coupleName2: string;
  onLoginClick: () => void;
  locale?: string;
  onLocaleChange?: (locale: string) => void;
}

export function Navigation({
  coupleName1,
  coupleName2,
  onLoginClick,
  locale = 'en',
  onLocaleChange,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-primary-background/95 backdrop-blur-md border-b border-border-gold/30 shadow-card'
          : 'bg-transparent'
      )}
      role="banner"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Left side - Logo and couple names */}
          <div className="flex items-center gap-4">
            <div
              className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-gold to-primary-gold-dark text-text-white font-serif font-bold text-xl"
              aria-hidden="true"
            >
              {coupleName1.charAt(0)}{coupleName2.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="font-script text-hero-subtitle text-text-primary leading-tight">
                {coupleName1} & {coupleName2}
              </p>
              <p className="font-sans text-caption text-text-muted tracking-widest uppercase leading-none">
                OUR WEDDING INVITATION
              </p>
            </div>
            <div className="sm:hidden">
              <p className="font-script text-lg text-text-primary leading-tight">
                {coupleName1} & {coupleName2}
              </p>
            </div>
          </div>

          {/* Right side - Language and Login */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                className="btn-ghost gap-1.5 px-3 py-2"
                aria-haspopup="listbox"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-body-sm font-medium">{locale.toUpperCase()}</span>
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={onLoginClick}
              className="btn-secondary hidden sm:flex"
              aria-label="Host login"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="btn-ghost p-2 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden animate-slide-down border-t border-border-gold/30 bg-primary-background/95 backdrop-blur-md"
          >
            <div className="py-4 px-2 space-y-3">
              <div className="flex items-center gap-3 px-3 py-2">
                <Globe className="w-5 h-5 text-text-muted" />
                <select
                  value={locale}
                  onChange={(e) => onLocaleChange?.(e.target.value)}
                  className="flex-1 bg-transparent text-text-primary font-medium text-body appearance-none focus:outline-none"
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="gu">ગુજરાતી</option>
                  <option value="ta">தமிழ்</option>
                  <option value="te">తెలుగు</option>
                </select>
              </div>
              <button
                onClick={() => {
                  onLoginClick();
                  setIsMobileMenuOpen(false);
                }}
                className="btn-primary w-full justify-center"
              >
                <LogIn className="w-5 h-5" />
                <span>Host Login</span>
              </button>
            </div>
          </div>
        )}

        {/* Decorative separator line */}
        <div
          className={cn(
            'hidden lg:block h-px mx-4 transition-opacity duration-300',
            isScrolled ? 'opacity-100 bg-border-gold/50' : 'opacity-0 bg-border-gold/20'
          )}
          aria-hidden="true"
        />
      </nav>
    </header>
  );
}