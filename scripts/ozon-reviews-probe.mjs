#!/usr/bin/env node
// Пробник Ozon Seller API: POST /v2/review/list
// Запуск: node --env-file=.env.local scripts/ozon-reviews-probe.mjs

const CLIENT_ID = process.env.OZON_CLIENT_ID
const API_KEY = process.env.OZON_SELLER_API_KEY

if (!API_KEY) {
  console.error('❌ OZON_SELLER_API_KEY отсутствует в окружении (.env.local)')
  process.exit(1)
}
if (!CLIENT_ID || !/^\d+$/.test(String(CLIENT_ID).trim())) {
  console.error(
    '❌ OZON_CLIENT_ID обязателен (положительное целое из кабинета Ozon → Настройки → Seller API).\n' +
      '   Без него Ozon отвечает: Client-Id header value should be positive integer',
  )
  process.exit(1)
}

const url = 'https://api-seller.ozon.ru/v2/review/list'
const body = {
  limit: 20,
  sort_dir: 'DESC',
}

console.log('→ POST', url)
console.log('  body:', JSON.stringify(body))
console.log('  Client-Id:', CLIENT_ID)
console.log('  Api-Key:  ', API_KEY.slice(0, 8) + '…')

const started = Date.now()
let res
try {
  res = await fetch(url, {
    method: 'POST',
    headers: {
      'Client-Id': String(CLIENT_ID).trim(),
      'Api-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
} catch (err) {
  console.error('❌ network error:', err)
  process.exit(2)
}

const ms = Date.now() - started
const text = await res.text()
let data
try {
  data = JSON.parse(text)
} catch {
  data = text
}

console.log(`\n← ${res.status} ${res.statusText}  (${ms}ms)`)
console.log('headers:')
for (const [k, v] of res.headers) {
  if (/ratelimit|request|x-/i.test(k)) console.log(`  ${k}: ${v}`)
}
console.log('\nresponse:')
console.dir(data, { depth: 6, colors: true })

if (res.ok && data && Array.isArray(data.reviews)) {
  console.log(`\n✅ Получено отзывов: ${data.reviews.length}, has_next=${data.has_next}`)
}
