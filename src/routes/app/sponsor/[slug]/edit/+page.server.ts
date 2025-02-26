import { UpdateSponsorSchema } from '$lib/types';
import type { Actions } from './$types';
import { updateSponsorById } from '$lib/server/database/sponsors';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	// TODO: must include authentication
	async updateSponsor({ request, params }) {
		const sponsorId = params.slug;

		if (!sponsorId) return fail(400, { message: 'No sponsor ID provided' });

		const formData = Object.fromEntries(await request.formData());
		const sponsor = UpdateSponsorSchema.parse(formData);

		await updateSponsorById(parseInt(sponsorId), sponsor);

		return {
			success: true
		};
	}
};
