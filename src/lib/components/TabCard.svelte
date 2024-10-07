<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Card } from './Card';

	interface Props {
		title?: string;
		labels: string[];
		active?: number;
		disabled?: boolean;
		onchange?: (activeTab: number) => void;
		contents: Snippet[];
	}

	const { title, labels, active = 0, disabled, onchange, contents }: Props = $props();

	let activeTab = $state(active);
	const activeContent: Snippet = $derived(contents[activeTab]);

	$effect(() => {
		if (onchange) onchange(activeTab);
	});
</script>

<Card>
	{#if title}
		<h2 class="text-xl mb-4">{title}</h2>
	{/if}

	<div class="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-md w-full">
		{#each labels as label, index}
			<button
				type="button"
				{disabled}
				onclick={() => (activeTab = index)}
				class:cursor-not-allowed={disabled}
				class="px-4 py-2 rounded-md w-full text-sm font-medium transition-colors {activeTab ===
				index
					? 'bg-white text-black'
					: `bg-gray-100  ${disabled ? 'text-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}"
			>
				{label}
			</button>
		{/each}
	</div>

	<div class="space-y-4">
		{@render activeContent()}
	</div>
</Card>
