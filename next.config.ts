import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,

  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // WordPress media
      ...(process.env.WORDPRESS_GRAPHQL_URL
        ? [
            {
              protocol: 'https' as const,
              hostname: new URL(process.env.WORDPRESS_GRAPHQL_URL).hostname,
              pathname: '/wp-content/uploads/**',
            },
          ]
        : []),
      // Payload CMS media
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
