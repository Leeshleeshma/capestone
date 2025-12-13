// @ts-check
import { test, expect } from '@playwright/test';

test('search functionality works', async ({ page }) => {
  // Go to the app
  await page.goto('https://spatial-genius-476614-m3.web.app/');

  // Ensure the main title is visible
  await expect(page.getByText('Movies')).toBeVisible();

  // Wait for media grid to load
  await page.waitForSelector('.media-grid .media-card');

  // Type into search box
  const searchInput = page.getByPlaceholder('Search...');
  await searchInput.fill('Inception'); // Replace 'Matrix' with a movie you know exists in your test data

  // Wait a bit for filtering
  await page.waitForTimeout(500);

  // Assert that at least one matching movie appears
  const firstResult = page.locator('.media-grid .media-card').first();
  await expect(firstResult).toContainText('Inception');
});

