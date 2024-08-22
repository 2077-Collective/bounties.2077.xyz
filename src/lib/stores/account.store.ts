import type { Account } from '$lib/types';

let accountStore = $state<Account | null>(null);

export function setAccount(account: Account) {
	accountStore = account;
}

export function getAccount() {
	return accountStore;
}
