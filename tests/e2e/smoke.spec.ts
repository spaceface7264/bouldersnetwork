import { expect, test } from '@playwright/test'

test('user can navigate to classes page', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL('**/dashboard')
  await expect(page.getByRole('heading', { name: /Hi,/ })).toBeVisible()

  await page.getByRole('link', { name: 'Classes' }).click()
  await expect(page).toHaveURL(/\/classes$/)
  await expect(page.getByText('Upcoming classes')).toBeVisible()
})
