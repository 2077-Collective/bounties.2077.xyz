import { createNewUser } from '$lib/server/database/users';
import { InsertUserSchema } from '$lib/types';
import { JWTSigner } from '@2077collective/persona';
import { error, redirect, type Actions } from '@sveltejs/kit';

const jwtSigner = new JWTSigner('secret');

// TODO: this function needs to be merged with the app hook
async function isAuthenticated(jwt: string | undefined): Promise<boolean> {
	if (!jwt) return false;

	try {
		const payload = await jwtSigner.verify(jwt);
		return !!payload.userId;
	} catch (e) {
		console.error(e);

		return false;
	}
}

export const actions: Actions = {
	async register({ request, cookies }) {
		const jwt = cookies.get('jwt');
		if (!isAuthenticated(jwt)) {
			return error(401, 'Unauthorized');
		}

		const formData = Object.fromEntries(await request.formData());
		const parsedFormData = InsertUserSchema.parse(formData);
		const user = await createNewUser(parsedFormData);

		cookies.set('jwt', await jwtSigner.sign(user.id), {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict'
		});

		throw redirect(303, '/app');
	}
};
