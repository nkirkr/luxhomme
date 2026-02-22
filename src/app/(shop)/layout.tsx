import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function ShopLayout({ children }: { children: ReactNode }) {
  if (process.env.NEXT_PUBLIC_FEATURE_SHOP !== 'true') notFound()

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
