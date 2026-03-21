import type { Metadata } from 'next'
import { getShop } from '@/lib/shop'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import { Animated } from '@/components/animations/animated'
import { generateCanonicalUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our product catalog.',
  alternates: {
    canonical: generateCanonicalUrl('/products'),
  },
}

export default async function ProductsPage() {
  const shop = await getShop()
  const { products } = await shop.getProducts({ limit: 20 })

  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Products' }]} />
      <Animated>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Products</h1>
      </Animated>
      {products.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center">
          No products yet. Connect a product source.
        </p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Animated key={product.id}>
              <a
                href={`/products/${product.slug}`}
                className="group bg-card block overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
              >
                <div className="bg-muted aspect-square" />
                <div className="p-4">
                  <h3 className="group-hover:text-primary font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm font-semibold">
                    {product.currency} {product.price}
                  </p>
                </div>
              </a>
            </Animated>
          ))}
        </div>
      )}
    </div>
  )
}
