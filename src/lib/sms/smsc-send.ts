import { createLogger } from '@/lib/logger'

const log = createLogger('smsc')

const SMSC_SEND_URL = 'https://smsc.ru/sys/send.php'

type SmscJsonSuccess = { id: number; cnt: number; cost?: string; balance?: string }
type SmscJsonError = { error: string; error_code: number; id?: number }

function getCredentials(): { login: string; psw: string } | null {
  const login = process.env.SMSC_LOGIN?.trim()
  const psw = process.env.SMSC_PASSWORD?.trim()
  if (login && psw) return { login, psw }
  return null
}

/**
 * Отправка SMS через SMSC.ru (sys/send.php, ответ JSON).
 * Авторизация: логин и пароль из личного кабинета SMSC.
 */
export async function sendSmscSms(params: { phones: string; message: string }): Promise<void> {
  const cred = getCredentials()
  if (!cred) {
    log.error('SMSC: задайте SMSC_LOGIN и SMSC_PASSWORD из кабинета smsc.ru')
    throw new Error('SMS-сервис не настроен')
  }

  const body = new URLSearchParams({
    login: cred.login,
    psw: cred.psw,
    phones: params.phones,
    mes: params.message,
    fmt: '3',
    charset: 'utf-8',
  })

  // Поле «От кого».
  //  - не задано   → SMSC подставит имя по умолчанию из кабинета (может быть платным);
  //  - "none" / "" → явно отключаем буквенное имя, SMS уйдёт с цифрового номера (дешёвый тариф);
  //  - любое другое значение → используем как sender (должно быть согласовано в кабинете).
  const senderRaw = process.env.SMSC_SENDER?.trim()
  if (senderRaw !== undefined) {
    body.set('sender', senderRaw.toLowerCase() === 'none' ? '' : senderRaw)
  }

  const res = await fetch(SMSC_SEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  })

  const raw = await res.text()
  let json: SmscJsonSuccess | SmscJsonError
  try {
    json = JSON.parse(raw) as SmscJsonSuccess | SmscJsonError
  } catch {
    log.error({ raw }, 'SMSC: не JSON')
    throw new Error('Ошибка ответа SMS-провайдера')
  }

  if ('error_code' in json && json.error_code) {
    log.error({ error_code: json.error_code, error: json.error }, 'SMSC send failed')
    throw new Error('Не удалось отправить SMS')
  }
  if (!('id' in json) || json.id == null) {
    log.error({ json }, 'SMSC: неожиданный ответ')
    throw new Error('Не удалось отправить SMS')
  }
}
