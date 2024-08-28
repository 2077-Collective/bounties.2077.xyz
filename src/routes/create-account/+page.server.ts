import { createNewUser } from '$lib/server/database/users';
import { InsertUserSchema } from '$lib/server/schema';
import { JWTSigner } from '@2077Collective/persona';
import { error, type Actions } from '@sveltejs/kit';

async function isAuthenticated(jwt: string | undefined): Promise<boolean> {
	if (!jwt) return false;

	try {
		const payload = await new JWTSigner('another secret').verify(jwt);
		return !!payload.userId;
	} catch {
		return false;
	}
}

export const actions: Actions = {
	// TODO: must include authentication
	async register({ request, cookies }) {
		const jwt = cookies.get('jwt');

		if (!isAuthenticated(jwt)) return error(401, 'Unauthorized');

		const formData = Object.fromEntries(await request.formData());
		const user = InsertUserSchema.parse(formData);

		await createNewUser(user);

		return {
			success: true
		};
	}
};
