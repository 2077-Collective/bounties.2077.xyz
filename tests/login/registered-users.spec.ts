import { expect } from '@playwright/test';
import { test } from '../utils/dappwright';

test.describe('Login - Registered Users', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/login');
	});

	test.only('should set cookie with jwt on successful login', async ({ page, wallet }) => {
		await page.click('#login');
		await wallet.signin();

		const cookies = await page.context().cookies();

		expect(cookies).toContainEqual(expect.objectContaining({ name: 'jwt' }));
	});
});
