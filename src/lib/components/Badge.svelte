<script lang="ts" module>
	export type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'transparent';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	const variantStyles: Record<Variant, string> = {
		default: 'bg-gray-lighter text-gray-dark',
		success: 'bg-green text-green-dark',
		danger: 'bg-red-light text-red-dark',
		warning: 'bg-eggshell-light text-eggshell-dark',
		info: 'bg-black text-white',
		transparent: 'border border-gray'
	};

	const {
		variant = 'default',
		class: className,
		children,
		onclick
	}: {
		variant?: Variant;
		class?: string;
		children: Snippet;
		onclick?: () => void;
	} = $props();
</script>

<button
	{onclick}
	class={`${variantStyles[variant]} rounded-full px-2 py-1 text-sm w-fit ${className}`}
	type="button"
>
	{@render children()}
</button>
