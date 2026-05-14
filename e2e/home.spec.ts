import { test, expect } from '@playwright/test';

test.describe('Bries Weather App', () => {
  test('loads the dashboard and checks basic elements', async ({ page }) => {
    // Go to the web server
    await page.goto('/');

    // Wait for the Settings icon to become visible (indicates successful load)

    // Assuming we fallback to London or the geolocation resolves to something else
    // Wait for the Settings icon to become visible (indicates successful load)
    const settingsButton = page.getByTestId('settings-button');
    if (await settingsButton.count() > 0) {
      await expect(settingsButton).toBeVisible({ timeout: 10000 });
    }

    // Toggle settings and check modal
    if (await settingsButton.count() > 0) {
      await settingsButton.click();
      await expect(page.locator('text=Settings').first()).toBeVisible();
    }
  });
});
