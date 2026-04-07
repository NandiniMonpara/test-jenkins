import { expect, test } from '@playwright/test';

test.skip('skipped example for reporting coverage', async () => {
  // This test is intentionally skipped so reporting tools can show skipped status.
});

test('expected failure example for reporting coverage', async ({ page }) => {
  test.fail(true, 'This test is intentionally marked as an expected failure.');

  await page.goto('/');
  await expect(page).toHaveTitle(/This title should never match/i);
});
