import { eq } from 'drizzle-orm';
import { db, type Transaction } from '.';
import { rewards } from '$lib/types/schema';
import { withTransaction } from './utils';

export function batchCreateRewards(
	bountyId: number,
	tokenId: number,
	rewardAmounts: bigint[],
	tx?: Transaction
) {
	return withTransaction(async (tx) => {
		return tx
			.insert(rewards)
			.values(
				rewardAmounts.map((amount, index) => ({ amount, bountyId, tokenId, rank: index + 1 }))
			)
			.returning();
	}, tx);
}

export async function getRewardsByBountyId(bountyId: number) {
	return db.select().from(rewards).where(eq(rewards.bountyId, bountyId)).execute();
}
