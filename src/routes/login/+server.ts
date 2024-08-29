import type { RequestHandler } from '@sveltejs/kit';
import { generateJWTFromSignedMessage, generateSIWEMessage } from '@2077Collective/persona';
import { getUserIdByWalletAddress } from '$lib/server/database/users';

export const GET: RequestHandler = generateSIWEMessage();
export const POST: RequestHandler = generateJWTFromSignedMessage({
	jwtSecret: 'secret',
	userIdCallback: getUserIdByWalletAddress
});
