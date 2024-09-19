import { UpdateSponsorSchema } from '$lib/types';
import type { Actions } from './$types';
import { updateSponsorById } from '$lib/server/database/sponsors';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

const UpdateSponsorFormSchema = UpdateSponsorSchema.omit({ image: true }).extend({
	image: z.instanceof(File)
});

export const actions: Actions = {
	async updateSponsorProfile({ request, locals }) {
		if (!locals.account || !locals.account?.sponsors?.id)
			return fail(401, { message: 'Unauthorized' });

		const formData = Object.fromEntries(await request.formData());
		const sponsorId = locals.account.sponsors.id;
		const sponsorForm = UpdateSponsorFormSchema.parse(formData);
		// TODO: How to avoid updating an image it's the same?
		const { url } = await put(nanoid(10), sponsorForm.image, {
			access: 'public',
			token: BLOB_READ_WRITE_TOKEN
		});
		const updatedSponsor = await updateSponsorById(sponsorId, { ...sponsorForm, image: url });

		locals.account.sponsors = updatedSponsor;

		return {
			success: true
		};
	}
};
