<script lang="ts">
	import { Header } from '$lib/components/Header/index';
	import ShortcutsHandler from '$lib/components/ShortcutHandler.svelte';
	import { type Snippet } from 'svelte';
	import { setAccount } from '$lib/stores/account.svelte';
	import type { PageData } from './$types';

	const {
		data,
		children
	}: {
		data: PageData;
		children: Snippet;
	} = $props();

	setAccount(data.account);
</script>

<div class="w-full h-full">
	<ShortcutsHandler />
	<Header />
	<div class="px-8 md:px-16 lg:px-32">
		{@render children()}
	</div>
</div>
