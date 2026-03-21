'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface SearchResult {
  title: string
  url: string
  excerpt: string
  type: 'page' | 'post' | 'product'
}

export function SearchContent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!query.trim()) return

      setLoading(true)
      setSearched(true)

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.results ?? [])
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    },
    [query],
  )

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-8">
        <Input
          type="search"
          placeholder="Enter your search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-base"
        />
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="border-muted border-t-primary h-8 w-8 animate-spin rounded-full border-4" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">
          No results found for &quot;{query}&quot;
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, i) => (
            <Link
              key={i}
              href={result.url}
              className="hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium capitalize">
                  {result.type}
                </span>
                <h3 className="font-medium">{result.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{result.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
