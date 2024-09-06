<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, children } = $props<{ class?: string; children: Snippet }>();
</script>

<p class={`text-sm text-muted-foreground ${className}`}>
	{@render children()}
</p>
