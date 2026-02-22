import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Breadcrumbs items={[
        { label: 'Home', href: '/' },
        { label: 'Cart', href: '/cart' },
        { label: 'Checkout' },
      ]} />
      <h1 className="mt-8 text-3xl font-bold">Checkout</h1>
      <p className="mt-2 text-muted-foreground">
        Checkout placeholder. Connect a payment provider in .env to enable.
      </p>
    </div>
  )
}
