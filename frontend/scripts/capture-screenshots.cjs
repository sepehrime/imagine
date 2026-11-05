/**
 * Captures the README screenshots into docs/screenshots/.
 *
 * Needs both dev servers running (backend :8000, frontend :5173), then from frontend/:
 *   npm run screenshots
 * or against another server:  node scripts/capture-screenshots.cjs <baseURL> <outDir>
 *
 * Note: it resets the backend's training state and trains "Circle vs Square",
 * so the Section 5 shot shows a round decision boundary.
 */
const { chromium } = require("@playwright/test");
const [base = "http://localhost:5173", out = "../docs/screenshots"] = process.argv.slice(2);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.request.post(base + "/api/train/reset");

  async function shot(name, focus, offset = 120) {
    if (focus) {
      // Put the target just below the sticky header (64px) with some context above it
      await focus.first().evaluate((el, offset) => {
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - offset);
      }, offset);
    }
    await page.waitForTimeout(700); // let animations settle
    await page.screenshot({ path: `${out}/${name}.png` });
    console.log("saved", name);
  }

  await page.goto(base + "/");
  await shot("home");

  await page.goto(base + "/neuron");
  await shot("1-neuron", page.locator('svg[aria-label^="Neuron diagram"]'), 200);

  await page.goto(base + "/build");
  await page.getByLabel("Hidden layers").fill("3").catch(() => {});
  await shot("2-build", page.locator("svg").filter({ has: page.locator("line") }).first());

  await page.goto(base + "/forward-pass");
  await page.getByRole("slider", { name: "Speed" }).fill("2");
  await page.getByRole("button", { name: "Run Forward Pass" }).click();
  await page.getByText(/^Score:/).waitFor();
  await shot("3-forward-pass", page.locator("svg").filter({ has: page.locator("circle") }).first());

  await page.goto(base + "/train");
  await page.getByRole("radio", { name: /Circle vs Square/ }).click();
  await page.getByRole("button", { name: "Start Training" }).click();
  await page.getByText("Training Complete 🎉").waitFor({ timeout: 30000 });
  await shot("4-train", page.getByText("2. Watch it learn"), 100);

  await page.goto(base + "/boundary");
  const plot = page.locator('svg[aria-label^="Decision boundary"]');
  await plot.locator("image").waitFor();
  const box = await plot.boundingBox();
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await shot("5-boundary", plot, 90);

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
