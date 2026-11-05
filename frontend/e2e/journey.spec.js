// Phase 7.3: the whole learner journey, with data carried between sections
import { test, expect, resetBackend } from "./fixtures";

test.beforeEach(async ({ request }) => resetBackend(request));

async function markComplete(page) {
  await page.getByRole("button", { name: "Mark as Complete" }).click();
  await expect(page.getByText("● Completed")).toBeVisible();
}

// The button uses the short SECTIONS_NAV title; the page's <h1> can be longer
async function nextSection(page, navTitle, heading = navTitle) {
  await page.getByRole("link", { name: new RegExp(`Next Section.*${navTitle}`, "i") }).click();
  await expect(page.locator("h1")).toContainText(heading);
}

test("Home → Neuron → Build → Forward Pass → Train → Boundary", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Start Exploring" }).first().click(); // the hero button; section cards share the label
  await expect(page.locator("h1")).toContainText("What is a Neuron?");
  await markComplete(page);

  // Section 2: design and lock a network
  await nextSection(page, "Build the Network");
  await page.getByLabel("Input nodes").fill("3");
  await page.getByLabel("Output nodes").fill("2");
  await page.getByRole("button", { name: "Lock This Architecture" }).click();
  await markComplete(page);

  // Section 3: the locked architecture is carried over
  await nextSection(page, "Forward Pass", "The Forward Pass");
  await expect(page.getByText("3 → 4 → 4 → 2")).toBeVisible();
  await expect(page.getByText("your network from Section 2")).toBeVisible();
  await expect(page.getByRole("spinbutton")).toHaveCount(3); // one input box per input node
  await page.getByRole("slider", { name: "Speed" }).fill("2");
  await page.getByRole("button", { name: "Run Forward Pass" }).click();
  await expect(page.getByText(/^Prediction:/)).toBeVisible(); // 2 outputs → softmax prediction
  await markComplete(page);

  // Section 4: train on Three Clusters
  await nextSection(page, "Train & Watch It Learn");
  await page.getByRole("radio", { name: /Three Clusters/ }).click();
  await page.getByLabel("Epochs").fill("60");
  await page.getByRole("button", { name: "Start Training" }).click();
  await expect(page.getByText("Training Complete 🎉")).toBeVisible({ timeout: 30_000 });
  await markComplete(page);

  // Section 5: the model trained in Section 4 is the one shown
  await page.getByRole("link", { name: "View Decision Boundary" }).click();
  await expect(page.locator("h1")).toContainText("Decision Boundary");
  await expect(page.getByText("Current model")).toBeVisible();
  await expect(page.getByText("Three Clusters", { exact: true })).toBeVisible();
  await expect(page.getByText(/60 epochs/)).toBeVisible();
  await markComplete(page);

  // All five "Mark as Complete" buttons were recorded
  await page.goto("/");
  await expect(page.getByRole("progressbar", { name: "Curriculum completion progress" })).toHaveAttribute(
    "aria-valuenow",
    "100"
  );
  expect(await page.evaluate(() => localStorage.getItem("inside_network_progress"))).toBe("[1,2,3,4,5]");
});

test("Section 3 falls back to the default network when nothing is locked", async ({ page }) => {
  await page.goto("/forward-pass");
  await expect(page.getByText("2 → 4 → 4 → 1")).toBeVisible();
  await expect(page.getByText(/default network/)).toBeVisible();
});

test("Section 5 offers a way forward when no model has been trained", async ({ page }) => {
  await page.goto("/boundary");
  await expect(page.getByText("No trained network yet")).toBeVisible();
  await expect(page.getByRole("link", { name: "Go to Section 4" })).toBeVisible();
});
