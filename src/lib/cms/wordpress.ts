import type { CMSAdapter, CMSPost, CMSPage, CMSCategory, CMSImage } from './types'

const GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL!
const AUTH_TOKEN = process.env.WP_APPLICATION_PASSWORD

interface GraphQLResponse<T> {
  data: T
  errors?: Array<{ message: string }>
}

async function wpQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { revalidate?: number | false; tags?: string[]; draft?: boolean }
): Promise<T> {
  const { revalidate = 3600, tags = [], draft = false } = options ?? {}

  const headers: HeadersInit = { 'Content-Type': 'application/json' }

  if (draft && AUTH_TOKEN) {
    const encoded = Buffer.from(
      `${process.env.WP_APPLICATION_USER}:${AUTH_TOKEN}`
    ).toString('base64')
    headers['Authorization'] = `Basic ${encoded}`
  }

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate: draft ? 0 : revalidate, tags },
  })

  if (!res.ok) {
    throw new Error(`WPGraphQL error: ${res.status} ${res.statusText}`)
  }

  const json: GraphQLResponse<T> = await res.json()

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join('\n'))
  }

  return json.data
}

function mapImage(node: any): CMSImage | undefined {
  if (!node?.sourceUrl) return undefined
  return {
    url: node.sourceUrl,
    alt: node.altText || '',
    width: node.mediaDetails?.width ?? 800,
    height: node.mediaDetails?.height ?? 600,
  }
}

function mapPost(node: any): CMSPost {
  return {
    id: node.id ?? node.databaseId?.toString(),
    slug: node.slug,
    title: node.title,
    content: node.content,
    excerpt: node.excerpt ?? '',
    date: node.date,
    featuredImage: mapImage(node.featuredImage?.node),
    categories:
      node.categories?.nodes?.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })) ?? [],
  }
}

const POST_FIELDS = `
  id slug title content excerpt date
  featuredImage {
    node { sourceUrl altText mediaDetails { width height } }
  }
  categories { nodes { id name slug } }
`

export const wordpressAdapter: CMSAdapter = {
  async getPosts({ limit = 20, offset = 0, category } = {}) {
    const where = category
      ? `, where: { status: PUBLISH, categoryName: "${category}" }`
      : ', where: { status: PUBLISH }'

    const data = await wpQuery<any>(
      `query { posts(first: ${limit}, after: ${offset ? `"${offset}"` : 'null'}${where}) { nodes { ${POST_FIELDS} } pageInfo { total } } }`,
      undefined,
      { tags: ['posts'] }
    )

    return {
      posts: data.posts.nodes.map(mapPost),
      total: data.posts.pageInfo?.total ?? data.posts.nodes.length,
    }
  },

  async getPostBySlug(slug, draft = false) {
    const query = draft
      ? `query($slug: ID!) { post(id: $slug, idType: SLUG, asPreview: true) { ${POST_FIELDS} } }`
      : `query($slug: String!) { postBy(slug: $slug) { ${POST_FIELDS} } }`

    const data = await wpQuery<any>(query, { slug }, { draft, tags: [`post-${slug}`] })
    const node = draft ? data.post : data.postBy
    return node ? mapPost(node) : null
  },

  async getPages() {
    const data = await wpQuery<any>(
      `query { pages(first: 100) { nodes { id slug title content featuredImage { node { sourceUrl altText mediaDetails { width height } } } } } }`,
      undefined,
      { tags: ['pages'] }
    )

    return data.pages.nodes.map((n: any) => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      content: n.content,
      featuredImage: mapImage(n.featuredImage?.node),
    }))
  },

  async getPageBySlug(slug, draft = false) {
    const data = await wpQuery<any>(
      `query($slug: String!) { pageBy(uri: $slug) { id slug title content featuredImage { node { sourceUrl altText mediaDetails { width height } } } } }`,
      { slug },
      { draft, tags: [`page-${slug}`] }
    )

    const n = data.pageBy
    if (!n) return null
    return {
      id: n.id,
      slug: n.slug,
      title: n.title,
      content: n.content,
      featuredImage: mapImage(n.featuredImage?.node),
    }
  },

  async getCategories() {
    const data = await wpQuery<any>(
      `query { categories { nodes { id name slug } } }`,
      undefined,
      { tags: ['categories'] }
    )
    return data.categories.nodes
  },
}
