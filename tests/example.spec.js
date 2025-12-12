// @ts-check
import { test, expect } from '@playwright/test';

test('has text', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await expect(page.getByText('Media Recommender')).toBeVisible();
});

