<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	const Variant = {
		primary: 'bg-black text-white px-3 py-2',
		secondary: 'bg-gray-100 text-black hover:bg-gray-300 px-3 py-2',
		transparent: 'bg-transparent text-black',
		outline: 'border hover:bg-gray-50 px-3 py-2'
	} as const;

	type ButtonType = 'button' | 'submit' | 'reset' | undefined;

	const {
		id,
		children,
		type = 'button',
		variant = 'primary',
		onclick,
		disabled = false,
		loading = false,
		class: className
	}: {
		id?: string;
		children: Snippet;
		type?: ButtonType;
		variant?: keyof typeof Variant;
		onclick?: () => void;
		disabled?: boolean;
		loading?: boolean;
		class?: string;
	} = $props();
</script>

<button
	{id}
	{type}
	class={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center rounded-lg text-sm font-500 focus:outline-none w-max ${Variant[variant]} ${className}`}
	{onclick}
	{disabled}
>
	{#if loading}
		<Spinner size="20px" color="white" />
	{:else}
		{@render children()}
	{/if}
</button>
