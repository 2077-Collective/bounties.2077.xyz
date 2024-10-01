<script lang="ts">
	import { Header } from '$lib/components/Header/index';
	import ShortcutsHandler from '$lib/components/ShortcutHandler.svelte';
	import { type Snippet } from 'svelte';
	import { setAccount } from '$lib/stores/account.svelte';
	import type { PageData } from './$types';
	import Modal from '$lib/components/Modal.svelte';

	const {
		data,
		children
	}: {
		data: PageData;
		children: Snippet;
	} = $props();

	setAccount(data.account);
</script>

<div class="w-full h-full relative">
	<Modal />
	<ShortcutsHandler />
	<Header />
	{@render children()}
</div>
