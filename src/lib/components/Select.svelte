<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronDown, Search } from 'lucide-svelte';

	interface Option {
		value: string | number;
		label: string;
	}

	interface Props {
		options: Option[];
		placeholder?: string;
		onchange: (selectedOption: Option | null) => void;
		name?: string;
		id?: string;
		value?: Option;
		disabled?: boolean;
	}

	const {
		options,
		placeholder = 'Select an option',
		onchange,
		name,
		id,
		value,
		disabled
	}: Props = $props();

	let isOpen = $state(false);
	let searchTerm = $state('');
	let selectedOption: Option | undefined = $state(value);
	let dropdownRef: HTMLDivElement;

	const filteredOptions: Option[] = $derived(
		options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				isOpen = false;
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	function handleSelect(option: Option) {
		selectedOption = option;
		onchange(option);
		isOpen = false;
	}
</script>

<div class="relative w-full" bind:this={dropdownRef} {id}>
	<select {name} class="hidden" bind:value={selectedOption}>
		{#each options as option}
			<option value={option}>{option.label}</option>
		{/each}
	</select>

	<button
		class={`w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
		type="button"
		onclick={() => (isOpen = !isOpen)}
		{disabled}
		class:cursor-not-allowed={disabled}
	>
		<div class="flex items-center justify-between">
			<span class="block truncate">
				{selectedOption ? selectedOption.label : placeholder}
			</span>
			<ChevronDown class="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
		</div>
	</button>

	{#if isOpen}
		<div class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
			<div class="px-3 py-2">
				<div class="flex items-center bg-gray-100 rounded-md">
					<Search class="w-5 h-5 ml-2 text-gray-400" />
					<input
						type="text"
						class="w-full px-2 py-1 bg-transparent border-none focus:ring-0 focus:outline-none"
						placeholder="Search..."
						bind:value={searchTerm}
					/>
				</div>
			</div>
			<ul class="py-1 overflow-auto max-h-60" role="listbox">
				{#each filteredOptions as option (option.value)}
					<li
						class="px-3 py-2 cursor-pointer hover:bg-blue-100"
						onclick={() => handleSelect(option)}
						onkeydown={(e) => e.key === 'Enter' && handleSelect(option)}
						role="option"
						tabindex="0"
						aria-selected={selectedOption?.value === option.value}
					>
						{option.label}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
