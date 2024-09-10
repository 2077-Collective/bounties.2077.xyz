import { db } from '$lib/server/database';
import { enterWaitlist } from '$lib/server/database/waitlist';
import { InsertWaitlistSchema } from '$lib/types';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	async enterWaitlist({ request, url }) {
		await db.transaction(async (tx) => {
			const referralCode = url.searchParams.get('ref');

			const formData = Object.fromEntries(await request.formData());
			const parsedWaitlist = InsertWaitlistSchema.parse(formData);

			await enterWaitlist(parsedWaitlist.email, referralCode, tx);
		});
	}
};
