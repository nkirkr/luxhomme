import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 128,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#ffffff',
        borderRadius: 38,
        fontWeight: 700,
      }}
    >
      B
    </div>,
    { width: 192, height: 192 },
  )
}
