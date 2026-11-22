# InviteAura - Premium Digital Wedding Invitations

## Overview
InviteAura is a premium digital wedding invitation web application designed for Indian weddings. Built with Next.js 14, TypeScript, and Tailwind CSS, it offers a complete solution for wedding invitation management including RSVP, blessings, contributions, gallery, and host admin dashboard.

## Features

### For Couples/Guests
- **Beautiful Invitation Pages**: Premium-designed wedding invitation pages with Indian wedding aesthetics
- **RSVP System**: Respond to invitations with attendance status
- **Blessings**: Leave messages and well-wishes for the couple
- **Contributions**: monetary contributions (₹) via Razorpay integration
- **Gallery**: Wedding photo gallery viewing

### For Admin/Host
- **Authentication**: Supabase Auth for admin panel access
- **Event Management**: Create, edit, duplicate, and delete wedding events
- **RSVP Management**: View and manage guest RSVPs
- **Blessings View**: Read all blessing messages
- **Contributions Dashboard**: Track monetary contributions with Razorpay integration
- **Gallery Management**: Upload and manage wedding photos
- **Settings**: Admin configuration and options

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3 with custom design system
- **Animations**: Framer Motion for scroll-triggered animations
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Razorpay integration
- **Deployment**: Vercel

## Design System

### Colors
- **Primary Gold**: `#B77A38` (primary-gold, primary-gold-dark)
- **Primary Cream**: `#F5E8E0` (primary-cream, surface-cream)
- **Text Primary**: `#1A1A1A`
- **Text Secondary**: `#6B7280`
- **Border Gold**: `#B77A38` with varying opacity

### Typography
- **Display**: Cormorant Garamond (font-display)
- **Headings**: Playfair Display
- **Body**: Inter

### Breakpoints
- Mobile-first: `sm`, `md`, `lg`, `xl`, `2xl`

## Available Scripts

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── admin/              # Admin panel
│   │   ├── dashboard/      # Dashboard page
│   │   ├── events/         # Events management page
│   │   ├── login/          # Admin login page
│   │   ├── gallery/        # Gallery management
│   │   ├── blessings/      # Blessings view
│   │   ├── contributions/  # Contributions view
│   │   └── settings/       # Admin settings
│   └── [slug]/             # Dynamic invitation pages
├── components/             # React components
│   ├── ui/                 # UI primitives (Button, Input, Select, Card, Modal)
│   └── invitation/         # Invitation-specific components
├── lib/                    # Utility functions
│   ├── utils.ts            # formatDate, formatCurrency, cn
│   └── supabase.ts         # Supabase client
└── types/                  # TypeScript type definitions
```

## Configuration Files

- `tailwind.config.js` - Tailwind CSS with custom design system
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js settings
- `package.json` - Dependencies and scripts

## Supabase Integration

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-ref
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_vQRqXnG2DnLHAmxA_-3t9A_fWS_KFP5
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Tables

Run the SQL in Supabase SQL editor to create required tables:

```sql
-- Events table
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  couple_name_1 text not null,
  couple_name_2 text not null,
  event_title text not null,
  date text not null,
  time text not null,
  venue_name text not null,
  venue_address text not null,
  status text default 'draft',
  rsvp_count integer default 0,
  blessing_count integer default 0,
  contribution_count integer default 0,
  total_contributions decimal default 0,
  slug text unique not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- RSVPs table
create table if not exists rsvps (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade,
  name text not null,
  email text,
  accepted boolean default false,
  created_at timestamp default now()
);

-- Blessings table
create table if not exists blessings (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade,
  name text not null,
  message text,
  created_at timestamp default now()
);

-- Contributions table
create table if not exists contributions (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade,
  name text not null,
  amount integer not null,
  currency text default 'INR',
  created_at timestamp default now()
);
```

## Vercel Deployment

### Quick Deploy

1. **Connect GitHub Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import from GitHub: `Nilionsun/Invite-aura`
   - Framework: Next.js (auto-detected)

2. **Environment Variables**:
   In Vercel Dashboard → Project Settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-ref
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_vQRqXnG2DnLHAmxA_-3t9A_fWS_KFP5
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Deploy**:
   - Click "Deploy"
   - Site will be available at `https://invite-aura.vercel.app`

### Vercel CLI Deployment

```bash
# Install
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production
vercel --prod
```

## License

This project is licensed under the MIT License.

## Acknowledgements

- Design inspiration from Indian wedding traditions
- Built with Claude Code assistance
- Icons from Lucide React
- Fonts: Cormorant Garamond, Playfair Display from Google Fonts