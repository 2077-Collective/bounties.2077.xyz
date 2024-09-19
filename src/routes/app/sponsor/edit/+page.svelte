<script lang="ts">
	import { ExternalLink } from 'lucide-svelte';
	import Input from '$lib/components/Input.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import InputImage from '$lib/components/InputImage.svelte';
	import Button from '$lib/components/Button.svelte';
	import { getAccount } from '$lib/stores/account.svelte';
	import { enhance } from '$app/forms';

	interface ProfileInfo {
		displayName: string;
		website: string;
		twitter: string;
		bio: string;
	}

	const account = getAccount();
	const sponsorInfo: ProfileInfo = $state({
		displayName: account?.sponsors?.displayName || '',
		website: account?.sponsors?.website || '',
		twitter: account?.sponsors?.twitter || '',
		bio: account?.sponsors?.bio || ''
	});
</script>

<div class="max-w-screen-sm">
	<div class="border-b border-gray pb-6">
		<h3>Sponsor profile</h3>
		<div class="flex justify-between">
			<p class="text-gray-400 text-sm">Provide as much or as little information as you like.</p>
			<a href={`/app/profile/sponsor/${'0'}`} class="text-sm flex gap-1">
				View my profile <ExternalLink class="w-4 h-4" />
			</a>
		</div>
	</div>

	<form
		action="?/updateSponsorProfile"
		method="POST"
		enctype="multipart/form-data"
		class="py-6 flex flex-col gap-10"
		use:enhance
	>
		<InputImage
			name="image"
			bind:value={sponsorInfo.displayName}
			image={account?.sponsors?.image}
		/>

		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-2">
				<label for="displayName">Organisation</label>
				<Input name="displayName" bind:value={sponsorInfo.displayName} />
				<p class="text-sm text-gray-400">This is your public display name.</p>
			</div>

			<div class="flex flex-col gap-2">
				<label for="displayName">Website</label>
				<Input name="website" bind:value={sponsorInfo.website} />
			</div>

			<div class="flex flex-col gap-2">
				<label for="displayName">X (Twitter)</label>
				<Input name="twitter" bind:value={sponsorInfo.twitter} />
			</div>

			<div class="flex flex-col gap-2">
				<label for="displayName">About</label>
				<TextArea name="bio" bind:value={sponsorInfo.bio} />
			</div>
		</div>

		<Button type="submit">Save</Button>
	</form>
</div>
