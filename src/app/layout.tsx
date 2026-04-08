import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { fontSans, fontMono, fontInter, fontGogol } from '@/lib/fonts'
import { AppProviders } from '@/components/providers/app-providers'
import { generateAlternateUrls } from '@/lib/seo'
import '@/styles/globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'
const i18nEnabled = process.env.NEXT_PUBLIC_FEATURE_I18N === 'true'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Modern web application built with Next.js',
  alternates: {
    canonical: siteUrl,
    ...(i18nEnabled && { languages: generateAlternateUrls('/') }),
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName,
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontInter.variable} ${fontGogol.variable} font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
