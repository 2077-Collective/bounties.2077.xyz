<script>
	import ShortcutsHandler from '$lib/components/ShortcutHandler.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import '../app.css';
</script>

<div class="w-full h-full">
	<Modal />
	<ShortcutsHandler />
	<slot />
</div>
