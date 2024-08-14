import { UpdateSponsorSchema } from '$lib/server/schema';
import type { Actions } from './$types';
import { updateSponsorById } from '$lib/server/database/sponsors';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	// TODO: must include authentication
	async updateSponsor({ request, params }) {
		const formData = Object.fromEntries(await request.formData());
		const sponsorId = params.slug;
		const sponsor = UpdateSponsorSchema.parse(formData);

		if (!sponsorId) return fail(400, { message: 'No sponsor ID provided' });

		await updateSponsorById(parseInt(sponsorId), sponsor);

		return {
			success: true
		};
	}
};
