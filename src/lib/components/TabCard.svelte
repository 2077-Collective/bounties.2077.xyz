<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Card } from './Card';

	interface Props {
		title: string;
		labels: string[];
		active?: number;
		disabled?: boolean;
		// This allows the component to accept any #snippet as a child.
		// If you have a better solution, please make a PR.
		[key: string]: Snippet | string | string[] | number | undefined | boolean;
	}

	const { title, labels, active = 1, disabled, ...restProps }: Props = $props();

	let activeTab = $state(active);
	const childs = $derived(Object.values(restProps).filter((f) => typeof f === 'function'));
	const activeContent: Snippet = $derived(childs[activeTab]);
</script>

<Card>
	<h2 class="text-xl mb-4">{title}</h2>

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
					: `bg-gray-100 text-gray-700 ${disabled ? '' : 'hover:bg-gray-200'}`}"
			>
				{label}
			</button>
		{/each}
	</div>

	<div class="space-y-4">
		{@render activeContent()}
	</div>
</Card>
