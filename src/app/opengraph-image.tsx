import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Site Preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 80,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
          {siteName}
        </div>
        <div style={{ fontSize: 28, opacity: 0.7, marginTop: 24 }}>
          Modern Web Application
        </div>
      </div>
    ),
    { ...size }
  )
}
