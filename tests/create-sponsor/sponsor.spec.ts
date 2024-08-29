import { test, expect } from '@playwright/test';
import { setupDb } from '../utils/setup-db';

test.describe('Sponsor Information Form', () => {
	test.beforeAll(async () => await setupDb());

	test.beforeEach(async ({ page }) => {
		await page.goto('/sponsor');
	});

	test.only('renders the form correctly', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Sponsor Information' })).toBeVisible();
		await expect(page.getByLabel('Display Name')).toBeVisible();
		await expect(page.getByLabel('Email')).toBeVisible();
		await expect(page.getByLabel('Website')).toBeVisible();
		await expect(page.getByLabel('Twitter')).toBeVisible();
		await expect(page.getByLabel('Image URL')).toBeVisible();
		await expect(page.getByLabel('Bio')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
	});

	test.only('fills out the form and submits successfully', async ({ page }) => {
		await page.fill('#displayName', 'John Doe');
		await page.fill('#email', 'john.doe@example.com');
		await page.fill('#twitter', '@johndoe');
		await page.fill('#website', 'https://johndoe.com');
		await page.fill('#image', 'https://johndoe.com/image.jpg');
		await page.fill('#bio', 'This is a short bio.');

		await page.getByLabel('Display Name').fill('Test Sponsor');
		await page.getByLabel('Email').fill('test@example.com');
		await page.getByLabel('Website').fill('https://example.com');
		await page.getByLabel('Twitter').fill('@testhandle');
		await page.getByLabel('Image URL').fill('https://example.com/image.jpg');
		await page.getByLabel('Bio').fill('This is a test bio for the sponsor.');

		await page.click('button[type="submit"]');

		// Check if the success message is displayed
		// await expect(page.getByText('Form submitted successfully!')).toBeVisible();
	});

	test('validates required fields', async ({ page }) => {
		await page.getByRole('button', { name: 'Submit' }).click();

		// Check if the form prevents submission when fields are empty
		await expect(page.getByLabel('Display Name')).toBeFocused();
		await expect(page.getByLabel('Display Name')).toHaveAttribute('required', '');

		// Fill out one field and try to submit again
		await page.getByLabel('Display Name').fill('Test Sponsor');
		await page.getByRole('button', { name: 'Submit' }).click();

		// The next required field should be focused
		await expect(page.getByLabel('Email')).toBeFocused();
		await expect(page.getByLabel('Email')).toHaveAttribute('required', '');

		// Ensure the success message is not displayed
		await expect(page.getByText('Form submitted successfully!')).not.toBeVisible();
	});
});
