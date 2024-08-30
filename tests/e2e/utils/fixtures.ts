import { postgresDb } from '$lib/server/database';
import { users } from '$lib/server/schema';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import postgres from 'postgres';

export async function setupDb(fixtures: (() => Promise<void>)[] = []) {
	const connectionUrl = process.env.DATABASE_CONNECTION_URL || '';

	const migrationClient = postgres(connectionUrl, { max: 1 });
	await migrate(drizzle(migrationClient), {
		migrationsFolder: path.join(process.cwd(), 'drizzle')
	});

	await postgresDb().execute(sql`TRUNCATE TABLE users CASCADE`);

	for (const fixture of fixtures) {
		await fixture();
	}
}

export async function createUserFixture(): Promise<void> {
	const db = postgresDb();

	await db.insert(users).values({
		id: 0,
		email: 'test@2077.xyz',
		displayName: '2077 Collective',
		walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
		twitter: '2077Collective',
		website: '2077.xyz',
		bio: 'Unoficial marketing department of Ethereum.'
	});
}
