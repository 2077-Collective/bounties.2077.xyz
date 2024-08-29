// See https://kit.svelte.dev/docs/types#app

import type { Account } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			account: Account | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
