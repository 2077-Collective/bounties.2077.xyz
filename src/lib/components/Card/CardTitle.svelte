<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, title } = $props<{ class: string; title: Snippet }>();
</script>

<h3 class={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
	{@render title()}
</h3>
