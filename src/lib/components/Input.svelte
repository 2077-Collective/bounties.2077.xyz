<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	const Variant = {
		regular: 'px-3 py-2',
		small: 'px-2 py-1',
		custom: ''
	} as const;

	let {
		class: className,
		id,
		name,
		type,
		value = $bindable(''),
		required = false,
		placeholder,
		min,
		disabled = false,
		variant = 'regular',
		icon,
		button,
		onchange
	}: {
		value?: string;
		class?: string;
		id?: string;
		name?: string;
		type?: string;
		required?: boolean;
		placeholder?: string;
		min?: string;
		disabled?: boolean;
		variant?: keyof typeof Variant;
		onchange?: (e: InputEvent) => void;
		icon?: Snippet;
		button?: Snippet;
	} = $props();
</script>

{#if icon}
	<div
		class={cn(
			`flex h-[48px] flex-grow items-center gap-2  border border-gray-300 bg-white rounded-lg focus:outline-none ${Variant[variant]}`,
			className
		)}
	>
		{@render icon()}
		<input
			type={type || 'text'}
			{id}
			{name}
			bind:value
			{required}
			{placeholder}
			{min}
			{onchange}
			{disabled}
			class="flex-grow focus:outline-none placeholder-gray disabled:text-gray disabled:bg-white"
		/>
		{#if button}
			{@render button()}
		{/if}
	</div>
{:else}
	<input
		type={type || 'text'}
		{id}
		{name}
		bind:value
		{required}
		{placeholder}
		{min}
		{disabled}
		{onchange}
		class={cn(
			`${disabled ? 'text-gray-400 bg-white' : 'text-gray-700'} flex-grow ${Variant[variant]} border border-gray-300 rounded-lg`,
			className
		)}
	/>
{/if}
