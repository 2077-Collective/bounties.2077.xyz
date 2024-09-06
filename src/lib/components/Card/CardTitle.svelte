<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, children } = $props<{ class?: string; children: Snippet }>();
</script>

<h3 class={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
	{@render children()}
</h3>
