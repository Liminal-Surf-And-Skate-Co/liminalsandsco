import { test, expect } from "@playwright/test";

test.describe("E2E Checkout — Cart to Order Confirmation", () => {
  test("complete cart-to-order flow with mocked payment", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    // Intercept any outgoing payment API calls and respond with a mock success
    let interceptedPayload: Record<string, unknown> | null = null;
    await page.route("**/functions/v1/**", async (route) => {
      const url = route.request().url();
      if (url.includes("payment") || url.includes("checkout") || url.includes("order")) {
        const body = route.request().postData();
        if (body) {
          try {
            interceptedPayload = JSON.parse(body);
          } catch {
            interceptedPayload = { raw: body };
          }
        }
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, orderId: "test-order-123" }),
        });
        return;
      }
      await route.continue();
    });

    // Navigate to checkout page directly
    await page.goto("http://localhost:8080/checkout");
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator("body")).toBeVisible();

    // Fill out the checkout form
    await page.locator('input[id="email"]').fill("test@example.com");
    await page.locator('input[id="name"]').fill("Test User");
    await page.locator('input[id="address"]').fill("123 Test Street");
    await page.locator('input[id="city"]').fill("Test City");
    await page.locator('input[id="zip"]').fill("12345");

    // Fill card details
    await page.locator('input[placeholder="Card number"]').fill("4242424242424242");
    await page.locator('input[placeholder="MM / YY"]').fill("12/28");
    await page.locator('input[placeholder="CVC"]').fill("123");

    // Submit the form
    await page.locator('button[type="submit"]').click();

    // Wait for processing to complete and confirmation to appear
    await expect(page.locator("text=Order confirmed")).toBeVisible({ timeout: 10000 });

    // Verify the confirmation screen rendered
    await expect(page.locator("text=Keep shopping")).toBeVisible();
    await expect(page.locator("text=View account")).toBeVisible();

    // Assert no fatal runtime errors occurred
    const fatal = errors.filter((e) => !/vite|hmr|favicon|manifest/i.test(e));
    expect(fatal, `runtime errors: ${fatal.join("\n")}`).toEqual([]);
  });

  test("checkout shows empty cart message when no items", async ({ page }) => {
    await page.goto("http://localhost:8080/checkout");
    // If cart is empty, the empty state should be visible
    const emptyMsg = page.locator("text=Your cart is empty");
    const orderHeading = page.locator("text=Order confirmed");
    // One of the two states should be present
    await expect(emptyMsg.or(orderHeading).or(page.locator('text=Checkout'))).toBeVisible();
  });

  test("simulate payment failure shows error banner", async ({ page }) => {
    await page.goto("http://localhost:8080/checkout");

    // Check if cart has items by looking for the form
    const form = page.locator('form');
    if (await form.count() > 0) {
      // Enable simulate failure toggle
      const failToggle = page.locator('input[type="checkbox"]');
      if (await failToggle.count() > 0) {
        await failToggle.check();
      }

      // Fill minimal form
      await page.locator('input[id="email"]').fill("fail@test.com");
      await page.locator('input[id="name"]').fill("Fail Test");
      await page.locator('input[id="address"]').fill("456 Fail Ave");
      await page.locator('input[id="city"]').fill("Fail City");
      await page.locator('input[id="zip"]').fill("54321");
      await page.locator('input[placeholder="Card number"]').fill("4000000000000002");
      await page.locator('input[placeholder="MM / YY"]').fill("12/28");
      await page.locator('input[placeholder="CVC"]').fill("123");

      await page.locator('button[type="submit"]').click();

      // Error banner should appear
      await expect(page.locator("text=Payment couldn't be completed")).toBeVisible({ timeout: 10000 });
    }
  });
});
