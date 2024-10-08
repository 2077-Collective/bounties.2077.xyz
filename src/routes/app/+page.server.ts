import { getBounties } from '$lib/server/database/bounties';
import { getSkills } from '$lib/server/database/skills';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		bounties: await getBounties(),
		skills: await getSkills()
	};
};
