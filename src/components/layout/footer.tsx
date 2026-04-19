import Link from 'next/link'
import { features } from '@/lib/features'

export function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'
  const year = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold">{siteName}</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Modern web application built with Next.js.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Navigation</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Contact
                </Link>
              </li>
              {features.blog && (
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Blog
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {features.shop && (
            <div>
              <h4 className="text-sm font-semibold">Shop</h4>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/catalog"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          &copy; {year} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
