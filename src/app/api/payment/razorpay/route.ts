import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Razorpay order creation endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const amount = searchParams.get('amount')
    const eventId = searchParams.get('eventId')

    if (!orderId || !amount || !eventId) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get event settings with Razorpay credentials
    const { data: settings, error: settingsError } = await supabase
      .from('event_settings')
      .select('razorpay_key_id, razorpay_key_secret')
      .eq('event_id', eventId)
      .single()

    if (settingsError || !settings?.razorpay_key_id || !settings?.razorpay_key_secret) {
      return NextResponse.json(
        { message: 'Razorpay not configured for this event' },
        { status: 400 }
      )
    }

    // Verify contribution exists and is pending
    const { data: contribution, error: contribError } = await supabase
      .from('contributions')
      .select('id, payment_status, payment_id')
      .eq('event_id', eventId)
      .eq('payment_id', orderId)
      .single()

    if (contribError || !contribution) {
      return NextResponse.json(
        { message: 'Contribution not found' },
        { status: 404 }
      )
    }

    if (contribution.payment_status !== 'pending') {
      return NextResponse.json(
        { message: 'Contribution already processed' },
        { status: 400 }
      )
    }

    // Return Razorpay order details for client-side integration
    // In production, you would create the order via Razorpay API here
    return NextResponse.json({
      orderId,
      amount: parseInt(amount),
      currency: 'INR',
      keyId: settings.razorpay_key_id,
      eventId,
      contributionId: contribution.id,
    })
  } catch (error) {
    console.error('Razorpay order API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Razorpay payment verification endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !eventId) {
      return NextResponse.json(
        { message: 'Missing required verification parameters' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get Razorpay secret for signature verification
    const { data: settings, error: settingsError } = await supabase
      .from('event_settings')
      .select('razorpay_key_secret')
      .eq('event_id', eventId)
      .single()

    if (settingsError || !settings?.razorpay_key_secret) {
      return NextResponse.json(
        { message: 'Razorpay not configured' },
        { status: 400 }
      )
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', settings.razorpay_key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      console.error('Razorpay signature verification failed')

      // Update transaction as failed
      await supabase
        .from('payment_transactions')
        .update({ status: 'failed', error_description: 'Signature verification failed' })
        .eq('razorpay_order_id', razorpay_order_id)

      return NextResponse.json(
        { message: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Update contribution and transaction as completed
    const { data: contribution, error: contribError } = await supabase
      .from('contributions')
      .update({
        payment_status: 'completed',
        payment_method: 'card',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        completed_at: new Date().toISOString(),
      })
      .eq('payment_id', razorpay_order_id)
      .select()
      .single()

    if (contribError) {
      console.error('Contribution update error:', contribError)
    }

    await supabase
      .from('payment_transactions')
      .update({
        status: 'paid',
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq('razorpay_order_id', razorpay_order_id)

    return NextResponse.json({
      message: 'Payment verified successfully',
      contribution,
    })
  } catch (error) {
    console.error('Razorpay verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}