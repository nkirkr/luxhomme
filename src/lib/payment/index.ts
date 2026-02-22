import type { PaymentAdapter } from './types'
export type { PaymentAdapter, PaymentCheckout } from './types'

type PaymentProvider = 'none' | 'stripe' | 'yookassa'

const PAYMENT_PROVIDER: PaymentProvider =
  (process.env.PAYMENT_PROVIDER as PaymentProvider) ?? 'none'

const mockAdapter: PaymentAdapter = {
  async createCheckout() {
    throw new Error('Payment provider not configured')
  },
  async verifyWebhook() {
    throw new Error('Payment provider not configured')
  },
  async getPaymentStatus() {
    throw new Error('Payment provider not configured')
  },
}

let _payment: PaymentAdapter | null = null

export async function getPayment(): Promise<PaymentAdapter> {
  if (_payment) return _payment

  switch (PAYMENT_PROVIDER) {
    // Future: import stripe or yookassa adapters
    // case 'stripe': { ... }
    // case 'yookassa': { ... }
    default:
      _payment = mockAdapter
  }

  return _payment
}
