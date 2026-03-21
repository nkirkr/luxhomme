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
  brand,
  sku,
  ratingValue,
  reviewCount,
  returnPolicy,
  shippingDetails,
}: {
  name: string
  description: string
  image: string | string[]
  url: string
  price: number
  currency?: string
  availability?: string
  brand?: string
  sku?: string
  ratingValue?: number
  reviewCount?: number
  returnPolicy?: {
    applicableCountry: string
    returnPolicyCategory: string
    merchantReturnDays: number
    returnMethod: string
  }
  shippingDetails?: {
    shippingRate: { value: number; currency: string }
    shippingDestination: string
    deliveryTime: { minDays: number; maxDays: number }
  }
}) {
  const data: Record<string, unknown> = {
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
      url,
      ...(returnPolicy && {
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: returnPolicy.applicableCountry,
          returnPolicyCategory: `https://schema.org/${returnPolicy.returnPolicyCategory}`,
          merchantReturnDays: returnPolicy.merchantReturnDays,
          returnMethod: `https://schema.org/${returnPolicy.returnMethod}`,
        },
      }),
      ...(shippingDetails && {
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: shippingDetails.shippingRate.value,
            currency: shippingDetails.shippingRate.currency,
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: shippingDetails.shippingDestination,
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: shippingDetails.deliveryTime.minDays,
              maxValue: shippingDetails.deliveryTime.maxDays,
              unitCode: 'DAY',
            },
          },
        },
      }),
    },
  }

  if (brand) {
    data.brand = { '@type': 'Brand', name: brand }
  }

  if (sku) {
    data.sku = sku
  }

  if (ratingValue && reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
    }
  }

  return <JsonLd data={data} />
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url?: string }> }) {
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

export function CollectionPageJsonLd({
  name,
  description,
  url,
  numberOfItems,
}: {
  name: string
  description: string
  url: string
  numberOfItems?: number
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
        url,
        ...(numberOfItems != null && { numberOfItems }),
      }}
    />
  )
}

export function ItemListJsonLd({
  name,
  items,
  url,
}: {
  name: string
  items: Array<{ url: string; name: string; position: number; image?: string }>
  url?: string
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        ...(url && { url }),
        itemListElement: items.map((item) => ({
          '@type': 'ListItem',
          position: item.position,
          name: item.name,
          url: item.url,
          ...(item.image && { image: item.image }),
        })),
      }}
    />
  )
}

export function HowToJsonLd({
  name,
  description,
  steps,
  totalTime,
  image,
}: {
  name: string
  description: string
  steps: Array<{ name: string; text: string; image?: string; url?: string }>
  totalTime?: string
  image?: string
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        description,
        ...(totalTime && { totalTime }),
        ...(image && { image }),
        step: steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
          ...(step.image && { image: step.image }),
          ...(step.url && { url: step.url }),
        })),
      }}
    />
  )
}

export function LocalBusinessJsonLd({
  name,
  description,
  url,
  phone,
  email,
  address,
  geo,
  openingHours,
  image,
  priceRange,
}: {
  name: string
  description?: string
  url: string
  phone?: string
  email?: string
  address: {
    street: string
    city: string
    region?: string
    postalCode: string
    country: string
  }
  geo?: { latitude: number; longitude: number }
  openingHours?: string[]
  image?: string
  priceRange?: string
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name,
        ...(description && { description }),
        url,
        ...(phone && { telephone: phone }),
        ...(email && { email }),
        ...(image && { image }),
        ...(priceRange && { priceRange }),
        address: {
          '@type': 'PostalAddress',
          streetAddress: address.street,
          addressLocality: address.city,
          ...(address.region && { addressRegion: address.region }),
          postalCode: address.postalCode,
          addressCountry: address.country,
        },
        ...(geo && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: geo.latitude,
            longitude: geo.longitude,
          },
        }),
        ...(openingHours && { openingHoursSpecification: openingHours }),
      }}
    />
  )
}

export function VideoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
}: {
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  contentUrl?: string
  embedUrl?: string
  duration?: string
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name,
        description,
        thumbnailUrl,
        uploadDate,
        ...(contentUrl && { contentUrl }),
        ...(embedUrl && { embedUrl }),
        ...(duration && { duration }),
      }}
    />
  )
}
