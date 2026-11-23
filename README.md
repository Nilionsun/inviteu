# InviteAura - Indian Wedding Invitation Platform

A production-ready event invitation website focused on Indian weddings, built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Public Guest-Facing Pages**: Dynamic routing by slug (`/[slug]`) with beautiful invitation layouts
- **Secure Admin Dashboard**: Complete event management with Supabase Auth and Row Level Security (RLS)
- **Multi-Function Events**: Support for multiple ceremonies (Mehndi, Sangeet, Wedding, Reception, etc.)
- **RSVP System**: Guest responses with dietary preferences and guest counts
- **Blessings/Wishes**: Guest messages with admin moderation
- **Contributions**: UPI and Razorpay integration for monetary gifts
- **Photo/Video Gallery**: Carousel with lightbox viewer
- **Social Sharing**: QR codes, WhatsApp, Facebook, Twitter, Email, SMS
- **SEO & OG Tags**: Dynamic meta tags per event for social sharing

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: @supabase/ssr for SSR auth with cookies
- **Storage**: Supabase Storage for media
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Project Structure

```
inviteaura/
├── src/
│   ├── app/
│   │   ├── [slug]/                 # Public invitation page
│   │   │   ├── page.tsx            # Server component (data fetching + SEO)
│   │   │   └── InvitationClient.tsx # Client component (UI + interactions)
│   │   ├── admin/
│   │   │   ├── login/page.tsx      # Admin login
│   │   │   ├── layout.tsx          # Server layout (auth check)
│   │   │   ├── AdminLayoutClient.tsx # Client layout (sidebar, nav)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx        # Server component (stats)
│   │   │   │   └── AdminDashboardClient.tsx
│   │   │   └── events/
│   │   │       ├── page.tsx        # Server component (events list)
│   │   │       └── AdminEventsClient.tsx # Full CRUD for events
│   │   └── api/
│   │       ├── rsvp/route.ts       # RSVP submissions
│   │       ├── blessings/route.ts  # Blessings submissions
│   │       ├── contributions/route.ts # Contributions + payments
│   │       └── payment/razorpay/   # Razorpay integration
│   ├── components/
│   │   ├── invitation/             # Guest-facing components
│   │   │   ├── Hero.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── RSVPForm.tsx
│   │   │   ├── BlessingsForm.tsx
│   │   │   ├── ContributionForm.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ShareModal.tsx
│   │   └── ui/                     # Reusable UI components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client (SSR)
│   │   │   └── admin.ts            # Admin utilities
│   │   └── utils.ts                # Helper functions
│   └── middleware.ts               # Session refresh middleware
├── supabase/
│   └── migrations/
│       ├── 20250101000000_initial_schema.sql
│       └── 20250101000001_storage.sql
└── public/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- (Optional) Razorpay account for payments

### 1. Clone and Install

```bash
cd inviteaura
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migrations in order:
   - `supabase/migrations/20250101000000_initial_schema.sql`
   - `supabase/migrations/20250101000001_storage.sql`
3. Go to Authentication > Settings and configure:
   - Enable Email/Password provider
   - Set Site URL to your domain (e.g., `http://localhost:3000` for dev)
   - Add redirect URLs: `http://localhost:3000/**`
4. Go to Storage and create buckets:
   - `event-media` (public)
   - `invitation-assets` (public)

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (keep secret!)

Optional for payments:
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` - Razorpay credentials
- `UPI_ID` - Your UPI ID for direct payments

### 4. Create Admin User

1. Sign up a user through your app at `/admin/login`
2. In Supabase Dashboard > Authentication > Users, find the user
3. Go to Table Editor > `profiles` table and set `role = 'admin'` for that user

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you'll see a 404 until you create an event.

Visit `http://localhost:3000/admin/login` to access the admin dashboard.

## Creating Your First Event

1. Log in to `/admin/login` with your admin account
2. Go to Dashboard > "New Event" or `/admin/events/new`
3. Fill in:
   - **Basic Info**: Couple names, event title, type, slug (URL-friendly)
   - **Date & Time**: Event date, time, timezone
   - **Venue**: Name, address, Google Maps URL
   - **Hero Image**: Upload or provide URL
   - **RSVP Settings**: Deadline, max guests per RSVP
   - **Features**: Enable/disable RSVP, Blessings, Contributions, Gallery
4. Save - the event will be created as a draft
5. Click "Publish" to make it live at `yourdomain.com/[slug]`

## Database Schema

### Key Tables

- **profiles** - Extends auth.users with role (user/admin)
- **events** - Main event data with slug-based routing
- **event_functions** - Multiple ceremonies per event
- **gallery_items** - Photos/videos for gallery
- **guests** - Invited guest list (optional)
- **rsvps** - Guest responses
- **blessings** - Well wishes (require approval)
- **contributions** - Monetary gifts with payment tracking
- **payment_transactions** - Detailed payment records
- **event_settings** - Per-event feature flags and config

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- **Public (anon)**: Read published events, submit RSVP/blessings/contributions
- **Authenticated (user)**: Own profile, own events CRUD
- **Admin**: Full access to all data

## API Routes

### POST /api/rsvp
Submit RSVP response
```json
{
  "eventId": "uuid",
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "attendance": "accepted",
  "numberOfGuests": 2,
  "guestNames": "John, Jane",
  "dietaryPreferences": "Vegetarian",
  "message": "Looking forward to it!"
}
```

### POST /api/blessings
Submit blessing/wish
```json
{
  "eventId": "uuid",
  "senderName": "Jane Doe",
  "message": "Wishing you a lifetime of happiness!",
  "isAnonymous": false,
  "allowPublic": true,
  "blessingType": "text"
}
```

### POST /api/contributions
Initiate contribution
```json
{
  "eventId": "uuid",
  "contributorName": "John Doe",
  "contributorPhone": "+919876543210",
  "amount": 2100,
  "paymentMethod": "upi",
  "upiId": "name@bank"
}
```

Returns `paymentUrl` for UPI deep link or Razorpay order URL.

### GET/POST /api/payment/razorpay
- GET: Get Razorpay order details for client-side checkout
- POST: Verify payment signature and update status

## Deployment to Vercel

1. Push to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - (Optional) Razorpay keys
4. Deploy!

### Post-Deployment

1. Update Supabase Auth settings with your Vercel domain
2. Update Storage CORS if needed
3. Test all flows: RSVP, Blessings, Contributions

## Security Checklist

- ✅ Service role key only in server-side code (never exposed to client)
- ✅ RLS policies on all tables
- ✅ Admin routes protected by server-side role check
- ✅ Rate limiting + honeypot on public API endpoints
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention via Supabase client
- ✅ XSS prevention via React's built-in escaping

## Customization

### Themes
Modify `theme` JSON in events table or extend `src/components/invitation/` components.

### Styling
Tailwind config in `tailwind.config.ts` - colors defined for Indian wedding aesthetic:
- `primary-gold`, `primary-blush`, `primary-cream`, `primary-background`

### Components
All invitation components in `src/components/invitation/` are modular and can be customized independently.

## License

MIT License - feel free to use for your own wedding or client projects!

## Support

For issues or questions, please open a GitHub issue.