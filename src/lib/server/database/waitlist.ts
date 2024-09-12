import { waitlist } from '$lib/types/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { type Transaction } from '.';
import { withTransaction } from './utils';
import { v4 as uuidv4 } from 'uuid';
import { alias } from 'drizzle-orm/pg-core';

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
		const [newEntry] = await tx
			.insert(waitlist)
			.values({
				email,
				referralCode: uuidv4(),
				referredBy: referralCode ? await getReferrerByReferralCode(referralCode, tx) : undefined
			})
			.returning();

		return newEntry;
	}, tx);
}

export async function getWaitlistRank(tx?: Transaction) {
	const referredWaitList = alias(waitlist, 'referredWaitList');

	return withTransaction(async (tx) => {
		const query = tx
			.select({
				id: waitlist.id,
				email: waitlist.email,
				count: sql`COALESCE(count(${referredWaitList.id}), 0)`.as('count'),
				inclusionDate: waitlist.createdAt
			})
			.from(waitlist)
			.leftJoin(referredWaitList, eq(waitlist.id, referredWaitList.referredBy))
			.groupBy(waitlist.id, waitlist.email, waitlist.createdAt)
			.orderBy(desc(sql`count`), waitlist.createdAt);

		return query.execute();
	}, tx);
}

export async function getPositionInWaitlist(email: string, tx?: Transaction) {
	return withTransaction(async (tx) => {
		const rank = await getWaitlistRank(tx);

		const position = rank.findIndex((entry) => entry.email === email);

		if (position === -1) {
			throw new Error('Email not found in waitlist');
		}

		return position + 1;
	}, tx);
}

async function getReferrerByReferralCode(
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
			return undefined;
		}

		return queryRes.id;
	}, tx);
}

export async function getReferrerByEmail(email: string, tx?: Transaction) {
	return withTransaction(async (tx) => {
		const queryRes = await tx.query.waitlist.findFirst({
			where: eq(waitlist.email, email)
		});

		if (!queryRes) return undefined;

		return queryRes;
	}, tx);
}
