<script lang="ts">
	import type { PageData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import BountyForm from '$lib/components/BountyForm.svelte';

	const { data }: { data: PageData } = $props();

	function enhanceSubmit(
		requiredSkills: number[],
		_: number | null,
		tokenId: number | null,
		rewards: { rank: number; amount: string }[]
	): SubmitFunction {
		return ({ formData }) => {
			requiredSkills.forEach((skillId) => {
				formData.append(`skills[]`, skillId.toString());
			});

			rewards.forEach((reward) => {
				formData.append(`rewards[]`, reward.amount.toString());
			});

			formData.append(`tokenId`, tokenId?.toString() ?? '');

			return async ({ result }) => {
				if (result.type === 'success') goto('/app/dashboard/sponsor/bounties');
			};
		};
	}
</script>

<BountyForm
	tokens={data.tokens}
	skills={data.skills}
	chains={data.chains}
	{enhanceSubmit}
	action="?/createBounty"
/>
