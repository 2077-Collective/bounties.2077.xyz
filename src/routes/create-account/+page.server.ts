import { BLOB_READ_WRITE_TOKEN, JWT_SECRET } from '$env/static/private';
import { createNewUser } from '$lib/server/database/users';
import { InsertUserSchema } from '$lib/types';
import { JWTSigner } from '@2077collective/persona';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSkills } from '$lib/server/database/skills';
import { z } from 'zod';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

const jwtSigner = new JWTSigner(JWT_SECRET);

export const load: PageServerLoad = async () => {
	return {
		skills: await getSkills()
	};
};

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

const RegisterUserFormSchema = InsertUserSchema.omit({ image: true }).extend({
	image: z.instanceof(File),
	skills: z.array(z.string()).transform((arr) => arr.map(Number))
});

export const actions: Actions = {
	async register({ request, cookies }) {
		const jwt = cookies.get('jwt');
		if (!isAuthenticated(jwt)) return error(401, 'Unauthorized');

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);
		const skills = formData.getAll('skills[]').map(String);
		const sponsorForm = RegisterUserFormSchema.parse({ ...rawData, skills });

		// TODO: extract upload to function
		let image: string | undefined;
		if (sponsorForm.image.size > 0) {
			if (sponsorForm.image.size > 4 * 1024 * 1024) {
				return fail(400, { message: 'Image too large' });
			}

			const { url } = await put(nanoid(10), sponsorForm.image, {
				access: 'public',
				token: BLOB_READ_WRITE_TOKEN
			});

			image = url;
		}

		const parsedFormData = InsertUserSchema.parse({
			...rawData,
			image
		});
		const user = await createNewUser(parsedFormData, sponsorForm.skills);

		cookies.set('jwt', await jwtSigner.sign(user.id), {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict'
		});

		return {
			success: true
		};
	}
};
