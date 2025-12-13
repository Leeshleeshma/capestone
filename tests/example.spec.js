import { test, expect } from '@playwright/test';

test('search input is visible and accepts text', async ({ page }) => {
  await page.goto('https://spatial-genius-476614-m3.web.app/', {
    waitUntil: 'domcontentloaded',
  });

  // Search input should exist
  const searchInput = page.getByPlaceholder('Search...');
  await expect(searchInput).toBeVisible();

  // Type into search input
  await searchInput.fill('Inception');

  // Verify typed value
  await expect(searchInput).toHaveValue('Inception');
});



