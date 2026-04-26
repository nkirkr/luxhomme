import type { CheckoutAddressMeta, DadataAddressData } from './types'

/**
 * Разбор выбранной подсказки DaData — зеркало логики
 * `luxhomme-backend/.../checkout-dadata.js` → `parseDadataAddress`.
 */
export const parseDadataAddress = (
  addressData: DadataAddressData,
): { meta: CheckoutAddressMeta; hasHouse: boolean } => {
  const hasHouse = Boolean(addressData.house)

  const street = addressData.street || ''
  const house = addressData.house || ''
  let addressLine1 = street
  if (house) {
    addressLine1 = addressLine1 ? `${street}, ${house}` : house
  }

  const flat = addressData.flat ? `кв. ${addressData.flat}` : ''

  const city = addressData.city || addressData.settlement || ''

  const region = addressData.region_with_type || ''

  const postcode = addressData.postal_code || ''

  const country = addressData.country_iso_code || 'RU'

  let kladr = ''
  if (addressData.settlement_kladr_id) {
    kladr = String(addressData.settlement_kladr_id)
  } else if (addressData.city_kladr_id) {
    kladr = String(addressData.city_kladr_id)
  }

  const fias = addressData.fias_id ? String(addressData.fias_id) : ''
  const lat = addressData.geo_lat ? String(addressData.geo_lat) : ''
  const lon = addressData.geo_lon ? String(addressData.geo_lon) : ''

  return {
    hasHouse,
    meta: {
      addressLine1,
      city,
      postcode,
      region,
      flat,
      country,
      kladr,
      fias,
      lat,
      lon,
    },
  }
}
