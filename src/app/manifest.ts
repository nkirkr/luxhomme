import type { MetadataRoute } from 'next'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: 'Modern web application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    icons: [
      { src: '/pwa-icon-192', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-icon-512', sizes: '512x512', type: 'image/png' },
    ],
  }
}
