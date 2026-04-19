'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground mt-4 text-lg">An unexpected error occurred.</p>
      {process.env.NODE_ENV === 'development' ? (
        <pre className="text-destructive mt-6 max-h-48 max-w-2xl overflow-auto rounded-md border p-4 text-left text-xs whitespace-pre-wrap">
          {error.message}
        </pre>
      ) : null}
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 rounded-md px-6 py-3 text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
