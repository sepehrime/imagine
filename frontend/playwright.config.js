import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests: a real browser against the real frontend + backend.
 *
 * - The tests start their OWN backend (:8765) and frontend (:5199), so they never
 *   touch the dev servers you may have running on :8000 / :5173.
 * - The backend trains with TRAINING_TARGET_SECONDS=2 so runs are quick but
 *   still slow enough to pause and to watch the boundary move.
 * - Tests run one at a time: the backend holds ONE shared training state, so
 *   parallel tests would start/reset each other's runs.
 * - The backend's output is written to e2e/.backend.log; global teardown fails
 *   the run if it contains a Python traceback (Phase 7.3: "no unhandled
 *   exceptions in the backend terminal").
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"]],
  globalTeardown: "./e2e/global-teardown.js",
  use: {
    baseURL: "http://localhost:5199",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "cd ../backend && TRAINING_TARGET_SECONDS=2 venv/bin/uvicorn main:app --port 8765 > ../frontend/e2e/.backend.log 2>&1",
      url: "http://localhost:8765/health",
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: "API_TARGET=http://localhost:8765 npm run dev -- --port 5199 --strictPort",
      url: "http://localhost:5199",
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
