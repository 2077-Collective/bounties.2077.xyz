import {
	sponsors,
	type SelectSponsor,
	UpdateSponsorSchema,
	type InsertSponsor
} from '$lib/server/schema';
import { asc, eq } from 'drizzle-orm';
import { db } from '.';
import { z } from 'zod';

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
