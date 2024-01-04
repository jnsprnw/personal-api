import { error, json } from '@sveltejs/kit';
import { fetchEndpoint } from '$lib/strapi.ts';
import { purifyHTML, purifyPlain } from '$lib/purify.ts';
import { to_html } from '$lib/marked.ts';

const VALID_LENGTHS = [150, 100, 50];
const VALID_TYPES = ['plain', 'markdown', 'html'];

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const { length: length_str, type } = params;

	const length = Number(length_str ?? 0);

	if (isNaN(length) || !VALID_LENGTHS.includes(length)) {
		error(400, `Length must be one of the following: ${VALID_LENGTHS.join(', ')}`);
	}

	if (typeof type === 'undefined' || !VALID_TYPES.includes(type)) {
		error(400, `Type must be one of the following: ${VALID_TYPES.join(', ')}`);
	}

	const data = await fetchEndpoint(length);

	if (typeof data === 'undefined' || data === null || !data?.attributes) {
		error(400, `You made a valid request, but no text could be found matching it.`);
	}

	const res = data.attributes;

	const markdown = res.Content;

	const html_raw = to_html(markdown);
	const html = purifyHTML(html_raw);
	const plain = purifyPlain(html);

	let content = markdown;
	if (type === 'html') {
		content = html;
	}
	if (type === 'plain') {
		content = plain;
	}

	return json({
		length: plain.length,
		content,
		updated_at: res.updatedAt
	});
}

/** @type {import('./$types').EntryGenerator} */
export function entries() {
	return VALID_LENGTHS.map((length) =>
		VALID_TYPES.map((type) => ({
			length,
			type
		}))
	)
		.flat()
		.flat();
}

export const prerender = true;
