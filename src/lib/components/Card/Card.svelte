<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, card } = $props<{ class: string; card: Snippet }>();
</script>

<div class={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
	{@render card()}
</div>
