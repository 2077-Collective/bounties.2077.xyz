<script lang="ts">
	import { ExternalLink, PencilLine } from 'lucide-svelte';
	import ProfileImage from '$lib/components/ProfileImage.svelte';
	import Input from '$lib/components/Input.svelte';
	import TextArea from '$lib/components/TextArea.svelte';

	interface ProfileInfo {
		displayName: string;
		website: string;
		twitter: string;
		bio: string;
		image: string;
	}

	const sponsorInfo: ProfileInfo = $state({
		displayName: '',
		website: '',
		twitter: '',
		bio: '',
		image: ''
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

	<form class="py-6 flex flex-col gap-10">
		<div class="relative group w-fit cursor-pointer">
			<ProfileImage size="90px" />
			<div class="hidden group-hover:block transition-all absolute top-0 -right-2">
				<div class="bg-white rounded-full border border-gray-300 p-2">
					<PencilLine class="right-0 w-4 h-4" />
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-2">
				<label for="displayName">Organisation</label>
				<Input name="displayName" bind:value={sponsorInfo.displayName} />
				<p class="text-sm text-gray-400">This is your public display name.</p>
			</div>

			<div class="flex flex-col gap-2">
				<label for="displayName">Website</label>
				<Input name="displayName" bind:value={sponsorInfo.website} />
			</div>

			<div class="flex flex-col gap-2">
				<label for="displayName">X (Twitter)</label>
				<Input name="displayName" bind:value={sponsorInfo.twitter} />
			</div>

			<div class="flex flex-col gap-2">
				<label for="displayName">About</label>
				<TextArea name="displayName" bind:value={sponsorInfo.bio} />
			</div>
		</div>
	</form>
</div>
