import { test, expect } from '@playwright/test';

test('app renders successfully', async ({ page }) => {
  await page.goto('https://spatial-genius-476614-m3.web.app/');
  await expect(page.getByTestId('app-root')).toBeVisible();
});




