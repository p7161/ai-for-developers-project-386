import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm run start',
      cwd: './backend',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'VITE_USE_MOCK=false npx vite',
      cwd: './frontend',
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
