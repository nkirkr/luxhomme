import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
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

const FEATURED: BlogPost = {
  id: 'featured',
  slug: 'new-products',
  title: 'Новые продукты\nLuxhommè',
  description:
    'В планах: аэрогриль, усовершенствованная виброплатформа и рожковая кофемашина — для настоящего эспрессо',
  image: '/images/blog-banner.jpg',
  tag: 'Новая статья',
}

const POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'philosophy-of-comfort',
    title: 'Философия уюта',
    description: 'Как Luxhomme помогает заботиться о себе',
    image: '/images/blog-card-big.jpg',
  },
  {
    id: '2',
    slug: 'products-luxhomme-1',
    title: 'Продукты\nLuxhommè',
    description: 'Как Luxhommè вдохновляет на заботу о себе',
    image: '/images/blog-card-small.jpg',
  },
  {
    id: '3',
    slug: 'products-luxhomme-2',
    title: 'Продукты\nLuxhommè',
    description: 'Как Luxhommè вдохновляет на заботу о себе',
    image: '/images/blog-card-small.jpg',
  },
  {
    id: '4',
    slug: 'philosophy-of-comfort-2',
    title: 'Философия уюта',
    description: 'Как Luxhomme помогает заботиться о себе',
    image: '/images/blog-card-big.jpg',
  },
  {
    id: '5',
    slug: 'products-luxhomme-3',
    title: 'Продукты\nLuxhommè',
    description: 'Как Luxhommè вдохновляет на заботу о себе',
    image: '/images/blog-card-small.jpg',
  },
  {
    id: '6',
    slug: 'products-luxhomme-4',
    title: 'Продукты\nLuxhommè',
    description: 'Как Luxhommè вдохновляет на заботу о себе',
    image: '/images/blog-card-small.jpg',
  },
]

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
        <p className={styles.cardLargeTitle}>{post.title}</p>
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

export default function BlogPage() {
  const rows: { large: BlogPost; smalls: BlogPost[] }[] = []
  for (let i = 0; i < POSTS.length; i += 3) {
    const large = POSTS[i]
    const smalls = POSTS.slice(i + 1, i + 3)
    rows.push({ large, smalls })
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        {/* Featured hero banner */}
        <div className={styles.heroBanner}>
          <div className={styles.heroBannerBg} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FEATURED.image} alt="" />
            <div className={styles.heroBannerOverlay} />
          </div>

          <div className={styles.heroBannerContent}>
            <span className={styles.heroBadge}>{FEATURED.tag}</span>
          </div>

          <div className={styles.heroBottom}>
            <h1 className={styles.heroTitle}>
              {FEATURED.title.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
            <p className={styles.heroDescription}>{FEATURED.description}</p>
          </div>
        </div>

        {/* Card rows */}
        {rows.map((row, i) => (
          <CardRow key={i} large={row.large} smalls={row.smalls} />
        ))}
      </div>
    </div>
  )
}
