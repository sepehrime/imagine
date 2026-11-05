// Phase 7.1: every API call shows a helpful error (with retry) when the backend is down
import { test, expect } from "./fixtures";

// These tests break the network on purpose, so failed requests are expected in the console
test.use({ allowConsoleErrors: true });

// Match on the URL *path*: a "**/api/**" glob would also catch Vite's source
// module /src/api/client.js, and the app would never load at all.
const isApiCall = (url) => url.pathname.startsWith("/api/");

test.beforeEach(async ({ page }) => {
  await page.route(isApiCall, (route) => route.abort("connectionrefused"));
});

test("Section 3 explains that the backend is offline", async ({ page }) => {
  await page.goto("/forward-pass");
  await page.getByRole("button", { name: "Run Forward Pass" }).click();
  await expect(page.getByRole("alert")).toContainText("Can't reach the backend");
  await expect(page.getByRole("alert")).toContainText("uvicorn main:app");
});

test("Section 4 shows an error with a working retry", async ({ page }) => {
  await page.goto("/train");
  const alert = page.getByRole("alert");
  await expect(alert).toContainText("Can't reach the backend");

  await page.unroute(isApiCall); // "start the backend"
  await alert.getByRole("button", { name: /retry/i }).click();
  await expect(page.getByRole("radio", { name: /XOR/ })).toBeVisible();
});

test("Section 5 shows an error instead of a blank page", async ({ page }) => {
  await page.goto("/boundary");
  await expect(page.getByRole("alert")).toContainText("Can't reach the backend");
});

test("loading states are shown while requests are pending", async ({ page }) => {
  await page.unroute(isApiCall);
  // Hold the dataset requests open so the loading state is observable
  let release;
  const gate = new Promise((r) => (release = r));
  await page.route("**/api/train/datasets/**", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/train");
  await expect(page.getByRole("status")).toContainText("Loading datasets");
  release();
  await expect(page.getByRole("radio", { name: /XOR/ })).toBeVisible();
});
