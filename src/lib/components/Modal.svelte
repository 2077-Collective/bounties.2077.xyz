<script lang="ts">
	import { closeModal, getModal } from '$lib/stores/modal.svelte';
	import { X } from 'lucide-svelte';
	const modal = getModal();
</script>

{#if modal.open && modal.component}
	<div class="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center">
		<div class="bg-white relative z-20 w-11/12 md:w-auto md:max-w-xl rounded-2xl p-8">
			{#if modal.options?.dismissible}
				<button onclick={closeModal} class="absolute right-8 p-2 rounded-full border top-6">
					<X class="w-3 h-3" />
				</button>
			{/if}

			{@render modal.component()}
		</div>
	</div>
{/if}
