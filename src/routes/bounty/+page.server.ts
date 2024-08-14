import { createNewBounty } from '$lib/server/database/bounties';
import { InsertBountySchema } from '$lib/server/schema';
import { fail, type Actions } from '@sveltejs/kit';

// TODO: must include authentication
export const actions: Actions = {
	async createBounty({ request }) {
		try {
			const formData = Object.fromEntries(await request.formData());
			const bounty = InsertBountySchema.parse(formData);
			await createNewBounty(bounty);

			return {
				success: true
			};
		} catch (error) {
			console.error(error);

			fail(400, {
				error: 'Failed to create bounty'
			});
		}
	}
};
