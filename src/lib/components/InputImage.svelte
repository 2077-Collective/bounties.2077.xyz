<script lang="ts">
	import { PencilLine } from 'lucide-svelte';
	import ProfileImage, { type ProfileImageProps } from '$lib/components/ProfileImage.svelte';

	interface InputImageProps extends ProfileImageProps {
		edit?: boolean;
		name?: string;
		value?: File[];
	}

	let { image, name, size = '90px', value = $bindable([]) }: InputImageProps = $props();
	let input: HTMLInputElement | null = $state(null);
	let tempImage = $state('');

	const handleFileUpload = () => {
		const file = input?.files?.[0];

		if (file) {
			// Update the local image preview with the file URL
			tempImage = URL.createObjectURL(file);
			// Update the value with the selected file
			value = [file];
		}
	};
</script>

<button
	onclick={(e) => {
		e.preventDefault();
		e.stopPropagation();
		input?.click();
	}}
>
	<div class="relative group w-fit cursor-pointer">
		<ProfileImage image={tempImage || image} {size} />

		<div class="hidden group-hover:block transition-all absolute top-0 -right-2">
			<div class="bg-white rounded-full border border-gray-300 p-2">
				<PencilLine class="right-0 w-4 h-4" />
			</div>
		</div>
	</div>
</button>

<!-- Do not bind value, only bind this reference to the input -->
<input
	type="file"
	{name}
	class="hidden"
	accept="image/*"
	bind:this={input}
	onchange={handleFileUpload}
/>
