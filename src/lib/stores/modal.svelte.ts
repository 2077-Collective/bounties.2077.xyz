import type { Snippet } from 'svelte';

interface ModalOptions {
	dismissible: boolean;
}

const modalStore = $state<{
	component: Snippet | null;
	open: boolean;
	options: ModalOptions | null;
}>({
	component: null,
	open: true,
	options: {
		dismissible: true
	}
});

export function openModal(component: Snippet, modalOptions: ModalOptions | null = null) {
	modalStore.open = true;
	modalStore.component = component;

	if (modalOptions) modalStore.options = modalOptions;
}

export function closeModal() {
	modalStore.open = false;
	modalStore.component = null;
}

export function getModal() {
	return modalStore;
}
