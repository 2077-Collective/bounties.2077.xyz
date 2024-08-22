import type { RequestHandler } from '@sveltejs/kit';
import { generateJWTFromSignedMessage, generateSIWEMessage } from '@2077Collective/persona';
import { getUserIdByWalletAddress } from '$lib/server/database/users';

export const GET: RequestHandler = generateSIWEMessage({
	domain: 'localhost:5173',
	uri: 'http://localhost:5173/login'
});
export const POST: RequestHandler = generateJWTFromSignedMessage({
	jwtSecret: 'secret',
	userIdCallback: getUserIdByWalletAddress
});
