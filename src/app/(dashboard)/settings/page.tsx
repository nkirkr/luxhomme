import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-muted-foreground">Manage your account settings.</p>
      <div className="mt-8 max-w-lg space-y-8">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Notifications</h3>
          <p className="mt-1 text-sm text-muted-foreground">Configure notification preferences.</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Security</h3>
          <p className="mt-1 text-sm text-muted-foreground">Change password and security settings.</p>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-card p-6">
          <h3 className="font-semibold text-destructive">Danger Zone</h3>
          <p className="mt-1 text-sm text-muted-foreground">Delete your account permanently.</p>
          <button className="mt-4 rounded-md border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
