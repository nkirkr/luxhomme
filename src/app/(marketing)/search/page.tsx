import type { Metadata } from 'next'
import { SearchContent } from './search-content'
import { generateCanonicalUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search our website',
  alternates: {
    canonical: generateCanonicalUrl('/search'),
  },
}

export default function SearchPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Search</h1>
      <SearchContent />
    </div>
  )
}
