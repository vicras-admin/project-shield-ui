import { defineConfig } from '@playwright/test';
import { clerkSetup } from '@clerk/testing/playwright';

/**
 * Playwright config for Clerk integration e2e tests.
 * Runs against real Clerk (no mocking) with the local backend.
 *
 * Prerequisites:
 *   - VITE_CLERK_PUBLISHABLE_KEY set in .env
 *   - CLERK_SECRET_KEY env var set
 *   - Backend running with real Clerk issuer (local profile)
 *   - Database migrations applied
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: 'clerk-integration.spec.js',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  globalSetup: './e2e/clerk-global-setup.js',
  webServer: [
    {
      command: 'cd ../project-shield-service && ./gradlew bootRun --args="--spring.profiles.active=local"',
      url: 'http://localhost:8080/health',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npx vite --config vite.config.clerk-e2e.js --port 5174',
      url: 'http://localhost:5174',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
