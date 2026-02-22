import type { CMSAdapter, CMSPost, CMSPage, CMSCategory } from './types'

const PAYLOAD_URL = process.env.PAYLOAD_API_URL!
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY

async function payloadFetch<T>(
  endpoint: string,
  revalidate = 3600
): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (PAYLOAD_API_KEY) {
    headers['Authorization'] = `users API-Key ${PAYLOAD_API_KEY}`
  }

  const res = await fetch(`${PAYLOAD_URL}/api${endpoint}`, {
    headers,
    next: { revalidate },
  })

  if (!res.ok) throw new Error(`Payload API error: ${res.status}`)
  return res.json()
}

export const payloadAdapter: CMSAdapter = {
  async getPosts({ limit = 20, offset = 0, category } = {}) {
    const params = new URLSearchParams({
      limit: String(limit),
      page: String(Math.floor(offset / limit) + 1),
      sort: '-createdAt',
    })
    if (category) params.set('where[categories.slug][equals]', category)

    const data = await payloadFetch<any>(`/posts?${params}`)
    return {
      posts: data.docs.map(
        (doc: any): CMSPost => ({
          id: doc.id,
          slug: doc.slug,
          title: doc.title,
          content: doc.content_html ?? doc.content ?? '',
          excerpt: doc.excerpt ?? '',
          date: doc.createdAt,
          featuredImage: doc.featuredImage
            ? {
                url: doc.featuredImage.url,
                alt: doc.featuredImage.alt ?? '',
                width: doc.featuredImage.width ?? 800,
                height: doc.featuredImage.height ?? 600,
              }
            : undefined,
          categories:
            doc.categories?.map((c: any) => ({
              id: c.id,
              name: c.title,
              slug: c.slug,
            })) ?? [],
        })
      ),
      total: data.totalDocs,
    }
  },

  async getPostBySlug(slug, draft = false) {
    const params = new URLSearchParams({ 'where[slug][equals]': slug })
    if (draft) params.set('draft', 'true')

    const data = await payloadFetch<any>(
      `/posts?${params}`,
      draft ? 0 : 3600
    )
    const doc = data.docs[0]
    if (!doc) return null

    return {
      id: doc.id,
      slug: doc.slug,
      title: doc.title,
      content: doc.content_html ?? doc.content ?? '',
      excerpt: doc.excerpt ?? '',
      date: doc.createdAt,
      featuredImage: doc.featuredImage
        ? {
            url: doc.featuredImage.url,
            alt: doc.featuredImage.alt ?? '',
            width: doc.featuredImage.width ?? 800,
            height: doc.featuredImage.height ?? 600,
          }
        : undefined,
      categories:
        doc.categories?.map((c: any) => ({
          id: c.id,
          name: c.title,
          slug: c.slug,
        })) ?? [],
    }
  },

  async getPages() {
    const data = await payloadFetch<any>('/pages?limit=100')
    return data.docs.map(
      (doc: any): CMSPage => ({
        id: doc.id,
        slug: doc.slug,
        title: doc.title,
        content: doc.content_html ?? doc.content ?? '',
        featuredImage: doc.featuredImage
          ? {
              url: doc.featuredImage.url,
              alt: doc.featuredImage.alt ?? '',
              width: doc.featuredImage.width ?? 800,
              height: doc.featuredImage.height ?? 600,
            }
          : undefined,
      })
    )
  },

  async getPageBySlug(slug, draft = false) {
    const params = new URLSearchParams({ 'where[slug][equals]': slug })
    if (draft) params.set('draft', 'true')
    const data = await payloadFetch<any>(
      `/pages?${params}`,
      draft ? 0 : 3600
    )
    const doc = data.docs[0]
    if (!doc) return null
    return {
      id: doc.id,
      slug: doc.slug,
      title: doc.title,
      content: doc.content_html ?? doc.content ?? '',
      featuredImage: doc.featuredImage
        ? {
            url: doc.featuredImage.url,
            alt: doc.featuredImage.alt ?? '',
            width: doc.featuredImage.width ?? 800,
            height: doc.featuredImage.height ?? 600,
          }
        : undefined,
    }
  },

  async getCategories() {
    const data = await payloadFetch<any>('/categories?limit=100')
    return data.docs.map((doc: any) => ({
      id: doc.id,
      name: doc.title,
      slug: doc.slug,
    }))
  },
}
