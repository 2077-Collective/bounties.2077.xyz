import type { SponsorSelect, UserSelect } from '$lib/server/schema';

export interface Account {
	users: UserSelect;
	sponsors: SponsorSelect | null;
}
