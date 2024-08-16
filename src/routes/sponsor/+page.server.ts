import { createNewSponsor } from '$lib/server/database/sponsors';
import { InsertSponsorSchema } from '$lib/server/schema';
import type { Actions } from './$types';

export const actions: Actions = {
	// TODO: must include authentication
	async createSponsor({ request }) {
		const formData = Object.fromEntries(await request.formData());
		const sponsor = InsertSponsorSchema.parse(formData);
		await createNewSponsor(sponsor);

		return {
			success: true
		};
	}
};
