import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en'
const LOCALES = (process.env.NEXT_PUBLIC_LOCALES || 'en').split(',').map((l) => l.trim())

export function generateCanonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function generateAlternateUrls(
  path: string,
  locales: string[] = LOCALES,
): Record<string, string> {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const result: Record<string, string> = {}

  for (const locale of locales) {
    result[locale] =
      locale === DEFAULT_LOCALE ? `${SITE_URL}${normalized}` : `${SITE_URL}/${locale}${normalized}`
  }

  result['x-default'] = `${SITE_URL}${normalized}`
  return result
}

export function generateProductMeta({
  name,
  description,
  price,
  currency = 'RUB',
  image,
  slug,
  siteName = SITE_NAME,
  brand,
}: {
  name: string
  description: string
  price: number
  currency?: string
  image: string
  slug: string
  siteName?: string
  brand?: string
}): Metadata {
  const url = generateCanonicalUrl(`/products/${slug}`)
  const title = brand ? `${name} ${brand} — купить | ${siteName}` : `${name} — купить | ${siteName}`

  return {
    title,
    description: `${description}. Цена ${price} ${currency}. Доставка и гарантия.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: name,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
      images: [image],
    },
  }
}

export function generateCategoryMeta({
  category,
  scenario,
  filters,
  siteName = SITE_NAME,
  path,
  description: customDescription,
}: {
  category: string
  scenario?: string
  filters?: Record<string, string>
  siteName?: string
  path?: string
  description?: string
}): Metadata {
  const parts = [category]
  if (scenario) parts.push(scenario)

  const filterValues = filters ? Object.values(filters) : []
  parts.push(...filterValues)

  const title = `${parts.join(' ')} — купить, цены | ${siteName}`
  const h1Hint = parts.join(' ')
  const description =
    customDescription || `${h1Hint} — каталог с ценами и фото. Доставка по всей России.`

  const url = path ? generateCanonicalUrl(path) : undefined

  return {
    title,
    description,
    ...(url && { alternates: { canonical: url } }),
    openGraph: {
      title,
      description,
      ...(url && { url }),
      type: 'website',
    },
  }
}

export function generateArticleMeta({
  title,
  description,
  slug,
  image,
  datePublished,
  dateModified,
  authorName,
  siteName = SITE_NAME,
}: {
  title: string
  description: string
  slug: string
  image?: string
  datePublished: string
  dateModified?: string
  authorName: string
  siteName?: string
}): Metadata {
  const url = generateCanonicalUrl(`/blog/${slug}`)

  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: datePublished,
      modifiedTime: dateModified || datePublished,
      authors: [authorName],
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
  }
}

export function generatePageMeta({
  title,
  description,
  path,
  siteName = SITE_NAME,
}: {
  title: string
  description: string
  path: string
  siteName?: string
}): Metadata {
  const url = generateCanonicalUrl(path)

  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
  }
}
