export interface PaymentCheckout {
  id: string
  url: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
}

export interface PaymentAdapter {
  createCheckout(params: {
    amount: number
    currency: string
    description: string
    successUrl: string
    cancelUrl: string
    metadata?: Record<string, string>
  }): Promise<PaymentCheckout>

  verifyWebhook(params: {
    body: string
    signature: string
  }): Promise<{ event: string; data: Record<string, unknown> }>

  getPaymentStatus(id: string): Promise<PaymentCheckout>
}
