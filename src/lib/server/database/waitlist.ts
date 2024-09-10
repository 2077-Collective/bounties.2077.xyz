import { waitlist } from '$lib/types/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { type Transaction } from '.';
import { withTransaction } from './utils';
import { v4 as uuidv4 } from 'uuid';

// Create a new entry in the waitilist. If a referralUuid is provided, the new entry will be linked to the referral.
// If the referralUuid is invalid, an error will be thrown.
// If the referralUuid is not provided, the new entry will not be linked to a referral.
//
// @ param email - the email of the user to add to the waitlist
// @ param referralUuid - the referralUuid of the user who referred the new user
// @ param tx{Optional} - the transaction to use for this operation
// @ returns the new waitlist entry
export async function enterWaitlist(email: string, referralCode: string | null, tx?: Transaction) {
	return withTransaction(async (tx) => {
		return tx.insert(waitlist).values({
			email,
			referralCode: uuidv4(),
			referredBy: referralCode ? await getWaitlistIfByReferralCode(referralCode, tx) : undefined
		});
	}, tx);
}

export async function getWaitlistRank(tx?: Transaction) {
	return withTransaction(async (tx) => {
		const query = tx
			.select({
				email: waitlist.email,
				referredBy: waitlist.referredBy,
				occurrenceCount: sql<number>`count(*)`.as('occurrence_count'),
				latestCreatedAt: sql<Date>`max(${waitlist.createdAt})`.as('latest_created_at')
			})
			.from(waitlist)
			.groupBy(waitlist.referredBy)
			.orderBy(desc(sql`occurrence_count`), desc(sql`latest_created_at`));

		return query.execute();
	}, tx);
}

export async function getPositionInWaitlist(email: string, tx?: Transaction) {
	return withTransaction(async (tx) => {
		const query = tx
			.select({
				rank: sql<number>`rank()`.as('rank')
			})
			.from(
				sql`(
                    select email, row_number() over (order by created_at) as rank
                    from waitlist
                ) as waitlist`
			)
			.where(eq(waitlist.email, email));

		return query.execute();
	}, tx);
}

async function getWaitlistIfByReferralCode(
	referredBy: string,
	tx?: Transaction
): Promise<number | undefined> {
	return withTransaction(async (tx) => {
		const queryRes = await tx.query.waitlist.findFirst({
			columns: {
				id: true
			},
			where: eq(waitlist.referralCode, referredBy)
		});

		if (!queryRes) {
			throw new Error('Invalid referral');
		}

		return queryRes.id;
	}, tx);
}
