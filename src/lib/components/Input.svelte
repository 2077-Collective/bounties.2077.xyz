<script lang="ts">
	const Variant = {
		regular: 'px-3 py-2',
		small: 'px-2 py-1'
	} as const;

	let {
		class: className,
		id,
		name,
		type,
		value = $bindable(''),
		required = false,
		placeholder,
		min,
		disabled = false,
		variant = 'regular'
	}: {
		value: string | number;
		class?: string;
		id?: string;
		name?: string;
		type?: string;
		required?: boolean;
		placeholder?: string;
		min?: string;
		disabled?: boolean;
		variant?: keyof typeof Variant;
	} = $props();
</script>

<input
	type={type || 'text'}
	{id}
	{name}
	bind:value
	{required}
	{placeholder}
	{min}
	{disabled}
	class={`w-full ${Variant[variant]} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
/>
