import { eq, inArray } from 'drizzle-orm';
import { db, type Transaction } from '.';
import { sponsors, users, userSkills } from '$lib/types/schema';
import type { Account } from '$lib/types';
import type { InsertUser, UpdateUser, SelectUser } from '$lib/types';
import { withTransaction } from './utils';

export async function createNewUser(user: InsertUser, skills: number[]) {
	return withTransaction(async (tx) => {
		const [newUser] = await tx.insert(users).values(user).returning();
		await batchCreateUserSkills(newUser.id, skills, tx);

		return newUser;
	});
}

export async function getUsers(ids: number[]) {
	return db.select().from(users).where(inArray(users.id, ids)).execute();
}

export async function getUserById(id: number) {
	const user: Account[] = await db
		.select()
		.from(users)
		.where(eq(users.id, id))
		.leftJoin(sponsors, eq(users.id, sponsors.userId))
		.limit(1)
		.execute();

	if (user.length === 0) return null;

	return user[0];
}

export async function getUserByAddress(walletAddress: string) {
	const user: Account[] = await db
		.select()
		.from(users)
		.where(eq(users.walletAddress, walletAddress))
		.leftJoin(sponsors, eq(users.id, sponsors.userId))
		.limit(1)
		.execute();

	if (user.length === 0) return null;

	return user[0];
}

export async function getUserIdByWalletAddress(walletAddress: string): Promise<number | null> {
	const user: SelectUser[] = await db
		.select()
		.from(users)
		.where(eq(users.walletAddress, walletAddress))
		.limit(1)
		.execute();

	if (user.length === 0) return null;

	return user[0].id;
}

export async function updateUserById(id: number, user: UpdateUser) {
	return db.update(users).set(user).where(eq(users.id, id));
}

async function batchCreateUserSkills(userId: number, skillIds: number[], tx?: Transaction) {
	if (skillIds.length === 0) {
		return;
	}

	return withTransaction(async (tx) => {
		return tx
			.insert(userSkills)
			.values(skillIds.map((skillId) => ({ userId, skillId })))
			.returning();
	}, tx);
}
