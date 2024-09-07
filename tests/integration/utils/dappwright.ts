import { type BrowserContext, type Page, test as baseTest } from '@playwright/test';
import dappwright, { type Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright';

export const test = baseTest.extend<{
	context: BrowserContext;
	wallet: Dappwright;
	cookieContext: BrowserContext;
	cookiePage: Page;
}>({
	context: async ({}, use) => {
		// Launch context with extension
		const [, , context] = await dappwright.bootstrap('', {
			wallet: 'metamask',
			version: MetaMaskWallet.recommendedVersion,
			seed: 'test test test test test test test test test test test junk',
			headless: true
		});

		await use(context);
	},
	wallet: async ({ context }, use) => {
		const metamask = await dappwright.getWallet('metamask', context);

		await use(metamask);
	},
	cookieContext: async ({ browser }, use) => {
		const context = await browser.newContext();

		await context.addCookies([
			{
				name: 'jwt',
				// userId = 0
				value: 'eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjowfQ.La-3tjGBjVpUyjbhnEJF7BV-ygWVt1FHdw8PfrGNrrE',
				path: '/',
				domain: 'localhost:4173'
			}
		]);

		await use(context);
		await context.close();
	},
	cookiePage: async ({ cookieContext }, use) => {
		// Create a new page from the cookie context
		const page = await cookieContext.newPage();
		await use(page);
		await page.close();
	}
});
