import { NextRequest, NextResponse } from 'next/server'
import { getCMS } from '@/lib/cms'
import { apiLimiter } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = apiLimiter.check(`search:${ip}`)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const query = request.nextUrl.searchParams.get('q')?.trim()
  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results: Array<{ title: string; url: string; excerpt: string; type: string }> = []

  const staticPages = [
    { title: 'Home', url: '/', type: 'page' },
    { title: 'About', url: '/about', type: 'page' },
    { title: 'Contact', url: '/contact', type: 'page' },
  ]

  const lowerQuery = query.toLowerCase()
  for (const page of staticPages) {
    if (page.title.toLowerCase().includes(lowerQuery)) {
      results.push({ ...page, excerpt: `${page.title} page` })
    }
  }

  try {
    const cms = await getCMS()
    const { posts } = await cms.getPosts({ limit: 50 })
    for (const post of posts) {
      if (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt?.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          title: post.title,
          url: `/blog/${post.slug}`,
          excerpt: post.excerpt ?? '',
          type: 'post',
        })
      }
    }
  } catch {}

  return NextResponse.json({ results: results.slice(0, 20) })
}
