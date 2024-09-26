<script lang="ts">
	let {
		class: className,
		id,
		name,
		value = $bindable(''),
		required,
		placeholder,
		rows
	} = $props<{
		value?: string;
		class?: string;
		id?: string;
		name?: string;
		type?: string;
		required?: boolean;
		placeholder?: string;
		min?: string;
		rows?: string;
	}>();
</script>

<textarea
	{id}
	{name}
	bind:value
	{required}
	{placeholder}
	{rows}
	class={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 ${className}`}
></textarea>
