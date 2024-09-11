import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

// import dotenv from 'dotenv';

// // Load environment variables from .env.test
// dotenv.config({ path: '.env.test' });

export default defineConfig(({ mode }) => {
	return {
		plugins: [sveltekit()],
		test: {
			include: ['tests/integration/**/*.spec.ts'],
			setupFiles: ['./tests/integration/integration.setup.ts']
		},
		define: {
			'process.env': loadEnv(mode, process.cwd(), '')
		}
	};
});
