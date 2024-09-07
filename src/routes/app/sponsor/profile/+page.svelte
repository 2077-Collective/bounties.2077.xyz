<script lang="ts">
	import { Edit } from 'lucide-svelte';

	let isEditing = $state(false);
	let sponsor = $state({
		displayName: '',
		email: '',
		website: '',
		twitter: '',
		bio: '',
		image: ''
	});
</script>

<div class="bg-white shadow-md rounded-lg">
	<h2 class="text-2xl font-bold mb-4">Sponsor Profile</h2>
	{#if isEditing}
		<form class="space-y-4" action="?/updateSponsor" method="POST">
			<div>
				<label for="displayName" class="block text-sm font-medium text-gray-700">Display Name</label
				>
				<input
					id="displayName"
					name="displayName"
					type="text"
					bind:value={sponsor.displayName}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					bind:value={sponsor.email}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label for="website" class="block text-sm font-medium text-gray-700">Website</label>
				<input
					id="website"
					name="website"
					type="url"
					bind:value={sponsor.website}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label for="twitter" class="block text-sm font-medium text-gray-700">Twitter</label>
				<input
					id="twitter"
					name="twitter"
					type="text"
					bind:value={sponsor.twitter}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
				/>
			</div>
			<div>
				<label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
				<textarea
					id="bio"
					name="bio"
					bind:value={sponsor.bio}
					rows="4"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
				></textarea>
			</div>
			<button
				type="submit"
				class="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
			>
				Save Changes
			</button>
		</form>
	{:else}
		<div class="space-y-4">
			<div class="flex items-center space-x-4">
				<img src={sponsor.image} alt={sponsor.displayName} class="h-20 w-20 rounded-full" />
				<div>
					<h3 class="text-xl font-semibold">{sponsor.displayName}</h3>
					<p class="text-gray-500">{sponsor.email}</p>
				</div>
			</div>
			<div>
				<h4 class="font-semibold">Website</h4>
				<a
					href={sponsor.website}
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-500 hover:underline">{sponsor.website}</a
				>
			</div>
			<div>
				<h4 class="font-semibold">Twitter</h4>
				<p>{sponsor.twitter}</p>
			</div>
			<div>
				<h4 class="font-semibold">Bio</h4>
				<p>{sponsor.bio}</p>
			</div>
			<button
				onclick={() => (isEditing = true)}
				class="flex items-center px-4 py-2 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
			>
				<Edit class="h-4 w-4 mr-2" />
				Edit Profile
			</button>
		</div>
	{/if}
</div>
