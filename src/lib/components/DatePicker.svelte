<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button';
	import { RangeCalendar } from '$lib/components/ui/range-calendar';
	import * as Popover from '$lib/components/ui/popover';
	import type { DateRange } from 'bits-ui';

	const df = new DateFormatter('en-US', {
		dateStyle: 'short'
	});

	export let value: DateRange | undefined;
	export let placeholder: string = 'Select a date';
</script>

<Popover.Root openFocus>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(
				'justify-start text-left font-normal rounded-lg',
				!value && 'text-muted-foreground'
			)}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{value?.start && value?.end
				? `${df.format(value.start.toDate(getLocalTimeZone()))} - ${df.format(value.end.toDate(getLocalTimeZone()))}`
				: placeholder}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<RangeCalendar bind:value initialFocus />
	</Popover.Content>
</Popover.Root>
