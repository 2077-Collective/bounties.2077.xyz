<script lang="ts" module>
	export interface AmountRange {
		min?: string;
		max?: string;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { PlusCircle } from 'lucide-svelte';
	import Input from './Input.svelte';

	let {
		value = $bindable({
			min: undefined,
			max: undefined
		})
	}: {
		value: { min?: string; max?: string };
	} = $props();
</script>

<Popover.Root openFocus>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn('justify-start text-left font-normal rounded-lg')}
			builders={[builder]}
		>
			<PlusCircle class="mr-2 h-4 w-4" />
			Amount
		</Button>
	</Popover.Trigger>
	<Popover.Content class="max-w-[280px]">
		<div class="flex flex-wrap gap-3">
			<label class="text-sm" for="min">Min. amount</label>
			<Input name="min" type="number" bind:value={value.min} class="h-[36px]" />

			<label class="text-sm" for="max">Max. amount</label>
			<Input name="max" type="number" bind:value={value.max} class="h-[36px]" />
		</div>
	</Popover.Content>
</Popover.Root>
