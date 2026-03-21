# SEO и GEO оптимизация

> Полная инструкция по SEO и GEO: [docs/SEOinstruction.md](./SEOinstruction.md)

## Обзор

Проект включает комплексную поддержку SEO и GEO (Generative Engine Optimization). GEO оптимизирует контент для AI-поисковых систем (ChatGPT, Perplexity, Google AI Overviews, Yandex Neuro) в дополнение к традиционному поиску.

## SEO-утилиты (`src/lib/seo.ts`)

Хелперы для генерации метаданных:

| Функция                                      | Описание                          |
| -------------------------------------------- | --------------------------------- |
| `generateCanonicalUrl(path)`                 | Полный canonical URL              |
| `generateAlternateUrls(path, locales)`       | Hreflang-ссылки для i18n          |
| `generateProductMeta(product)`               | Metadata для товарных страниц     |
| `generateCategoryMeta(category, filters?)`   | Metadata для категорий/фасетов    |
| `generateArticleMeta(article)`               | Metadata для статей блога         |
| `generatePageMeta(title, description, path)` | Metadata для произвольных страниц |

Пример использования:

```typescript
import { generateCanonicalUrl, generateProductMeta } from '@/lib/seo'

// Canonical URL
const canonical = generateCanonicalUrl('/products/widget')

// Метаданные товара для generateMetadata()
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  return generateProductMeta({
    name: product.name,
    description: product.description,
    price: product.price,
    currency: 'RUB',
    image: product.image,
    slug: product.slug,
    brand: product.brand,
  })
}
```

## Метаданные

### Root Layout (`src/app/layout.tsx`)

Устанавливает метаданные по умолчанию:

- `metadataBase` — базовый URL
- `title.template` — шаблон `%s | Site Name`
- `alternates.canonical` — canonical URL главной страницы
- `alternates.languages` — hreflang при включённом i18n
- OpenGraph и Twitter card по умолчанию
- Директивы для Google Bot

### Canonical URLs

Все страницы имеют `alternates.canonical` через `generateCanonicalUrl()`:

- About, Contact, Search — статический canonical
- Blog, Products — canonical на списочных страницах
- Blog/[slug], Products/[slug] — динамический canonical
- CMS-страницы ([...slug]) — canonical из slug

### Dynamic Metadata (`generateMetadata`)

Используется на страницах с динамическим контентом:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await cms.getPostBySlug(slug)
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: generateCanonicalUrl(`/blog/${slug}`) },
    openGraph: { ... },
  }
}
```

## JSON-LD (структурированная разметка)

Файл: `src/components/seo/json-ld.tsx`

| Компонент              | Тип Schema.org                    | Где используется             |
| ---------------------- | --------------------------------- | ---------------------------- |
| `OrganizationJsonLd`   | Organization                      | Главная                      |
| `WebSiteJsonLd`        | WebSite + SearchAction            | Главная                      |
| `ArticleJsonLd`        | Article                           | Посты блога                  |
| `ProductJsonLd`        | Product + Offer + AggregateRating | Товары                       |
| `BreadcrumbJsonLd`     | BreadcrumbList                    | Страницы с хлебными крошками |
| `FAQJsonLd`            | FAQPage                           | Секции FAQ                   |
| `CollectionPageJsonLd` | CollectionPage                    | Категории/листинги           |
| `ItemListJsonLd`       | ItemList                          | Списки товаров               |
| `HowToJsonLd`          | HowTo + HowToStep                 | Инструкции                   |
| `LocalBusinessJsonLd`  | LocalBusiness                     | Страницы о компании          |
| `VideoObjectJsonLd`    | VideoObject                       | Видеоконтент                 |

### Расширенный ProductJsonLd

Поддерживает `brand`, `sku`, `aggregateRating`, `returnPolicy`, `shippingDetails`:

```typescript
<ProductJsonLd
  name={product.name}
  description={product.description}
  image={product.images}
  url={absoluteUrl(`/products/${product.slug}`)}
  price={product.price}
  currency="RUB"
  availability="InStock"
  brand="BrandName"
  sku="SKU-123"
  ratingValue={4.5}
  reviewCount={12}
  returnPolicy={{
    applicableCountry: 'RU',
    returnPolicyCategory: 'MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: 'ReturnByMail',
  }}
  shippingDetails={{
    shippingRate: { value: 0, currency: 'RUB' },
    shippingDestination: 'RU',
    deliveryTime: { minDays: 1, maxDays: 5 },
  }}
/>
```

## Sitemap (`src/app/sitemap.ts`)

Динамическая генерация. Покрытие:

- Статические маршруты: `/`, `/about`, `/contact`, `/search`
- Блог (при `FEATURE_BLOG=true`): `/blog` + `/blog/[slug]` из CMS
- CMS-страницы: динамические через `cms.getPages()`
- Магазин (при `FEATURE_SHOP=true`): `/products` + TODO для `/products/[slug]`

## Robots.txt (`src/app/robots.ts`)

Настроен с учётом AI-краулеров:

| User-Agent        | Правило                                                             | Причина                        |
| ----------------- | ------------------------------------------------------------------- | ------------------------------ |
| `*`               | Allow `/`, Disallow `/api/`, `/dashboard/`, `/admin/`, `/checkout/` | Стандартный краулинг           |
| `GPTBot`          | Allow `/`                                                           | С 2025 даёт обратные ссылки    |
| `ChatGPT-User`    | Allow `/`                                                           | Цитирование с атрибуцией       |
| `ClaudeBot`       | Allow `/`                                                           | Цитирование с ссылками         |
| `PerplexityBot`   | Allow `/`                                                           | Высокая конверсия трафика      |
| `Google-Extended` | Disallow `/`                                                        | Только обучение, без атрибуции |
| `Yandex`          | Allow `/`, Disallow служебные                                       | Yandex-специфичные правила     |

Дополнительно:

- `host` — директива для Yandex
- `sitemap` — ссылка на sitemap.xml

## OG-изображения (`src/app/opengraph-image.tsx`)

Edge-рендеринг OG-изображений (1200x630px). Расширяется через `opengraph-image.tsx` в любом сегменте маршрута.

## PWA-иконки

- `src/app/icon.tsx` — favicon 32x32
- `src/app/apple-icon.tsx` — Apple Touch Icon 180x180
- `src/app/pwa-icon-192/route.tsx` — PWA-иконка 192x192
- `src/app/pwa-icon-512/route.tsx` — PWA-иконка 512x512
- `src/app/manifest.ts` — Web Manifest с ссылками на PWA-иконки

## Core Web Vitals

- **LCP**: `next/image` с `priority`, `next/font` с `display: swap`
- **CLS**: width/height для изображений, skeleton-загрузки
- **INP**: Server Components по умолчанию, React Compiler
- **TTFB**: Standalone output, streaming с Suspense

Мониторинг Web Vitals: [docs/monitoring.md](./monitoring.md)

## Breadcrumbs (`src/components/seo/breadcrumbs.tsx`)

Визуальная навигация с парной JSON-LD разметкой `BreadcrumbList`. Используется на блоге, товарах и CMS-страницах.
