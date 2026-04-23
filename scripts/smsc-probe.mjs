#!/usr/bin/env node
/**
 * Диагностика SMSC: показывает баланс и стоимость одной отправки SMS
 * без реального списания (cost=1).
 *
 * Запуск:
 *   node --env-file=.env.local scripts/smsc-probe.mjs +79991234567
 *   node --env-file=.env.local scripts/smsc-probe.mjs +79991234567 "Luxhomme: код 123456"
 */

const phone = process.argv[2]
const message = process.argv[3] ?? 'Luxhomme: код 123456'

if (!phone) {
  console.error('Usage: node scripts/smsc-probe.mjs <phone> [message]')
  process.exit(1)
}

const login = process.env.SMSC_LOGIN
const psw = process.env.SMSC_PASSWORD
const sender = process.env.SMSC_SENDER

if (!login || !psw) {
  console.error('❌ SMSC_LOGIN / SMSC_PASSWORD отсутствуют в окружении')
  process.exit(1)
}

async function call(url, params) {
  const body = new URLSearchParams({ login, psw, fmt: '3', charset: 'utf-8', ...params })
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  })
  return res.json()
}

const balance = await call('https://smsc.ru/sys/balance.php', {})
console.log('— Баланс:', balance)

const costParams = { phones: phone, mes: message, cost: '1' }
if (sender) costParams.sender = sender
const cost = await call('https://smsc.ru/sys/send.php', costParams)
console.log('— Стоимость отправки (без списания):', cost)
console.log('  sender:', sender ?? '(дефолт из кабинета)')
console.log('  длина сообщения:', message.length, 'симв.')
