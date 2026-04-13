import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import SiteFooter from '@/components/layout/site-footer/SiteFooter'

export default function ShopLayout({ children }: { children: ReactNode }) {
  if (process.env.NEXT_PUBLIC_FEATURE_SHOP !== 'true') notFound()

  return (
    <div className="siteLayout">
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
