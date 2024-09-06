<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children } = $props<{ children: Snippet }>();
</script>

<h1 class="text-3xl font-bold mb-8">{@render children()}</h1>
