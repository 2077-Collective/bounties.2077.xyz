import { getUserPublicDataById } from '$lib/server/database/users';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const userId = parseInt(params.slug);

	if (isNaN(userId)) error(400, { message: 'Invalid user ID' });

	const user = await getUserPublicDataById(userId);

	if (!user) throw redirect(307, '/404');

	return {
		user
	};
};
