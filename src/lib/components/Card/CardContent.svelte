<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, content } = $props<{ class: string; content: Snippet }>();
</script>

<div class={`p-6 pt-0 ${className}`}>
	{@render content()}
</div>
