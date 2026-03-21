import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
]

for (const page of pages) {
  test(`${page.name} has no critical a11y violations`, async ({ page: p }) => {
    await p.goto(page.path)

    const results = await new AxeBuilder({ page: p })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast']) // Skip color contrast for template placeholder content
      .analyze()

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    )

    if (critical.length > 0) {
      const summary = critical
        .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`)
        .join('\n')
      expect(critical, `A11y violations:\n${summary}`).toHaveLength(0)
    }
  })
}
