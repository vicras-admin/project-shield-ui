import { test, expect } from '@playwright/test';
import { setupClerkTestingToken, clerk } from '@clerk/testing/playwright';

/**
 * Clerk Integration E2E Tests
 *
 * Validates the full authentication lifecycle using Clerk's test mode and
 * @clerk/testing helpers for bot protection bypass and programmatic sign-in.
 *
 * Test emails use "+clerk_test" convention; OTP code is "424242".
 *
 * Prerequisites:
 *   - VITE_CLERK_PUBLISHABLE_KEY in .env
 *   - CLERK_SECRET_KEY env var
 *   - Backend running with real Clerk (local profile)
 *   - Database migrations applied
 *
 * Run: CLERK_SECRET_KEY=sk_test_... npm run e2e:clerk
 */

const TEST_RUN_ID = Date.now();
const TEST_EMAIL = `testuser+clerk_test_${TEST_RUN_ID}@example.com`;
const TEST_PASSWORD = `Sh!eld_Qz9x&${TEST_RUN_ID}`;
const TEST_FIRST_NAME = 'ClerkTest';
const TEST_LAST_NAME = 'User';
const TEST_ORG_NAME = `Test Org ${TEST_RUN_ID}`;

const API_BASE_URL = 'http://localhost:8080/api';

// All tests run serially — they build on each other
test.describe.configure({ mode: 'serial' });

test.describe('Clerk authentication integration', () => {

  test.beforeEach(async ({ page }) => {
    // Verify that clerkSetup() ran successfully
    if (!process.env.CLERK_FAPI || !process.env.CLERK_TESTING_TOKEN) {
      throw new Error(
        `clerkSetup() did not run or failed. CLERK_FAPI=${process.env.CLERK_FAPI}, CLERK_TESTING_TOKEN set: ${!!process.env.CLERK_TESTING_TOKEN}`
      );
    }
    await setupClerkTestingToken({ page });
  });

  test('0 - Clerk SDK loads and initializes with testing token', async ({ page }) => {
    await page.goto('/');

    // Wait for Clerk to load
    await page.waitForFunction(() => window.Clerk !== undefined, { timeout: 15_000 });
    await page.waitForFunction(() => window.Clerk.loaded === true, { timeout: 15_000 });

    // Check Clerk client state
    const clerkState = await page.evaluate(() => ({
      loaded: window.Clerk?.loaded,
      hasClient: !!window.Clerk?.client,
      hasUser: !!window.Clerk?.user,
      clientCaptchaBypass: window.Clerk?.client?.captcha_bypass,
    }));

    console.log('[test-0] Clerk state after load:', JSON.stringify(clerkState));

    expect(clerkState.loaded).toBe(true);
    expect(clerkState.hasClient).toBe(true);
    // User should be null (not signed in yet)
    expect(clerkState.hasUser).toBe(false);
  });

  test('1 - can register a new organization and user', async ({ page }) => {
    await page.goto('/');

    // Navigate to sign-up
    await page.getByRole('button', { name: 'Sign In' }).first().click();
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();

    // Fill registration form
    await page.fill('#organizationName', TEST_ORG_NAME);
    await page.fill('#firstName', TEST_FIRST_NAME);
    await page.fill('#lastName', TEST_LAST_NAME);
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.fill('#confirmPassword', TEST_PASSWORD);

    // Submit
    await page.getByRole('button', { name: 'Create account' }).click();

    // Wait for success or error
    const successOrError = await Promise.race([
      page.getByText('Account created successfully').waitFor({ timeout: 20_000 }).then(() => 'success'),
      page.locator('.bg-red-500\\/10').waitFor({ timeout: 20_000 }).then(() => 'error'),
    ]);

    if (successOrError === 'error') {
      const errorText = await page.locator('.bg-red-500\\/10').textContent();
      throw new Error(`Registration failed: ${errorText}`);
    }

    await expect(page.getByText('Sign in to your account')).toBeVisible();
  });

  test('2 - can sign in with Clerk and reach the dashboard', async ({ page }) => {
    await clerkSignIn(page);
  });

  test('3 - authenticated user can access strategic planning', async ({ page }) => {
    await clerkSignIn(page);

    await page.getByRole('button', { name: 'Strategic Planning' }).click();
    await expect(page.getByRole('heading', { name: 'Strategic Planning' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Planning Phase' })).toBeVisible();
  });

  test('4 - authenticated user can access staff roster', async ({ page }) => {
    await clerkSignIn(page);

    await page.getByRole('button', { name: 'Staff' }).click();
    await expect(page.getByRole('heading', { name: 'Staff', exact: true })).toBeVisible();
  });

  test('5 - authenticated user can access teams', async ({ page }) => {
    await clerkSignIn(page);

    await page.getByRole('button', { name: 'Teams' }).click();
    await expect(page.getByRole('heading', { name: 'Teams' })).toBeVisible();
  });

  test('6 - user can sign out', async ({ page }) => {
    await clerkSignIn(page);

    await clerk.signOut({ page });

    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Sign In' }).first()).toBeVisible({ timeout: 10_000 });
  });

  test('7 - unauthenticated user cannot access protected screens', async ({ page }) => {
    await page.goto('/#dashboard');

    await expect(page.getByRole('heading', { name: 'Portfolio Dashboard' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' }).first()).toBeVisible();
  });

  test('8 - signed-in user can create a phase (org-scoped API)', async ({ page }) => {
    await clerkSignIn(page);

    await page.getByRole('button', { name: 'Strategic Planning' }).click();
    await expect(page.getByRole('heading', { name: 'Strategic Planning' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'New Planning Phase' }).click();
    await page.getByPlaceholder('e.g., Q1 2025').fill('Clerk Test Phase');

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    const formatDate = (d) => d.toISOString().split('T')[0];

    await page.locator('input[type="date"]').first().fill(formatDate(startDate));
    await page.locator('input[type="date"]').last().fill(formatDate(endDate));

    await page.getByRole('button', { name: 'Create Phase' }).click();
    await expect(page.getByText('Clerk Test Phase')).toBeVisible({ timeout: 10_000 });
  });

  test('9 - data persists across sign-in sessions', async ({ page }) => {
    await clerkSignIn(page);

    await page.getByRole('button', { name: 'Strategic Planning' }).click();
    await expect(page.getByText('Clerk Test Phase')).toBeVisible({ timeout: 10_000 });
  });
});

/**
 * Helper: sign in programmatically via Clerk testing helpers and navigate to dashboard.
 * Uses email_code strategy with +clerk_test convention (code: 424242).
 */
async function clerkSignIn(page) {
  await setupClerkTestingToken({ page });
  await page.goto('/');
  await clerk.loaded({ page });

  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'email_code',
      identifier: TEST_EMAIL,
    },
  });

  // After clerk.signIn(), React hooks update in-place — the app auto-activates
  // the org, fetches data, and navigates to the dashboard without a page reload.
  await expect(page.getByRole('heading', { name: 'Portfolio Dashboard' })).toBeVisible({ timeout: 30_000 });
}
