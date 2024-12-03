import { and, eq, inArray } from 'drizzle-orm';
import { db, type Transaction } from '.';
import { rewards, skills, sponsors, submissions, users, userSkills } from '$lib/types/schema';
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

export async function getUserById(
	id: number,
	tx?: Transaction
): Promise<Account['users'] | undefined> {
	return withTransaction(async (tx) => {
		return tx.query.users.findFirst({
			where: eq(users.id, id),
			with: {
				userSkills: {
					with: {
						skill: true
					}
				}
			}
		});
	}, tx);
}

// TODO: refactor this method. It should be more elegant
export async function getAccountByUserId(id: number): Promise<Account | null> {
	const userWithSkills = await db
		.select({
			users: users,
			sponsors: sponsors,
			userSkills: userSkills,
			skills: skills
		})
		.from(users)
		.leftJoin(sponsors, eq(users.id, sponsors.userId))
		.leftJoin(userSkills, eq(users.id, userSkills.userId))
		.leftJoin(skills, eq(userSkills.skillId, skills.id))
		.where(eq(users.id, id))
		.execute();

	if (userWithSkills.length === 0) return null;

	const user: Account = {
		users: {
			...userWithSkills[0].users,
			userSkills: userWithSkills
				.filter((row) => row.skills !== null && row.userSkills !== null)
				.map((row) => ({
					userId: row.userSkills!.userId,
					skillId: row.skills!.id,
					skill: {
						id: row.skills!.id,
						name: row.skills!.name
					}
				}))
		},
		sponsors: userWithSkills[0].sponsors ?? null
	};

	return user;
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

export async function updateUserById(
	id: number,
	user: UpdateUser,
	skills: number[],
	tx?: Transaction
) {
	return withTransaction(async (tx) => {
		const oldUser = await tx.query.users.findFirst({
			with: {
				userSkills: true
			},
			where: eq(users.id, id)
		});

		if (!oldUser) throw new Error(`User with id ${id} not found`);

		const oldBountySkillIds = oldUser?.userSkills.map((userSkills) => userSkills.skillId);
		const skillsToRemove = oldBountySkillIds.filter((skillId) => !skills.includes(skillId));
		const skillsToAdd = skills.filter((skillId) => !oldBountySkillIds.includes(skillId));

		const [newUser] = await Promise.all([
			tx.update(users).set(user).where(eq(users.id, id)).returning(),
			batchCreateUserSkills(id, skillsToAdd, tx),
			batchDeleteUserSkills(id, skillsToRemove, tx)
		]);

		return getUserById(newUser[0].id);
	}, tx);
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

async function batchDeleteUserSkills(bountyId: number, skillIds: number[], tx?: Transaction) {
	if (skillIds.length === 0) {
		return;
	}

	return withTransaction(async (tx) => {
		return tx
			.delete(userSkills)
			.where(and(eq(userSkills.userId, bountyId), inArray(userSkills.skillId, skillIds)))
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
