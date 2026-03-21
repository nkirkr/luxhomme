import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 320,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#ffffff',
        borderRadius: 102,
        fontWeight: 700,
      }}
    >
      B
    </div>,
    { width: 512, height: 512 },
  )
}
