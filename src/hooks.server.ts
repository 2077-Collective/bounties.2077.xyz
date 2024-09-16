import type { Account } from '$lib/types';
import { redirect, type Handle } from '@sveltejs/kit';
import { JWTSigner } from '@2077collective/persona';
import { getUserById } from '$lib/server/database/users';
import { JWT_SECRET, NODE_ENV } from '$env/static/private';

export const getAccount = async (jwt: string): Promise<Account | null> => {
	const payload = await new JWTSigner(JWT_SECRET).verify(jwt);

	if (payload.data === undefined || payload.data === null) {
		return null;
	}

	const user = await getUserById(
		typeof payload === 'number' ? payload : parseInt(payload.data as string)
	);

	return user;
};

const skipAuth = ['/login', '/', '/create-account', '/waitlist'];

export const handle: Handle = async ({ event, resolve }) => {
	// TODO: switch to production
	if (NODE_ENV === 'production' && event.route.id !== '/waitlist') {
		throw redirect(307, '/waitlist');
	}

	if (event.route.id && skipAuth.includes(event.route.id)) {
		return resolve(event);
	}

	const jwt = event.cookies.get('jwt');
	if (!jwt) {
		throw redirect(307, '/login');
	}

	const account = await getAccount(jwt);
	if (!account) {
		throw redirect(307, '/create-account');
	}

	event.locals.account = account;

	return resolve(event);
};
