<script lang="ts">
	let formData = {
		displayName: '',
		email: '',
		website: '',
		twitter: '',
		image: '',
		bio: ''
	};

	function handleSubmit() {
		// Handle form submission here
		console.log(formData);
	}
</script>

<form
	on:submit|preventDefault={handleSubmit}
	class="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
>
	<h2 class="text-2xl font-bold mb-6 text-center">Sponsor Information</h2>

	<div class="mb-4">
		<label for="displayName" class="block mb-2 font-medium text-gray-700">Display Name</label>
		<input
			type="text"
			id="displayName"
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
			bind:value={formData.image}
			required
			class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-6">
		<label for="bio" class="block mb-2 font-medium text-gray-700">Bio</label>
		<textarea
			id="bio"
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
</form>
