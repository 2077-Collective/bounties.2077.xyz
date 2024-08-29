import type { Account } from '$lib/types';
import { error, redirect, type Handle } from '@sveltejs/kit';
import { JWTSigner } from '@2077Collective/persona';
import { getUserById } from '$lib/server/database/users';
import { JWT_SECRET } from '$env/static/private';

export const getAccount = async (jwt: string): Promise<Account | null> => {
	console.log('BEFORE ACCOUNT');
	const payload = await new JWTSigner(JWT_SECRET).verify(jwt);
	console.log('payload', payload);

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
		throw redirect(307, '/login');
	}

	console.log('before account');
	const account = await getAccount(jwt);
	console.log('after account', account);
	if (!account) {
		throw redirect(307, '/create-account');
	}

	event.locals.account = account;
	return resolve(event);
};
