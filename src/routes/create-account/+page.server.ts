import { createNewUser } from '$lib/server/database/users';
import { InsertUserSchema } from '$lib/server/schema';
import { type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	// TODO: must include authentication
	async register({ request }) {
		const formData = Object.fromEntries(await request.formData());
		console.log('formData', formData);
		const user = InsertUserSchema.parse(formData);

		await createNewUser(user);

		return {
			success: true
		};
	}
};
