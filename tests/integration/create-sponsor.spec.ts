import { test } from './utils/dappwright';
import { expect } from '@playwright/test';
import { setupDb, createUserFixture, clearSponsorsTable } from './utils/fixtures';

test.describe('Sponsor Information Form', () => {
	test.beforeAll(async () => {
		await setupDb([createUserFixture]);
	});

	test.beforeEach(async () => {
		await clearSponsorsTable();
	});

	test("redirects to create sponsor profile cookiePage if user doesn't have one", async ({
		cookiePage
	}) => {
		await cookiePage.goto('/app/sponsor');
		await expect(cookiePage).toHaveURL('/app/create-sponsor-profile');
	});

	test('renders the form correctly', async ({ cookiePage }) => {
		await cookiePage.goto('/app/create-sponsor-profile');

		await expect(cookiePage.getByRole('heading', { name: 'Sponsor Information' })).toBeVisible();
		await expect(cookiePage.getByLabel('Display Name')).toBeVisible();
		await expect(cookiePage.getByLabel('Email')).toBeVisible();
		await expect(cookiePage.getByLabel('Website')).toBeVisible();
		await expect(cookiePage.getByLabel('Twitter')).toBeVisible();
		await expect(cookiePage.getByLabel('Image URL')).toBeVisible();
		await expect(cookiePage.getByLabel('Bio')).toBeVisible();
		await expect(cookiePage.getByRole('button', { name: 'Submit' })).toBeVisible();
	});

	test('fills out the form and submits successfully', async ({ cookiePage }) => {
		await cookiePage.goto('/app/create-sponsor-profile');

		await cookiePage.fill('#displayName', 'John Doe');
		await cookiePage.fill('#email', 'john.doe@example.com');
		await cookiePage.fill('#twitter', '@johndoe');
		await cookiePage.fill('#website', 'https://johndoe.com');
		await cookiePage.fill('#image', 'https://johndoe.com/image.jpg');
		await cookiePage.fill('#bio', 'This is a short bio.');

		await cookiePage.getByLabel('Display Name').fill('Test Sponsor');
		await cookiePage.getByLabel('Email').fill('test@example.com');
		await cookiePage.getByLabel('Website').fill('https://example.com');
		await cookiePage.getByLabel('Twitter').fill('@testhandle');
		await cookiePage.getByLabel('Image URL').fill('https://example.com/image.jpg');
		await cookiePage.getByLabel('Bio').fill('This is a test bio for the sponsor.');

		await cookiePage.click('button[type="submit"]');

		await expect(cookiePage).toHaveURL('/app/sponsor');
	});
});
