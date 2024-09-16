<script lang="ts">
	const { image }: { image?: string } = $props();
</script>

<img
	src={image || '/images/placeholder-profile-image.webp'}
	alt="User's profile"
	class="w-9 h-9 rounded-full"
/>
