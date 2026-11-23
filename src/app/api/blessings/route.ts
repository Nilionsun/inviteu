import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Blessings validation schema
const blessingsSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  senderName: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  senderPhone: z.string().optional().refine((val) => !val || /^[\+]?[\d\s\-\(\)]{10,}$/.test(val), {
    message: 'Invalid phone number format',
  }),
  senderEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  message: z.string().min(5, 'Blessing must be at least 5 characters').max(2000),
  isAnonymous: z.boolean().default(false),
  allowPublic: z.boolean().default(false),
  blessingType: z.enum(['text', 'image', 'video']).default('text'),
  mediaUrl: z.string().url('Invalid media URL').optional().or(z.literal('')),
  // Honeypot field for spam prevention
  website: z.string().optional(),
})

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
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
    const body = await request.json()

    // Honeypot check
    if (body.website && body.website.trim() !== '') {
      return NextResponse.json(
        { message: 'Spam detected' },
        { status: 400 }
      )
    }

    const validationResult = blessingsSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(`blessings:${ip}`)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const supabase = await createClient()

    // Verify event exists, is published, and blessings are enabled
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', data.eventId)
      .eq('is_published', true)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { message: 'Event not found or not published' },
        { status: 404 }
      )
    }

    const { data: settings, error: settingsError } = await supabase
      .from('event_settings')
      .select('is_blessings_enabled')
      .eq('event_id', data.eventId)
      .single()

    if (settingsError || !settings?.is_blessings_enabled) {
      return NextResponse.json(
        { message: 'Blessings are not enabled for this event' },
        { status: 400 }
      )
    }

    // Insert blessing
    const { data: blessing, error: blessingError } = await supabase
      .from('blessings')
      .insert({
        event_id: data.eventId,
        guest_name: data.isAnonymous ? 'Anonymous' : (data.senderName || 'Anonymous'),
        message: data.message,
        is_anonymous: data.isAnonymous,
        is_approved: false, // Requires admin approval
      })
      .select()
      .single()

    if (blessingError) {
      console.error('Blessing insert error:', blessingError)
      return NextResponse.json(
        { message: 'Failed to submit blessing' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Blessing submitted successfully. It will appear after approval.', blessing },
      { status: 201 }
    )
  } catch (error) {
    console.error('Blessings API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}