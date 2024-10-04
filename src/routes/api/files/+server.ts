import { uploadAnyFile } from '$lib/server/services/upload-files';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	const formData = await event.request.formData();
	const file = formData.get('file');

	if (!(file instanceof File)) throw error(400, { message: 'No file uploaded' });

	console.log({
		file
	});

	const url = await uploadAnyFile(file);

	return json({ url });
};
