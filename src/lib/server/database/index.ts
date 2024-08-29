import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
// import { DATABASE_CONNECTION_URL, NODE_ENV } from '$env/static/private';
import postgres from 'postgres';
import path from 'path';
import 'dotenv/config';

const t1 = true;

const connectionUrl = process.env.DATABASE_CONNECTION_URL || '';

export const postgresDb = () => {
	const queryClient = postgres(connectionUrl);
	return drizzlePg(queryClient);
};

// Uses postgres-js in development and neon in production
export const db = (() => {
	// if (NODE_ENV === 'development' || NODE_ENV === 'test') {
	if (t1) {
		return postgresDb();
	}

	return drizzleNeon(neon(connectionUrl));
})();
