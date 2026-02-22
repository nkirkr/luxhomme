import Link from 'next/link'
import { features } from '@/lib/features'

export function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold">{siteName}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Modern web application built with Next.js.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Navigation</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
              {features.blog && (
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
              )}
            </ul>
          </div>

          {features.shop && (
            <div>
              <h4 className="text-sm font-semibold">Shop</h4>
              <ul className="mt-3 space-y-2">
                <li><Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">Products</Link></li>
                <li><Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground">Cart</Link></li>
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {year} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
