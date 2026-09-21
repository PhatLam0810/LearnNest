import { defineConfig } from '@playwright/test';

// Đặt E2E_BASE_URL để chạy trên server đã có sẵn (vd bản `next start` thật);
// không đặt thì tự bật `yarn dev` như trước.
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'yarn dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 60_000,
      },
  use: {
    baseURL,
  },
});
