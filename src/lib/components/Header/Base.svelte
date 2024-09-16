<script lang="ts">
	import LinkButton from '$lib/components/LinkButton.svelte';
	import Logo from '$lib/components/icons/Logo.svelte';
	import ProfileDropdown from './ProfileDropdown.svelte';
	import MobileNav from './MobileNav.svelte';
</script>

<nav class="border-b border-gray-light">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<MobileNav />

			<div class="flex gap-2 items-center">
				<Logo size="18px" />
				<h1>2077 Bounty</h1>
			</div>
			<div class="hidden md:block">
				<div class="ml-10 flex items-baseline space-x-4">
					<LinkButton variant="transparent" href="/app">Bounties</LinkButton>
					<LinkButton variant="transparent" href="/app/how-it-works">How It Works</LinkButton>
					<LinkButton variant="transparent" href="/app/sponsors">Sponsors</LinkButton>
				</div>
			</div>

			<div>
				<div class="md:flex md:gap-2">
					<LinkButton
						variant="transparent"
						href="/app/sponsor/create-bounty"
						class="hidden md:block"
					>
						Create a bounty
					</LinkButton>
					<ProfileDropdown />
				</div>
			</div>
		</div>
	</div>
</nav>
