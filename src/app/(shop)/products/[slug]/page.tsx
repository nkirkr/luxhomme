import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getShop } from '@/lib/shop'
import { ProductJsonLd } from '@/components/seo/json-ld'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { absoluteUrl } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const shop = await getShop()
  const product = await shop.getProductBySlug(slug)
  if (!product) return {}

  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const shop = await getShop()
  const product = await shop.getProductBySlug(slug)

  if (!product) notFound()

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.images[0]?.url ?? ''}
        url={absoluteUrl(`/products/${slug}`)}
        price={product.price}
        currency={product.currency}
        availability={product.inStock ? 'InStock' : 'OutOfStock'}
      />
      <div className="mx-auto max-w-6xl px-4 py-20">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.name },
        ]} />
        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div className="aspect-square rounded-lg bg-muted" />
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold">{product.currency} {product.price}</p>
            <p className="mt-6 text-muted-foreground">{product.description}</p>
            <button className="mt-8 w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto sm:px-12">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
