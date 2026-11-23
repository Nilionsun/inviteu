-- Initial schema migration for InviteAura
-- Creates all tables with proper constraints, indexes, and RLS policies

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: profiles (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for profile lookups
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: events
-- ============================================
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Wedding Ceremony',
    description TEXT,
    couple_name_1 TEXT NOT NULL,
    couple_name_2 TEXT NOT NULL,
    event_type TEXT NOT NULL DEFAULT 'wedding' CHECK (event_type IN (
        'wedding', 'engagement', 'birthday', 'anniversary',
        'baby-shower', 'housewarming', 'religious', 'corporate', 'party', 'other'
    )),
    date DATE NOT NULL,
    time TIME NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    venue_coordinates JSONB,
    google_maps_url TEXT,
    important_info TEXT,
    rsvp_deadline DATE NOT NULL,
    max_guests_per_rsvp INTEGER NOT NULL DEFAULT 4,
    hero_image TEXT,
    cover_image TEXT,
    hero_image_position TEXT NOT NULL DEFAULT 'center' CHECK (hero_image_position IN ('left', 'center', 'right')),
    theme JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for events
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_host_id ON public.events(host_id);
CREATE INDEX idx_events_is_published ON public.events(is_published);
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_created_at ON public.events(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: event_functions
-- ============================================
CREATE TABLE public.event_functions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    is_main_event BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_event_functions_event_id ON public.event_functions(event_id);
CREATE INDEX idx_event_functions_date ON public.event_functions(date);
CREATE INDEX idx_event_functions_order ON public.event_functions(event_id, display_order);

-- Trigger for updated_at
CREATE TRIGGER trigger_event_functions_updated_at
    BEFORE UPDATE ON public.event_functions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: gallery_items
-- ============================================
CREATE TABLE public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'gif')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    width INTEGER,
    height INTEGER,
    duration INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_gallery_items_event_id ON public.gallery_items(event_id);
CREATE INDEX idx_gallery_items_order ON public.gallery_items(event_id, display_order);

-- Trigger for updated_at
CREATE TRIGGER trigger_gallery_items_updated_at
    BEFORE UPDATE ON public.gallery_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: guests
-- ============================================
CREATE TABLE public.guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    max_guests INTEGER NOT NULL DEFAULT 1,
    invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rsvp_status TEXT CHECK (rsvp_status IN ('pending', 'accepted', 'declined')),
    rsvp_id UUID REFERENCES public.rsvps(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_guests_event_id ON public.guests(event_id);
CREATE INDEX idx_guests_email ON public.guests(email);
CREATE INDEX idx_guests_phone ON public.guests(phone);
CREATE INDEX idx_guests_rsvp_status ON public.guests(rsvp_status);

-- Trigger for updated_at
CREATE TRIGGER trigger_guests_updated_at
    BEFORE UPDATE ON public.guests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: rsvps
-- ============================================
CREATE TABLE public.rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    attendance TEXT NOT NULL CHECK (attendance IN ('accepted', 'declined')),
    number_of_guests INTEGER NOT NULL DEFAULT 1,
    guest_names TEXT,
    dietary_preferences TEXT,
    message TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_rsvps_event_id ON public.rsvps(event_id);
CREATE INDEX idx_rsvps_guest_id ON public.rsvps(guest_id);
CREATE INDEX idx_rsvps_attendance ON public.rsvps(attendance);
CREATE INDEX idx_rsvps_submitted_at ON public.rsvps(submitted_at DESC);

-- Trigger for updated_at
CREATE TRIGGER trigger_rsvps_updated_at
    BEFORE UPDATE ON public.rsvps
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: blessings
-- ============================================
CREATE TABLE public.blessings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    message TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blessings_event_id ON public.blessings(event_id);
CREATE INDEX idx_blessings_is_approved ON public.blessings(is_approved);
CREATE INDEX idx_blessings_submitted_at ON public.blessings(submitted_at DESC);

-- Trigger for updated_at
CREATE TRIGGER trigger_blessings_updated_at
    BEFORE UPDATE ON public.blessings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: contributions
-- ============================================
CREATE TABLE public.contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    message TEXT,
    payment_id TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT CHECK (payment_method IN ('upi', 'card', 'netbanking', 'wallet')),
    upi_transaction_id TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contributions_event_id ON public.contributions(event_id);
CREATE INDEX idx_contributions_payment_status ON public.contributions(payment_status);
CREATE INDEX idx_contributions_razorpay_order_id ON public.contributions(razorpay_order_id);
CREATE INDEX idx_contributions_created_at ON public.contributions(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER trigger_contributions_updated_at
    BEFORE UPDATE ON public.contributions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: payment_transactions
-- ============================================
CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    contribution_id UUID REFERENCES public.contributions(id) ON DELETE SET NULL,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount INTEGER NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'refunded')),
    method TEXT,
    error_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payment_transactions_event_id ON public.payment_transactions(event_id);
CREATE INDEX idx_payment_transactions_contribution_id ON public.payment_transactions(contribution_id);
CREATE INDEX idx_payment_transactions_razorpay_order_id ON public.payment_transactions(razorpay_order_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);

-- Trigger for updated_at
CREATE TRIGGER trigger_payment_transactions_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: event_settings
-- ============================================
CREATE TABLE public.event_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
    upi_id TEXT,
    upi_qr_code TEXT,
    razorpay_key_id TEXT,
    razorpay_key_secret TEXT,
    is_contributions_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    is_rsvp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    is_blessings_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    is_gallery_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    contribution_amounts INTEGER[] NOT NULL DEFAULT ARRAY[501, 1001, 2101, 5001, 11001],
    allow_custom_amount BOOLEAN NOT NULL DEFAULT TRUE,
    custom_domain TEXT,
    seo_title TEXT,
    seo_description TEXT,
    og_image TEXT,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    footer_text TEXT,
    footer_date_location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER trigger_event_settings_updated_at
    BEFORE UPDATE ON public.event_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blessings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
-- Users can view their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "profiles_select_admin" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- Admins can update all profiles
CREATE POLICY "profiles_update_admin" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- EVENTS POLICIES
-- ============================================
-- Public: can read published events by slug
CREATE POLICY "events_select_published" ON public.events
    FOR SELECT USING (
        is_published = TRUE
    );

-- Event owners: can CRUD their own events
CREATE POLICY "events_select_own" ON public.events
    FOR SELECT USING (auth.uid() = host_id);

CREATE POLICY "events_insert_own" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "events_update_own" ON public.events
    FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "events_delete_own" ON public.events
    FOR DELETE USING (auth.uid() = host_id);

-- Admins: can CRUD all events
CREATE POLICY "events_select_admin" ON public.events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "events_insert_admin" ON public.events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "events_update_admin" ON public.events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "events_delete_admin" ON public.events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- EVENT_FUNCTIONS POLICIES
-- ============================================
-- Public: can read functions for published events
CREATE POLICY "event_functions_select_published" ON public.event_functions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_functions.event_id
            AND e.is_published = TRUE
        )
    );

-- Event owners: can CRUD their event functions
CREATE POLICY "event_functions_select_own" ON public.event_functions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_functions.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "event_functions_insert_own" ON public.event_functions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_functions.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "event_functions_update_own" ON public.event_functions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_functions.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "event_functions_delete_own" ON public.event_functions
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_functions.event_id
            AND e.host_id = auth.uid()
        )
    );

-- Admins: can CRUD all
CREATE POLICY "event_functions_select_admin" ON public.event_functions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "event_functions_all_admin" ON public.event_functions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- GALLERY_ITEMS POLICIES
-- ============================================
-- Public: can read gallery for published events
CREATE POLICY "gallery_items_select_published" ON public.gallery_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = gallery_items.event_id
            AND e.is_published = TRUE
        )
    );

-- Event owners: can CRUD their gallery
CREATE POLICY "gallery_items_select_own" ON public.gallery_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = gallery_items.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "gallery_items_insert_own" ON public.gallery_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = gallery_items.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "gallery_items_update_own" ON public.gallery_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = gallery_items.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "gallery_items_delete_own" ON public.gallery_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = gallery_items.event_id
            AND e.host_id = auth.uid()
        )
    );

-- Admins: can CRUD all
CREATE POLICY "gallery_items_all_admin" ON public.gallery_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- GUESTS POLICIES
-- ============================================
-- Event owners: can CRUD their guests
CREATE POLICY "guests_select_own" ON public.guests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = guests.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "guests_insert_own" ON public.guests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = guests.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "guests_update_own" ON public.guests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = guests.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "guests_delete_own" ON public.guests
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = guests.event_id
            AND e.host_id = auth.uid()
        )
    );

-- Admins: can CRUD all
CREATE POLICY "guests_all_admin" ON public.guests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- RSVP POLICIES
-- ============================================
-- Public: can INSERT RSVP for published events with RSVP enabled
CREATE POLICY "rsvps_insert_public" ON public.rsvps
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.event_settings es ON es.event_id = e.id
            WHERE e.id = rsvps.event_id
            AND e.is_published = TRUE
            AND es.is_rsvp_enabled = TRUE
            AND e.rsvp_deadline >= CURRENT_DATE
        )
    );

-- Public: can SELECT their own RSVP (by email/phone match)
CREATE POLICY "rsvps_select_own" ON public.rsvps
    FOR SELECT USING (
        (auth.uid() IS NULL AND email = CURRENT_SETTING('request.jwt.claims', TRUE)::json->>'email')
        OR (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    );

-- Event owners: can read all RSVPs for their events
CREATE POLICY "rsvps_select_own" ON public.rsvps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = rsvps.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "rsvps_update_own" ON public.rsvps
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = rsvps.event_id
            AND e.host_id = auth.uid()
        )
    );

-- Admins: can CRUD all
CREATE POLICY "rsvps_all_admin" ON public.rsvps
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- BLESSINGS POLICIES
-- ============================================
-- Public: can INSERT blessing for published events with blessings enabled
CREATE POLICY "blessings_insert_public" ON public.blessings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.event_settings es ON es.event_id = e.id
            WHERE e.id = blessings.event_id
            AND e.is_published = TRUE
            AND es.is_blessings_enabled = TRUE
        )
    );

-- Public: can read approved blessings for published events
CREATE POLICY "blessings_select_approved" ON public.blessings
    FOR SELECT USING (
        is_approved = TRUE
        AND EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = blessings.event_id
            AND e.is_published = TRUE
        )
    );

-- Event owners: can read all blessings for their events
CREATE POLICY "blessings_select_own" ON public.blessings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = blessings.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "blessings_update_own" ON public.blessings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = blessings.event_id
            AND e.host_id = auth.uid()
        )
    );

-- Admins: can CRUD all
CREATE POLICY "blessings_all_admin" ON public.blessings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- CONTRIBUTIONS POLICIES
-- ============================================
-- Public: can INSERT contribution for published events with contributions enabled
CREATE POLICY "contributions_insert_public" ON public.contributions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.event_settings es ON es.event_id = e.id
            WHERE e.id = contributions.event_id
            AND e.is_published = TRUE
            AND es.is_contributions_enabled = TRUE
        )
    );

-- Public: can read completed contributions for published events (aggregated only)
CREATE POLICY "contributions_select_completed" ON public.contributions
    FOR SELECT USING (
        payment_status = 'completed'
        AND EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = contributions.event_id
            AND e.is_published = TRUE
        )
    );

-- Event owners: can read all contributions for their events
CREATE POLICY "contributions_select_own" ON public.contributions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = contributions.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "contributions_update_own" ON public.contributions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = contributions.event_id
            AND e.host_id = auth.uid()
        )
    );

-- Admins: can CRUD all
CREATE POLICY "contributions_all_admin" ON public.contributions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- PAYMENT_TRANSACTIONS POLICIES
-- ============================================
-- Event owners: can read payment transactions for their events
CREATE POLICY "payment_transactions_select_own" ON public.payment_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = payment_transactions.event_id
            AND e.host_id = auth.uid()
        )
    );

-- Admins: can CRUD all
CREATE POLICY "payment_transactions_all_admin" ON public.payment_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- EVENT_SETTINGS POLICIES
-- ============================================
-- Event owners: can CRUD their event settings
CREATE POLICY "event_settings_select_own" ON public.event_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_settings.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "event_settings_insert_own" ON public.event_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_settings.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "event_settings_update_own" ON public.event_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_settings.event_id
            AND e.host_id = auth.uid()
        )
    );

CREATE POLICY "event_settings_delete_own" ON public.event_settings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_settings.event_id
            AND e.host_id = auth.uid()
        )
    );

-- Admins: can CRUD all
CREATE POLICY "event_settings_all_admin" ON public.event_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- Public: can read settings for published events (for UPI ID, etc.)
CREATE POLICY "event_settings_select_published" ON public.event_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_settings.event_id
            AND e.is_published = TRUE
        )
    );