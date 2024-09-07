<script lang="ts">
	import { SubmissionState, type EnhancedBounty } from '$lib/types';
	import Badge, { type Variant as BadgeVariant } from './Badge.svelte';

	type BountyStatus = 'draft' | 'open' | 'review' | 'closed';

	const StatusToBadge: Record<BountyStatus, { variant: BadgeVariant; label: string }> = {
		draft: { variant: 'info', label: 'Draft' },
		open: { variant: 'success', label: 'Open' },
		review: { variant: 'danger', label: 'Reviews submissions' },
		closed: { variant: 'default', label: 'Closed' }
	};

	const {
		bounty
	}: {
		bounty: EnhancedBounty;
	} = $props();

	const status: BountyStatus = $derived.by(() => {
		if (bounty.draft) return 'draft';

		const today = new Date();
		const startDate = new Date(bounty.startDate);
		const endDate = new Date(bounty.endDate);

		if (startDate > today && endDate > today && !bounty.draft) return 'open';

		const hasUnreviewedSubmissions = bounty.submissions.some(
			(submission) => submission.state === SubmissionState.Unreviewed
		);

		if (hasUnreviewedSubmissions) return 'review';

		if (endDate < today) return 'closed';

		return 'closed';
	});
</script>

<Badge variant={StatusToBadge[status].variant} class="text-sm">
	{StatusToBadge[status].label}
</Badge>
