<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Logo from '$lib/components/icons/Logo.svelte';
	import { Mail } from 'lucide-svelte';

	let email = $state('');

	function handleSubmit(event: Event) {
		event.preventDefault();
		console.log('Email submitted:', email);
	}
</script>

<div class="relative h-screen">
	<!-- Blurred background -->
	<div
		class="bottom-0 mx-auto left-0 right-0 max-w-6xl absolute w-screen h-4/6 rounded-full blur-3xl bg-gradient-to-t from-purple-light to-white -z-10"
	></div>

	<div class="flex h-full flex-col items-center justify-center">
		<div class="max-w-2xl w-full space-y-8 text-center">
			<div class="flex flex-col items-center">
				<Badge class="bg-white border border-gray-light">Coming soon</Badge>
			</div>
			<div class="flex gap-4 justify-center">
				<div class="bg-white p-2 rounded-2xl border border-light">
					<Logo size="48px" />
				</div>

				<h1 class="text-4xl font-bold text-gray-dark flex items-center justify-center">
					2077 Bounty
				</h1>
			</div>
			<p class="text-gray-600 text-sm">
				Our mission is to accelerate Ethereum adoption, because for this vision to materialize,
				crypto must be built on a truly decentralized and permissionless base layer.
			</p>
			<form onsubmit={handleSubmit} class="flex justify-center">
				<div class="flex gap-2 flex-grow max-w-lg">
					<Input
						type="email"
						placeholder="Your email"
						bind:value={email}
						required
						class="p-1 pl-3"
						variant="custom"
					>
						{#snippet icon()}
							<Mail class="text-gray" />
						{/snippet}
						{#snippet button()}
							<Button type="submit">Join waitlist</Button>
						{/snippet}
					</Input>
				</div>
			</form>
		</div>
	</div>
</div>
