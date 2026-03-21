'use client'

import Link from 'next/link'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="text-muted-foreground mt-2">Something went wrong with authentication.</p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-2 text-sm font-medium"
        >
          Try again
        </button>
        <Link href="/" className="hover:bg-muted rounded-md border px-6 py-2 text-sm font-medium">
          Go home
        </Link>
      </div>
    </div>
  )
}
