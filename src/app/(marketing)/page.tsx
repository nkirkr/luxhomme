import Link from 'next/link'
import { Animated } from '@/components/animations/animated'
import { staggerContainer, fadeUp } from '@/lib/animation-variants'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/json-ld'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd name={siteName} url={siteUrl} logo={`${siteUrl}/logo.png`} />
      <WebSiteJsonLd
        name={siteName}
        url={siteUrl}
        searchUrl={`${siteUrl}/search?q={search_term_string}`}
      />

      <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
        <Animated variants={staggerContainer}>
          <Animated variants={fadeUp}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build something
              <span className="text-primary block">amazing</span>
            </h1>
          </Animated>
          <Animated variants={fadeUp}>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg sm:text-xl">
              Modern, modular, production-ready web application template. Powered by Next.js 16.
            </p>
          </Animated>
          <Animated variants={fadeUp}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="#features"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-8 py-3 text-sm font-medium transition-colors"
              >
                Explore Features
              </a>
              <Link
                href="/contact"
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-8 py-3 text-sm font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </Animated>
        </Animated>
      </section>

      <section id="features" className="bg-muted/50 border-t py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Animated>
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Features</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
              Everything you need to build a modern web application.
            </p>
          </Animated>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'SEO & GEO Ready', desc: 'Optimized for search engines and AI assistants.' },
              {
                title: 'Responsive Design',
                desc: 'Looks great on any device — mobile, tablet, desktop.',
              },
              { title: 'CMS Integration', desc: 'Connect WordPress or Payload CMS in one click.' },
              { title: 'Authentication', desc: 'User accounts with Better Auth — self-hosted.' },
              { title: 'Animations', desc: 'Smooth page transitions with Motion.' },
              {
                title: 'Modular Architecture',
                desc: 'Enable only what you need with feature flags.',
              },
            ].map((feature) => (
              <Animated key={feature.title}>
                <div className="bg-card rounded-lg border p-6 transition-shadow hover:shadow-md">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{feature.desc}</p>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
