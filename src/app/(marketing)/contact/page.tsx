import type { Metadata } from 'next'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Контакты | Luxhommè',
  description: 'Контактная информация Luxhommè: адрес, телефон, email, социальные сети.',
}

const INFO_ROWS = [
  {
    label: 'Адрес',
    value: '"АРТ центр", улица Николая Ершова, 62\nСоветский район, Казань, 420061',
  },
  { label: 'Сайт', value: 'luxhomme.store' },
  { label: 'Email', value: 'care@saudagar-group.com' },
  { label: 'Служба заботы', value: 't.me/LuxhommeServiceBot' },
  { label: 'Режим работы', value: 'с 9:00 до 18:00 по МСК' },
]

const SOCIALS = [
  {
    id: 'telegram',
    href: 'https://t.me/luxhomme',
    icon: '/icons/social-telegram.svg',
    alt: 'Telegram',
    bordered: false,
  },
  {
    id: 'vk',
    href: 'https://vk.com/luxhomme',
    icon: '/icons/social-vk.svg',
    alt: 'ВКонтакте',
    bordered: false,
  },
  { id: 'other', href: '#', icon: '/icons/social-other.svg', alt: 'Другое', bordered: true },
]

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        {/* Title */}
        <div className={styles.sectionTitle}>
          <div className={styles.divider} />
          <h1 className={styles.heading}>Контакты</h1>
          <div className={styles.divider} />
        </div>

        {/* Body: map + info */}
        <div className={styles.body}>
          {/* Map (as image) */}
          <div className={styles.mapWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/contacts-map.jpg"
              alt="Карта: АРТ центр, улица Николая Ершова, 62, Казань"
            />
          </div>

          {/* Info cards */}
          <div className={styles.infoCards}>
            {/* Main info */}
            <div className={styles.infoCard}>
              <div className={styles.infoRows}>
                {INFO_ROWS.map((row) => (
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

            {/* Phone */}
            <div className={styles.infoCard}>
              <div className={styles.phoneCard}>
                <p className={styles.phoneLabel}>
                  Контакты сервисной
                  <br />
                  службы
                </p>
                <a href="tel:88005057130" className={styles.phoneNumber}>
                  8 800 505 71 30
                </a>
              </div>
            </div>

            {/* Social */}
            <div className={styles.infoCard}>
              <div className={styles.socialCard}>
                <p className={styles.socialLabel}>Мы в соцсетях</p>
                <div className={styles.socialIcons}>
                  {SOCIALS.map((s) =>
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
