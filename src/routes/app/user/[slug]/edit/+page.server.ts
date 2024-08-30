import { updateUserById } from '$lib/server/database/users';
import { UpdateUserSchema } from '$lib/server/schema';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	// TODO: must include authentication
	async updateUser({ request, params }) {
		const userId = params.slug;
		if (!userId) return fail(400, { message: 'No user ID provided' });

		const formData = Object.fromEntries(await request.formData());
		const user = UpdateUserSchema.parse(formData);

		await updateUserById(parseInt(userId), user);

		return {
			success: true
		};
	}
};
