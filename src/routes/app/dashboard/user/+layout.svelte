<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet;
	} = $props();

	interface AccountMenuLinks {
		name: string;
		href: string;
	}

	const BASE_URL = '/app/dashboard/user';
	const getLink = (path: string) => `${BASE_URL}${path}`;

	const accountLinks: AccountMenuLinks[] = [
		{ name: 'User profile', href: getLink('/edit') },
		{ name: 'Account', href: getLink('/team') },
		{ name: 'Preferences', href: getLink('/preferences') }
	];
</script>

<div class="lg:px-32">
	<div class="gap-3 border-b border-light py-10 flex flex-col gap-2">
		<h1 class="text-3xl font-600">Settings</h1>
		<p class="text-foreground/60">Manage your account</p>
	</div>

	<div class="flex w-full py-10 gap-10">
		<div class="w-1/5 flex flex-col gap-2">
			<div>
				<ul class="flex flex-col gap-2">
					{#each accountLinks as link}
						<li
							class={cn(
								'px-3 py-2 hover:bg-foreground/5 transition-colors text-sm rounded-md cursor-pointer',
								link.href === $page.url.pathname && 'bg-foreground/5'
							)}
						>
							<a href={link.href} class="w-full">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="w-4/5">
			{@render children()}
		</div>
	</div>
</div>
