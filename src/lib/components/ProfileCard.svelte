<script lang="ts" module>
	export interface ProfileCardProps {
		title: string;
		value?: string | number | null;
	}
</script>

<script lang="ts">
	const { title, value }: ProfileCardProps = $props();
</script>

<div class="flex gap-3 grow border border-gray rounded-lg p-4">
	<div class="w-12 h-12 rounded-lg bg-gray-100"></div>
	<div>
		<p class="font-bold text-xl">{value || '-'}</p>
		<p class="text-sm">{title}</p>
	</div>
</div>
