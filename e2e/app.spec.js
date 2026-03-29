import { test, expect } from './coverage-fixture.js';

test.describe('App smoke tests', () => {
  test('loads and shows the dashboard', async ({ page }) => {
    await page.goto('/#dashboard');
    await expect(page.getByRole('heading', { name: 'Portfolio Dashboard' })).toBeVisible();
    await expect(page.getByText('ProjectShield')).toBeVisible();
  });

  test('shows empty state on dashboard when no data', async ({ page }) => {
    await page.goto('/#dashboard');
    await expect(page.getByText('No Projects Yet')).toBeVisible();
    await expect(page.getByText('Create phases and add strategic projects to see them here.')).toBeVisible();
  });

  test('sidebar navigation works', async ({ page }) => {
    await page.goto('/#dashboard');
    await expect(page.getByRole('heading', { name: 'Portfolio Dashboard' })).toBeVisible();

    // Navigate to Staff
    await page.getByRole('button', { name: 'Staff' }).click();
    await expect(page.getByRole('heading', { name: 'Staff', exact: true })).toBeVisible();

    // Navigate to Teams
    await page.getByRole('button', { name: 'Teams' }).click();
    await expect(page.getByRole('heading', { name: 'Teams' })).toBeVisible();

    // Navigate to Strategic Planning — heading appears twice, use first
    await page.getByRole('button', { name: 'Strategic Planning' }).click();
    await expect(page.getByRole('heading', { name: 'Strategic Planning' }).first()).toBeVisible();

    // Navigate to Gap Report
    await page.getByRole('button', { name: 'Gap Report' }).click();
    await expect(page.getByRole('heading', { name: 'Gap Report' })).toBeVisible();

    // Navigate back to Dashboard
    await page.getByRole('button', { name: 'Portfolio Dashboard' }).click();
    await expect(page.getByRole('heading', { name: 'Portfolio Dashboard' })).toBeVisible();
  });
});
