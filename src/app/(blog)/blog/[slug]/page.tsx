import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getCMS } from '@/lib/cms'
import { ArticleJsonLd } from '@/components/seo/json-ld'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { Animated } from '@/components/animations/animated'
import { formatDate, absoluteUrl } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cms = await getCMS()
  const post = await cms.getPostBySlug(slug)

  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      publishedTime: post.date,
      ...(post.featuredImage ? { images: [post.featuredImage.url] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const cms = await getCMS()
  const post = await cms.getPostBySlug(slug)

  if (!post) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={absoluteUrl(`/blog/${slug}`)}
        image={post.featuredImage?.url ?? `${siteUrl}/og-default.png`}
        datePublished={post.date}
        authorName="Author"
        publisherName={siteName}
        publisherLogo={`${siteUrl}/logo.png`}
      />

      <article className="mx-auto max-w-4xl px-4 py-20">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
        />

        <Animated>
          <header className="mt-8">
            <time className="text-sm text-muted-foreground">{formatDate(post.date)}</time>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">{post.title}</h1>
            {post.categories.length > 0 && (
              <div className="mt-4 flex gap-2">
                {post.categories.map((cat) => (
                  <span key={cat.id} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </header>
        </Animated>

        {post.featuredImage && (
          <Animated>
            <div className="relative mt-8 aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </Animated>
        )}

        <Animated>
          <div
            className="prose prose-neutral dark:prose-invert mt-12 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Animated>
      </article>
    </>
  )
}
