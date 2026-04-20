import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/json-ld'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { HeroSection } from '@/components/sections/hero/HeroSection'
import {
  SeriesCatalog,
  type Product as CatalogGridProduct,
} from '@/components/sections/series-catalog/SeriesCatalog'
import AboutSection from '@/components/sections/about/AboutSection'
import MarketplacesSection from '@/components/sections/marketplaces/MarketplacesSection'
import ClubSection from '@/components/sections/club/ClubSection'
import NewsSection from '@/components/sections/news/NewsSection'
import TelegramSection from '@/components/sections/telegram/TelegramSection'
import { getShop } from '@/lib/shop'
import { shopProductToCatalogCard } from '@/lib/shop/product-detail-ui'
import styles from './page.module.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://luxhomme.ru'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Luxhommè'

export default async function HomePage() {
  let homeCatalog: CatalogGridProduct[] | undefined
  try {
    const shop = await getShop()
    const { products } = await shop.getProducts({ limit: 6 })
    if (products.length > 0) {
      homeCatalog = products.map(shopProductToCatalogCard).slice(0, 6)
    }
  } catch {
    homeCatalog = undefined
  }

  return (
    <>
      <OrganizationJsonLd name={siteName} url={siteUrl} logo={`${siteUrl}/icons/logo.svg`} />
      <WebSiteJsonLd
        name={siteName}
        url={siteUrl}
        searchUrl={`${siteUrl}/search?q={search_term_string}`}
      />

      <SiteHeader />
      <HeroSection />

      {/* Page sections */}
      <div className={styles.content}>
        <SeriesCatalog catalogProducts={homeCatalog} />
        <AboutSection />
        <MarketplacesSection />
        <ClubSection />
        <NewsSection />
        <TelegramSection />
      </div>
    </>
  )
}
