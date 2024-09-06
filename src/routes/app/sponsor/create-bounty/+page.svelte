<script lang="ts">
	import { CardContent } from '$lib/components/Card/index';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import type { PageData } from './$types';
	import CategorySelector from '$lib/components/CategorySelector.svelte';
	import TabCard from '$lib/components/TabCard.svelte';
	import Select from '$lib/components/Select.svelte';
	import { 
		Trash2
	} from 'lucide-svelte'
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	const { data }: { data: PageData; } = $props();

	// TODO: remove all variables below. Should Leave only skills and rewards
	let title = $state('');
	let description = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let excerpt = $state('');
	let skills: number[] = $state([]);
	let rewards: { rank: number; amount: number }[] = $state([{ rank: 1, amount: 0 }]);
	let paymentChain: number | null = $state(null);
	let availableTokens = $derived(paymentChain === null ? [] : data.tokens.filter((token) => token.chainId === paymentChain));
	let tokenId: number | null = $state(null);

	function addReward() {
		const newRank = rewards.length + 1;
		rewards = [...rewards, { rank: newRank, amount: 0 }];
	}

	function removeReward(index: number) {
		rewards = rewards.filter((_, i) => i !== index);
		// Update ranks after removal
		rewards = rewards.map((reward, index) => ({ ...reward, rank: index + 1 }));
	}

	const enhanceSubmit: SubmitFunction = ({ formData }) => {
		skills.forEach((skillId) => {
			formData.append(`skills[]`, skillId.toString());
		});

		rewards.forEach((reward) => {
			formData.append(`rewards[]`, reward.amount.toString());
		});

		formData.append(`tokenId`, tokenId?.toString() ?? '');

		return async ({ result }) => {
			if (result.type === 'success') goto('/app/sponsor');
		};
	};
</script>

<div class="container mx-auto px-4 py-8">
	<CardContent>
		<form method="POST" action="?/createBounty" use:enhance={enhanceSubmit} class="space-y-6 max-w-2xl mx-auto">
			<div class="flex flex-col gap-2">
				<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
				<p class="text-xs text-gray-400">Make sure it’s concise and descriptive</p>
				<Input type="text" id="title" name="title" bind:value={title} required />
			</div>

			<div class="flex flex-col gap-2">
				<label for="title" class="block text-sm font-medium text-gray-700">Excerpt</label>
				<p class="text-xs text-gray-400">The project description in a nutshell</p>
				<Input type="text" id="excerpt" name="excerpt" bind:value={excerpt} required />
			</div>

			<div class="flex flex-col gap-2">
				<label class="block text-sm font-medium text-gray-700">Categories</label>
				<CategorySelector 
					availableCategories={data.skills}
					onchange={(categories) => {
						skills = categories.map(category => Number(category.id))
					}}
				/>
				<p class="text-xs text-gray-400">Multiple categories possible.</p>
			</div>

			<div class="flex flex-col gap-2">
				<label for="description" class="block text-sm font-medium text-gray-700">Briefing</label>
				<TextArea
					id="description"
					name="description"
					bind:value={description}
					required
					rows="4"
				/>
			</div>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div class="flex flex-col gap-2">
					<label for="startDate" class="block text-sm font-medium text-gray-700">
						Start Date
					</label>
					<p class="text-xs text-gray-400">The date when the bounty will be available</p>
					<Input type="date" id="startDate" name="startDate" bind:value={startDate} required />
				</div>

				<div class="flex flex-col gap-2">
					<label for="startDate" class="block text-sm font-medium text-gray-700">End Date</label>
					<p class="text-xs text-gray-400">Deadline for submissions</p>
					<Input type="date" id="endDate" name="endDate" bind:value={endDate} required />
				</div>
			</div>

			<div>
				<TabCard labels={['Winner takes all', 'Multiple winners']} title="Rewards">
					{#snippet winnerTakesAll()}
						<div class="flex flex-col gap-6 w-full">
							<div class="flex flex-col gap-2">
								<label class="block text-sm font-medium text-gray-700"> Payment network </label>
								<Select
									options={data.chains.map((chain) => ({ label: chain.name, value: chain.id }))}
									onchange={(option) => {
										if (option) {
											paymentChain = Number(option.value);
										}
									}}
									name="paymentChain"
									id="paymentChain"
								/>
							</div>
							<div class="flex gap-6">
								<div class="w-full flex flex-col gap-2">
									<label class="block text-sm font-medium text-gray-700">Currency</label>
									<Select
										options={availableTokens.map((token) => ({ label: token.symbol, value: token.id }))}
										onchange={(option) => {
											if (option) {
												tokenId = Number(option.value);
											}
										}}
										name="tokenId"
										id="tokenId"
									/>
								</div>
								<div class="w-full flex flex-col gap-2">
									<label class="block text-sm font-medium text-gray-700">Amount</label>
									<Input
										type="number"
										id="reward"
										name="reward"
										bind:value={rewards[0].amount}
										required
									/>
								</div>
							</div>
						</div>
					{/snippet}

					{#snippet multipleWinners()}
						<div class="flex flex-col gap-6 w-full">
							<div class="flex flex-col gap-2">
								<label class="block text-sm font-medium text-gray-700">Payment network</label>
								<Select
									options={data.chains.map((chain) => ({ label: chain.name, value: chain.id }))}
									onchange={(option) => {
										if (option) {
											paymentChain = Number(option.value);
										}
									}}
									name="paymentChain"
									id="paymentChain"
								/>
							</div>

							<div class="flex flex-col gap-2">
								<label class="block text-sm font-medium text-gray-700">Currency</label>
								<Select
									options={availableTokens.map((token) => ({ label: token.symbol, value: token.id }))}
									onchange={(option) => {
										if (option) {
											tokenId = Number(option.value);
										}
									}}
									name="tokenId"
									id="tokenId"
								/>
							</div>

							<div class="flex flex-col border border-gray-200 px-4 rounded-md">
								{#each rewards as reward, index (reward.rank)}
									<div 
										class="flex gap-4 items-end justify-between items-center py-4" 
										class:border-b={index !== rewards.length - 1}
									>
										<p class="block text-sm font-medium">
											{index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`} Place
										</p>

										<div class="w-1/2 flex gap-2">
											<Input
												type="number"
												bind:value={reward.amount}
												class="text-right"
												required
											/>
											<Button type="button" onclick={() => removeReward(index)} disabled={rewards.length === 1} variant="secondary">
												<Trash2 size={16} />
											</Button>
										</div>
									</div>
								{/each}
							</div>

							<div class="flex justify-between">
								<Button type="button" onclick={addReward} variant="secondary">Add Tier</Button>
								<p class="text-sm text-gray-400">
									Total bounty amount:
									<span class="font-semibold">
										{rewards.reduce((acc, reward) => acc + reward.amount, 0)}
										{tokenId ? ` ${data.tokens.find((token) => token.id === tokenId)?.symbol}` : ''}
									</span>
								</p>
							</div>
						</div>
					{/snippet}
				</TabCard>
			</div>

			<div>
				<Button type="submit">Create Bounty</Button>
			</div>
		</form>
	</CardContent>
</div>
