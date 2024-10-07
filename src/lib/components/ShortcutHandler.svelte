<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getAccount } from '$lib/stores/account.svelte';

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			const { ctrlKey, shiftKey, metaKey } = e;
			const ctrlOrCmd = ctrlKey || metaKey;

			// Name: Go to profile
			// Shortcut: Shift + Command + P
			if (ctrlOrCmd && shiftKey && e.key === 'p') {
				const account = getAccount();
				goto(`/app/profile/user/${account?.users.id}`);
			}

			// Name: Go to bounty dashboard
			// Shortcut: Shif + Command + D
			if (ctrlOrCmd && shiftKey && e.key === 'd') {
				goto('/app/dashboard/sponsor/bounties');
			}

			// Name: Create a bounty
			// Shortcut: Shift + Command + B
			if (ctrlOrCmd && shiftKey && e.key === 'b') {
				goto('/app/dashboard/sponsor/create-bounty');
			}

			// Name: Go to settings
			// Shortcut: Command + S
			if (ctrlOrCmd && shiftKey && e.key === ',') {
				goto('/app/dashboard/user/edit');
			}

			// Name: Log out
			// Shortcut: Shift + Command + Q
			if (ctrlOrCmd && shiftKey && e.key === 'q') {
				goto('/logout');
			}
		});
	});
</script>
