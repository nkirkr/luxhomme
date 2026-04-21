import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import {
  fetchWpPostsPublished,
  wordpressRestBaseUrl,
  type WpRestPostSummary,
} from '@/lib/wordpress-rest/posts'
import { titleWithLuxhommeBreak } from './blog-titles'
import styles from './blog.module.css'

export const metadata: Metadata = {
  title: 'Академия | Luxhommè',
  description: 'Статьи, новости и полезные материалы от Luxhommè.',
}

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  image: string
  tag?: string
}

const FALLBACK_HERO: BlogPost = {
  id: 'featured',
  slug: 'new-products',
  title: 'Новые продукты\nLuxhommè',
  description:
    'В планах: аэрогриль, усовершенствованная виброплатформа и рожковая кофемашина — для настоящего эспрессо',
  image: '/images/blog-banner.jpg',
  tag: 'Новая статья',
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'philosophy-of-comfort',
    title: 'Философия уюта',
    description: 'Как Luxhomme помогает заботиться о себе',
    image: '/images/blog-card-big.jpg',
  },
  {
    id: '2',
    slug: 'products-luxhomme-1',
    title: 'Продукты\nLuxhommè',
    description: 'Как Luxhommè вдохновляет на заботу о себе',
    image: '/images/blog-card-small.jpg',
  },
  {
    id: '3',
    slug: 'products-luxhomme-2',
    title: 'Продукты\nLuxhommè',
    description: 'Как Luxhommè вдохновляет на заботу о себе',
    image: '/images/blog-card-small.jpg',
  },
  {
    id: '4',
    slug: 'philosophy-of-comfort-2',
    title: 'Философия уюта',
    description: 'Как Luxhomme помогает заботиться о себе',
    image: '/images/blog-card-big.jpg',
  },
  {
    id: '5',
    slug: 'products-luxhomme-3',
    title: 'Продукты\nLuxhommè',
    description: 'Как Luxhommè вдохновляет на заботу о себе',
    image: '/images/blog-card-small.jpg',
  },
  {
    id: '6',
    slug: 'products-luxhomme-4',
    title: 'Продукты\nLuxhommè',
    description: 'Как Luxhommè вдохновляет на заботу о себе',
    image: '/images/blog-card-small.jpg',
  },
]

function isHeroWpPost(p: WpRestPostSummary): boolean {
  if (p.slug === 'new-products') return true
  if (/novye-produkty/i.test(p.slug)) return true
  const t = p.title.toLowerCase()
  return t.includes('новые продукты') && (t.includes('luxhom') || t.includes('люкс'))
}

function pickHeroPost(posts: WpRestPostSummary[]): WpRestPostSummary | undefined {
  return posts.find(isHeroWpPost) ?? posts[0]
}

function truncate(s: string, max: number): string {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trim()}…`
}

function wpSummaryToBlogPost(p: WpRestPostSummary, size: 'hero' | 'large' | 'small'): BlogPost {
  const fallback =
    size === 'hero'
      ? '/images/blog-banner.jpg'
      : size === 'large'
        ? '/images/blog-card-big.jpg'
        : '/images/blog-card-small.jpg'
  const excerpt = p.excerpt.trim()
  return {
    id: String(p.id),
    slug: p.slug,
    title: titleWithLuxhommeBreak(p.title),
    description: excerpt ? truncate(excerpt, 220) : '',
    image: p.featuredImageUrl || fallback,
    ...(size === 'hero' ? { tag: 'Новая статья' } : {}),
  }
}

function SmallCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.cardSmall}>
      <div className={styles.cardSmallImage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title.replace('\n', ' ')} />
      </div>
      <div className={styles.cardSmallBody}>
        <p className={styles.cardSmallTitle}>
          {post.title.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        <p className={styles.cardSmallDesc}>{post.description}</p>
      </div>
    </Link>
  )
}

function LargeCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.cardLarge}>
      <div className={styles.cardLargeBg} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt="" />
        <div className={styles.cardLargeOverlay} />
      </div>
      <div className={styles.cardLargeContent}>
        <p className={styles.cardLargeTitle}>
          {post.title.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        <p className={styles.cardLargeDesc}>
          {post.description.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
    </Link>
  )
}

function CardRow({ large, smalls }: { large: BlogPost; smalls: BlogPost[] }) {
  return (
    <div className={styles.cardRow}>
      <LargeCard post={large} />
      <div className={styles.cardsSmall}>
        {smalls.map((post) => (
          <SmallCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default async function BlogPage() {
  let wpPosts: WpRestPostSummary[] = []
  const restBase = wordpressRestBaseUrl()
  try {
    if (!restBase) {
      console.warn(
        '[blog] WP REST: задайте WORDPRESS_REST_URL, WOOCOMMERCE_URL или WORDPRESS_GRAPHQL_URL — записи не запрашивались',
      )
    } else {
      wpPosts = await fetchWpPostsPublished({ limit: 50 })
      console.log('[blog] WP REST posts', { base: restBase, count: wpPosts.length })
    }
  } catch (e) {
    console.error('[blog] WP REST posts fetch failed:', e)
  }

  const useWp = wpPosts.length > 0
  const heroWp = useWp ? pickHeroPost(wpPosts) : undefined
  const hero: BlogPost = useWp && heroWp ? wpSummaryToBlogPost(heroWp, 'hero') : FALLBACK_HERO

  const restWp = useWp && heroWp ? wpPosts.filter((p) => p.id !== heroWp.id) : []
  const gridPosts: BlogPost[] =
    restWp.length > 0
      ? restWp.map((p, i) => wpSummaryToBlogPost(p, i % 3 === 0 ? 'large' : 'small'))
      : FALLBACK_POSTS

  const rows: { large: BlogPost; smalls: BlogPost[] }[] = []
  for (let i = 0; i < gridPosts.length; i += 3) {
    const large = gridPosts[i]
    const smalls = gridPosts.slice(i + 1, i + 3)
    if (large) rows.push({ large, smalls })
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        <Link
          href={`/blog/${hero.slug}`}
          className={`${styles.heroBanner} ${styles.heroBannerLink}`}
        >
          <div className={styles.heroBannerBg} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.image} alt="" />
            <div className={styles.heroBannerOverlay} />
          </div>

          <div className={styles.heroBannerContent}>
            {hero.tag ? <span className={styles.heroBadge}>{hero.tag}</span> : null}
          </div>

          <div className={styles.heroBottom}>
            <h1 className={styles.heroTitle}>
              {hero.title.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
            <p className={styles.heroDescription}>{hero.description}</p>
          </div>
        </Link>

        {rows.map((row, i) => (
          <CardRow key={`${row.large.id}-${i}`} large={row.large} smalls={row.smalls} />
        ))}
      </div>
    </div>
  )
}
