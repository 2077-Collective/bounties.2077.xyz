import type { Account } from '$lib/types';
import { redirect, type Handle } from '@sveltejs/kit';
import { JWTSigner } from '@2077Collective/persona';
import { getUserById } from '$lib/server/database/users';
import { JWT_SECRET } from '$env/static/private';

export const getAccount = async (jwt: string): Promise<Account | null> => {
	const payload = await new JWTSigner(JWT_SECRET).verify(jwt);

	console.log({ payload: payload.data });

	if (!payload.data) {
		return null;
	}

	console.log({ payload: payload.data });

	return getUserById(typeof payload === 'number' ? payload : parseInt(payload.data as string));
};

const skipAuth = ['/login', '/', '/create-account'];

export const handle: Handle = async ({ event, resolve }) => {
	console.log('Inside hook');

	if (event.route.id && skipAuth.includes(event.route.id)) {
		return resolve(event);
	}

	const jwt = event.cookies.get('jwt');
	console.log({ jwt });
	if (!jwt) {
		throw redirect(307, '/login');
	}

	const account = await getAccount(jwt);
	console.log({ account });
	if (!account) {
		throw redirect(307, '/create-account');
	}

	event.locals.account = account;
	return resolve(event);
};
