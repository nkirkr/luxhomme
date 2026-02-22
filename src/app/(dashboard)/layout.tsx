import { notFound, redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { isEnabled } from '@/lib/features'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Settings', href: '/settings' },
]

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  if (process.env.NEXT_PUBLIC_FEATURE_DASHBOARD !== 'true') notFound()

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const allItems = [
    ...navItems,
    ...(isEnabled('shop') ? [{ label: 'Orders', href: '/orders' }] : []),
  ]

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-sidebar p-6 md:block">
        <div className="mb-8">
          <Link href="/" className="text-lg font-bold">
            {process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'}
          </Link>
        </div>
        <nav className="space-y-1">
          {allItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-8 text-sm text-muted-foreground">
          {session.user.name || session.user.email}
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  )
}
