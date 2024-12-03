import { batchCreateSkills } from '../../src/lib/server/database/skills';
import { batchCreateChains } from '../../src/lib/server/database/chains';
import { batchCreateTokens } from '../../src/lib/server/database/tokens';

async function seedSkills() {
	const skills = [
		{ name: 'JavaScript' },
		{ name: 'TypeScript' },
		{ name: 'Web3' },
		{ name: 'Ethers' },
		{ name: 'Alloy' },
		{ name: 'Ethers-rs' },
		{ name: 'L2' },
		{ name: 'L1' },
		{ name: 'Python' },
		{ name: 'Java' },
		{ name: 'C#' },
		{ name: 'C++' },
		{ name: 'PHP' },
		{ name: 'Ruby' },
		{ name: 'Swift' },
		{ name: 'Kotlin' },
		{ name: 'Go' },
		{ name: 'Rust' },
		{ name: 'Scala' },
		{ name: 'Haskell' },
		{ name: 'Erlang' },
		{ name: 'Clojure' },
		{ name: 'Lua' },
		{ name: 'Perl' },
		{ name: 'R' },
		{ name: 'Groovy' },
		{ name: 'Dart' },
		{ name: 'Objective-C' },
		{ name: 'Assembly' },
		{ name: 'SQL' },
		{ name: 'React' },
		{ name: 'Vue' },
		{ name: 'Angular' },
		{ name: 'Svelte' },
		{ name: 'D3' },
		{ name: 'Three.js' },
		{ name: 'Canvas' },
		{ name: 'NextJS' },
		{ name: 'NuxtJS' },
		{ name: 'Sveltekit' }
	];

	await batchCreateSkills(skills);
	console.log('Skills created');
}

async function seedChains() {
	const chains = [
		{ name: 'Ethereum', id: 1 },
		{ name: 'Polygon', id: 137 },
		{ name: 'Optimism', id: 10 },
		{ name: 'Arbitrum', id: 42161 }
	];

	await batchCreateChains(chains);
	console.log('Chains created');
}

async function seedTokens() {
	const tokens = [
		// Ethereum
		{
			name: 'Ether',
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
			logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
			decimals: 18,
			chainId: 1
		},
		{
			name: 'USD Coin',
			symbol: 'USDC',
			address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			logo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
			decimals: 6,
			chainId: 1
		},
		{
			name: 'Tether',
			symbol: 'USDT',
			address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
			logo: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png',
			decimals: 6,
			chainId: 1
		},
		{
			name: 'Dai',
			symbol: 'DAI',
			address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
			logo: 'https://assets.coingecko.com/coins/images/9956/large/dai-multi-collateral-mcd.png',
			decimals: 18,
			chainId: 1
		},

		// Polygon
		{
			name: 'Ether',
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000001010',
			logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
			decimals: 18,
			chainId: 137
		},
		{
			name: 'USD Coin',
			symbol: 'USDC',
			address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
			logo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
			decimals: 6,
			chainId: 137
		},
		{
			name: 'Tether',
			symbol: 'USDT',
			address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
			logo: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png',
			decimals: 6,
			chainId: 137
		},
		{
			name: 'Dai',
			symbol: 'DAI',
			address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
			logo: 'https://assets.coingecko.com/coins/images/9956/large/dai-multi-collateral-mcd.png',
			decimals: 18,
			chainId: 137
		},

		// Optimism
		{
			name: 'Ether',
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
			logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
			decimals: 18,
			chainId: 10
		},
		{
			name: 'USD Coin',
			symbol: 'USDC',
			address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
			logo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
			decimals: 6,
			chainId: 10
		},
		{
			name: 'Tether',
			symbol: 'USDT',
			address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
			logo: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png',
			decimals: 6,
			chainId: 10
		},
		{
			name: 'Dai',
			symbol: 'DAI',
			address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
			logo: 'https://assets.coingecko.com/coins/images/9956/large/dai-multi-collateral-mcd.png',
			decimals: 18,
			chainId: 10
		},

		// Arbitrum
		{
			name: 'Ether',
			symbol: 'ETH',
			address: '0x0000000000000000000000000000000000000000',
			logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
			decimals: 18,
			chainId: 42161
		},
		{
			name: 'USD Coin',
			symbol: 'USDC',
			address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
			logo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
			decimals: 6,
			chainId: 42161
		},
		{
			name: 'Tether',
			symbol: 'USDT',
			address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
			logo: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png',
			decimals: 6,
			chainId: 42161
		},
		{
			name: 'Dai',
			symbol: 'DAI',
			address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
			logo: 'https://assets.coingecko.com/coins/images/9956/large/dai-multi-collateral-mcd.png',
			decimals: 18,
			chainId: 42161
		}
	];

	await batchCreateTokens(tokens);
	console.log('Tokens created');
}

export async function globalSeeder() {
	await seedSkills();
	await seedChains();
	await seedTokens();
}

globalSeeder();
