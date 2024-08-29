import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const getRedirectPath = (jwt: string | undefined): '/login' | '/create-account' => {
	return jwt ? '/create-account' : '/login';
};

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (!locals.account) {
		redirect(307, getRedirectPath(cookies.get('jwt')));
	}
};
