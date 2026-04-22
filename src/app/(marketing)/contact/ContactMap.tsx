'use client'

import { useEffect, useRef, useState } from 'react'

type LngLat = [number, number]

declare global {
  interface Window {
    ymaps3?: {
      ready: Promise<void>
      YMap: new (
        el: HTMLElement,
        options: { location: { center: LngLat; zoom: number }; mode?: string },
      ) => YMapInstance
      YMapDefaultSchemeLayer: new () => unknown
      YMapDefaultFeaturesLayer: new () => unknown
      YMapMarker: new (
        options: { coordinates: LngLat; draggable?: boolean },
        element?: HTMLElement,
      ) => unknown
    }
    __ymaps3Loader__?: Promise<void>
  }
}

interface YMapInstance {
  addChild: (child: unknown) => void
  destroy: () => void
}

function loadYmaps3(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Yandex Maps can be loaded only in browser'))
  }
  if (window.ymaps3) return Promise.resolve()
  if (window.__ymaps3Loader__) return window.__ymaps3Loader__

  const loader = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Не удалось загрузить Yandex Maps v3'))
    document.head.appendChild(script)
  })

  window.__ymaps3Loader__ = loader
  return loader
}

export interface ContactMapProps {
  apiKey: string
  center: LngLat
  zoom?: number
  title?: string
}

export function ContactMap({ apiKey, center, zoom = 16, title }: ContactMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!apiKey) return
    const host = containerRef.current
    if (!host) return

    let cancelled = false
    let mapInstance: YMapInstance | null = null

    ;(async () => {
      try {
        await loadYmaps3(apiKey)
        if (cancelled || !window.ymaps3) return
        await window.ymaps3.ready
        if (cancelled) return

        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = window.ymaps3

        mapInstance = new YMap(host, { location: { center, zoom } })
        mapInstance.addChild(new YMapDefaultSchemeLayer())
        mapInstance.addChild(new YMapDefaultFeaturesLayer())

        const pin = document.createElement('div')
        pin.style.cssText = [
          'width:22px',
          'height:22px',
          'border-radius:50%',
          'background:#111',
          'border:3px solid #fff',
          'box-shadow:0 2px 6px rgba(0,0,0,.25)',
          'transform:translate(-50%,-50%)',
        ].join(';')
        if (title) pin.title = title

        mapInstance.addChild(new YMapMarker({ coordinates: center }, pin))
      } catch (err) {
        console.error('[contact map] yandex maps load error', err)
        if (!cancelled) setFailed(true)
      }
    })()

    return () => {
      cancelled = true
      try {
        mapInstance?.destroy()
      } catch {}
    }
  }, [apiKey, center, zoom, title])

  if (!apiKey || failed) {
    const message = !apiKey
      ? 'Не задан ключ Яндекс Карт (NEXT_PUBLIC_YANDEX_MAPS_API_KEY)'
      : 'Не удалось загрузить карту. Проверьте ключ Яндекс Карт (сервис «JavaScript API и HTTP Геокодер» и разрешённые Referer).'
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          background: '#f2f2f2',
          color: '#666',
          fontSize: 14,
          padding: 16,
          textAlign: 'center',
        }}
      >
        {message}
      </div>
    )
  }

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} aria-label={title} />
}
