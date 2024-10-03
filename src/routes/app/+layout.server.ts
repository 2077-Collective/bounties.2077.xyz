import { getAccountByUserId } from '$lib/server/database/users';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.account?.users.id) throw redirect(307, '/login');

	return {
		account: await getAccountByUserId(locals.account?.users.id)
	};
};
