<script lang="ts">
	import type { Snippet } from 'svelte';

	const Variant = {
		primary: 'bg-black text-white px-3 py-2',
		transparent: 'text-black'
	} as const;

	const {
		class: className,
		href,
		children,
		variant = 'primary'
	}: {
		href: string;
		children: Snippet;
		variant?: keyof typeof Variant;
		class?: string;
	} = $props();
</script>

<a
	{href}
	class={`flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer underline ${Variant[variant]} ${className}`}
>
	{@render children()}
</a>
