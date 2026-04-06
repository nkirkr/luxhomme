import type { Metadata } from 'next'
import { DashboardShell } from '../DashboardShell'
import styles from '../dashboard.module.css'

export const metadata: Metadata = {
  title: 'Отзывы | Luxhommè',
}

const REVIEWS = [
  {
    rating: 4,
    date: '29 марта 2026',
    text: '',
    photo: '',
  },
  {
    rating: 4,
    date: '29 марта 2026',
    text: 'Купила аэрогриль и осталась очень довольна, очень быстро готовит пищу.',
    photo: '/images/product-review-photo.jpg',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className={styles.reviewStars}>
      {[1, 2, 3, 4, 5].map((i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={i <= count ? '/icons/star-filled.svg' : '/icons/star-empty.svg'} alt="" />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <DashboardShell>
      <h2 className={styles.reviewsTitle}>Отзывы</h2>

      <div className={styles.reviewsList}>
        {REVIEWS.map((review, i) => (
          <div key={i} className={styles.reviewItem}>
            <div className={styles.reviewItemTop}>
              <Stars count={review.rating} />
              <span className={styles.reviewEditLink}>Редактировать отзыв</span>
              <span className={styles.reviewDate}>{review.date}</span>
              <div className={styles.reviewOzon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/ozon-logo.svg" alt="Ozon" />
              </div>
            </div>

            {review.text && <p className={styles.reviewBody}>{review.text}</p>}
            {review.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={review.photo} alt="" className={styles.reviewPhoto} />
            )}
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
