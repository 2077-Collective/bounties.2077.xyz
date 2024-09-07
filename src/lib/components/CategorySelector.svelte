<script lang="ts">
	import { onMount } from 'svelte';
	import { X, ChevronDown } from 'lucide-svelte';

	interface Category {
		id: string | number;
		name: string;
	}

	const {
		name,
		availableCategories,
		onchange
	}: {
		name: string;
		availableCategories: Category[];
		onchange: (categories: Category[]) => void;
	} = $props();

	let inputElement: HTMLInputElement;
	let dropdownElement = $state<HTMLUListElement | null>(null);
	let categories: Category[] = $state([]);
	let inputValue = $state('');
	let filteredOptions: Category[] = $derived.by(() =>
		availableCategories.filter(
			({ name }) =>
				name.toLowerCase().includes(inputValue.toLowerCase()) &&
				!categories.some((existingCat) => existingCat.name.toLowerCase() === name.toLowerCase())
		)
	);
	let showDropdown = $derived(inputValue !== '' && filteredOptions.length > 0);

	onMount(() => {
		inputElement?.focus();
	});

	function removeCategory(id: string | number) {
		categories = categories.filter((category) => category.id !== id);
		onchange(categories);
	}

	function addCategory(category: Category) {
		const isDuplicate = categories.some(
			(cat) => cat.name.toLowerCase() === category.name.trim().toLowerCase()
		);

		if (category.name.trim() && !isDuplicate) {
			categories = [...categories, category];
			inputValue = '';
			onchange(categories);
		}
	}

	function handleInputKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'Enter':
				if (inputValue.trim()) {
					const category = findCategoryByName(inputValue);
					if (category) {
						addCategory(category);
						e.preventDefault();
					}
				}
				break;

			case 'Backspace':
				if (inputValue === '' && categories.length > 0) {
					removeCategory(categories[categories.length - 1].id);
				}
				break;

			case 'ArrowDown':
				if (showDropdown) {
					e.preventDefault();
					focusFirstDropdownOption();
				}
				break;
		}
	}

	function focusFirstDropdownOption() {
		const firstOption = dropdownElement?.querySelector('button');
		firstOption?.focus();
	}

	function findCategoryByName(name: string): Category | undefined {
		return availableCategories.find(
			(category) => category.name.toLowerCase() === name.toLowerCase()
		);
	}

	function handleOptionClick(option: Category) {
		addCategory(option);
	}

	function handleOptionKeyDown(e: KeyboardEvent, option: Category) {
		e.preventDefault();
		e.stopPropagation();

		const target = e.currentTarget as HTMLButtonElement;
		switch (e.key) {
			case 'Enter':
				addCategory(option);
				inputElement?.focus();
				break;

			case 'ArrowDown':
				e.preventDefault();
				(
					target.closest('li')?.nextElementSibling?.querySelector('button') as HTMLButtonElement
				)?.focus();
				break;

			case 'ArrowUp': {
				e.preventDefault();

				const prevButton = target
					.closest('li')
					?.previousElementSibling?.querySelector('button') as HTMLButtonElement;

				if (prevButton) {
					prevButton.focus();
				} else {
					inputElement?.focus();
				}

				break;
			}
		}
	}
</script>

<div class="relative">
	<div class="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md bg-white">
		{#each categories as category (category.id)}
			<span
				class="flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded-full"
			>
				{category.name}
				<button
					onclick={() => removeCategory(category.id)}
					class="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
					aria-label="Remove {category.name} category"
					type="button"
				>
					<X size={14} />
				</button>
			</span>
		{/each}
		<input
			bind:this={inputElement}
			type="text"
			bind:value={inputValue}
			onkeydown={handleInputKeyDown}
			class="flex-grow min-w-[100px] outline-none text-sm"
			placeholder="Add category"
			{name}
		/>
	</div>
	<button
		class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
		aria-label="Toggle categories dropdown"
	>
		<ChevronDown size={20} />
	</button>
	{#if showDropdown}
		<ul
			bind:this={dropdownElement}
			class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
		>
			{#each filteredOptions as option, index (index)}
				<li tabindex="-1">
					<button
						onclick={() => handleOptionClick(option)}
						onkeydown={(e) => handleOptionKeyDown(e, option)}
						class="w-full text-left focus:bg-gray-100 focus:outline-none px-4 py-2 hover:bg-gray-100"
						type="button"
					>
						{option.name}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
