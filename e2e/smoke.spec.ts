import { test, expect } from '@playwright/test'

const routes = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/search', name: 'Search' },
]

for (const route of routes) {
  test(`${route.name} (${route.path}) loads without errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    const response = await page.goto(route.path)

    expect(response?.status()).toBeLessThan(500)
    expect(errors).toHaveLength(0)
  })
}

test('homepage has main heading', async ({ page }) => {
  await page.goto('/')
  const heading = page.locator('h1')
  await expect(heading).toBeVisible()
})

test('navigation links are present', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('header')).toBeVisible()
  await expect(page.locator('a[href="/about"]')).toBeVisible()
  await expect(page.locator('a[href="/contact"]')).toBeVisible()
})

test('theme toggle works', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')

  // Click theme toggle button
  const toggle = page
    .locator('button')
    .filter({ hasText: /toggle|theme/i })
    .first()
  if (await toggle.isVisible()) {
    const classBefore = await html.getAttribute('class')
    await toggle.click()
    const classAfter = await html.getAttribute('class')
    expect(classBefore).not.toBe(classAfter)
  }
})

test('footer is visible', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('footer')
  await expect(footer).toBeVisible()
})

test('contact form renders', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.locator('form')).toBeVisible()
  await expect(page.locator('input[name="name"], input[id="name"]').first()).toBeVisible()
})

test('health endpoint responds', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.status).toBe('ok')
})
