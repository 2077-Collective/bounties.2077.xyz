<script lang="ts" module>
	export interface BadgeOption {
		name: string;
		id: string | number;
	}
</script>

<script lang="ts">
	import { Search, ChevronDown } from 'lucide-svelte';
	import Badge from './Badge.svelte';
	import Input from './Input.svelte';
	import Button from './Button.svelte';

	interface BadgeSelectProps {
		options: BadgeOption[];
		onchange: (selected: BadgeOption['id'][]) => void;
	}

	const { options, onchange }: BadgeSelectProps = $props();
	let selectedBadges = $state<BadgeOption['id'][]>([]);
	let searchTerm = $state('');
	let showAll = $state(false);
	let filteredOptions = $derived(
		searchTerm
			? options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))
			: options
	);

	function toggleOption(id: BadgeOption['id']) {
		const badge = options.find((option) => option.id === id);

		if (badge) {
			if (selectedBadges.includes(badge.id)) {
				selectedBadges = selectedBadges.filter((id) => id !== badge.id);
			} else {
				selectedBadges = [...selectedBadges, badge.id];
			}
		}

		if (onchange) onchange(selectedBadges);
		searchTerm = '';
	}
</script>

<div class="flex flex-col gap-4 max-h-screen">
	<Input bind:value={searchTerm} placeholder="Look for your skills">
		{#snippet icon()}
			<Search class="w-5 text-gray-400" />
		{/snippet}
	</Input>
	<div
		class="flex flex-wrap gap-2 overflow-hidden overflow-y-auto transition-max-height duration-500 ease-in-out"
		style:max-height={showAll ? '35vh' : '120px'}
	>
		{#each filteredOptions as option}
			<Badge
				variant={selectedBadges.includes(option.id) ? 'info' : 'transparent'}
				onclick={() => toggleOption(option.id)}
			>
				{option.name}
			</Badge>
		{/each}
	</div>
	<div class="flex flex-col justify-center items-center">
		<Button onclick={() => (showAll = !showAll)} variant="transparent" class="gap-1">
			<div class:rotate-180={showAll} class="transition-all">
				<ChevronDown class="w-4 h-4 text-gray-400" />
			</div>
			<span class="text-gray-400 text-sm">
				{showAll ? 'Show less' : 'Show all'}
			</span>
		</Button>
	</div>
</div>

<style>
	/* Custom transition for max-height */
	.transition-max-height {
		transition: max-height 0.3s ease-in-out; /* Adjust the duration as needed */
	}
</style>
