<script lang="ts">
	import LinkButton from '$lib/components/LinkButton.svelte';
	import Hamburguer from '$lib/components/icons/Hamburguer.svelte';
	import Button from '$lib/components/Button.svelte';
</script>

<nav class="bg-white shadow-lg">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<div class="flex-shrink-0">
				<h1 class="text-xl font-bold text-gray-800">Weistation</h1>
			</div>
			<div class="hidden md:block">
				<div class="ml-10 flex items-baseline space-x-4">
					<LinkButton variant="transparent" href="/app">Home</LinkButton>
					<LinkButton variant="transparent" href="/app/sponsor">Sponsor</LinkButton>
					<LinkButton variant="transparent" href="/app/preferences">Preferences</LinkButton>
				</div>
			</div>

			<div class="md:hidden">
				<Button>
					<Hamburguer />
					<span class="sr-only">Open main menu</span>
				</Button>
			</div>
		</div>
	</div>
</nav>
