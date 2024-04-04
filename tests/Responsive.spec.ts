import { test, expect } from '@playwright/test';

const viewportSizes = [
  { width: 320, height: 480 },
  { width: 375, height: 667 },
  { width: 414, height: 736 },
  { width: 375, height: 812 },
  { width: 414, height: 896 },

  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 834, height: 1112 },
  { width: 834, height: 1194 },
  { width: 1024, height: 1366 }
];

test.describe('Landing Page', () => {
  test('is responsive', async ({ page }) => {
    for (const { width, height } of viewportSizes) {
      // Set viewport size
      await page.setViewportSize({ width, height });

      // Navigate to the landing page
      await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');

      await page.waitForSelector('text=Sign Up');
      const signUpButtonVisible = await page.isVisible('text=Sign Up');
      expect(signUpButtonVisible).toBeTruthy();

      await page.waitForSelector('text=Log In');
      const logInButtonVisible = await page.isVisible('text=Log In');
      expect(logInButtonVisible).toBeTruthy();
      // Wait for a short delay to allow page to render
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Sign In Page', () => {
  test('is responsive', async ({ page }) => {
    for (const { width, height } of viewportSizes) {
      // Set viewport size
      await page.setViewportSize({ width, height });

      // Navigate to the sign-in page
      await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-in');

      // Wait for the sign-in buttons to be visible
      await page.waitForSelector('.cl-socialButtonsIconButton__google');

      // Check if sign-in buttons are visible
      const googleButtonVisible = await page.isVisible('.cl-socialButtonsIconButton__google');
      const facebookButtonVisible = await page.isVisible('.cl-socialButtonsIconButton__facebook');
      const appleButtonVisible = await page.isVisible('.cl-socialButtonsIconButton__apple');

      expect(googleButtonVisible).toBeTruthy();
      expect(facebookButtonVisible).toBeTruthy();
      expect(appleButtonVisible).toBeTruthy();

      // Wait for a short delay to allow page to render
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Sign Up Page', () => {
  test('is responsive', async ({ page }) => {
    for (const { width, height } of viewportSizes) {
      // Set viewport size
      await page.setViewportSize({ width, height });

      // Navigate to the sign-up page
      await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-up');

      // Wait for the sign-up buttons to be visible
      await page.waitForSelector('.cl-socialButtonsIconButton__google');

      // Check if sign-up buttons are visible
      const googleButtonVisible = await page.isVisible('.cl-socialButtonsIconButton__google');
      const facebookButtonVisible = await page.isVisible('.cl-socialButtonsIconButton__facebook');
      const appleButtonVisible = await page.isVisible('.cl-socialButtonsIconButton__apple');

      expect(googleButtonVisible).toBeTruthy();
      expect(facebookButtonVisible).toBeTruthy();
      expect(appleButtonVisible).toBeTruthy();

      // Wait for a short delay to allow the page to render
      await page.waitForTimeout(1000);
    }
  });
});
  