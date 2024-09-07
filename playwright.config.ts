import type { PlaywrightTestConfig } from '@playwright/test';
import { MetaMaskWallet } from '@tenkeylabs/dappwright';
import dotenv from 'dotenv';

// Load environment variables from .env.test
dotenv.config({ path: '.env.test' });

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	globalSetup: './tests/integration/global.setup',
	projects: [
		{
			name: 'MetaMask',
			metadata: {
				wallet: 'metamask',
				version: MetaMaskWallet.recommendedVersion,
				seed: 'pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog',
				password: 'password1234!@#$'
			}
		}
	],
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
