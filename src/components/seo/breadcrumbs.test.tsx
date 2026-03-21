import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { Breadcrumbs } from './breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders breadcrumb nav with correct labels', () => {
    const html = renderToString(
      React.createElement(Breadcrumbs, {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Widget' },
        ],
      }),
    )

    expect(html).toContain('Home')
    expect(html).toContain('Products')
    expect(html).toContain('Widget')
    expect(html).toContain('aria-label="Breadcrumb"')
  })

  it('renders links for non-last items with href', () => {
    const html = renderToString(
      React.createElement(Breadcrumbs, {
        items: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Team' },
        ],
      }),
    )

    // Home and About should be links, Team should be a span
    expect(html).toContain('href="/"')
    expect(html).toContain('href="/about"')
    // Last item should not be a link
    expect(html).toContain('Team</span>')
  })

  it('renders separator between items', () => {
    const html = renderToString(
      React.createElement(Breadcrumbs, {
        items: [{ label: 'Home', href: '/' }, { label: 'Page' }],
      }),
    )

    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('/')
  })

  it('includes BreadcrumbJsonLd with correct URLs', () => {
    const html = renderToString(
      React.createElement(Breadcrumbs, {
        items: [
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
        ],
      }),
    )

    expect(html).toContain('application/ld+json')
    expect(html).toContain('BreadcrumbList')
    expect(html).toContain('http://localhost:3000/')
    expect(html).toContain('http://localhost:3000/products')
  })

  it('handles single item', () => {
    const html = renderToString(
      React.createElement(Breadcrumbs, {
        items: [{ label: 'Home' }],
      }),
    )

    expect(html).toContain('Home')
    // No separator for single item
    expect(html).not.toContain('aria-hidden="true"')
  })
})
