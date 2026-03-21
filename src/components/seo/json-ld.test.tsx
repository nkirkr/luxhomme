import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import {
  JsonLd,
  OrganizationJsonLd,
  ArticleJsonLd,
  ProductJsonLd,
  BreadcrumbJsonLd,
  FAQJsonLd,
} from './json-ld'

function getJsonLdData(html: string): Record<string, unknown> {
  const match = html.match(/<script[^>]*>(.*?)<\/script>/s)
  const raw = match![1].replace(/\\u003c/g, '<')
  return JSON.parse(raw)
}

describe('JsonLd', () => {
  it('renders a script tag with JSON-LD data', () => {
    const html = renderToString(
      React.createElement(JsonLd, {
        data: { '@context': 'https://schema.org', '@type': 'Thing', name: 'Test' },
      }),
    )
    const data = getJsonLdData(html)

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@type']).toBe('Thing')
    expect(data['name']).toBe('Test')
  })

  it('escapes < characters for XSS prevention', () => {
    const html = renderToString(
      React.createElement(JsonLd, {
        data: { name: '<script>alert("xss")</script>' },
      }),
    )

    expect(html).not.toContain('<script>alert')
    expect(html).toContain('\\u003c')
  })
})

describe('OrganizationJsonLd', () => {
  it('renders Organization schema', () => {
    const html = renderToString(
      React.createElement(OrganizationJsonLd, {
        name: 'Test Corp',
        url: 'https://example.com',
        logo: 'https://example.com/logo.png',
        sameAs: ['https://twitter.com/test'],
      }),
    )
    const data = getJsonLdData(html)

    expect(data['@type']).toBe('Organization')
    expect(data['name']).toBe('Test Corp')
    expect(data['sameAs']).toEqual(['https://twitter.com/test'])
  })
})

describe('ArticleJsonLd', () => {
  it('renders Article schema', () => {
    const html = renderToString(
      React.createElement(ArticleJsonLd, {
        title: 'Test Article',
        description: 'Article description',
        url: 'https://example.com/blog/test',
        image: 'https://example.com/img.jpg',
        datePublished: '2025-01-15',
        authorName: 'Author',
        publisherName: 'Publisher',
        publisherLogo: 'https://example.com/logo.png',
      }),
    )
    const data = getJsonLdData(html)

    expect(data['@type']).toBe('Article')
    expect(data['headline']).toBe('Test Article')
    expect((data['author'] as Record<string, unknown>)['name']).toBe('Author')
  })
})

describe('ProductJsonLd', () => {
  it('renders Product schema with offer', () => {
    const html = renderToString(
      React.createElement(ProductJsonLd, {
        name: 'Widget',
        description: 'A widget',
        image: 'https://example.com/widget.jpg',
        url: 'https://example.com/products/widget',
        price: 29.99,
        currency: 'USD',
      }),
    )
    const data = getJsonLdData(html)

    expect(data['@type']).toBe('Product')
    expect(data['name']).toBe('Widget')

    const offers = data['offers'] as Record<string, unknown>
    expect(offers['price']).toBe(29.99)
    expect(offers['priceCurrency']).toBe('USD')
  })

  it('includes brand when provided', () => {
    const html = renderToString(
      React.createElement(ProductJsonLd, {
        name: 'Widget',
        description: 'A widget',
        image: 'https://example.com/widget.jpg',
        url: 'https://example.com/products/widget',
        price: 29.99,
        brand: 'Acme',
      }),
    )
    const data = getJsonLdData(html)

    expect((data['brand'] as Record<string, unknown>)['name']).toBe('Acme')
  })
})

describe('BreadcrumbJsonLd', () => {
  it('renders BreadcrumbList schema', () => {
    const html = renderToString(
      React.createElement(BreadcrumbJsonLd, {
        items: [
          { name: 'Home', url: 'https://example.com/' },
          { name: 'Products', url: 'https://example.com/products' },
          { name: 'Widget' },
        ],
      }),
    )
    const data = getJsonLdData(html)

    expect(data['@type']).toBe('BreadcrumbList')
    const items = data['itemListElement'] as Array<Record<string, unknown>>
    expect(items).toHaveLength(3)
    expect(items[0]['position']).toBe(1)
    expect(items[0]['name']).toBe('Home')
    expect(items[2]['item']).toBeUndefined()
  })
})

describe('FAQJsonLd', () => {
  it('renders FAQPage schema', () => {
    const html = renderToString(
      React.createElement(FAQJsonLd, {
        questions: [
          { question: 'What is this?', answer: 'A test.' },
          { question: 'Why?', answer: 'Because.' },
        ],
      }),
    )
    const data = getJsonLdData(html)

    expect(data['@type']).toBe('FAQPage')
    const questions = data['mainEntity'] as Array<Record<string, unknown>>
    expect(questions).toHaveLength(2)
    expect(questions[0]['name']).toBe('What is this?')
  })
})
