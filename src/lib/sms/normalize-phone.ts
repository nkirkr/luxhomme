/**
 * Нормализация номера для РФ и хранения в Better Auth (цифры с ведущей 7).
 * Поддерживает ввод: +7…, 7…, 8…, 9… (10 цифр без кода страны).
 */
export function normalizeRuPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 0) return null

  if (digits.length === 11) {
    if (digits.startsWith('8')) return `7${digits.slice(1)}`
    if (digits.startsWith('7')) return digits
  }
  if (digits.length === 10 && digits.startsWith('9')) {
    return `7${digits}`
  }
  if (digits.length >= 10 && digits.length <= 15) {
    return digits
  }
  return null
}
