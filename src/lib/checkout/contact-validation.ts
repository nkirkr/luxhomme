/** Простая проверка email без полного RFC — достаточно для чекаута. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value: string): string | null {
  const t = value.trim()
  if (!t) return 'Укажите email'
  if (t.length > 254) return 'Слишком длинный email'
  if (!EMAIL_RE.test(t)) return 'Неверный формат email'
  const [local, domain] = t.split('@')
  if (!local || !domain || local.length > 64 || !domain.includes('.')) {
    return 'Неверный формат email'
  }
  return null
}

/** Нормализация к виду 7XXXXXXXXXX (11 цифр) или null. */
export function normalizeRussianPhone(value: string): string | null {
  let d = value.replace(/\D/g, '')
  if (d.length === 11 && d[0] === '8') d = '7' + d.slice(1)
  else if (d.length === 10) d = '7' + d
  else if (d.length === 11 && d[0] === '7') d = d
  else return null
  if (!/^7\d{10}$/.test(d)) return null
  return d
}

export function validateRussianPhone(value: string): string | null {
  const t = value.trim()
  if (!t) return 'Укажите номер телефона'
  if (normalizeRussianPhone(t) === null) {
    return 'Некорректный номер. Пример: +7 999 123-45-67 или 8 999 123-45-67'
  }
  return null
}

/** Слова имени: буквы (в т.ч. кириллица), дефис, апостроф; с буквы. */
const NAME_PART_RE = /^[\p{L}][\p{L}'-]*$/u

export function validateFullName(value: string): string | null {
  const t = value.trim().replace(/\s+/g, ' ')
  if (!t) return 'Укажите имя и фамилию'
  const parts = t.split(' ')
  if (parts.length < 2) {
    return 'Укажите имя и фамилию (минимум два слова)'
  }
  for (const p of parts) {
    if (p.length < 2) {
      return 'Каждая часть имени — не короче двух букв'
    }
    if (!NAME_PART_RE.test(p)) {
      return 'Используйте только буквы, дефис и апостроф'
    }
  }
  return null
}
