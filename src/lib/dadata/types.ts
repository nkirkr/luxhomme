/** Поля `data` у подсказки адреса DaData (suggest/address) */
export type DadataAddressData = {
  country_iso_code?: string | null
  street?: string | null
  house?: string | null
  flat?: string | null
  city?: string | null
  settlement?: string | null
  region_with_type?: string | null
  postal_code?: string | null
  fias_id?: string | null
  settlement_kladr_id?: string | null
  city_kladr_id?: string | null
  geo_lat?: string | null
  geo_lon?: string | null
}

export type DadataAddressSuggestion = {
  value: string
  unrestricted_value?: string
  data: DadataAddressData
}

/** Нормализованный адрес после выбора подсказки (для заказа / интеграций) */
export type CheckoutAddressMeta = {
  addressLine1: string
  city: string
  postcode: string
  region: string
  flat: string
  country: string
  kladr: string
  fias: string
  lat: string
  lon: string
}
