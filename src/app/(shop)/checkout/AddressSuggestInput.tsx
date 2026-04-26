'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CheckoutAddressMeta, DadataAddressSuggestion } from '@/lib/dadata/types'
import { parseDadataAddress } from '@/lib/dadata/parse-address'
import styles from './checkout.module.css'

type AddressSuggestInputProps = {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  onMetaChange?: (meta: CheckoutAddressMeta | null) => void
  hint?: string
}

const DEBOUNCE_MS = 600

export const AddressSuggestInput = ({
  label,
  placeholder,
  value,
  onChange,
  onMetaChange,
  hint,
}: AddressSuggestInputProps) => {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<DadataAddressSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  /** После выбора из списка не дергаем suggest по тому же строковому значению (важно для React 18 Strict Mode). */
  const pickedValueRef = useRef<string | null>(null)
  const suggestRequestId = useRef(0)

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [])

  useEffect(() => {
    if (pickedValueRef.current !== null && value === pickedValueRef.current) {
      return
    }
    const q = value.trim()
    if (q.length < 2) {
      setItems([])
      setOpen(false)
      setLoading(false)
      return
    }

    const t = setTimeout(() => {
      const rid = ++suggestRequestId.current
      setLoading(true)
      setError(null)
      fetch('/api/dadata/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, count: 5 }),
      })
        .then(async (res) => {
          if (rid !== suggestRequestId.current) return
          const data = (await res.json()) as { suggestions?: DadataAddressSuggestion[] }
          if (!res.ok) {
            setItems([])
            setError('Подсказки временно недоступны')
            return
          }
          const list = data.suggestions ?? []
          setItems(list)
          setOpen(list.length > 0)
        })
        .catch(() => {
          if (rid !== suggestRequestId.current) return
          setItems([])
          setError('Подсказки временно недоступны')
        })
        .finally(() => {
          if (rid === suggestRequestId.current) setLoading(false)
        })
    }, DEBOUNCE_MS)

    return () => clearTimeout(t)
  }, [value])

  const handleSelect = useCallback(
    (s: DadataAddressSuggestion) => {
      const { hasHouse, meta } = parseDadataAddress(s.data)
      pickedValueRef.current = s.value
      onChange(s.value)
      if (!hasHouse) {
        setError('Укажите полный адрес с домом, чтобы мы смогли корректно рассчитать доставку')
        onMetaChange?.(null)
      } else {
        setError(null)
        onMetaChange?.(meta)
      }
      setOpen(false)
      setItems([])
    },
    [onChange, onMetaChange],
  )

  const handleInputChange = (v: string) => {
    pickedValueRef.current = null
    onChange(v)
    onMetaChange?.(null)
  }

  return (
    <div className={hint ? styles.inputWithHint : undefined}>
      <div ref={wrapRef} className={styles.addressSuggestWrap}>
        <div className={styles.inputGroup}>
          <p className={styles.inputLabel}>{label}</p>
          <input
            type="text"
            className={styles.inputField}
            placeholder={placeholder}
            name="luxhomme_address_query"
            id="luxhomme-checkout-address"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => items.length > 0 && setOpen(true)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        {open && (items.length > 0 || loading) ? (
          <ul className={styles.addressSuggestList} role="listbox">
            {loading && items.length === 0 ? (
              <li className={styles.addressSuggestItemMuted}>Поиск…</li>
            ) : null}
            {items.map((s, i) => (
              <li key={`${s.value}-${i}`} role="option">
                <button
                  type="button"
                  className={styles.addressSuggestBtn}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(s)}
                >
                  {s.value}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {hint ? <p className={styles.inputHint}>{hint}</p> : null}
      {error ? <p className={styles.addressSuggestError}>{error}</p> : null}
    </div>
  )
}
