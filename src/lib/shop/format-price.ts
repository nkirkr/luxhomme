/** Formats a numeric amount for storefront display (server-safe). */
export function formatShopPrice(amount: number, currencyCode: string): string {
  const code =
    currencyCode && currencyCode.trim().length === 3 ? currencyCode.trim().toUpperCase() : 'RUB'
  try {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${Number.isFinite(amount) ? amount : 0} ${code}`
  }
}
