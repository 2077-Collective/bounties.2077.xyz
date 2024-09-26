import { and, desc, eq, inArray } from 'drizzle-orm';
import { db, type Transaction } from '.';
import { bounties, bountySkills } from '../../types/schema';
import { batchCreateRewards } from './rewards';
import type { EnhancedBounty, InsertBounty } from '$lib/types';
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

export async function getBountyById(id: number): Promise<EnhancedBounty | undefined> {
	return db.query.bounties.findFirst({
		where: eq(bounties.id, id),
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

export async function getBountiesBySponsorId(sponsorId: number): Promise<EnhancedBounty[]> {
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

export async function updateBountyById(
	id: number,
	bounty: InsertBounty,
	skills: number[],
	tx?: Transaction
) {
	return withTransaction(async (tx) => {
		const oldBounty = await tx.query.bounties.findFirst({
			with: {
				bountySkills: true
			},
			where: eq(bounties.id, id)
		});

		if (!oldBounty) throw new Error(`Bounty with id ${id} not found`);

		// Disallow editing bounties older than 24 hours
		if (Date.now() - oldBounty.createdAt.getTime() > 24 * 60 * 60 * 1000) {
			throw new Error('Bounty is too old to edit');
		}

		const oldBountySkillIds = oldBounty?.bountySkills.map((bountySkills) => bountySkills.skillId);
		const skillsToRemove = oldBountySkillIds.filter((skillId) => !skills.includes(skillId));
		const skillsToAdd = skills.filter((skillId) => !oldBountySkillIds.includes(skillId));

		await Promise.all([
			tx.update(bounties).set(bounty).where(eq(bounties.id, id)),
			batchCreateBountySkills(id, skillsToAdd, tx),
			batchDeleteBountySkills(id, skillsToRemove, tx)
		]);
	}, tx);
}

async function batchCreateBountySkills(bountyId: number, skillIds: number[], tx?: Transaction) {
	if (skillIds.length === 0) {
		return;
	}

	return withTransaction(async (tx) => {
		return tx
			.insert(bountySkills)
			.values(skillIds.map((skillId) => ({ bountyId, skillId })))
			.returning();
	}, tx);
}

async function batchDeleteBountySkills(bountyId: number, skillIds: number[], tx?: Transaction) {
	if (skillIds.length === 0) {
		return;
	}

	return withTransaction(async (tx) => {
		return tx
			.delete(bountySkills)
			.where(and(eq(bountySkills.bountyId, bountyId), inArray(bountySkills.skillId, skillIds)))
			.returning();
	}, tx);
}
