<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import StepForm from '$lib/components/StepForm.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { closeModal, openModal } from '$lib/stores/modal.svelte';
	import type { PageData } from './$types';
	import BadgeSelect from '$lib/components/BadgeSelect.svelte';
	import InputImage from '$lib/components/InputImage.svelte';
	import Input from '$lib/components/Input.svelte';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	let userInfo = $state({
		displayName: 'nano',
		walletAddress: ''
	});
	let profilePic: File[] = $state([]);
	let skills: (string | number)[] = $state([]);
	let loading = $state(false);
	let isSponsorRegistration = $state(false);

	const onFormSubmit: SubmitFunction = async ({ formData }) => {
		loading = true;

		Object.entries(userInfo).map(([key, value]) => formData.append(key, value));

		if (profilePic.length > 0) {
			formData.append('image', profilePic[0]);
		}

		skills.forEach((skill) => {
			formData.append('skills[]', skill.toString());
		});

		return ({ result }) => {
			if (result.type === 'success') {
				closeModal();
				return goto('/app');
			}

			loading = false;
		};
	};

	onMount(() => {
		const walletAddress = localStorage.getItem('walletAddress');

		// Wallet is required for registration. It'll not be mandatory after social login is implemented
		if (!walletAddress) {
			return goto('/login');
		}

		userInfo.walletAddress = walletAddress;

		openModal(registrationModal, { dismissible: false });
	});
</script>

{#snippet stepOne()}
	<div class="w-full flex flex-col gap-6 mb-12">
		<div>
			<p class="text-sm text-gray-400">Welcome</p>
			<h2 class="text-xl md:text-2xl">What would you use 2077 Bounty for?</h2>
		</div>
		<div class="flex flex-col gap-2 p-1">
			<button
				onclick={() => (isSponsorRegistration = false)}
				class="w-full h-full flex gap-2 p-3 outline outline-1 rounded-lg items-center transition-all"
				class:outline-2={!isSponsorRegistration}
				class:outline-1={isSponsorRegistration}
				class:outline-black={!isSponsorRegistration}
				class:outline-gray-200={isSponsorRegistration}
			>
				<div class="bg-secondary w-8 h-8 rounded-full p-2 flex-shrink-0">
					<div
						class="h-full w-full bg-gray-300 rounded-full transition-all"
						class:opacity-0={isSponsorRegistration}
					></div>
				</div>
				<p class="text-left text-sm md:text-base">Doing the work an collecting some sweet ETH</p>
			</button>
			<button
				onclick={() => (isSponsorRegistration = true)}
				class="w-full h-full flex gap-2 p-3 outline outline-1 rounded-lg items-center transition-all"
				class:outline-2={isSponsorRegistration}
				class:outline-1={!isSponsorRegistration}
				class:outline-black={isSponsorRegistration}
				class:outline-gray-200={!isSponsorRegistration}
			>
				<div class="bg-secondary w-8 h-8 rounded-full p-2 flex-shrink-0">
					<div
						class="h-full w-full bg-gray-300 rounded-full transition-all"
						class:opacity-0={!isSponsorRegistration}
					></div>
				</div>
				<p class="text-left text-sm md:text-base flex-wrap">
					I have some assignments that need to be taken care of
				</p>
			</button>
		</div>
	</div>
{/snippet}

{#snippet stepTwo()}
	<div class="w-full flex flex-col gap-6 mb-12 max-h-full">
		<div>
			<p class="text-sm text-gray-400">Welcome</p>
			<h2 class="text-xl md:text-2xl">What are your most valueable skills?</h2>
		</div>

		<BadgeSelect options={data.skills} onchange={(selectedSkills) => (skills = selectedSkills)} />
	</div>
{/snippet}

{#snippet stepThree()}
	<div class="w-full flex flex-col gap-6 mb-12 max-h-full">
		<div>
			<p class="text-sm text-gray-400">Welcome</p>
			<h2 class="text-xl md:text-2xl">We’d like you to stand out, how does this look?</h2>
		</div>

		<div class="flex flex-col gap-4 items-center justify-center">
			<InputImage
				name="image"
				image="/images/placeholder-profile-image.webp"
				bind:value={profilePic}
			/>
			<Input
				bind:value={userInfo.displayName}
				placeholder="Your name"
				class="text-2xl text-black font-semibold"
			/>
		</div>
	</div>
{/snippet}

{#snippet registrationModal()}
	<StepForm
		steps={[stepOne, stepTwo, stepThree]}
		action="?/register"
		onsubmit={onFormSubmit}
		enctype="multipart/form-data"
		{loading}
	/>
{/snippet}
