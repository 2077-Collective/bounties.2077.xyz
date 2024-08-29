<script lang="ts">
	import type { Snippet } from 'svelte';

	const { class: className, headerContent: header } = $props<{
		class: string;
		headerContent: Snippet;
	}>();
</script>

<div class={`flex flex-col space-y-1.5 p-6 ${className}`}>
	{@render header()}
</div>
