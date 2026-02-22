import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getCMS } from '@/lib/cms'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { Animated } from '@/components/animations/animated'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest articles and news.',
}

export default async function BlogPage() {
  const cms = await getCMS()
  const { posts } = await cms.getPosts({ limit: 20 })

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <Animated>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Latest articles and updates.
        </p>
      </Animated>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">
          No posts yet. Connect a CMS and start writing.
        </p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Animated key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <article className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
                  {post.featuredImage && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <time className="text-xs text-muted-foreground">{formatDate(post.date)}</time>
                    <h2 className="mt-2 font-semibold group-hover:text-primary">{post.title}</h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    )}
                  </div>
                </article>
              </Link>
            </Animated>
          ))}
        </div>
      )}
    </div>
  )
}
