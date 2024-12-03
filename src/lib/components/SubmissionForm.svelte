<script lang="ts">
	import { cn } from '$lib/utils';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import StepForm from './StepForm.svelte';
	import { File as FileIcon, Link, Trash2 } from 'lucide-svelte';
	import TextArea from './TextArea.svelte';
	import TabCard from './TabCard.svelte';
	import { getAccount } from '$lib/stores/account.svelte';
	import type { EnhancedBounty, EnhancedSubmission } from '$lib/types';
	import type { SubmitFunction } from '@sveltejs/kit';

	const {
		bountyTitle,
		bountyId,
		rewards,
		onsuccess
	}: {
		bountyTitle: string;
		bountyId: number;
		rewards: EnhancedBounty['rewards'];
		onsuccess?: (submission: EnhancedSubmission) => void;
	} = $props();

	// Form data related state variables
	let files: File[] = $state([]);
	let links: string[] = $state([]);
	let details = $state('');
	let altWalletAddress = $state('');
	let walletAddress = getAccount()?.users.walletAddress;
	let useAltWallet = $state(false);

	let inputFile: HTMLInputElement | null = $state(null);
	let dragOver = $state(false);

	const handleFileUpload = () => {
		if (!inputFile || !inputFile.files) return;
		files = Array.from(inputFile.files);
	};

	const removeFile = (index: number) => {
		if (!inputFile) return;

		files = files.filter((_, i) => i !== index);

		const { files: currentFiles } = inputFile;
		if (!currentFiles) return;

		const dt = new DataTransfer();
		Array.from(currentFiles).forEach((file, i) => {
			if (index !== i) dt.items.add(file);
		});

		inputFile.files = dt.files;
	};

	const removeLink = (index: number) => {
		links = links.filter((_, i) => i !== index);
	};

	const onsubmit: SubmitFunction = ({ formData }) => {
		if (!walletAddress) throw new Error('Wallet address is required to submit the entry');

		formData.append('details', details);
		formData.append('recipientWallet', useAltWallet ? altWalletAddress : walletAddress);
		formData.append('bountyId', bountyId.toString());

		files.forEach((file) => formData.append('files[]', file));
		links.forEach((link) => formData.append('links[]', link));

		return ({ result }) => {
			if (result.type === 'success') {
				if (onsuccess) {
					if (!result?.data?.submission) throw new Error('Submission data not found');

					onsuccess(result.data.submission);
				}
			}
		};
	};
</script>

<StepForm steps={[filesAndMessage, walletAddressAndOverview]} action="?/submitEntry" {onsubmit} />

{#snippet header()}
	<div class="flex flex-col gap-4 w-[600px]">
		<div class="flex flex-col gap-1">
			<h3 class="text-lg font-semibold">Submit your entry</h3>
			<p class="text-gray-500">{bountyTitle}</p>
		</div>
		<hr />
	</div>
{/snippet}

{#snippet filesAndMessage()}
	<div class="flex flex-col gap-6">
		{@render header()}

		<!-- File upload -->
		<button
			class={cn(
				'flex flex-col items-center justify-center border-2 border-dashed w-full h-36 rounded-lg hover:bg-violet-100 hover:border-violet-600 transition-all cursor-copy relative',
				`border-${dragOver ? 'violet-600' : 'slate-600'} bg-${dragOver ? 'violet-100' : 'slate-50'}`
			)}
			type="button"
			ondragover={() => (dragOver = true)}
			ondragleave={() => (dragOver = false)}
			ondrop={() => (dragOver = false)}
		>
			<p class="font-500 mb-2">Drop your files here or <span class="underline">browse</span></p>
			<p class="text-xs text-gray-400">TODO: add supported file types and sizes</p>
			<input
				type="file"
				multiple
				onchange={handleFileUpload}
				bind:this={inputFile}
				class="bg-red-500 absolute w-full h-full opacity-0 cursor-copy"
			/>
		</button>

		<div class="flex flex-col">
			<!-- File list -->
			{#if files.length > 0}
				<div class="flex flex-col" class:mb-4={links.length === 0}>
					{#each files as file, index}
						<div class="flex justify-between items-center py-2 border-b">
							<div class="flex gap-5 items-center">
								<FileIcon class="h-8 w-8" />
								<div class="flex flex-col gap-1">
									<p class="text-sm font-500">{file.name}</p>
									<p class="text-xs text-gray-400">{file.size} bytes</p>
								</div>
							</div>
							<button
								onclick={() => removeFile(index)}
								class="bg-slate-200 rounded-lg p-2 hover:bg-slate-300 transition-colors"
							>
								<Trash2 class="h-4 w-4 text-gray-700" />
							</button>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Links list -->
			{#if links.length > 0}
				<div class="flex flex-col mb-4">
					{#each links as _, index}
						<div class="flex items-center gap-3 py-3 border-b">
							<div class="flex gap-5 items-center flex-grow">
								<Link class="h-5 w-5" />
								<Input bind:value={links[index]} class="p-1 flex-grow" type="url" />
							</div>
							<button
								onclick={() => removeLink(index)}
								class="bg-slate-200 rounded-lg p-2 hover:bg-slate-300 transition-colors"
								type="button"
							>
								<Trash2 class="h-4 w-4 text-gray-700" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
			<Button variant="secondary" onclick={() => links.push('')}>
				{links.length > 0 ? 'Add another link' : 'Add a link'}
			</Button>
		</div>
		<div class="flex flex-col gap-2">
			<label class="text-sm" for="notesAndInstructions">Additional notes and instructions</label>
			<TextArea name="notesAndInstructions" bind:value={details} />
		</div>
	</div>
{/snippet}

{#snippet walletAddressAndOverview()}
	<div class="flex flex-col gap-6">
		{@render header()}
		<div>
			<p class="font-medium mb-1">About your payment</p>
			<p class="text-sm">
				Should you come out on top of this bounty we realy like to make sure the funds are sent to
				the right address. Please triple-check carefuly.
			</p>
		</div>
		{#snippet accountAddress()}
			<div>
				<label for="walletAddress" class="mb-3 font-medium text-sm block">Payment address</label>
				<Input class="w-full" name="walletAddress" disabled value={walletAddress} />
			</div>
		{/snippet}
		{#snippet differentAddress()}
			<div>
				<label for="walletAddress" class="mb-3 font-medium text-sm block">Payment address</label>
				<Input name="walletAddress" class="w-full" bind:value={altWalletAddress} />
			</div>
		{/snippet}
		<TabCard
			labels={['Use account address', 'Use different address']}
			onchange={(activeTab) => (useAltWallet = !!activeTab)}
			contents={[accountAddress, differentAddress]}
		/>
		<div class="p-4 bg-gray-100 rounded-lg">
			<h2 class="font-medium">Overview</h2>

			<div class="flex justify-between items-center py-2">
				<p class="text-sm text-gray-500">Amount</p>
				<div class="flex justify-center">
					{#if rewards.length > 1}
						{@const firstReward = rewards[0]}
						{@const lastReward = rewards[rewards.length - 1]}
						<span> From </span>
						<div class="flex">
							<img src={firstReward.token.logo} class="w-5 h-5" alt={firstReward.token.symbol} />
							<p class="font-medium">{firstReward.amount} {firstReward.token.symbol}</p>
						</div>

						<span>to</span>
						<div class="flex justify-center">
							<img src={lastReward.token.logo} class="w-5 h-5" alt={lastReward.token.symbol} />
							<p class="font-medium">{lastReward.amount} {lastReward.token.symbol}</p>
						</div>
					{:else}
						{@const firstReward = rewards[0]}
						<div class="flex items-center gap-2">
							<img src={firstReward.token.logo} class="w-5 h-5" alt={firstReward.token.symbol} />
							<p class="font-medium">{firstReward.amount} {firstReward.token.symbol}</p>
						</div>
					{/if}
				</div>
			</div>
			<hr />

			<div class="flex justify-between items-center py-2">
				<p class="text-sm text-gray-500">To</p>
				<p class="font-medium">
					{useAltWallet ? altWalletAddress : walletAddress}
				</p>
			</div>
			<hr />

			<div class="flex justify-between items-center py-2">
				<p class="text-sm text-gray-500">Network</p>
				<div class="flex justify-center font-medium">
					{rewards[0].token.chainId}
				</div>
			</div>
			<hr />

			<p class="text-sm text-gray-500 text-center mt-4">
				You can expect the claim within 7 days after winning the bounty.
			</p>
		</div>
	</div>
{/snippet}
