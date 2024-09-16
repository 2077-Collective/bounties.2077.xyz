<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			const { ctrlKey, shiftKey, metaKey } = e;
			const ctrlOrCmd = ctrlKey || metaKey;

			// Name: Go to profile
			// Shortcut: Shift + Command + P
			if (ctrlOrCmd && shiftKey && e.key === 'p') {
				// TODO: add sponsor id when public profile is ready
				goto('/app/sponsor');
			}

			// Name: Go to bounty dashboard
			// Shortcut: Shif + Command + D
			if (ctrlOrCmd && shiftKey && e.key === 'd') {
				goto('/app/sponsor/bounties');
			}

			// Name: Create a bounty
			// Shortcut: Shift + Command + B
			if (ctrlOrCmd && shiftKey && e.key === 'b') {
				goto('/app/sponsor/create-bounty');
			}

			// Name: Go to settings
			// Shortcut: Command + S
			if (ctrlOrCmd && e.key === ',') {
				goto('/app/settings');
			}

			// Name: Log out
			// Shortcut: Shift + Command + Q
			if (ctrlOrCmd && shiftKey && e.key === 'q') {
				goto('/logout');
			}
		});
	});
</script>
