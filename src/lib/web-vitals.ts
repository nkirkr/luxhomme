import type { Metric } from 'web-vitals'

function sendToAnalytics(metric: Metric) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
      event_label: metric.id,
      non_interaction: true,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug('[Web Vitals]', body)
  }
}

export function reportWebVitals(metric: Metric) {
  sendToAnalytics(metric)
}

export async function initWebVitals() {
  const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals')

  onCLS(reportWebVitals)
  onINP(reportWebVitals)
  onLCP(reportWebVitals)
  onFCP(reportWebVitals)
  onTTFB(reportWebVitals)
}
