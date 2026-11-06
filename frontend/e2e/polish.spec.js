// Phase 9: polish — offline banner, tooltips, explain panels, keyboard access
import { test, expect } from "./fixtures";

test("forward-pass nodes show a tooltip on keyboard focus and select on Enter", async ({ page }) => {
  await page.goto("/forward-pass");
  await page.getByRole("slider", { name: "Speed" }).fill("2");
  await page.getByRole("button", { name: "Run Forward Pass" }).click();
  await expect(page.getByText(/^Score:/)).toBeVisible();

  const node = page.getByRole("button", { name: /^Hidden layer 1, neuron 2:/ });
  await node.focus();
  const tip = page.getByRole("tooltip");
  await expect(tip).toContainText("Hidden layer 1 · neuron 2");
  await expect(tip).toContainText("z = Σ w·x + b");

  await page.keyboard.press("Enter");
  await expect(node).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Hidden layer 1, node 2")).toBeVisible();
});

test("Explain this step opens a live walkthrough", async ({ page }) => {
  await page.goto("/neuron");
  const toggle = page.getByRole("button", { name: "Explain this step" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("region", { name: "Explain this step" })).toContainText("Weigh each input");
});

test("the decision boundary can be probed with the keyboard", async ({ page }) => {
  await page.goto("/boundary");
  await page.getByRole("button", { name: "Use a pretrained network" }).click();
  const plot = page.getByRole("application", { name: /Decision boundary/ });
  await plot.focus();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowUp");
  }
  await page.keyboard.press("Enter");
  await expect(page.getByText(/At \(-0\.50, 0\.50\) it says Class B/)).toBeVisible(); // XOR: top-left = B
});

test("Escape closes the Sections menu and returns focus to its button", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "Sections" });
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(button).toBeFocused();
});

test.describe("backend offline", () => {
  test.use({ allowConsoleErrors: true }); // the health check fails on purpose

  test("a banner appears while /health is down and clears once it's back", async ({ page }) => {
    await page.route("**/health", (route) => route.abort("connectionrefused"));
    await page.goto("/neuron");
    const banner = page.getByRole("region", { name: "Backend status" });
    await expect(banner).toContainText("Backend offline");

    await page.unroute("**/health");
    await banner.getByRole("button", { name: "Check again" }).click();
    await expect(banner).toHaveCount(0);
  });
});
