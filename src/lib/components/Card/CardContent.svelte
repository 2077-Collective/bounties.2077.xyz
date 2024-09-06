<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, children } = $props<{ class?: string; children: Snippet }>();
</script>

<div class={`p-6 pt-0 ${className}`}>
	{@render children()}
</div>
