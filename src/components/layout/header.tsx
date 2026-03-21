import Link from 'next/link'
import { features } from '@/lib/features'
import { MobileNav } from './mobile-nav'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'

const baseLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const links = [
    ...baseLinks,
    ...(features.blog ? [{ label: 'Blog', href: '/blog' }] : []),
    ...(features.shop ? [{ label: 'Products', href: '/products' }] : []),
  ]

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          {process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {features.i18n && <LanguageSwitcher />}
          <ThemeToggle />
          {features.auth && (
            <Link
              href="/login"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hidden rounded-md px-4 py-2 text-sm font-medium md:inline-flex"
            >
              Sign In
            </Link>
          )}
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  )
}
