import { expect } from '@playwright/test';
import { test } from './utils/dappwright';

const WALLET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
test.describe('Create account - Registration Form', () => {
	test.beforeEach(async ({ cookiePage }) => {
		await cookiePage.goto('/');
		await cookiePage.evaluate((walletAddress) => {
			localStorage.setItem('walletAddress', walletAddress);
		}, WALLET_ADDRESS);
		await cookiePage.goto('/create-account');
	});

	test('should submit form with valid data', async ({ cookiePage }) => {
		await cookiePage.fill('#displayName', 'John Doe');
		await cookiePage.fill('#email', 'john.doe@example.com');
		await cookiePage.fill('#twitter', '@johndoe');
		await cookiePage.fill('#website', 'https://johndoe.com');
		await cookiePage.fill('#image', 'https://johndoe.com/image.jpg');
		await cookiePage.fill('#bio', 'This is a short bio.');

		await cookiePage.click('button[type="submit"]');

		await expect(cookiePage).toHaveURL('/app');
	});

	test('should send walletAddress from local storage', async ({ cookiePage }) => {
		await cookiePage.fill('#displayName', 'John Doe');
		await cookiePage.fill('#email', 'john.doe@example.com');
		await cookiePage.fill('#twitter', '@johndoe');
		await cookiePage.fill('#website', 'https://johndoe.com');
		await cookiePage.fill('#image', 'https://johndoe.com/image.jpg');
		await cookiePage.fill('#bio', 'This is a short bio.');

		await cookiePage.route('**/register', (route) => {
			const postData = route.request().postData();
			expect(postData).toContain('walletAddress=' + WALLET_ADDRESS);
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			});
		});

		await cookiePage.click('button[type="submit"]');
	});

	test.skip('should display validation errors for empty required fields', async ({
		cookiePage
	}) => {
		await cookiePage.click('button[type="submit"]');

		await expect(cookiePage.locator('p:text("Display name is required")')).toBeVisible();
		await expect(cookiePage.locator('p:text("Username is required")')).toBeVisible();
		await expect(cookiePage.locator('p:text("Email is required")')).toBeVisible();
		await expect(cookiePage.locator('p:text("Bio is required")')).toBeVisible();
	});
});
