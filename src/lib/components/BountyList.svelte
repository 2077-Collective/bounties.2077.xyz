<script lang="ts">
	import type { EnhancedBountyListItem } from '$lib/types';
	import { Bookmark, Clock } from 'lucide-svelte';
	import Badge from './Badge.svelte';
	import BountyStatusBadge from './BountyStatusBadge.svelte';
	import ProfileImage from './ProfileImage.svelte';
	import { formatRelativeDate } from '$lib/utils';

	const {
		bountyList
	}: {
		bountyList: EnhancedBountyListItem[];
	} = $props();
</script>

<div class="flex flex-col gap-3">
	{#each bountyList as bounty}
		<a href={`app/bounty/${bounty.id}`}>
			<div class="flex flex-col md:flex-row gap-6 p-6 border rounded-lg">
				<div class="flex-shrink-0">
					<ProfileImage size="64px" image={bounty.sponsor.image} />
				</div>

				<div class="flex flex-col gap-3">
					<div>
						<div class="flex gap-2">
							<h2 class="text-lg font-semibold">
								{bounty.title}
							</h2>
							<BountyStatusBadge {bounty} />
						</div>
						<div class="text-sm flex gap-2 items-center">
							<p class="font-sm">{bounty.sponsor.displayName}</p>
							<span class="flex gap-1 items-center text-gray-600">
								<Clock class="w-[14px]" />
								{formatRelativeDate(bounty.endDate)}
							</span>
						</div>
					</div>

					<!-- Excerpt with max height and ellipsis -->
					<p class="text-sm text-gray-700 max-h-12 max-w-xl overflow-hidden line-clamp-2">
						{bounty.excerpt}
					</p>

					<div class="flex flex-wrap gap-2">
						{#each bounty.bountySkills as bountySkill}
							<Badge variant="transparent">{bountySkill.skill.name}</Badge>
						{/each}
					</div>
				</div>

				<div class="flex md:flex-col flex-grow justify-between items-end">
					<div class="flex gap-1 items-center">
						<img src={bounty.rewards[0].token.logo} class="w-6 h-6 rounded-full" alt="token" />
						<p class="text-xl font-semibold">
							{bounty.rewards.reduce((acc, curr) => acc + curr.amount, 0n)}
						</p>
					</div>

					<button class="p-2 rounded-full bg-purple-200 flex-shrink-0">
						<Bookmark class="w-4 h-4 text-purple-900" fill="currentColor" />
					</button>
				</div>
			</div>
		</a>
	{/each}
</div>
