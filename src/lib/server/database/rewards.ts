import { eq } from 'drizzle-orm';
import { db } from '.';
import { rewards } from '../schema';

export function batchCreateRewards(bountyId: number, rewardAmounts: bigint[]) {
	return db
		.insert(rewards)
		.values(rewardAmounts.map((amount, index) => ({ amount, bountyId, rank: index + 1 })))
		.returning();
}

export async function getRewardsByBountyId(bountyId: number) {
	return db.select().from(rewards).where(eq(rewards.bountyId, bountyId)).execute();
}
