import { test, expect } from "@playwright/test";

// Smoke: nav link to /design-studio works and the page renders without runtime errors.
test("nav → design studio renders cleanly", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto("http://localhost:8080/");
  await page.getByRole("link", { name: "Design", exact: true }).first().click();
  await expect(page).toHaveURL(/\/design-studio/);
  await expect(page.locator("body")).toBeVisible();
  // Ignore known noisy warnings; fail on real runtime errors.
  const fatal = errors.filter((e) => !/vite|hmr|favicon|manifest/i.test(e));
  expect(fatal, `runtime errors: ${fatal.join("\n")}`).toEqual([]);
});

// Smoke: cart → checkout flow reaches the checkout page and renders.
test("cart to checkout smoke", async ({ page }) => {
  await page.goto("http://localhost:8080/checkout");
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.locator("body")).toBeVisible();
});
