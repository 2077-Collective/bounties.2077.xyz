import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid';

// TODO: should throw if not image
export async function uploadImage(image: File): Promise<string> {
	if (image.size > 4 * 1024 * 1024) {
		throw new Error('Image too large');
	}

	const { url } = await put(nanoid(10), image, {
		access: 'public',
		token: BLOB_READ_WRITE_TOKEN
	});

	return url;
}

export async function uploadAnyFile(file: File): Promise<string> {
	if (file.size > 4 * 1024 * 1024) {
		throw new Error('Image too large');
	}

	const { url } = await put(nanoid(10), file, {
		access: 'public',
		token: BLOB_READ_WRITE_TOKEN
	});

	return url;
}
