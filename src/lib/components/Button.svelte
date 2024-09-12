<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	const Variant = {
		primary: 'bg-black text-white px-3 py-2',
		secondary: 'bg-gray-100 text-black hover:bg-gray-300 px-3 py-2',
		transparent: 'bg-transparent text-black'
	} as const;

	type ButtonType = 'button' | 'submit' | 'reset' | undefined;

	const {
		children,
		type = 'button',
		variant = 'primary',
		onclick,
		disabled = false,
		loading = false
	}: {
		children: Snippet;
		type?: ButtonType;
		variant?: keyof typeof Variant;
		onclick?: () => void;
		disabled?: boolean;
		loading?: boolean;
	} = $props();
</script>

<button
	{type}
	class={`cursor-pointer flex items-center rounded-lg text-sm font-500 focus:outline-none w-max ${Variant[variant]}`}
	{onclick}
	{disabled}
>
	{#if loading}
		<Spinner size="20px" color="white" />
	{:else}
		{@render children()}
	{/if}
</button>
