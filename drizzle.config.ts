import { defineConfig } from 'drizzle-kit';

export default (() => {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined');

	return defineConfig({
		schema: './src/lib/types/schema.ts',
		dialect: 'postgresql',
		dbCredentials: {
			url: process.env.DATABASE_URL
		},
		verbose: true,
		strict: true
	});
})();
