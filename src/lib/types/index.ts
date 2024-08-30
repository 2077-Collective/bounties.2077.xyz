import type { SelectSponsor, SelectUser } from '$lib/server/schema';

export interface Account {
	users: SelectUser;
	sponsors: SelectSponsor | null;
}
