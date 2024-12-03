import { createNewBounty } from '$lib/server/database/bounties';
import { getSkills } from '$lib/server/database/skills';
import { InsertBountySchema } from '$lib/types';
import { fail, type Actions } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { getTokens } from '$lib/server/database/tokens';
import { getChains } from '$lib/server/database/chains';

const NewBountySchema = InsertBountySchema.extend({
	rewards: z.array(z.string()).transform((arr) => arr.map((val) => BigInt(val))),
	skills: z.array(z.string()).transform((arr) => arr.map((val) => parseInt(val, 10))),
	tokenId: z.string().transform((val) => parseInt(val, 10))
});

export const load: PageServerLoad = async () => {
	const [skills, tokens, chains] = await Promise.all([getSkills(), getTokens(), getChains()]);

	return {
		skills,
		tokens,
		chains
	};
};

export const actions: Actions = {
	async createBounty({ request, locals }) {
		try {
			const sponsorId = locals.account?.sponsors?.id;

			if (sponsorId === undefined) {
				throw fail(401, { error: JSON.stringify(locals.account?.sponsors?.id) });
			}

			const formData = await request.formData();
			const rawData = Object.fromEntries(formData);

			// Parse skills and rewards arrays
			const skills = formData.getAll('skills[]').map(String);
			const rewards = formData.getAll('rewards[]').map(String);
			const draft = formData.get('draft') === 'true';

			const bountyForm = NewBountySchema.parse({
				...rawData,
				sponsorId,
				skills,
				rewards,
				draft
			});

			console.log({ bountyForm });

			const { rewards: parsedRewards, skills: parsedSkills, tokenId, ...bounty } = bountyForm;

			await createNewBounty(bounty, parsedRewards, parsedSkills, tokenId);
		} catch (error) {
			console.error(error);

			return fail(400, {
				error: 'Failed to create bounty'
			});
		}
	}
};
