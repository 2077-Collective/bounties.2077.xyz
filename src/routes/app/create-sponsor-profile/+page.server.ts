import { createNewSponsor } from '$lib/server/database/sponsors';
import { InsertSponsorSchema } from '$lib/server/schema';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getUserById } from '$lib/server/database/users';

export const actions: Actions = {
	async createSponsor({ request, locals }) {
		const account = locals.account;

		if (!account) throw error(401, { message: 'Unauthorized' });

		const formData = Object.fromEntries(await request.formData());
		const sponsor = InsertSponsorSchema.parse(formData);
		await createNewSponsor({ ...sponsor, userId: account.users.id });

		// Must update locals
		locals.account = await getUserById(account.users.id);

		throw redirect(307, '/app/sponsor');
	}
};
