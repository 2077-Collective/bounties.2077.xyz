import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { DATABASE_CONNECTION_URL, NODE_ENV } from '$env/static/private';
import postgres from 'postgres';
import path from 'path';

const t1 = true;

// Uses postgres-js in development and neon in production
export const db = (() => {
	// if (NODE_ENV === 'development' || NODE_ENV === 'test') {
	if (t1) {
		const migrationClient = postgres(DATABASE_CONNECTION_URL, { max: 1 });
		migrate(drizzlePg(migrationClient), { migrationsFolder: path.join(process.cwd(), 'drizzle') });

		const queryClient = postgres(DATABASE_CONNECTION_URL);
		return drizzlePg(queryClient);
	}

	return drizzleNeon(neon(DATABASE_CONNECTION_URL));
})();
