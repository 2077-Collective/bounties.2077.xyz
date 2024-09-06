import { postgresDb } from '$lib/server/database';
import { users, sponsors } from '$lib/server/schema';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import postgres from 'postgres';

const db = postgresDb();

export async function setupDb(fixtures: (() => Promise<void>)[] = []) {
	const connectionUrl = process.env.DATABASE_CONNECTION_URL || '';

	const migrationClient = postgres(connectionUrl, { max: 1, onnotice: () => {} });
	await migrate(drizzle(migrationClient), {
		migrationsFolder: path.join(process.cwd(), 'drizzle')
	});

	await db.execute(sql`TRUNCATE TABLE users CASCADE`);
	await db.execute(sql`TRUNCATE TABLE sponsors CASCADE`);

	for (const fixture of fixtures) {
		await fixture();
	}
}

export async function createUserFixture(): Promise<void> {
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

export async function createSponsorFixture(): Promise<void> {
	await db.insert(sponsors).values({
		id: 0,
		displayName: '2077 Collective',
		website: '2077.xyz',
		twitter: '2077Collective',
		userId: 0,
		email: 'test@2077.xyz',
		image: 'https://2077.xyz/logo.png',
		bio: 'Unoficial marketing department of Ethereum.'
	});
}

export async function clearSponsorsTable(): Promise<void> {
	await db.execute(sql`TRUNCATE TABLE sponsors CASCADE`);
}
