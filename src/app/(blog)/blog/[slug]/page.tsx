import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './article.module.css'

interface ArticleData {
  slug: string
  date: string
  title: string
  lead: string
  sections: { subtitle: string; paragraphs: string[] }[]
  image: string
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

const RELATED_POSTS = [
  {
    slug: 'new-products',
    title: 'Новые продукты Luxhommè',
    image: '/images/blog-related-card.jpg',
  },
  {
    slug: 'philosophy-of-comfort',
    title: 'Философия Уюта',
    image: '/images/blog-related-card.jpg',
  },
  {
    slug: 'rituals-for-everyone',
    title: 'Ритуалы для каждого',
    image: '/images/blog-related-card.jpg',
  },
]

const DEFAULT_ARTICLE: ArticleData = ARTICLES['new-products']

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES[slug] || DEFAULT_ARTICLE
  return {
    title: `${article.title.replace('\n', ' ')} | Luxhommè`,
    description: article.lead,
  }
}

function BackButton() {
  return (
    <Link href="/blog" className={styles.backBtn}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/arrow-left.svg" alt="" className={styles.backBtnIcon} aria-hidden="true" />
      <span className={styles.backBtnLabel}>Назад</span>
    </Link>
  )
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = ARTICLES[slug] || DEFAULT_ARTICLE

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        {/* Hero banner */}
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
            <BackButton />
          </div>
        </div>

        {/* Article body */}
        <div className={styles.article}>
          <div className={styles.articleText}>
            <p className={styles.articleLead}>{article.lead}</p>

            {article.sections.map((section, i) => (
              <div key={i} className={styles.articleBlock}>
                <h2 className={styles.articleSubtitle}>{section.subtitle}</h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j} className={styles.articleParagraph}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <BackButton />
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Related posts */}
        <div className={styles.relatedSection}>
          <div className={styles.searchBar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/search.svg" alt="" className={styles.searchIcon} aria-hidden="true" />
            <p className={styles.searchText}>Поиск</p>
          </div>

          <div className={styles.relatedBlock}>
            <h3 className={styles.relatedTitle}>Свежие записи:</h3>
            <div className={styles.relatedCards}>
              {RELATED_POSTS.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.relatedCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.image} alt={post.title} />
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
