import type { PaymentAdapter, PaymentCheckout } from './types'

function getHeaders() {
  const shopId = process.env.YOOKASSA_SHOP_ID
  const secret = process.env.YOOKASSA_SECRET_KEY
  if (!shopId || !secret) throw new Error('YooKassa credentials not set')
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${shopId}:${secret}`).toString('base64')}`,
    'Idempotence-Key': crypto.randomUUID(),
  }
}

const API = 'https://api.yookassa.ru/v3'

function mapStatus(status: string): PaymentCheckout['status'] {
  switch (status) {
    case 'succeeded':
      return 'completed'
    case 'canceled':
      return 'cancelled'
    case 'waiting_for_capture':
    case 'pending':
      return 'pending'
    default:
      return 'failed'
  }
}

export const yookassaAdapter: PaymentAdapter = {
  async createCheckout({ amount, currency, description, successUrl, metadata }) {
    const res = await fetch(`${API}/payments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        amount: { value: amount.toFixed(2), currency: currency.toUpperCase() },
        confirmation: { type: 'redirect', return_url: successUrl },
        capture: true,
        description,
        metadata: metadata ?? {},
      }),
    })

    if (!res.ok) throw new Error(`YooKassa API error: ${res.status}`)
    const data = await res.json()

    return {
      id: data.id,
      url: data.confirmation.confirmation_url,
      amount,
      currency,
      status: 'pending' as const,
    }
  },

  async verifyWebhook({ body }) {
    const payload = JSON.parse(body)

    const eventMap: Record<string, string> = {
      'payment.succeeded': 'payment.succeeded',
      'payment.canceled': 'payment.failed',
      'payment.waiting_for_capture': 'payment.pending',
    }

    return {
      event: eventMap[payload.event] ?? payload.event,
      data: payload.object ?? {},
    }
  },

  async getPaymentStatus(id) {
    const res = await fetch(`${API}/payments/${id}`, { headers: getHeaders() })
    if (!res.ok) throw new Error(`YooKassa API error: ${res.status}`)
    const data = await res.json()

    return {
      id: data.id,
      url: '',
      amount: parseFloat(data.amount.value),
      currency: data.amount.currency.toLowerCase(),
      status: mapStatus(data.status),
    }
  },
}
