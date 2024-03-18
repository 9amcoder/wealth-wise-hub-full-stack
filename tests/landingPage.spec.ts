import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("WealthWise Hub");
});

// click login button navigate to sign-up page
test('click login button', async ({ page }) => {
  await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
  await page.click('text=Log In');
  await expect(page).toHaveTitle("WealthWise Hub");
  await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/sign-up');
});
