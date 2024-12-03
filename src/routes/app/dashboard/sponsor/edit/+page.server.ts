import { UpdateSponsorSchema } from '$lib/types';
import type { Actions } from './$types';
import { updateSponsorById } from '$lib/server/database/sponsors';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { uploadImage } from '$lib/server/services/upload-files';

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

		let image: string | undefined;
		if (sponsorForm.image.size > 0) image = await uploadImage(sponsorForm.image);

		const updatedSponsor = await updateSponsorById(sponsorId, { ...sponsorForm, image });

		locals.account.sponsors = updatedSponsor;

		return {
			sponsor: updatedSponsor
		};
	}
};
