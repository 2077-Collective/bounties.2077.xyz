import { getUserById } from '$lib/server/database/users';
import { error, type LoadEvent } from '@sveltejs/kit';

export async function load({ params }: LoadEvent) {
	const userId = params.slug;

	if (!userId) return error(400, { message: 'No user ID provided' });

	const user = await getUserById(parseInt(userId));

	return user;
}
