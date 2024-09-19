import type { Account } from '$lib/types';

let accountStore = $state<Account | null>(null);

export function setAccount(account: Account | null) {
	accountStore = account;
}

export function getAccount() {
	return accountStore;
}

export function updateAccountSponsor(sponsor: Account['sponsors']) {
	if (!accountStore) throw new Error('Account not found');

	accountStore.sponsors = sponsor;
}
