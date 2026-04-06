import type { ReactNode } from 'react'
import { ChatWidget } from '@/components/chat/chat-widget'
import SiteFooter from '@/components/layout/site-footer/SiteFooter'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <SiteFooter />
      <ChatWidget />
    </>
  )
}
