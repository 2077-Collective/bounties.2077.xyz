import { desc, eq } from 'drizzle-orm';
import { db } from '.';
import { bounties, type InsertBounty, type UpdateBounty } from '../schema';

export async function createNewBounty(bounty: InsertBounty) {
	return db.insert(bounties).values(bounty).returning();
}

export async function getBounties() {
	return db.select().from(bounties).orderBy(desc(bounties.createdAt));
}

export async function getBountyById(id: number) {
	const bounty = await db.select().from(bounties).where(eq(bounties.id, id)).limit(1).execute();

	if (bounty.length === 0) return null;

	return bounty[0];
}

export async function updateBountyById(id: number, bounty: UpdateBounty) {
	return db.update(bounties).set(bounty).where(eq(bounties.id, id));
}
