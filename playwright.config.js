import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  outputDir: './tests/visual/results',
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'tests/visual/report', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    navigationTimeout: 15000,
    actionTimeout: 8000,
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] }
    },
    {
      name: 'Desktop Dark',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        storageState: {
          origins: [{
            origin: 'http://localhost:3000',
            localStorage: [{ name: 'tk_theme', value: 'dark' }]
          }]
        }
      }
    }
  ],
  webServer: {
    command: 'node server/index.js',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 10000,
    env: { DATA_DIR: 'C:\\Temp\\tk-playwright-data' }
  }
});