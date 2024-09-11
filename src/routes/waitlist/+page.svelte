<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Logo from '$lib/components/icons/Logo.svelte';
	import { Mail, Link } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	let email = $state('');
	let success: boolean | undefined = $state(data.email !== undefined);
	let referralLink: string | undefined = $state(data.referralLink);
	let waitlistPosition: number | undefined = $state(data.waitlistPosition);
	let copySuccess = $state(false);

	// Should add to local storage when a user has already signed up
	const enhanceSubmit: SubmitFunction = ({ formData }) => {
		formData.append('referrerCode', $page.url.searchParams.get('ref') || '');

		return async ({ result }) => {
			if (result.type === 'success') {
				success = true;

				if (result.data?.waitlistPosition) {
					waitlistPosition = result.data.waitlistPosition;
				}

				console.log(result.data);

				if (result.data?.referralLink) {
					referralLink = result.data.referralLink;
				}
			}
		};
	};

	const copyLink = async () => {
		if (referralLink) {
			try {
				await navigator.clipboard.writeText(referralLink);
				copySuccess = true;
				setTimeout(() => {
					copySuccess = false;
				}, 3000);
			} catch (err) {
				console.error('Failed to copy text: ', err);
			}
		}
	};
</script>

<div class="relative h-screen">
	<!-- Blurred background -->
	<div
		class="bottom-0 mx-auto left-0 right-0 max-w-6xl absolute w-screen h-4/6 rounded-full blur-3xl bg-gradient-to-t from-purple-light to-white -z-10"
	></div>

	<div class="flex h-full flex-col items-center justify-center">
		<div class="max-w-2xl w-full space-y-10 text-center">
			<div class="flex flex-col items-center">
				<Badge class="bg-white border border-gray-light">Coming soon</Badge>
			</div>
			<div class="flex gap-4 justify-center">
				<div class="bg-white p-2 rounded-2xl border border-light">
					<Logo size="48px" />
				</div>

				<h1 class="text-6xl font-bold text-gray-dark flex items-center justify-center">
					2077 Bounty
				</h1>
			</div>
			{#if success}
				<div class="flex flex-col gap-10">
					<div class="flex flex-col gap-2">
						<h2 class="text-4xl font-semibold">You're on the waitlist!</h2>
						<p class="text-gray-600">
							Skip ahead in line by referring friends using the link below
						</p>
					</div>
					{#if referralLink}
						<div class="flex gap-2 justify-center items-center w-full">
							<Input
								value={referralLink}
								required
								class="p-1 pl-3 max-w-lg"
								variant="custom"
								disabled
							>
								{#snippet icon()}
									<Link class="text-gray" />
								{/snippet}
								{#snippet button()}
									<Button onclick={copyLink}>
										{copySuccess ? 'Copied!' : 'Copy link'}
									</Button>
								{/snippet}
							</Input>
						</div>
					{/if}

					{#if waitlistPosition !== null}
						<div class="flex flex-col gap-2">
							<p class="text-gray-600">Your place in line</p>
							<h2 class="text-5xl font-semibold">{waitlistPosition}</h2>
						</div>
					{/if}
				</div>
			{:else}
				<p class="text-gray-600">
					Our mission is to accelerate Ethereum adoption, because for this vision to materialize,
					crypto must be built on a truly decentralized and permissionless base layer.
				</p>
				<form
					method="post"
					action={`?/enterWaitlist`}
					class="flex justify-center"
					use:enhance={enhanceSubmit}
				>
					<div class="flex gap-2 flex-grow max-w-lg">
						<Input
							type="email"
							name="email"
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
			{/if}
		</div>
	</div>
</div>
