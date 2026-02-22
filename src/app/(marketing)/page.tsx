import { Animated } from '@/components/animations/animated'
import { staggerContainer, fadeUp } from '@/lib/animation-variants'
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/json-ld'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Site'

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd
        name={siteName}
        url={siteUrl}
        logo={`${siteUrl}/logo.png`}
      />
      <WebSiteJsonLd name={siteName} url={siteUrl} />

      <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
        <Animated variants={staggerContainer}>
          <Animated variants={fadeUp}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build something
              <span className="block text-primary">amazing</span>
            </h1>
          </Animated>
          <Animated variants={fadeUp}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Modern, modular, production-ready web application template.
              Powered by Next.js 16.
            </p>
          </Animated>
          <Animated variants={fadeUp}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="#features"
                className="rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explore Features
              </a>
              <a
                href="/contact"
                className="rounded-md border border-input bg-background px-8 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Contact Us
              </a>
            </div>
          </Animated>
        </Animated>
      </section>

      <section id="features" className="border-t bg-muted/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Animated>
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Everything you need to build a modern web application.
            </p>
          </Animated>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'SEO & GEO Ready', desc: 'Optimized for search engines and AI assistants.' },
              { title: 'Responsive Design', desc: 'Looks great on any device — mobile, tablet, desktop.' },
              { title: 'CMS Integration', desc: 'Connect WordPress or Payload CMS in one click.' },
              { title: 'Authentication', desc: 'User accounts with Better Auth — self-hosted.' },
              { title: 'Animations', desc: 'Motion + GSAP for stunning page transitions.' },
              { title: 'Modular Architecture', desc: 'Enable only what you need with feature flags.' },
            ].map((feature) => (
              <Animated key={feature.title}>
                <div className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
