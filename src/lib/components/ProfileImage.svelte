<script lang="ts">
	const { image, size = '36px' }: { image?: string; size?: string } = $props();
</script>

<img
	src={image || '/images/placeholder-profile-image.webp'}
	alt="User's profile"
	class="rounded-full"
	style:width={size}
	style:height={size}
/>
