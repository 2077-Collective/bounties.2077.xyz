import { eq } from 'drizzle-orm';
import { db } from '.';
import { tokens } from '$lib/types/schema';
import type { InsertToken } from '$lib/types';

export async function addToken(token: InsertToken) {
	const [newToken] = await db.insert(tokens).values(token).returning();
	return newToken;
}

export async function removeToken(id: number) {
	return db.delete(tokens).where(eq(tokens.id, id)).returning();
}

export async function getTokenById(id: number) {
	const [token] = await db.select().from(tokens).where(eq(tokens.id, id)).limit(1).execute();
	return token;
}

export async function batchCreateTokens(t: InsertToken[]) {
	return db.insert(tokens).values(t).returning();
}

export async function getTokens() {
	return db.select().from(tokens);
}
