<script lang="ts">
	import { Header } from '$lib/components/Header/index';
	import { type Snippet } from 'svelte';
	import { setAccount } from '$lib/stores/account.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

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
	<Header />
	<!-- This is defined here to avoid the global padding -->
	{#if $page.route.id === '/app'}
		<div class="gradient px-32 py-20">
			<h1 class="text-[56px] font-semibold leading-[4rem]">
				Do <span class="text-indigo-900">good</span> work,
			</h1>
			<h1 class="text-[56px] font-semibold leading-[4rem]">get paid</h1>
			<p class="mt-7 max-w-2xl">
				Our mission is to accelerate Ethereum adoption, because crypto must be built on a truly
				decentralized and permissionless base layer.
			</p>
		</div>
	{/if}
	<div class="px-8 md:px-16 lg:px-32">
		{@render children()}
	</div>
</div>

<style scoped>
	.gradient {
		background: linear-gradient(216.83deg, #dff5fc 0%, #e6f0ff 57.5%, #e6edfe 100%),
			radial-gradient(100% 100% at 0% 0%, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
	}
</style>
