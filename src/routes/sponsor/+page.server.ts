import { createNewSponsor } from '$lib/server/database/sponsors';
import { InsertSponsorSchema } from '$lib/server/schema';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	// TODO: must include authentication
	async createSponsor({ request }) {
		try {
			const formData = Object.fromEntries(await request.formData());
			const sponsor = InsertSponsorSchema.parse(formData);
			await createNewSponsor(sponsor);

			return {
				success: true
			};
		} catch (error) {
			console.error(error);

			fail(400, {
				error: 'Failed to create sponsor'
			});
		}
	}
};
