import { NextRequest, NextResponse } from 'next/server'

const DADATA_SUGGEST_URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'

export const POST = async (request: NextRequest) => {
  const apiKey = process.env.DADATA_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      { code: 'not_configured', message: 'DADATA_API_KEY не задан' },
      { status: 503 },
    )
  }

  let body: { query?: string; count?: number }
  try {
    body = (await request.json()) as { query?: string; count?: number }
  } catch {
    return NextResponse.json(
      { code: 'validation_error', message: 'Невалидный JSON' },
      { status: 400 },
    )
  }

  const query = String(body.query ?? '').trim()
  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const count = Math.min(Math.max(Number(body.count) || 5, 1), 10)

  const secret = process.env.DADATA_SECRET_KEY?.trim()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Token ${apiKey}`,
  }
  if (secret) {
    headers['X-Secret'] = secret
  }

  try {
    const upstream = await fetch(DADATA_SUGGEST_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, count }),
    })

    const text = await upstream.text()
    if (!upstream.ok) {
      return NextResponse.json(
        { code: 'upstream_error', message: 'DaData недоступен' },
        { status: 502 },
      )
    }

    const data = JSON.parse(text) as { suggestions?: unknown[] }
    return NextResponse.json({ suggestions: data.suggestions ?? [] })
  } catch {
    return NextResponse.json(
      { code: 'upstream_error', message: 'Ошибка запроса к DaData' },
      { status: 502 },
    )
  }
}
