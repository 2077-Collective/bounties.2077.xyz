<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, children } = $props<{ class?: string; children: Snippet }>();
</script>

<div class={`rounded-lg border border-gray-200 p-6 ${className}`}>
	{@render children()}
</div>
