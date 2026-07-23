import { test, expect } from '@playwright/test';

test.describe('User Interactive Flows - Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for initial page load
    await page.waitForLoadState('networkidle');
  });

  test('should browse products without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    // Find and click products link
    const productsLink = page.locator('a[href*="product"], a:has-text("Products"), a:has-text("Shop")');
    if (await productsLink.count() > 0) {
      await productsLink.first().click();
      await page.waitForLoadState('networkidle');
    }

    // Verify page content loads
    const mainContent = page.locator('main, [role="main"], .container');
    await expect(mainContent).toBeVisible();

    // No unhandled errors should occur
    const fatalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('Network request failed')
    );
    expect(fatalErrors).toHaveLength(0);
  });

  test('should handle newsletter signup without state loss', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    // Find newsletter signup form
    const emailInput = page.locator('input[type="email"]');
    
    if (await emailInput.count() > 0) {
      // Fill form
      await emailInput.first().fill('test@example.com');
      
      // Find and click submit button
      const submitButton = page.locator('button[type="submit"], button:has-text("Subscribe"), button:has-text("Sign Up")');
      if (await submitButton.count() > 0) {
        await submitButton.first().click();
        await page.waitForTimeout(1000);
      }
    }

    // Verify page remains stable
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();

    // Check for errors
    const fatalErrors = errors.filter(e => !e.includes('favicon'));
    expect(fatalErrors).toHaveLength(0);
  });

  test('should handle review submission flow', async ({ page, context }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    // Set local storage to simulate authenticated user
    await context.addInitScript(() => {
      localStorage.setItem('sb-auth', JSON.stringify({
        access_token: 'test-token',
        user: { id: 'test-user-id' }
      }));
    });

    // Reload to apply auth state
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Find product to review
    const productCard = page.locator('[data-testid="product-card"], .product-item, article');
    if (await productCard.count() > 0) {
      // Attempt to open product
      await productCard.first().click();
      await page.waitForTimeout(500);
    }

    // Look for review form
    const reviewForm = page.locator('form[aria-label*="review"], form:has-text("Review"), .review-form');
    if (await reviewForm.count() > 0) {
      const textarea = reviewForm.first().locator('textarea');
      if (await textarea.count() > 0) {
        await textarea.fill('Great product!');
        
        const submitBtn = reviewForm.first().locator('button[type="submit"]');
        if (await submitBtn.count() > 0) {
          await submitBtn.click();
          await page.waitForTimeout(1000);
        }
      }
    }

    // Verify page state persists
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();

    // No unhandled errors
    const fatalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('401'));
    expect(fatalErrors).toHaveLength(0);
  });

  test('should maintain UI stability under rapid interactions', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    // Perform rapid navigation
    const links = page.locator('a');
    const linkCount = Math.min(await links.count(), 5);

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      
      // Skip external links and anchors
      if (href && href.startsWith('/')) {
        await link.click({ force: true });
        await page.waitForTimeout(200);
      }
    }

    // Page should remain responsive
    await expect(page.locator('body')).toBeVisible();

    // No unhandled errors
    const fatalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('404'));
    expect(fatalErrors).toHaveLength(0);
  });
});
