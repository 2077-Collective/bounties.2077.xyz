import { createNewBounty } from '$lib/server/database/bounties';
import { batchCreateRewards } from '$lib/server/database/rewards';
import { InsertBountySchema } from '$lib/server/schema';
import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

const NewBountySchema = InsertBountySchema.extend({
	rewards: z.bigint().array()
});

// TODO: must include authentication
export const actions: Actions = {
	async createBounty({ request }) {
		try {
			const formData = Object.fromEntries(await request.formData());
			const bountyForm = NewBountySchema.parse(formData);
			const { rewards, ...bounty } = bountyForm;

			const bountyId = await createNewBounty(bounty);
			await batchCreateRewards(bountyId, rewards);

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
