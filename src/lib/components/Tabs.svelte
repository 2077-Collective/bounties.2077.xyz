<script lang="ts">
	import { type Snippet } from 'svelte';

	const {
		tabTitles,
		tabs
	}: {
		tabTitles: string[];
		tabs: Snippet[];
	} = $props();

	let activeTab = $state(0);
</script>

<div class="w-full flex flex-col gap-6 md:gap-10">
	<ul class="flex border-b border-gray-200">
		{#each tabTitles as tab, index}
			<li class="mr-4">
				<button
					class={`p-2 text-sm font-medium hover:text-gray-800 focus:outline-none ${
						activeTab === index ? 'border-b-2 border-black text-black' : 'text-gray-500'
					}`}
					onclick={() => (activeTab = index)}
				>
					{tab}
				</button>
			</li>
		{/each}
	</ul>
	<div>
		{@render tabs[activeTab]()}
	</div>
</div>
