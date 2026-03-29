import { test, expect } from './coverage-fixture.js';

test.describe('Planning phases', () => {
  test('shows strategic planning screen', async ({ page }) => {
    await page.goto('/#strategic');
    // Heading appears in both the header and the screen — use first
    await expect(page.getByRole('heading', { name: 'Strategic Planning' }).first()).toBeVisible();
  });

  test('can create a new planning phase', async ({ page }) => {
    await page.goto('/#strategic');

    // Click new phase button
    await page.getByRole('button', { name: 'New Planning Phase' }).click();

    // Fill in phase name
    await page.getByPlaceholder('e.g., Q1 2025').fill('Q3 2026');

    // Set dates
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    const formatDate = (d) => d.toISOString().split('T')[0];

    await page.locator('input[type="date"]').first().fill(formatDate(startDate));
    await page.locator('input[type="date"]').last().fill(formatDate(endDate));

    // Submit the form
    await page.getByRole('button', { name: 'Create Phase' }).click();

    // Verify the phase appears
    await expect(page.getByText('Q3 2026')).toBeVisible();
  });
});
