import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import InvitationClient from './InvitationClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('couple_name_1, couple_name_2, event_title, date, venue_name, hero_image, seo_title, seo_description, og_image')
    .eq('slug', resolvedParams.slug)
    .eq('is_published', true)
    .single()

  if (!event) {
    return {
      title: 'Invitation Not Found',
      description: 'The invitation you are looking for does not exist or is not published.',
    }
  }

  return {
    title: event.seo_title || `${event.couple_name_1} & ${event.couple_name_2} - ${event.event_title}`,
    description: event.seo_description || `You're invited to ${event.couple_name_1} & ${event.couple_name_2}'s ${event.event_title} on ${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at ${event.venue_name}.`,
    openGraph: {
      title: event.seo_title || `${event.couple_name_1} & ${event.couple_name_2} - ${event.event_title}`,
      description: event.seo_description || `You're invited to ${event.couple_name_1} & ${event.couple_name_2}'s ${event.event_title}`,
      images: event.og_image || event.hero_image ? [{ url: event.og_image || event.hero_image }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.seo_title || `${event.couple_name_1} & ${event.couple_name_2} - ${event.event_title}`,
      description: event.seo_description || `You're invited to ${event.couple_name_1} & ${event.couple_name_2}'s ${event.event_title}`,
      images: event.og_image || event.hero_image ? [event.og_image || event.hero_image] : [],
    },
  }
}

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Fetch event data
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .eq('is_published', true)
    .single()

  if (eventError || !event) {
    notFound()
  }

  // Fetch event functions
  const { data: functions } = await supabase
    .from('event_functions')
    .select('*')
    .eq('event_id', event.id)
    .order('display_order', { ascending: true })

  // Fetch gallery items
  const { data: gallery } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('event_id', event.id)
    .order('display_order', { ascending: true })

  // Fetch event settings
  const { data: settings } = await supabase
    .from('event_settings')
    .select('*')
    .eq('event_id', event.id)
    .single()

  // Fetch host profile
  const { data: host } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('id', event.host_id)
    .single()

  // Transform data to match client component expectations
  const eventData = {
    event: {
      id: event.id,
      slug: event.slug,
      hostId: event.host_id,
      title: event.title,
      description: event.description || '',
      coupleName1: event.couple_name_1,
      coupleName2: event.couple_name_2,
      eventType: event.event_type,
      date: event.date,
      time: event.time,
      timezone: event.timezone,
      venueName: event.venue_name,
      venueAddress: event.venue_address,
      venueCoordinates: event.venue_coordinates,
      googleMapsUrl: event.google_maps_url,
      importantInfo: event.important_info || '',
      rsvpDeadline: event.rsvp_deadline,
      maxGuestsPerRsvp: event.max_guests_per_rsvp,
      heroImage: event.hero_image || '',
      coverImage: event.cover_image || '',
      heroImagePosition: event.hero_image_position,
      theme: event.theme || {},
      isPublished: event.is_published,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    },
    functions: (functions || []).map(f => ({
      id: f.id,
      eventId: f.event_id,
      title: f.title,
      description: f.description || '',
      date: f.date,
      time: f.time,
      venueName: f.venue_name,
      venueAddress: f.venue_address,
      isMainEvent: f.is_main_event,
      order: f.display_order,
    })),
    gallery: (gallery || []).map(g => ({
      id: g.id,
      eventId: g.event_id,
      type: g.type,
      url: g.url,
      thumbnailUrl: g.thumbnail_url,
      caption: g.caption,
      altText: g.alt_text,
      order: g.display_order,
      width: g.width,
      height: g.height,
      duration: g.duration,
      createdAt: g.created_at,
    })),
    settings: settings ? {
      id: settings.id,
      eventId: settings.event_id,
      upiId: settings.upi_id,
      upiQrCode: settings.upi_qr_code,
      razorpayKeyId: settings.razorpay_key_id,
      razorpayKeySecret: settings.razorpay_key_secret,
      isContributionsEnabled: settings.is_contributions_enabled,
      isRsvpEnabled: settings.is_rsvp_enabled,
      isBlessingsEnabled: settings.is_blessings_enabled,
      isGalleryEnabled: settings.is_gallery_enabled,
      contributionAmounts: settings.contribution_amounts,
      allowCustomAmount: settings.allow_custom_amount,
      customDomain: settings.custom_domain,
      seoTitle: settings.seo_title,
      seoDescription: settings.seo_description,
      ogImage: settings.og_image,
      socialLinks: settings.social_links || {},
      footerText: settings.footer_text || '',
      footerDateLocation: settings.footer_date_location || '',
    } : null,
    host: host ? {
      id: host.id,
      email: '', // Not available in profiles table
      fullName: host.full_name || '',
      avatarUrl: host.avatar_url,
      createdAt: '',
      updatedAt: '',
    } : null,
  }

  return <InvitationClient data={eventData} />
}