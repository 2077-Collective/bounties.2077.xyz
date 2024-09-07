import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
import * as schema from '$lib/types/schema';

// Note: note using $env because playwright isn't able to access the env variables
const DATABASE_CONNECTION_URL = process.env.DATABASE_CONNECTION_URL || '';
const TEST_DATABASE_CONNECTION_URL = process.env.TEST_DATABASE_CONNECTION_URL || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

export const postgresDb = (connectionUrl: string = DATABASE_CONNECTION_URL) => {
	const queryClient = postgres(connectionUrl, { onnotice: () => {} });
	return drizzlePg<typeof schema>(queryClient, { schema });
};

// Uses postgres-js in development and neon in production
export const db = (() => {
	if (NODE_ENV === 'development') {
		return postgresDb();
	} else if (NODE_ENV === 'test') {
		return postgresDb(TEST_DATABASE_CONNECTION_URL);
	}

	return drizzleNeon<typeof schema>(neon(DATABASE_CONNECTION_URL), { schema });
})();

// Type for the transaction object, each database has a different generic type.
// If you know a better way to do this, please let make a PR.
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbOrTransaction = typeof db | Transaction;
