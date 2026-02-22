import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome to your dashboard.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {['Overview', 'Activity', 'Stats'].map((title) => (
          <div key={title} className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-2xl font-bold">--</p>
            <p className="text-sm text-muted-foreground">Placeholder card</p>
          </div>
        ))}
      </div>
    </div>
  )
}
