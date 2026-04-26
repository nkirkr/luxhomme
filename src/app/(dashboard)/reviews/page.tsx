'use client'

import { useEffect, useState } from 'react'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { fetchDashboardReviews, updateDashboardReview } from '@/lib/dashboard/api-client'
import type { DashboardReview } from '@/lib/dashboard/types'
import { AnimatePresence, motion } from 'motion/react'
import { DashboardShell } from '../DashboardShell'
import styles from '../dashboard.module.css'

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

function InteractiveStars({ rating, onChange }: { rating: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className={styles.modalStars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={styles.modalStarBtn}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          aria-label={`${i} звезда`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={(hovered || rating) >= i ? '/icons/star-filled.svg' : '/icons/star-empty.svg'}
            alt=""
          />
        </button>
      ))}
    </div>
  )
}

interface EditModalProps {
  review: DashboardReview
  onClose: () => void
  onSave: (id: number, rating: number, text: string) => Promise<void>
}

function EditModal({ review, onClose, onSave }: EditModalProps) {
  const [rating, setRating] = useState(review.rating)
  const [comment, setComment] = useState(review.text)
  const [photo, setPhoto] = useState(review.photo)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(review.id, rating, comment)
      onClose()
    } catch {
      setSaving(false)
    }
  }

  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Редактировать</h3>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Закрыть">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.modalPhotoDeleteIcon} src="/icons/close-modal.svg" alt="" />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Upload button */}
          <button className={styles.modalUploadBtn} type="button">
            Загрузить файл
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.modalUploadIcon} src="/icons/upload.svg" alt="" />
          </button>

          {/* Photo preview */}
          {photo && (
            <div className={styles.modalPhotoWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" />
              <button
                className={styles.modalPhotoDeleteBtn}
                type="button"
                onClick={() => setPhoto('')}
                aria-label="Удалить фото"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.modalPhotoDeleteIcon} src="/icons/trash-modal.svg" alt="" />
              </button>
            </div>
          )}

          {/* Rating */}
          <div className={styles.modalRatingSection}>
            <p className={styles.modalRatingLabel}>Поставьте оценку</p>
            <InteractiveStars rating={rating} onChange={setRating} />
          </div>

          {/* Comment */}
          <div className={styles.modalCommentBox}>
            <p className={styles.modalCommentLabel}>Напишите комментарий</p>
            <textarea
              className={styles.modalCommentInput}
              placeholder="Введите текст"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Save */}
        <button
          className={styles.modalSaveBtn}
          type="button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<DashboardReview[]>([])
  const [loading, setLoading] = useState(true)
  const [editingReview, setEditingReview] = useState<DashboardReview | null>(null)
  useBodyScrollLock(!!editingReview)

  useEffect(() => {
    fetchDashboardReviews()
      .then((res) => setReviews(res.reviews))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSaveReview = async (id: number, rating: number, text: string) => {
    await updateDashboardReview(id, { rating, text })
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, rating, text } : r)))
  }

  return (
    <DashboardShell loading={loading}>
      <div className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>Отзывы</h2>

        <div className={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewItemTop}>
                <Stars count={review.rating} />
                <button className={styles.reviewEditLink} onClick={() => setEditingReview(review)}>
                  Редактировать отзыв
                </button>
                <span className={styles.reviewDate}>{review.date}</span>
                {review.source !== 'site' && (
                  <div className={styles.reviewOzon}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/icons/${review.source}-logo.svg`} alt={review.source} />
                  </div>
                )}
              </div>

              {review.text && <p className={styles.reviewBody}>{review.text}</p>}
              {review.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={review.photo} alt="" className={styles.reviewPhoto} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {editingReview && (
            <EditModal
              review={editingReview}
              onClose={() => setEditingReview(null)}
              onSave={handleSaveReview}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  )
}
