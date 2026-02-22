import type { Metadata } from 'next'
import { Animated } from '@/components/animations/animated'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about us and our mission.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      <Animated>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">About Us</h1>
        <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
          <p className="text-lg text-muted-foreground">
            This is a placeholder page. Replace this content with information about your company or project.
          </p>
        </div>
      </Animated>
    </div>
  )
}
