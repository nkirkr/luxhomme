import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  if (process.env.NEXT_PUBLIC_FEATURE_AUTH !== 'true') notFound()

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
