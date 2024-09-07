<script lang="ts">
	import type { Snippet } from 'svelte';

	const Variant = {
		primary: 'bg-black text-white px-3 py-2',
		transparent: 'text-black'
	} as const;

	const {
		href,
		children,
		variant = Variant.primary
	} = $props<{
		href: string;
		children: Snippet;
		variant?: keyof typeof Variant;
	}>();
</script>

<a
	{href}
	class={`flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${variant}`}
>
	{@render children()}
</a>
