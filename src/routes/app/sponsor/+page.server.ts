import { UpdateSponsorSchema } from '$lib/server/schema';
import type { Actions } from './$types';
import { updateSponsorById } from '$lib/server/database/sponsors';
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getBountiesBySponsorId } from '$lib/server/database/bounties';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.account?.sponsors) {
		throw redirect(307, '/app/create-sponsor-profile');
	}

	return {
		sponsor: locals.account.sponsors,
		bounties: await getBountiesBySponsorId(locals.account.sponsors.id)
	};
};

export const actions: Actions = {
	// TODO: must include authentication
	async updateSponsor({ request, locals }) {
		if (!locals.account) {
			throw error(401, 'Unauthorized');
		}

		const sponsorId = locals.account.sponsors?.id;
		if (!sponsorId) {
			throw error(401, 'Unauthorized');
		}

		const formData = Object.fromEntries(await request.formData());
		const sponsor = UpdateSponsorSchema.parse(formData);

		locals.account.sponsors = await updateSponsorById(sponsorId, sponsor);
	}
};
