import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Vite config for Clerk integration e2e tests.
 * Uses the REAL Clerk SDK (no mocking) so we can test actual auth flows.
 * Requires VITE_CLERK_PUBLISHABLE_KEY in .env.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('http://localhost:8080/api'),
  },
});
