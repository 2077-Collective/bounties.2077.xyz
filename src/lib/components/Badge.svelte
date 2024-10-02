<script lang="ts" module>
	export type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'transparent';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	const variantStyles = {
		default: 'bg-gray-200 text-gray-800',
		success: 'bg-green-200 text-green-800',
		warning: 'bg-yellow-200 text-yellow-800',
		danger: 'bg-red-200 text-red-800',
		info: 'bg-blue-200 text-blue-800',
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
