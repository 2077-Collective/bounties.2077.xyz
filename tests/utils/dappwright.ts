import { type BrowserContext, test as baseTest } from '@playwright/test';
import dappwright, { type Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright';

export const test = baseTest.extend<{
	context: BrowserContext;
	wallet: Dappwright;
}>({
	context: async ({}, use) => {
		const [, , context] = await dappwright.bootstrap('', {
			wallet: 'metamask',
			version: MetaMaskWallet.recommendedVersion,
			seed: 'test test test test test test test test test test test junk',
			headless: false
		});

		await use(context);
	},

	wallet: async ({ context }, use) => {
		const metamask = await dappwright.getWallet('metamask', context);

		await use(metamask);
	}
});
