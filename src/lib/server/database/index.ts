import { Pool } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
import * as schema from '$lib/types/schema';

const postgresDb = (connectionUrl: string) => {
	const queryClient = postgres(connectionUrl);
	return drizzlePg<typeof schema>(queryClient, { schema });
};

// Uses postgres-js in development and neon in production
export const db = (() => {
	// Note: note using $env because playwright isn't able to access the env variables
	const databaseConnectionUrl = process.env.DATABASE_URL || '';
	const nodeEnv = process.env.NODE_ENV || 'development';

	if (nodeEnv === 'development' || nodeEnv === 'test') {
		return postgresDb(databaseConnectionUrl);
	} else {
		const pool = new Pool({ connectionString: databaseConnectionUrl });
		return drizzleNeon<typeof schema>(pool, { schema });
	}
})();

// Type for the transaction object, each database has a different generic type.
// If you know a better way to do this, please let make a PR.
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbOrTransaction = typeof db | Transaction;
