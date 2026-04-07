import { expect, test } from '@playwright/test';

test('homepage is reachable and exposes the catalog entry point', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Demo Store/i);
  await expect(page.getByRole('heading', { name: 'Demo E-commerce Testing Store' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Shop Now' }).first()).toBeVisible();
});
