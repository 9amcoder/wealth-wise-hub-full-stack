import { ROUTES } from '@/constant/routeLabel';
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {

  test('clicking on login button navigates to sign-in page', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    await page.click('text=Log In');
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/sign-in');

    const signInText = await page.textContent('text=Sign In');
    expect(signInText).toBeTruthy();
  });

  test('clicking on sign-up button navigates to sign-up page', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    await page.click('text=Sign Up');
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/sign-up');

    const signUpText = await page.textContent('text=Create your account');
    expect(signUpText).toBeTruthy();
  });

});

test.describe('Sign In Page', () => {

  test('should navigate to Google login page when clicking "Sign in with Google" button', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-in');
    await page.click('.cl-socialButtonsIconButton__google');
    await page.waitForNavigation();
    expect(page.url()).toContain('https://accounts.google.com');
  });

  test('should navigate to Facebook login page when clicking "Sign in with Facebook" button', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-in');
    await page.click('.cl-socialButtonsIconButton__facebook');
    await page.waitForNavigation();
    expect(page.url()).toContain('https://www.facebook.com');
  });

  test('should navigate to Apple login page when clicking "Sign in with Apple" button', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-in');
    await page.click('.cl-socialButtonsIconButton__apple');
    await page.waitForNavigation();
    expect(page.url()).toContain('https://appleid.apple.com');
  });

});

test.describe('Sign Up Page', () => {

  test('should navigate to Google page when clicking "Siup in with Google" button', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-up');
    await page.click('.cl-socialButtonsIconButton__google');
    await page.waitForNavigation();
    expect(page.url()).toContain('https://accounts.google.com');
  });

  test('should navigate to Facebook page when clicking "Sign up with Facebook" button', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-up');
    await page.click('.cl-socialButtonsIconButton__facebook');
    await page.waitForNavigation();
    expect(page.url()).toContain('https://www.facebook.com');
  });

  test('should navigate to Apple page when clicking "Sign up with Apple" button', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/sign-up');
    await page.click('.cl-socialButtonsIconButton__apple');
    await page.waitForNavigation();
    expect(page.url()).toContain('https://appleid.apple.com');
  });

});

test.describe('Authentication', () => {

  test('should access the website using testUser', async ({ page }) => {
    
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('pmaitri.997@gmail.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Password', { exact: true }).fill('testUser@ww');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/dashboard');
    expect(page.getByText('Hello, Test').isVisible);

  });

  test('user should sign out using clerk auth', async({page}) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('pmaitri.997@gmail.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Password', { exact: true }).fill('testUser@ww');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Open user button' }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
  });
});

test.describe('Dashboard Page', () => {

  test('should access access each route and page changes', async ({ page }) => {    
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('pmaitri.997@gmail.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Password', { exact: true }).fill('testUser@ww');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/dashboard');


    // Loop through each route and click on the link
    for (const route of ROUTES) {
      await page.click(`text=${route.label}`);
      const expectedUrl = `https://wealth-wise-hub-full-stack.vercel.app${route.href}`;
      if (!page.url().includes(route.href)) {
        try {
          await page.waitForNavigation({ timeout: 30000, waitUntil: 'load' });
        } catch (error) {
          console.error('Navigation failed:', error);
        }
        expect(page.url()).toBe(expectedUrl);
      }
      await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    }  
  });
});

test.describe('Transactions Page', () => {

  test('clicking add transaction button should open add transaction page', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('pmaitri.997@gmail.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Password', { exact: true }).fill('testUser@ww');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('link', { name: 'Transactions' }).click();
    await page.getByRole('button', { name: 'Add New +' }).click();
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/add-transaction');
  });

  test('Add income and verify', async ({page}) => {
    // Navigate to the transaction page
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('pmaitri.997@gmail.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Password', { exact: true }).fill('testUser@ww');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/dashboard');

    await page.getByRole('link', { name: 'Transactions' }).click();
    await page.getByRole('button', { name: 'Add New +' }).click();
    await page.getByPlaceholder('Please enter the title of').click();
    await page.getByPlaceholder('Please enter the title of').fill('TestIncomeTransaction');
    await page.getByPlaceholder('Please enter the amount').click();
    await page.getByPlaceholder('Please enter the amount').fill('2500');
    await page.getByPlaceholder('Select date and time').click();
    await page.getByText('Income').click();
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.waitForNavigation();
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/transaction');

    // Assert the presence of the transaction with expected details
    expect(page.getByRole('cell', { name: 'TestIncomeTransaction' }));
  });

  test('Add expense and verify', async ({page}) => {
    // Navigate to the transaction page
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('pmaitri.997@gmail.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Password', { exact: true }).fill('testUser@ww');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/dashboard');

    await page.getByRole('link', { name: 'Transactions' }).click();
    await page.getByRole('button', { name: 'Add New +' }).click();
    await page.getByPlaceholder('Please enter the title of').click();
    await page.getByPlaceholder('Please enter the title of').fill('TestExpenseTransaction');
    await page.getByPlaceholder('Please enter the amount').click();
    await page.getByPlaceholder('Please enter the amount').fill('200');
    await page.getByPlaceholder('Select date and time').click();
    await page.getByText('Expense').click();
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.waitForNavigation();
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/transaction');

    // Assert the presence of the transaction with expected details
    expect(page.getByRole('cell', { name: 'TestExpenseTransaction' }));
  });

  // test('Edit Income and verify', async ({page}) => {
  //   // Navigate to the transaction page
  //   await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
  //   await page.getByRole('link', { name: 'Log In' }).click();
  //   await page.getByLabel('Email address').click();
  //   await page.getByLabel('Email address').fill('pmaitri.997@gmail.com');
  //   await page.getByRole('button', { name: 'Continue' }).click();
  //   await page.getByLabel('Password', { exact: true }).fill('testUser@ww');
  //   await page.getByRole('button', { name: 'Continue' }).click();
  //   await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/dashboard');

  //   await page.getByRole('link', { name: 'Transactions' }).click();
  //   await page.waitForSelector('tbody');
  //   console.log("before")
  //   const transactionRow = await page.waitForSelector('tbody td.font-medium:text("TestIncomeTransaction")');
  //   console.log(transactionRow)
  //   const editButton = await transactionRow.waitForSelector('button.inline-flex:text("Edit")'); 
  //   await editButton.click();
  

  //   await page.getByPlaceholder('Please enter the title of').click();
  //   await page.getByPlaceholder('Please enter the title of').fill('TestExpenseEditTransaction');
  //   await page.getByPlaceholder('Please enter the amount').click();
  //   await page.getByPlaceholder('Please enter the amount').fill('300');
  //   await page.getByPlaceholder('Select date and time').click();
  //   await page.getByText('Expense').click();
  //   await page.getByRole('button', { name: 'Submit' }).click();

  //   await page.waitForNavigation();
  //   await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/transaction');

  //   // Assert the presence of the transaction with expected details
  //   expect(page.getByRole('cell', { name: 'TestExpenseEditTransaction' }));
  // });

});

test.describe('Analytics Page', () => {

  test('Edit goal', async ({ page }) => {
    await page.goto('https://wealth-wise-hub-full-stack.vercel.app/');
    await page.getByRole('link', { name: 'Log In' }).click();
    await page.getByLabel('Email address').click();
    await page.getByLabel('Email address').fill('pmaitri.997@gmail.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Password', { exact: true }).fill('testUser@ww');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL('https://wealth-wise-hub-full-stack.vercel.app/dashboard');

    await page.getByRole('link', { name: 'Analytics' }).click();

    await expect(page.getByText('$300000')).toBeVisible();
  });
});
