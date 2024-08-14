import { getBountyById } from '$lib/server/database/bounties';
import { error, type LoadEvent } from '@sveltejs/kit';

export async function load({ params }: LoadEvent) {
	const bountyId = params.slug;

	if (!bountyId) return error(400, { message: 'No bounty ID provided' });

	const bounty = await getBountyById(parseInt(bountyId));

	if (!bounty) return error(404, { message: 'Bounty not found' });

	return bounty;
}
