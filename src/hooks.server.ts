import type { Account } from '$lib/types';
import { redirect, type Handle } from '@sveltejs/kit';
import { JWTSigner } from '@2077collective/persona';
import { getAccountByUserId } from '$lib/server/database/users';
import { JWT_SECRET, NODE_ENV } from '$env/static/private';

export const getAccount = async (jwt: string): Promise<Account | null> => {
	const payload = await new JWTSigner(JWT_SECRET).verify(jwt);

	if (payload.data === undefined || payload.data === null) {
		return null;
	}

	const user = await getAccountByUserId(
		typeof payload === 'number' ? payload : parseInt(payload.data as string)
	);

	return user;
};

// All the paths and subpaths that require authentication
// If /app is present, authentication would be required for all paths starting with /app
const requireAuthPaths = ['/app/dashboard'];

export const handle: Handle = async ({ event, resolve }) => {
	if (NODE_ENV === 'production' && event.route.id !== '/waitlist') {
		throw redirect(307, '/waitlist');
	}

	const jwt = event.cookies.get('jwt');
	const account = jwt ? await getAccount(jwt) : null;
	event.locals.account = account;

	const pathRequiresAuth =
		event.route.id && requireAuthPaths.find((path) => event.route.id?.includes(path));
	if (!pathRequiresAuth) return resolve(event);
	else if (pathRequiresAuth && !event.locals.account) throw redirect(307, '/login');

	return resolve(event);
};
