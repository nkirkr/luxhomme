import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = { title: 'Cart' }

export default function CartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <h1 className="mt-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="mt-8 rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <a href="/products" className="mt-4 inline-block text-sm text-primary hover:underline">Continue Shopping</a>
      </div>
    </div>
  )
}
