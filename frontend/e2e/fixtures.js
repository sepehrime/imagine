import { test as base, expect } from "@playwright/test";

/**
 * Shared test setup.
 *
 * `consoleErrors` is an AUTO fixture: every test collects browser console
 * errors and uncaught page exceptions, and fails if there were any.
 * Tests that deliberately break the network opt out with
 * `test.use({ allowConsoleErrors: true })`.
 */
export const test = base.extend({
  allowConsoleErrors: [false, { option: true }],

  consoleErrors: [
    async ({ page, allowConsoleErrors }, use) => {
      const errors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(`Uncaught: ${err.message}`));
      await use(errors);
      if (!allowConsoleErrors) expect(errors, "browser console errors").toEqual([]);
    },
    { auto: true },
  ],

  /** Start every test in light mode with clean storage. */
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("__e2e_init")) {
        localStorage.clear();
        localStorage.setItem("theme", "light");
        sessionStorage.setItem("__e2e_init", "1");
      }
    });
    await use(page);
  },
});

export { expect };

/** Clears the backend's shared training state. */
export async function resetBackend(request) {
  const r = await request.post("/api/train/reset");
  expect(r.status()).toBe(204);
}

/** True if the page can scroll sideways (a layout bug on small screens). */
export function hasHorizontalOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
}

export const ROUTES = [
  { path: "/", heading: "See How Neural Networks Think" },
  { path: "/neuron", heading: "What is a Neuron?" },
  { path: "/build", heading: "Build the Network" },
  { path: "/forward-pass", heading: "The Forward Pass" },
  { path: "/train", heading: "Train & Watch It Learn" },
  { path: "/boundary", heading: "Decision Boundary" },
  { path: "/glossary", heading: "Glossary of AI Terms" },
  { path: "/about", heading: "About Inside the Network" },
  { path: "/no-such-page", heading: /not found|lost/i },
];
