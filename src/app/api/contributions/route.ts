import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import crypto from 'crypto'

// Contributions validation schema
const contributionSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  contributorName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  contributorPhone: z.string().refine((val) => /^[\+]?[\d\s\-\(\)]{10,}$/.test(val), {
    message: 'Valid phone number is required',
  }),
  contributorEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  amount: z.number().int().min(1, 'Amount must be at least 1'),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  paymentMethod: z.enum(['upi', 'card', 'netbanking']),
  upiId: z.string().optional(),
  // Honeypot field for spam prevention
  website: z.string().optional(),
})

// Rate limiting storage
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

function generateOrderId(): string {
  return `order_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
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

    const validationResult = contributionSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(`contributions:${ip}`)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const supabase = await createClient()

    // Verify event exists, is published, and contributions are enabled
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
      .select('is_contributions_enabled, upi_id, razorpay_key_id, razorpay_key_secret')
      .eq('event_id', data.eventId)
      .single()

    if (settingsError || !settings?.is_contributions_enabled) {
      return NextResponse.json(
        { message: 'Contributions are not enabled for this event' },
        { status: 400 }
      )
    }

    // Validate amount against configured contribution amounts (if not custom)
    // For now, we'll allow any amount since allow_custom_amount might be true

    // Create contribution record with pending status
    const orderId = generateOrderId()
    const { data: contribution, error: contributionError } = await supabase
      .from('contributions')
      .insert({
        event_id: data.eventId,
        guest_name: data.isAnonymous ? 'Anonymous' : data.contributorName,
        amount: data.amount,
        currency: 'INR',
        message: data.message || null,
        payment_id: orderId,
        payment_status: 'pending',
        payment_method: data.paymentMethod,
      })
      .select()
      .single()

    if (contributionError) {
      console.error('Contribution insert error:', contributionError)
      return NextResponse.json(
        { message: 'Failed to create contribution' },
        { status: 500 }
      )
    }

    // Also create payment transaction record
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        event_id: data.eventId,
        contribution_id: contribution.id,
        razorpay_order_id: orderId,
        amount: data.amount,
        currency: 'INR',
        status: 'created',
        method: data.paymentMethod,
      })

    if (transactionError) {
      console.error('Payment transaction insert error:', transactionError)
    }

    let paymentUrl: string | undefined

    // Handle different payment methods
    if (data.paymentMethod === 'upi') {
      // UPI payment - construct UPI deep link
      const upiId = data.upiId || settings.upi_id
      if (upiId) {
        const upiParams = new URLSearchParams({
          pa: upiId, // Payee address (UPI ID)
          pn: event.id, // Payee name (event ID as reference)
          am: data.amount.toString(), // Amount
          cu: 'INR', // Currency
          tn: `Contribution for ${contribution.guest_name}`, // Transaction note
          tr: orderId, // Transaction reference
        })
        paymentUrl = `upi://pay?${upiParams.toString()}`
      }
    } else if (data.paymentMethod === 'card' || data.paymentMethod === 'netbanking') {
      // Razorpay integration
      if (settings.razorpay_key_id && settings.razorpay_key_secret) {
        try {
          // In production, create Razorpay order server-side
          // For now, we'll return the order ID for client-side Razorpay integration
          paymentUrl = `/api/payment/razorpay?orderId=${orderId}&amount=${data.amount}&eventId=${data.eventId}`
        } catch (razorpayError) {
          console.error('Razorpay order creation error:', razorpayError)
        }
      }
    }

    return NextResponse.json(
      {
        message: 'Contribution initiated successfully',
        contribution: {
          id: contribution.id,
          amount: contribution.amount,
          paymentStatus: contribution.payment_status,
          paymentMethod: contribution.payment_method,
        },
        paymentUrl,
        orderId,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contributions API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}