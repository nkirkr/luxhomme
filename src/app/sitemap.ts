import type { MetadataRoute } from 'next'
import { getCMS } from '@/lib/cms'
import { getShop } from '@/lib/shop'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  const dynamicRoutes: MetadataRoute.Sitemap = []

  const cmsEnabled =
    process.env.NEXT_PUBLIC_FEATURE_BLOG === 'true' || process.env.CMS_PROVIDER !== 'none'

  if (cmsEnabled) {
    staticRoutes.push({
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })

    try {
      const cms = await getCMS()

      const { posts } = await cms.getPosts({ limit: 1000 })
      for (const post of posts) {
        dynamicRoutes.push({
          url: `${BASE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }

      const pages = await cms.getPages()
      for (const page of pages) {
        dynamicRoutes.push({
          url: `${BASE_URL}/${page.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    } catch {}
  }

  if (process.env.NEXT_PUBLIC_FEATURE_SHOP === 'true') {
    staticRoutes.push({
      url: `${BASE_URL}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })

    try {
      const shop = await getShop()
      const { products } = await shop.getProducts({ limit: 5000 })
      for (const product of products) {
        dynamicRoutes.push({
          url: `${BASE_URL}/products/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    } catch {}
  }

  return [...staticRoutes, ...dynamicRoutes]
}
