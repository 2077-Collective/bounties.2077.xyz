import { getSponsorPublicProfile } from '$lib/server/database/sponsors';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const sponsorId = params.slug;

	if (!sponsorId) return error(400, { message: 'No sponsor ID provided' });

	const sponsor = await getSponsorPublicProfile(parseInt(sponsorId));

	if (!sponsor) return error(404, { message: 'Sponsor not found' });

	return sponsor;
};
