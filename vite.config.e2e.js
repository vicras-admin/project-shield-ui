import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import istanbul from 'vite-plugin-istanbul';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'src/mocks'],
      extension: ['.js', '.jsx'],
    }),
  ],
  resolve: {
    alias: {
      '@clerk/clerk-react': path.resolve(__dirname, 'src/mocks/clerk.js'),
    },
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('http://localhost:8080/api'),
    'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify('pk_test_fake_key'),
  },
});
