<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import ProfileCard from '$lib/components/ProfileCard.svelte';
	import type { ProfileCardProps } from '$lib/components/ProfileCard.svelte';
	import ProfileImage from '$lib/components/ProfileImage.svelte';
	import type { PageData } from './$types';
	import Tabs from '$lib/components/Tabs.svelte';
	import BountyList from '$lib/components/BountyList.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	const bookmarkedBounties = $derived(data.user.bookmarks.map((bookmark) => bookmark.bounty));
	const profileCards: ProfileCardProps[] = $derived([
		{
			title: 'Rewarded',
			value: data.user.amountRewarded ? `$ ${data.user.amountRewarded}` : null
		},
		{
			title: ' Winning Submissions',
			value: data.user.winningSubmissionsCount
		}
	]);
</script>

<div class="gradient w-full h-16 rotate-180 h-16"></div>
<div class="flex justify-center pb-16">
	<div class="flex flex-col gap-6 md:gap-10 w-full px-6 sm:px-8 md:px-32 lg:max-w-3xl lg:px-0">
		<!-- Profile header (profile pic, name, skills, bio, bounty stats)-->
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-3 md:flex-row items-center md:justify-between md:items-end">
				<ProfileImage image={data.user.image} size="144px" />
				{#if data.user.id === data.account?.users?.id}
					<LinkButton href="/app/dashboard/sponsor/edit" variant="secondary">
						Edit profile
					</LinkButton>
				{/if}
			</div>

			<div class="flex flex-col gap-2 text-center md:text-left">
				<h1 class="text-4xl font-bold">{data.user.displayName}</h1>
				<div class="flex gap-2 justify-center md:justify-start">
					{#if data.user.website}
						<a
							href={data.user.website}
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-500 hover:underline"
						>
							{data.user.website.replace(/https?:\/\//, '')}
						</a>
						<span class="text-gray-500">•</span>
					{/if}
					{#if data.user.twitter}
						<a
							href={data.user.website}
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-500 hover:underline"
						>
							@{data.user.twitter} on X
						</a>
					{/if}
				</div>
			</div>

			<div class="flex justify-center md:justify-start flex-wrap gap-2">
				{#each data.user.userSkills as userSkills}
					<Badge variant="transparent">
						{userSkills.skill.name}
					</Badge>
				{/each}
			</div>

			{#if data.user.bio}
				<div>
					<p class="text-center md:text-left text-gray-700 leading-7">{data.user.bio}</p>
				</div>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
				{#each profileCards as card}
					<ProfileCard value={card.value} title={card.title} />
				{/each}
			</div>
		</div>

		<div>
			<Tabs tabTitles={['Bookmarks', 'Submissions', 'Teams']} tabs={[tabOne, tabTwo, tabThree]} />
			{#snippet tabOne()}
				<BountyList bountyList={bookmarkedBounties} />
			{/snippet}

			{#snippet tabTwo()}
				<div>TODO</div>
			{/snippet}

			{#snippet tabThree()}
				<div>TODO</div>
			{/snippet}
		</div>
	</div>
</div>

<style scoped>
	.gradient {
		background:
			radial-gradient(100% 100% at 0% 0%, #ffffff 0%, rgba(255, 255, 255, 0) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(30.49% 50% at 69.51% 100%, #eaf0ff 0%, rgba(234, 240, 255, 0) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(61.74% 60.53% at 61.74% 100%, #eaf0ff 0%, rgba(243, 234, 255, 0) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
	}
</style>
