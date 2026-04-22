import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { acfTrimmedString } from '@/lib/wordpress-rest/acf-helpers'
import { fetchWpPageBySlug, wpAcfRecord } from '@/lib/wordpress-rest/pages'
import { ContactMap } from './ContactMap'
import styles from './contact.module.css'

const YANDEX_MAPS_API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY ?? ''

const DEFAULT_MAP_CENTER: [number, number] = [49.1831, 55.7878]
const DEFAULT_MAP_ZOOM = 16

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value.trim().replace(',', '.'))
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

const CONTACT_PAGE_SLUG =
  (process.env.WORDPRESS_CONTACT_PAGE_SLUG ?? 'contacts').trim() || 'contacts'

export const metadata: Metadata = {
  title: 'Контакты | Luxhommè',
  description: 'Контактная информация Luxhommè: адрес, телефон, email, социальные сети.',
}

function phoneTelHref(display: string): string {
  const digits = display.replace(/\D/g, '')
  if (!digits) return 'tel:'
  if (digits.length === 11 && digits.startsWith('8')) return `tel:+7${digits.slice(1)}`
  if (digits.length === 11 && digits.startsWith('7')) return `tel:+${digits}`
  return `tel:+${digits}`
}

export default async function ContactPage() {
  const wpPage = await fetchWpPageBySlug(CONTACT_PAGE_SLUG)
  const acf = wpPage ? wpAcfRecord(wpPage.acf) : null

  const address =
    acfTrimmedString(acf?.contacts_address) ??
    '"АРТ центр", улица Николая Ершова, 62\nСоветский район, Казань, 420061'
  const site = acfTrimmedString(acf?.contacts_site) ?? 'luxhomme.store'
  const email = acfTrimmedString(acf?.contacts_email) ?? 'care@saudagar-group.com'
  const care = acfTrimmedString(acf?.contacts_care) ?? 't.me/LuxhommeServiceBot'
  const workTime = acfTrimmedString(acf?.contacts_time) ?? 'с 9:00 до 18:00 по МСК'
  const phoneDisplay = acfTrimmedString(acf?.contacts_phone) ?? '8 800 505 71 30'

  const lat = toNumber(acf?.contacts_lat)
  const lng = toNumber(acf?.contacts_lng)
  const mapCenter: [number, number] =
    lat !== undefined && lng !== undefined ? [lng, lat] : DEFAULT_MAP_CENTER
  const mapZoom = toNumber(acf?.contacts_zoom) ?? DEFAULT_MAP_ZOOM

  const telegramHref = acfTrimmedString(acf?.contacts_telegram_link) ?? 'https://t.me/luxhomme'
  const vkHref = acfTrimmedString(acf?.contacts_vk_link) ?? 'https://vk.com/luxhomme'
  const dzenHref = acfTrimmedString(acf?.contacts_dzen_link) ?? '#'

  const infoRows = [
    { label: 'Адрес', value: address },
    { label: 'Сайт', value: site },
    { label: 'Email', value: email },
    { label: 'Служба заботы', value: care },
    { label: 'Режим работы', value: workTime },
  ]

  const socials = [
    {
      id: 'telegram',
      href: telegramHref,
      icon: '/icons/social-telegram.svg',
      alt: 'Telegram',
      bordered: false,
    },
    {
      id: 'vk',
      href: vkHref,
      icon: '/icons/social-vk.svg',
      alt: 'ВКонтакте',
      bordered: false,
    },
    {
      id: 'dzen',
      href: dzenHref,
      icon: '/icons/social-other.svg',
      alt: 'Дзен',
      bordered: true,
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        <div className={styles.sectionTitle}>
          <h1 className={styles.heading}>Контакты</h1>
          <div className={styles.divider} />
        </div>

        <div className={styles.body}>
          <div className={styles.mapWrap}>
            <ContactMap
              apiKey={YANDEX_MAPS_API_KEY}
              center={mapCenter}
              zoom={mapZoom}
              title={address.replace(/\n/g, ', ')}
            />
          </div>

          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <div className={styles.infoRows}>
                {infoRows.map((row) => (
                  <div key={row.label} className={styles.infoRow}>
                    <p className={styles.infoLabel}>{row.label}</p>
                    <p className={styles.infoValue}>
                      {row.value.split('\n').map((line, i) => (
                        <span key={i}>
                          {i > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.phoneCard}>
                <p className={styles.phoneLabel}>
                  Контакты сервисной
                  <br />
                  службы
                </p>
                <a href={phoneTelHref(phoneDisplay)} className={styles.phoneNumber}>
                  {phoneDisplay}
                </a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.socialCard}>
                <p className={styles.socialLabel}>Мы в соцсетях</p>
                <div className={styles.socialIcons}>
                  {socials.map((s) =>
                    s.bordered ? (
                      <a
                        key={s.id}
                        href={s.href}
                        className={styles.socialIconBordered}
                        aria-label={s.alt}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.icon} alt={s.alt} />
                      </a>
                    ) : (
                      <a key={s.id} href={s.href} aria-label={s.alt}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.icon} alt={s.alt} className={styles.socialIcon} />
                      </a>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
