<script lang="ts">
	import BountyList from '$lib/components/BountyList.svelte';
	import Input from '$lib/components/Input.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import { Search } from 'lucide-svelte';
	import type { PageData } from './$types';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import type { DateRange } from 'bits-ui';
	import SkillsPicker from '$lib/components/SkillsPicker.svelte';

	const { data }: { data: PageData } = $props();
	let searchTerm = $state('');
	let selectedSkills: number[] = $state([]);
	let endDateRange: DateRange = $state({
		start: undefined,
		end: undefined
	});

	const statuses = [
		{ value: 'open', label: 'Open' },
		{ value: 'closed', label: 'Closed' }
	];

	const filteredBounties = $derived(
		data.bounties
			.filter((bounty) => bounty.title.toLowerCase().includes(searchTerm.toLowerCase()))
			.filter((bounty) => {
				if (!endDateRange.start || !endDateRange.end) return true;
				return (
					new Date(bounty.endDate) >= endDateRange.start.toDate('utc') &&
					new Date(bounty.endDate) <= endDateRange.end.toDate('utc')
				);
			})
			.filter((bounty) => {
				if (selectedSkills.length === 0) return true;
				return selectedSkills.some((skill) =>
					bounty.bountySkills.some((bountySkill) => bountySkill.skill.id === skill)
				);
			})
	);
</script>

<div class="min-h-screen py-12 flex flex-col gap-10">
	<h2 class="text-3xl font-semibold text-gray-900">Bounties</h2>

	<div class="flex gap-x-[72px] justify-between">
		<div class="sm:px-0 flex flex-col gap-10 w-full">
			<div class="flex gap-2">
				<Input bind:value={searchTerm} placeholder="Search" class="h-[40px]">
					{#snippet icon()}
						<Search class="w-4 h-4 text-gray-400" />
					{/snippet}
				</Input>
				<DatePicker bind:value={endDateRange} placeholder="End date" />
				<SkillsPicker skills={data.skills} bind:value={selectedSkills} />
			</div>
			<BountyList bountyList={filteredBounties} />
		</div>

		<div class="gradient h-80 rounded-lg p-6 flex flex-col justify-between min-w-[282px]">
			<div>
				<p class="text-xl leading-7 font-semibold text-indigo-900">Anyone can create</p>
				<p class="text-xl leading-7 font-semibold text-indigo-900 mb-2">bounties</p>
				<p class="text-sm leading-7 text-indigo-900">Create your first bounty within</p>
				<p class="text-sm leading-7 text-indigo-900">minutes.</p>
			</div>
			<LinkButton href="#" class="justify-center font-normal" variant="white">Learn more</LinkButton
			>
		</div>
	</div>
</div>

<style scoped>
	.gradient {
		background: linear-gradient(0deg, #ebedff, #ebedff),
			radial-gradient(
				53.9% 92.8% at 100% 0%,
				rgba(255, 255, 255, 0.5) 0%,
				rgba(255, 255, 255, 0) 100%
			);
	}
</style>
