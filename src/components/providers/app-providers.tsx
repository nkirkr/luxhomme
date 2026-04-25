'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'

import { AnalyticsProvider } from './analytics-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { CookieConsent } from '@/components/cookie-consent'
import { WebVitalsReporter } from '@/components/web-vitals-reporter'
import { CartProvider } from '@/lib/cart/CartContext'
import { AddToCartToast } from '@/components/cart/AddToCartToast'
import { FeedbackWidget } from '@/components/feedback-widget/FeedbackWidget'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <CartProvider>
          {children}
          <AddToCartToast />
        </CartProvider>
        <Toaster />
        <CookieConsent />
        <FeedbackWidget />
        <AnalyticsProvider />
        <WebVitalsReporter />
      </TooltipProvider>
    </ThemeProvider>
  )
}
