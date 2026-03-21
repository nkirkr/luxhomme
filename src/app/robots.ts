import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/checkout/', '/profile/', '/settings/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/', '/checkout/', '/profile/', '/settings/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}

// Clean-param and Host directives for Yandex are added via host field above.
// For advanced Clean-param rules (e.g. "Clean-param: sort&page&view /products/"),
// create a static public/robots.txt or use middleware to append additional directives.
