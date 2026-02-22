import { NextRequest, NextResponse } from 'next/server'
import { getPayment } from '@/lib/payment'

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_FEATURE_PAYMENT !== 'true') {
    return NextResponse.json({ error: 'Payment module disabled' }, { status: 404 })
  }

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') ||
      request.headers.get('x-webhook-signature') || ''

    const payment = await getPayment()
    const event = await payment.verifyWebhook({ body, signature })

    // Handle events based on type
    switch (event.event) {
      case 'payment.succeeded':
        // TODO: handle successful payment
        break
      case 'payment.failed':
        // TODO: handle failed payment
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    )
  }
}
