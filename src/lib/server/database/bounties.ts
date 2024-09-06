import { desc, eq } from 'drizzle-orm';
import { db } from '.';
import { bounties, bountySkills, type InsertBounty, type UpdateBounty } from '../schema';
import { batchCreateRewards } from './rewards';

// TODO: use transaction
export async function createNewBounty(
	bounty: InsertBounty,
	rewards: bigint[],
	skills: number[],
	tokenId: number
) {
	const [newBounty] = await db.insert(bounties).values(bounty).returning();

	await Promise.all([
		batchCreateBountySkills(newBounty.id, skills),
		batchCreateRewards(newBounty.id, tokenId, rewards)
	]);

	return newBounty;
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
	return db.select().from(bounties).where(eq(bounties.sponsorId, sponsorId)).execute();
}

export async function updateBountyById(id: number, bounty: UpdateBounty) {
	return db.update(bounties).set(bounty).where(eq(bounties.id, id));
}

async function batchCreateBountySkills(bountyId: number, skillIds: number[]) {
	return db
		.insert(bountySkills)
		.values(skillIds.map((skillId) => ({ bountyId, skillId })))
		.returning();
}
