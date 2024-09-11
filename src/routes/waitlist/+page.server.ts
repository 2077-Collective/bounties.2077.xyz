import { db } from '$lib/server/database';
import { enterWaitlist, getPositionInWaitlist } from '$lib/server/database/waitlist';
import type { Actions } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const WAITLIST_COOKIE_NAME = 'waitlist';

const WaitListCookiePayloadSchema = z.object({
	referralLink: z.string(),
	email: z.string()
});

const WaitlistSchema = z
	.object({
		email: z.string().email(),
		referrerCode: z.string().optional()
	})
	.transform((data) => {
		return {
			...data,
			referrerCode: data.referrerCode ?? null
		};
	});

export const load: PageServerLoad = async ({ cookies }) => {
	const cookie = cookies.get(WAITLIST_COOKIE_NAME);

	if (!cookie) return undefined;

	const { email, referralLink } = WaitListCookiePayloadSchema.parse(JSON.parse(cookie));

	return {
		email,
		referralLink,
		waitlistPosition: await getPositionInWaitlist(email)
	};
};

// TODO: if a user tries to enter the waitlist twice, the second time should return
// the position and referral link
export const actions: Actions = {
	async enterWaitlist({ request, url, cookies }) {
		return await db.transaction(async (tx) => {
			const formData = Object.fromEntries(await request.formData());
			const { referrerCode, email } = WaitlistSchema.parse(formData);
			const referrer = await enterWaitlist(email, referrerCode, tx);
			const referralLink = getReferralLink(url.origin, referrer.referralCode);
			const payload = WaitListCookiePayloadSchema.parse({ referralLink, email });

			cookies.set(WAITLIST_COOKIE_NAME, JSON.stringify(payload), {
				path: '/waitlist',
				httpOnly: true,
				secure: true,
				sameSite: 'strict'
			});

			return {
				success: true,
				waitlistPosition: await getPositionInWaitlist(email, tx),
				referralLink
			};
		});
	}
};

function getReferralLink(origin: string, referralCode: string) {
	return `${origin}/waitlist?ref=${referralCode}`;
}
