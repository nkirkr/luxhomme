import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { withEnv } from '@/test/helpers'

describe('seo', () => {
  let cleanup: () => void

  beforeEach(() => {
    vi.resetModules()
    cleanup = withEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      NEXT_PUBLIC_SITE_NAME: 'Test Site',
      NEXT_PUBLIC_DEFAULT_LOCALE: 'en',
      NEXT_PUBLIC_LOCALES: 'en,ru',
    })
  })

  afterEach(() => {
    cleanup()
  })

  describe('generateCanonicalUrl', () => {
    it('creates canonical URL from path', async () => {
      const { generateCanonicalUrl } = await import('./seo')
      expect(generateCanonicalUrl('/about')).toBe('https://example.com/about')
    })

    it('normalizes path without leading slash', async () => {
      const { generateCanonicalUrl } = await import('./seo')
      expect(generateCanonicalUrl('about')).toBe('https://example.com/about')
    })
  })

  describe('generateAlternateUrls', () => {
    it('generates alternate URLs for locales', async () => {
      const { generateAlternateUrls } = await import('./seo')
      const urls = generateAlternateUrls('/about')

      expect(urls['en']).toBe('https://example.com/about')
      expect(urls['ru']).toBe('https://example.com/ru/about')
      expect(urls['x-default']).toBe('https://example.com/about')
    })

    it('default locale gets no prefix', async () => {
      const { generateAlternateUrls } = await import('./seo')
      const urls = generateAlternateUrls('/')

      expect(urls['en']).toBe('https://example.com/')
      expect(urls['ru']).toBe('https://example.com/ru/')
    })
  })

  describe('generateProductMeta', () => {
    it('generates product metadata', async () => {
      const { generateProductMeta } = await import('./seo')
      const meta = generateProductMeta({
        name: 'Widget',
        description: 'A great widget',
        price: 500,
        currency: 'RUB',
        image: 'https://example.com/widget.jpg',
        slug: 'widget',
      })

      expect(meta.title).toContain('Widget')
      expect(meta.title).toContain('Test Site')
      expect(meta.description).toContain('500')
      expect(meta.alternates?.canonical).toBe('https://example.com/products/widget')
      expect(meta.openGraph?.images).toBeDefined()
    })

    it('includes brand in title when provided', async () => {
      const { generateProductMeta } = await import('./seo')
      const meta = generateProductMeta({
        name: 'Widget',
        description: 'A great widget',
        price: 500,
        image: 'https://example.com/widget.jpg',
        slug: 'widget',
        brand: 'Acme',
      })

      expect(meta.title).toContain('Acme')
    })
  })

  describe('generateArticleMeta', () => {
    it('generates article metadata', async () => {
      const { generateArticleMeta } = await import('./seo')
      const meta = generateArticleMeta({
        title: 'My Post',
        description: 'Post description',
        slug: 'my-post',
        datePublished: '2025-01-15',
        authorName: 'Author',
      })

      expect(meta.title).toContain('My Post')
      expect(meta.title).toContain('Test Site')
      expect(meta.alternates?.canonical).toBe('https://example.com/blog/my-post')
      expect(meta.openGraph?.type).toBe('article')
    })

    it('includes image when provided', async () => {
      const { generateArticleMeta } = await import('./seo')
      const meta = generateArticleMeta({
        title: 'My Post',
        description: 'Post description',
        slug: 'my-post',
        image: 'https://example.com/post.jpg',
        datePublished: '2025-01-15',
        authorName: 'Author',
      })

      expect(meta.openGraph?.images).toBeDefined()
    })
  })

  describe('generateCategoryMeta', () => {
    it('generates category metadata', async () => {
      const { generateCategoryMeta } = await import('./seo')
      const meta = generateCategoryMeta({
        category: 'Electronics',
        path: '/products/electronics',
      })

      expect(meta.title).toContain('Electronics')
      expect(meta.alternates?.canonical).toBe('https://example.com/products/electronics')
    })

    it('includes filters and scenario in title', async () => {
      const { generateCategoryMeta } = await import('./seo')
      const meta = generateCategoryMeta({
        category: 'Phones',
        scenario: 'sale',
        filters: { brand: 'Apple' },
      })

      expect(meta.title).toContain('Phones')
      expect(meta.title).toContain('sale')
      expect(meta.title).toContain('Apple')
    })
  })

  describe('generatePageMeta', () => {
    it('generates page metadata', async () => {
      const { generatePageMeta } = await import('./seo')
      const meta = generatePageMeta({
        title: 'About',
        description: 'About us',
        path: '/about',
      })

      expect(meta.title).toBe('About | Test Site')
      expect(meta.description).toBe('About us')
      expect(meta.alternates?.canonical).toBe('https://example.com/about')
      expect(meta.openGraph?.type).toBe('website')
    })
  })
})
