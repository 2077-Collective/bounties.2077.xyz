import type { RequestHandler } from '@sveltejs/kit';
import { generateJWTFromSignedMessage, generateSIWEMessage } from '@2077collective/persona';
import { getUserIdByWalletAddress } from '$lib/server/database/users';
import { JWT_SECRET } from '$env/static/private';

export const GET: RequestHandler = generateSIWEMessage();
export const POST: RequestHandler = generateJWTFromSignedMessage({
	jwtSecret: JWT_SECRET,
	userIdCallback: getUserIdByWalletAddress
});
