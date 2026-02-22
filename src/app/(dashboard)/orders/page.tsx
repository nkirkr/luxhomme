import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Orders' }

export default function OrdersPage() {
  if (process.env.NEXT_PUBLIC_FEATURE_SHOP !== 'true') notFound()

  return (
    <div>
      <h1 className="text-3xl font-bold">Orders</h1>
      <p className="mt-2 text-muted-foreground">View your order history.</p>
      <div className="mt-8 rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground">No orders yet.</p>
      </div>
    </div>
  )
}
