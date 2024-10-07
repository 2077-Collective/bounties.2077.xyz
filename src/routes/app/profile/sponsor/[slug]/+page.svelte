<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ProfileImage from '$lib/components/ProfileImage.svelte';
	import { ExternalLink } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { formatRelativeDate } from '$lib/utils';
	import Clock from 'lucide-svelte/icons/clock';
	import Badge from '$lib/components/Badge.svelte';
	import ProfileCard, { type ProfileCardProps } from '$lib/components/ProfileCard.svelte';
	import { getAccount } from '$lib/stores/account.svelte';

	const {
		data: sponsor
	}: {
		data: PageData;
	} = $props();

	const profileCards: ProfileCardProps[] = $derived([
		{
			title: 'Bounties',
			value: sponsor.bounties?.length ? sponsor.bounties.length.toString() : undefined
		},
		{
			title: 'Total awarded',
			value: sponsor.totalAmountAwarded ? `$ ${sponsor.totalAmountAwarded.toString()}` : undefined
		},
		{ title: 'Top contributor', value: sponsor.topContributor?.displayName.toString() }
	]);
</script>

<div class="left-0 absolute gradient w-full h-32 rotate-180 -z-10"></div>
<div class="flex flex-col gap-10 max-w-screen-lg pl-24 py-16">
	<div class="w-full flex justify-between">
		<div class="flex w-full grow">
			<ProfileImage size="80px" image={sponsor.image} />

			<div class="ml-6 flex flex-col gap-3 py-1">
				<h1 class="text-4xl font-bold">{sponsor.displayName}</h1>
				<div class="flex text-sm gap-2 text-gray-500">
					<p>
						<a href={sponsor.website} target="_blank">
							{sponsor.website.split('//')[1]}
						</a>
					</p>
					<p>•</p>
					<p>
						<a href={sponsor.twitter} target="_blank">
							{sponsor.twitter}
						</a>
					</p>
					<p>•</p>
					<p>
						<a href="/" target="_blank">Join Discord</a>
					</p>
				</div>
			</div>
		</div>
		{#if getAccount()?.sponsors?.id === sponsor.id}
			<div class="py-1">
				<Button variant="secondary">Edit Profile</Button>
			</div>
		{/if}
	</div>

	<div>
		<p class="text-gray-600">{sponsor.bio}</p>
	</div>

	<div class="flex gap-2">
		{#each profileCards as card}
			<ProfileCard value={card.value} title={card.title} />
		{/each}
	</div>

	<div class="flex flex-col gap-8">
		<div>
			<div class="flex justify-between">
				<h2 class="text-xl font-semibold">Bounties</h2>
				{#if getAccount()?.sponsors?.id === sponsor.id}
					<a href="/app/dashboard/sponsor/bounties" class="text-sm flex gap-1 items-center">
						Manage
						<ExternalLink class="w-4 ml-1" />
					</a>
				{/if}
			</div>
		</div>

		<div class="flex flex-col gap-4">
			{#each sponsor.bounties as bounty}
				<a href={`/app/bounty/${bounty.id}`}>
					<div class="flex gap-4 border border-gray rounded-lg p-6">
						<div class="w-3/12">
							<ProfileImage size="64px" image={sponsor.image} />
						</div>

						<div class="flex flex-col gap-3">
							<div class="">
								<div class="flex justify-between">
									<h3 class="text-lg font-semibold">{bounty.title}</h3>
									<div class="flex gap-2 items-center">
										<img src={bounty.rewards[0].token.logo} alt="token logo" class="w-6 h-6" />
										<p class="text-xl font-semibold">
											{bounty.rewards.reduce((acc, curr) => acc + curr.amount, 0n)}
										</p>
									</div>
								</div>

								<div class="text-sm flex gap-2 items-center">
									<span>
										{sponsor.displayName}
									</span>
									<span class="flex gap-1 items-center text-gray-600">
										<Clock class="w-4" />
										{formatRelativeDate(bounty.endDate)}
									</span>
								</div>
							</div>

							<div class="grow w-4/5">
								<p class="text-gray-600 text-sm">{bounty.excerpt}</p>
							</div>
							<div class="flex gap-2">
								{#each bounty.bountySkills as skill}
									<Badge variant="transparent">{skill.skill.name}</Badge>
								{/each}
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>

<style scoped>
	.gradient {
		background:
			radial-gradient(100% 100% at 0% 0%, #ffffff 0%, rgba(255, 255, 255, 0) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */,
			radial-gradient(61.74% 60.53% at 61.74% 100%, #eafaff 0%, rgba(234, 237, 255, 0) 100%)
				/* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
	}
</style>
