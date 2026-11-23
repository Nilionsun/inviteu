-- Storage buckets and policies for InviteAura
-- Run after initial_schema.sql

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create bucket for event media (hero images, gallery, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'event-media',
    'event-media',
    TRUE,
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for invitation assets (logos, custom backgrounds, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'invitation-assets',
    'invitation-assets',
    TRUE,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Enable RLS on storage.objects (already enabled by default)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- EVENT-MEDIA BUCKET POLICIES
-- ============================================

-- Public: can read all files in event-media (public bucket)
CREATE POLICY "event_media_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'event-media');

-- Authenticated users: can upload to event-media if they own the event
CREATE POLICY "event_media_upload_own" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'event-media'
        AND auth.uid() IS NOT NULL
        AND (
            -- Check if user owns the event (path format: event-id/filename)
            (storage.foldername(name))[1] IN (
                SELECT id::text FROM public.events WHERE host_id = auth.uid()
            )
        )
    );

-- Authenticated users: can update their own uploads
CREATE POLICY "event_media_update_own" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'event-media'
        AND auth.uid() IS NOT NULL
        AND owner = auth.uid()
    );

-- Authenticated users: can delete their own uploads
CREATE POLICY "event_media_delete_own" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'event-media'
        AND auth.uid() IS NOT NULL
        AND owner = auth.uid()
    );

-- Admins: full access to event-media
CREATE POLICY "event_media_admin_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'event-media'
        AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- INVITATION-ASSETS BUCKET POLICIES
-- ============================================

-- Public: can read all files in invitation-assets (public bucket)
CREATE POLICY "invitation_assets_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'invitation-assets');

-- Authenticated users: can upload to invitation-assets if they own the event
CREATE POLICY "invitation_assets_upload_own" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'invitation-assets'
        AND auth.uid() IS NOT NULL
        AND (
            (storage.foldername(name))[1] IN (
                SELECT id::text FROM public.events WHERE host_id = auth.uid()
            )
        )
    );

-- Authenticated users: can update their own uploads
CREATE POLICY "invitation_assets_update_own" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'invitation-assets'
        AND auth.uid() IS NOT NULL
        AND owner = auth.uid()
    );

-- Authenticated users: can delete their own uploads
CREATE POLICY "invitation_assets_delete_own" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'invitation-assets'
        AND auth.uid() IS NOT NULL
        AND owner = auth.uid()
    );

-- Admins: full access to invitation-assets
CREATE POLICY "invitation_assets_admin_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'invitation-assets'
        AND EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get event ID from storage path
-- Path format: event-id/filename
CREATE OR REPLACE FUNCTION public.get_event_id_from_path(path TEXT)
RETURNS UUID AS $$
DECLARE
    event_id TEXT;
BEGIN
    event_id := (storage.foldername(path))[1];
    RETURN event_id::uuid;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns event from storage path
CREATE OR REPLACE FUNCTION public.user_owns_event_from_path(path TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    event_id UUID;
BEGIN
    event_id := public.get_event_id_from_path(path);
    IF event_id IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.events
        WHERE id = event_id AND host_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;