'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import { useCart, type CartItem } from '@/lib/cart/CartContext'
import {
  validateEmail,
  validateFullName,
  validateRussianPhone,
} from '@/lib/checkout/contact-validation'
import type { CheckoutAddressMeta } from '@/lib/dadata/types'
import { AddressSuggestInput } from './AddressSuggestInput'
import styles from './checkout.module.css'

type DeliveryMethod = 'courier' | 'pickup'
type PaymentMethod = 'card' | 'split'

type ContactFieldErrors = {
  name?: string
  email?: string
  phone?: string
}

const MOCK_ITEMS: CartItem[] = [
  {
    id: 'mock-1',
    name: 'Аэрогриль Luxhommè AirChief',
    price: 23000,
    priceFormatted: '23 000 ₽',
    image: '/images/product-card.png',
    href: '/products/airgrill',
    qty: 3,
  },
  {
    id: 'mock-2',
    name: 'Аэрогриль Luxhommè AirChief',
    price: 23000,
    priceFormatted: '23 000 ₽',
    image: '/images/product-card.png',
    href: '/products/airgrill',
    qty: 3,
  },
]

function CheckoutInput({
  label,
  placeholder,
  value,
  onChange,
  hint,
  error,
  onBlur,
  autoComplete,
  inputType = 'text',
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  hint?: string
  error?: string
  onBlur?: () => void
  autoComplete?: string
  inputType?: 'text' | 'email' | 'tel'
}) {
  const showHintBlock = Boolean(hint || error)
  return (
    <div className={showHintBlock ? styles.inputWithHint : undefined}>
      <div className={`${styles.inputGroup} ${error ? styles.inputGroupHasError : ''}`}>
        <p className={styles.inputLabel}>{label}</p>
        <input
          type={inputType}
          className={styles.inputField}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
        />
      </div>
      {hint ? <p className={styles.inputHint}>{hint}</p> : null}
      {error ? <p className={styles.addressSuggestError}>{error}</p> : null}
    </div>
  )
}

function OrderCard({ items, totalFormatted }: { items: CartItem[]; totalFormatted: string }) {
  return (
    <div className={styles.orderCard}>
      <h2 className={styles.sectionTitle}>Ваш заказ</h2>

      <div className={styles.orderHeader}>
        <span>Товар</span>
        <span className={styles.orderHeaderTotal}>Итого</span>
      </div>

      <div className={styles.orderItems}>
        {items.map((item, idx) => (
          <div key={item.id + '-' + idx} className={styles.orderItem}>
            <div className={styles.orderItemLeft}>
              <div className={styles.orderItemImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className={styles.orderItemImgEl} />
                <div className={styles.orderItemImgOverlay} />
              </div>
              <div className={styles.orderItemContent}>
                <p className={styles.orderItemName}>
                  {item.name} &nbsp;× {item.qty} шт
                </p>
                <div className={styles.orderItemPriceRow}>
                  <p className={styles.orderItemPriceCurrent}>
                    {(item.price * item.qty).toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </div>
            </div>
            <p className={styles.orderItemPrice}>
              {(item.price * item.qty).toLocaleString('ru-RU')} ₽
            </p>
          </div>
        ))}
      </div>

      <div className={styles.orderDivider} />

      <div className={styles.orderTotal}>
        <span>ИТОГО</span>
        <span>{totalFormatted}</span>
      </div>
    </div>
  )
}

function DeliveryCard({
  delivery,
  setDelivery,
}: {
  delivery: DeliveryMethod
  setDelivery: (v: DeliveryMethod) => void
}) {
  return (
    <div className={styles.deliveryCard}>
      <div className={styles.deliveryOptions}>
        <h2 className={styles.sectionTitle}>Доставка</h2>

        <label className={styles.radioOption}>
          <div
            className={`${styles.radioCircle} ${delivery === 'courier' ? styles.radioCircleActive : ''}`}
          >
            <span className={styles.radioDot} />
          </div>
          <input
            type="radio"
            name="delivery"
            value="courier"
            checked={delivery === 'courier'}
            onChange={() => setDelivery('courier')}
            hidden
          />
          <div className={styles.radioContent}>
            <span className={styles.radioLabel}>Курьерская доставка Ozon (20.03.2026)</span>
            <span className={styles.radioSub}>Бесплатно</span>
          </div>
        </label>

        <label className={styles.radioOption}>
          <div
            className={`${styles.radioCircle} ${delivery === 'pickup' ? styles.radioCircleActive : ''}`}
          >
            <span className={styles.radioDot} />
          </div>
          <input
            type="radio"
            name="delivery"
            value="pickup"
            checked={delivery === 'pickup'}
            onChange={() => setDelivery('pickup')}
            hidden
          />
          <div className={styles.radioContent}>
            <span className={styles.radioLabel}>Пункт Ozon (20.03.2026)</span>
            <span className={styles.radioSub}>Бесплатно</span>
          </div>
        </label>
      </div>

      <div className={styles.cardDivider} />

      {delivery === 'pickup' && (
        <div className={styles.pickupInfo}>
          <p className={styles.pickupTitle}>Выбранный пункт выдачи:</p>
          <p className={styles.pickupAddress}>
            Россия, Татарстан Республика, Казань, улица Пример, 8
          </p>
          <p className={styles.pickupDistance}>Расстояние: 0.16 км</p>
          <button type="button" className={styles.pickupBtn}>
            Изменить пункт выдачи
          </button>
        </div>
      )}

      <div className={styles.infoNotice}>
        <svg className={styles.infoIcon} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#FF005A" strokeWidth="1.5" />
          <path d="M8 7v4M8 5.5v-.01" stroke="#FF005A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className={styles.infoText}>
          все статусы заказа и информацию для получения необходимо отслеживать в вашем личном
          кабинете Ozon
        </p>
      </div>
    </div>
  )
}

function PaymentCard({
  payment,
  setPayment,
  agreePolicy,
  setAgreePolicy,
  agreeMarketing,
  setAgreeMarketing,
  onPay,
}: {
  payment: PaymentMethod
  setPayment: (v: PaymentMethod) => void
  agreePolicy: boolean
  setAgreePolicy: (v: boolean) => void
  agreeMarketing: boolean
  setAgreeMarketing: (v: boolean) => void
  onPay: () => void
}) {
  return (
    <div className={styles.paymentCard}>
      <div className={styles.paymentOptions}>
        <h2 className={styles.sectionTitle}>Способ оплаты</h2>

        <label className={styles.radioOption}>
          <div
            className={`${styles.radioCircle} ${payment === 'card' ? styles.radioCircleActive : ''}`}
          >
            <span className={styles.radioDot} />
          </div>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={payment === 'card'}
            onChange={() => setPayment('card')}
            hidden
          />
          <span className={styles.paymentLabel}>С помощью карты любого банка</span>
        </label>

        <label className={styles.radioOption}>
          <div
            className={`${styles.radioCircle} ${payment === 'split' ? styles.radioCircleActive : ''}`}
          >
            <span className={styles.radioDot} />
          </div>
          <input
            type="radio"
            name="payment"
            value="split"
            checked={payment === 'split'}
            onChange={() => setPayment('split')}
            hidden
          />
          <span className={styles.paymentLabel}>Яндекс Сплит</span>
        </label>

        <label className={styles.checkboxOption}>
          <div
            className={`${styles.checkboxBox} ${agreePolicy ? styles.checkboxBoxChecked : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setAgreePolicy(!agreePolicy)
            }}
          >
            {agreePolicy && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4l3 3 5-6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className={styles.checkboxLabel}>
            Я согласен на обработку{' '}
            <Link href="/policy" target="_blank">
              персональных данных
            </Link>{' '}
            *
          </span>
        </label>

        <label className={styles.checkboxOption}>
          <div
            className={`${styles.checkboxBox} ${agreeMarketing ? styles.checkboxBoxChecked : ''}`}
            onClick={(e) => {
              e.preventDefault()
              setAgreeMarketing(!agreeMarketing)
            }}
          >
            {agreeMarketing && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4l3 3 5-6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className={styles.checkboxLabel}>Я согласен на получение рекламной рассылки</span>
        </label>
      </div>

      <div className={styles.cardDivider} />

      <button type="button" className={styles.payBtn} onClick={onPay}>
        Оплатить
      </button>
    </div>
  )
}

export function CheckoutClient() {
  const { items: cartItems, totalFormatted: cartTotal } = useCart()

  const displayItems = cartItems.length > 0 ? cartItems : MOCK_ITEMS
  const displayTotal =
    cartItems.length > 0
      ? cartTotal
      : displayItems.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString('ru-RU') + ' ₽'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contactErrors, setContactErrors] = useState<ContactFieldErrors>({})
  const [address, setAddress] = useState('')
  const [addressMeta, setAddressMeta] = useState<CheckoutAddressMeta | null>(null)
  const [note, setNote] = useState('')
  const [delivery, setDelivery] = useState<DeliveryMethod>('pickup')
  const [payment, setPayment] = useState<PaymentMethod>('card')
  const [agreePolicy, setAgreePolicy] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)

  const patchContactError = (key: keyof ContactFieldErrors, message: string | null) => {
    setContactErrors((prev) => {
      const next = { ...prev }
      if (message) next[key] = message
      else delete next[key]
      return next
    })
  }

  const handlePay = () => {
    const nameErr = validateFullName(name)
    const emailErr = validateEmail(email)
    const phoneErr = validateRussianPhone(phone)
    const nextErrors: ContactFieldErrors = {}
    if (nameErr) nextErrors.name = nameErr
    if (emailErr) nextErrors.email = emailErr
    if (phoneErr) nextErrors.phone = phoneErr
    if (Object.keys(nextErrors).length > 0) {
      setContactErrors(nextErrors)
      return
    }
    setContactErrors({})

    if (delivery === 'courier' && !addressMeta) {
      window.alert(
        'Для курьерской доставки выберите полный адрес из списка подсказок (с номером дома).',
      )
      return
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        {/* ── Left column (desktop) ── */}
        <div className={styles.leftCol}>
          <form
            className={styles.checkoutForm}
            autoComplete="off"
            noValidate
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.formRow}>
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>Оплата и доставка</h2>
                <CheckoutInput
                  label="Имя и Фамилия *"
                  placeholder="Введите имя и фамилию"
                  value={name}
                  onChange={(v) => {
                    setName(v)
                    patchContactError('name', null)
                  }}
                  onBlur={() => patchContactError('name', validateFullName(name))}
                  error={contactErrors.name}
                  autoComplete="name"
                />
                <CheckoutInput
                  label="Email *"
                  placeholder="Введите email"
                  value={email}
                  onChange={(v) => {
                    setEmail(v)
                    patchContactError('email', null)
                  }}
                  onBlur={() => patchContactError('email', validateEmail(email))}
                  error={contactErrors.email}
                  autoComplete="email"
                  inputType="email"
                />
                <CheckoutInput
                  label="Телефон *"
                  placeholder="+7 999 123-45-67"
                  value={phone}
                  onChange={(v) => {
                    setPhone(v)
                    patchContactError('phone', null)
                  }}
                  onBlur={() => patchContactError('phone', validateRussianPhone(phone))}
                  error={contactErrors.phone}
                  autoComplete="tel"
                  inputType="tel"
                />
              </div>

              <div className={styles.formSectionFlex}>
                <h2 className={styles.sectionTitle}>Адрес доставки</h2>
                <AddressSuggestInput
                  label="Адрес *"
                  placeholder="Начните вводить адрес"
                  value={address}
                  onChange={setAddress}
                  onMetaChange={setAddressMeta}
                  hint="Введите свой адрес и выберите его в выпадающем списке"
                />
                <CheckoutInput
                  label="Примечание к заказу"
                  placeholder="Примечание к заказу, например, указание по доставке"
                  value={note}
                  onChange={setNote}
                  autoComplete="off"
                />
              </div>
            </div>
          </form>

          <OrderCard items={displayItems} totalFormatted={displayTotal} />
        </div>

        {/* ── Right column (desktop) ── */}
        <div className={styles.rightCol}>
          <DeliveryCard delivery={delivery} setDelivery={setDelivery} />
          <PaymentCard
            payment={payment}
            setPayment={setPayment}
            agreePolicy={agreePolicy}
            setAgreePolicy={setAgreePolicy}
            agreeMarketing={agreeMarketing}
            setAgreeMarketing={setAgreeMarketing}
            onPay={handlePay}
          />
        </div>
      </div>
    </div>
  )
}
