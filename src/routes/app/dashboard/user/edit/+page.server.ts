import { getSkills } from '$lib/server/database/skills';
import { UpdateUserSchema } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { updateUserById } from '$lib/server/database/users';
import { z } from 'zod';
import { uploadImage } from '$lib/server/services/upload-files';

const UpdateUserFormSchema = UpdateUserSchema.omit({ image: true }).extend({
	image: z.instanceof(File),
	skills: z.array(z.string()).transform((arr) => arr.map(Number))
});

export const load: PageServerLoad = async () => {
	return {
		skills: await getSkills()
	};
};

export const actions: Actions = {
	async updateUser({ request, locals }) {
		// Unauthenticated users should be catch at hook-level, this is just a type-safety mesaure
		if (!locals.account || !locals.account.users) throw redirect(307, '/login');

		const formData = await request.formData();
		const skills = formData.getAll('skills[]').map(String);
		const parsedFormData = UpdateUserFormSchema.parse({ ...Object.fromEntries(formData), skills });

		let image: string | undefined;
		if (parsedFormData.image.size > 0) image = await uploadImage(parsedFormData.image);

		const updatedUser = await updateUserById(
			locals.account.users.id,
			{ ...parsedFormData, image },
			parsedFormData.skills
		);

		if (!updatedUser) throw error(500, { message: 'User not found' });

		locals.account.users = updatedUser;

		return {
			user: updatedUser
		};
	}
};
