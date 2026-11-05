// Phase 7.1: each section's core interaction, against the real backend
import { test, expect, resetBackend } from "./fixtures";

test.beforeEach(async ({ request }) => resetBackend(request));

test("Section 1: sliders update the neuron output in real time", async ({ page }) => {
  await page.goto("/neuron");
  // The computed line ("Sigmoid(1.000) = …"), not the formula above it ("Sigmoid(w₁x₁ …")
  const output = page.getByText(/^output = Sigmoid\(-?\d/);
  await expect(output).toContainText("0.731");

  await page.getByLabel("w₁").fill("-2");
  await expect(output).not.toContainText("0.731");
  await expect(page.getByText(/Leave it|Bring it/)).toBeVisible();

  await page.getByLabel("Activation function").selectOption("relu");
  await expect(page.getByText(/^output = ReLU\(-?\d/)).toBeVisible();
});

test("Section 2: the diagram re-renders live and the architecture can be locked", async ({ page }) => {
  await page.goto("/build");
  const nodes = page.locator('svg[aria-label^="Fully connected network"] circle');
  await expect(nodes).toHaveCount(2 + 4 + 4 + 1);

  await page.getByLabel("Hidden layers").fill("3");
  await page.getByLabel("Nodes per hidden layer").fill("6");
  await expect(nodes).toHaveCount(2 + 6 + 6 + 6 + 1);
  await expect(page.locator("dl")).toContainText("Weights" + "90"); // 2·6 + 6·6 + 6·6 + 6·1

  await page.getByRole("button", { name: "Lock This Architecture" }).click();
  await expect(page.getByText(/Locked: 2 → 6 → 6 → 6 → 1/)).toBeVisible();
});

test("Section 3: the forward pass animates through every layer (auto + step)", async ({ page }) => {
  await page.goto("/forward-pass");
  await page.getByRole("slider", { name: "Speed" }).fill("2"); // fast
  await page.getByRole("button", { name: "Run Forward Pass" }).click();
  await expect(page.getByText(/^Score:/)).toBeVisible(); // output panel appears at the end
  await expect(page.getByText("Output layer, node 1")).toBeVisible();

  await page.getByRole("radio", { name: "Step through" }).click();
  await page.getByRole("button", { name: "Back to start" }).click();
  await expect(page.getByText(/Input layer:/)).toBeVisible();
  const next = page.getByRole("button", { name: "Next Layer" });
  for (const layer of ["Hidden layer 1", "Hidden layer 2", "Output layer"]) {
    await next.click();
    await expect(page.getByText(`${layer}, node 1`)).toBeVisible();
  }
  await expect(next).toBeDisabled();
});

test("Section 4: loss curve animates during training; pause, resume and reset work", async ({ page }) => {
  await page.goto("/train");
  await page.getByRole("radio", { name: /Circle vs Square/ }).click();
  await page.getByRole("button", { name: "Start Training" }).click();
  await expect(page.getByText("Training…")).toBeVisible();

  const lossLine = page.locator("figure").first().locator(".recharts-line-curve");
  await expect(lossLine).toBeVisible();
  const pathBefore = await lossLine.getAttribute("d");
  await expect.poll(() => lossLine.getAttribute("d")).not.toBe(pathBefore); // the curve grows live

  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByText("Paused")).toBeVisible();
  await expect(page.getByLabel("Epochs")).toBeDisabled(); // settings locked mid-run
  await page.getByRole("button", { name: "Resume" }).click();

  await expect(page.getByText("Training Complete 🎉")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole("link", { name: "View Decision Boundary" })).toBeVisible();

  await page.getByRole("button", { name: "Reset training" }).click();
  await expect(page.getByText("Press Start Training to begin.")).toBeVisible();
});

test("Section 5: the heatmap renders and clicking predicts a point", async ({ page }) => {
  await page.goto("/boundary");
  await page.getByRole("button", { name: "Use a pretrained network" }).click();

  const plot = page.locator('svg[aria-label^="Decision boundary"]');
  await expect(plot.locator("image")).toHaveAttribute("href", /^data:image\/png/);

  const box = await plot.boundingBox();
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.25); // top-left quadrant
  await expect(page.getByText(/it says Class B, \d+% sure/)).toBeVisible(); // XOR: top-left = B
});
