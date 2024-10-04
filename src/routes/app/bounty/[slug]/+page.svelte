<script lang="ts">
	import { Markdown } from 'carta-md';
	import { carta } from '$lib/utils/carta';
	import BountyStatusBadge from '$lib/components/BountyStatusBadge.svelte';
	import type { PageData } from './$types';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import { Plus, Clock, Tag, Trophy, BookmarkIcon, MessageSquare, Share } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import { getAccount } from '$lib/stores/account.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import ProfileImage from '$lib/components/ProfileImage.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Card } from '$lib/components/Card';
	import { formatDistanceStrict } from 'date-fns/formatDistanceStrict';
	import Badge from '$lib/components/Badge.svelte';
	import { formatDate } from 'date-fns';
	import '$lib/styles/carta-md/math-stack-exchange.css';

	const { data }: { data: PageData } = $props();
	let bounty = $state(data.bounty);
	const account = getAccount();

	const handleCommentSubmit: SubmitFunction = ({ formElement }) => {
		return ({ result }) => {
			if (result.type === 'success') {
				formElement.reset();

				if (result.data?.comments) {
					bounty.comments = result.data.comments;
				}
			}
		};
	};
</script>

<div class="flex py-16 gap-16">
	<div class="flex flex-col gap-12 w-4/6">
		<div class="flex flex-col gap-10">
			<div class="flex flex-col gap-4">
				<h1 class="text-4xl font-bold">{bounty.title}</h1>
				<div class="flex gap-3 items-center">
					<BountyStatusBadge {bounty} />

					<p>
						Published {formatDistanceStrict(bounty.createdAt, new Date(), { addSuffix: true })}
					</p>

					<LinkButton href="#comments" variant="secondary">
						<MessageSquare class="w-4 mr-1" />
						Comments ({bounty.comments.length})
					</LinkButton>

					<Button variant="secondary">
						<Share class="w-4 mr-1" />
						Share
					</Button>

					<Button variant="secondary">
						<BookmarkIcon class="w-4 mr-1" />
						Save
					</Button>
				</div>
			</div>

			<div class="leading-7">
				<Markdown {carta} value={bounty.description} theme="github" />
			</div>
		</div>

		<hr />

		<div class="flex flex-col gap-10" id="comments">
			<h2 class="text-3xl">Comments</h2>

			{#if account}
				<div class="flex gap-4">
					<ProfileImage image={account.users.image} size="48px" />

					<form
						action="?/comment"
						method="POST"
						class="flex-grow"
						use:enhance={handleCommentSubmit}
					>
						<div class="flex flex-col gap-4">
							<TextArea name="content" placeholder="Post a comment..." rows="3" />
							<div class="flex justify-end">
								<Button type="submit">Comment</Button>
							</div>
						</div>
					</form>
				</div>
			{/if}

			<div class="flex flex-col gap-10">
				{#each bounty.comments as comment}
					<div class="flex gap-4">
						<ProfileImage image={comment.user.image} size="48px" />

						<div class="flex flex-col flex-grow gap-1">
							<div class="flex gap-2">
								<p>{comment.user.displayName}</p>
								<p class="text-gray-500 leading-6">
									{formatDistanceStrict(comment.createdAt, new Date(), { addSuffix: true })}
								</p>
							</div>
							<p>{comment.content}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<Card class="w-2/6 h-fit flex flex-col gap-4">
		<div class="flex gap-3">
			<ProfileImage image={bounty.sponsor.image} size="48px" />
			<div>
				<p>{bounty.sponsor.displayName}</p>
				<p class="text-sm text-gray-500">Sponsor</p>
			</div>
		</div>

		<hr />

		<div class="flex flex-col gap-4">
			{#if bounty.rewards.length > 1}
				<div>
					<p class="flex items-center">
						<Trophy class="w-6 h-5 mr-2" />
						<span class="font-bold mr-1">
							{bounty.rewards.reduce((acc, curr) => acc + curr.amount, 0n)}
							{bounty.rewards[0].token.symbol}
						</span>
						Total prize pool
					</p>
				</div>

				<hr />

				<div class="flex flex-col gap-4">
					{#each bounty.rewards as reward}
						<div class="flex gap-3 w-full">
							<div>
								<img src={reward.token.logo} alt={reward.token.symbol} class="w-5" />
							</div>
							<div class="flex items-center justify-between flex-grow">
								<p class="leading-4">
									{reward.amount}
									{reward.token.symbol}
								</p>
								<p class="text-gray-500 text-sm">
									{reward.rank === 1
										? '1st Place'
										: reward.rank === 2
											? '2nd Place'
											: reward.rank === 3
												? '3rd Place'
												: `${reward.rank}th Place`}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{:else if bounty.rewards.length === 1}
				<div class="flex gap-3">
					<div>
						<img
							src={bounty.rewards[0].token.logo}
							alt={bounty.rewards[0].token.symbol}
							class="w-5"
						/>
					</div>
					<div>
						<p class="leading-4 mb-1">
							{bounty.rewards[0].amount}
							{bounty.rewards[0].token.symbol}
						</p>
						<p class="text-gray-500 text-sm">Winner takes all</p>
					</div>
				</div>
			{/if}
		</div>

		<hr />

		<div class="flex gap-3">
			<Tag class="w-5 mr-2" />
			<div class="flex gap-1 flex-wrap">
				{#each bounty.bountySkills as bountySkill}
					<Badge variant="transparent" class="text-xs">{bountySkill.skill.name}</Badge>
				{/each}
			</div>
		</div>

		<hr />

		<div class="flex gap-3 mb-5">
			<Clock class="w-5 h-5" />

			<div class="flex flex-col gap-1">
				<p class="leading-4">
					Due {formatDistanceStrict(bounty.endDate, new Date(), { addSuffix: true })}
				</p>
				<p class="text-gray-500 text-sm">{formatDate(bounty.endDate, 'PPPp')}</p>
			</div>
		</div>

		<button class="w-full bg-black text-white rounded-lg flex items-center justify-center py-3">
			<Plus class="w-4 h-4 mr-2" />
			Submit entry
		</button>
	</Card>
</div>
