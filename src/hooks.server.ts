import type { Account } from '$lib/types';
import { redirect, type Handle } from '@sveltejs/kit';
import { JWTSigner } from '@2077Collective/persona';
import { getUserById } from '$lib/server/database/users';

export const getAccount = async (jwt: string): Promise<Account | null> => {
	// TODO: check if jwt is valid
	//
	const payload = await new JWTSigner('secret').verify(jwt);

	if (!payload.userId) {
		return null;
	}

	return getUserById(typeof payload === 'number' ? payload : parseInt(payload.userId as string));
};

const skipAuth = ['/login', '/', '/create-account'];

export const handle: Handle = async ({ event, resolve }) => {
	if (event.route.id && skipAuth.includes(event.route.id)) {
		return resolve(event);
	}
	const jwt = event.cookies.get('jwt');
	if (!jwt) {
		return redirect(307, '/login');
	}
	const account = await getAccount(jwt);
	if (!account) {
		return redirect(307, '/create-account');
	}
	event.locals.account = account;
	return resolve(event);
};
