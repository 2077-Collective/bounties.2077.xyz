import { eq } from 'drizzle-orm';
import { db } from '.';
import { submissions, type InsertSubmission, type UpdateSubmission } from '../schema';

export function createNewSubmission(submission: InsertSubmission) {
	return db.insert(submissions).values(submission).returning();
}

export async function getSubmissionsFromBountyId(bountyId: number) {
	return db.select().from(submissions).where(eq(submissions.bountyId, bountyId)).execute();
}

export async function getSubmissionById(id: number) {
	const submission = await db
		.select()
		.from(submissions)
		.where(eq(submissions.id, id))
		.limit(1)
		.execute();

	if (submission.length === 0) return null;

	return submission[0];
}

export async function getSubmissionsByUserId(userId: number) {
	return db.select().from(submissions).where(eq(submissions.userId, userId)).execute();
}

export async function updateSubmissionById(id: number, submission: UpdateSubmission) {
	return db.update(submissions).set(submission).where(eq(submissions.id, id));
}
