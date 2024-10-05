import { and, eq } from 'drizzle-orm';
import { db, type Transaction } from '.';
import { submissionLinks, submissions } from '$lib/types/schema';
import type { EnhancedSubmission, InsertSubmission, UpdateSubmission } from '$lib/types';
import { withTransaction } from './utils';

// TODO: shouldn't allow new submissions if bounty is closed
export function createNewSubmission(
	submission: InsertSubmission,
	fileLinks: string[],
	links: string[],
	tx?: Transaction
) {
	return withTransaction(async (tx) => {
		const [newSubmission] = await tx.insert(submissions).values([submission]).returning();
		await batchCreateSubmissionLinks(newSubmission.id, fileLinks, links, tx);
		return newSubmission;
	}, tx);
}

export async function batchCreateSubmissionLinks(
	submissionId: number,
	filesLinks: string[],
	links: string[],
	tx?: Transaction
) {
	return withTransaction(
		async (tx) =>
			tx
				.insert(submissionLinks)
				.values([
					...filesLinks.map((link) => ({ link, submissionId, isFile: true })),
					...links.map((link) => ({ link, submissionId, isFile: false }))
				])
				.returning(),
		tx
	);
}

export async function getSubmissionsFromBountyId(bountyId: number) {
	return db.select().from(submissions).where(eq(submissions.bountyId, bountyId)).execute();
}

export async function getSubmissionByUserIdAndBountyId(
	userId: number,
	bountyId: number,
	tx?: Transaction
): Promise<EnhancedSubmission | undefined> {
	return withTransaction(
		async (tx) =>
			tx.query.submissions.findFirst({
				where: and(eq(submissions.userId, userId), eq(submissions.bountyId, bountyId)),
				with: {
					submissionLinks: true
				}
			}),
		tx
	);
}

export async function getSubmissionById(
	id: number,
	tx?: Transaction
): Promise<EnhancedSubmission | undefined> {
	return withTransaction(
		async (tx) =>
			tx.query.submissions.findFirst({
				where: eq(submissions.id, id),
				with: {
					submissionLinks: true
				}
			}),
		tx
	);
}

export async function getSubmissionsByUserId(userId: number) {
	return db.select().from(submissions).where(eq(submissions.userId, userId)).execute();
}

export async function updateSubmissionById(id: number, submission: UpdateSubmission) {
	return db.update(submissions).set(submission).where(eq(submissions.id, id));
}
