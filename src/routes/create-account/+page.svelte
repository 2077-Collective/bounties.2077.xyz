<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let userType: 'regular' | 'sponsor' = 'regular';
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
	let errors: Record<string, string> = {};

	onMount(() => {
		const walletAddress = localStorage.getItem('walletAddress');

		// Wallet is required for registration. It'll not be mandatory after social login is implemented
		if (!walletAddress) {
			return goto('/login');
		}

		formData.walletAddress = walletAddress;
	});

	function validateForm(): boolean {
		errors = {};
		if (!formData.displayName) errors.displayName = 'Display name is required';
		if (!formData.username) errors.username = 'Username is required';
		if (!formData.email) errors.email = 'Email is required';
		if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Invalid email format';
		if (!formData.bio) errors.bio = 'Bio is required';
		return Object.keys(errors).length === 0;
	}
</script>

<form
	method="POST"
	action="?/register"
	class="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
>
	<h2 class="text-2xl font-bold mb-6">Register for Bounties App</h2>
	<p class="mb-6 text-gray-600">Choose your user type and fill in your details</p>

	<div class="mb-6">
		<div class="flex items-center mb-2">
			<input
				type="radio"
				id="regular"
				name="userType"
				bind:group={userType}
				value="regular"
				class="mr-2"
			/>
			<label for="regular" class="mr-4">Regular User</label>
			<input
				type="radio"
				id="sponsor"
				name="userType"
				bind:group={userType}
				value="sponsor"
				class="mr-2"
			/>
			<label for="sponsor">Sponsor</label>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
		<div>
			<label for="displayName" class="block mb-2 font-bold text-gray-700">Display Name</label>
			<input
				id="displayName"
				name="displayName"
				bind:value={formData.displayName}
				class="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				required
			/>
			{#if errors.displayName}
				<p class="text-red-500 text-xs italic">{errors.displayName}</p>
			{/if}
		</div>
		<div>
			<label for="email" class="block mb-2 font-bold text-gray-700">Email</label>
			<input
				id="email"
				name="email"
				type="email"
				bind:value={formData.email}
				class="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				required
			/>
			{#if errors.email}
				<p class="text-red-500 text-xs italic">{errors.email}</p>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
		<div>
			<label for="twitter" class="block mb-2 font-bold text-gray-700">Twitter</label>
			<input
				id="twitter"
				name="twitter"
				bind:value={formData.twitter}
				class="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
		<div>
			<label for="website" class="block mb-2 font-bold text-gray-700">Website</label>
			<input
				id="website"
				name="website"
				bind:value={formData.website}
				class="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	</div>

	<div class="mb-6">
		<label for="image" class="block mb-2 font-bold text-gray-700">Profile Image URL</label>
		<input
			id="image"
			name="image"
			bind:value={formData.image}
			class="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-6">
		<label for="bio" class="block mb-2 font-bold text-gray-700">Bio</label>
		<textarea
			id="bio"
			name="bio"
			bind:value={formData.bio}
			class="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			rows="4"
			required
		></textarea>
		{#if errors.bio}
			<p class="text-red-500 text-xs italic">{errors.bio}</p>
		{/if}
	</div>

	<input type="hidden" name="walletAddress" bind:value={formData.walletAddress} />

	<div class="flex items-center justify-between">
		<button
			type="submit"
			class="bg-black hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
		>
			Register
		</button>
	</div>
</form>
