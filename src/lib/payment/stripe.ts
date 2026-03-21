import Stripe from 'stripe'
import type { PaymentAdapter, PaymentCheckout } from './types'

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key)
}

function mapStatus(status: string): PaymentCheckout['status'] {
  switch (status) {
    case 'complete':
      return 'completed'
    case 'expired':
      return 'cancelled'
    case 'open':
      return 'pending'
    default:
      return 'pending'
  }
}

export const stripeAdapter: PaymentAdapter = {
  async createCheckout({ amount, currency, description, successUrl, cancelUrl, metadata }) {
    const stripe = getStripeClient()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata ?? {},
    })

    return {
      id: session.id,
      url: session.url ?? '',
      amount,
      currency,
      status: 'pending' as const,
    }
  },

  async verifyWebhook({ body, signature }) {
    const stripe = getStripeClient()
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set')

    const event = stripe.webhooks.constructEvent(body, signature, secret)

    const eventMap: Record<string, string> = {
      'checkout.session.completed': 'payment.succeeded',
      'checkout.session.expired': 'payment.failed',
      'payment_intent.payment_failed': 'payment.failed',
    }

    return {
      event: eventMap[event.type] ?? event.type,
      data: event.data.object as unknown as Record<string, unknown>,
    }
  },

  async getPaymentStatus(id) {
    const stripe = getStripeClient()
    const session = await stripe.checkout.sessions.retrieve(id)

    return {
      id: session.id,
      url: session.url ?? '',
      amount: (session.amount_total ?? 0) / 100,
      currency: session.currency ?? 'usd',
      status: mapStatus(session.status ?? 'open'),
    }
  },
}
