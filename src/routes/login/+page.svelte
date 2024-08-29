<script lang="ts">
	import { goto } from '$app/navigation';
	import { Auth, type WalletLoginResponse } from '@2077Collective/persona';

	function handleLogin(user: WalletLoginResponse) {
		localStorage.setItem('walletAddress', user.address);
		goto('/app');
	}
</script>

{#snippet header()}
	<h3 class="font-bold text-xl">Login or sign up</h3>
{/snippet}

<div class="flex flex-col items-center justify-center h-full gap-8">
	<h1 class="font-bold text-3xl">2077 Bounties</h1>
	<Auth
		{header}
		walletLoginCallback={handleLogin}
		enableSocial={false}
		signatureEndpoint="/login"
		authenticationEndpoint="/login"
		spinnerSize="24px"
	/>
</div>
