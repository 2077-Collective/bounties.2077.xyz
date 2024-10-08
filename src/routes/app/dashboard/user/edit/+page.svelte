<script lang="ts">
	import CategorySelector, { type Category } from '$lib/components/CategorySelector.svelte';
	import Input from '$lib/components/Input.svelte';
	import InputImage from '$lib/components/InputImage.svelte';
	import { getAccount, updateAccountUser } from '$lib/stores/account.svelte';
	import { ExternalLink } from 'lucide-svelte';
	import type { PageData } from './$types';
	import TextArea from '$lib/components/TextArea.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	const account = getAccount();
	let userSkills: number[] = $state(
		account?.users.userSkills.map((userSkills) => userSkills.skill.id) ?? []
	);
	const previousUserSkills: Category[] = $derived(
		account?.users.userSkills.map((userSkills) => userSkills.skill) ?? []
	);
	let loading = $state(false);

	const enhanceSubmit: SubmitFunction = async ({ formData }) => {
		loading = true;

		userSkills.forEach((skillId) => {
			formData.append(`skills[]`, skillId.toString());
		});

		return async ({ result }) => {
			if (result.type === 'success') {
				if (result.data?.user) {
					updateAccountUser(result.data.user);
				}
			}

			if (result.type === 'redirect') {
				goto(result.location);
			}

			loading = false;
		};
	};
</script>

<div class="flex flex-col gap-6 max-w-screen-sm">
	<div class="border-b border-gray pb-6">
		<h3 class="text-lg">Sponsor profile</h3>
		<div class="flex justify-between">
			<p class="text-gray-400 text-sm">Provide as much or as little information as you like.</p>
			<a href={`/app/user/${account?.users?.id}`} class="text-sm flex gap-1">
				View my profile <ExternalLink class="w-4 h-4" />
			</a>
		</div>
	</div>

	<form
		class="flex flex-col gap-10"
		use:enhance={enhanceSubmit}
		method="POST"
		action="?/updateUser"
		enctype="multipart/form-data"
	>
		<div>
			<InputImage name="image" image={account?.users?.image} />
		</div>
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-2">
				<label class="text-sm" for="displayName">Username</label>
				<Input name="dispalyName" value={account?.users.displayName} />
				<p class="text-sm text-gray-400">This is your public display name.</p>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm" for="website">Website</label>
				<Input name="dispalyName" value={account?.users.website ?? undefined} />
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm" for="twitter">Twitter</label>
				<Input name="twitter" value={account?.users.twitter ?? undefined} />
			</div>
			<div class="flex flex-col gap-2">
				<label for="skills" class="block text-sm font-medium text-gray-700">Skills</label>
				<CategorySelector
					availableCategories={data.skills}
					onchange={(categories) => {
						userSkills = categories.map((category) => Number(category.id));
					}}
					name="skills"
					value={previousUserSkills}
				/>
			</div>
			<div class="flex flex-col gap-2">
				<label class="text-sm" for="twitter">Bio</label>
				<TextArea rows="4" name="bio" value={account?.users.bio ?? undefined} />
			</div>
		</div>
		<div class="flex justify-end">
			<Button type="submit" {loading} class="px-6 py-3 text-lg">Save</Button>
		</div>
	</form>
</div>
