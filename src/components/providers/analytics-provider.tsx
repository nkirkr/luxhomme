'use client'

import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
const YM_ID = process.env.NEXT_PUBLIC_YM_ID ?? ''
const analyticsEnabled = process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
    ym: (...args: unknown[]) => void
  }
}

export function AnalyticsProvider() {
  if (!analyticsEnabled) return null

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`}
          </Script>
        </>
      )}
      {YM_ID && (
        <Script id="ym-init" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${YM_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
        </Script>
      )}
    </>
  )
}

export function trackPageView(url: string) {
  if (!analyticsEnabled) return
  if (GA_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', { page_path: url })
  }
  if (YM_ID && typeof window !== 'undefined' && window.ym) {
    window.ym(Number(YM_ID), 'hit', url)
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!analyticsEnabled) return
  if (GA_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
  if (YM_ID && typeof window !== 'undefined' && window.ym) {
    window.ym(Number(YM_ID), 'reachGoal', name, params)
  }
}
