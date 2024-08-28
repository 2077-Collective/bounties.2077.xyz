import { postgresDb } from '$lib/server/database';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import postgres from 'postgres';

export async function setupDb() {
	const connectionUrl = process.env.DATABASE_CONNECTION_URL || '';

	const migrationClient = postgres(connectionUrl, { max: 1 });
	await migrate(drizzle(migrationClient), {
		migrationsFolder: path.join(process.cwd(), 'drizzle')
	});

	await postgresDb().execute(sql`TRUNCATE TABLE users CASCADE`);
}
