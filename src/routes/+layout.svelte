<script>
	import ShortcutsHandler from '$lib/components/ShortcutHandler.svelte';
	import '../app.css';
</script>

<div class="w-full h-full">
	<ShortcutsHandler />
	<slot />
</div>
