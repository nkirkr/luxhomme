import type { NextConfig } from 'next'
import './src/lib/env.ts'

// Content-Security-Policy in report-only mode.
// This collects violation data without blocking anything — safe for a template.
// TODO: To enforce CSP, change the header key to 'Content-Security-Policy'
// TODO: Add a report-uri or report-to endpoint to collect violations
//       e.g. report-uri https://your-domain.report-uri.com/r/d/csp/reportOnly
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://mc.yandex.ru https://embed.tawk.to",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://mc.yandex.ru wss:",
  "frame-src 'self' https://embed.tawk.to",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

function remotePatternFromEnvUrl(
  envUrl: string | undefined,
  pathname: string,
): Array<{ protocol: 'http' | 'https'; hostname: string; pathname: string }> {
  if (!envUrl) return []
  try {
    const u = new URL(envUrl)
    const protocol = u.protocol === 'http:' ? ('http' as const) : ('https' as const)
    return [{ protocol, hostname: u.hostname, pathname }]
  } catch {
    return []
  }
}

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy-Report-Only', value: cspHeader },
]

const nextConfig: NextConfig = {
  reactCompiler: true,

  output: 'standalone',

  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
    remotePatterns: [
      ...remotePatternFromEnvUrl(process.env.WORDPRESS_GRAPHQL_URL, '/wp-content/uploads/**'),
      ...remotePatternFromEnvUrl(process.env.WOOCOMMERCE_URL, '/wp-content/uploads/**'),
      ...(process.env.PAYLOAD_API_URL
        ? [
            {
              protocol: 'https' as const,
              hostname: new URL(process.env.PAYLOAD_API_URL).hostname,
              pathname: '/media/**',
            },
          ]
        : []),
    ],
  },

  turbopack: {},
}

export default nextConfig
