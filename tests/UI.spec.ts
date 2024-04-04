import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {

  test('has correct title', async ({ page }) => {
      await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
      await expect(page).toHaveTitle("WealthWise Hub");
  });
  
  test('images load successfully', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
  
    const imageHandles = await page.$$('img');
    for (const imageHandle of imageHandles) {
      const imageSrc = await imageHandle.getAttribute('src');
      expect(imageSrc).toBeTruthy();
    }
  });

  test('landing page contains correct elements', async ({ page }) => {
      await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
      
      // Check for existence of specific elements
      const pageTitle = await page.textContent('.text-white');
      expect(pageTitle).toContain('Welcome to WealthWise Hub');
      
      const containerExists = await page.isVisible('.container');
      expect(containerExists).toBe(true);
      
      const grayTextExists = await page.isVisible('.text-gray-600');
      expect(grayTextExists).toBe(true);
  
      // Check for existence of buttons
      const signUpButtonExists = await page.isVisible('text=Sign Up');
      expect(signUpButtonExists).toBe(true);
  
      const loginButtonExists = await page.isVisible('text=Log In');
      expect(loginButtonExists).toBe(true);
  });

});

test.describe('Sign In Page', () => {
  test('should display sign in title and subtitle', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-in');

    // Check if sign in title and subtitle are present
    const signInTitle = await page.textContent('.cl-headerTitle');
    const signInSubtitle = await page.textContent('.cl-headerSubtitle');

    expect(signInTitle).toContain('Sign in');
    expect(signInSubtitle).toContain('to continue to WealthWise Hub');
  });

  test('should have a sign up link', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-in');

    // Check if sign up link is present and has correct URL
    const signUpLink = await page.getAttribute('.cl-footerActionLink', 'href');
    const signUpLinkText = await page.textContent('.cl-footerActionLink');

    expect(signUpLink).toContain('https://wealth-wise-hub-full-stack.vercel.app/sign-up');
    expect(signUpLinkText).toContain('Sign up');
  });
});

test.describe('Sign Up Page', () => {

  test('should display sign up title and subtitle', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-up');

    // Check if sign up title and subtitle are present
    const signUpTitle = await page.textContent('.cl-headerTitle');
    const signUpSubTitle = await page.textContent('.cl-headerSubtitle');

    expect(signUpTitle).toContain('Create your account');
    expect(signUpSubTitle).toContain('to continue to WealthWise Hub');
  });

  test('should have a sign in link', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-up');

    // Check if sign in link is present and has correct URL
    const signInLink = await page.getAttribute('.cl-footerActionLink', 'href');
    const signInLinkText = await page.textContent('.cl-footerActionLink');

    expect(signInLink).toContain('https://wealth-wise-hub-full-stack.vercel.app/sign-in');
    expect(signInLinkText).toContain('Sign in');
  });

});

  