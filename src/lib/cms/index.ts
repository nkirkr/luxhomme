import type { CMSAdapter, CMSPost, CMSPage, CMSCategory } from './types'

export type { CMSAdapter, CMSPost, CMSPage, CMSCategory }

type CMSProvider = 'none' | 'wordpress' | 'payload'

const CMS_PROVIDER: CMSProvider =
  (process.env.CMS_PROVIDER as CMSProvider) ?? 'none'

const mockAdapter: CMSAdapter = {
  async getPosts() {
    return { posts: [], total: 0 }
  },
  async getPostBySlug() {
    return null
  },
  async getPages() {
    return []
  },
  async getPageBySlug() {
    return null
  },
  async getCategories() {
    return []
  },
}

let _cms: CMSAdapter | null = null

export async function getCMS(): Promise<CMSAdapter> {
  if (_cms) return _cms

  switch (CMS_PROVIDER) {
    case 'wordpress': {
      const { wordpressAdapter } = await import('./wordpress')
      _cms = wordpressAdapter
      break
    }
    case 'payload': {
      const { payloadAdapter } = await import('./payload')
      _cms = payloadAdapter
      break
    }
    default:
      _cms = mockAdapter
  }

  return _cms
}
