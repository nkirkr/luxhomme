interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  sameAs = [],
}: {
  name: string
  url: string
  logo: string
  sameAs?: string[]
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${url}/#org`,
        name,
        url,
        logo,
        sameAs,
      }}
    />
  )
}

export function WebSiteJsonLd({
  name,
  url,
  searchUrl,
}: {
  name: string
  url: string
  searchUrl?: string
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name,
    url,
    publisher: { '@id': `${url}/#org` },
  }

  if (searchUrl) {
    data.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl,
      },
      'query-input': 'required name=search_term_string',
    }
  }

  return <JsonLd data={data} />
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
  publisherName,
  publisherLogo,
}: {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
  authorName: string
  publisherName: string
  publisherLogo: string
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url,
        image,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
          '@type': 'Person',
          name: authorName,
        },
        publisher: {
          '@type': 'Organization',
          name: publisherName,
          logo: {
            '@type': 'ImageObject',
            url: publisherLogo,
          },
        },
      }}
    />
  )
}

export function ProductJsonLd({
  name,
  description,
  image,
  url,
  price,
  currency = 'USD',
  availability = 'InStock',
}: {
  name: string
  description: string
  image: string
  url: string
  price: number
  currency?: string
  availability?: string
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        description,
        image,
        url,
        offers: {
          '@type': 'Offer',
          price,
          priceCurrency: currency,
          availability: `https://schema.org/${availability}`,
        },
      }}
    />
  )
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url?: string }>
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          ...(item.url ? { item: item.url } : {}),
        })),
      }}
    />
  )
}

export function FAQJsonLd({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      }}
    />
  )
}
