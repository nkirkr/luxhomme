import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Profile' }

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mt-2 text-muted-foreground">Manage your profile information.</p>
      <div className="mt-8 max-w-lg space-y-6 rounded-lg border bg-card p-6">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input type="text" className="mt-2 w-full rounded-md border bg-background px-4 py-2.5 text-sm" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="mt-2 w-full rounded-md border bg-background px-4 py-2.5 text-sm" placeholder="your@email.com" disabled />
        </div>
        <button className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save</button>
      </div>
    </div>
  )
}
