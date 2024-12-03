<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import StepForm from '$lib/components/StepForm.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import LinkButton from '$lib/components/LinkButton.svelte';

	let sponsorInfo = {
		displayName: '',
		email: '',
		website: '',
		twitter: '',
		image: '',
		bio: ''
	};

	let success = $state(false);

	const onFormSubmit: SubmitFunction = async ({ formData }) => {
		for (const [key, value] of Object.entries(sponsorInfo)) {
			formData.set(key, value);
		}

		return ({ result }) => {
			if (result.type === 'success') {
				success = true;
			}
		};
	};
</script>

<div class="relative w-full h-screen">
	{#if success}
		<div class="flex flex-col gap-12 items-center justify-center h-full">
			<div class="flex flex-col gap-4 flex flex-col items-center justify-center max-w-xs">
				<h2 class="text-4xl font-semibold">Thank you</h2>
				<p class="text-center text-sm text-gray-400">
					You are signed up and now you can fund a new bounty project.
				</p>
			</div>
			<LinkButton href="/app/dashboard/sponsor/create-bounty" class="w-fit">
				Add a New Bounty
			</LinkButton>
		</div>
	{:else}
		<div
			class="max-w-2xl mx-auto border rounded-lg p-8 mt-8 md:mt-16 relative bg-background shadow-[0px_4px_6px_-2px_rgba(0,0,0,0.05)]"
		>
			<StepForm
				steps={[stepOne, stepTwo]}
				action="?/createSponsor"
				onsubmit={onFormSubmit}
				showProgress={false}
			/>
		</div>
	{/if}
</div>

<!-- Blurred background -->
<div
	class="bottom-0 mx-auto left-0 right-0 max-w-6xl absolute w-screen h-4/6 rounded-full blur-3xl bg-gradient-to-t from-[#EBE2FF] to-white -z-10"
></div>

{#snippet stepOne()}
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-4">
			<div class="flex justify-between items-center">
				<h2 class="text-lg">Sponsor details</h2>
				<p class="text-sm text-gray-400">Step 1 of 2</p>
			</div>
			<p class="text-sm text-gray-400">
				To maintain the quality of our platform we limit our bountyhunter community to the most
				qualified sponsors.
			</p>
		</div>
		<hr />
		<div class="flex flex-col gap-2">
			<label class="text-sm" for="displayName">Organization</label>
			<Input name="displayName" />
			<p class="text-xs text-gray-400">
				This is the public sponsor name from where you will create bounties.
			</p>
		</div>

		<!-- TODO: restrict textarea to 320 characters -->
		<div class="flex flex-col gap-2">
			<label class="text-sm" for="bio">Description</label>
			<TextArea name="bio" bind:value={sponsorInfo.bio} />
			<p class="text-xs text-gray-400">
				Describe what the organisation does to give bounty hunters more context with who they are
				working with. ({sponsorInfo.bio.length}/320)
			</p>
		</div>

		<div class="flex flex-col gap-2">
			<label class="text-sm" for="website">Website</label>
			<Input name="website" bind:value={sponsorInfo.website} />
		</div>
	</div>
{/snippet}

{#snippet stepTwo()}
	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-4">
			<div class="flex justify-between items-center">
				<h2 class="text-lg">How can we reach out?</h2>
				<p class="text-sm text-gray-400">Step 2 of 2</p>
			</div>
			<p class="text-sm text-gray-400">
				To maintain the quality of our platform bounties are verified by the community.
			</p>
		</div>
		<hr />

		<div class="flex flex-col gap-2">
			<label class="text-sm" for="email">Email</label>
			<Input name="email" bind:value={sponsorInfo.email} />
			<p class="text-xs text-gray-400">
				This address will not be shown on your profile by default.
			</p>
		</div>

		<div class="flex flex-col gap-2">
			<label class="text-sm" for="twitter">X (Twitter)</label>
			<Input name="twitter" bind:value={sponsorInfo.twitter} />
		</div>

		<p>ACCEPT TOS?</p>
	</div>
{/snippet}

<!-- <form
	method="POST"
	action="?/createSponsor"
	class="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
>
	<h2 class="text-2xl font-bold mb-6 text-center">Sponsor Information</h2>

	<div class="mb-4">
		<label for="displayName" class="block mb-2 font-medium text-gray-700">Display Name</label>
		<input
			type="text"
			id="displayName"
			name="displayName"
			bind:value={formData.displayName}
			required
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-4">
		<label for="email" class="block mb-2 font-medium text-gray-700">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			bind:value={formData.email}
			required
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-4">
		<label for="website" class="block mb-2 font-medium text-gray-700">Website</label>
		<input
			type="url"
			id="website"
			name="website"
			bind:value={formData.website}
			required
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-4">
		<label for="twitter" class="block mb-2 font-medium text-gray-700">Twitter</label>
		<input
			type="text"
			id="twitter"
			name="twitter"
			bind:value={formData.twitter}
			required
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-4">
		<label for="image" class="block mb-2 font-medium text-gray-700">Image URL</label>
		<input
			type="url"
			id="image"
			name="image"
			bind:value={formData.image}
			required
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-6">
		<label for="bio" class="block mb-2 font-medium text-gray-700">Bio</label>
		<textarea
			id="bio"
			name="bio"
			bind:value={formData.bio}
			required
			rows="4"
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		></textarea>
	</div>

	<button
		type="submit"
		class="w-full py-2 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
	>
		Submit
	</button>
</form> -->
