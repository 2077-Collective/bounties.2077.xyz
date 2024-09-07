<script lang="ts">
	import type { SelectBounty } from '$lib/types';

	const { bounties }: { bounties: SelectBounty[] } = $props();
</script>

{#each bounties as bounty}
	<div class="flex flex-col gap-2">
		<div class="flex flex-row gap-2">
			<h3>{bounty.title}</h3>
		</div>
		<p>{bounty.excerpt}</p>
	</div>
{/each}
