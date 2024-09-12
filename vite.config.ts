import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

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
