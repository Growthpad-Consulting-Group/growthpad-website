import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.locator("h2:has-text('How we do it')").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
for (let i = 0; i < 6; i++) {
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(350);
}
await page.screenshot({ path: "/private/tmp/claude-501/-Users-Apple-code-clients-growthpad-website/e27552e6-89a4-4399-9af6-3123d08a9016/scratchpad/num_check.png" });
await browser.close();
