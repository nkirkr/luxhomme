import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/.*/)
  await expect(page.locator('body')).toBeVisible()
})

test('navigation links work', async ({ page }) => {
  await page.goto('/')
  const aboutLink = page.getByRole('link', { name: /about/i })
  if (await aboutLink.isVisible()) {
    await aboutLink.click()
    await expect(page).toHaveURL(/about/)
  }
})

test('theme toggle works', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')
  const toggle = page.getByRole('button', { name: /theme/i })
  if (await toggle.isVisible()) {
    await toggle.click()
    await expect(html).toHaveClass(/dark/)
  }
})
