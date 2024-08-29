<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, description } = $props<{ class: string; description: Snippet }>();
</script>

<p class={`text-sm text-muted-foreground ${className}`}>
	{@render description()}
</p>
