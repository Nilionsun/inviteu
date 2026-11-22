export interface Event {
  id: string;
  slug: string;
  hostId: string;
  title: string;
  description: string;
  coupleName1: string;
  coupleName2: string;
  eventType: 'wedding' | 'engagement' | 'birthday' | 'anniversary' | 'baby-shower' | 'housewarming' | 'religious' | 'corporate' | 'party' | 'other';
  date: string;
  time: string;
  timezone: string;
  venueName: string;
  venueAddress: string;
  venueCoordinates?: { lat: number; lng: number };
  googleMapsUrl?: string;
  importantInfo: string;
  rsvpDeadline: string;
  maxGuestsPerRsvp: number;
  heroImage: string;
  coverImage: string;
  heroImagePosition: 'left' | 'center' | 'right';
  theme: EventTheme;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventTheme {
  primaryBackground: string;
  cream: string;
  blush: string;
  gold: string;
  goldLight: string;
  goldDark: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  fontSerif: string;
  fontScript: string;
  fontSans: string;
}

export interface EventFunction {
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
}

export interface GalleryItem {
  id: string;
  eventId: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnailUrl?: string;
  caption: string;
  altText: string;
  order: number;
  width?: number;
  height?: number;
  duration?: number;
  createdAt: string;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  phone?: string;
  email?: string;
  maxGuests: number;
  invitedAt: string;
  rsvpStatus?: 'pending' | 'accepted' | 'declined';
  rsvpId?: string;
}

export interface RSVPResponse {
  id: string;
  eventId: string;
  guestId?: string;
  name: string;
  phone?: string;
  email?: string;
  attendance: 'accepted' | 'declined';
  numberOfGuests: number;
  guestNames?: string;
  dietaryPreferences?: string;
  message?: string;
  submittedAt: string;
  status: 'confirmed' | 'pending';
}

export interface Blessing {
  id: string;
  eventId: string;
  guestName: string;
  message: string;
  isAnonymous: boolean;
  submittedAt: string;
  isApproved: boolean;
}

export interface Contribution {
  id: string;
  eventId: string;
  guestName: string;
  amount: number;
  currency: string;
  message?: string;
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: 'upi' | 'card' | 'netbanking' | 'wallet';
  upiTransactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  eventId: string;
  contributionId?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'failed' | 'refunded';
  method?: string;
  errorDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventSettings {
  id: string;
  eventId: string;
  upiId?: string;
  upiQrCode?: string;
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  isContributionsEnabled: boolean;
  isRsvpEnabled: boolean;
  isBlessingsEnabled: boolean;
  isGalleryEnabled: boolean;
  contributionAmounts: number[];
  allowCustomAmount: boolean;
  customDomain?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  socialLinks: SocialLinks;
  footerText: string;
  footerDateLocation: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  whatsapp?: string;
  email?: string;
}

export interface HostProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationPreviewData {
  event: Event;
  functions: EventFunction[];
  gallery: GalleryItem[];
  settings: EventSettings;
  host: HostProfile;
}

export const DEFAULT_THEME: EventTheme = {
  primaryBackground: '#FFF8F1',
  cream: '#F9E9D9',
  blush: '#F7D6D0',
  gold: '#B77A38',
  goldLight: '#D4A574',
  goldDark: '#9B642C',
  textPrimary: '#341B16',
  textSecondary: '#4A251C',
  textMuted: '#6B4A3D',
  fontSerif: 'Cormorant Garamond, Georgia, serif',
  fontScript: 'Great Vibes, cursive',
  fontSans: 'Inter, system-ui, sans-serif',
};

export const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'engagement', label: 'Engagement', icon: '💍' },
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '🥂' },
  { value: 'baby-shower', label: 'Baby Shower', icon: '👶' },
  { value: 'housewarming', label: 'Housewarming', icon: '🏠' },
  { value: 'religious', label: 'Religious Event', icon: '🕉️' },
  { value: 'corporate', label: 'Corporate Event', icon: '🏢' },
  { value: 'party', label: 'Private Party', icon: '🎉' },
  { value: 'other', label: 'Other Celebration', icon: '✨' },
] as const;

export type EventType = typeof EVENT_TYPES[number]['value'];

export const CONTRIBUTION_PRESETS = [501, 1001, 2101, 5001, 11001] as const;