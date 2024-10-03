import { getBountyById } from '$lib/server/database/bounties';
import { createNewComment, getCommentsByBountyId } from '$lib/server/database/comments';
import { createNewSubmission } from '$lib/server/database/submissions';
import { InsertSubmissionSchema, InsetCommentSchema } from '$lib/types';
import { error, type Actions, type LoadEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export async function load({ params }: LoadEvent) {
	const bountyId = params.slug;
	if (!bountyId) return error(400, { message: 'No bounty ID provided' });

	const parsedBountyId = parseInt(bountyId);
	if (isNaN(parsedBountyId)) return error(400, { message: 'Invalid bounty ID' });

	const bounty = await getBountyById(parseInt(bountyId));
	if (!bounty || bounty.draft) return error(404, { message: 'Bounty not found' });

	return {
		bounty
	};
}

export const actions: Actions = {
	// TODO: must include authentication
	// TODO: fetch user from session
	async comment({ request, params, locals }) {
		const userId = locals.account?.users.id;
		if (!userId) return fail(401, { message: 'Unauthorized' });

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

	// TODO: must include authentication
	// TODO: fetch user from session
	async submitBountyCandidate({ request, params }) {
		const bountyId = params.slug;

		if (!bountyId) return fail(400, { message: 'No bounty ID provided' });

		const formData = Object.fromEntries(await request.formData());
		const candidate = InsertSubmissionSchema.parse(formData);

		await createNewSubmission(candidate);

		return {
			success: true
		};
	}
};
