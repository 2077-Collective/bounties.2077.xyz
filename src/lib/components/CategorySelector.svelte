<script lang="ts">
	import { onMount } from 'svelte';
	import { X, ChevronDown } from 'lucide-svelte';

	interface Category {
		id: string | number;
		name: string;
	}

	const {
		availableCategories,
		onchange
	}: {
		availableCategories: Category[];
		onchange: (categories: Category[]) => void;
	} = $props();

	let inputElement: HTMLInputElement;
	let dropdownElement: HTMLUListElement;
	let categories: Category[] = $state([]);
	let inputValue = $state('');
	let filteredOptions: Category[] = $derived.by(() => {
		const filt = availableCategories.filter(
			({ name }) =>
				name.toLowerCase().includes(inputValue.toLowerCase()) &&
				!categories.some((existingCat) => existingCat.name.toLowerCase() === name.toLowerCase())
		);

		console.log(filt);

		return filt;
	});
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
		if (e.key === 'Enter' && inputValue.trim()) {
			const category = findCategoryByName(inputValue);

			if (!category) return;

			// Do nothing if the category is invalid
			addCategory(category);
			e.preventDefault(); // Prevent form submission if within a form
		} else if (e.key === 'Backspace' && inputValue === '' && categories.length > 0) {
			const lastCategory = categories[categories.length - 1];
			removeCategory(lastCategory.id);
		} else if (e.key === 'ArrowDown' && showDropdown) {
			e.preventDefault();
			dropdownElement?.firstElementChild?.focus();
		}
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
		if (e.key === 'Enter') {
			addCategory(option);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			(e.target as HTMLLIElement).nextElementSibling?.focus();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			const prevSibling = (e.target as HTMLLIElement).previousElementSibling;
			if (prevSibling) {
				prevSibling.focus();
			} else {
				inputElement.focus();
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
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						removeCategory(category.id);
					}}
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
				<li
					onkeydown={(e) => handleOptionKeyDown(e, option)}
					class="px-4 py-2 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none"
					tabindex="-1"
				>
					<button onclick={() => handleOptionClick(option)} class="w-full text-left">
						{option.name}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
