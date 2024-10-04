import { Carta } from 'carta-md';
import DOMPurify from 'isomorphic-dompurify';
import { math } from '@cartamd/plugin-math';
import { code } from '@cartamd/plugin-code';
import { attachment } from '@cartamd/plugin-attachment';
import { anchor } from '@cartamd/plugin-anchor';

export const carta = new Carta({
	sanitizer: DOMPurify.sanitize,
	theme: 'github-light',
	shikiOptions: {
		themes: ['github-light']
	},

	extensions: [
		math(),
		code(),
		attachment({
			upload: async (file) => {
				const formData = new FormData();
				formData.append('file', file);

				const res = await fetch('/api/files', {
					method: 'POST',
					body: formData
				});

				if (res.ok) {
					const { url } = await res.json();

					return url;
				} else {
					throw new Error('Failed to upload attachment');
				}
			}
		}),
		anchor()
	]
});
