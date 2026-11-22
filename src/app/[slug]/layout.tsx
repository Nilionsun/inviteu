import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond, Playfair_Display, Great_Vibes } from 'next/font/google';
import '../../app/globals.css';

export const viewport: Viewport = {
  themeColor: '#341B16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'InviteAura - Premium Digital Wedding Invitations',
    template: '%s | InviteAura',
  },
  description: 'Create beautiful, premium digital wedding invitations with RSVP, blessings, contributions, and gallery features.',
  keywords: ['wedding invitation', 'digital invitation', 'RSVP', 'wedding website', 'Indian wedding'],
  authors: [{ name: 'InviteAura' }],
  creator: 'InviteAura',
  publisher: 'InviteAura',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://inviteaura.com',
    siteName: 'InviteAura',
    title: 'InviteAura - Premium Digital Wedding Invitations',
    description: 'Create beautiful, premium digital wedding invitations with RSVP, blessings, contributions, and gallery features.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'InviteAura - Premium Digital Wedding Invitations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InviteAura - Premium Digital Wedding Invitations',
    description: 'Create beautiful, premium digital wedding invitations with RSVP, blessings, contributions, and gallery features.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
  display: 'swap',
});

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, cormorant.variable, playfair.variable, greatVibes.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="font-sans antialiased text-text-primary bg-primary-background">
        {children}
      </body>
    </html>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}