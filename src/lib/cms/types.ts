export interface CMSImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface CMSPost {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  date: string
  featuredImage?: CMSImage
  categories: Array<{ id: string; name: string; slug: string }>
}

export interface CMSPage {
  id: string
  slug: string
  title: string
  content: string
  featuredImage?: CMSImage
}

export interface CMSCategory {
  id: string
  name: string
  slug: string
}

export interface CMSAdapter {
  getPosts(options?: {
    limit?: number
    offset?: number
    category?: string
  }): Promise<{ posts: CMSPost[]; total: number }>
  getPostBySlug(slug: string, draft?: boolean): Promise<CMSPost | null>
  getPages(): Promise<CMSPage[]>
  getPageBySlug(slug: string, draft?: boolean): Promise<CMSPage | null>
  getCategories(): Promise<CMSCategory[]>
}
