<!-- 
TODOS
    - Full page
-->
<script lang="ts">
	import type { EnhancedBounty, SelectChain, SelectSkill, SelectToken } from '$lib/types';
	import { CardContent } from '$lib/components/Card/index';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import CategorySelector from '$lib/components/CategorySelector.svelte';
	import TabCard from '$lib/components/TabCard.svelte';
	import Select from '$lib/components/Select.svelte';
	import { Trash2 } from 'lucide-svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import MarkdownEditor from './MarkdownEditor.svelte';
	import LinkButton from './LinkButton.svelte';
	import BountyStatusBadge from './BountyStatusBadge.svelte';
	import { formatDistanceStrict } from 'date-fns';

	const {
		bounty,
		tokens,
		skills,
		chains,
		enhanceSubmit,
		action
	}: {
		bounty?: EnhancedBounty;
		tokens: SelectToken[];
		skills: SelectSkill[];
		chains: SelectChain[];
		enhanceSubmit: (
			requiredSkills: number[],
			paymentChain: number | null,
			tokenId: number | null,
			rewards: { rank: number; amount: string }[],
			draft: boolean
		) => SubmitFunction;
		action: string;
	} = $props();

	let requiredSkills: number[] = $state(
		bounty?.bountySkills.map((bountySkill) => bountySkill.skill.id) || []
	);
	let paymentChain: number | null = $state(chains[0]?.id || null);
	let selectedChain = $derived(chains.find((chain) => chain.id === paymentChain));
	let availableTokens = $derived(
		paymentChain === null ? [] : tokens.filter((token) => token.chainId === paymentChain)
	);
	let tokenId: number | null = $state(bounty?.rewards[0]?.tokenId || null);
	let selectedToken = $derived(tokens.find((token) => token.id === tokenId));
	let rewards: { rank: number; amount: string }[] = $state(
		bounty
			? bounty.rewards.map(({ rank, amount }) => ({ rank, amount: amount.toString() }))
			: [{ rank: 1, amount: '0' }]
	);
	const bountySkills = $derived(bounty?.bountySkills.map((bountySkill) => bountySkill.skill) || []);

	function addReward() {
		const newRank = rewards.length + 1;
		rewards = [...rewards, { rank: newRank, amount: '0' }];
	}

	function removeReward(index: number) {
		rewards = rewards.filter((_, i) => i !== index);
		// Update ranks after removal
		rewards = rewards.map((reward, index) => ({ ...reward, rank: index + 1 }));
	}

	const submitFunction: SubmitFunction = (event) => {
		let isDraft = false;
		const submitter = event.submitter;

		if (submitter?.id === 'save') isDraft = true;

		return enhanceSubmit(requiredSkills, paymentChain, tokenId, rewards, isDraft)(event);
	};
</script>

<div class="w-full pb-8 absolute top-0 left-0 bg-[#fafafa]">
	<div>
		<form method="POST" {action} use:enhance={submitFunction}>
			<div
				class="flex flex-col md:flex-row gap-4 md:gap-6 justify-between bg-white py-4 border-b items-center px-12"
			>
				<div class="flex gap-3 items-center">
					<p class="font-medium">
						{bounty ? 'Edit bounty' : 'Create bounty'}
					</p>
					{#if bounty}
						<BountyStatusBadge {bounty} />
						<p class="text-gray-600 hidden md:block text-sm">
							Last edited {formatDistanceStrict(bounty.updatedAt || bounty.createdAt, new Date(), {
								addSuffix: true
							})}
						</p>
					{/if}
				</div>
				{#if bounty}
					<p class="text-gray-600 bloc md:hidden text-sm">
						Last edited {formatDistanceStrict(bounty.updatedAt || bounty.createdAt, new Date(), {
							addSuffix: true
						})}
					</p>
				{/if}
				<div class="flex gap-2">
					<LinkButton variant="secondary" href="/app/dashboard/sponsor/bounties">Cancel</LinkButton>
					<Button type="submit" variant="outline" id="save"
						>{bounty ? (bounty.draft ? 'Save' : 'Move to draft') : 'Save'}</Button
					>
					<Button type="submit" id="publish">Publish</Button>
				</div>
			</div>
			<div class="space-y-6 max-w-2xl px-6 md:px-0 mx-auto py-12">
				<div class="flex flex-col gap-2">
					<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
					<p class="text-xs text-gray-400">Make sure it’s concise and descriptive</p>
					<Input type="text" id="title" name="title" required value={bounty?.title} />
				</div>

				<div class="flex flex-col gap-2">
					<label for="title" class="block text-sm font-medium text-gray-700">Excerpt</label>
					<p class="text-xs text-gray-400">The project description in a nutshell</p>
					<Input type="text" id="excerpt" name="excerpt" required value={bounty?.excerpt} />
				</div>

				<div class="flex flex-col gap-2">
					<label for="skills" class="block text-sm font-medium text-gray-700">Categories</label>
					<CategorySelector
						availableCategories={skills}
						onchange={(categories) => {
							requiredSkills = categories.map((category) => Number(category.id));
						}}
						name="skills"
						value={bountySkills}
					/>
					<p class="text-xs text-gray-400">Multiple categories possible.</p>
				</div>

				<div class="flex flex-col gap-2">
					<label for="description" class="block text-sm font-medium text-gray-700">Briefing</label>
					<MarkdownEditor name="description" value={bounty?.description} />
				</div>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div class="flex flex-col gap-2">
						<label for="startDate" class="block text-sm font-medium text-gray-700">
							Start Date
						</label>
						<p class="text-xs text-gray-400">The date when the bounty will be available</p>
						<Input type="date" id="startDate" name="startDate" required value={bounty?.startDate} />
					</div>

					<div class="flex flex-col gap-2">
						<label for="startDate" class="block text-sm font-medium text-gray-700">End Date</label>
						<p class="text-xs text-gray-400">Deadline for submissions</p>
						<Input type="date" id="endDate" name="endDate" required value={bounty?.endDate} />
					</div>
				</div>

				<div>
					<TabCard
						labels={['Winner takes all', 'Multiple winners']}
						title="Rewards"
						active={bounty && bounty.rewards.length > 1 ? 1 : 0}
						disabled={!!bounty}
						contents={[winnerTakesAll, multipleWinners]}
					/>
					{#snippet winnerTakesAll()}
						<div class="flex flex-col gap-6 w-full">
							<div class="flex flex-col gap-2">
								<label for="paymentChain" class="block text-sm font-medium text-gray-700">
									Payment network
								</label>
								<Select
									options={chains.map((chain) => ({ label: chain.name, value: chain.id }))}
									onchange={(option) => {
										if (option) {
											paymentChain = Number(option.value);
										}
									}}
									value={selectedChain
										? { label: selectedChain.name, value: selectedChain.id }
										: undefined}
									name="paymentChain"
									id="paymentChain"
									disabled={!!bounty}
								/>
							</div>
							<div class="flex flex-col sm:flex-row gap-6">
								<div class="w-full flex flex-col gap-2">
									<label for="tokenId" class="block text-sm font-medium text-gray-700"
										>Currency</label
									>
									<Select
										options={availableTokens.map((token) => ({
											label: token.symbol,
											value: token.id
										}))}
										onchange={(option) => {
											if (option) {
												tokenId = Number(option.value);
											}
										}}
										value={selectedToken
											? { label: selectedToken.symbol, value: selectedToken.id }
											: undefined}
										name="tokenId"
										id="tokenId"
										disabled={!!bounty}
									/>
								</div>
								<div class="w-full flex flex-col gap-2">
									<label for="reward" class="block text-sm font-medium text-gray-700">Amount</label>
									<Input
										type="number"
										id="reward"
										name="reward"
										bind:value={rewards[0].amount}
										required
										disabled={!!bounty}
									/>
								</div>
							</div>
						</div>
					{/snippet}

					{#snippet multipleWinners()}
						<div class="flex flex-col gap-6 w-full">
							<div class="flex flex-col gap-2">
								<label for="paymentChain" class="block text-sm font-medium text-gray-700"
									>Payment network</label
								>
								<Select
									options={chains.map((chain) => ({ label: chain.name, value: chain.id }))}
									onchange={(option) => {
										if (option) {
											paymentChain = Number(option.value);
										}
									}}
									name="paymentChain"
									id="paymentChain"
									disabled={!!bounty}
									value={selectedChain
										? { label: selectedChain.name, value: selectedChain.id }
										: undefined}
								/>
							</div>

							<div class="flex flex-col gap-2">
								<label for="tokenId" class="block text-sm font-medium text-gray-700">Currency</label
								>
								<Select
									options={availableTokens.map((token) => ({
										label: token.symbol,
										value: token.id
									}))}
									onchange={(option) => {
										if (option) {
											tokenId = Number(option.value);
										}
									}}
									name="tokenId"
									id="tokenId"
									disabled={!!bounty}
									value={selectedToken
										? { label: selectedToken.symbol, value: selectedToken.id }
										: undefined}
								/>
							</div>

							<div class="flex flex-col border border-gray-200 px-4 rounded-md">
								{#each rewards as reward, index (reward.rank)}
									<div
										class="flex gap-4 items-end justify-between items-center py-4"
										class:border-b={index !== rewards.length - 1}
									>
										<p class="block text-sm font-medium">
											{index === 0
												? '1st'
												: index === 1
													? '2nd'
													: index === 2
														? '3rd'
														: `${index + 1}th`} Place
										</p>

										<div class="w-1/2 flex gap-2">
											<Input
												type="number"
												bind:value={reward.amount}
												class="text-right"
												required
												disabled={!!bounty}
											/>
											<Button
												type="button"
												onclick={() => removeReward(index)}
												disabled={rewards.length === 1 || !!bounty}
												variant="secondary"
											>
												<Trash2 size={16} />
											</Button>
										</div>
									</div>
								{/each}
							</div>

							<div class="flex justify-between">
								<Button type="button" onclick={addReward} variant="secondary" disabled={!!bounty}>
									Add Tier
								</Button>
								<p class="text-sm text-gray-400">
									Total bounty amount:
									<span class="font-semibold">
										{rewards.reduce((acc, reward) => acc + parseInt(reward.amount), 0)}
										{tokenId ? ` ${tokens.find((token) => token.id === tokenId)?.symbol}` : ''}
									</span>
								</p>
							</div>
						</div>
					{/snippet}
				</div>
			</div>
		</form>
	</div>
</div>
