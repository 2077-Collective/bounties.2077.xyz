import { updateBountyById } from '$lib/server/database/bounties';
import { UpdateBountySchema } from '$lib/server/schema';
import { error, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	// TODO: must include authentication
	async upadateBounty({ request, params }) {
		const formData = Object.fromEntries(await request.formData());
		const bountyId = params.slug;
		const bounty = UpdateBountySchema.parse(formData);

		if (!bountyId) return error(400, { message: 'No bounty ID provided' });

		await updateBountyById(parseInt(bountyId), bounty);

		return {
			success: true
		};
	}
};
