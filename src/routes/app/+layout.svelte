<script lang="ts">
	import { Header } from '$lib/components/Header/index';
	import ShortcutsHandler from '$lib/components/ShortcutHandler.svelte';
</script>

<div class="w-full h-full">
	<ShortcutsHandler />
	<Header />
	<slot />
</div>
