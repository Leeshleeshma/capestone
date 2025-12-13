import { test, expect } from '@playwright/test';

test('search input works on deployed app', async ({ page }) => {
  // Visit deployed Firebase site
  await page.goto('https://spatial-genius-476614-m3.web.app/');

  // App title should be visible
  await expect(page.getByText('Midnight Kernel')).toBeVisible();

  // Search input should exist
  const searchInput = page.getByPlaceholder('Search...');
  await expect(searchInput).toBeVisible();

  // Interact with search
  await searchInput.fill('Inception');

  // Verify input value
  await expect(searchInput).toHaveValue('Inception');
});


