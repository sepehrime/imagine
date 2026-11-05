// Phase 7.1: routes, theme, progress, responsive layout
import { test, expect, ROUTES, hasHorizontalOverflow } from "./fixtures";

test.describe("every route", () => {
  for (const { path, heading } of ROUTES) {
    test(`${path} loads without errors`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toContainText(heading);
    });
  }
});

test("dark/light mode persists across a refresh", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).not.toHaveClass(/dark/);

  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(html).toHaveClass(/dark/);
  await page.reload();
  await expect(html).toHaveClass(/dark/);

  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.reload();
  await expect(html).not.toHaveClass(/dark/);
});

test("progress is saved across sessions", async ({ page }) => {
  await page.goto("/neuron");
  await page.getByRole("button", { name: "Mark as Complete" }).click();
  await expect(page.getByText("● Completed")).toBeVisible();

  await page.reload();
  await expect(page.getByText("● Completed")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("inside_network_progress"))).toBe("[1]");

  await page.goto("/");
  await expect(page.getByRole("progressbar", { name: "Curriculum completion progress" })).toHaveAttribute(
    "aria-valuenow",
    "20"
  );

  // Undo works too
  await page.goto("/neuron");
  await page.getByRole("button", { name: /Section Completed/ }).click();
  await expect(page.getByText("● Completed")).toHaveCount(0);
});

for (const width of [375, 768]) {
  test(`no horizontal scrolling at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const { path } of ROUTES) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(await hasHorizontalOverflow(page), `${path} overflows at ${width}px`).toBe(false);
    }
  });
}
