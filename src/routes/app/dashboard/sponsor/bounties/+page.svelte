<script lang="ts">
	import { ExternalLink, Inbox, Pencil, PlusCircle } from 'lucide-svelte';
	import type { PageData } from './$types';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import BountyStatusBadge from '$lib/components/BountyStatusBadge.svelte';
	import Input from '$lib/components/Input.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { formatRelativeDate } from '$lib/utils';
	import { SubmissionState, type EnhancedBounty } from '$lib/types';

	const BASE_URL = '/app/dashboard/sponsor';
	const getLink = (path: string) => `${BASE_URL}${path}`;

	const {
		data
	}: {
		data: PageData;
	} = $props();

	let searchTerm = $state('');

	const bounties = $derived(data.bounties);
	const filteredBounties = $derived(bounties.filter((bounty) => bounty.title.includes(searchTerm)));

	function getSubmissionCount(bounty: EnhancedBounty) {
		return bounty.submissions.filter(
			(submission) => submission.state === SubmissionState.Unreviewed
		).length;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<h2 class="text-xl">Bounties</h2>
		<p class="text-sm text-gray">All your open and historic bounties</p>
	</div>

	<div class="flex justify-between gap-2 mb-2">
		<div>
			<Input bind:value={searchTerm} placeholder="Search" />
		</div>
		<LinkButton href={getLink('/create-bounty')}>
			<PlusCircle class="w-4 h-4 mr-2" />
			Create Bounty
		</LinkButton>
	</div>

	<hr />

	<div class="space-y-6">
		{#each filteredBounties as bounty}
			<div class="flex justify-between gap-2">
				<div class="bg-white rounded-lg flex flex-col gap-2 w-3/4">
					<div class="flex flex-col gap-2">
						<div class="flex gap-2">
							<h2 class="text-lg">{bounty.title}</h2>
							<BountyStatusBadge {bounty} />
						</div>

						<div class="text-sm text-gray">
							{bounty.excerpt}
						</div>
					</div>

					<div class="flex gap-2 text-sm text-gray-dark">
						<p>{formatRelativeDate(bounty.endDate)}</p>
						<p>•</p>
						<p>Submissions: {bounty.submissions.length}</p>
						<p>•</p>
						<p>Comments: {bounty.comments.length}</p>
						<p>•</p>
						<p>Saves: TODO</p>
					</div>
				</div>

				<div class="w-1/4 flex flex-col items-end">
					<LinkButton href={`/app/bounty/${bounty.id}`} variant="transparent">
						<ExternalLink class="w-4 h-4 mr-2" />
						Open bounty page
					</LinkButton>

					<LinkButton href={getLink(`/bounties/${bounty.id}/edit`)} variant="transparent">
						<Pencil class="w-4 h-4 mr-2" />
						Edit bounty
					</LinkButton>

					<LinkButton href={getLink(`/bounty/${bounty.id}/submissions`)} variant="transparent">
						<Inbox class="w-4 h-4 mr-2" />
						View submissions
						{#if getSubmissionCount(bounty) > 0}
							<Badge variant="warning" class="ml-2 text-xs">
								{getSubmissionCount(bounty)}
							</Badge>
						{/if}
					</LinkButton>
				</div>
			</div>
			<hr />
		{/each}
	</div>
</div>
