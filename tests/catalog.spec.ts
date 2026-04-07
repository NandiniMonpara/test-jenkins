import { expect, test } from '@playwright/test';

test('catalog page shows the demo inventory', async ({ page }) => {
  await page.goto('/products');

  await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
  await expect(page.getByText(/Showing \d+ products/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Rode NT1-A Condenser Mic/i }).first()).toBeVisible();
});
