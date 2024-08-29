<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, footer } = $props<{ class: string; footer: Snippet }>();
</script>

<div class={`flex items-center p-6 pt-0 ${className}`}>
	{@render footer()}
</div>
