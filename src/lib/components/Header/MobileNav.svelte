<script lang="ts">
	import { blur } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { Menu, X } from 'lucide-svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';

	let open = false;
</script>

<button class="md:hidden cursor-pointer p-2" onclick={() => (open = !open)}>
	<Menu />
</button>

{#if open}
	<div
		class="fixed inset-y-0 left-0 w-full md:w-2/5 lg:max-w-sm w-full max-w-full bg-white dark:bg-gray shadow-lg z-50 overflow-y-auto flex flex-col p-4"
		transition:blur={{ duration: 300, easing: quintOut }}
	>
		<button class="self-end text-gray-700 p-2" onclick={() => (open = false)}> <X /></button>
		<div class="flex flex-col gap-4">
			<div>
				<div class="flex items-center gap-2"></div>
				<ul class="mt-4 space-y-4">
					<li>
						<LinkButton variant="transparent" href="/app">Bounties</LinkButton>
					</li>

					<li>
						<LinkButton variant="transparent" href="/app/how-it-works">How It Works</LinkButton>
					</li>

					<li>
						<LinkButton variant="transparent" href="/app/sponsors">Sponsors</LinkButton>
					</li>
				</ul>
			</div>
		</div>
	</div>
{/if}
