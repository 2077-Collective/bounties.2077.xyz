import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
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
	const databaseConnectionUrl = process.env.DATABASE_CONNECTION_URL || '';
	const nodeEnv = process.env.NODE_ENV || 'development';

	return nodeEnv === 'development' || nodeEnv === 'test'
		? postgresDb(databaseConnectionUrl)
		: drizzleNeon<typeof schema>(neon(databaseConnectionUrl), { schema });
})();

// Type for the transaction object, each database has a different generic type.
// If you know a better way to do this, please let make a PR.
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbOrTransaction = typeof db | Transaction;
