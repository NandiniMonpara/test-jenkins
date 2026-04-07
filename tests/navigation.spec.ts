import { expect, test } from '@playwright/test';

test('navigation from home to products works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Shop Now' }).first().click();

  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
});
