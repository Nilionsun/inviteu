import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// RSVP validation schema
const rsvpSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().optional().refine((val) => !val || /^[\+]?[\d\s\-\(\)]{10,}$/.test(val), {
    message: 'Invalid phone number format',
  }),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  attendance: z.enum(['accepted', 'declined']),
  numberOfGuests: z.number().int().min(1).max(10),
  guestNames: z.string().optional(),
  dietaryPreferences: z.string().optional(),
  message: z.string().optional(),
  // Honeypot field for spam prevention
  website: z.string().optional(),
})

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()

    // Honeypot check - if website field is filled, it's likely a bot
    if (body.website && body.website.trim() !== '') {
      return NextResponse.json(
        { message: 'Spam detected' },
        { status: 400 }
      )
    }

    // Validate input
    const validationResult = rsvpSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(`rsvp:${ip}`)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Verify event exists, is published, and RSVP is enabled and not past deadline
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, rsvp_deadline')
      .eq('id', data.eventId)
      .eq('is_published', true)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { message: 'Event not found or not published' },
        { status: 404 }
      )
    }

    // Check RSVP deadline
    const deadline = new Date(event.rsvp_deadline)
    const now = new Date()
    if (now > deadline) {
      return NextResponse.json(
        { message: 'RSVP deadline has passed' },
        { status: 400 }
      )
    }

    // Check if event settings allow RSVP
    const { data: settings, error: settingsError } = await supabase
      .from('event_settings')
      .select('is_rsvp_enabled')
      .eq('event_id', data.eventId)
      .single()

    if (settingsError || !settings?.is_rsvp_enabled) {
      return NextResponse.json(
        { message: 'RSVP is not enabled for this event' },
        { status: 400 }
      )
    }

    // Insert RSVP
    const { data: rsvp, error: rsvpError } = await supabase
      .from('rsvps')
      .insert({
        event_id: data.eventId,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        attendance: data.attendance,
        number_of_guests: data.numberOfGuests,
        guest_names: data.guestNames || null,
        dietary_preferences: data.dietaryPreferences || null,
        message: data.message || null,
        status: 'confirmed',
      })
      .select()
      .single()

    if (rsvpError) {
      console.error('RSVP insert error:', rsvpError)
      return NextResponse.json(
        { message: 'Failed to submit RSVP' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'RSVP submitted successfully', rsvp },
      { status: 201 }
    )
  } catch (error) {
    console.error('RSVP API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}