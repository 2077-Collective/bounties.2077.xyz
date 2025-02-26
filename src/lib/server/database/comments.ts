import { eq } from 'drizzle-orm';
import { db } from '.';
import { comments } from '$lib/types/schema';
import { type InsertComment } from '$lib/types';

export async function createNewComment(comment: InsertComment) {
	return db.insert(comments).values(comment).returning();
}

export async function getCommentsByBountyId(bountyId: number) {
	return db.select().from(comments).where(eq(comments.bountyId, bountyId)).execute();
}
