import { test, expect } from './coverage-fixture.js';

// Run serially — tests share backend DB state
test.describe.configure({ mode: 'serial' });

/** Helper: delete all staff via API to reset state */
async function deleteAllStaff(page) {
  await page.evaluate(async () => {
    const res = await fetch('http://localhost:8080/api/staff', {
      headers: { 'Authorization': 'Bearer test-token-admin' },
    });
    const staff = await res.json();
    for (const member of staff) {
      await fetch(`http://localhost:8080/api/staff/${member.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer test-token-admin' },
      });
    }
  });
}

/**
 * Helper: intercept staff POST/PUT to fix the role field.
 * The frontend sends job titles ("Frontend Developer") but the backend
 * expects permission role names ("member", "admin", etc.).
 */
async function mockStaffRoleFix(page) {
  await page.route('**/api/staff/**', async (route) => {
    const method = route.request().method();
    if (method === 'POST' || method === 'PUT') {
      const body = route.request().postDataJSON();
      body.role = 'member';
      const response = await route.fetch({ postData: JSON.stringify(body) });
      await route.fulfill({ response });
    } else {
      await route.continue();
    }
  });
  await page.route('**/api/staff', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      const body = route.request().postDataJSON();
      body.role = 'member';
      const response = await route.fetch({ postData: JSON.stringify(body) });
      await route.fulfill({ response });
    } else {
      await route.continue();
    }
  });
}

test.describe('Staff CRUD operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#staff');
    await deleteAllStaff(page);
    await page.reload();
  });

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('shows empty state when no staff exist', async ({ page }) => {
    await expect(page.getByText('No staff members yet')).toBeVisible();
    await expect(page.getByText('Add your first team member to get started')).toBeVisible();
  });

  test('can create a staff member', async ({ page }) => {
    await mockStaffRoleFix(page);

    await page.getByRole('button', { name: 'Add Staff Member' }).first().click();

    // Fill in required fields
    await page.getByPlaceholder('John', { exact: true }).fill('Jane');
    await page.getByPlaceholder('Doe', { exact: true }).fill('Smith');
    await page.getByPlaceholder('john.doe@company.com').fill('jane@test.com');

    // Submit
    await page.locator('button[type="submit"]').click();

    // Verify staff member appears in the table
    await expect(page.getByText('Jane Smith').first()).toBeVisible();
  });

  test('can read staff details in the table', async ({ page }) => {
    await mockStaffRoleFix(page);

    // Create a staff member
    await page.getByRole('button', { name: 'Add Staff Member' }).first().click();
    await page.getByPlaceholder('John', { exact: true }).fill('Alice');
    await page.getByPlaceholder('Doe', { exact: true }).fill('Johnson');
    await page.getByPlaceholder('john.doe@company.com').fill('alice@test.com');
    await page.locator('button[type="submit"]').click();

    // Verify details are visible in the table
    await expect(page.getByText('Alice Johnson').first()).toBeVisible();
    await expect(page.getByText('Mid-Level')).toBeVisible();
    await expect(page.getByText('Unassigned')).toBeVisible();

    // Verify the stats updated
    await expect(page.getByText('1 team member in your organization')).toBeVisible();
  });

  test('can update a staff member', async ({ page }) => {
    await mockStaffRoleFix(page);

    // Create a staff member first
    await page.getByRole('button', { name: 'Add Staff Member' }).first().click();
    await page.getByPlaceholder('John', { exact: true }).fill('Bob');
    await page.getByPlaceholder('Doe', { exact: true }).fill('Williams');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Bob Williams').first()).toBeVisible();

    // Click the Edit button on the staff row
    await page.getByRole('button', { name: 'Edit' }).click();

    // Verify edit form opened with existing data
    await expect(page.getByText('Edit Staff Member')).toBeVisible();
    await expect(page.getByPlaceholder('John', { exact: true })).toHaveValue('Bob');
    await expect(page.getByPlaceholder('Doe', { exact: true })).toHaveValue('Williams');

    // Update the name
    await page.getByPlaceholder('John', { exact: true }).clear();
    await page.getByPlaceholder('John', { exact: true }).fill('Robert');
    await page.getByPlaceholder('Doe', { exact: true }).clear();
    await page.getByPlaceholder('Doe', { exact: true }).fill('Williams-Smith');

    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify updated name appears
    await expect(page.getByText('Robert Williams-Smith').first()).toBeVisible();
  });

  test('can delete a staff member', async ({ page }) => {
    await mockStaffRoleFix(page);

    // Create a staff member
    await page.getByRole('button', { name: 'Add Staff Member' }).first().click();
    await page.getByPlaceholder('John', { exact: true }).fill('Charlie');
    await page.getByPlaceholder('Doe', { exact: true }).fill('Brown');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Charlie Brown').first()).toBeVisible();

    // Click the Delete button on the staff row
    const charlieRow = page.locator('tr').filter({ hasText: 'Charlie Brown' });
    await charlieRow.getByRole('button', { name: 'Delete' }).click();

    // Confirmation dialog should appear
    await expect(page.getByText('Are you sure you want to delete')).toBeVisible();

    // Confirm deletion
    const confirmDialog = page.locator('.fixed').filter({ hasText: 'Are you sure' });
    await confirmDialog.getByRole('button', { name: 'Delete' }).click();

    // Verify staff is gone and empty state shows
    await expect(page.getByText('No staff members yet')).toBeVisible();
  });

  test('can create multiple staff and delete one', async ({ page }) => {
    await mockStaffRoleFix(page);

    // Create first staff
    await page.getByRole('button', { name: 'Add Staff Member' }).first().click();
    await page.getByPlaceholder('John', { exact: true }).fill('Diana');
    await page.getByPlaceholder('Doe', { exact: true }).fill('Prince');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Diana Prince').first()).toBeVisible();

    // Create second staff
    await page.getByRole('button', { name: 'Add Staff Member' }).first().click();
    await page.getByPlaceholder('John', { exact: true }).fill('Clark');
    await page.getByPlaceholder('Doe', { exact: true }).fill('Kent');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText('Clark Kent').first()).toBeVisible();

    // Verify count
    await expect(page.getByText('2 team members in your organization')).toBeVisible();

    // Delete Clark Kent — click the Delete button in his row
    const clarkRow = page.locator('tr').filter({ hasText: 'Clark Kent' });
    await clarkRow.getByRole('button', { name: 'Delete' }).click();

    // Confirm deletion — target the button inside the confirmation dialog
    const confirmDialog = page.locator('.fixed').filter({ hasText: 'Are you sure' });
    await confirmDialog.getByRole('button', { name: 'Delete' }).click();

    // Verify Clark is gone but Diana remains
    const table = page.getByRole('table');
    await expect(table.getByText('Clark Kent')).not.toBeVisible();
    await expect(table.getByText('Diana Prince')).toBeVisible();
    await expect(page.getByText('1 team member in your organization')).toBeVisible();
  });

  test('can cancel form without saving', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Staff Member' }).first().click();

    // Fill in some data
    await page.getByPlaceholder('John', { exact: true }).fill('Temp');
    await page.getByPlaceholder('Doe', { exact: true }).fill('User');

    // Cancel
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Form should close and no staff should be added
    await expect(page.getByText('Personal Information')).not.toBeVisible();
    await expect(page.getByText('No staff members yet')).toBeVisible();
  });
});
