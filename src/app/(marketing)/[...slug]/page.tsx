import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCMS } from '@/lib/cms'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const fullSlug = slug.join('/')
  const cms = await getCMS()
  const page = await cms.getPageBySlug(fullSlug)

  if (!page) return {}

  return {
    title: page.title,
    openGraph: {
      title: page.title,
      ...(page.featuredImage ? { images: [page.featuredImage.url] } : {}),
    },
  }
}

export default async function DynamicCMSPage({ params }: Props) {
  const { slug } = await params
  const fullSlug = slug.join('/')
  const cms = await getCMS()
  const page = await cms.getPageBySlug(fullSlug)

  if (!page) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: page.title },
        ]}
      />
      <h1 className="mt-8 text-4xl font-bold tracking-tight">{page.title}</h1>
      <div
        className="prose prose-neutral dark:prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  )
}
