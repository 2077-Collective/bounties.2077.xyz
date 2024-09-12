import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { db, type Transaction } from '../../src/lib/server/database';
import { enterWaitlist, getWaitlistRank } from '$lib/server/database/waitlist';
import { eq } from 'drizzle-orm';
import { waitlist } from '$lib/types/schema';

// TODO: this is being skipped because drizzle-orm currently has a bug that prevents
// calling tx.rollback() in any situation.
// For more details see: https://github.com/drizzle-team/drizzle-orm/issues/1723
describe('Add new user to waitlist', () => {
	let tx: Transaction;

	const testEmail0 = 'test0@2077.xyz';
	const testEmail1 = 'test1@2077.xyz';
	const testEmail2 = 'test2@2077.xyz';
	const testEmail3 = 'test3@2077.xyz';
	const testEmail4 = 'test4@2077.xyz';
	const testEmail5 = 'test5@2077.xyz';
	const testEmail6 = 'test6@2077.xyz';

	beforeEach(async () => {
		db.transaction(async (dbTx) => {
			tx = dbTx;
		});
	});

	afterEach(() => {
		tx.rollback();
	});

	test('add a new user to the waitlist', async () => {
		const referralCode = null;

		await enterWaitlist(testEmail0, referralCode, tx);

		const list = await tx.query.waitlist.findMany({
			where: eq(waitlist.email, testEmail0)
		});
		const first = list[0];

		expect(list).toHaveLength(1);
		expect(first.email).toBe(testEmail0);
		expect(first.inviteSentAt).toBeNull();
		expect(first.inviteUsed).toBeFalsy();
		expect(first.referralCode).toBeTypeOf('string');
	});

	test('add a new user with referredBy filled', async () => {
		const { referralCode, id: referrarId } = await enterWaitlist(testEmail0, null, tx);

		await enterWaitlist(testEmail0, referralCode, tx);

		const list = await tx.query.waitlist.findMany({
			where: eq(waitlist.email, testEmail0)
		});
		const first = list[0];

		expect(list).toHaveLength(1);
		expect(first.email).toBe(testEmail0);
		expect(first.inviteSentAt).toBeNull();
		expect(first.inviteUsed).toBeFalsy();
		expect(first.referralCode).toBeTypeOf('string');
		expect(first.referredBy).toBe(referrarId);
	});

	test('return the waitlist ranked by most order of insertion and referral count', async () => {
		const { referralCode: test0ReferralCode } = await enterWaitlist(testEmail0, null, tx);
		const { referralCode: test1ReferralCode } = await enterWaitlist(testEmail1, null, tx);

		await enterWaitlist(testEmail2, test0ReferralCode, tx);
		await enterWaitlist(testEmail3, test0ReferralCode, tx);
		await enterWaitlist(testEmail4, test0ReferralCode, tx);

		await enterWaitlist(testEmail5, test1ReferralCode, tx);
		await enterWaitlist(testEmail6, test1ReferralCode, tx);

		const rank = await getWaitlistRank(tx);

		expect(rank).toHaveLength(7);
		expect(rank[0].email).toBe(testEmail0);
		expect(rank[1].email).toBe(testEmail1);
		expect(rank[2].email).toBe(testEmail2);
		expect(rank[3].email).toBe(testEmail3);
		expect(rank[4].email).toBe(testEmail4);
		expect(rank[5].email).toBe(testEmail5);
		expect(rank[6].email).toBe(testEmail6);
	});

	test('should throw an error if the email is already in the waitlist', async () => {
		await enterWaitlist(testEmail0, null, tx);
		await expect(enterWaitlist(testEmail0, null, tx)).rejects.toThrowError(
			'duplicate key value violates unique constraint "waitlist_email_unique"'
		);
	});
});
