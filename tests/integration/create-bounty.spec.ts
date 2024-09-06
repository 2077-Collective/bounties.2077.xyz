import { expect } from '@playwright/test';
import {
	setupDb,
	createUserFixture,
	clearSponsorsTable,
	createSponsorFixture
} from './utils/fixtures';
import { test } from './utils/dappwright';

test.describe.only('Create Bounty Form', () => {
	test.beforeAll(async () => {
		await setupDb([createUserFixture, createSponsorFixture]);
	});

	test.beforeEach(async ({ cookiePage }) => {
		await cookiePage.goto('/app/sponsor/create-bounty');
	});

	test('renders the form correctly', async ({ cookiePage }) => {
		await expect(cookiePage.getByLabel('Title')).toBeVisible();
		await expect(cookiePage.getByLabel('Excerpt')).toBeVisible();
		await expect(cookiePage.getByLabel('Categories')).toBeVisible();
		await expect(cookiePage.getByLabel('Briefing')).toBeVisible();
		await expect(cookiePage.getByLabel('Start Date')).toBeVisible();
		await expect(cookiePage.getByLabel('End Date')).toBeVisible();
		await expect(cookiePage.getByText('Rewards')).toBeVisible();
		await expect(cookiePage.getByRole('button', { name: 'Create Bounty' })).toBeVisible();
	});

	test('fills out the form and submits successfully', async ({ cookiePage }) => {
		// Fill out the form
		await cookiePage.fill('input[name="title"]', 'Test Bounty');
		await cookiePage.fill('input[name="excerpt"]', 'A short description of the test bounty');
		await cookiePage.fill(
			'textarea[name="description"]',
			'Detailed description of the test bounty'
		);
		await cookiePage.fill('input[name="startDate"]', '2023-07-01');
		await cookiePage.fill('input[name="endDate"]', '2023-08-01');

		// Select categories
		await cookiePage.click('input[placeholder="Add category"]');
		await cookiePage.fill('input[placeholder="Add category"]', 'JavaScript');
		await cookiePage.press('input[placeholder="Add category"]', 'ArrowDown');
		await cookiePage.press('input[placeholder="Add category"]', 'Enter');

		// Set rewards
		// Click the "Winner takes all" tab
		await cookiePage.click('button:has-text("Winner takes all")');

		// Fill in the reward amount
		await cookiePage.fill('input#reward', '1000');

		await cookiePage.click('#paymentChain');
		await cookiePage.pause();
		await cookiePage.click('li:has-text("Ethereum")');

		await cookiePage.click('#tokenId');
		await cookiePage.click('li:has-text("USDC")');

		await cookiePage.click('button[type="submit"]');

		await expect(cookiePage).toHaveURL('/app/sponsor');

		// TODO: uncomment this after list is implemented
		// await expect(cookiePage.getByText('Test Bounty')).toBeVisible();
	});
});
