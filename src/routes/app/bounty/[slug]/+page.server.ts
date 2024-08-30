import { getBountyById } from '$lib/server/database/bounties';
import { createNewComment, getCommentsByBountyId } from '$lib/server/database/comments';
import { createNewSubmission } from '$lib/server/database/submissions';
import { InsertSubmissionSchema, InsetCommentSchema } from '$lib/server/schema';
import { error, type Actions, type LoadEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export async function load({ params }: LoadEvent) {
	const bountyId = params.slug;

	if (!bountyId) return error(400, { message: 'No bounty ID provided' });

	const bounty = await getBountyById(parseInt(bountyId));

	if (!bounty) return error(404, { message: 'Bounty not found' });

	const comments = getCommentsByBountyId(parseInt(bountyId));

	return {
		bounty,
		comments
	};
}

export const actions: Actions = {
	// TODO: must include authentication
	// TODO: fetch user from session
	async comment({ request, params }) {
		const bountyId = params.slug;

		if (!bountyId) return fail(400, { message: 'No bounty ID provided' });

		const formData = Object.fromEntries(await request.formData());
		const comment = InsetCommentSchema.parse(formData);

		await createNewComment(comment);

		return {
			success: true
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
