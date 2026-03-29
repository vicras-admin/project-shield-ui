import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const coverageDir = path.resolve(process.cwd(), '.nyc_output');

export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page);

    // Collect coverage after each test
    const coverage = await page.evaluate(() => window.__coverage__);
    if (coverage) {
      if (!fs.existsSync(coverageDir)) {
        fs.mkdirSync(coverageDir, { recursive: true });
      }
      const fileName = `coverage-${crypto.randomUUID()}.json`;
      fs.writeFileSync(
        path.join(coverageDir, fileName),
        JSON.stringify(coverage),
      );
    }
  },
});

export { expect } from '@playwright/test';
