<script lang="ts" module>
	export interface ProfileImageProps {
		image?: string | null;
		size?: string;
	}
</script>

<script lang="ts">
	const { image, size = '36px' }: ProfileImageProps = $props();
</script>

<img
	src={image || '/images/placeholder-profile-image.webp'}
	alt="User's profile"
	class="rounded-full"
	style:width={size}
	style:height={size}
/>
