import { desc, eq } from 'drizzle-orm';
import { db, type Transaction } from '.';
import { bounties, bountySkills } from '../../types/schema';
import { batchCreateRewards } from './rewards';
import type { InsertBounty, UpdateBounty } from '$lib/types';
import { withTransaction } from './utils';

// TODO: use transaction
export async function createNewBounty(
	bounty: InsertBounty,
	rewards: bigint[],
	skills: number[],
	tokenId: number,
	tx?: Transaction
) {
	return withTransaction(async (tx) => {
		const [newBounty] = await tx.insert(bounties).values(bounty).returning();

		await Promise.all([
			batchCreateBountySkills(newBounty.id, skills, tx),
			batchCreateRewards(newBounty.id, tokenId, rewards, tx)
		]);

		return newBounty;
	}, tx);
}

export async function getBounties() {
	return db.select().from(bounties).orderBy(desc(bounties.createdAt));
}

export async function getBountyById(id: number) {
	const bounty = await db.select().from(bounties).where(eq(bounties.id, id)).limit(1).execute();

	if (bounty.length === 0) return null;

	return bounty[0];
}

export async function getBountiesBySponsorId(sponsorId: number) {
	return db.query.bounties.findMany({
		where: eq(bounties.sponsorId, sponsorId),
		with: {
			bountySkills: {
				with: {
					skill: true
				}
			},
			comments: true,
			submissions: true,
			rewards: true
		}
	});
}

export async function updateBountyById(id: number, bounty: UpdateBounty) {
	return db.update(bounties).set(bounty).where(eq(bounties.id, id));
}

async function batchCreateBountySkills(bountyId: number, skillIds: number[], tx?: Transaction) {
	return withTransaction(async (tx) => {
		return tx
			.insert(bountySkills)
			.values(skillIds.map((skillId) => ({ bountyId, skillId })))
			.returning();
	}, tx);
}
