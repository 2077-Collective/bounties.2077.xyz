<script lang="ts" module>
	export type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	const variantStyles: Record<Variant, string> = {
		default: 'bg-gray-lighter text-gray-dark',
		success: 'bg-green text-green-dark',
		danger: 'bg-red-light text-red-dark',
		warning: 'bg-eggshell-light text-eggshell-dark',
		info: 'bg-black text-white'
	};

	const {
		variant = 'default',
		class: className,
		children
	}: {
		variant?: Variant;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class={`${variantStyles[variant]} rounded-full px-2 py-1 text-sm w-fit ${className}`}>
	{@render children()}
</div>
