import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import SiteFooter from '@/components/layout/site-footer/SiteFooter'

export default function AuthLayout({ children }: { children: ReactNode }) {
  if (process.env.NEXT_PUBLIC_FEATURE_AUTH !== 'true') notFound()

  return (
    <>
      <main>{children}</main>
      <SiteFooter />
    </>
  )
}
