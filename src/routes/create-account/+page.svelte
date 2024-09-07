<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';

	let formData = {
		displayName: '',
		username: '',
		walletAddress: '',
		email: '',
		image: '',
		website: '',
		twitter: '',
		bio: ''
	};

	onMount(() => {
		const walletAddress = localStorage.getItem('walletAddress');

		// Wallet is required for registration. It'll not be mandatory after social login is implemented
		if (!walletAddress) {
			return goto('/login');
		}

		formData.walletAddress = walletAddress;
	});
</script>

<form
	method="POST"
	action="?/register"
	class="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
>
	<h2 class="text-2xl font-bold mb-6 text-center">User Information</h2>

	<Input
		type="text"
		id="walletAddress"
		name="walletAddress"
		bind:value={formData.walletAddress}
		required
		class="hidden"
	/>

	<div class="mb-4">
		<label for="displayName" class="block mb-2 font-medium text-gray-700">Display Name</label>
		<Input
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
		<Input type="email" id="email" name="email" bind:value={formData.email} required />
	</div>

	<div class="mb-4">
		<label for="image" class="block mb-2 font-medium text-gray-700">Image URL (optional)</label>
		<Input
			type="url"
			id="image"
			name="image"
			bind:value={formData.image}
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-4">
		<label for="website" class="block mb-2 font-medium text-gray-700">Website (optional)</label>
		<Input
			type="url"
			id="website"
			name="website"
			bind:value={formData.website}
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-4">
		<label for="twitter" class="block mb-2 font-medium text-gray-700">Twitter</label>
		<Input type="text" id="twitter" bind:value={formData.twitter} required />
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

	<Button type="submit">Submit</Button>
</form>
