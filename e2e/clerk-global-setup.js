import { clerkSetup } from '@clerk/testing/playwright';

export default async function globalSetup() {
  console.log('[clerk-global-setup] Starting clerkSetup...');
  console.log('[clerk-global-setup] CLERK_SECRET_KEY set:', !!process.env.CLERK_SECRET_KEY);
  console.log('[clerk-global-setup] VITE_CLERK_PUBLISHABLE_KEY set:', !!process.env.VITE_CLERK_PUBLISHABLE_KEY);

  try {
    await clerkSetup({ debug: true });
    console.log('[clerk-global-setup] clerkSetup completed successfully');
    console.log('[clerk-global-setup] CLERK_FAPI:', process.env.CLERK_FAPI);
    console.log('[clerk-global-setup] CLERK_TESTING_TOKEN set:', !!process.env.CLERK_TESTING_TOKEN);
  } catch (err) {
    console.error('[clerk-global-setup] clerkSetup FAILED:', err.message);
    throw err;
  }
}
