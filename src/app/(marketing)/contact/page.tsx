import type { Metadata } from 'next'
import { Animated } from '@/components/animations/animated'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with us.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      <Animated>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Placeholder contact page. Add a contact form here.
        </p>
      </Animated>
      <Animated>
        <form className="mt-12 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <input id="name" type="text" required className="mt-2 w-full rounded-md border bg-background px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input id="email" type="email" required className="mt-2 w-full rounded-md border bg-background px-4 py-2.5 text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">Message</label>
            <textarea id="message" rows={5} required className="mt-2 w-full rounded-md border bg-background px-4 py-2.5 text-sm" />
          </div>
          <button type="submit" className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Send Message
          </button>
        </form>
      </Animated>
    </div>
  )
}
