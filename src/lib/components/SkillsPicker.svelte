<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import type { SelectSkill } from '$lib/types';
	import Badge from './Badge.svelte';
	import { PlusCircle } from 'lucide-svelte';
	import Input from './Input.svelte';

	let {
		skills,
		value = $bindable([])
	}: {
		skills: SelectSkill[];
		value: number[];
	} = $props();
	let searchTerm = $state('');
	const filteredSkills = $derived(
		skills.filter((skill) => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const handleSkillClick = (skillId: number) => {
		searchTerm = '';

		// Toggles skill from the list
		if (value.includes(skillId)) {
			value = value.filter((id) => id !== skillId);
		} else {
			value = [...value, skillId];
		}
	};
</script>

<Popover.Root openFocus>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn('justify-start text-left font-normal rounded-lg')}
			builders={[builder]}
		>
			<PlusCircle class="mr-2 h-4 w-4" />
			Skills
		</Button>
	</Popover.Trigger>
	<Popover.Content class="max-w-[280px]">
		<Input class="h-8 w-full mb-4" bind:value={searchTerm} />
		<div class="flex flex-wrap gap-2">
			{#each filteredSkills as skill}
				<Badge
					variant={value.includes(skill.id) ? 'default' : 'transparent'}
					onclick={() => handleSkillClick(skill.id)}
				>
					{skill.name}
				</Badge>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
