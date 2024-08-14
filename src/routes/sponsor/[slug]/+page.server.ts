import { getSponsorById } from '$lib/server/database/sponsors';
import { error, type LoadEvent } from '@sveltejs/kit';

export async function load({ params }: LoadEvent) {
	const sponsorId = params.slug;

	if (!sponsorId) return error(400, { message: 'No sponsor ID provided' });

	const sponsor = await getSponsorById(parseInt(sponsorId));

	if (!sponsor) return error(404, { message: 'Sponsor not found' });

	return sponsor;
}
