import { createNewSponsor } from '$lib/server/database/sponsors';
import { InsertSponsorSchema } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getUserById } from '$lib/server/database/users';

// TODO: validate whether the user paste a full twitter url or just the username
export const actions: Actions = {
	async createSponsor({ request, locals }) {
		const account = locals.account;

		if (!account) throw error(401, { message: 'Unauthorized' });

		const formData = Object.fromEntries(await request.formData());
		const sponsor = InsertSponsorSchema.parse({ ...formData, userId: account.users.id });
		await createNewSponsor(sponsor);

		locals.account = await getUserById(account.users.id);

		throw redirect(303, '/app/sponsor');
	}
};
