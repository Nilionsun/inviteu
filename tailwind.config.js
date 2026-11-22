/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // InviteAura Design System Colors
        primary: {
          background: '#FFF8F1',
          cream: '#F9E9D9',
          blush: '#F7D6D0',
          gold: '#B77A38',
          'gold-light': '#D4A574',
          'gold-dark': '#9B642C',
        },
        text: {
          primary: '#341B16',
          secondary: '#4A251C',
          muted: '#6B4A3D',
          white: '#FFFFFF',
        },
        border: {
          gold: '#E8C9A0',
          cream: '#F0E0D0',
        },
        surface: {
          cream: '#FFFDF8',
          blush: '#FEF7F5',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        script: ['Great Vibes', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero-title': ['clamp(3rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-subtitle': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.3', letterSpacing: '0.05em' }],
        'section-title': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2' }],
        'section-subtitle': ['clamp(1rem, 2vw, 1.25rem)', { lineHeight: '1.5' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'card': '1.5rem',
        'card-lg': '2rem',
        'button': '1rem',
        'button-lg': '1.25rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(52, 27, 22, 0.08), 0 1px 4px rgba(52, 27, 22, 0.04)',
        'card-hover': '0 12px 48px rgba(52, 27, 22, 0.12), 0 4px 12px rgba(52, 27, 22, 0.06)',
        'hero': '0 0 0 1px rgba(183, 122, 56, 0.1), 0 24px 64px rgba(52, 27, 22, 0.15)',
        'modal': '0 24px 64px rgba(52, 27, 22, 0.2), 0 8px 24px rgba(52, 27, 22, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'envelope-open': 'envelopeOpen 1.2s ease-out forwards',
        'letter-reveal': 'letterReveal 0.6s ease-out 0.8s forwards',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        envelopeOpen: {
          '0%': { transform: 'rotateX(0deg) translateY(0)', opacity: '1' },
          '50%': { transform: 'rotateX(-90deg) translateY(-20px)', opacity: '1' },
          '100%': { transform: 'rotateX(-180deg) translateY(-40px)', opacity: '0' },
        },
        letterReveal: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}