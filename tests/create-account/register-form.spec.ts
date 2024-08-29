import { test, expect } from '@playwright/test';

<<<<<<< Updated upstream
test.describe.skip('Create account - Registration Form', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/create-account');
=======
test.describe('Create account - Registration Form', () => {
	const walletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

	test.beforeAll(async () => setupDb());

	test.beforeEach(async ({ page, browser }) => {
		const browserContext = await browser.newContext();
		await browserContext.addCookies([
			{
				name: 'jwt',
				value:
					'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOm51bGx9.mPVHMpoIhg-XLn3_Kj3kI88ulNRchozDxtJpRGkbVkA',
				path: '/',
				domain: 'localhost:4173'
			}
		]);

		await page.goto('/');
>>>>>>> Stashed changes
		await page.evaluate(() => {
			localStorage.setItem('walletAddress', walletAddress);
		});
		await page.reload();
	});

<<<<<<< Updated upstream
<<<<<<< Updated upstream
	test('should submit form with valid data', async ({ page }) => {
		// Fill out the form
=======
	test.only('should submit form with valid data', async ({ page }) => {
>>>>>>> Stashed changes
=======
	test.only('should submit form with valid data', async ({ page }) => {
>>>>>>> Stashed changes
		await page.fill('#displayName', 'John Doe');
		await page.fill('#email', 'john.doe@example.com');
		await page.fill('#twitter', '@johndoe');
		await page.fill('#website', 'https://johndoe.com');
		await page.fill('#image', 'https://johndoe.com/image.jpg');
		await page.fill('#bio', 'This is a short bio.');

		await page.click('button[type="submit"]');

<<<<<<< Updated upstream
<<<<<<< Updated upstream
		// Assert that the form submission was successful
		// This will depend on your server response or redirection
		await expect(page).toHaveURL('/success-page-or-some-other-page');
=======
=======
>>>>>>> Stashed changes
		await expect(page).toHaveURL('/app');
>>>>>>> Stashed changes
	});

	test.skip('should display validation errors for empty required fields', async ({ page }) => {
		await page.click('button[type="submit"]');

		await expect(page.locator('p:text("Display name is required")')).toBeVisible();
		await expect(page.locator('p:text("Username is required")')).toBeVisible();
		await expect(page.locator('p:text("Email is required")')).toBeVisible();
		await expect(page.locator('p:text("Bio is required")')).toBeVisible();
	});

	test.skip('should send walletAddress from local storage', async ({ page }) => {
		await page.fill('#displayName', 'John Doe');
		await page.fill('#email', 'john.doe@example.com');
		await page.fill('#twitter', '@johndoe');
		await page.fill('#website', 'https://johndoe.com');
		await page.fill('#image', 'https://johndoe.com/image.jpg');
		await page.fill('#bio', 'This is a short bio.');

		await page.route('**/register', (route) => {
			const postData = route.request().postData();
			expect(postData).toContain('walletAddress=' + walletAddress);
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			});
		});

		await page.click('button[type="submit"]');
	});
});
