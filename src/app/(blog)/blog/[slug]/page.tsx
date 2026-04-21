import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import {
  fetchWpPostBySlug,
  fetchWpPostsPublished,
  formatWpPostDate,
  stripWpRendered,
  wordpressRestBaseUrl,
  type WpRestPostDetail,
  type WpRestPostSummary,
} from '@/lib/wordpress-rest/posts'
import { titleWithLuxhommeBreak } from '../blog-titles'
import styles from './article.module.css'

interface ArticleData {
  slug: string
  date: string
  title: string
  lead: string
  sections: { subtitle: string; paragraphs: string[] }[]
  image: string
  /** HTML из WordPress `content.rendered` */
  bodyHtml?: string
}

const ARTICLES: Record<string, ArticleData> = {
  'new-products': {
    slug: 'new-products',
    date: '30.06.2025',
    title: 'Новые продукты\nLuxhommè',
    lead: 'В планах: аэрогриль, усовершенствованная виброплатформа и рожковая кофемашина — для настоящего эспрессо',
    image: '/images/blog-banner.jpg',
    sections: [
      {
        subtitle: 'Скоро в вашем доме: новые помощники от Luxhommè',
        paragraphs: [
          'На подходе новые помощники, которые помогут сделать каждый день проще и приятнее. Виброплатформа Luxhommè заботливо поддержит ваш тонус, даря энергию и легкость. Новый аэрогриль превратит готовку в удовольствие, наполняя кухню ароматами, которые собирают семью за столом. А рожковая кофемашина подарит идеальный кофе, чтобы каждое утро начиналось с радости и вдохновения.',
        ],
      },
      {
        subtitle: 'Luxhommè — легкость, которая вдохновляет',
        paragraphs: [
          'Мы хотим, чтобы вы чувствовали свободу, зная, что заботу о доме берет на себя техника. Новые продукты помогут! Узнайте больше о нашей технике в разделе «Продукты» и следите за обновлениями.',
          'Какие новинки ждете? Делитесь в комментариях и следите за анонсами в нашем telegram-канале. Luxhommè делает повседневность светлее, теплее и заботливее.',
        ],
      },
    ],
  },
  'philosophy-of-comfort': {
    slug: 'philosophy-of-comfort',
    date: '25.06.2025',
    title: 'Философия уюта',
    lead: 'Как Luxhomme помогает заботиться о себе',
    image: '/images/blog-card-big.jpg',
    sections: [
      {
        subtitle: 'Что значит уют для Luxhommè',
        paragraphs: [
          'Мы верим, что уют — это не только красивый интерьер. Это чувство, когда каждый предмет в доме заботится о вас.',
        ],
      },
    ],
  },
}

/** Доп. пункты, если из WP пришло меньше трёх карточек (картинка — только заглушка). */
const RELATED_PAD: { slug: string; title: string; image: string }[] = [
  {
    slug: 'rituals-for-everyone',
    title: 'Ритуалы для каждого',
    image: '/images/blog-related-card.jpg',
  },
]

const RELATED_IMAGE_FALLBACK = '/images/blog-related-card.jpg'

const DEFAULT_ARTICLE: ArticleData = ARTICLES['new-products']

type RelatedCard = { slug: string; title: string; image: string }

function staticRelatedFromArticles(excludeSlug: string): RelatedCard[] {
  return Object.values(ARTICLES)
    .filter((a) => a.slug !== excludeSlug)
    .map((a) => ({
      slug: a.slug,
      title: a.title.replace(/\n/g, ' '),
      image: a.image,
    }))
}

function mergeRelatedUnique(
  primary: RelatedCard[],
  pad: RelatedCard[],
  excludeSlug: string,
): RelatedCard[] {
  const out: RelatedCard[] = []
  const seen = new Set<string>()
  for (const p of primary) {
    if (p.slug === excludeSlug || seen.has(p.slug)) continue
    out.push(p)
    seen.add(p.slug)
    if (out.length >= 3) return out
  }
  for (const p of pad) {
    if (p.slug === excludeSlug || seen.has(p.slug)) continue
    out.push(p)
    seen.add(p.slug)
    if (out.length >= 3) return out
  }
  return out
}

async function loadRelatedCards(excludeSlug: string): Promise<RelatedCard[]> {
  const staticFirst = staticRelatedFromArticles(excludeSlug)

  if (!wordpressRestBaseUrl()) {
    return mergeRelatedUnique(staticFirst, RELATED_PAD, excludeSlug)
  }

  try {
    const posts = await fetchWpPostsPublished({ limit: 50 })
    const fromWp: RelatedCard[] = posts
      .filter((p) => p.slug !== excludeSlug)
      .slice(0, 6)
      .map((p: WpRestPostSummary) => ({
        slug: p.slug,
        title: p.title,
        image: p.featuredImageUrl || RELATED_IMAGE_FALLBACK,
      }))
    return mergeRelatedUnique(fromWp, [...staticFirst, ...RELATED_PAD], excludeSlug).slice(0, 3)
  } catch {
    return mergeRelatedUnique(staticFirst, RELATED_PAD, excludeSlug)
  }
}

function truncate(s: string, max: number): string {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1).trim()}…`
}

function wpPostToArticle(wp: WpRestPostDetail): ArticleData {
  const plain = stripWpRendered(wp.contentHtml)
  const lead = wp.excerpt.trim() ? wp.excerpt : truncate(plain, 420)
  return {
    slug: wp.slug,
    date: formatWpPostDate(wp.date),
    title: titleWithLuxhommeBreak(wp.title),
    lead,
    sections: [],
    image: wp.featuredImageUrl || '/images/blog-banner.jpg',
    bodyHtml: wp.contentHtml,
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const staticArticle = ARTICLES[slug]
  if (staticArticle) {
    return {
      title: `${staticArticle.title.replace('\n', ' ')} | Luxhommè`,
      description: staticArticle.lead,
    }
  }
  const wp = await fetchWpPostBySlug(slug)
  if (wp) {
    const t = titleWithLuxhommeBreak(wp.title).replace(/\n/g, ' ')
    const desc = wp.excerpt.trim() || truncate(stripWpRendered(wp.contentHtml), 160)
    return { title: `${t} | Luxhommè`, description: desc }
  }
  return {
    title: `${DEFAULT_ARTICLE.title.replace('\n', ' ')} | Luxhommè`,
    description: DEFAULT_ARTICLE.lead,
  }
}

function BackButton() {
  return (
    <Link href="/blog" className={styles.backBtn}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/arrow-left-black.svg"
        alt=""
        className={styles.backBtnIcon}
        aria-hidden="true"
      />
      <span className={styles.backBtnLabel}>Назад</span>
    </Link>
  )
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const wp = await fetchWpPostBySlug(slug)
  const article = ARTICLES[slug] ?? (wp ? wpPostToArticle(wp) : DEFAULT_ARTICLE)
  const relatedCards = await loadRelatedCards(slug)

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        <div className={styles.heroBanner}>
          <div className={styles.heroBannerBg} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.image} alt="" />
            <div className={styles.heroBannerOverlay} />
          </div>

          <div className={styles.heroInner}>
            <p className={styles.heroDate}>{article.date}</p>
            <h1 className={styles.heroTitle}>
              {article.title.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div className={styles.article}>
          <div className={styles.articleText}>
            {!article.bodyHtml ? <p className={styles.articleLead}>{article.lead}</p> : null}

            {article.bodyHtml ? (
              <div
                className={styles.articleHtml}
                // контент с доверенного WordPress
                dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
              />
            ) : (
              article.sections.map((section, i) => (
                <div key={i} className={styles.articleBlock}>
                  <h2 className={styles.articleSubtitle}>{section.subtitle}</h2>
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className={styles.articleParagraph}>
                      {p}
                    </p>
                  ))}
                </div>
              ))
            )}
          </div>

          <BackButton />
        </div>

        <div className={styles.divider} />

        <div className={styles.relatedSection}>
          <div className={styles.relatedBlock}>
            <h3 className={styles.relatedTitle}>Свежие записи:</h3>
            <div className={styles.relatedCards}>
              {relatedCards.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.relatedCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt="" />
                  <p className={styles.relatedCardTitle}>{post.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
