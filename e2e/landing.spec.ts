import { test, expect } from '@playwright/test';

test('trang chủ hiện đúng headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'hiệu quả',
  );
});
