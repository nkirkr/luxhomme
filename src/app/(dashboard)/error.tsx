'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-2xl font-bold">Dashboard Error</h1>
      <p className="text-muted-foreground mt-2">Something went wrong loading the dashboard.</p>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 rounded-md px-6 py-2 text-sm font-medium"
      >
        Try again
      </button>
    </div>
  )
}
