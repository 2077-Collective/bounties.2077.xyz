<script lang="ts">
	import { PencilLine } from 'lucide-svelte';
	import ProfileImage, { type ProfileImageProps } from '$lib/components/ProfileImage.svelte';

	interface InputImageProps extends ProfileImageProps {
		edit?: boolean;
		name?: string;
		value?: string;
	}

	const { image, name, size = '90px', value = $bindable('') }: InputImageProps = $props();
	console.log('value', image);
	let input: HTMLInputElement | null = $state(null);
	let tempImage = $state('');

	const handleFileUpload = () => {
		const file = input?.files?.[0];

		if (file) {
			tempImage = URL.createObjectURL(file);
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

<input
	type="file"
	{name}
	class="hidden"
	accept="image/*"
	bind:this={input}
	onchange={handleFileUpload}
/>
