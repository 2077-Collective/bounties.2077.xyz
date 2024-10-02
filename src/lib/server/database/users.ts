import { eq, inArray } from 'drizzle-orm';
import { db, type Transaction } from '.';
import { rewards, sponsors, submissions, users, userSkills } from '$lib/types/schema';
import type { Account, EnhancedUserPublicData } from '$lib/types';
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

export async function getUserPublicDataById(
	id: number,
	tx?: Transaction
): Promise<EnhancedUserPublicData | undefined> {
	return withTransaction(async (tx) => {
		const userData = tx.query.users.findFirst({
			where: eq(users.id, id),
			columns: {
				walletAddress: false,
				createdAt: false,
				updatedAt: false
			},
			with: {
				userSkills: {
					with: {
						skill: true
					}
				},
				bookmarks: {
					with: {
						bounty: {
							with: {
								sponsor: true,
								bountySkills: {
									with: {
										skill: true
									}
								},
								rewards: {
									with: {
										token: true
									}
								}
							}
						}
					}
				},
				submissions: true
			}
		});

		const [user, winningSubmissions, rewards] = await Promise.all([
			userData,
			getUserWinningSubmissions(id),
			getRewardsByUserId(id)
		]);

		if (!user) return undefined;

		return {
			...user,
			winningSubmissionsCount: winningSubmissions.length,
			amountRewarded: rewards.reduce((acc, reward) => acc + reward.amount, 0n)
		};
	}, tx);
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

async function getUserWinningSubmissions(id: number) {
	return db.query.submissions.findMany({
		where: eq(submissions.userId, id)
	});
}

async function getRewardsByUserId(id: number) {
	return db.query.rewards.findMany({
		where: eq(rewards.winner, id)
	});
}
