<script lang="ts">
	import type { Snippet } from 'svelte';

	const Variant = {
		primary: 'bg-black text-white px-3 py-2',
		secondary: 'bg-gray-100 text-black hover:bg-gray-300 px-3 py-2',
		transparent: 'text-black underline'
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
	class={`flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${Variant[variant]} ${className}`}
>
	{@render children()}
</a>
