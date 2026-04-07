import { expect, test } from '@playwright/test';

test('product details page shows pricing and add to cart', async ({ page }) => {
  await page.goto('/products/3');

  await expect(page.getByRole('heading', { name: /Beats Studio Pro/i })).toBeVisible();
  await expect(page.getByText(/\$/)).toBeVisible();
  await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
});
