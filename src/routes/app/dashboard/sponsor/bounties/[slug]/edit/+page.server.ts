import { getBountyById, updateBountyById } from '$lib/server/database/bounties';
import { UpdateBountySchema } from '$lib/types';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSkills } from '$lib/server/database/skills';
import { getTokens } from '$lib/server/database/tokens';
import { getChains } from '$lib/server/database/chains';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;
	const bountyId = parseInt(slug);

	if (isNaN(bountyId)) return error(400, { message: 'No bounty ID provided' });

	const [bounty, skills, tokens, chains] = await Promise.all([
		getBountyById(bountyId),
		getSkills(),
		getTokens(),
		getChains()
	]);

	return {
		bounty,
		skills,
		tokens,
		chains
	};
};

export const actions: Actions = {
	async upadateBounty({ request, params, locals }) {
		const sponsorId = locals.account?.sponsors?.id;
		if (sponsorId === undefined) throw error(401, { message: 'Unauthorized' });

		const bountyId = params.slug;
		if (!bountyId) throw error(400, { message: 'No bounty ID provided' });

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);
		const skills = formData.getAll('skills[]').map(String);

		const bountyForm = UpdateBountySchema.parse({
			...rawData,
			draft: rawData.draft === 'true',
			sponsorId,
			skills
		});

		const { skills: parsedSkills, ...bounty } = bountyForm;

		await updateBountyById(parseInt(bountyId), bounty, parsedSkills);

		return {
			success: true
		};
	}
};
