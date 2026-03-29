import { test, expect } from './coverage-fixture.js';

// Run serially — tests share backend DB state and build on each other
test.describe.configure({ mode: 'serial' });

/** Helper: delete all teams via API to reset state */
async function deleteAllTeams(page) {
  await page.evaluate(async () => {
    const res = await fetch('http://localhost:8080/api/teams', {
      headers: { 'Authorization': 'Bearer test-token-admin' },
    });
    const teams = await res.json();
    for (const team of teams) {
      await fetch(`http://localhost:8080/api/teams/${team.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer test-token-admin' },
      });
    }
  });
}

test.describe('Team CRUD operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#teams');
    await deleteAllTeams(page);
    // Reload to reflect clean state
    await page.reload();
  });

  test('shows empty state when no teams exist', async ({ page }) => {
    await expect(page.getByText('No teams yet')).toBeVisible();
    await expect(page.getByText('Create your first team to start organizing staff')).toBeVisible();
  });

  test('can create a team', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Team' }).first().click();

    // Verify form opened
    await expect(page.getByText('Create a new team and assign members')).toBeVisible();

    // Fill in team details
    await page.getByPlaceholder('e.g., Claims Processing Team').fill('Platform Engineering');
    await page.getByPlaceholder('What does this team work on?').fill('Core infrastructure and developer tooling');

    // Submit
    await page.locator('button[type="submit"]').click();

    // Verify the team appears
    await expect(page.getByText('Platform Engineering')).toBeVisible();
  });

  test('can read team details by expanding', async ({ page }) => {
    // Create a team
    await page.getByRole('button', { name: 'Create Team' }).first().click();
    await page.getByPlaceholder('e.g., Claims Processing Team').fill('Frontend Squad');
    await page.getByPlaceholder('What does this team work on?').fill('User-facing features');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Frontend Squad')).toBeVisible();

    // Click the team card to expand it
    await page.getByRole('heading', { name: 'Frontend Squad' }).click();

    // Verify expanded details show
    await expect(page.getByText('No members assigned to this team')).toBeVisible();
  });

  test('can update a team', async ({ page }) => {
    // Create a team
    await page.getByRole('button', { name: 'Create Team' }).first().click();
    await page.getByPlaceholder('e.g., Claims Processing Team').fill('Backend Team');
    await page.getByPlaceholder('What does this team work on?').fill('API development');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Backend Team')).toBeVisible();

    // Click the edit button — scoped to the team card containing "Backend Team"
    const teamCard = page.locator('div').filter({ hasText: 'Backend Team' }).locator('button').filter({ has: page.locator('svg.lucide-pencil') }).first();
    await teamCard.click();

    // Verify edit form opened with existing data
    await expect(page.getByText('Edit Team')).toBeVisible();
    await expect(page.getByPlaceholder('e.g., Claims Processing Team')).toHaveValue('Backend Team');

    // Update the team name and description
    await page.getByPlaceholder('e.g., Claims Processing Team').clear();
    await page.getByPlaceholder('e.g., Claims Processing Team').fill('Backend Services Team');
    await page.getByPlaceholder('What does this team work on?').clear();
    await page.getByPlaceholder('What does this team work on?').fill('Microservices and API gateway');

    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify the updated team name appears
    await expect(page.getByText('Backend Services Team')).toBeVisible();
  });

  test('can delete a team', async ({ page }) => {
    // Create a team
    await page.getByRole('button', { name: 'Create Team' }).first().click();
    await page.getByPlaceholder('e.g., Claims Processing Team').fill('Temporary Team');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Temporary Team')).toBeVisible();

    // Click the delete button (Trash icon) on the team card
    const teamCard = page.locator('div').filter({ hasText: 'Temporary Team' }).locator('button').filter({ has: page.locator('svg.lucide-trash-2') }).first();
    await teamCard.click();

    // Confirmation dialog should appear
    await expect(page.getByText('Are you sure you want to delete')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();

    // Confirm deletion
    await page.getByRole('button', { name: 'Delete' }).click();

    // Verify team is gone
    await expect(page.getByText('No teams yet')).toBeVisible();
  });

  test('can create multiple teams', async ({ page }) => {
    // Create first team
    await page.getByRole('button', { name: 'Create Team' }).first().click();
    await page.getByPlaceholder('e.g., Claims Processing Team').fill('Alpha Team');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByRole('heading', { name: 'Alpha Team' })).toBeVisible();

    // Create second team
    await page.getByRole('button', { name: 'Create Team' }).first().click();
    await page.getByPlaceholder('e.g., Claims Processing Team').fill('Beta Team');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByRole('heading', { name: 'Beta Team' })).toBeVisible();

    // Both teams should be visible
    await expect(page.getByRole('heading', { name: 'Alpha Team' })).toBeVisible();
  });
});
