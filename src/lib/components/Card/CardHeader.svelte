<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, children } = $props<{ class?: string; children: Snippet }>();
</script>

<div class={`flex flex-col space-y-1.5 p-6 ${className}`}>
	{@render children()}
</div>
