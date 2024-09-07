import { createNewUser } from '$lib/server/database/users';
import { InsertUserSchema } from '$lib/types';
import { type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	// TODO: must include authentication
	async updateUser({ request }) {
		const formData = Object.fromEntries(await request.formData());
		const user = InsertUserSchema.parse(formData);

		await createNewUser(user);

		return {
			success: true
		};
	}
};
