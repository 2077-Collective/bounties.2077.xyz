<script lang="ts">
	import { goto } from '$app/navigation';
	import { closeModal, openModal } from '$lib/stores/modal.svelte';
	import { Auth, type WalletLoginResponse } from '@2077collective/persona';
	import { onMount } from 'svelte';

	function handleLogin(user: WalletLoginResponse) {
		localStorage.setItem('walletAddress', user.address);
		closeModal();
		goto('/app');
	}

	onMount(() => {
		openModal(auth);
	});
</script>

{#snippet header()}
	<div class="mb-4">
		<h3 class="font-semibold text-xl mb-1">Connect a wallet</h3>
		<p class="text-gray-400 text-sm">Log in or Sign up</p>
	</div>
{/snippet}

{#snippet footer()}
	<p class="text-sm text-gray-400 mt-4 text-center leading-6">
		By connecting a wallet you agree to BountyHunter’s Terms of Service and Privacy Policy.
	</p>
{/snippet}

{#snippet auth()}
	<div class="w-full md:max-w-sm md:min-w-96 flex items-center justify-center">
		<Auth
			{header}
			{footer}
			walletLoginCallback={handleLogin}
			enableSocial={false}
			signatureEndpoint="/login"
			authenticationEndpoint="/login"
		/>
	</div>
{/snippet}
