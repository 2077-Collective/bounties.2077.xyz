import { eq } from 'drizzle-orm';
import { db } from '.';
import { chains } from '$lib/types/schema';
import type { InsertChain, SelectChain } from '$lib/types';

export async function addChain(chain: InsertChain) {
	const [newChain] = await db.insert(chains).values(chain).returning();
	return newChain;
}

export async function removeChain(id: number) {
	return db.delete(chains).where(eq(chains.id, id)).returning();
}

export async function getChainById(id: number): Promise<SelectChain | null> {
	const chain = await db.select().from(chains).where(eq(chains.id, id)).limit(1).execute();

	if (chain.length === 0) return null;

	return chain[0];
}

export async function getAllChains() {
	return db.select().from(chains).execute();
}

export async function updateChainById(id: number, chain: Partial<InsertChain>) {
	const [updatedChain] = await db.update(chains).set(chain).where(eq(chains.id, id)).returning();

	return updatedChain;
}

export async function batchCreateChains(c: InsertChain[]) {
	return db.insert(chains).values(c).returning();
}

export async function getChains() {
	return db.select().from(chains);
}
