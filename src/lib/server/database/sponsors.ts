import { type SelectSponsor, UpdateSponsorSchema, type InsertSponsor } from '$lib/types';
import { and, asc, desc, eq, isNotNull, sql, sum } from 'drizzle-orm';
import { db } from '.';
import { z } from 'zod';
import { bounties, rewards, sponsors, submissions, users } from '$lib/types/schema';

export function createNewSponsor(sponsor: InsertSponsor) {
	return db.insert(sponsors).values(sponsor).returning();
}

export function getSponsors() {
	return db.select().from(sponsors).orderBy(asc(sponsors.displayName));
}

export async function getSponsorById(id: number): Promise<SelectSponsor | null> {
	const sponsor: SelectSponsor[] = await db
		.select()
		.from(sponsors)
		.where(eq(sponsors.id, id))
		.limit(1)
		.execute();

	if (sponsor.length === 0) return null;

	return sponsor[0];
}

export async function updateSponsorById(id: number, sponsor: z.infer<typeof UpdateSponsorSchema>) {
	const updatedSponsor = await db
		.update(sponsors)
		.set(sponsor)
		.where(eq(sponsors.id, id))
		.returning();

	if (updatedSponsor.length === 0) return null;

	return updatedSponsor[0];
}

export async function getSponsorPublicProfile(id: number) {
	const sponsorPromise = db.query.sponsors.findFirst({
		with: {
			bounties: {
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
		},
		where: eq(sponsors.id, id)
	});

	const [sponsor, totalAmountAwarded, topContributor] = await Promise.all([
		sponsorPromise,
		getTotalAmountAwarded(id),
		getTopContributor(id)
	]);

	if (!sponsor) return null;

	return {
		...sponsor,
		totalAmountAwarded,
		topContributor
	};
}

async function getTotalAmountAwarded(id: number) {
	const [{ totalAwarded }] = await db
		.select({
			totalAwarded: sum(rewards.amount)
		})
		.from(rewards)
		.innerJoin(bounties, eq(bounties.id, rewards.bountyId))
		.where(and(eq(bounties.sponsorId, id), isNotNull(rewards.winner)))
		.limit(1)
		.execute();

	return totalAwarded;
}

async function getTopContributor(sponsorId: number) {
	const result = await db
		.select({
			userId: submissions.userId,
			displayName: users.displayName,
			totalAmountAwarded: sql<number>`SUM(${rewards.amount})`
		})
		.from(rewards)
		.innerJoin(bounties, eq(bounties.id, rewards.bountyId))
		.innerJoin(submissions, eq(submissions.id, rewards.winner))
		.innerJoin(users, eq(users.id, submissions.userId))
		.where(eq(bounties.sponsorId, sponsorId))
		.groupBy(submissions.userId, users.displayName)
		.orderBy(desc(sql<number>`SUM(${rewards.amount})`))
		.limit(1);

	if (!result.length) return null;

	return result[0];
}
