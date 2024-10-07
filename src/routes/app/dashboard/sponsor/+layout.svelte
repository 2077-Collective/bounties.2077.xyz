<script lang="ts">
	import { page } from '$app/stores';
	import { getAccount } from '$lib/stores/account.svelte';
	import { cn } from '$lib/utils';

	interface AccountMenuLinks {
		name: string;
		href: string;
	}

	const BASE_URL = '/app/dashboard/sponsor';
	const getLink = (path: string) => `${BASE_URL}${path}`;

	const accountLinks: AccountMenuLinks[] = [
		{ name: 'Sponsor profile', href: getLink('/edit') },
		{ name: 'Team', href: getLink('/team') },
		{ name: 'Preferences', href: getLink('/preferences') }
	];

	const manageLinks: AccountMenuLinks[] = [
		{ name: 'Bounties', href: getLink('/bounties') },
		{ name: 'Payouts', href: getLink('/payouts') }
	];
</script>

<div>
	<div class="gap-3 border-b border-light py-10 flex flex-col gap-2">
		<h1 class="text-3xl font-600">{getAccount()?.sponsors?.displayName}</h1>
		<p class="text-foreground/60">Manage your account and bounties</p>
	</div>

	<div class="flex w-full py-10 gap-10">
		<div class="w-1/5 flex flex-col gap-2">
			<div>
				<p class="text-foreground/60 py-2">Account</p>
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

			<div class="flex flex-col gap-2">
				<p class="text-foreground/60 py-2">Manage</p>

				<ul class="flex flex-col gap-1">
					{#each manageLinks as link}
						<li
							class={cn(
								'px-3 py-2 hover:bg-foreground/5 transition-colors text-sm rounded-md cursor-pointer',
								link.href === $page.url.pathname && 'bg-foreground/5'
							)}
						>
							<a href={link.href} class="w-full block">
								{link.name}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="w-4/5">
			<slot />
		</div>
	</div>
</div>
