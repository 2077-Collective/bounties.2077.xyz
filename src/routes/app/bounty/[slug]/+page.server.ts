import { getBountyById } from '$lib/server/database/bounties';
import { createNewComment, getCommentsByBountyId } from '$lib/server/database/comments';
import {
	createNewSubmission,
	getSubmissionById,
	getSubmissionByUserIdAndBountyId
} from '$lib/server/database/submissions';
import { batchUploadAnyFile } from '$lib/server/services/upload-files';
import { InsetCommentSchema } from '$lib/types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const bountyId = params.slug;
	if (!bountyId) return error(400, { message: 'No bounty ID provided' });

	const parsedBountyId = parseInt(bountyId);
	if (isNaN(parsedBountyId)) return error(400, { message: 'Invalid bounty ID' });

	const userId = locals.account?.users.id;

	const [bounty, userSubmission] = await Promise.all([
		getBountyById(parseInt(bountyId)),
		userId ? getSubmissionByUserIdAndBountyId(userId, parseInt(bountyId)) : undefined
	]);

	if (!bounty || bounty.draft) return error(404, { message: 'Bounty not found' });

	return {
		bounty,
		userSubmission
	};
};

const SubmitEntrySchema = z.object({
	details: z.string(),
	bountyId: z.number(),
	userId: z.number(),
	recipientWallet: z.string(),
	links: z.array(z.string())
});

export const actions: Actions = {
	async comment({ request, params, locals }) {
		const userId = locals.account?.users.id;
		if (!userId) throw redirect(307, '/login');

		const bountyId = params.slug;
		if (!bountyId) return fail(400, { message: 'No bounty ID provided' });

		const parsedBountyId = parseInt(bountyId);
		if (isNaN(parsedBountyId)) return fail(400, { message: 'Invalid bounty ID' });

		const formData = Object.fromEntries(await request.formData());
		const comment = InsetCommentSchema.parse({ ...formData, userId, bountyId: parsedBountyId });

		await createNewComment(comment);

		const comments = await getCommentsByBountyId(parsedBountyId);

		return {
			success: true,
			comments
		};
	},
	async submitEntry({ request, params, locals }) {
		const userId = locals.account?.users.id;
		if (!userId) throw redirect(307, '/login');

		const bountyId = parseInt(params.slug || '');
		if (isNaN(bountyId)) throw redirect(307, '/404');

		const formData = await request.formData();
		// This is not being included in the SubmitEntrySchema because zod is uncapable of parsing an array of File
		// It throws false positives saying the file is not a File object
		const files = formData.getAll('files[]') as File[];
		const data = {
			details: formData.get('details'),
			bountyId,
			userId,
			recipientWallet: formData.get('recipientWallet'),
			links: formData.getAll('links[]')
		};

		const parsedData = SubmitEntrySchema.parse(data);
		const fileLinks = await batchUploadAnyFile(files);

		const newSubmisison = await createNewSubmission(
			{
				details: parsedData.details,
				recipientWallet: parsedData.recipientWallet,
				bountyId: parsedData.bountyId,
				userId: parsedData.userId
			},
			fileLinks,
			parsedData.links
		);

		return {
			success: true,
			submission: await getSubmissionById(newSubmisison.id)
		};
	}
};
