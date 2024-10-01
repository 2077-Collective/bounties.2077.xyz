<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { fly } from 'svelte/transition'; // Use fly transition
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';

	const {
		steps,
		class: className,
		action,
		onsubmit
	}: { steps: Snippet[]; class?: string; action: string; onsubmit: SubmitFunction } = $props();

	let currentStep = $state(0);
	let isTransitioning = false;
	let direction = $state('left'); // Track direction of slide

	function nextStep() {
		if (currentStep < steps.length - 1 && !isTransitioning) {
			isTransitioning = true;
			direction = 'left'; // Set the direction for slide forward
			currentStep += 1;
		}
	}

	function previousStep() {
		if (currentStep > 0 && !isTransitioning) {
			isTransitioning = true;
			direction = 'right'; // Set the direction for slide backward
			currentStep -= 1;
		}
	}
</script>

<form
	class={`h-full relative rounded p-8  border flex flex-col gap-6 ${className}`}
	{action}
	method="POST"
	use:enhance={onsubmit}
>
	<div class="h-1 w-full bg-accent rounded-lg">
		<div
			class="h-full bg-black rounded-lg transition-all"
			style:width={`${((currentStep + 1) / steps.length) * 100}%`}
		></div>
	</div>

	<div class="w-full h-full items-center justify-center">
		<div class="w-full bg-white-lg overflow-hidden flex">
			{#key currentStep}
				<div
					in:fly={{ x: direction === 'left' ? 500 : -500, duration: 300 }}
					out:fly={{ x: direction === 'left' ? -500 : 500, duration: 300 }}
					onoutroend={() => (isTransitioning = false)}
				>
					{@render steps[currentStep]()}
				</div>
			{/key}
		</div>
	</div>

	<div>
		<div class="flex justify-between w-full">
			<div class:invisible={currentStep === 0}>
				<Button variant="secondary" onclick={previousStep}>Previous</Button>
			</div>
			{#if currentStep < steps.length - 1}
				<Button onclick={nextStep} class="px-6">Next</Button>
			{/if}
			{#if currentStep === steps.length - 1}
				<Button type="submit">Submit</Button>
			{/if}
		</div>
	</div>
</form>
